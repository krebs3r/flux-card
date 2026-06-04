const CONTENT = {
  "name": "Martin Krebs",
  "role": "Technical Solutions Manager",
  "email": "mail@martin-krebs.eu",
  "avatar": "profile.jpg",
  "favicon": "favicon.svg",

  "meta": {
    "title": "{name} | {role}",
    "description": "Digital Business Card — {name}, {role}",
    "ogImage": "og-image.png",
    "ogUrl": "https://krebs3r.github.io/flux-card/",
    "repoUrl": "https://github.com/krebs3r/flux-card",
    "repoLabel": "krebs3r/flux-card"
  },

  "socialLinks": [
    {
      "label": "GitHub",
      "url": "https://github.com/krebs3r",
      "icon": "github"
    },
    {
      "label": "LinkedIn",
      "url": "https://www.linkedin.com/in/krebsm",
      "icon": "linkedin"
    },
    {
      "label": "E-Mail",
      "url": "mailto:mail@martin-krebs.eu",
      "icon": "mail"
    }
  ],

  "skills": [
    "Payment Solutions",
    "PSD2 / SCA",
    "MIT / CIT Recurring",
    "API & Shop Systems",
    "Technical Integration",
    "Product Ownership",
    "Scrum / PSM I",
    "Payment Product Launch",
    "RFP / RFI",
    "Requirements Engineering",
    "Technical Documentation",
    "Sales / Product / IT Coordination",
    "Key Account Support",
    "Merchant Onboarding",
    "Customer Workshops",
    "Technical Support",
    "Communication",
    "Operational Improvements"
  ],

  "projects": [
    {
      "name": "Computop Paygate Tester",
      "repo": "krebs3r/computop-tester",
      "url": "https://github.com/krebs3r/computop-tester",
      "liveUrl": "https://krebs3r.github.io/computop-tester/",
      "i18nKey": "computop",
      "tags": ["Payment", "Encryption", "Browser Tool"]
    },
    {
      "name": "Flux ToDo",
      "repo": "krebs3r/flux-todo",
      "url": "https://github.com/krebs3r/flux-todo",
      "liveUrl": "https://flux-todo.eu",
      "i18nKey": "flux_todo",
      "tags": ["PWA", "Local-first", "IndexedDB"]
    },
    {
      "name": "Local LLM CPU Guide",
      "repo": "krebs3r/local-llm-cpu-guide",
      "url": "https://github.com/krebs3r/local-llm-cpu-guide",
      "liveUrl": "https://krebs3r.github.io/local-llm-cpu-guide/",
      "i18nKey": "llm_cpu",
      "tags": ["LLM", "Hardware", "Comparison"]
    },
    {
      "name": "Netzbetreiber Radar",
      "repo": "krebs3r/netzbetreiber-radar",
      "url": "https://github.com/krebs3r/netzbetreiber-radar",
      "i18nKey": "netzbetreiber",
      "tags": ["Python", "CSV", "Automation"]
    }
  ],

  "focusAreas": [
    {
      "icon": "lightbulb",
      "i18nKey": "solutions"
    },
    {
      "icon": "layers",
      "i18nKey": "product"
    },
    {
      "icon": "plug",
      "i18nKey": "integration"
    }
  ],

  "i18n": {
    "de": {
      "tagline": "Ich verbinde Kundenanforderungen mit technischen Lösungen im Payment-Bereich — von der Analyse über das Konzept bis zur erfolgreichen Umsetzung.",
      "section_focus": "Schwerpunkte",
      "focus_solutions_title": "Technische Lösungsberatung",
      "focus_solutions_desc": "Kundenanalyse und Erarbeitung optimaler Payment-Lösungen — von RFP/RFI bis zur Implementierung.",
      "focus_product_title": "Product Ownership",
      "focus_product_desc": "Anforderungen in User Stories übersetzen, Backlogs priorisieren und die Brücke zwischen Business und Entwicklung schlagen.",
      "focus_integration_title": "Integration & Onboarding",
      "focus_integration_desc": "Technische Anbindung von Kunden an Payment-Plattformen begleiten und reibungslosen Go-Live sicherstellen.",
      "section_skills": "Technologien & Skills",
      "section_projects": "GitHub Highlights",
      "project_computop_desc": "Clientseitiges Testtool für Computop Paygate HPP- und PaySSL-Integrationen mit Blowfish-Verschlüsselung, HMAC-SHA256 und Response-Decryptor.",
      "project_flux_todo_desc": "Local-first ToDo-PWA mit Offline-Support, IndexedDB, Task-Boards, Zeittracking, Pomodoro, Statistiken und responsivem Glass-UI.",
      "project_llm_cpu_desc": "Interaktiver Vergleich von 125+ AMD- und Intel-CPUs für PCIe-Lanes, Multi-GPU-Setups und lokale LLM-Workloads.",
      "project_netzbetreiber_desc": "Python-Tool, das dreistellige BecN-Präfixe systematisch ausliest und eine strukturierte Prefix-zu-Netzbetreiber-CSV erzeugt.",
      "project_live": "Live",
      "project_repo": "Repo",
      "project_all": "Alle Repositories ansehen",
      "section_contact": "Kontakt",
      "label_name": "Name",
      "label_email": "E-Mail",
      "label_message": "Nachricht",
      "ph_name": "Max Mustermann",
      "ph_email": "max@beispiel.de",
      "ph_message": "Hallo, ich würde gerne ...",
      "btn_send": "Nachricht senden",
      "captcha_label": "Spamschutz",
      "msg_sent": "Nachricht gesendet!",
      "msg_wait": "Bitte nimm dir einen Moment Zeit.",
      "msg_captcha_wrong": "Die Rechenaufgabe ist nicht korrekt.",
      "msg_opening_mail": "Dein E-Mail-Programm wird geöffnet ...",
      "mailto_subject": "Kontakt von {name} via flux-card",
      "footer_disclaimer": "Privates Open-Source-Projekt.<br>Keine Daten werden serverseitig gespeichert.<br>Hosting über GitHub Pages – es gelten deren <a href=\"https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement\" target=\"_blank\" rel=\"noopener\" style=\"color:inherit;text-decoration:underline\">Datenschutzbestimmungen</a>."
    },
    "en": {
      "tagline": "I bridge customer requirements with technical payment solutions — from analysis and concept to successful implementation.",
      "section_focus": "Focus Areas",
      "focus_solutions_title": "Technical Solution Consulting",
      "focus_solutions_desc": "In-depth customer analysis and development of optimal payment solutions — from RFP/RFI to implementation.",
      "focus_product_title": "Product Ownership",
      "focus_product_desc": "Translating requirements into user stories, prioritizing backlogs, and bridging the gap between business and development.",
      "focus_integration_title": "Integration & Onboarding",
      "focus_integration_desc": "Guiding technical customer onboarding to payment platforms and ensuring a smooth go-live.",
      "section_skills": "Technologies & Skills",
      "section_projects": "GitHub Highlights",
      "project_computop_desc": "Client-side test tool for Computop Paygate HPP and PaySSL integrations with Blowfish encryption, HMAC-SHA256, and response decryption.",
      "project_flux_todo_desc": "Local-first todo PWA with offline support, IndexedDB, task boards, time tracking, Pomodoro, statistics, and responsive glass UI.",
      "project_llm_cpu_desc": "Interactive comparison of 125+ AMD and Intel CPUs for PCIe lanes, multi-GPU setups, and local LLM workloads.",
      "project_netzbetreiber_desc": "Python tool that scans three-digit BecN prefixes and creates a structured prefix-to-network-operator CSV export.",
      "project_live": "Live",
      "project_repo": "Repo",
      "project_all": "View all repositories",
      "section_contact": "Contact",
      "label_name": "Name",
      "label_email": "Email",
      "label_message": "Message",
      "ph_name": "Jane Doe",
      "ph_email": "jane@example.com",
      "ph_message": "Hi, I would like to ...",
      "btn_send": "Send message",
      "captcha_label": "Spam check",
      "msg_sent": "Message sent!",
      "msg_wait": "Please take a moment.",
      "msg_captcha_wrong": "The math answer is incorrect.",
      "msg_opening_mail": "Opening your email client ...",
      "mailto_subject": "Contact from {name} via flux-card",
      "footer_disclaimer": "Private open-source project.<br>No data is stored server-side.<br>Hosted on GitHub Pages – their <a href=\"https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement\" target=\"_blank\" rel=\"noopener\" style=\"color:inherit;text-decoration:underline\">privacy policy</a> applies."
    }
  }
};
