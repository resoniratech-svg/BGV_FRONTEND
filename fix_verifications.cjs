const fs = require('fs');
const path = require('path');

const files = [
  { name: 'AadhaarVerification.tsx', moduleKey: 'Aadhaar' },
  { name: 'PANVerification.tsx', moduleKey: 'PAN' },
  { name: 'PassportVerification.tsx', moduleKey: 'Passport' },
  { name: 'DLVerification.tsx', moduleKey: 'Driving License' },
  { name: 'FaceMatch.tsx', moduleKey: 'Face Match' },
  { name: 'OCRVerification.tsx', moduleKey: 'OCR Verification' },
  { name: 'DeepfakeDetection.tsx', moduleKey: 'Deepfake Detection' },
  { name: 'ResumeParsing.tsx', moduleKey: 'Resume Parsing' },
  { name: 'EducationVerification.tsx', moduleKey: 'Education' },
  { name: 'EmploymentVerification.tsx', moduleKey: 'Employment' },
  { name: 'SalarySlipVerification.tsx', moduleKey: 'Salary Slip' },
  { name: 'CreditBureauCheck.tsx', moduleKey: 'Credit Bureau' },
  { name: 'CourtRecordVerification.tsx', moduleKey: 'Court Record' },
  { name: 'GlobalWatchlistScreening.tsx', moduleKey: 'Watchlist' }
];

const dir = path.join(process.cwd(), 'src/pages/verification');

files.forEach(({ name, moduleKey }) => {
  const filePath = path.join(dir, name);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');

  // Replace mapping logic inside verify function
  content = content.replace(
    /return \{\s*\.\.\.candidate,[\s\S]*?\};\s*\}/g,
    `return {
          ...candidate,
          moduleStatuses: { ...(candidate.moduleStatuses || {}), "${moduleKey}": "Verified" },
          status: "Under Verification",
          progress: Math.min(100, (candidate.progress || 0) + 15),
        };
      }`
  );

  // Update filter logic for queue requests
  content = content.replace(
    /\.filter\(\(candidate: Candidate\) => [^\n]+ !== "Verified" && [^\n]+ !== "Completed"\)/g,
    `.filter((candidate: Candidate) => candidate.status !== "Verified" && candidate.moduleStatuses?.["${moduleKey}"] !== "Verified")`
  );
  
  // Update historical verified count logic
  content = content.replace(
    /localCandidates\.filter\(\(c: Candidate\) => c\.[a-zA-Z]+Status === "Completed"\)\.length/g,
    `localCandidates.filter((c: Candidate) => c.moduleStatuses?.["${moduleKey}"] === "Verified").length`
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed', name);
});

console.log("Done");
