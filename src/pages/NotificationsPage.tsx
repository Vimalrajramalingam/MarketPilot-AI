import React from 'react';
import { AppNotification } from '../types';
import { Bell, Check, Zap, Package, Tag, ArrowRight } from 'lucide-react';

interface NotificationsPageProps {
  notifications: AppNotification[];
  onMarkAllRead: () => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({
  notifications,
  onMarkAllRead,
}) => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-amber-400" />
            Notifications Center
          </h1>
          <p className="text-xs text-slate-400">Updates on store pickup ready status & promo offers</p>
        </div>

        {notifications.some((n) => !n.read) && (
          <button
            onClick={onMarkAllRead}
            className="text-xs text-blue-400 hover:text-blue-300 underline font-bold"
          >
            Mark All as Read
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-4 rounded-2xl border transition flex items-start gap-4 ${
              !n.read
                ? 'bg-blue-600/10 border-blue-500/40 text-white'
                : 'bg-white/5 border-white/10 text-slate-300'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
              {n.type === 'pickup_ready' ? (
                <Zap className="w-4 h-4 fill-blue-400" />
              ) : n.type === 'order' ? (
                <Package className="w-4 h-4" />
              ) : (
                <Tag className="w-4 h-4" />
              )}
            </div>

            <div className="space-y-1 flex-1 text-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white">{n.title}</h3>
                <span className="text-[10px] text-slate-400">
                  {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed">{n.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
