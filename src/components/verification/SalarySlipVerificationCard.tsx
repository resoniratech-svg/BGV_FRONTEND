import VerificationModuleCard from "./VerificationModuleCard";

interface Props {
  status: string;
  riskLevel: string;
  decisionValue: string;
  uanNumber?: string | null;
  onViewResult: () => void;
  onVerify: () => void;
  onDecisionChange: (value: string) => void;
}

function SalarySlipVerificationCard(props: Props) {
  const normalizedUAN = String(props.uanNumber ?? "").trim();

  const hasUAN =
    normalizedUAN !== "" &&
    normalizedUAN !== "-" &&
    normalizedUAN.toLowerCase() !== "null" &&
    normalizedUAN.toLowerCase() !== "undefined";

  return (
    <div className="w-full">
      <VerificationModuleCard
        moduleName="Salary Slip"
        status={props.status}
        riskLevel={props.riskLevel}
        decisionValue={props.decisionValue}
        onViewResult={props.onViewResult}
        onVerify={props.onVerify}
        onDecisionChange={props.onDecisionChange}
      />

      {/* UAN STATUS */}
      <div className="mt-4 border-t border-gray-200 pt-3">
        {hasUAN ? (
          <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
            <span className="text-base">✓</span>
            <span>UAN Found — Employment verification can be performed</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm font-semibold text-red-600">
            <span className="text-base">✕</span>
            <span>UAN Not Found — Manual employment verification required</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default SalarySlipVerificationCard;
