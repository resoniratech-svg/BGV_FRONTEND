export const verificationModules = {
  "Resume Parsing": {
    type: "resume",
    key: "Resume Parsing",
  },

  Watchlist: {
    type: "watchlist",
    subtitle: "AML & Global Watchlist Screening",
    key: "Watchlist",
  },

  Aadhaar: {
    key: "aadhaar",
    type: "aadhaar",
    subtitle: "Aadhaar Verification",
  },

  PAN: {
    type: "pan",
    key: "PAN",
    subtitle: "PAN Verification",
  },

  Passport: {
    type: "passport",
    key: "Passport",
    subtitle: "Passport Verification",
  },

  "Driving License": {
    type: "driving-license",
    key: "Driving License",
    subtitle: "Driving License Verification",
  },

  "Face Match": {
    key: "Face Match",

    subtitle: "Compare Aadhaar face with selfie",

    type: "face-match",
  },

  "OCR Verification": {
    key: "OCR Verification",
    type: "ocr",
    subtitle: "OCR Text Extraction",
  },

  "Deepfake Detection": {
    type: "deepfake",
    key: "Deepfake Detection",
  },
  "Bank Statement": {
    key: "Bank Statement",
    type: "bank-statement",
    subtitle: "Analyze candidate bank statement and financial transactions",
  },

  Employment: {
    type: "employment",
    key: "Employment",
  },

  "Salary Slip": {
    type: "salary-slip",
    key: "Salary Slip",
    subtitle: "Salary Slip Verification",
  },

  "Credit Bureau": {
    key: "credit-bureau",
    type: "credit-bureau",
    subtitle: "Verify candidate credit history and bureau records",
  },

  "Court Record": {
    type: "ccrv",
    key: "Court Record",
    subtitle: "Court Record Verification",
  },
} as const;
