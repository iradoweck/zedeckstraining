"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { QrCode, Download, Printer, Search } from "lucide-react";
import QRCode from "react-qr-code";

export default function AdminCertificates() {
    const [searchTerm, setSearchTerm] = useState("");
    const [certificates, setCertificates] = useState([
        { id: "CERT-2025-001", student: "João Silva", course: "Desenvolvimento Web", issueDate: "2025-06-15", status: "Issued" },
        { id: "CERT-2025-002", student: "Ana Macuácua", course: "Contabilidade Digital", issueDate: "2025-06-16", status: "Pending" },
        { id: "CERT-2025-003", student: "Carlos Muianga", course: "Marketing Digital", issueDate: "2025-06-18", status: "Issued" },
    ]);

    const filteredCerts = certificates.filter(c =>
        c.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold font-heading">Certificates Management</h2>
                    <p className="text-gray-500">Generate, view, and verify student certificates.</p>
                </div>
                <Button className="gap-2">
                    <QrCode size={16} /> Generate New
                </Button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                    placeholder="Search by student or ID..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Certificate List */}
            <div className="grid gap-4">
                {filteredCerts.map((cert) => (
                    <Card key={cert.id} className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1">
                            {/* QR Preview (Small) */}
                            <div className="hidden sm:block p-1 bg-white border rounded">
                                <QRCode value={`https://zedecks.com/verify/${cert.id}`} size={48} />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg">{cert.student}</h4>
                                <p className="text-sm text-gray-500">{cert.course}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">{cert.id}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${cert.status === 'Issued' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {cert.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <Button variant="outline" size="sm" className="flex-1 md:flex-none">
                                <EyeIcon className="w-4 h-4 mr-1" /> View
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1 md:flex-none">
                                <Download className="w-4 h-4 mr-1" /> PDF
                            </Button>
                            <Button variant="ghost" size="sm" className="flex-1 md:flex-none">
                                <Printer className="w-4 h-4" />
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

function EyeIcon({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>
    )
}
