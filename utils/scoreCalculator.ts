import { CertificateDetails, SecurityScoreData } from "../types";

export const calculateSecurityScore = (cert: CertificateDetails): SecurityScoreData => {
  let score = 100;
  const breakdown = [];

  // 1. Trusted Authority check
  if (cert.isTrusted) {
    breakdown.push({ label: "Trusted CA", passed: true, weight: 0 });
  } else {
    score -= 40;
    breakdown.push({ label: "Untrusted CA", passed: false, weight: 40 });
  }

  // 2. Algorithm Strength
  const isStrongKey = cert.keySize.includes("2048") || cert.keySize.includes("4096") || cert.keySize.includes("256") || cert.keySize.includes("384");
  if (isStrongKey) {
    breakdown.push({ label: "Strong Key Size", passed: true, weight: 0 });
  } else {
    score -= 20;
    breakdown.push({ label: "Weak Key Size", passed: false, weight: 20 });
  }

  // 3. Signature Algorithm
  if (cert.signatureAlgorithm.includes("SHA-256") || cert.signatureAlgorithm.includes("SHA-384")) {
    breakdown.push({ label: "Secure Signature (SHA-2)", passed: true, weight: 0 });
  } else {
    score -= 15;
    breakdown.push({ label: "Weak Signature (SHA-1/MD5)", passed: false, weight: 15 });
  }

  // 4. Validity
  const validTo = new Date(cert.validTo);
  const daysRemaining = Math.ceil((validTo.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysRemaining > 30) {
    breakdown.push({ label: "Valid Expiration (>30 days)", passed: true, weight: 0 });
  } else if (daysRemaining > 0) {
    score -= 10;
    breakdown.push({ label: "Expiring Soon", passed: false, weight: 10 });
  } else {
    score -= 30;
    breakdown.push({ label: "Expired", passed: false, weight: 30 });
  }

  // Clamp score
  score = Math.max(0, Math.min(100, score));

  let grade: SecurityScoreData['grade'] = 'F';
  let color = '#ef4444'; // red

  if (score >= 90) { grade = 'A+'; color = '#10b981'; } // green
  else if (score >= 80) { grade = 'A'; color = '#34d399'; }
  else if (score >= 70) { grade = 'B'; color = '#6366f1'; } // indigo
  else if (score >= 50) { grade = 'C'; color = '#f59e0b'; } // amber
  else if (score >= 30) { grade = 'D'; color = '#f97316'; } // orange

  return { score, grade, color, breakdown };
};