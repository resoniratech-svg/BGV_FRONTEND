const fs = require('fs');
const path = require('path');

const files = [
  { name: 'DeepfakeDetection.tsx', moduleKey: 'Deepfake Detection', statName: 'Authentic' },
  { name: 'ResumeParsing.tsx', moduleKey: 'Resume Parsing', statName: 'Parsed' },
  { name: 'EducationVerification.tsx', moduleKey: 'Education', statName: 'Verified' },
  { name: 'EmploymentVerification.tsx', moduleKey: 'Employment', statName: 'Verified' },
  { name: 'SalarySlipVerification.tsx', moduleKey: 'Salary Slip', statName: 'Verified' },
  { name: 'CreditBureauCheck.tsx', moduleKey: 'Credit Bureau', statName: 'Verified' },
  { name: 'CourtRecordVerification.tsx', moduleKey: 'Court Record', statName: 'Verified' },
  { name: 'GlobalWatchlistScreening.tsx', moduleKey: 'Watchlist', statName: 'Verified' }
];

const dir = path.join(process.cwd(), 'src/pages/verification');

files.forEach(({ name, moduleKey, statName }) => {
  const filePath = path.join(dir, name);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');

  // Find the hardcoded `<h2 className="text-4xl font-bold mt-2 text-green-500">0</h2>`
  // and replace it with `{localCandidates.filter(c => c.moduleStatuses?.["${moduleKey}"] === "Verified").length}`
  
  content = content.replace(
    /text-green-500">0<\/h2>/g,
    `text-green-500">{localCandidates.filter(c => c.moduleStatuses?.["${moduleKey}"] === "Verified").length}</h2>`
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed analytics in', name);
});

console.log("Done");
