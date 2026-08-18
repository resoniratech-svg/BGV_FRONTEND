function DeepfakeResultView({ data }: any) {
  const probability = data?.fake_probability || 0;

  const status = data?.verification_status || "-";

  const percentage = (probability * 100).toFixed(2);

  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <p className="text-gray-500">Verification Status</p>

        <p
          className={
            status === "REAL"
              ? "font-bold text-green-600"
              : "font-bold text-red-600"
          }
        >
          {status}
        </p>
      </div>

      <div>
        <p className="text-gray-500">Fake Probability</p>

        <p className="font-bold">{percentage}%</p>
      </div>

      <div>
        <p className="text-gray-500">Risk Level</p>

        <p
          className={
            probability < 0.5
              ? "font-bold text-green-600"
              : "font-bold text-red-600"
          }
        >
          {probability < 0.5 ? "LOW" : "HIGH"}
        </p>
      </div>

      <div>
        <p className="text-gray-500">Message</p>

        <p className="font-bold">{data?.display_message || "-"}</p>
      </div>
    </div>
  );
}

export default DeepfakeResultView;
