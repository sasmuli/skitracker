export type NotificationType = 'resort_approved' | 'resort_declined' | 'resort_submitted';

export type Notification = {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  resort_id: string | null;
  created_at: string;
};

export type NotificationInput = {
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  resort_id?: string | null;
};
