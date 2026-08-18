import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Database
} from "lucide-react";

type Props = {
  stats: any;
  activeFilter: string;
  onFilterChange: (
    status: string
  ) => void;
};

function VerificationStatsCards({

  stats,

  activeFilter,

  onFilterChange

}: Props) {

  const cards = [

    {
      title: "Total",
      value: stats.total || 0,
      status: "ALL",
      icon: Database
    },

    {
      title: "Verified",
      value: stats.verified || 0,
      status: "Verified",
      icon: CheckCircle
    },

    {
      title: "Pending",
      value: stats.pending || 0,
      status: "PENDING_REVIEW",
      icon: Clock
    },

    {
      title: "Fraud",
      value: stats.fraud || 0,
      status: "Fraud",
      icon: AlertTriangle
    }

  ];

  return (

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">

      {cards.map((card) => {

        const Icon = card.icon;

        return (

          <div

            key={card.status}

            onClick={() =>
              onFilterChange(
                card.status
              )
            }

            className={`

              bg-white
              rounded-3xl
              border
              shadow-sm
              p-6

              flex
              items-center
              justify-between

              cursor-pointer

              ${
                activeFilter === card.status
                  ? "border-indigo-500"
                  : "border-gray-100"
              }

            `}
          >

            <div>

              <p className="text-sm text-gray-500">
                {card.title}
              </p>

              <h2 className="text-4xl font-bold mt-2">
                {card.value}
              </h2>

            </div>

            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">

              <Icon className="w-5 h-5" />

            </div>

          </div>

        );
      })}

    </div>
  );
}

export default VerificationStatsCards;