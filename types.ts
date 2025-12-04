export interface CertificateDetails {
  commonName: string;
  issuer: string;
  validFrom: string;
  validTo: string;
  algorithm: string;
  keySize: string;
  signatureAlgorithm: string;
  serialNumber: string;
  isTrusted: boolean;
}

export interface SecurityScoreData {
  score: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  color: string;
  breakdown: {
    label: string;
    passed: boolean;
    weight: number;
  }[];
}

export enum ExplanationLevel {
  Beginner = 'Beginner',
  Normal = 'Normal',
  Technical = 'Technical',
}

export enum AnimationStep {
  Idle = 0,
  ClientHello = 1,
  ServerHello = 2,
  KeyExchange = 3,
  Secure = 4,
}