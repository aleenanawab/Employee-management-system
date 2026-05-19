import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color?: "blue" | "green" | "purple" | "yellow";
  index?: number;
}

const colorMap = {
  purple: { bg: "rgba(109,40,217,0.1)", color: "#7c3aed", glow: "rgba(109,40,217,0.25)" },
  green:  { bg: "rgba(5,150,105,0.1)",  color: "#059669", glow: "rgba(5,150,105,0.25)" },
  blue:   { bg: "rgba(37,99,235,0.1)",  color: "#2563eb", glow: "rgba(37,99,235,0.25)" },
  yellow: { bg: "rgba(217,119,6,0.1)",  color: "#d97706", glow: "rgba(217,119,6,0.25)" },
};

export default function StatsCard({ title, value, icon, color = "purple", index = 0 }: StatsCardProps) {
  const c = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="relative overflow-hidden rounded-2xl p-5 cursor-default group"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-card)',
        transition: 'box-shadow 0.25s ease, border-color 0.25s ease',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 1px ${c.color}40, var(--shadow-hover)`;
        (e.currentTarget as HTMLElement).style.borderColor = `${c.color}50`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-card)';
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
      }}
    >
      {/* Subtle glow bg */}
      <div
        className="absolute -top-6 -right-6 h-24 w-24 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: c.glow }}
      />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium" style={{ color: 'var(--fg-muted)' }}>{title}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight" style={{ color: 'var(--fg)' }}>{value}</p>
        </div>
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110"
          style={{ background: c.bg, color: c.color }}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
