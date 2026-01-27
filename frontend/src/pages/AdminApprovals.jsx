"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Check, X, Eye, FileText } from "lucide-react";

export default function AdminApprovals() {
    // Mock Data
    const [pendingEnrollments, setPendingEnrollments] = useState([
        { id: 101, student: "Maria Langa", course: "Inglês Profissional", date: "2025-06-10", paymentMethod: "M-Pesa", proof: "doc1.pdf", status: "pending" },
        { id: 102, student: "José Cossa", course: "Contabilidade", date: "2025-06-11", paymentMethod: "Bank Transfer", proof: "doc2.jpg", status: "pending" },
    ]);

    const handleApprove = (id) => {
        setPendingEnrollments(prev => prev.filter(p => p.id !== id));
        // API call to approve would go here
        alert(`Enrollment ${id} approved!`);
    };

    const handleReject = (id) => {
        setPendingEnrollments(prev => prev.filter(p => p.id !== id));
        // API call to reject
        alert(`Enrollment ${id} rejected.`);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold font-heading">Enrollment Approvals</h2>
            <p className="text-gray-500">Review and approve pending student registrations.</p>

            <div className="grid gap-4">
                {pendingEnrollments.length === 0 ? (
                    <Card>
                        <CardContent className="pt-6 text-center text-gray-500">
                            No pending approvals.
                        </CardContent>
                    </Card>
                ) : (
                    pendingEnrollments.map((enrollment) => (
                        <Card key={enrollment.id} className="flex flex-col md:flex-row items-center justify-between p-4 gap-4">
                            <div className="flex items-center gap-4 flex-1">
                                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                    {enrollment.student.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg">{enrollment.student}</h4>
                                    <p className="text-sm text-gray-500">{enrollment.course} • {enrollment.date}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full capitalize">{enrollment.paymentMethod}</span>
                                        <button className="text-xs flex items-center gap-1 text-blue-600 hover:underline">
                                            <FileText size={12} /> View Proof
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button variant="outline" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleApprove(enrollment.id)}>
                                    <Check className="w-4 h-4 mr-1" /> Approve
                                </Button>
                                <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleReject(enrollment.id)}>
                                    <X className="w-4 h-4 mr-1" /> Reject
                                </Button>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
