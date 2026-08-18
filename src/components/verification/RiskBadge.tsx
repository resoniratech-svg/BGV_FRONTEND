type Props = {
  riskLevel?: string;
  verificationStatus?: string;
};

function RiskBadge({ riskLevel, verificationStatus }: Props) {
  return (
    <button
      disabled
      className={`px-4 py-2 rounded-xl text-xs font-bold text-white ${
        verificationStatus
          ? verificationStatus === "MATCH"
            ? "bg-green-600"
            : verificationStatus === "NOT_MATCH"
              ? "bg-red-600"
              : "bg-gray-500"
          : riskLevel === "LOW"
            ? "bg-green-600"
            : riskLevel === "MEDIUM"
              ? "bg-yellow-500"
              : riskLevel === "HIGH"
                ? "bg-red-600"
                : "bg-gray-500"
      }`}
    >
      {verificationStatus
        ? verificationStatus === "MATCH"
          ? "Match"
          : verificationStatus === "NOT_MATCH"
            ? "Not Match"
            : "Unknown"
        : riskLevel === "LOW"
          ? "Low Risk"
          : riskLevel === "MEDIUM"
            ? "Medium Risk"
            : riskLevel === "HIGH"
              ? "Fraud Risk"
              : "Unknown"}
    </button>
  );
}

export default RiskBadge;
