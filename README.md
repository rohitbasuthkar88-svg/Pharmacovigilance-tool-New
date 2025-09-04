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

Your API key is a secret. Do **NOT** commit it to your repository. This project is configured to expose the API key to the client-side browser, which is acceptable for development or limited-access demos but is not a secure practice for a public-facing production application. For production, you should proxy API calls through a secure backend.

The application loads the API key from an `api-key.js` file.

### Running Locally

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Set up the API Key:**
    Create a file named `api-key.js` in the root of your project directory and add your API key like this:
    ```javascript
    window.API_KEY = "YOUR_GEMINI_API_KEY_HERE";
    ```
    *Note: This file is intentionally not tracked by git to prevent accidental key exposure.*

3.  **Serve the application:**
    Since this is a static project, you can use any simple HTTP server. For example, using Python:
    ```bash
    python -m http.server
    ```
    Or using the `serve` package from npm:
    ```bash
    npx serve .
    ```
    Now, open your browser and navigate to the provided local address.

---

## Deployment to Vercel

You can easily deploy this application to [Vercel](https://vercel.com).

The project is now configured to work with Vercel's default build settings out-of-the-box. The build process will automatically create a `public` directory containing the application and inject your API key from an environment variable.

1.  Push your code to a GitHub, GitLab, or Bitbucket repository.
2.  Import the repository into Vercel.
3.  Vercel will detect the `package.json` and configure the project automatically. You should not need to change any build settings. Vercel will correctly identify `npm run build` as the build command and `public` as the output directory.
4.  Navigate to your project's **Settings > Environment Variables** in the Vercel dashboard.
5.  Add a new environment variable:
    -   **Name**: `API_KEY`
    -   **Value**: Paste your Gemini API key here.
6.  Deploy! Vercel will run the build script and deploy your site from the generated `public` directory.

---

## Disclaimer

This tool is for informational and educational purposes only. It is intended to assist qualified professionals and is **not** a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for any medical concerns. The creators of this tool are not liable for any decisions made based on its output.