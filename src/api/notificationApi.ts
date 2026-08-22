import api from "./axios";

export const getNotifications = async () => {
  const response = await api.get("/notifications/");
  return response.data.data;
};

export const markNotificationRead = async (notificationId: number) => {
  const response = await api.patch(`/notifications/${notificationId}/read`);

  return response.data;
};

export const markAllNotificationsRead = async () => {
  const response = await api.patch("/notifications/read-all");

  return response.data;
};
