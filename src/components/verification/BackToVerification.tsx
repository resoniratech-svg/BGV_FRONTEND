import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function BackToVerification() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/verification")}
      className="
        flex
        items-center
        gap-2
        px-4
        py-2
        rounded-xl
        bg-white
        border
        border-gray-200
        text-[#5B5FEF]
        font-semibold
        hover:bg-[#F8FAFF]
        hover:border-[#5B5FEF]
        transition-all
      "
    >
      <ArrowLeft size={18} />
      Back
    </button>
  );
}

export default BackToVerification;

// import { ArrowLeft } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// function BackToVerification() {
//   const navigate = useNavigate();

//   return (
//     <button
//       onClick={() => navigate("/verification")}
//       className="mb-6 flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-sm"
//     >
//       <ArrowLeft size={18} />
//       Back to Verification Center
//     </button>
//   );
// }

// export default BackToVerification;