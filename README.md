# ICSR AI Causality Assessment Tool

This is a powerful, AI-driven web application designed to assist drug safety physicians and pharmacovigilance professionals in performing causality assessments for Individual Case Safety Reports (ICSRs). The tool acts as an expert assistant, analyzing case data to provide detailed, rationale-based assessments for each drug-event pair.

## Key Features

-   **AI-Powered Causality Assessment**: Leverages Google's Gemini model, fine-tuned to act as a world-class drug safety expert.
-   **Flexible Data Entry**: Supports both unstructured **Case Narrative** pasting for quick analysis and detailed **Structured Data Fields** for granular control.
-   **Granular Analysis**: Provides an individual causality assessment for every unique suspect drug and adverse event pair.
-   **Modern & Responsive UI**: Clean, engaging, and mobile-friendly user interface built with React and Tailwind CSS.
-   **Built-in Drug-Drug Interaction (DDI) Checker**: An independent tool to quickly check for potential interactions between all listed medications.
-   **Detailed Timelines**: Accepts individual start/stop dates for each drug and onset/resolution dates for each event for precise temporal analysis.

---

## Configuration & Setup

To run this application, you need a Google Gemini API key.

### **IMPORTANT: API Key Security**

Your API key is a secret. Do **NOT** commit it to your repository or hard-code it directly into the source code. Anyone with access to your key can use your API quota.

The application is designed to load the API key from an environment variable named `API_KEY`.

### Running Locally

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    This project uses `es-module-shims` and direct CDN imports, so there is no `npm install` step needed for the base dependencies.

3.  **Set up the Environment Variable:**
    Create a file named `.env` in the root of your project directory and add your API key:
    ```
    API_KEY="YOUR_GEMINI_API_KEY_HERE"
    ```
    *Note: A local development server is required to load environment variables. A simple one can be created with Node.js/Express or by using tools like Vite.*

4.  **Serve the application:**
    Use a simple HTTP server to run the `index.html` file. For example, using Python:
    ```bash
    python -m http.server
    ```
    Or using the `serve` package from npm:
    ```bash
    npx serve .
    ```

---

## Deployment

You can deploy this application to any modern static hosting provider (e.g., Vercel, Netlify, Cloudflare Pages).

The critical step during deployment is to set the `API_KEY` environment variable within your hosting provider's dashboard.

### Example: Deploying to Vercel

1.  Push your code to a GitHub, GitLab, or Bitbucket repository.
2.  Import the repository into Vercel.
3.  Vercel will likely auto-detect the project as a static site. No special build command is needed.
4.  Navigate to your project's **Settings > Environment Variables** in the Vercel dashboard.
5.  Add a new environment variable:
    -   **Name**: `API_KEY`
    -   **Value**: Paste your Gemini API key here.
6.  Deploy! Vercel will build and deploy your site, making the environment variable securely available to the application.

---

## Disclaimer

This tool is for informational and educational purposes only. It is intended to assist qualified professionals and is **not** a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for any medical concerns. The creators of this tool are not liable for any decisions made based on its output.
