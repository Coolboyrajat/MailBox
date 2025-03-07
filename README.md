# MailBox

// Directory Structure
```/*
mailbox-extension/
├── package.json
├── tsconfig.json
├── postcss.config.js
├── tailwind.config.js
├── plasmo.json
├── src/
│   ├── popup.tsx             # Main popup component
│   ├── background.ts         # Background script
│   ├── styles/
│   │   ├── global.css        # Global styles with Tailwind
│   │   └── popup.css         # Popup-specific styles
│   ├── components/
│   │   ├── ServiceButton.tsx # Service selection button
│   │   ├── EmailList.tsx     # List of emails
│   │   ├── EmailView.tsx     # Single email view
│   │   └── AccountInfo.tsx   # Current account info
│   ├── services/
│   │   ├── types.ts          # Type definitions
│   │   ├── MailService.ts    # Base service interface
│   │   ├── MailTmService.ts  # mail.tm implementation
│   │   ├── TempMailService.ts # temp-mail implementation
│   │   └── TempMailoService.ts # tempmailo implementation
│   └── assets/
│       └── icons/
│           ├── icon.png
│           └── platforms/
│               ├── mail-tm.png
│               ├── temp-mail.png
│               └── tempmailo.png
└── .gitignore
*/
```


// Run these commands to get started:
``` npm create plasmo ```
``` npm install @plasmohq/storage react-icons webextension-polyfill tailwindcss postcss autoprefixer ```
