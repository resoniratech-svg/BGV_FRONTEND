import DashboardLayout from "../../layouts/DashboardLayout";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { CheckCircle2, Circle, Eye, ArrowLeft } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

import { getCandidateDocuments } from "../../api/candidateApi";

interface DocumentItem {
  name: string;
  uploaded: boolean;
  isMandatory: boolean;
  fileName?: string[];
  fileData?: number[];
}

function CandidateDocuments() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [_candidateDocuments, setCandidateDocuments] = useState<any[]>([]);

  const [documents, setDocuments] = useState<DocumentItem[]>([
    { name: "Selfie", uploaded: false, isMandatory: true },
    { name: "Aadhaar", uploaded: false, isMandatory: true },
    { name: "PAN", uploaded: false, isMandatory: true },
    { name: "Passport", uploaded: false, isMandatory: false },
    { name: "Driving License", uploaded: false, isMandatory: false },
    { name: "Education", uploaded: false, isMandatory: true },
    { name: "Employment", uploaded: false, isMandatory: false },
    { name: "Salary Slip", uploaded: false, isMandatory: false },
    { name: "Resume", uploaded: false, isMandatory: true },
  ]);

  useEffect(() => {
    loadDocuments();
  }, [id]);

  const loadDocuments = async () => {
    try {
      const response = await getCandidateDocuments(Number(id));

      const docs = response.data || [];

      console.log("========== CANDIDATE DOCUMENTS ==========");
      console.log(docs);

      setCandidateDocuments(docs);

      setDocuments((prev) =>
        prev.map((doc) => {
          let uploadedDocs: any[] = [];

          // ==================================================
          // PASSPORT
          // ==================================================
          // Passport is now FRONT + BACK.
          //
          // Do NOT use the old generic "Passport" record
          // when Passport Front / Passport Back exist.
          // ==================================================

          if (doc.name === "Passport") {
            // ==================================================
            // PASSPORT FRONT + BACK
            // ==================================================

            const passportFront = docs.filter(
              (d: any) => d.document_type === "Passport Front",
            );

            const passportBack = docs.filter(
              (d: any) => d.document_type === "Passport Back",
            );

            if (passportFront.length > 0 || passportBack.length > 0) {
              uploadedDocs = [...passportFront, ...passportBack];
            } else {
              // Backward compatibility
              uploadedDocs = docs.filter(
                (d: any) => d.document_type === "Passport",
              );
            }
          } else if (doc.name === "Driving License") {
            // ==================================================
            // DRIVING LICENSE FRONT + BACK
            // ==================================================

            const drivingLicenseFront = docs.filter(
              (d: any) => d.document_type === "Driving License Front",
            );

            const drivingLicenseBack = docs.filter(
              (d: any) => d.document_type === "Driving License Back",
            );

            if (
              drivingLicenseFront.length > 0 ||
              drivingLicenseBack.length > 0
            ) {
              uploadedDocs = [...drivingLicenseFront, ...drivingLicenseBack];
            } else {
              // Backward compatibility
              uploadedDocs = docs.filter(
                (d: any) => d.document_type === "Driving License",
              );
            }
          } else {
            // ==================================================
            // ALL OTHER DOCUMENTS
            // ==================================================

            uploadedDocs = docs.filter(
              (d: any) => d.document_type === doc.name,
            );
          }

          return {
            ...doc,

            uploaded: uploadedDocs.length > 0,

            fileName: uploadedDocs.map((d: any) => d.original_filename),

            fileData: uploadedDocs.map((d: any) => d.id),
          };
        }),
      );
    } catch (error) {
      console.error("Failed to load candidate documents:", error);
    }
  };

  const openFileData = (documentId?: number | string) => {
    if (!documentId) {
      alert("Document not found");
      return;
    }

    const url = `${API_URL}/documents/${documentId}/view`;

    console.log("VIEW URL:", url);

    window.open(url, "_blank");
  };

  const verifyDocument = (_index?: number) => {
    alert("Verification feature will be connected later.");
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
            <h1 className="text-2xl font-bold text-gray-900">
              Document Review
            </h1>

            <p className="text-gray-500 text-sm mt-1">Review uploaded files</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <div className="divide-y divide-gray-50">
            {documents.map((doc, index) => (
              <div
                key={doc.name}
                className="flex items-center justify-between p-5"
              >
                {/* ==================================================
                    DOCUMENT INFORMATION
                ================================================== */}

                <div className="flex items-center gap-4">
                  {doc.uploaded ? (
                    <CheckCircle2 className="text-green-500" />
                  ) : (
                    <Circle className="text-gray-300" />
                  )}

                  <div>
                    <p className="font-semibold text-sm">
                      {doc.name}{" "}
                      {doc.isMandatory && (
                        <span className="text-red-500 text-xs">
                          (Mandatory)
                        </span>
                      )}
                    </p>

                    {doc.uploaded &&
                      Array.isArray(doc.fileName) &&
                      doc.fileName.map((fileName, fileIndex) => (
                        <p key={fileIndex} className="text-xs text-indigo-600">
                          File: {fileName}
                        </p>
                      ))}
                  </div>
                </div>

                {/* ==================================================
                    ACTION BUTTONS
                ================================================== */}

                <div className="flex gap-2">
                  {doc.uploaded &&
                    Array.isArray(doc.fileData) &&
                    doc.fileData.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {doc.fileData.map((documentId, documentIndex) => (
                          <button
                            key={documentId}
                            onClick={() => openFileData(documentId)}
                            className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-100 border border-indigo-100"
                          >
                            <Eye className="w-3.5 h-3.5" />

                            {doc.name === "Passport" ||
                            doc.name === "Driving License"
                              ? `View ${documentIndex === 0 ? "Front" : "Back"}`
                              : `View ${documentIndex + 1}`}
                          </button>
                        ))}
                      </div>
                    )}

                  <button
                    onClick={() => verifyDocument(index)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold ${
                      doc.uploaded
                        ? "bg-gray-100 text-gray-400"
                        : "bg-white border text-gray-700"
                    }`}
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
