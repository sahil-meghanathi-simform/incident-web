import { api } from '../client';
import { NotificationItemSchema, type NotificationItem, NotificationsResponseSchema, type NotificationsResponse } from '../contracts/escalation.contract';

export function getNotifications(cursor: string | undefined, pageSize: number): Promise<NotificationsResponse> {
  return api.get<NotificationsResponse>('/api/v1/notifications', NotificationsResponseSchema, { cursor, pageSize });
}

export function markNotificationRead(id: string): Promise<NotificationItem> {
  return api.post<NotificationItem>(`/api/v1/notifications/${id}/read`, NotificationItemSchema);
}
