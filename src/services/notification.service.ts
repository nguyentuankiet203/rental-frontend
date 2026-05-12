import api from "./api";

export const getNotifications = async () => {
  const res = await api.get("/notifications");
  return res.data;
};

export const getUnreadCount = async () => {
  const res = await api.get("/notifications/unread-count");
  return res.data;
};

export const markAsRead = async (id: number) => {
  await api.patch(`/notifications/${id}/read`);
};

export const markAll = async (id: number) => {
  await api.patch("/notifications/read-all");
};

export const markAllAsRead = async () => {
  await api.post(`/notifications/read-all`);
};