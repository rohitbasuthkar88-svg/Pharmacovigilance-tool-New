import { GoogleGenAI, Type } from "@google/genai";
import type { CaseData, AssessmentResult, InteractionResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const model = "gemini-2.5-flash";

const causalitySystemInstruction = `
You are a world-class drug safety physician and pharmacovigilance expert. Your task is to assess the causality of an adverse drug reaction based on the provided Individual Case Safety Report (ICSR) details.

You will be given case information in one of two formats:
1.  A free-text "Case Narrative".
2.  A set of structured data fields.

**IMPORTANT: If a "Case Narrative" is provided, you MUST prioritize it as the single source of truth.** You are expected to intelligently extract all relevant information (suspected drugs, adverse events, timelines, patient history, etc.) directly from the narrative to perform your assessment.

If no narrative is provided, you will use the structured data fields.

You must analyze **each combination** of suspected drug and adverse event that you identify **individually**.

Your response must be a JSON array. Each object in the array represents a causality assessment for one drug-event pair and must contain the following fields: 'drugName', 'adverseEvent', 'causalityCategory', and 'rationale'.

Use the following causality categories for the 'causalityCategory' field:
- Probable
- Possible
- Unlikely
- Not Related
- Unassessable/Unclassifiable

For each assessment, provide a detailed, structured rationale for your conclusion in the 'rationale' field. In your rationale, reference the specific case details you have extracted or been given. Consider the following points:
1.  **Temporal Relationship:** The timing between each drug's specific administration start date and the event onset/resolution. Pay close attention to the individual timelines provided for each drug.
2.  **Dechallenge:** The outcome when the drug was stopped or the dose was reduced.
3.  **Rechallenge:** The outcome if the drug was reintroduced.
4.  **Alternative Etiologies:** Plausibility of other causes for the event.
5.  **Pharmacological Plausibility:** Known information about the drug's mechanism and side effect profile.
6.  **Patient-Specific Factors:** Relevant medical history, concomitant medications, and laboratory data.
`;

const causalityResponseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      drugName: {
        type: Type.STRING,
        description: "The name of the suspected drug for this specific assessment.",
      },
      adverseEvent: {
        type: Type.STRING,
        description: "The name of the adverse event for this specific assessment.",
      },
      causalityCategory: {
        type: Type.STRING,
        description: "The assessed causality category (e.g., Probable, Possible) for this drug-event pair.",
      },
      rationale: {
        type: Type.STRING,
        description: "A detailed explanation for the assessment of this specific drug-event pair.",
      },
    },
    required: ["drugName", "adverseEvent", "causalityCategory", "rationale"],
  },
};

const formatCaseDataForPrompt = (data: CaseData): string => {
  const suspectDrugsText = data.suspectDrugs.map(drug => 
    `- Drug: ${drug.drugName || 'Not provided'}\n  - Start Date: ${drug.startDate || 'Not provided'}\n  - Stop Date: ${drug.stopDate || 'Not provided'}`
  ).join('\n');

  const adverseEventsText = data.adverseEvents.map(event => {
    return `- Event: ${event.eventName || 'Not provided'}\n  - Onset: ${event.onsetDate || 'Not provided'}\n  - Resolution: ${event.resolutionDate || 'Not provided'}`;
  }).join('\n');

  return `
    - Suspected Drug(s) Details:\n${suspectDrugsText || '  - None provided'}
    - Adverse Event(s) Details:\n${adverseEventsText || '  - None provided'}
    - Patient History: ${data.patientHistory || 'None provided'}
    - Concomitant Medications: ${data.concomitantMeds || 'None provided'}
    - Alternative Causes for Event: ${data.alternativeCauses || 'None provided'}
    - Laboratory Data: ${data.labData || 'None provided'}
    - Dechallenge Outcome: ${data.dechallengeOutcome || 'Not provided'}
    - Rechallenge Outcome: ${data.rechallengeOutcome || 'Not provided'}
  `;
};

export const assessCausality = async (data: CaseData): Promise<AssessmentResult> => {
  try {
    let prompt: string;

    if (data.narrative && data.narrative.trim() !== '') {
      prompt = `Please perform a causality assessment for each drug-event pair based on the following case narrative:\n\n---\n\n${data.narrative.trim()}`;
    } else {
      prompt = `Please perform a causality assessment for each drug-event pair in the following case:\n${formatCaseDataForPrompt(data)}`;
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: causalitySystemInstruction,
        responseMimeType: "application/json",
        responseSchema: causalityResponseSchema,
        temperature: 0.2,
      },
    });

    const jsonText = response.text.trim();
    const parsedResult = JSON.parse(jsonText) as AssessmentResult;
    return parsedResult;

  } catch (error) {
    console.error("Error calling Gemini API for causality:", error);
    if (error instanceof Error) {
        let errorMessage = `Failed to get assessment from AI: ${error.message}`;
        if (error.message.toLowerCase().includes('json')) {
            errorMessage += ". The AI may have returned an invalid format."
        }
        return Promise.reject(new Error(errorMessage));
    }
    return Promise.reject(new Error("An unknown error occurred during AI assessment."));
  }
};


// --- Drug-Drug Interaction Service ---

const interactionSystemInstruction = `
You are an expert clinical pharmacologist. Your task is to identify and describe potential drug-drug interactions (DDIs) from a given list of medications.

Your response must be a JSON array. Each object in the array represents a single interaction between two drugs and must contain the following fields: 'drugA', 'drugB', 'severity', and 'description'.

- 'drugA', 'drugB': The names of the two interacting drugs.
- 'severity': The clinical severity of the interaction. Use one of three categories: 'Major', 'Moderate', or 'Minor'.
- 'description': A concise explanation of the interaction's mechanism, potential clinical effect, and a brief management recommendation.

If no clinically significant interactions are found among the provided drugs, return an empty JSON array: [].
`;

const interactionResponseSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            drugA: { type: Type.STRING },
            drugB: { type: Type.STRING },
            severity: { type: Type.STRING },
            description: { type: Type.STRING },
        },
        required: ["drugA", "drugB", "severity", "description"],
    },
};


export const checkInteractions = async (drugs: string[]): Promise<InteractionResult> => {
  if (drugs.length < 2) {
    return [];
  }

  const prompt = `Analyze the following list of drugs for potential drug-drug interactions: ${drugs.join(', ')}`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: interactionSystemInstruction,
        responseMimeType: "application/json",
        responseSchema: interactionResponseSchema,
        temperature: 0.3,
      },
    });

    const jsonText = response.text.trim();
    const parsedResult = JSON.parse(jsonText) as InteractionResult;
    return parsedResult;
  } catch (error) {
    console.error("Error calling Gemini API for DDI:", error);
    if (error instanceof Error) {
        let errorMessage = `Failed to get interaction data from AI: ${error.message}`;
        if (error.message.toLowerCase().includes('json')) {
            errorMessage += ". The AI may have returned an invalid format."
        }
        return Promise.reject(new Error(errorMessage));
    }
    return Promise.reject(new Error("An unknown error occurred during AI interaction check."));
  }
};