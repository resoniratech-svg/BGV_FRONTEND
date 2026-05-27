import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CheckCircle2, FileText, Loader2 } from "lucide-react";
import type { Candidate } from "../../types/Candidate";

function CandidatePortal() {
  const { id } = useParams<{ id: string }>();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Define all required documents
  const docTypes = ["Aadhaar", "PAN", "Passport", "Driving License", "Education", "Employment", "Resume"];
  
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, any>>({});

  // Fetch candidate details
  useEffect(() => {
    const saved = localStorage.getItem("candidates");
    const candidates = (saved ? JSON.parse(saved) : []) as Candidate[];
    const found = candidates.find((c) => String(c.id) === id);
    if (found) {
      setCandidate(found);
    }
  }, [id]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeDoc, setActiveDoc] = useState<string | null>(null);

  const triggerUpload = (docName: string) => {
    setActiveDoc(docName);
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && activeDoc) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const isMulti = activeDoc === "Education" || activeDoc === "Employment";
        
        setUploadedFiles(prev => {
          if (isMulti) {
            const names = prev[activeDoc] ? (Array.isArray(prev[activeDoc]) ? [...prev[activeDoc]] : [prev[activeDoc]]) : [];
            const datas = prev[`${activeDoc}_data`] ? (Array.isArray(prev[`${activeDoc}_data`]) ? [...prev[`${activeDoc}_data`]] : [prev[`${activeDoc}_data`]]) : [];
            return {
              ...prev,
              [activeDoc]: [...names, file.name],
              [`${activeDoc}_data`]: [...datas, reader.result as string]
            };
          } else {
            return { 
              ...prev, 
              [activeDoc]: file.name,
              [`${activeDoc}_data`]: reader.result as string 
            };
          }
        });
      };
      reader.readAsDataURL(file);
      // Reset input value to allow uploading the same file again if removed
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeFile = (doc: string, index: number) => {
    setUploadedFiles(prev => {
      const names = [...prev[doc]];
      const datas = [...prev[`${doc}_data`]];
      names.splice(index, 1);
      datas.splice(index, 1);
      return {
        ...prev,
        [doc]: names.length > 0 ? names : null,
        [`${doc}_data`]: datas.length > 0 ? datas : null
      };
    });
  };

  const submitAll = () => {
    const mandatory = ["Aadhaar", "PAN", "Resume", "Education"];
    const allMandatoryUploaded = mandatory.every(key => !!uploadedFiles[key]);
    
    if (!allMandatoryUploaded) {
      alert("Please upload all mandatory documents (Aadhaar, PAN, Resume, Education) before submitting.");
      return;
    }

    setIsUploading(true);
    setTimeout(() => {
      const saved = localStorage.getItem("candidates");
      const candidates: Candidate[] = saved ? JSON.parse(saved) : [];
      
      const updated = candidates.map(c => 
        String(c.id) === id 
          ? { 
              ...c, 
              status: "Documents Uploaded", 
              progress: 40,
              uploadedFiles: uploadedFiles 
            } 
          : c
      );
      
      try {
        localStorage.setItem("candidates", JSON.stringify(updated));
        setIsUploading(false);
        setSuccess(true);
      } catch (error) {
        console.error("Storage error:", error);
        alert("Upload failed: Your documents are too large for the local browser storage simulation. Please upload smaller files (under 1MB) or use the 'Simulate Upload' button in the Admin Dashboard.");
        setIsUploading(false);
      }
    }, 1500);
  };

  // If submission is successful, show the success screen
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md border border-gray-100">
          <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900">Upload Successful</h1>
          <p className="text-gray-600 mt-4">Thank you, {candidate?.name || "Candidate"}. Your documents have been submitted for verification.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-12">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.jpg,.png" />
      
      <div className="max-w-3xl mx-auto space-y-6 md:space-y-8">
        {/* Candidate Info Header */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Verification Portal</h1>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold">Name</p>
              <p className="font-semibold text-gray-800">{candidate?.name || "Loading..."}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold">Email</p>
              <p className="font-semibold text-gray-800">{candidate?.email || "Loading..."}</p>
            </div>
          </div>
        </div>

        {/* Upload Checklist */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-4">
          <h3 className="font-bold text-lg mb-4">Required Documents</h3>
          {docTypes.map((doc) => {
            const isMulti = doc === "Education" || doc === "Employment";
            const files = uploadedFiles[doc];
            const hasFiles = Array.isArray(files) ? files.length > 0 : !!files;

            return (
              <div key={doc} className="flex flex-col p-4 border rounded-2xl bg-gray-50/50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <FileText className={`flex-shrink-0 ${hasFiles ? "text-green-500" : "text-indigo-500"}`} />
                    <div className="overflow-hidden">
                      <span className="font-semibold block">{doc}</span>
                      {!isMulti && hasFiles && <p className="text-xs text-green-600 truncate max-w-[200px]">{files}</p>}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                    {hasFiles && !isMulti ? (
                      <button onClick={() => triggerUpload(doc)} className="text-xs font-bold text-red-500 hover:text-red-700">
                        Replace
                      </button>
                    ) : (
                      <button onClick={() => triggerUpload(doc)} className="text-sm font-bold text-indigo-600 hover:text-indigo-700">
                        {hasFiles && isMulti ? "Add More" : "Upload"}
                      </button>
                    )}
                    {hasFiles && !isMulti && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                  </div>
                </div>

                {isMulti && hasFiles && (
                  <div className="mt-3 pl-8 space-y-2 border-t border-gray-200 pt-3">
                    {files.map((fileName: string, idx: number) => (
                      <div key={idx} className="flex items-center justify-between bg-white p-2 px-3 rounded-lg border border-gray-100 text-sm shadow-sm">
                        <span className="text-green-600 font-medium truncate max-w-[200px]">{fileName}</span>
                        <button 
                          onClick={() => removeFile(doc, idx)}
                          className="text-red-500 hover:text-red-700 text-xs font-bold"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <button 
            onClick={submitAll} 
            disabled={isUploading} 
            className="w-full bg-[#5B5FEF] text-white py-4 rounded-2xl font-bold mt-6 hover:bg-[#4B4FD8] transition-all"
          >
            {isUploading ? <Loader2 className="animate-spin" /> : "Submit Documents"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CandidatePortal;