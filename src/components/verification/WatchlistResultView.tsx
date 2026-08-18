type Props = {
  data: any;
};

function WatchlistResultView({
  data
}: Props) {

  if (!data) {

    return (
      <div className="p-6 text-center">
        No watchlist result available
      </div>
    );
  }

  const records =
    data.provider_response?.found_records || [];

  return (

    <div className="space-y-6">

      {/* SUMMARY */}

      <div className="border rounded-2xl p-6">

        <h3 className="text-xl font-bold mb-4">
          AML & Global Watchlist Screening
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

          <div>
            <p className="text-gray-500 text-sm">
              AML Status
            </p>

            <p className="font-bold text-green-600">
              {data.aml_status}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">
              Risk Level
            </p>

            <p
              className={`font-bold ${
                data.risk_level === "HIGH"
                  ? "text-red-600"
                  : data.risk_level === "MEDIUM"
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            >
              {data.risk_level}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">
              Verification ID
            </p>

            <p className="font-bold">
              {data.verification_id}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">
              PEP Match
            </p>

            <p>
              {data.pep_match ? "Yes" : "No"}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">
              Sanctions Match
            </p>

            <p>
              {data.sanctions_match ? "Yes" : "No"}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">
              Adverse Media
            </p>

            <p>
              {data.adverse_media_match
                ? "Yes"
                : "No"}
            </p>
          </div>

        </div>

      </div>

      {/* MATCHES */}

      <div className="border rounded-2xl p-6">

        <h3 className="text-lg font-bold mb-4">
          Potential Matches
          ({records.length})
        </h3>

        <div className="space-y-4 max-h-[500px] overflow-y-auto">

          {records.map(
            (
              record: any,
              index: number
            ) => (

              <div
                key={index}
                className="border rounded-xl p-4"
              >

                <div className="flex justify-between">

                  <h4 className="font-bold">
                    {record.name}
                  </h4>

                  <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-lg">
                    {record.source_type}
                  </span>

                </div>

                <div className="grid grid-cols-2 gap-3 mt-3 text-sm">

                  <div>

                    <span className="font-semibold">
                      Entity Type:
                    </span>{" "}

                    {record.entity_type}

                  </div>

                  <div>

                    <span className="font-semibold">
                      Gender:
                    </span>{" "}

                    {record.gender}

                  </div>

                  <div>

                    <span className="font-semibold">
                      DOB:
                    </span>{" "}

                    {record.date_of_birth?.[0] ||
                      "-"}

                  </div>

                  <div>

                    <span className="font-semibold">
                      Citizenship:
                    </span>{" "}

                    {record.citizenship?.join(
                      ", "
                    ) || "-"}

                  </div>

                  <div className="col-span-2">

                    <span className="font-semibold">
                      Description:
                    </span>{" "}

                    {record.description?.join(
                      ", "
                    ) || "-"}

                  </div>

                </div>

              </div>

            )
          )}

        </div>

      </div>

    </div>

  );
}

export default WatchlistResultView;