import DashboardLayout from "../../layouts/DashboardLayout";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Download } from "lucide-react";
import { viewReport, downloadReport } from "../../api/reportApi";

export default function ViewReport() {
  const { candidateId } = useParams();

  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      const response = await viewReport(Number(candidateId));
      setReport(response.data);
    } catch (err) {
      console.error(err);
      alert("Unable to load report");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await downloadReport(Number(candidateId));

      const blob = response.data;

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      const disposition = response.headers["content-disposition"];

      let filename = "BGV_Report.pdf";

      if (disposition) {
        const match = disposition.match(/filename="?([^"]+)"?/);

        if (match?.[1]) {
          filename = match[1];
        }
      }

      link.download = filename;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Unable to download report");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-10">Loading...</div>
      </DashboardLayout>
    );
  }

  if (!report) {
    return (
      <DashboardLayout>
        <div className="p-10">Report not found.</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto py-10 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-5xl font-bold">Background Verification Report</h1>

          <button
            onClick={handleDownload}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl flex items-center gap-2"
          >
            <Download size={18} />
            Download PDF
          </button>
        </div>

        {/* Candidate Summary */}

        <div className="bg-white rounded-2xl shadow border">
          <div className="border-b p-5">
            <h2 className="text-2xl font-bold">1. Candidate Summary</h2>
          </div>

          <table className="w-full">
            <tbody>
              <Row label="Full Name" value={report.candidate_name} />

              <Row label="Email" value={report.email} />

              <Row label="Phone" value={report.phone} />

              <Row label="Candidate ID" value={report.candidate_id} />
            </tbody>
          </table>
        </div>

        {/* Verification Status */}

        <div className="bg-white rounded-2xl shadow border">
          <div className="border-b p-5">
            <h2 className="text-2xl font-bold">
              2. Verification Module Status
            </h2>
          </div>

          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-4">Verification Module</th>

                <th className="text-left p-4">Status</th>
              </tr>
            </thead>

            <tbody>
              <StatusRow module="Aadhaar" status={report.aadhaar_status} />
              <StatusRow module="PAN" status={report.pan_status} />
              <StatusRow module="Passport" status={report.passport_status} />
              <StatusRow module="Driving License" status={report.dl_status} />
              <StatusRow
                module="Face Match"
                status={report.face_match_status}
              />
              <StatusRow
                module="Resume Parsing"
                status={report.resume_status}
              />
              <StatusRow module="Education" status={report.education_status} />
              <StatusRow
                module="Employment"
                status={report.employment_status}
              />
              <StatusRow
                module="Salary Slip"
                status={report.salary_slip_status}
              />
              <StatusRow module="Credit Bureau" status={report.credit_status} />
              <StatusRow module="Court Record" status={report.court_status} />
              <StatusRow module="Watchlist" status={report.watchlist_status} />
              <StatusRow
                module="Deepfake Detection"
                status={report.deepfake_status}
              />
            </tbody>
          </table>
        </div>

        {/* Final Assessment */}

        <div className="bg-white rounded-2xl shadow border">
          <div className="border-b p-5">
            <h2 className="text-2xl font-bold">
              3. Final Executive Assessment
            </h2>
          </div>

          <table className="w-full">
            <tbody>
              <Row label="Overall Status" value={report.overall_status} />

              <Row label="Risk Level" value={report.risk_level} />
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

function Row({ label, value }: { label: string; value: any }) {
  return (
    <tr className="border-b">
      <td className="bg-gray-100 font-semibold w-72 p-4">{label}</td>

      <td className="p-4">{value || "Pending"}</td>
    </tr>
  );
}

function StatusRow({ module, status }: { module: string; status: any }) {
  return (
    <tr className="border-b">
      <td className="p-4">{module}</td>

      <td className="p-4 font-medium">{status || "Pending"}</td>
    </tr>
  );
}
