# StepRec - Step Recorder & Documentation Tool

StepRec is a powerful documentation tool that helps you capture workflows and generate step-by-step guides automatically. It consists of a modern React web application and a companion Chrome Extension for seamless web recording.

## 🚀 Features

- **Web Recorder**: Capture clicks, typing, and screenshots directly from your browser (requires Chrome Extension).
- **Desktop Recorder**: Record any application window or your entire screen.
- **Smart Editor**: Edit and refine your captured steps.
- **PDF Export**: Generate professional PDF documentation from your workflows.
- **Dark Mode**: Fully supported dark/light themes.

## 📂 Project Structure

This monorepo contains two main parts:

- **`app/`**: The main web application built with React + Vite + Tailwind CSS.
- **`extension/`**: The Chrome Extension (Manifest V3) required for the Web Recorder feature.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS 4
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **PDF Generation**: jsPDF, html2canvas
- **Extension**: Chrome Extension Manifest V3

## 🏁 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- Google Chrome browser

### 1. Web Application Setup

Navigate to the `app` directory and install dependencies:

```bash
cd app
npm install
```

Start the development server:

```bash
npm run dev
```

The app will run at `http://localhost:5173`.

### 2. Chrome Extension Setup (Development)

1.  Open Chrome and go to `chrome://extensions/`.
2.  Enable **"Developer mode"** in the top right corner.
3.  Click **"Load unpacked"**.
4.  Select the `extension` folder from this repository.
5.  **Important**: In `extension/config.js`, ensure `IS_DEV` is set to `true` if you are running the app locally.

```javascript
// extension/config.js
const CONFIG = {
  IS_DEV: true, // Set to true for localhost
  // ...
};
```

### 3. Production Build

**Web App:**

```bash
cd app
npm run build
```

**Extension:**

1.  In `extension/config.js`, set `IS_DEV: false`.
2.  Zip the contents of the `extension` folder to create a production-ready package.

## 📝 Usage

1.  Open the web app (Localhost or Production URL).
2.  **Web Recording**: Click "Web Recorder". If the extension is installed, it will launch the recording interface.
3.  **Desktop Recording**: Click "Desktop Recorder" to capture other applications.
4.  **Stop & Edit**: Finish recording to enter the Editor, where you can delete steps, add descriptions, and finalize your guide.
5.  **Export**: Download your guide as a PDF.

## 📄 License

[MIT](LICENSE)
