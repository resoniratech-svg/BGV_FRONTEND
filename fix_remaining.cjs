const fs = require('fs');
const path = require('path');

const files = [
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

  // Fix implicit return map: c.id === candidateId ? { ...c, status: "Under Verification", progress: (c.progress || 0) + 16 } : c
  content = content.replace(
    /c\.id === candidateId \? \{ \.\.\.c, status: "Under Verification", progress: \(c\.progress \|\| 0\) \+ 16 \} : c/g,
    `c.id === candidateId ? { ...c, moduleStatuses: { ...(c.moduleStatuses || {}), "${moduleKey}": "Verified" }, status: "Under Verification", progress: Math.min(100, (c.progress || 0) + 15) } : c`
  );

  // Update filter logic
  content = content.replace(
    /\.filter\(\(c: Candidate\) => c\.status !== "Verified"\)/g,
    `.filter((c: Candidate) => c.status !== "Verified" && c.moduleStatuses?.["${moduleKey}"] !== "Verified")`
  );

  // Note: Most of these might not have a historical verified count, but if they do, we'll patch it later.
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed', name);
});

console.log("Done");
