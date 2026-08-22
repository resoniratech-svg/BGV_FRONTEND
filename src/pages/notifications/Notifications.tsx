import DashboardLayout from "../../layouts/DashboardLayout";
import { useEffect, useMemo, useState } from "react";

import {
  Bell,
  Search,
  ShieldAlert,
  CheckCircle,
  AlertTriangle,
  Info,
  CheckCheck,
} from "lucide-react";

import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../../api/notificationApi";

interface NotificationItem {
  id: number;
  candidate_id?: number;
  bgv_id?: number;

  title: string;
  description: string;

  type: "Critical" | "Success" | "Warning" | "Info";

  is_read: boolean;

  created_at: string;
}

type NotificationFilterType = "ALL" | "CRITICAL" | "UNREAD" | "RESOLVED";

function Notifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const [searchQuery, setSearchQuery] = useState("");

  const [activeFilter, setActiveFilter] =
    useState<NotificationFilterType>("ALL");

  const loadNotifications = async () => {
    try {
      const data = await getNotifications();
      console.log(data);
      setNotifications(data ?? []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();

      loadNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkRead = async (id: number, isRead: boolean) => {
    if (isRead) return;

    try {
      await markNotificationRead(id);

      loadNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      const query = searchQuery.toLowerCase();

      const matchesSearch =
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.type.toLowerCase().includes(query);

      if (!matchesSearch) return false;

      switch (activeFilter) {
        case "CRITICAL":
          return item.type === "Critical";

        case "UNREAD":
          return !item.is_read;

        case "RESOLVED":
          return item.is_read;

        default:
          return true;
      }
    });
  }, [notifications, searchQuery, activeFilter]);

  const totalAlerts = notifications.length;

  const criticalCount = notifications.filter(
    (n) => n.type === "Critical",
  ).length;

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const resolvedCount = notifications.filter((n) => n.is_read).length;
  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-5xl mx-auto pb-12">
        {/* Header */}

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Notifications Center
            </h1>

            <p className="text-gray-500 mt-2">
              Real-time system alerts and verification updates.
            </p>
          </div>

          <button
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            className={`px-6 py-3 rounded-2xl flex items-center gap-2 font-semibold shadow-sm transition-all
        ${
          unreadCount === 0
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-[#5B5FEF] text-white hover:bg-[#4B4FD8]"
        }`}
          >
            <CheckCheck className="w-5 h-5" />
            Mark All Read
          </button>
        </div>

        {/* Summary Cards */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <div
            onClick={() => setActiveFilter("ALL")}
            className={`rounded-3xl border bg-white p-6 cursor-pointer transition-all
        ${
          activeFilter === "ALL"
            ? "ring-2 ring-gray-300 border-gray-300"
            : "border-gray-200"
        }`}
          >
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Alerts</p>

                <h2 className="text-4xl font-black mt-2">{totalAlerts}</h2>
              </div>

              <div className="bg-gray-100 rounded-xl p-3">
                <Bell className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div
            onClick={() => setActiveFilter("CRITICAL")}
            className={`rounded-3xl border bg-white p-6 cursor-pointer transition-all
        ${
          activeFilter === "CRITICAL"
            ? "ring-2 ring-red-300 border-red-300"
            : "border-gray-200"
        }`}
          >
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500 text-sm">Critical Alerts</p>

                <h2 className="text-4xl font-black text-red-500 mt-2">
                  {criticalCount}
                </h2>
              </div>

              <div className="bg-red-100 rounded-xl p-3 text-red-600">
                <ShieldAlert className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div
            onClick={() => setActiveFilter("UNREAD")}
            className={`rounded-3xl border bg-white p-6 cursor-pointer transition-all
        ${
          activeFilter === "UNREAD"
            ? "ring-2 ring-yellow-300 border-yellow-300"
            : "border-gray-200"
        }`}
          >
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500 text-sm">Unread</p>

                <h2 className="text-4xl font-black text-yellow-500 mt-2">
                  {unreadCount}
                </h2>
              </div>

              <div className="bg-yellow-100 rounded-xl p-3 text-yellow-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div
            onClick={() => setActiveFilter("RESOLVED")}
            className={`rounded-3xl border bg-white p-6 cursor-pointer transition-all
        ${
          activeFilter === "RESOLVED"
            ? "ring-2 ring-green-300 border-green-300"
            : "border-gray-200"
        }`}
          >
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500 text-sm">Read</p>

                <h2 className="text-4xl font-black text-green-500 mt-2">
                  {resolvedCount}
                </h2>
              </div>

              <div className="bg-green-100 rounded-xl p-3 text-green-600">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Notifications List */}

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              Live Alert Stream
              {activeFilter !== "ALL" && (
                <span className="ml-2 text-sm text-gray-400">
                  ({activeFilter})
                </span>
              )}
            </h2>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

              <input
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#F5F7FB] rounded-2xl border border-gray-200 pl-11 pr-5 py-3 w-80 focus:outline-none focus:border-[#5B5FEF]"
              />
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredNotifications.length === 0 ? (
              <div className="p-16 text-center text-gray-400">
                No notifications found.
              </div>
            ) : (
              filteredNotifications.map((item) => {
                return (
                  <div
                    key={item.id}
                    onClick={() => handleMarkRead(item.id, item.is_read)}
                    className={`p-6 cursor-pointer transition hover:bg-gray-50
              ${!item.is_read ? "bg-indigo-50" : ""}
            `}
                  >
                    <div className="flex justify-between gap-6">
                      <div className="flex gap-5">
                        <div
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center

                  ${
                    item.type === "Critical"
                      ? "bg-red-100 text-red-600"
                      : item.type === "Success"
                        ? "bg-green-100 text-green-600"
                        : item.type === "Warning"
                          ? "bg-orange-100 text-orange-600"
                          : "bg-indigo-100 text-indigo-600"
                  }`}
                        >
                          {item.type === "Critical" && (
                            <ShieldAlert className="w-6 h-6" />
                          )}

                          {item.type === "Success" && (
                            <CheckCircle className="w-6 h-6" />
                          )}

                          {item.type === "Warning" && (
                            <AlertTriangle className="w-6 h-6" />
                          )}

                          {item.type === "Info" && <Info className="w-6 h-6" />}
                        </div>

                        <div>
                          <div className="flex items-center gap-3">
                            <h3
                              className={`text-lg font-bold
                        ${item.is_read ? "text-gray-600" : "text-gray-900"}`}
                            >
                              {item.title}
                            </h3>

                            {!item.is_read && (
                              <span className="w-2.5 h-2.5 rounded-full bg-[#5B5FEF] animate-pulse"></span>
                            )}
                          </div>

                          <p
                            className={`mt-2
                      ${item.is_read ? "text-gray-500" : "text-gray-700"}`}
                          >
                            {item.description}
                          </p>

                          <p className="text-xs text-gray-400 mt-3">
                            {new Date(item.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`h-fit px-3 py-1 rounded-full text-xs font-bold

                ${
                  item.type === "Critical"
                    ? "bg-red-50 text-red-700"
                    : item.type === "Success"
                      ? "bg-green-50 text-green-700"
                      : item.type === "Warning"
                        ? "bg-orange-50 text-orange-700"
                        : "bg-indigo-50 text-indigo-700"
                }`}
                      >
                        {item.type}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Notifications;
