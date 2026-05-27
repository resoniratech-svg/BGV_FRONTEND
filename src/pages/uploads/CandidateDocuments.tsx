import DashboardLayout from "../../layouts/DashboardLayout";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { CheckCircle2, Circle, Eye, ArrowLeft } from "lucide-react";
import type { Candidate } from "../../types/Candidate";

interface DocumentItem {
  name: string;
  uploaded: boolean;
  isMandatory: boolean;
  fileName?: string | string[];
  fileData?: string | string[];
}

function CandidateDocuments() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const savedCandidates = localStorage.getItem("candidates");
  const candidateList: Candidate[] = savedCandidates ? JSON.parse(savedCandidates) : [];
  const currentCandidate = candidateList.find((c: Candidate) => String(c.id) === String(id));

  const uploadedFilesFromPortal = (currentCandidate as any)?.uploadedFiles || {};

  const [documents, setDocuments] = useState<DocumentItem[]>([
    { name: "Aadhaar", uploaded: false, isMandatory: true },
    { name: "PAN", uploaded: false, isMandatory: true },
    { name: "Passport", uploaded: false, isMandatory: false },
    { name: "Driving License", uploaded: false, isMandatory: false },
    { name: "Education", uploaded: false, isMandatory: true },
    { name: "Employment", uploaded: false, isMandatory: false },
    { name: "Resume", uploaded: false, isMandatory: true },
  ]);

  useEffect(() => {
    if (currentCandidate) {
      setDocuments(prev => prev.map(d => ({
        ...d,
        uploaded: !!uploadedFilesFromPortal[d.name],
        fileName: uploadedFilesFromPortal[d.name],
        fileData: uploadedFilesFromPortal[`${d.name}_data`]
      })));
    }
  }, [currentCandidate, uploadedFilesFromPortal]);

  const openFileData = (data?: string | string[]) => {
    if (data && !Array.isArray(data)) {
      const win = window.open();
      win?.document.write(`<iframe src="${data}" width="100%" height="100%" frameborder="0"></iframe>`);
    } else {
      alert("No file data available for this document in storage.");
    }
  };

  const verifyDocument = (index: number) => {
    const updatedDocs = documents.map((doc, i) => i === index ? { ...doc, uploaded: true } : doc);
    setDocuments(updatedDocs);

    if (currentCandidate) {
      const docName = documents[index].name;
      const updatedCandidate = {
        ...currentCandidate,
        uploadedFiles: {
          ...(currentCandidate as any).uploadedFiles,
          [docName]: `${docName.toLowerCase()}_manual_upload.pdf`
        }
      };
      const updatedList = candidateList.map(c => c.id === currentCandidate.id ? updatedCandidate : c);
      localStorage.setItem("candidates", JSON.stringify(updatedList));
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl mx-auto pb-12">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Document Review</h1>
            <p className="text-gray-500 text-sm mt-1">Review uploaded files</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <div className="divide-y divide-gray-50">
            {documents.map((doc, index) => (
              <div key={doc.name} className="flex items-center justify-between p-5">
                <div className="flex items-center gap-4">
                  {doc.uploaded ? <CheckCircle2 className="text-green-500" /> : <Circle className="text-gray-300" />}
                  <div>
                    <p className="font-semibold text-sm">{doc.name} {doc.isMandatory && <span className="text-red-500 text-xs">(Mandatory)</span>}</p>
                    {doc.uploaded && (
                      Array.isArray(doc.fileName)
                        ? doc.fileName.map((f, i) => <p key={i} className="text-xs text-indigo-600">File: {f}</p>)
                        : <p className="text-xs text-indigo-600">File: {doc.fileName || "Uploaded"}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  {/* View Button: Forced to show if uploaded */}
                  {doc.uploaded && (
                    Array.isArray(doc.fileData) ? (
                      <div className="flex gap-2 flex-wrap">
                        {doc.fileData.map((fd: string, idx: number) => (
                          <button 
                            key={idx}
                            onClick={() => openFileData(fd)}
                            className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-100 border border-indigo-100"
                          >
                            <Eye className="w-3.5 h-3.5" /> View {idx + 1}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <button 
                        onClick={() => openFileData(doc.fileData as string)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-100 border border-indigo-100"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                    )
                  )}
                  <button 
                    onClick={() => verifyDocument(index)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold ${doc.uploaded ? "bg-gray-100 text-gray-400" : "bg-white border text-gray-700"}`}
                  >
                    {doc.uploaded ? "Verified" : "Mark as Received"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
export default CandidateDocuments;