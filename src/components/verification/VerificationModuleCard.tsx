import RiskBadge from "./RiskBadge";

type Props = {
  moduleName: string;
  status: string | null;
  riskLevel?: string;
  verificationStatus?: string;
  onVerify: () => void;
  onViewResult: () => void;
  onDecisionChange: (value: string) => void;
  decisionValue?: string;
};

function VerificationModuleCard({
  moduleName,
  riskLevel,
  verificationStatus,
  onVerify,
  onViewResult,
  onDecisionChange,
  decisionValue,
}: Props) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* View Button */}

      <button
        onClick={onViewResult}
        className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700"
      >
        {moduleName === "Resume Parsing" ? "View Resume" : "View Result"}
      </button>

      {/* Risk Badge / Parsed Badge */}

      {moduleName === "Resume Parsing" ? (
        <span
          className="
          px-4
          py-2
          rounded-xl
          bg-green-500
          text-white
          text-xs
          font-bold
          "
        >
          Parsed
        </span>
      ) : (
        <RiskBadge
          riskLevel={riskLevel}
          verificationStatus={verificationStatus}
        />
      )}

      {/* Decision Dropdown */}

      <select
        value={decisionValue || ""}
        onChange={(e) => onDecisionChange(e.target.value)}
        className="
        border
        rounded-xl
        px-3
        py-2
        text-xs
        "
      >
        <option value="" disabled>
          Decision
        </option>

        <option value="Verified">Verified</option>

        <option value="Not Verified">Not Verified</option>

        <option value="Fraud">Fraud</option>

        <option value="Rejected">Rejected</option>
      </select>

      {/* Verify Button */}

      <button
        onClick={onVerify}
        className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700"
      >
        {moduleName === "Resume Parsing" ? "Reparse" : "Reverify"}
      </button>
    </div>
  );
}

export default VerificationModuleCard;
