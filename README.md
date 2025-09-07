# ✉️ Lekhak AI — Email Writer (Frontend, Chrome Extension)

This is the UI/frontend for the Lekhak AI email-writing assistant as a Chrome extension. It enhances your email workflows with AI-powered assistance right inside the browser. 🚀



---

## 🌟 Features

- 🧠 AI-assisted email drafting within the browser
- 🖱️ Seamless integration with email platforms via a Chrome extension
- 🎨 Clean UI and simple user flows
- ⚙️ Easily configurable and extensible

---

## 🧩 Architecture at a Glance

- Frontend: This Chrome extension (current repository)
- Backend: A separate service providing AI endpoints  
  👉 Backend repo: [GitHub](https://github.com/Priyadarshan-Garg/email-writer-backend)  
  

---

## 🛠️ Tech Stack

- Chrome Extension platform (Manifest V3)
- JavaScript, HTML, CSS
- npm for dependency management

---

## 🧪 Local Development

You can work on the extension locally and load it into Chrome for testing.

### Prerequisites

- Node.js and npm (recommended: latest LTS)
- Google Chrome

### Setup

1. Clone the repository
2. Install dependencies:
   - If there are any npm dependencies, run:
     ```
     npm install
     ```
   - If the project is pure static (no dependencies), you can skip this step.

3. Optional build step:
   - If your project uses a build step, run:
     ```
     npm run build
     ```
   - Otherwise, proceed to loading in Chrome.

---

## 🌐 Load the Extension in Chrome

1. Open Chrome and go to:
   ```
   chrome://extensions/
   ```
2. Enable “Developer mode” (top-right).
3. Click “Load unpacked”.
4. Select the project folder (the one containing `manifest.json`).

Changes to source files can be reloaded by clicking the refresh icon on the extension card. 🔄

---

## ⚙️ Configuration

If your frontend needs to talk to the backend:
- Create a config file or use environment variables (depending on your setup).
- Common approaches:
  - A `config.js` with an `API_BASE_URL`
  - Using `.env` and injecting at build time

Add your API URL here for easy reference:
- API Base URL: `<YOUR_BACKEND_API_URL>`

---

## 🚀 Deployment

This is a Chrome extension. Typical deployment options:
- Publish to the Chrome Web Store (recommended for distribution)
- Side-load internally for testing or private use

- Live deployment link: [I'll update it soon]()
---
## 🧭 Project Structure (high-level)

- `manifest.json` — Chrome extension manifest
- `icons/` — Extension icons
- Frontend scripts and styles for the content/UI
- Optional background/service worker scripts depending on your setup

---

## 🤝 Contributing

Contributions are welcome!  
- Fork the repo
- Create a feature branch
- Commit with clear messages
- Open a PR describing your change

---

## 📄 License

This project is released under the terms of the MIT LICENSE included in the repository.

---

## 🔗 Useful Links

- Chrome Extensions Docs: https://developer.chrome.com/docs/extensions
- Manifest V3 Overview: https://developer.chrome.com/docs/extensions/mv3/intro/

---

## 📬 Contact

Have questions or ideas? Open an issue or start a discussion. We’d love to hear from you! 💬

