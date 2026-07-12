'use client';

import { Card, CardContent } from '@/components/ui/card';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface PremiumKPICardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: { value: number; direction: 'up' | 'down' };
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'green' | 'orange' | 'red' | 'purple';
  onClick?: () => void;
  sparklineData?: number[];
}

const colorMap = {
  blue: { bg: 'from-blue-500/10 to-blue-600/5 border-blue-200/50 dark:border-blue-800/50', icon: 'from-blue-500 to-blue-600', gradient: '#3b82f6' },
  green: { bg: 'from-green-500/10 to-green-600/5 border-green-200/50 dark:border-green-800/50', icon: 'from-green-500 to-green-600', gradient: '#10b981' },
  orange: { bg: 'from-orange-500/10 to-orange-600/5 border-orange-200/50 dark:border-orange-800/50', icon: 'from-orange-500 to-orange-600', gradient: '#f59e0b' },
  red: { bg: 'from-red-500/10 to-red-600/5 border-red-200/50 dark:border-red-800/50', icon: 'from-red-500 to-red-600', gradient: '#ef4444' },
  purple: { bg: 'from-purple-500/10 to-purple-600/5 border-purple-200/50 dark:border-purple-800/50', icon: 'from-purple-500 to-purple-600', gradient: '#a855f7' },
};

export function PremiumKPICard({
  label,
  value,
  unit,
  trend,
  icon: Icon,
  color,
  onClick,
  sparklineData,
}: PremiumKPICardProps) {
  const colors = colorMap[color];

  return (
    <Card
      className={`
        relative overflow-hidden cursor-pointer
        transition-all duration-300 hover:shadow-lg hover:scale-105
        bg-gradient-to-br ${colors.bg}
        border border-border/40 backdrop-blur-sm
      `}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity" />

      <CardContent className="pt-6 relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
            <div className="mt-3 flex items-baseline gap-2">
              <p className="text-4xl font-bold text-foreground">{value}</p>
              {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
            </div>
            {trend && (
              <div
                className={`mt-2 flex items-center gap-1 text-sm font-medium ${
                  trend.direction === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}
              >
                {trend.direction === 'up' ? '↑' : '↓'} {Math.abs(trend.value)}% from last period
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-br ${colors.icon}`}>
            <Icon className="size-6 text-white" />
          </div>
        </div>

        {sparklineData && (
          <div className="mt-4 h-8">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData.map((v) => ({ value: v }))}>
                <defs>
                  <linearGradient id={`sparkline-${color}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.gradient} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={colors.gradient} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="none" fill={`url(#sparkline-${color})`} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
