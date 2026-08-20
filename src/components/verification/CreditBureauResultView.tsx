interface CreditBureauResultViewProps {
  data: any;
}

const CreditBureauResultView = ({ data }: CreditBureauResultViewProps) => {
  const result = data?.data?.data ?? data?.data ?? data ?? {};

  const creditResult = result?.credit_bureau_result ?? {};
  const personal = result?.personal_information ?? {};
  const contact = result?.contact_information ?? [];
  const accounts = result?.credit_accounts ?? [];
  const summary = result?.summary ?? {};
  const scoreFactors = result?.score_factors ?? [];

  return (
    <div className="space-y-6">
      {/* =====================================================
          VERIFICATION SUMMARY
      ===================================================== */}

      <div className="border rounded-2xl p-5 bg-gray-50">
        <h3 className="text-lg font-bold mb-4">Credit Bureau Verification</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500">Provider</p>
            <p className="font-semibold">
              {creditResult.provider_name || "GRIDLINES"}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Verification Status</p>
            <p className="font-semibold">
              {creditResult.verification_status || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Response Code</p>
            <p className="font-semibold">
              {creditResult.response_code || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Response Message</p>
            <p className="font-semibold">
              {creditResult.response_message || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          CREDIT SCORE
      ===================================================== */}

      <div className="border rounded-2xl p-5">
        <h3 className="text-lg font-bold mb-4">Credit Score</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-indigo-50 rounded-xl p-4">
            <p className="text-xs text-gray-500">Credit Score</p>

            <p className="text-3xl font-bold text-indigo-600">
              {summary.credit_score ?? "N/A"}
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500">Score Name</p>

            <p className="font-semibold">{summary.score_name || "N/A"}</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500">Score Version</p>

            <p className="font-semibold">{summary.score_version || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* =====================================================
          PERSONAL INFORMATION
      ===================================================== */}

      <div className="border rounded-2xl p-5">
        <h3 className="text-lg font-bold mb-4">Personal Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500">Full Name</p>
            <p className="font-semibold">{personal.full_name || "N/A"}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500">First Name</p>
            <p className="font-semibold">{personal.first_name || "N/A"}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Last Name</p>
            <p className="font-semibold">{personal.last_name || "N/A"}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Gender</p>
            <p className="font-semibold">{personal.gender || "N/A"}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Date of Birth</p>
            <p className="font-semibold">{personal.date_of_birth || "N/A"}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500">PAN</p>
            <p className="font-semibold">{personal.pan_number || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <div className="border rounded-2xl p-5">
        <h3 className="text-lg font-bold mb-4">Credit Summary</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-xs text-gray-500">Total Accounts</p>
            <p className="text-xl font-bold">{summary.total_accounts ?? 0}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-xs text-gray-500">Active Accounts</p>
            <p className="text-xl font-bold">{summary.active_accounts ?? 0}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-xs text-gray-500">Past Due Accounts</p>
            <p className="text-xl font-bold">
              {summary.past_due_accounts ?? 0}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-xs text-gray-500">Write Off Accounts</p>
            <p className="text-xl font-bold">
              {summary.write_off_accounts ?? 0}
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          CREDIT ACCOUNTS
      ===================================================== */}

      <div className="border rounded-2xl p-5">
        <h3 className="text-lg font-bold mb-4">Credit Accounts</h3>

        {accounts.length === 0 ? (
          <p className="text-gray-500">No credit accounts found.</p>
        ) : (
          <div className="space-y-3">
            {accounts.map((account: any, index: number) => (
              <div
                key={account.id || index}
                className="border rounded-xl p-4 bg-gray-50"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Institution</p>
                    <p className="font-semibold">
                      {account.institution || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Account Type</p>
                    <p className="font-semibold">
                      {account.account_type || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Account Status</p>
                    <p className="font-semibold">
                      {account.account_status || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Balance</p>
                    <p className="font-semibold">{account.balance ?? "N/A"}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Past Due Amount</p>
                    <p className="font-semibold">
                      {account.past_due_amount ?? "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Date Opened</p>
                    <p className="font-semibold">
                      {account.date_opened || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* =====================================================
          SCORE FACTORS
      ===================================================== */}

      <div className="border rounded-2xl p-5">
        <h3 className="text-lg font-bold mb-4">Score Factors</h3>

        {scoreFactors.length === 0 ? (
          <p className="text-gray-500">No score factors found.</p>
        ) : (
          <div className="space-y-3">
            {scoreFactors.map((factor: any, index: number) => (
              <div
                key={factor.id || index}
                className="bg-gray-50 border rounded-xl p-4"
              >
                <p className="font-semibold">
                  {factor.factor_type || "Factor"}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  Code: {factor.factor_code || "N/A"}
                </p>

                <p className="text-sm mt-2">{factor.description || "N/A"}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* =====================================================
          CONTACT INFORMATION
      ===================================================== */}

      <div className="border rounded-2xl p-5">
        <h3 className="text-lg font-bold mb-4">Contact Information</h3>

        {contact.length === 0 ? (
          <p className="text-gray-500">No contact information found.</p>
        ) : (
          <div className="space-y-3">
            {contact.map((item: any, index: number) => (
              <div
                key={item.id || index}
                className="border rounded-xl p-4 bg-gray-50"
              >
                <p className="text-xs text-gray-500">{item.contact_type}</p>

                <p className="font-semibold">{item.value || "N/A"}</p>

                {item.state && (
                  <p className="text-sm text-gray-500">{item.state}</p>
                )}

                {item.pincode && (
                  <p className="text-sm text-gray-500">PIN: {item.pincode}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreditBureauResultView;
