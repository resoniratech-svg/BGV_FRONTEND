import DashboardLayout from "../../layouts/DashboardLayout";
import BackToVerification from "../../components/verification/BackToVerification";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { useVerificationModule } from "../../hooks/useVerificationModule";
import VerificationStatsCards from "../../components/verification/VerificationStatsCards";

interface BankStatementRequest {
  id: string;
  candidateId: number;
  candidate: string;
  bankName: string;
  status: string;
}

function BankStatementVerification() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // =========================================================
  // UNIFIED VERIFICATION MODULE
  // =========================================================

  const { stats, candidates, activeFilter, loadCandidatesByStatus } =
    useVerificationModule("bank-statement");

  // =========================================================
  // OPEN CANDIDATE VERIFICATION
  // =========================================================

  const verifyBankStatement = (candidateId: number) => {
    navigate(`/verification/candidate/${candidateId}`, {
      state: {
        from: "bank-statement",
      },
    });
  };

  // =========================================================
  // MAP CANDIDATES TO BANK STATEMENT REQUESTS
  // =========================================================

  const bankStatementRequests: BankStatementRequest[] = candidates.map(
    (candidate) => ({
      id: `BANK-${candidate.candidate_id}`,

      candidateId: candidate.candidate_id,

      candidate:
        candidate.candidate_name || candidate.full_name || "Unknown Candidate",

      bankName: candidate.bank_name || "Not Provided",

      status: candidate.status || "PENDING",
    }),
  );

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredRequests = bankStatementRequests.filter((item) => {
    const searchValue = search.toLowerCase().trim();

    if (!searchValue) {
      return true;
    }

    return (
      item.candidate.toLowerCase().includes(searchValue) ||
      item.id.toLowerCase().includes(searchValue) ||
      item.bankName.toLowerCase().includes(searchValue)
    );
  });

  return (
    <DashboardLayout>
      <BackToVerification />

      <div className="space-y-8 max-w-6xl mx-auto pb-12 mt-4">
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Bank Statement Verification Engine
            </h1>

            <p className="text-gray-500 mt-2">
              Verify candidate bank statements and analyze financial transaction
              records
            </p>
          </div>

          <div className="bg-green-50 text-green-700 border border-green-100 px-5 py-4 rounded-2xl font-semibold text-sm shadow-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />

            <span>Records generated automatically from Verification Queue</span>
          </div>
        </div>

        {/* =====================================================
            VERIFICATION STATISTICS
        ====================================================== */}

        <VerificationStatsCards
          stats={stats}
          activeFilter={activeFilter}
          onFilterChange={loadCandidatesByStatus}
        />

        {/* =====================================================
            BANK STATEMENT REQUESTS
        ====================================================== */}

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {/* =====================================================
              TABLE HEADER
          ====================================================== */}

          <div className="p-6 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4 bg-white">
            <h2 className="text-xl font-bold text-gray-900">
              Bank Statement Verification Requests
            </h2>

            <input
              type="text"
              placeholder="Search by name, ID or bank..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#F5F7FB] border border-gray-200 rounded-2xl px-5 py-3.5 outline-none w-full sm:w-[320px] text-sm focus:bg-white focus:border-[#5B5FEF] transition-all"
            />
          </div>

          {/* =====================================================
              TABLE
          ====================================================== */}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead className="bg-[#F8FAFC]">
                <tr>
                  <th className="p-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Request ID
                  </th>

                  <th className="p-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Candidate
                  </th>

                  <th className="p-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Bank Name
                  </th>

                  <th className="p-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>

                  <th className="p-6 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-[#FAFBFF] transition-all"
                    >
                      {/* =================================================
                          REQUEST ID
                      ================================================== */}

                      <td className="p-6 font-bold text-sm text-gray-900">
                        {item.id}
                      </td>

                      {/* =================================================
                          CANDIDATE
                      ================================================== */}

                      <td className="p-6 text-sm text-gray-800 font-semibold">
                        {item.candidate}
                      </td>

                      {/* =================================================
                          BANK NAME
                      ================================================== */}

                      <td className="p-6 text-sm text-gray-600 font-medium">
                        {item.bankName}
                      </td>

                      {/* =================================================
                          STATUS
                      ================================================== */}

                      <td className="p-6">
                        <span className="bg-amber-50 text-amber-600 px-3 py-1.5 rounded-full text-xs font-bold border border-amber-100">
                          {item.status}
                        </span>
                      </td>

                      {/* =================================================
                          ACTION
                      ================================================== */}

                      <td className="p-6 text-center">
                        <button
                          onClick={() => verifyBankStatement(item.candidateId)}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all"
                        >
                          Verify Bank Statement
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-16 text-center text-gray-400 font-medium text-sm"
                    >
                      No active bank statement verification requests pending.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default BankStatementVerification;
