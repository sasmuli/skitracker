"use client";

import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";

type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
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

  // TODO: Fetch notifications from Supabase
  // useEffect(() => {
  //   async function fetchNotifications() {
  //     const supabase = createSupabaseBrowserClient();
  //     const { data } = await supabase
  //       .from("notifications")
  //       .select("*")
  //       .order("created_at", { ascending: false })
  //       .limit(10);
  //     if (data) setNotifications(data);
  //   }
  //   fetchNotifications();
  // }, []);

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
            {unreadCount > 0 && (
              <span className="notification-unread-count">{unreadCount} unread</span>
            )}
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
                >
                  <div className="notification-item-content">
                    <h4 className="notification-item-title">{notification.title}</h4>
                    <p className="notification-item-message">{notification.message}</p>
                    <span className="notification-item-time">
                      {new Date(notification.created_at).toLocaleDateString()}
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
