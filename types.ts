export interface AdverseEventItem {
  eventName: string;
  onsetDate: string;
  resolutionDate: string;
}

export interface SuspectDrugItem {
  drugName: string;
  startDate: string;
  stopDate: string;
}

export interface CaseData {
  narrative: string;
  suspectDrugs: SuspectDrugItem[];
  adverseEvents: AdverseEventItem[];
  patientHistory: string;
  dechallengeOutcome: 'Resolved' | 'Improved' | 'Unchanged' | 'Worsened' | 'Unknown' | '';
  rechallengeOutcome: 'Reappeared' | 'Did not reappear' | 'Not applicable' | '';
  alternativeCauses: string;
  concomitantMeds: string;
  labData: string;
}

// Represents an assessment for a single drug-event pair
export interface IndividualAssessment {
  drugName: string;
  adverseEvent: string;
  causalityCategory: 'Probable' | 'Possible' | 'Unlikely' | 'Not Related' | 'Unassessable/Unclassifiable' | string;
  rationale: string;
}

// The overall result is now an array of individual assessments
export type AssessmentResult = IndividualAssessment[];

// Represents a single drug-drug interaction
export interface InteractionPair {
  drugA: string;
  drugB: string;
  severity: 'Major' | 'Moderate' | 'Minor' | string;
  description: string;
}

// The overall result for a DDI check
export type InteractionResult = InteractionPair[];