import DashboardLayout from "../../layouts/DashboardLayout";
import { useState, useEffect, useMemo } from "react";
import { Search, ShieldAlert, CheckCircle, AlertTriangle, Info, Bell, CheckCheck } from "lucide-react";
import type { Candidate } from "../../types/Candidate";

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  type: "Critical" | "Success" | "Warning" | "Info";
  time: string;
  candidateId?: number;
}

function Notifications() {
  const [searchQuery, setSearchQuery] = useState("");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [readIds, setReadIds] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("candidates");
    if (saved) setCandidates(JSON.parse(saved));
  }, []);

  const generatedNotifications = useMemo(() => {
    const notifs: NotificationItem[] = [];
    let notifId = 5000;

    candidates.forEach((c) => {
      // 1. Missing Docs Notification
      if (c.progress === undefined || c.progress < 20) {
        notifs.push({
          id: `NOTIF-${notifId++}`,
          title: "Awaiting Candidate Action",
          description: `Candidate ${c.name} has not yet uploaded their required verification documents.`,
          type: "Info",
          time: "Pending",
          candidateId: c.id
        });
      }

      // 2. Ready for Audit Notification
      if (c.status === "Documents Uploaded" || c.status === "Under Verification") {
        notifs.push({
          id: `NOTIF-${notifId++}`,
          title: "Verification Queue Updated",
          description: `Documents for ${c.name} are ready for manual or AI audit processing.`,
          type: "Info",
          time: "Action Required",
          candidateId: c.id
        });
      }

      // 3. Module Level Notifications
      if (c.moduleStatuses) {
        Object.entries(c.moduleStatuses).forEach(([module, status]) => {
          if (status === "Verified") {
            notifs.push({
              id: `NOTIF-${notifId++}`,
              title: "Verification Successful",
              description: `${module} check passed securely for candidate ${c.name}.`,
              type: "Success",
              time: "Recent",
              candidateId: c.id
            });
          } else if (status === "Fraud") {
            notifs.push({
              id: `NOTIF-${notifId++}`,
              title: "Critical Fraud Alert",
              description: `High risk anomaly detected in ${module} for ${c.name}. Immediate investigation required.`,
              type: "Critical",
              time: "Recent",
              candidateId: c.id
            });
          } else if (status === "Rejected") {
            notifs.push({
              id: `NOTIF-${notifId++}`,
              title: "Document Rejected",
              description: `${module} was flagged for ${c.name}. Please request re-upload.`,
              type: "Warning",
              time: "Recent",
              candidateId: c.id
            });
          }
        });
      }
    });

    return notifs.reverse(); // Latest first
  }, [candidates]);

  const handleMarkAllRead = () => {
    setReadIds(generatedNotifications.map(n => n.id));
  };

  const markAsRead = (id: string) => {
    if (!readIds.includes(id)) {
      setReadIds([...readIds, id]);
    }
  };

  const filteredNotifs = generatedNotifications.filter((n) => {
    return (
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const criticalCount = generatedNotifications.filter(n => n.type === "Critical").length;
  const unreadCount = generatedNotifications.filter(n => !readIds.includes(n.id)).length;
  const resolvedCount = generatedNotifications.filter(n => readIds.includes(n.id)).length;

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-5xl mx-auto pb-12">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Notifications Center</h1>
            <p className="text-gray-500 mt-2">Real-time system alerts, action items, and verification status tracking.</p>
          </div>

          <button 
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            className={`px-6 py-3 rounded-2xl shadow-sm transition-all flex items-center gap-2 font-bold ${
              unreadCount === 0 
                ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                : "bg-[#5B5FEF] hover:bg-[#4B4FD8] text-white"
            }`}
          >
            <CheckCheck className="w-5 h-5" />
            Mark All as Read
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500 font-medium text-sm">Total Alerts Generated</p>
              <div className="p-2 bg-gray-50 rounded-xl"><Bell className="w-4 h-4 text-gray-500" /></div>
            </div>
            <h2 className="text-4xl font-black text-gray-900">{generatedNotifications.length}</h2>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500 font-medium text-sm">Critical Fraud Alerts</p>
              <div className="p-2 bg-red-50 rounded-xl"><ShieldAlert className="w-4 h-4 text-red-500" /></div>
            </div>
            <h2 className="text-4xl font-black text-red-500">{criticalCount}</h2>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500 font-medium text-sm">Unread System Action Items</p>
              <div className="p-2 bg-yellow-50 rounded-xl"><AlertTriangle className="w-4 h-4 text-yellow-500" /></div>
            </div>
            <h2 className="text-4xl font-black text-yellow-500">{unreadCount}</h2>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500 font-medium text-sm">Resolved / Acknowledged</p>
              <div className="p-2 bg-green-50 rounded-xl"><CheckCircle className="w-4 h-4 text-green-500" /></div>
            </div>
            <h2 className="text-4xl font-black text-green-500">{resolvedCount}</h2>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-2xl font-semibold text-gray-900">Live Alert Stream</h2>
            <div className="relative w-full sm:w-auto">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search alerts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#F5F7FB] border border-gray-200 rounded-2xl pl-11 pr-5 py-3.5 outline-none w-full sm:w-[320px] focus:bg-white focus:border-[#5B5FEF] transition-all text-sm text-gray-900"
              />
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredNotifs.length > 0 ? (
              filteredNotifs.map((item) => {
                const isRead = readIds.includes(item.id);

                return (
                  <div
                    key={item.id}
                    onClick={() => markAsRead(item.id)}
                    className={`p-6 hover:bg-gray-50 transition-all cursor-pointer ${
                      !isRead ? "bg-indigo-50/30" : "bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between flex-wrap gap-4">
                      <div className="flex items-start gap-5">
                        {/* Icon */}
                        <div
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0
                            ${
                              item.type === "Critical"
                                ? "bg-red-100 text-red-600"
                                : item.type === "Success"
                                ? "bg-green-100 text-green-600"
                                : item.type === "Warning"
                                ? "bg-orange-100 text-orange-600"
                                : "bg-indigo-100 text-indigo-600"
                            }
                          `}
                        >
                          {item.type === "Critical" && <ShieldAlert className="w-6 h-6" />}
                          {item.type === "Success" && <CheckCircle className="w-6 h-6" />}
                          {item.type === "Warning" && <AlertTriangle className="w-6 h-6" />}
                          {item.type === "Info" && <Info className="w-6 h-6" />}
                        </div>

                        {/* Content */}
                        <div>
                          <div className="flex items-center gap-3">
                             <h3 className={`text-lg font-bold ${!isRead ? "text-gray-900" : "text-gray-600"}`}>
                               {item.title}
                             </h3>
                             {!isRead && (
                               <span className="w-2.5 h-2.5 bg-[#5B5FEF] rounded-full inline-block"></span>
                             )}
                          </div>
                          
                          <p className={`mt-1.5 font-medium text-sm ${!isRead ? "text-gray-700" : "text-gray-500"}`}>
                            {item.description}
                          </p>

                          <p className="text-xs text-gray-400 mt-3 font-semibold uppercase tracking-wider">
                            Timestamp: {item.time}
                          </p>
                        </div>
                      </div>

                      {/* Badge */}
                      <div className="flex items-center gap-3">
                         <span
                           className={`px-3 py-1.5 rounded-full text-xs font-bold border inline-block
                             ${
                               item.type === "Critical"
                                 ? "bg-red-50 text-red-700 border-red-100"
                                 : item.type === "Success"
                                 ? "bg-green-50 text-green-700 border-green-100"
                                 : item.type === "Warning"
                                 ? "bg-orange-50 text-orange-700 border-orange-100"
                                 : "bg-indigo-50 text-indigo-700 border-indigo-100"
                             }
                           `}
                         >
                           {item.type} Status
                         </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
               <div className="p-16 text-center text-gray-400 font-medium text-sm">
                  No active system notifications or alerts currently available.
               </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Notifications;