interface EmploymentResultViewProps {
  data: any;
}

const EmploymentResultView = ({ data }: EmploymentResultViewProps) => {
  const result = data?.employment_result ?? data?.data?.employment_result ?? {};

  const history =
    data?.employment_history ?? data?.data?.employment_history ?? [];

  const employer =
    data?.employer_details ?? data?.data?.employer_details ?? null;

  return (
    <div className="space-y-6 text-sm">
      {/* =====================================================
          EMPLOYEE PROFILE
      ===================================================== */}

      <div className="border rounded-2xl p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Employee Profile
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Detail label="UAN" value={result.uan} />
          <Detail label="Name" value={result.name} />
          <Detail label="PAN" value={result.pan_number} />
          <Detail label="Date of Birth" value={result.dob} />
          <Detail label="Gender" value={result.gender} />
          <Detail label="Mobile Number" value={result.mobile_number} />
          <Detail label="Email" value={result.email} />
          <Detail label="Masked Aadhaar" value={result.masked_aadhaar_number} />
          <Detail label="Guardian Name" value={result.guardian_name} />
          <Detail label="Guardian Relation" value={result.guardian_relation} />
          <Detail label="Bank Account" value={result.bank_account_number} />
          <Detail label="IFSC" value={result.ifsc} />
        </div>
      </div>

      {/* =====================================================
          EMPLOYMENT HISTORY
      ===================================================== */}

      <div className="border rounded-2xl p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Employment History
        </h3>

        {history.length === 0 ? (
          <p className="text-gray-500">No employment history found.</p>
        ) : (
          <div className="space-y-4">
            {history.map((item: any, index: number) => (
              <div
                key={item.id ?? index}
                className="border rounded-xl p-4 bg-gray-50"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Detail label="Company" value={item.establishment_name} />

                  <Detail label="Employee Name" value={item.employee_name} />

                  <Detail label="UAN" value={item.uan} />

                  <Detail label="Member ID" value={item.member_id} />

                  <Detail label="Joining Date" value={item.joining_date} />

                  <Detail label="Exit Date" value={item.exit_date} />

                  <Detail label="Guardian Name" value={item.guardian_name} />

                  <Detail
                    label="Name Match Score"
                    value={item.name_match_score}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* =====================================================
          EMPLOYER DETAILS
      ===================================================== */}

      <div className="border rounded-2xl p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Employer Details
        </h3>

        {!employer ? (
          <p className="text-gray-500">Employer details not available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Detail
              label="Establishment ID"
              value={employer.establishment_id}
            />

            <Detail
              label="Establishment Name"
              value={employer.establishment_name}
            />

            <Detail
              label="Business Activity"
              value={employer.business_activity}
            />

            <Detail label="PAN Status" value={employer.pan_status} />

            <Detail label="Ownership Type" value={employer.ownership_type} />

            <Detail label="Employer Status" value={employer.employer_status} />

            <Detail label="Date of Setup" value={employer.date_of_setup} />

            <Detail
              label="Date of Coverage"
              value={employer.date_of_coverage}
            />

            <Detail label="Last Updated" value={employer.last_updated} />

            <Detail label="Address Line 1" value={employer.address_line1} />

            <Detail label="Address Line 2" value={employer.address_line2} />

            <Detail label="City" value={employer.city} />

            <Detail label="District" value={employer.district} />

            <Detail label="State" value={employer.state} />
          </div>
        )}
      </div>
    </div>
  );
};

/* =========================================================
   REUSABLE DETAIL
========================================================= */

const Detail = ({ label, value }: { label: string; value: any }) => {
  const displayValue =
    value === null || value === undefined || value === ""
      ? "N/A"
      : String(value);

  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {label}
      </p>

      <p className="mt-1 font-medium text-gray-900 break-words">
        {displayValue}
      </p>
    </div>
  );
};

export default EmploymentResultView;
