"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, CheckCheck, X, Trash2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { markNotificationAsRead, deleteNotification, deleteAllNotifications } from "@/lib/actions/notifications";
import type { Notification } from "@/types/notifications";

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    let subscription: any;

    async function setupNotifications() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      // Initial fetch
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);
      
      if (data) setNotifications(data);

      // Subscribe to real-time changes
      subscription = supabase
        .channel('notifications-changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            setNotifications(prev => [payload.new as Notification, ...prev].slice(0, 10));
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            setNotifications(prev => 
              prev.map(n => n.id === payload.new.id ? payload.new as Notification : n)
            );
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            setNotifications(prev => prev.filter(n => n.id !== payload.old.id));
          }
        )
        .subscribe();
    }

    setupNotifications();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await markNotificationAsRead(notification.id);
      setNotifications(prev => 
        prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
      );
    }
  };

  const handleDeleteNotification = async (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    await deleteNotification(notificationId);
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const handleClearAll = async () => {
    await deleteAllNotifications();
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notification-dropdown-container" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="notification-icon-btn"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-dropdown-header">
            <h3 className="notification-dropdown-title">Notifications</h3>
            <div className="flex items-center gap-3">
              {notifications.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="flex items-center gap-1 text-xs text-[var(--color-text-muted)] hover:text-[var(--accent)] transition-colors"
                  title="Clear all notifications"
                >
                  Clear All
                </button>
              )}
              {unreadCount > 0 && (
                <span className="notification-unread-count">{unreadCount} unread</span>
              )}
            </div>
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="notification-empty">
                <Bell className="w-8 h-8 text-[var(--color-text-muted)] mb-2" />
                <p className="text-sm text-[var(--color-text-muted)]">
                  No notifications yet
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-item-content">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="notification-item-title flex-1">{notification.title}</h4>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => handleDeleteNotification(e, notification.id)}
                          className="p-1 hover:bg-[rgba(255,255,255,0.1)] rounded transition-colors"
                          title="Delete notification"
                        >
                          <X className="w-3.5 h-3.5 text-[var(--color-text-muted)] hover:text-[var(--accent)]" />
                        </button>
                        {notification.read && (
                          <CheckCheck className="w-4 h-4 text-sky-400 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                    <p className="notification-item-message">{notification.message}</p>
                    <span className="notification-item-time">
                      {new Date(notification.created_at).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
