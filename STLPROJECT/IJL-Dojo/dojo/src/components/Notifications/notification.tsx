import React, { useEffect, useState, useRef } from 'react';
import Nav from '../HomeNav/nav';
import { Bell, Check, CheckCheck, AlertCircle, Info, Clock, User, BookOpen, Calendar, RefreshCw, Trash2 } from 'lucide-react';

interface Notification {
  id: number;
  title: string;
  message: string;
  notification_type: string;
  recipient_name?: string;
  operator_name?: string;
  level_name?: string;
  is_read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
  time_ago: string;
  is_recent: boolean;
  metadata?: Record<string, any>;
}

interface NotificationStats {
  total_count: number;
  unread_count: number;
  read_count: number;
  recent_count: number;
  by_type: Record<string, number>;
  by_priority: Record<string, number>;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const AppNotification: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'recent'>('all');
  const [isConnected, setIsConnected] = useState(false);

  const pollIntervalRef = useRef<number | null>(null);

  // No authentication required for notifications

  // Define the specific notification types we want to fetch
  const NOTIFICATION_TYPES = {
    EMPLOYEE_REGISTRATION: "employee_registration",
    LEVEL_EXAM_COMPLETED: "level_exam_completed",
    TRAINING_RESCHEDULE: "training_reschedule",
    REFRESHER_TRAINING_SCHEDULED: "refresher_training_scheduled",
    REFRESHER_TRAINING_COMPLETED: "refresher_training_completed",
    BENDING_TRAINING_ADDED: "bending_training_added",
    SYSTEM_ALERT: "system_alert"
  };

