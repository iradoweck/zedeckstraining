import React, { useState } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import StatsCard from '../components/admin/StatsCard';
import { Card } from '../components/ui/card';
import { Users, BookOpen, GraduationCap, DollarSign, LayoutDashboard, FileCheck, Landmark, Award } from 'lucide-react';
import { Button } from '../components/ui/button';
import AdminFinancials from './AdminFinancials';
import AdminApprovals from './AdminApprovals';
import AdminCertificates from './AdminCertificates';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("overview");

    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold font-heading text-gray-900 dark:text-white">Dashboard Overview</h1>
                <p className="text-gray-500">Welcome back, Admin. Manage your academy from here.</p>
            </div>

            {/* Custom Tab Navigation */}
            <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 dark:border-gray-800 pb-2">
                <TabButton
                    active={activeTab === "overview"}
                    onClick={() => setActiveTab("overview")}
                    icon={LayoutDashboard}
                    label="Overview"
                />
                <TabButton
                    active={activeTab === "financials"}
                    onClick={() => setActiveTab("financials")}
                    icon={Landmark}
                    label="Financials"
                />
                <TabButton
                    active={activeTab === "approvals"}
                    onClick={() => setActiveTab("approvals")}
                    icon={FileCheck}
                    label="Approvals"
                />
                <TabButton
                    active={activeTab === "certificates"}
                    onClick={() => setActiveTab("certificates")}
                    icon={Award}
                    label="Certificates"
                />
            </div>

            {/* Tab Content */}
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                {activeTab === "overview" && <DashboardOverview />}
                {activeTab === "financials" && <AdminFinancials />}
                {activeTab === "approvals" && <AdminApprovals />}
                {activeTab === "certificates" && <AdminCertificates />}
            </div>
        </AdminLayout>
    );
}

function TabButton({ active, onClick, icon: Icon, label }) {
    return (
        <Button
            variant={active ? "default" : "ghost"}
            onClick={onClick}
            className={`gap-2 ${active ? "" : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"}`}
        >
            <Icon size={18} />
            {label}
        </Button>
    )
}

function DashboardOverview() {
    return (
        <>
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
                    value="254,450 MT"
                    icon={DollarSign}
                    trend="down"
                    trendValue="2%"
                    color="orange"
                />
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 p-6 h-96">
                    <h3 className="font-bold mb-4">Revenue Overview</h3>
                    <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-400">
                        <p>Chart Placeholder (Recharts Integration Pending)</p>
                    </div>
                </Card>
                <Card className="p-6 h-96">
                    <h3 className="font-bold mb-4">Recent Enrollments</h3>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-500">
                                    {i}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">New Student joined</p>
                                    <p className="text-xs text-gray-500">2 hours ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </>
    );
}
