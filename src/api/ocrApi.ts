import axios from "./axios";

export const processOCR = async (
  file: File,
  candidateId: number,
  documentType: string
) => {

  const formData = new FormData();

  formData.append(
    "file",
    file
  );

  formData.append(
    "candidate_id",
    String(candidateId)
  );

  formData.append(
    "document_type",
    documentType
  );

  const response =
    await axios.post(
      "/ocr",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data"
        }
      }
    );

  return response.data;
};

export const processOCRDocument = async (
  documentId: number,
  candidateId: number
) => {

  const response =
    await axios.post(
      "/ocr/document",
      {
        document_id: documentId,
        candidate_id: candidateId
      }
    );

  return response.data;
};