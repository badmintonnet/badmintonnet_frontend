import http from "@/lib/http";
import { NotificationMessagePageType } from "@/schemaValidations/common.schema";

const notificationApiRequest = {
  getOldNotifications: (page: number, size: number) =>
    http.get<NotificationMessagePageType>(
      `/notifications/user?page=${page}&size=${size}`,
    ),
  postReadNotifications: () => http.post("/notifications/read"),
};
export default notificationApiRequest;
