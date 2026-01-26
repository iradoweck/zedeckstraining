import { Card } from '../ui/Card';
import clsx from 'clsx';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function StatsCard({ title, value, icon: Icon, trend, trendValue, color = "blue" }) {
    const colorStyles = {
        blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
        green: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
        purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
        orange: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
    };

    return (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
                <div className={clsx("w-12 h-12 rounded-xl flex items-center justify-center", colorStyles[color])}>
                    <Icon size={24} />
                </div>
                {trend && (
                    <div className={clsx(
                        "flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full",
                        trend === 'up' ? "bg-green-100 text-green-700 dark:bg-green-900/30" : "bg-red-100 text-red-700 dark:bg-red-900/30"
                    )}>
                        {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {trendValue}
                    </div>
                )}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                <h3 className="text-2xl font-bold font-heading mt-1">{value}</h3>
            </div>
        </Card>
    );
}
