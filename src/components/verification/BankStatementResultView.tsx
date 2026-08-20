import React from "react";

interface Props {
  data: any;
}

const BankStatementResultView: React.FC<Props> = ({ data }) => {
  if (!data) {
    return (
      <div className="p-6 text-gray-500">
        Bank Statement verification result not found.
      </div>
    );
  }

  // =========================================================
  // DEBUG
  // =========================================================

  console.log("================================================");
  console.log("BANK STATEMENT API RESPONSE");
  console.log(data);
  console.log("================================================");

  // =========================================================
  // NORMALIZE API RESPONSE
  //
  // Actual response:
  //
  // {
  //   data: {
  //     data: {
  //       bgv_id: "...",
  //       candidate_id: 63,
  //       report_data: {
  //         account_data: {...},
  //         identity_data: {...},
  //         transaction: [...],
  //         ...
  //       }
  //     },
  //     success: true
  //   },
  //   status: "success"
  // }
  // =========================================================

  const responseData = data?.data ?? data;

  const metadata = responseData?.data ?? responseData ?? data;

  const reportData = metadata?.report_data ?? metadata?.reportData ?? null;

  const result =
    reportData?.data ??
    reportData?.result ??
    reportData?.report ??
    reportData ??
    {};

  console.log("BANK STATEMENT RESPONSE DATA:");
  console.log(responseData);

  console.log("BANK STATEMENT METADATA:");
  console.log(metadata);

  console.log("BANK STATEMENT REPORT DATA:");
  console.log(reportData);

  console.log("BANK STATEMENT FINAL RESULT:");
  console.log(result);

  console.log("ACCOUNT DATA:");
  console.log(result?.account_data);

  console.log("TRANSACTIONS:");
  console.log(result?.transaction);

  console.log("================================================");

  // =========================================================
  // HELPERS
  // =========================================================

  const getValue = (...values: any[]) => {
    for (const value of values) {
      if (
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ""
      ) {
        return value;
      }
    }

    return "N/A";
  };

  const formatValue = (value: any): string => {
    if (value === undefined || value === null || String(value).trim() === "") {
      return "N/A";
    }

    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }

    if (typeof value === "number") {
      return value.toLocaleString("en-IN", {
        maximumFractionDigits: 2,
      });
    }

    if (typeof value === "object") {
      return JSON.stringify(value, null, 2);
    }

    return String(value);
  };

  const formatAmount = (value: any): string => {
    if (
      value === undefined ||
      value === null ||
      value === "" ||
      value === "N/A"
    ) {
      return "N/A";
    }

    const number = Number(value);

    if (Number.isNaN(number)) {
      return String(value);
    }

    return `₹${number.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatLabel = (key: string): string => {
    return key
      .replace(/_/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const isObject = (value: any) =>
    value !== null && typeof value === "object" && !Array.isArray(value);

  const isPrimitive = (value: any) =>
    value === null ||
    value === undefined ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean";

  // =========================================================
  // VERIFICATION STATUS
  // =========================================================

  const verificationStatus = getValue(
    metadata?.verification_status,
    metadata?.status,
    result?.verification_status,
    result?.status,
    responseData?.verification_status,
    data?.verification_status,
    data?.status,
  );

  const normalizedStatus = String(verificationStatus).trim().toUpperCase();

  // =========================================================
  // ACCOUNT DATA
  // =========================================================

  const accountData = isObject(result?.account_data) ? result.account_data : {};

  const accountNumber = getValue(
    accountData?.account_number,
    accountData?.account_no,
    accountData?.accountNumber,
  );

  const bankName = getValue(
    accountData?.bank_name,
    accountData?.bankName,
    accountData?.bank,
  );

  const ifscCode = getValue(
    accountData?.ifsc,
    accountData?.ifsc_code,
    accountData?.ifscCode,
  );

  const accountCategory = getValue(
    accountData?.account_category,
    accountData?.category,
  );

  const odLimit = getValue(accountData?.od_limit, accountData?.overdraft_limit);

  const creditLimit = getValue(accountData?.credit_limit);

  // =========================================================
  // IDENTITY DATA
  // =========================================================

  const identityData = isObject(result?.identity_data)
    ? result.identity_data
    : {};

  const identityAddress = getValue(
    identityData?.address,
    identityData?.full_address,
  );

  // =========================================================
  // PARSE CUSTOMER NAME + STATEMENT PERIOD
  // FROM ACTUAL GRIDLINES ADDRESS STRING
  //
  // Example:
  //
  // STATEMENT PERIOD : 2023-05-01 TO 2023-10-31
  // CUSTOMER NAME : COMMUNICATION : D 168 Jaipur – 302015
  // =========================================================

  const addressText = identityAddress !== "N/A" ? String(identityAddress) : "";

  const statementPeriodMatch = addressText.match(
    /STATEMENT\s+PERIOD\s*:\s*(\d{4}-\d{2}-\d{2})\s+TO\s+(\d{4}-\d{2}-\d{2})/i,
  );

  const statementFrom = statementPeriodMatch?.[1] ?? "N/A";

  const statementTo = statementPeriodMatch?.[2] ?? "N/A";

  const customerNameMatch = addressText.match(
    /CUSTOMER\s+NAME\s*:\s*(.*?)(?=\s+COMMUNICATION\s*:|$)/i,
  );

  const customerName = customerNameMatch?.[1]?.trim() || "N/A";

  const communicationMatch = addressText.match(/COMMUNICATION\s*:\s*(.*)$/i);

  const communication = communicationMatch?.[1]?.trim() || "N/A";

  const identityMobile = getValue(
    identityData?.mobile,
    identityData?.mobile_number,
    identityData?.phone,
    identityData?.phone_number,
  );

  const identityEmail = getValue(identityData?.email, identityData?.email_id);

  // =========================================================
  // TRANSACTIONS
  // =========================================================

  const transactions = Array.isArray(result?.transaction)
    ? [...result.transaction]
    : Array.isArray(result?.transactions)
      ? [...result.transactions]
      : [];

  const sortedTransactions = [...transactions].sort((a, b) => {
    const dateA = String(a?.date ?? "");
    const dateB = String(b?.date ?? "");

    return dateA.localeCompare(dateB);
  });

  // =========================================================
  // CREDIT / DEBIT TRANSACTIONS
  // =========================================================

  const creditTransactions = sortedTransactions.filter(
    (transaction: any) =>
      String(transaction?.transaction_type ?? "")
        .trim()
        .toLowerCase() === "credit",
  );

  const debitTransactions = sortedTransactions.filter(
    (transaction: any) =>
      String(transaction?.transaction_type ?? "")
        .trim()
        .toLowerCase() === "debit",
  );

  // =========================================================
  // TOTAL CREDIT / DEBIT
  // =========================================================

  const totalCredits = creditTransactions.reduce(
    (total: number, transaction: any) =>
      total + (Number(transaction?.amount) || 0),
    0,
  );

  const totalDebits = debitTransactions.reduce(
    (total: number, transaction: any) =>
      total + (Number(transaction?.amount) || 0),
    0,
  );

  // =========================================================
  // FIRST / LATEST TRANSACTION
  // =========================================================

  const firstTransaction =
    sortedTransactions.length > 0 ? sortedTransactions[0] : null;

  const latestTransaction =
    sortedTransactions.length > 0
      ? sortedTransactions[sortedTransactions.length - 1]
      : null;

  const firstBalance = firstTransaction?.balance;

  const latestBalance = latestTransaction?.balance;

  // =========================================================
  // TRANSACTION DATE RANGE
  // =========================================================

  const transactionDates = sortedTransactions
    .map((transaction: any) => transaction?.date)
    .filter(Boolean)
    .map((date: any) => String(date))
    .sort();

  const transactionFromDate =
    transactionDates.length > 0 ? transactionDates[0] : "N/A";

  const transactionToDate =
    transactionDates.length > 0
      ? transactionDates[transactionDates.length - 1]
      : "N/A";

  const fromDate =
    statementFrom !== "N/A" ? statementFrom : transactionFromDate;

  const toDate = statementTo !== "N/A" ? statementTo : transactionToDate;

  // =========================================================
  // SALARY TRANSACTIONS
  // =========================================================

  const salaryTransactions = Array.isArray(result?.salary_transaction)
    ? [...result.salary_transaction]
    : Array.isArray(result?.salary_transactions)
      ? [...result.salary_transactions]
      : [];

  const salaryTotal = salaryTransactions.reduce(
    (total: number, transaction: any) =>
      total + (Number(transaction?.amount) || 0),
    0,
  );

  const averageSalary =
    salaryTransactions.length > 0 ? salaryTotal / salaryTransactions.length : 0;

  // =========================================================
  // MONTHLY ANALYSIS
  // =========================================================

  const monthlyAnalysis = isObject(result?.monthly_analysis)
    ? result.monthly_analysis
    : {};

  const monthlyOpeningBalance = monthlyAnalysis?.opening_balance ?? {};

  const monthlyClosingBalance = monthlyAnalysis?.closing_balance ?? {};

  const monthlyMedianBalance = monthlyAnalysis?.median_balance ?? {};

  const monthlyAverageBalance = monthlyAnalysis?.avg_bal ?? {};

  const monthlyTransactionCount = monthlyAnalysis?.cnt_transactions ?? {};

  const monthlyDebitAmount = monthlyAnalysis?.amt_debit ?? {};

  const monthlyCreditAmount = monthlyAnalysis?.amt_credit ?? {};

  const monthlyDebitCount = monthlyAnalysis?.cnt_debit ?? {};

  const monthlyCreditCount = monthlyAnalysis?.cnt_credit ?? {};

  const monthlyMonths = Array.from(
    new Set([
      ...Object.keys(monthlyOpeningBalance),
      ...Object.keys(monthlyClosingBalance),
      ...Object.keys(monthlyMedianBalance),
      ...Object.keys(monthlyAverageBalance),
      ...Object.keys(monthlyTransactionCount),
      ...Object.keys(monthlyDebitAmount),
      ...Object.keys(monthlyCreditAmount),
    ]),
  );

  // =========================================================
  // RECURRING TRANSACTIONS
  // =========================================================

  const recurringTransaction = isObject(result?.recurring_transaction)
    ? result.recurring_transaction
    : {};

  const recurringDebitTransactions = Array.isArray(
    recurringTransaction?.debit_transactions,
  )
    ? recurringTransaction.debit_transactions
    : [];

  const recurringCreditTransactions = Array.isArray(
    recurringTransaction?.credit_transactions,
  )
    ? recurringTransaction.credit_transactions
    : [];

  // =========================================================
  // EXPENSE CATEGORY
  // =========================================================

  const expenseCategory = Array.isArray(result?.expense_category)
    ? result.expense_category
    : [];

  // =========================================================
  // TOP 5 DEBIT / CREDIT
  // =========================================================

  const top5DebitCreditData = isObject(result?.top_5_debit_credit_data)
    ? result.top_5_debit_credit_data
    : {};

  // =========================================================
  // PREDICTOR DATA
  // =========================================================

  const predictorData = isObject(result?.predictor_data)
    ? result.predictor_data
    : {};

  // =========================================================
  // STATUS CLASSES
  // =========================================================

  const getStatusClasses = () => {
    if (
      normalizedStatus === "VERIFIED" ||
      normalizedStatus === "SUCCESS" ||
      normalizedStatus === "CLEAR" ||
      normalizedStatus === "COMPLETED"
    ) {
      return "bg-green-100 text-green-700 border-green-200";
    }

    if (normalizedStatus === "FRAUD" || normalizedStatus === "FAILED") {
      return "bg-red-100 text-red-700 border-red-200";
    }

    if (
      normalizedStatus === "REJECTED" ||
      normalizedStatus === "NOT VERIFIED"
    ) {
      return "bg-orange-100 text-orange-700 border-orange-200";
    }

    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  // =========================================================
  // FIELD
  // =========================================================

  const Field = ({
    label,
    value,
    amount = false,
  }: {
    label: string;
    value: any;
    amount?: boolean;
  }) => (
    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-gray-900 break-words whitespace-pre-wrap">
        {amount ? formatAmount(value) : formatValue(value)}
      </p>
    </div>
  );

  // =========================================================
  // TRANSACTION TABLE
  // =========================================================

  const TransactionTable = ({
    items,
    title = "Transactions",
  }: {
    items: any[];
    title?: string;
  }) => {
    if (!Array.isArray(items) || items.length === 0) {
      return (
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
          <p className="text-sm text-gray-500">
            No {title.toLowerCase()} found.
          </p>
        </div>
      );
    }

    return (
      <div className="border border-gray-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Date
                </th>

                <th className="px-4 py-3 text-left font-semibold text-gray-600 min-w-[280px]">
                  Transaction Note
                </th>

                <th className="px-4 py-3 text-left font-semibold text-gray-600 min-w-[220px]">
                  Description
                </th>

                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Channel
                </th>

                <th className="px-4 py-3 text-center font-semibold text-gray-600">
                  Type
                </th>

                <th className="px-4 py-3 text-right font-semibold text-gray-600">
                  Amount
                </th>

                <th className="px-4 py-3 text-right font-semibold text-gray-600">
                  Balance
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {items.map((transaction: any, index: number) => {
                const transactionType = String(
                  transaction?.transaction_type ?? "",
                )
                  .trim()
                  .toLowerCase();

                const isCredit = transactionType === "credit";

                return (
                  <tr
                    key={
                      transaction?.id ?? transaction?.transaction_id ?? index
                    }
                    className="hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      {formatValue(transaction?.date)}
                    </td>

                    <td className="px-4 py-3 min-w-[280px]">
                      <p className="font-medium text-gray-900">
                        {formatValue(transaction?.transaction_note)}
                      </p>
                    </td>

                    <td className="px-4 py-3 min-w-[220px]">
                      {formatValue(transaction?.description)}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      {formatValue(transaction?.transaction_channel)}
                    </td>

                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold ${
                          isCredit
                            ? "bg-green-100 text-green-700"
                            : transactionType === "debit"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {formatValue(transaction?.transaction_type)}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right whitespace-nowrap font-semibold">
                      {formatAmount(transaction?.amount)}
                    </td>

                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {formatAmount(transaction?.balance)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // =========================================================
  // RECURRING TRANSACTIONS
  // =========================================================

  const RecurringTransactionSection = ({
    items,
    title,
  }: {
    items: any[];
    title: string;
  }) => {
    if (!Array.isArray(items) || items.length === 0) {
      return null;
    }

    return (
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-gray-700">{title}</h4>

        {items.map((item: any, index: number) => {
          const nestedTransactions = Array.isArray(item?.transaction)
            ? item.transaction
            : [];

          return (
            <div
              key={`${title}-${index}`}
              className="border border-gray-200 rounded-2xl overflow-hidden"
            >
              <div className="bg-gray-50 p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Field label="Source" value={item?.source} />

                  <Field
                    label="Total Amount"
                    value={item?.total_amount}
                    amount
                  />

                  <Field
                    label="Median Amount"
                    value={item?.median_amount}
                    amount
                  />

                  <Field
                    label="Number of Transactions"
                    value={item?.number_of_transaction}
                  />

                  <Field
                    label="Maximum Amount"
                    value={item?.max_amount}
                    amount
                  />

                  {item?.min_amount !== undefined && (
                    <Field
                      label="Minimum Amount"
                      value={item?.min_amount}
                      amount
                    />
                  )}

                  {item?.average_amount !== undefined && (
                    <Field
                      label="Average Amount"
                      value={item?.average_amount}
                      amount
                    />
                  )}
                </div>
              </div>

              {nestedTransactions.length > 0 && (
                <div className="p-4">
                  <TransactionTable
                    items={nestedTransactions}
                    title={`${title} transactions`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // =========================================================
  // EXPENSE CATEGORY TABLE
  // =========================================================

  const ExpenseCategoryTable = () => {
    if (!Array.isArray(expenseCategory) || expenseCategory.length === 0) {
      return (
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
          <p className="text-sm text-gray-500">
            No expense category data available.
          </p>
        </div>
      );
    }

    return (
      <div className="border border-gray-200 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">
                Category
              </th>

              <th className="px-4 py-3 text-right font-semibold text-gray-600">
                Percentage
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {expenseCategory.map((item: any, index: number) => (
              <tr
                key={`${item?.category ?? "category"}-${index}`}
                className="hover:bg-gray-50"
              >
                <td className="px-4 py-3 font-medium text-gray-900">
                  {formatValue(item?.category)}
                </td>

                <td className="px-4 py-3 text-right font-semibold">
                  {formatValue(item?.percentage)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // =========================================================
  // MONTHLY ANALYSIS TABLE
  // =========================================================

  const MonthlyAnalysisTable = () => {
    if (monthlyMonths.length === 0) {
      return (
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
          <p className="text-sm text-gray-500">
            No monthly analysis data available.
          </p>
        </div>
      );
    }

    return (
      <div className="border border-gray-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Month
                </th>

                <th className="px-4 py-3 text-right font-semibold text-gray-600">
                  Opening Balance
                </th>

                <th className="px-4 py-3 text-right font-semibold text-gray-600">
                  Closing Balance
                </th>

                <th className="px-4 py-3 text-right font-semibold text-gray-600">
                  Average Balance
                </th>

                <th className="px-4 py-3 text-right font-semibold text-gray-600">
                  Transactions
                </th>

                <th className="px-4 py-3 text-right font-semibold text-gray-600">
                  Credit
                </th>

                <th className="px-4 py-3 text-right font-semibold text-gray-600">
                  Debit
                </th>

                <th className="px-4 py-3 text-right font-semibold text-gray-600">
                  Credit Count
                </th>

                <th className="px-4 py-3 text-right font-semibold text-gray-600">
                  Debit Count
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {monthlyMonths.map((month) => (
                <tr key={month} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">
                    {month}
                  </td>

                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {formatAmount(monthlyOpeningBalance?.[month])}
                  </td>

                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {formatAmount(monthlyClosingBalance?.[month])}
                  </td>

                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {formatAmount(monthlyAverageBalance?.[month])}
                  </td>

                  <td className="px-4 py-3 text-right">
                    {formatValue(monthlyTransactionCount?.[month])}
                  </td>

                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {formatAmount(monthlyCreditAmount?.[month])}
                  </td>

                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {formatAmount(monthlyDebitAmount?.[month])}
                  </td>

                  <td className="px-4 py-3 text-right">
                    {formatValue(monthlyCreditCount?.[month])}
                  </td>

                  <td className="px-4 py-3 text-right">
                    {formatValue(monthlyDebitCount?.[month])}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // =========================================================
  // GENERIC OBJECT FIELDS
  // =========================================================

  const ObjectFields = ({
    object,
    exclude = [],
  }: {
    object: any;
    exclude?: string[];
  }) => {
    if (!isObject(object)) {
      return <div className="text-sm text-gray-500">No data available.</div>;
    }

    const entries = Object.entries(object).filter(
      ([key, value]) =>
        !exclude.includes(key) &&
        isPrimitive(value) &&
        value !== undefined &&
        value !== null &&
        String(value).trim() !== "",
    );

    if (entries.length === 0) {
      return (
        <div className="text-sm text-gray-500">
          No summary fields available.
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {entries.map(([key, value]) => (
          <Field key={key} label={formatLabel(key)} value={value} />
        ))}
      </div>
    );
  };

  // =========================================================
  // ANALYTICS FIELDS
  // =========================================================

  const AnalyticsFields = ({ object }: { object: any }) => {
    if (!isObject(object)) {
      return null;
    }

    const primitiveEntries = Object.entries(object).filter(([, value]) =>
      isPrimitive(value),
    );

    const nestedEntries = Object.entries(object).filter(
      ([, value]) => !isPrimitive(value),
    );

    return (
      <div className="space-y-4">
        {primitiveEntries.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {primitiveEntries.map(([key, value]) => (
              <Field key={key} label={formatLabel(key)} value={value} />
            ))}
          </div>
        )}

        {nestedEntries.map(([key, value]) => (
          <details
            key={key}
            className="border border-gray-200 rounded-xl overflow-hidden"
          >
            <summary className="cursor-pointer px-4 py-3 bg-gray-50 text-sm font-semibold text-gray-700">
              {formatLabel(key)}
            </summary>

            <div className="p-4">
              {Array.isArray(value) ? (
                <div className="space-y-3">
                  {value.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="border border-gray-100 rounded-xl p-4"
                    >
                      {isPrimitive(item) ? (
                        <p className="text-sm text-gray-800">
                          {formatValue(item)}
                        </p>
                      ) : (
                        <ObjectFields object={item} />
                      )}
                    </div>
                  ))}
                </div>
              ) : isObject(value) ? (
                <ObjectFields object={value} />
              ) : (
                <p className="text-sm text-gray-800">{formatValue(value)}</p>
              )}
            </div>
          </details>
        ))}
      </div>
    );
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="space-y-6">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Bank Statement Verification
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Bank statement analysis and financial verification details
          </p>
        </div>

        <div
          className={`px-4 py-2 rounded-xl border text-sm font-bold ${getStatusClasses()}`}
        >
          {formatValue(verificationStatus)}
        </div>
      </div>

      {/* =====================================================
          ACCOUNT DETAILS
      ===================================================== */}

      <div>
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">
          Account Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="Bank Name" value={bankName} />

          <Field label="Account Number" value={accountNumber} />

          <Field label="IFSC" value={ifscCode} />

          <Field label="Account Category" value={accountCategory} />

          <Field label="OD Limit" value={odLimit} amount />

          <Field label="Credit Limit" value={creditLimit} amount />
        </div>
      </div>

      {/* =====================================================
          CUSTOMER DETAILS
      ===================================================== */}

      {(customerName !== "N/A" ||
        identityAddress !== "N/A" ||
        identityMobile !== "N/A" ||
        identityEmail !== "N/A") && (
        <div>
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">
            Customer Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Customer Name" value={customerName} />

            <Field label="Mobile" value={identityMobile} />

            <Field label="Email" value={identityEmail} />

            <Field label="Communication" value={communication} />
          </div>
        </div>
      )}

      {/* =====================================================
          STATEMENT SUMMARY
      ===================================================== */}

      <div>
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">
          Statement Summary
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Field label="Statement From" value={fromDate} />

          <Field label="Statement To" value={toDate} />

          <Field label="Total Transactions" value={sortedTransactions.length} />

          <Field
            label="Credit Transactions"
            value={creditTransactions.length}
          />

          <Field label="Debit Transactions" value={debitTransactions.length} />

          <Field label="Total Credits" value={totalCredits} amount />

          <Field label="Total Debits" value={totalDebits} amount />

          <Field label="Latest Balance" value={latestBalance} amount />
        </div>
      </div>

      {/* =====================================================
          BALANCE INFORMATION
      ===================================================== */}

      <div>
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">
          Balance Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field
            label="First Transaction Balance"
            value={firstBalance}
            amount
          />

          <Field
            label="Latest Transaction Balance"
            value={latestBalance}
            amount
          />

          <Field
            label="Net Credit / Debit"
            value={totalCredits - totalDebits}
            amount
          />
        </div>
      </div>

      {/* =====================================================
          SALARY TRANSACTIONS
      ===================================================== */}

      {salaryTransactions.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
              Salary Transactions
            </h3>

            <span className="text-xs font-semibold text-gray-500">
              {salaryTransactions.length} transactions
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Field
              label="Salary Transaction Count"
              value={salaryTransactions.length}
            />

            <Field label="Total Salary Amount" value={salaryTotal} amount />

            <Field
              label="Average Salary Transaction"
              value={averageSalary}
              amount
            />
          </div>

          <TransactionTable
            items={salaryTransactions}
            title="Salary Transactions"
          />
        </div>
      )}

      {/* =====================================================
          ALL TRANSACTIONS
      ===================================================== */}

      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
              All Transactions
            </h3>

            <p className="text-xs text-gray-500 mt-1">
              Complete transaction history from the bank statement
            </p>
          </div>

          <span className="text-xs font-semibold text-gray-500">
            {sortedTransactions.length} transactions
          </span>
        </div>

        <TransactionTable items={sortedTransactions} title="Transactions" />
      </div>

      {/* =====================================================
          MONTHLY ANALYSIS
      ===================================================== */}

      {monthlyMonths.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">
            Monthly Statement Analysis
          </h3>

          <MonthlyAnalysisTable />
        </div>
      )}

      {/* =====================================================
          RECURRING TRANSACTIONS
      ===================================================== */}

      {(recurringCreditTransactions.length > 0 ||
        recurringDebitTransactions.length > 0) && (
        <div>
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">
            Recurring Transactions
          </h3>

          <div className="space-y-6">
            <RecurringTransactionSection
              items={recurringCreditTransactions}
              title="Recurring Credit Transactions"
            />

            <RecurringTransactionSection
              items={recurringDebitTransactions}
              title="Recurring Debit Transactions"
            />
          </div>
        </div>
      )}

      {/* =====================================================
          EXPENSE CATEGORIES
      ===================================================== */}

      {expenseCategory.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">
            Expense Categories
          </h3>

          <ExpenseCategoryTable />
        </div>
      )}

      {/* =====================================================
          TOP 5 DEBIT / CREDIT
      ===================================================== */}

      {Object.keys(top5DebitCreditData).length > 0 && (
        <details className="border border-gray-200 rounded-2xl">
          <summary className="cursor-pointer px-5 py-4 text-sm font-bold text-gray-700">
            View Top Debit / Credit Analysis
          </summary>

          <div className="border-t border-gray-200 p-5">
            <AnalyticsFields object={top5DebitCreditData} />
          </div>
        </details>
      )}

      {/* =====================================================
          PREDICTOR DATA
      ===================================================== */}

      {Object.keys(predictorData).length > 0 && (
        <details className="border border-gray-200 rounded-2xl">
          <summary className="cursor-pointer px-5 py-4 text-sm font-bold text-gray-700">
            View Financial Predictor Data
          </summary>

          <div className="border-t border-gray-200 p-5">
            <AnalyticsFields object={predictorData} />
          </div>
        </details>
      )}

      {/* =====================================================
          ADDITIONAL ANALYTICS
      ===================================================== */}

      <details className="border border-gray-200 rounded-2xl">
        <summary className="cursor-pointer px-5 py-4 text-sm font-bold text-gray-700">
          View Additional Bank Statement Analytics
        </summary>

        <div className="border-t border-gray-200 p-5">
          <AnalyticsFields
            object={{
              provider: metadata?.provider,
              provider_request_id: metadata?.provider_request_id,
              provider_status_code: metadata?.provider_status_code,
              bgv_id: metadata?.bgv_id,
              candidate_id: metadata?.candidate_id,
              request_id: metadata?.request_id,
              transaction_id: metadata?.transaction_id,
              created_at: metadata?.created_at,
              report_generated_at: metadata?.report_generated_at,
              updated_at: metadata?.updated_at,
            }}
          />
        </div>
      </details>

      {/* =====================================================
          RAW RESULT
      ===================================================== */}

      <details className="border border-gray-200 rounded-2xl">
        <summary className="cursor-pointer px-5 py-4 text-sm font-bold text-gray-700">
          View Raw Bank Statement Response
        </summary>

        <div className="border-t border-gray-200 p-5">
          <pre className="bg-gray-950 text-gray-100 rounded-xl p-4 text-xs overflow-x-auto whitespace-pre-wrap">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </details>
    </div>
  );
};

export default BankStatementResultView;
