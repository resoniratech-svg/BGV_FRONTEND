import React from "react";

type Props = {
  title: string;
  open: boolean;
  onClose: () => void;
  data: any;
};

function VerificationResultModal({
  title,
  open,
  onClose,
  data
}: Props) {

  if (!open) return null;

  return (

    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">

      <div className="bg-white rounded-3xl p-8 w-[1100px] max-h-[90vh] overflow-y-auto">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="text-red-500 font-bold"
          >
            Close
          </button>

        </div>

        {React.isValidElement(data) ? (

          data

        ) : (

          <pre className="bg-gray-50 rounded-xl p-4 text-sm overflow-auto">
            {JSON.stringify(
              data,
              null,
              2
            )}
          </pre>

        )}

      </div>

    </div>

  );
}

export default VerificationResultModal;