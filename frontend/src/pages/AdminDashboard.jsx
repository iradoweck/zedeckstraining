import AdminLayout from '../components/layout/AdminLayout';
import StatsCard from '../components/admin/StatsCard';
import { Card } from '../components/ui/Card';
import { Users, BookOpen, GraduationCap, DollarSign } from 'lucide-react';

export default function AdminDashboard() {
    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold font-heading text-gray-900 dark:text-white">Dashboard Overview</h1>
                <p className="text-gray-500">Welcome back, Admin. Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard
                    title="Total Users"
                    value="1,234"
                    icon={Users}
                    trend="up"
                    trendValue="12%"
                    color="blue"
                />
                <StatsCard
                    title="Active Courses"
                    value="42"
                    icon={BookOpen}
                    trend="up"
                    trendValue="4%"
                    color="purple"
                />
                <StatsCard
                    title="Total Enrollments"
                    value="856"
                    icon={GraduationCap}
                    trend="up"
                    trendValue="24%"
                    color="green"
                />
                <StatsCard
                    title="Revenue"
                    value="$12,450"
                    icon={DollarSign}
                    trend="down"
                    trendValue="2%"
                    color="orange"
                />
            </div>

            {/* Recent Activity / Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 p-6 h-96">
                    <h3 className="font-bold mb-4">Revenue Overview</h3>
                    <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-400">
                        [Chart Placeholder]
                    </div>
                </Card>
                <Card className="p-6 h-96">
                    <h3 className="font-bold mb-4">Recent Enrollments</h3>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">New Student joined</p>
                                    <p className="text-xs text-gray-500">2 hours ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </AdminLayout>
    );
}
