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

  // Find the verify function (e.g. verifyAadhaar, verifyPan, verifyCandidate)
  // We will replace the entire mapping logic inside the verify function.
  // The logic usually looks like:
  /*
    const updated = freshMasterList.map((candidate: Candidate) => {
      if (candidate.id === candidateId) {
        return {
          ...candidate,
          aadhaarStatus: "Completed",
          status: "Under Verification",
          progress: (candidate.progress || 0) + 16,
        };
      }
      return candidate;
    });
  */

  // Replace the mapping block with dynamic moduleStatus update
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

  // Update the filtered list logic to use moduleStatuses
  // Usually it looks like: candidate.aadhaarStatus !== "Completed"
  content = content.replace(
    /\.filter\(\(candidate: Candidate\) => [^\n]+ !== "Verified" && [^\n]+ !== "Completed"\)/g,
    `.filter((candidate: Candidate) => candidate.status !== "Verified" && candidate.moduleStatuses?.["${moduleKey}"] !== "Verified")`
  );
  
  // Also fix historicVerifiedCount
  // localCandidates.filter((c: Candidate) => c.aadhaarStatus === "Completed").length
  content = content.replace(
    /localCandidates\.filter\(\(c: Candidate\) => c\.[a-zA-Z]+Status === "Completed"\)\.length/g,
    `localCandidates.filter((c: Candidate) => c.moduleStatuses?.["${moduleKey}"] === "Verified").length`
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed', name);
});

console.log("Done");
