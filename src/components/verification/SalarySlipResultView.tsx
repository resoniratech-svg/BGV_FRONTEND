interface Props {
  data: any;
}

function SalarySlipResultView({ data }: Props) {
  const result = data?.data || data || {};

  const fields = [
    {
      label: "Employee Name",
      value: result.employee_name,
    },
    {
      label: "Employee ID",
      value: result.employee_id,
    },
    {
      label: "Designation",
      value: result.designation,
    },
    {
      label: "Grade",
      value: result.grade,
    },
    {
      label: "Company",
      value: result.company_business_name,
    },
    {
      label: "PAN Number",
      value: result.pan_number,
    },
    {
      label: "UAN Number",
      value: result.uan_number,
    },
    {
      label: "PF Number",
      value: result.pf_number,
    },
    {
      label: "Bank Account",
      value: result.bank_account_number
        ? `******${String(result.bank_account_number).slice(-4)}`
        : null,
    },
    {
      label: "Office State",
      value: result.office_state,
    },
    {
      label: "Joining Date",
      value: result.joining_date,
    },
    {
      label: "Payslip Date",
      value: result.payslip_date,
    },
    {
      label: "PF Amount",
      value: result.pf_amount,
    },
    {
      label: "Net Pay",
      value: result.net_pay,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Salary Slip Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {fields.map((field) => (
            <div key={field.label} className="bg-gray-50 rounded-2xl p-4">
              <p className="text-gray-500 text-sm mb-1">{field.label}</p>

              <p className="font-bold text-gray-900">{field.value || "-"}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-5">
        <h3 className="font-bold text-gray-900 mb-4">
          Verification Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <p className="text-gray-500 text-sm">Candidate ID</p>

            <p className="font-bold">{result.candidate_id || "-"}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">BGV ID</p>

            <p className="font-bold">{result.bgv_id || "-"}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Document ID</p>

            <p className="font-bold">{result.document_id || "-"}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Provider</p>

            <p className="font-bold">{result.provider_name || "GRIDLINES"}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">API Reference ID</p>

            <p className="font-bold break-all">
              {result.api_reference_id || "-"}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Result ID</p>

            <p className="font-bold">{result.id || "-"}</p>
          </div>
        </div>
      </div>

      {result.office_address && (
        <div>
          <p className="text-gray-500 text-sm mb-1">Office Address</p>

          <p className="font-semibold text-gray-900">{result.office_address}</p>
        </div>
      )}
    </div>
  );
}

export default SalarySlipResultView;
