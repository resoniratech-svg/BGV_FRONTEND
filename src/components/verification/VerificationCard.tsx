import {
  ShieldCheck,
  ShieldAlert,
  XCircle,
  Loader2
} from "lucide-react";

type Props = {
  title: string;
  subtitle?: string;
  status: string | null;
  verifying: boolean;
  children?: React.ReactNode;
};

export default function VerificationCard({
  title,
  subtitle,
  status,
  verifying,
  children
}: Props) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">

      <div className="flex items-center gap-2">

        <div
          className={`p-2 rounded-xl ${
            status === "Verified"
              ? "bg-green-50 text-green-500"
              : status === "Fraud"
              ? "bg-red-50 text-red-500"
              : status === "Rejected"
              ? "bg-orange-50 text-orange-500"
              : status === "Not Verified"
              ? "bg-yellow-50 text-yellow-500"
              : "bg-indigo-50 text-indigo-500"
          }`}
        >
          {status === "Fraud" ? (
            <ShieldAlert className="w-5 h-5" />
          ) : status === "Rejected" ||
            status === "Not Verified" ? (
            <XCircle className="w-5 h-5" />
          ) : verifying ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <ShieldCheck className="w-5 h-5" />
          )}
        </div>

        <div>
          <h3 className="font-bold text-gray-900">
            {title}
          </h3>

          {subtitle && (
            <p className="text-xs text-gray-500">
              {subtitle}
            </p>
          )}
        </div>

      </div>

      <div className="flex items-center gap-2 mt-4">
        {children}
      </div>

    </div>
  );
}