  // Fetch notifications from API - no authentication required
  const fetchNotifications = async (filterType: string = 'all') => {
    setLoading(true);
    try {
      // Get read and deleted notifications from localStorage
      const readNotifications = JSON.parse(localStorage.getItem('readNotifications') || '[]');
      const deletedNotifications = JSON.parse(localStorage.getItem('deletedNotifications') || '[]');

      let allNotifications: Notification[] = [];

      // Fetch real notifications from backend without authentication
      try {
        const params = new URLSearchParams();

        // Filter by specific notification types we care about
        Object.values(NOTIFICATION_TYPES).forEach(type => {
          params.append('notification_type', type);
        });

        if (filterType === 'unread') {
          params.append('is_read', 'false');
        } else if (filterType === 'recent') {
          params.append('days', '1');
        }

        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };

        console.log('📡 Fetching notifications without authentication');

        const response = await fetch(`${API_BASE_URL}/notifications/?${params}`, {
          headers
        });

        if (response.ok) {
          const data = await response.json();
          const realNotifications = data.results || data || [];

          // Process real notifications and apply local read/delete status
          allNotifications = realNotifications
            .filter((notif: any) => Object.values(NOTIFICATION_TYPES).includes(notif.notification_type))
            .map((notif: any) => ({
              ...notif,
              is_read: readNotifications.includes(notif.id) || notif.is_read,
              time_ago: formatTimeAgo(notif.created_at),
              is_recent: isRecentNotification(notif.created_at)
            }))
            .filter((notif: any) => !deletedNotifications.includes(notif.id));

          console.log(`✅ Loaded ${allNotifications.length} real notifications from backend`);

          if (allNotifications.length > 0) {
            // Log the types of notifications found
            const typeCounts = allNotifications.reduce((acc: any, notif: any) => {
              acc[notif.notification_type] = (acc[notif.notification_type] || 0) + 1;
              return acc;
            }, {});
            console.log('📊 Real notification types found:', typeCounts);
          } else {
            console.log('� No real notifications found. Add employees, complete exams, or schedule training to see notifications.');
          }
        } else if (response.status === 401) {
          console.log('🔐 API returned 401 - but continuing without authentication');
          // Don't set error, just continue without authentication
        } else {
          console.log(`⚠️ API returned status: ${response.status}`);
          setError(`Failed to load notifications (Status: ${response.status})`);
        }
      } catch (apiError) {
        console.log('� API connection failed:', apiError);
        setError('Unable to connect to notification service');
      }

      // Filter notifications based on filterType
      let filteredNotifications = allNotifications;
      if (filterType === 'unread') {
        filteredNotifications = allNotifications.filter(n => !n.is_read);
      } else if (filterType === 'recent') {
        filteredNotifications = allNotifications.filter(n => n.is_recent);
      }

      setNotifications(filteredNotifications);

    } catch (err) {
      console.error('❌ Error fetching notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to check if notification is recent (within 24 hours)
  const isRecentNotification = (dateString: string): boolean => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    return diffInHours <= 24;
  };

  // Helper function to format time ago
  const formatTimeAgo = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  // Fetch notification statistics
  const fetchStats = async () => {
    try {
      // Calculate stats from current real notifications only
      const total_count = notifications.length;
      const unread_count = notifications.filter(n => !n.is_read).length;
      const read_count = total_count - unread_count;
      const recent_count = notifications.filter(n => n.is_recent).length;

      const by_type: Record<string, number> = {};
      const by_priority: Record<string, number> = {};

      notifications.forEach(n => {
        by_type[n.notification_type] = (by_type[n.notification_type] || 0) + 1;
        by_priority[n.priority] = (by_priority[n.priority] || 0) + 1;
      });

      const calculatedStats: NotificationStats = {
        total_count,
        unread_count,
        read_count,
        recent_count,
        by_type,
        by_priority
      };

      setStats(calculatedStats);
      console.log('📊 Using calculated stats from real notifications');
    } catch (err) {
      console.log('📊 Error calculating stats:', err);
    }
  };

  // Initialize component and set up polling
  useEffect(() => {
    // Initial load
    fetchNotifications();
    fetchStats();
    setIsConnected(true);
    setError(null);

    // Clear any existing interval
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }

    // Set up polling for real-time updates every 5 seconds
    const pollInterval = setInterval(() => {
      fetchNotifications(filter);
      fetchStats();
    }, 30000);

    pollIntervalRef.current = pollInterval;

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, []); // Empty dependency array - only run once on mount

  // Update notifications when filter changes and restart polling
  useEffect(() => {
    fetchNotifications(filter);

    // Restart polling with new filter
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);

      const pollInterval = setInterval(() => {
        fetchNotifications(filter);
        fetchStats();
      }, 30000);

      pollIntervalRef.current = pollInterval;
    }
  }, [filter]);

  // Update stats when notifications change
  useEffect(() => {
    fetchStats();
  }, [notifications]);

  // Mark notification as read
  const markAsRead = async (notificationId: number) => {
    try {
      // Update local state immediately (this always works)
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      );

      // Store read status in localStorage for persistence
      const readNotifications = JSON.parse(localStorage.getItem('readNotifications') || '[]');
      if (!readNotifications.includes(notificationId)) {
        readNotifications.push(notificationId);
        localStorage.setItem('readNotifications', JSON.stringify(readNotifications));
      }

      // Local storage only - no server update needed

      // Update stats after marking as read
      setTimeout(() => fetchStats(), 100);
    } catch (err) {
      console.log('Local state updated successfully');
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      // Update local state immediately
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, is_read: true }))
      );

      // Store all notification IDs as read in localStorage
      const allNotificationIds = notifications.map(n => n.id);
      localStorage.setItem('readNotifications', JSON.stringify(allNotificationIds));

      // Local storage only - no server update needed

      // Update stats after marking all as read
      setTimeout(() => fetchStats(), 100);
    } catch (err) {
      console.log('Local state updated successfully');
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId: number) => {
    try {
      // Update local state immediately (remove from list)
      setNotifications(prev =>
        prev.filter(notif => notif.id !== notificationId)
      );

      // Remove from localStorage read notifications
      const readNotifications = JSON.parse(localStorage.getItem('readNotifications') || '[]');
      const updatedReadNotifications = readNotifications.filter((id: number) => id !== notificationId);
      localStorage.setItem('readNotifications', JSON.stringify(updatedReadNotifications));

      // Store deleted notifications in localStorage
      const deletedNotifications = JSON.parse(localStorage.getItem('deletedNotifications') || '[]');
      if (!deletedNotifications.includes(notificationId)) {
        deletedNotifications.push(notificationId);
        localStorage.setItem('deletedNotifications', JSON.stringify(deletedNotifications));
      }

      // Local storage only - no server update needed

      // Update stats after deletion
      setTimeout(() => fetchStats(), 100);
    } catch (err) {
      console.log('Local state updated successfully');
    }
  };

  // Delete all notifications
  const deleteAllNotifications = async () => {
    if (window.confirm('Are you sure you want to delete all notifications? This action cannot be undone.')) {
      try {
        // Store all notification IDs as deleted
        const allNotificationIds = notifications.map(n => n.id);
        localStorage.setItem('deletedNotifications', JSON.stringify(allNotificationIds));

        // Clear notifications from state
        setNotifications([]);

        // Clear read notifications from localStorage
        localStorage.removeItem('readNotifications');

        // Local storage only - no server update needed

        // Update stats after deletion
        setTimeout(() => fetchStats(), 100);
      } catch (err) {
        console.log('Local state updated successfully');
      }
    }
  };

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'employee_registration': return <User className="w-5 h-5" />;
      case 'level_exam_completed': return <Check className="w-5 h-5" />;
      case 'training_reschedule': return <Calendar className="w-5 h-5" />;
      case 'refresher_training_scheduled': return <BookOpen className="w-5 h-5" />;
      case 'refresher_training_completed': return <CheckCheck className="w-5 h-5" />;
      case 'bending_training_added': return <Info className="w-5 h-5" />;
      case 'system_alert': return <AlertCircle className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  // Get notification type display name
  const getNotificationTypeDisplay = (type: string) => {
    switch (type) {
      case 'employee_registration': return 'Employee Registration';
      case 'level_exam_completed': return 'Level Exam Completed';
      case 'training_reschedule': return 'Training Reschedule';
      case 'refresher_training_scheduled': return 'Refresher Training Scheduled';
      case 'refresher_training_completed': return 'Refresher Training Completed';
      case 'bending_training_added': return 'Bending Training Added';
      case 'system_alert': return 'System Alert';
      default: return 'Notification';
    }
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(notif => {
    switch (filter) {
      case 'unread': return !notif.is_read;
      case 'recent': return notif.is_recent;
      default: return true;
    }
  });

  if (loading) {
    return (
      <>
        <Nav />
        <div className="mt-16 flex justify-center items-center min-h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Nav />
        <div className="mt-16 max-w-7xl mx-auto p-4 bg-red-100 text-red-700 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Nav />
      <div className="mt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          {/* Header */}
          <div className="p-6 bg-[#001740]">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <Bell className="w-8 h-8 text-white" />
                <h2 className="text-2xl font-bold text-white">Notifications</h2>
                {/* Connection status */}
                {/* <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}
                     title={isConnected ? 'Connected' : 'Disconnected'} /> */}
                {/* Real data indicator */}
                {notifications.length > 0 && (
                  <span className="">
                  
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-3">
                {stats && stats.unread_count > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-blue-100 bg-blue-700 bg-opacity-50 rounded-lg hover:bg-opacity-75 transition"
                  >
                    <CheckCheck className="w-4 h-4" />
                    <span>Mark all as read</span>
                  </button>
                )}

                {stats && stats.total_count > 0 && (
                  <button
                    onClick={deleteAllNotifications}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-red-100 bg-red-700 bg-opacity-50 rounded-lg hover:bg-opacity-75 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete all</span>
                  </button>
                )}
              </div>
            </div>

            {/* Stats */}
            {stats && (
              <div className="flex items-center space-x-6 mt-4 text-sm text-blue-100">
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-blue-300 rounded-full"></span>
                  <span>{stats.total_count} Total</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                  <span>{stats.unread_count} Unread</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>{stats.recent_count} Recent</span>
                </span>
              </div>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {['all', 'unread', 'recent'].map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    filter === filterType
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                  {filterType === 'unread' && stats && stats.unread_count > 0 && (
                    <span className="ml-2 bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs">
                      {stats.unread_count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Notifications List */}
          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-6 transition-all duration-200 relative group ${
                    notification.is_read ? 'bg-white' : 'bg-blue-50'
                  } hover:bg-blue-100`}
                >
                  <div className="flex items-start space-x-4">
                    {/* Icon */}
                    <div className={`flex-shrink-0 p-2 rounded-full border ${getPriorityColor(notification.priority)}`}>
                      {getNotificationIcon(notification.notification_type)}
                    </div>

                    {/* Content */}
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => !notification.is_read && markAsRead(notification.id)}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className={`text-lg font-semibold ${
                          notification.is_read ? 'text-gray-700' : 'text-gray-900'
                        }`}>
                          {notification.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          {!notification.is_read && (
                            <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0" />
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {notification.message}
                      </p>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{notification.time_ago}</span>
                          </span>

                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                            {notification.priority.toUpperCase()}
                          </span>

                          <span className="text-gray-400">
                            {getNotificationTypeDisplay(notification.notification_type)}
                          </span>
                        </div>

                        {notification.operator_name && (
                          <span className="text-xs text-gray-500 flex items-center space-x-1">
                            <User className="w-3 h-3" />
                            <span>{notification.operator_name}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {/* Mark as Read/Unread Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }}
                        className={`p-2 rounded-full transition-colors ${
                          notification.is_read
                            ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                            : 'text-blue-500 hover:text-blue-700 hover:bg-blue-100'
                        }`}
                        title={notification.is_read ? 'Mark as unread' : 'Mark as read'}
                      >
                        {notification.is_read ? <Check className="w-4 h-4" /> : <CheckCheck className="w-4 h-4" />}
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm('Are you sure you want to delete this notification?')) {
                            deleteNotification(notification.id);
                          }
                        }}
                        className="p-2 rounded-full text-red-400 hover:text-red-600 hover:bg-red-100 transition-colors"
                        title="Delete notification"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Notifications</h3>
                <div className="text-sm space-y-2">
                  {filter === 'unread' ? (
                    <p>All notifications have been read</p>
                  ) : filter === 'recent' ? (
                    <p>No recent notifications</p>
                  ) : (
                    <div>
                      <p className="mb-3">No notifications found. To see notifications:</p>
                     
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {isConnected ? (
                  <span className="flex items-center space-x-1 text-green-600">
                    {/* <div className="w-2 h-2 bg-green-500 rounded-full"></div> */}
                    {/* <span>Real-time updates active</span> */}
                  </span>
                ) : (
                  <span className="flex items-center space-x-1 text-red-600">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Reconnecting...</span>
                  </span>
                )}
              </div>

              <button
                onClick={() => fetchNotifications(filter)}
                className="inline-flex items-center space-x-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppNotification;
