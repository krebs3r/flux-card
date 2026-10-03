// ── Interactive Background ───────────────────────────────
// Mouse/touch-reactive fluid simulation (stable fluids on WebGL2),
// with a CSS cursor-glow fallback and the static orbs as last resort.
// Configured via CONTENT.background in content.js.
(function () {
    const bgCanvas = document.querySelector('.bg-canvas');
    if (!bgCanvas) return;

    const USER = (typeof CONTENT !== 'undefined' && CONTENT.background) || {};
    const OPTS = {
        effect: USER.effect || 'fluid',                 // "fluid" | "glow" | "orbs"
        intensity: clamp(Number(USER.intensity ?? 1), 0, 3),
        fadeSeconds: clamp(Number(USER.fadeSeconds ?? 1.2), 0.2, 10),
        ambient: USER.ambient !== false,
    };

    const SIM = {
        simRes: 128,
        dyeRes: 512,
        pressureIters: 20,
        pressureDecay: 0.8,
        velDissipation: 0.6,
        dyeDissipation: 1.3 / OPTS.fadeSeconds,
        curl: 14,
        splatRadius: 0.22,
        splatForce: 3200,
        maxStep: 0.04,
        contentDye: 0.15,   // dye share while the pointer is over cards/buttons
    };

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (OPTS.effect === 'orbs' || reducedMotion.matches) return;

    function clamp(v, min, max) { return Math.min(max, Math.max(min, isNaN(v) ? min : v)); }

    // ── Colours (follow --accent / --accent-2 and the theme) ──
    let colA = [0.49, 0.36, 0.96], colB = [0, 0.83, 0.67], gain = 0.16;

    function parseColor(value) {
        const v = value.trim();
        if (v.startsWith('#')) {
            const h = v.length === 4 ? v.slice(1).split('').map(c => c + c).join('') : v.slice(1, 7);
            return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16) / 255);
        }
        const m = v.match(/[\d.]+/g);
        return m && m.length >= 3 ? m.slice(0, 3).map(n => Number(n) / 255) : null;
    }

    function readColors() {
        const cs = getComputedStyle(document.documentElement);
        colA = parseColor(cs.getPropertyValue('--accent')) || colA;
        colB = parseColor(cs.getPropertyValue('--accent-2')) || colB;
        const light = document.documentElement.getAttribute('data-theme') === 'light';
        // Light mode needs more dye: tinting a bright background shows less than adding light to a dark one
        gain = (light ? 0.2 : 0.16) * OPTS.intensity;
    }

    function mixColor(t, scale = 1) {
        const k = 0.5 + 0.5 * Math.sin(t);
        return colA.map((a, i) => (a * (1 - k) + colB[i] * k) * gain * scale);
    }

    // ── Fluid simulation ─────────────────────────────────
    function createFluid(canvas) {
        const gl = canvas.getContext('webgl2', {
            alpha: true, premultipliedAlpha: true, antialias: false,
            depth: false, stencil: false, preserveDrawingBuffer: false,
        });
        if (!gl) throw new Error('WebGL2 not available');
        if (!gl.getExtension('EXT_color_buffer_float') && !gl.getExtension('EXT_color_buffer_half_float')) {
            throw new Error('Float render targets not available');
        }
        gl.getExtension('OES_texture_float_linear');

        const VS = `
            precision highp float;
            attribute vec2 aPosition;
            varying vec2 vUv, vL, vR, vT, vB;
            uniform vec2 texelSize;
            void main () {
                vUv = aPosition * 0.5 + 0.5;
                vL = vUv - vec2(texelSize.x, 0.0);
                vR = vUv + vec2(texelSize.x, 0.0);
                vT = vUv + vec2(0.0, texelSize.y);
                vB = vUv - vec2(0.0, texelSize.y);
                gl_Position = vec4(aPosition, 0.0, 1.0);
            }`;

        const FS = {
            clear: `
                precision mediump float;
                varying vec2 vUv;
                uniform sampler2D uTexture;
                uniform float value;
                void main () { gl_FragColor = value * texture2D(uTexture, vUv); }`,
            splat: `
                precision highp float;
                varying vec2 vUv;
                uniform sampler2D uTarget;
                uniform float aspectRatio;
                uniform vec3 color;
                uniform vec2 point;
                uniform float radius;
                void main () {
                    vec2 p = vUv - point;
                    p.x *= aspectRatio;
                    vec3 s = exp(-dot(p, p) / radius) * color;
                    gl_FragColor = vec4(texture2D(uTarget, vUv).xyz + s, 1.0);
                }`,
            advection: `
                precision highp float;
                varying vec2 vUv;
                uniform sampler2D uVelocity;
                uniform sampler2D uSource;
                uniform vec2 texelSize;
                uniform float dt;
                uniform float dissipation;
                void main () {
                    vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
                    gl_FragColor = texture2D(uSource, coord) / (1.0 + dissipation * dt);
                }`,
            divergence: `
                precision mediump float;
                varying vec2 vUv, vL, vR, vT, vB;
                uniform sampler2D uVelocity;
                void main () {
                    float L = texture2D(uVelocity, vL).x;
                    float R = texture2D(uVelocity, vR).x;
                    float T = texture2D(uVelocity, vT).y;
                    float B = texture2D(uVelocity, vB).y;
                    vec2 C = texture2D(uVelocity, vUv).xy;
                    if (vL.x < 0.0) L = -C.x;
                    if (vR.x > 1.0) R = -C.x;
                    if (vT.y > 1.0) T = -C.y;
                    if (vB.y < 0.0) B = -C.y;
                    gl_FragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
                }`,
            curl: `
                precision mediump float;
                varying vec2 vUv, vL, vR, vT, vB;
                uniform sampler2D uVelocity;
                void main () {
                    float L = texture2D(uVelocity, vL).y;
                    float R = texture2D(uVelocity, vR).y;
                    float T = texture2D(uVelocity, vT).x;
                    float B = texture2D(uVelocity, vB).x;
                    gl_FragColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
                }`,
            vorticity: `
                precision highp float;
                varying vec2 vUv, vL, vR, vT, vB;
                uniform sampler2D uVelocity;
                uniform sampler2D uCurl;
                uniform float curl;
                uniform float dt;
                void main () {
                    float L = texture2D(uCurl, vL).x;
                    float R = texture2D(uCurl, vR).x;
                    float T = texture2D(uCurl, vT).x;
                    float B = texture2D(uCurl, vB).x;
                    float C = texture2D(uCurl, vUv).x;
                    vec2 f = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
                    f /= length(f) + 0.0001;
                    f *= curl * C;
                    f.y *= -1.0;
                    vec2 v = texture2D(uVelocity, vUv).xy + f * dt;
                    gl_FragColor = vec4(clamp(v, -1000.0, 1000.0), 0.0, 1.0);
                }`,
            pressure: `
                precision mediump float;
                varying vec2 vUv, vL, vR, vT, vB;
                uniform sampler2D uPressure;
                uniform sampler2D uDivergence;
                void main () {
                    float L = texture2D(uPressure, vL).x;
                    float R = texture2D(uPressure, vR).x;
                    float T = texture2D(uPressure, vT).x;
                    float B = texture2D(uPressure, vB).x;
                    float d = texture2D(uDivergence, vUv).x;
                    gl_FragColor = vec4((L + R + B + T - d) * 0.25, 0.0, 0.0, 1.0);
                }`,
            gradient: `
                precision mediump float;
                varying vec2 vUv, vL, vR, vT, vB;
                uniform sampler2D uPressure;
                uniform sampler2D uVelocity;
                void main () {
                    float L = texture2D(uPressure, vL).x;
                    float R = texture2D(uPressure, vR).x;
                    float T = texture2D(uPressure, vT).x;
                    float B = texture2D(uPressure, vB).x;
                    vec2 v = texture2D(uVelocity, vUv).xy - vec2(R - L, T - B);
                    gl_FragColor = vec4(v, 0.0, 1.0);
                }`,
            display: `
                precision highp float;
                varying vec2 vUv;
                uniform sampler2D uTexture;
                void main () {
                    vec3 c = 1.0 - exp(-texture2D(uTexture, vUv).rgb * 1.6);
                    gl_FragColor = vec4(c, max(c.r, max(c.g, c.b)));
                }`,
        };

        function compile(type, src) {
            const s = gl.createShader(type);
            gl.shaderSource(s, src);
            gl.compileShader(s);
            if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
            return s;
        }

        const vs = compile(gl.VERTEX_SHADER, VS);
        const P = {};
        for (const [name, src] of Object.entries(FS)) {
            const prog = gl.createProgram();
            gl.attachShader(prog, vs);
            gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, src));
            gl.bindAttribLocation(prog, 0, 'aPosition');
            gl.linkProgram(prog);
            if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
            const u = {};
            const n = gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS);
            for (let i = 0; i < n; i++) {
                const uniformName = gl.getActiveUniform(prog, i).name;
                u[uniformName] = gl.getUniformLocation(prog, uniformName);
            }
            P[name] = { use() { gl.useProgram(prog); return u; } };
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);

        function blit(target) {
            if (target) {
                gl.viewport(0, 0, target.w, target.h);
                gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
            } else {
                gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
                gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            }
            gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
        }

        const targets = [];
        function fbo(w, h) {
            gl.activeTexture(gl.TEXTURE0);
            const tex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);
            const fb = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
            if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
                throw new Error('Framebuffer incomplete');
            }
            gl.viewport(0, 0, w, h);
            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);
            const t = {
                tex, fbo: fb, w, h, tx: 1 / w, ty: 1 / h,
                attach(id) { gl.activeTexture(gl.TEXTURE0 + id); gl.bindTexture(gl.TEXTURE_2D, tex); return id; },
            };
            targets.push(t);
            return t;
        }

        function double(w, h) {
            let a = fbo(w, h), b = fbo(w, h);
            return { get read() { return a; }, get write() { return b; }, swap() { [a, b] = [b, a]; } };
        }

        function resolution(r) {
            let ar = gl.drawingBufferWidth / gl.drawingBufferHeight;
            if (ar < 1) ar = 1 / ar;
            const lo = Math.round(r), hi = Math.round(r * ar);
            return gl.drawingBufferWidth > gl.drawingBufferHeight ? [hi, lo] : [lo, hi];
        }

        let vel, dye, div, curlT, pres;
        function init() {
            for (const t of targets.splice(0)) {
                gl.deleteTexture(t.tex);
                gl.deleteFramebuffer(t.fbo);
            }
            const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
            canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
            canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
            const simSize = resolution(SIM.simRes);
            const dyeSize = resolution(SIM.dyeRes);
            vel = double(...simSize);
            dye = double(...dyeSize);
            div = fbo(...simSize);
            curlT = fbo(...simSize);
            pres = double(...simSize);
        }

        function splat(x, y, dx, dy, color) {
            const ar = canvas.width / canvas.height;
            const u = P.splat.use();
            gl.uniform1i(u.uTarget, vel.read.attach(0));
            gl.uniform1f(u.aspectRatio, ar);
            gl.uniform2f(u.point, x, y);
            gl.uniform3f(u.color, dx, dy, 0);
            gl.uniform1f(u.radius, (SIM.splatRadius / 100) * (ar > 1 ? ar : 1));
            blit(vel.write);
            vel.swap();
            gl.uniform1i(u.uTarget, dye.read.attach(0));
            gl.uniform3f(u.color, color[0], color[1], color[2]);
            blit(dye.write);
            dye.swap();
        }

        function step(dt) {
            gl.disable(gl.BLEND);

            let u = P.curl.use();
            gl.uniform2f(u.texelSize, vel.read.tx, vel.read.ty);
            gl.uniform1i(u.uVelocity, vel.read.attach(0));
            blit(curlT);

            u = P.vorticity.use();
            gl.uniform2f(u.texelSize, vel.read.tx, vel.read.ty);
            gl.uniform1i(u.uVelocity, vel.read.attach(0));
            gl.uniform1i(u.uCurl, curlT.attach(1));
            gl.uniform1f(u.curl, SIM.curl);
            gl.uniform1f(u.dt, dt);
            blit(vel.write);
            vel.swap();

            u = P.divergence.use();
            gl.uniform2f(u.texelSize, vel.read.tx, vel.read.ty);
            gl.uniform1i(u.uVelocity, vel.read.attach(0));
            blit(div);

            u = P.clear.use();
            gl.uniform1i(u.uTexture, pres.read.attach(0));
            gl.uniform1f(u.value, SIM.pressureDecay);
            blit(pres.write);
            pres.swap();

            u = P.pressure.use();
            gl.uniform2f(u.texelSize, vel.read.tx, vel.read.ty);
            gl.uniform1i(u.uDivergence, div.attach(0));
            for (let i = 0; i < SIM.pressureIters; i++) {
                gl.uniform1i(u.uPressure, pres.read.attach(1));
                blit(pres.write);
                pres.swap();
            }

            u = P.gradient.use();
            gl.uniform2f(u.texelSize, vel.read.tx, vel.read.ty);
            gl.uniform1i(u.uPressure, pres.read.attach(0));
            gl.uniform1i(u.uVelocity, vel.read.attach(1));
            blit(vel.write);
            vel.swap();

            u = P.advection.use();
            gl.uniform2f(u.texelSize, vel.read.tx, vel.read.ty);
            gl.uniform1i(u.uVelocity, vel.read.attach(0));
            gl.uniform1i(u.uSource, vel.read.attach(0));
            gl.uniform1f(u.dt, dt);
            gl.uniform1f(u.dissipation, SIM.velDissipation);
            blit(vel.write);
            vel.swap();

            gl.uniform1i(u.uVelocity, vel.read.attach(0));
            gl.uniform1i(u.uSource, dye.read.attach(1));
            gl.uniform1f(u.dissipation, SIM.dyeDissipation);
            blit(dye.write);
            dye.swap();
        }

        function render() {
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
            const u = P.display.use();
            gl.uniform1i(u.uTexture, dye.read.attach(0));
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            blit(null);
        }

        init();
        return { init, splat, step, render };
    }

    // ── Pointer input (window-level, canvas never blocks clicks) ──
    const ptr = { x: 0.5, y: 0.5, px: 0.5, py: 0.5, moved: false, active: false, lastMove: -Infinity, overContent: false };
    const CONTENT_SELECTOR = '.glass-card, .top-controls';

    function track(clientX, clientY, target) {
        ptr.overContent = !!(target && target.closest && target.closest(CONTENT_SELECTOR));
        const x = clientX / window.innerWidth;
        const y = 1 - clientY / window.innerHeight;
        if (!ptr.active) { ptr.px = x; ptr.py = y; ptr.active = true; }
        ptr.x = x;
        ptr.y = y;
        ptr.moved = true;
        ptr.lastMove = performance.now();
    }

    window.addEventListener('pointermove', e => {
        if (e.pointerType !== 'touch') track(e.clientX, e.clientY, e.target);
    }, { passive: true });
    window.addEventListener('touchstart', e => {
        ptr.active = false;
        track(e.touches[0].clientX, e.touches[0].clientY, e.target);
    }, { passive: true });
    window.addEventListener('touchmove', e => {
        const t = e.touches[0];
        track(t.clientX, t.clientY, document.elementFromPoint(t.clientX, t.clientY));
    }, { passive: true });
    window.addEventListener('touchend', () => { ptr.active = false; }, { passive: true });
    document.documentElement.addEventListener('mouseleave', () => { ptr.active = false; });

    // ── Mount ────────────────────────────────────────────
    let mode = OPTS.effect === 'glow' ? 'glow' : 'fluid';
    let fluid = null;
    let canvas = null;
    let glowEl = null;

    if (mode === 'fluid') {
        canvas = document.createElement('canvas');
        canvas.className = 'bg-fluid';
        canvas.setAttribute('aria-hidden', 'true');
        bgCanvas.appendChild(canvas);
        try {
            fluid = createFluid(canvas);
        } catch (err) {
            console.info('[flux-card] Fluid background unavailable, using glow fallback:', err.message);
            canvas.remove();
            canvas = null;
            mode = 'glow';
        }
    }

    function mountGlow() {
        glowEl = document.createElement('div');
        glowEl.className = 'bg-glow';
        glowEl.setAttribute('aria-hidden', 'true');
        glowEl.style.opacity = String(Math.min(1, 0.85 * OPTS.intensity));
        bgCanvas.appendChild(glowEl);
    }
    if (mode === 'glow') mountGlow();

    if (canvas) {
        canvas.addEventListener('webglcontextlost', e => {
            e.preventDefault();
            fluid = null;
            canvas.remove();
            mode = 'glow';
            mountGlow();
        });
    }

    readColors();
    new MutationObserver(readColors).observe(document.documentElement, {
        attributes: true, attributeFilter: ['data-theme'],
    });

    // Only rebuild on real size changes; mobile URL-bar jitter keeps the current state.
    let lastSize = [window.innerWidth, window.innerHeight];
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const [w, h] = [window.innerWidth, window.innerHeight];
            if (w === lastSize[0] && Math.abs(h - lastSize[1]) < h * 0.25) return;
            lastSize = [w, h];
            if (fluid) fluid.init();
        }, 150);
    });

    // ── Loop ─────────────────────────────────────────────
    const glow = { tx: 0, ty: 0, ax: 0, ay: 0, bx: 0, by: 0 };
    glow.tx = glow.ax = glow.bx = window.innerWidth / 2;
    glow.ty = glow.ay = glow.by = window.innerHeight * 0.4;

    let last = performance.now();
    let hue = 0;
    let dyeScale = 1;
    let nextAmbient = 0;
    let running = true;

    function ambientSplat(now) {
        if (!OPTS.ambient || now < nextAmbient || now - ptr.lastMove < 3000) return;
        nextAmbient = now + 1800 + Math.random() * 2200;
        const angle = Math.random() * Math.PI * 2;
        const force = 240 + Math.random() * 200;
        fluid.splat(
            0.1 + Math.random() * 0.8, 0.1 + Math.random() * 0.8,
            Math.cos(angle) * force, Math.sin(angle) * force,
            mixColor(hue += 0.9, 0.7),
        );
    }

    function frame(now) {
        if (!running) return;
        requestAnimationFrame(frame);
        const dt = Math.min((now - last) / 1000, 1 / 60);
        last = now;

        // Fade (not cut) the effect when moving onto content, so card edges don't leave hard seams
        dyeScale += ((ptr.overContent ? SIM.contentDye : 1) - dyeScale) * 0.15;

        if (mode === 'fluid' && fluid) {
            if (ptr.moved && ptr.active) {
                const ar = canvas.width / canvas.height;
                let dx = ptr.x - ptr.px;
                let dy = ptr.y - ptr.py;
                if (ar < 1) dx *= ar;
                if (ar > 1) dy /= ar;
                // Cap the impulse so pointer jumps (e.g. re-entering the window) don't smear the screen
                const len = Math.hypot(dx, dy);
                if (len > SIM.maxStep) { dx *= SIM.maxStep / len; dy *= SIM.maxStep / len; }
                if (dx || dy) {
                    hue += dt * 1.4;
                    fluid.splat(ptr.x, ptr.y, dx * SIM.splatForce, dy * SIM.splatForce, mixColor(hue, dyeScale));
                }
                ptr.px = ptr.x;
                ptr.py = ptr.y;
                ptr.moved = false;
            }
            ambientSplat(now);
            fluid.step(dt);
            fluid.render();
        } else if (mode === 'glow' && glowEl) {
            if (ptr.active) {
                glow.tx = ptr.x * window.innerWidth;
                glow.ty = (1 - ptr.y) * window.innerHeight;
            } else if (OPTS.ambient && now - ptr.lastMove > 3000) {
                const t = now / 1000;
                glow.tx = window.innerWidth * (0.5 + 0.3 * Math.cos(t * 0.4));
                glow.ty = window.innerHeight * (0.45 + 0.25 * Math.sin(t * 0.55));
            }
            glow.ax += (glow.tx - glow.ax) * 0.12;
            glow.ay += (glow.ty - glow.ay) * 0.12;
            glow.bx += (glow.ax - glow.bx) * 0.06;
            glow.by += (glow.ay - glow.by) * 0.06;
            glowEl.style.opacity = (Math.min(1, 0.85 * OPTS.intensity) * Math.max(dyeScale, 0.35)).toFixed(3);
            glowEl.style.setProperty('--glow-ax', glow.ax.toFixed(1) + 'px');
            glowEl.style.setProperty('--glow-ay', glow.ay.toFixed(1) + 'px');
            glowEl.style.setProperty('--glow-bx', glow.bx.toFixed(1) + 'px');
            glowEl.style.setProperty('--glow-by', glow.by.toFixed(1) + 'px');
        }
    }

    let disabled = false;
    function start() {
        if (running || disabled) return;
        running = true;
        last = performance.now();
        requestAnimationFrame(frame);
    }

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) running = false;
        else start();
    });

    const stopForReducedMotion = () => {
        if (!reducedMotion.matches) return;
        disabled = true;
        running = false;
        canvas?.remove();
        glowEl?.remove();
    };
    if (reducedMotion.addEventListener) reducedMotion.addEventListener('change', stopForReducedMotion);

    // A few initial strokes so the first frame is not empty
    if (fluid) {
        for (let i = 0; i < 3; i++) {
            const angle = Math.random() * Math.PI * 2;
            fluid.splat(
                0.2 + Math.random() * 0.6, 0.3 + Math.random() * 0.5,
                Math.cos(angle) * 450, Math.sin(angle) * 450,
                mixColor(i * 1.7, 0.8),
            );
        }
    }

    requestAnimationFrame(frame);
})();
