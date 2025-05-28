import { Card, CardContent } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color: 'primary' | 'secondary' | 'accent' | 'purple';
}

const colorClasses = {
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-orange-100 text-orange-600',
  accent: 'bg-green-100 text-green-600',
  purple: 'bg-purple-100 text-purple-600'
};

export function StatsCard({ title, value, subtitle, icon, trend, color }: StatsCardProps) {
  return (
    <Card className="border border-gray-100 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {subtitle && (
              <p className="text-sm text-gray-500">{subtitle}</p>
            )}
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
            <i className={`${icon} text-xl`}></i>
          </div>
        </div>
        {trend && (
          <p className={`text-sm mt-2 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            <i className={`fas fa-arrow-${trend.isPositive ? 'up' : 'down'} mr-1`}></i>
            {trend.value}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
