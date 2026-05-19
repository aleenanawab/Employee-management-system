'use client';

import { motion } from 'framer-motion';
import { formatDate } from '@/lib/utils';
import type { ActivityItem } from '@/types';
import { UserPlus, Pencil, Trash2, Activity } from 'lucide-react';

const actionConfig: Record<string, { icon: typeof UserPlus; gradient: string; label: string }> = {
  CREATE: { icon: UserPlus, gradient: 'from-emerald-500 to-teal-500', label: 'Created' },
  UPDATE: { icon: Pencil,   gradient: 'from-blue-500 to-cyan-500',    label: 'Updated' },
  DELETE: { icon: Trash2,   gradient: 'from-red-500 to-rose-500',     label: 'Deleted' },
};

export default function RecentActivity({ activities }: { activities: ActivityItem[] }) {
  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 dark:bg-white/5 mb-3">
          <Activity size={20} className="opacity-40" />
        </div>
        <p className="text-sm font-medium">No recent activity</p>
        <p className="text-xs text-gray-400 mt-1">Actions will appear here</p>
      </div>
    );
  }

  return (
    <ul className="space-y-1">
      {activities.map((a, i) => {
        const cfg = actionConfig[a.action] ?? actionConfig.UPDATE;
        const Icon = cfg.icon;
        return (
          <motion.li
            key={a._id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.035 }}
            className="flex items-center gap-3.5 rounded-xl px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-white/4 transition-colors group"
          >
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${cfg.gradient} shadow-sm text-white`}>
              <Icon size={13} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                <span className="text-gray-500 dark:text-gray-400 font-normal">{cfg.label} </span>
                {a.entity}
              </p>
              {a.details && (
                <p className="text-[11px] text-gray-500 dark:text-gray-500 truncate mt-0.5">{a.details}</p>
              )}
            </div>
            <p className="shrink-0 text-[11px] text-gray-500 dark:text-gray-500 tabular-nums">
              {formatDate(a.createdAt)}
            </p>
          </motion.li>
        );
      })}
    </ul>
  );
}
