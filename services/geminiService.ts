import { GoogleGenAI, Type } from "@google/genai";
import { CertificateDetails, ExplanationLevel } from "../types";

// Initialize Gemini Client
// Note: In a real-world scenario, certificate fetching would happen via a backend proxy.
// Here, we use Gemini to "simulate" the analysis of a public domain's likely certificate configuration
// or to explain concepts based on user input.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchCertificateDetails = async (domain: string): Promise<CertificateDetails> => {
  try {
    // We ask Gemini to provide realistic certificate data for the requested domain.
    // This acts as a sophisticated simulation for this frontend-only demo.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze the SSL/TLS certificate configuration typically found for the domain: ${domain}. 
      Return a JSON object simulating the details of its current active certificate.
      Ensure dates are relative to today (current year).
      Use standard issuers (like DigiCert, Let's Encrypt, etc).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            commonName: { type: Type.STRING },
            issuer: { type: Type.STRING },
            validFrom: { type: Type.STRING, description: "ISO date string" },
            validTo: { type: Type.STRING, description: "ISO date string" },
            algorithm: { type: Type.STRING, description: "e.g., RSA, ECDSA" },
            keySize: { type: Type.STRING, description: "e.g., 2048 bits, 256 bits" },
            signatureAlgorithm: { type: Type.STRING, description: "e.g., SHA-256 with RSA" },
            serialNumber: { type: Type.STRING },
            isTrusted: { type: Type.BOOLEAN }
          },
          required: ["commonName", "issuer", "validFrom", "validTo", "algorithm", "keySize", "signatureAlgorithm", "serialNumber", "isTrusted"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as CertificateDetails;
  } catch (error) {
    console.error("Error fetching certificate details:", error);
    // Fallback data if AI fails
    return {
      commonName: domain,
      issuer: "Simulated CA",
      validFrom: new Date().toISOString(),
      validTo: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
      algorithm: "RSA",
      keySize: "2048 bits",
      signatureAlgorithm: "SHA-256",
      serialNumber: "00:AB:CD:EF:12:34:56",
      isTrusted: true
    };
  }
};

export const getAIExplanation = async (domain: string, level: ExplanationLevel): Promise<string> => {
  let prompt = "";
  switch (level) {
    case ExplanationLevel.Beginner:
      prompt = `Explain how HTTPS protects the website ${domain} in very simple terms, like explaining to a 10-year-old. Use metaphors (like a locked box or a secret language). Keep it under 100 words.`;
      break;
    case ExplanationLevel.Normal:
      prompt = `Explain the security configuration of ${domain} for a general internet user. Mention the certificate authority and why encryption matters. Keep it under 120 words.`;
      break;
    case ExplanationLevel.Technical:
      prompt = `Provide a technical breakdown of the SSL/TLS handshake and certificate validity for ${domain}. Discuss RSA/ECDSA, key exchange, and the chain of trust. Keep it under 150 words.`;
      break;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Could not generate explanation.";
  } catch (error) {
    console.error("Error generating explanation:", error);
    return "AI service temporarily unavailable for explanations.";
  }
};