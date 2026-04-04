/**
 * AI-powered symptom analysis module
 * Performs rule-based triage to classify severity and recommend hospital bed types
 * Extensible for future OpenAI API integration
 */

export type Severity = 'mild' | 'moderate' | 'severe';
export type RecommendedBed = 'General' | 'Oxygen' | 'ICU' | 'Ventilator' | 'Cardiac';

export interface TriageResult {
  severity: Severity;
  recommendedBed: RecommendedBed;
  advice: string;
  confidence: number;
}

/**
 * OpenAI API integration (future)
 * Uncomment and add VITE_OPENAI_API_KEY to .env.local when ready
 */
async function analyzeWithOpenAI(symptoms: string): Promise<TriageResult | null> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a medical triage assistant. Analyze symptoms and classify severity and recommend hospital bed type. Always respond with valid JSON only, no additional text. Format: {"severity": "mild|moderate|severe", "recommendedBed": "General|Oxygen|ICU|Ventilator|Cardiac", "advice": "short explanation", "confidence": 0-1}`,
          },
          {
            role: 'user',
            content: `Analyze these symptoms and recommend hospital bed: ${symptoms}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', response.statusText);
      return null;
    }

    const data = await response.json();
    const content = data.choices[0].message.content.trim();
    const result = JSON.parse(content) as TriageResult;
    return result;
  } catch (error) {
    console.error('OpenAI analysis error:', error);
    return null;
  }
}

/**
 * Rule-based symptom analysis (fallback / default)
 * Uses keyword matching to classify severity and recommend bed type
 */
function analyzeWithRules(symptoms: string): TriageResult {
  const symptomLower = symptoms.toLowerCase();

  // Define symptom sets for each category
  const severeKeywords = [
    'chest pain',
    'heart attack',
    'stroke',
    'severe bleeding',
    'unconscious',
    'unable to breathe',
    'respiratory distress',
    'sudden paralysis',
    'severe trauma',
    'critical',
    'emergency',
    'accident',
    'collision',
    'cardiac',
    'seizure',
    'overdose',
    'burn',
  ];

  const moderateKeywords = [
    'trouble breathing',
    'shortness of breath',
    'wheezing',
    'pneumonia',
    'bronchitis',
    'severe infection',
    'high fever',
    'difficulty breathing',
    'oxygen needed',
    'kidney failure',
    'liver disease',
    'diabetes emergency',
    'severe allergic reaction',
  ];

  const mildKeywords = [
    'cold',
    'cough',
    'headache',
    'mild fever',
    'flu',
    'sore throat',
    'congestion',
    'nausea',
    'mild pain',
    'fatigue',
    'diarrhea',
    'vomiting',
  ];

  // Check for severe symptoms
  for (const keyword of severeKeywords) {
    if (symptomLower.includes(keyword)) {
      return {
        severity: 'severe',
        recommendedBed: 'ICU',
        advice: `Your symptoms indicate a severe medical emergency. Seeking immediate ICU-level care at a hospital with ICU beds and potentially ventilator support. Call emergency services (108) immediately.`,
        confidence: 0.85,
      };
    }
  }

  // Check for cardiac/ventilator specific symptoms
  if (symptomLower.includes('cardiac') || symptomLower.includes('heart')) {
    return {
      severity: 'severe',
      recommendedBed: 'Cardiac',
      advice: `Cardiac symptoms detected. Recommend specialized cardiac care unit in a hospital. Emergency services should be contacted.`,
      confidence: 0.8,
    };
  }

  // Check for moderate symptoms
  for (const keyword of moderateKeywords) {
    if (symptomLower.includes(keyword)) {
      return {
        severity: 'moderate',
        recommendedBed: 'Oxygen',
        advice: `Your symptoms suggest moderate respiratory or systemic involvement. Oxygen support and monitoring recommended. Consider visiting a hospital with oxygen bed availability.`,
        confidence: 0.8,
      };
    }
  }

  // Check for mild symptoms
  for (const keyword of mildKeywords) {
    if (symptomLower.includes(keyword)) {
      return {
        severity: 'mild',
        recommendedBed: 'General',
        advice: `Your symptoms appear mild and manageable. General bed admission or outpatient care may be sufficient. Rest and hydration recommended.`,
        confidence: 0.75,
      };
    }
  }

  // Default classification based on symptom length (more symptoms = potentially more serious)
  const wordCount = symptomLower.split(/\s+/).length;
  if (wordCount > 10) {
    return {
      severity: 'moderate',
      recommendedBed: 'Oxygen',
      advice: `Multiple symptoms detected. Recommend moderate-level hospital care with oxygen support available.`,
      confidence: 0.6,
    };
  }

  // Safe default
  return {
    severity: 'mild',
    recommendedBed: 'General',
    advice: `Standard hospital bed recommended. Please consult with medical staff for proper evaluation.`,
    confidence: 0.5,
  };
}

/**
 * Main function: Analyze symptoms and return triage recommendation
 * Tries OpenAI first, falls back to rule-based analysis
 */
export async function analyzeSymptoms(symptoms: string): Promise<TriageResult> {
  // Validate input
  if (!symptoms || symptoms.trim().length === 0) {
    return {
      severity: 'mild',
      recommendedBed: 'General',
      advice: 'Please describe your symptoms for proper triage assessment.',
      confidence: 0,
    };
  }

  // Clean input
  const cleanSymptoms = symptoms.trim();

  // Try OpenAI first if available
  const openAIResult = await analyzeWithOpenAI(cleanSymptoms);
  if (openAIResult) {
    return openAIResult;
  }

  // Fall back to rule-based analysis
  return analyzeWithRules(cleanSymptoms);
}

/**
 * Map triage result to available bed types in the system
 * Helps filter hospitals based on recommended bed type
 */
export function mapRecommendationToAvailableBeds(
  recommendedBed: RecommendedBed
): string[] {
  const bedTypeMap: Record<RecommendedBed, string[]> = {
    General: ['General'],
    Oxygen: ['Oxygen', 'ICU'],
    ICU: ['ICU', 'Ventilator'],
    Ventilator: ['Ventilator', 'ICU'],
    Cardiac: ['Cardiac', 'ICU'],
  };

  return bedTypeMap[recommendedBed] || ['General'];
}
