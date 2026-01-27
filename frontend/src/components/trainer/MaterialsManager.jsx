"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Upload, FileText, Trash2, Link as LinkIcon, Download } from 'lucide-react';

export default function MaterialsManager({ classes = [] }) {
    // Mock Data
    const [materials, setMaterials] = useState([
        { id: 1, title: "Introduction Slides", type: "pdf", size: "2.5MB", class_id: 1, upload_date: "2025-06-12" },
        { id: 2, title: "Lab Exercise 1", type: "docx", size: "1.2MB", class_id: 1, upload_date: "2025-06-15" },
        { id: 3, title: "Reference Links", type: "link", size: "-", class_id: 2, upload_date: "2025-06-18" },
    ]);

    const [isUploading, setIsUploading] = useState(false);

    const handleDelete = (id) => {
        if (window.confirm("Delete this material?")) {
            setMaterials(prev => prev.filter(m => m.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold font-heading">Course Materials</h2>
                    <p className="text-gray-500">Upload and manage resources for your students.</p>
                </div>
                <Button className="gap-2" onClick={() => setIsUploading(!isUploading)}>
                    <Upload size={18} /> {isUploading ? 'Cancel Upload' : 'Upload New Material'}
                </Button>
            </div>

            {/* Upload Area */}
            {isUploading && (
                <Card className="border-dashed border-2 bg-gray-50 dark:bg-gray-800/50">
                    <CardHeader>
                        <CardTitle className="text-base">Upload Resource</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Title</Label>
                                    <Input placeholder="e.g., Week 1 Slides" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Class / Cohort</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Class" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {classes.map(c => (
                                                <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>File or URL</Label>
                                <div className="flex gap-2">
                                    <Input type="file" className="flex-1 bg-white dark:bg-black" />
                                    <span className="text-gray-500 self-center">OR</span>
                                    <Input placeholder="https://..." className="flex-1" />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button type="submit">Upload</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Materials List */}
            <div className="grid gap-3">
                {materials.map((item) => (
                    <Card key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-lg ${item.type === 'pdf' ? 'bg-red-100 text-red-600' :
                                    item.type === 'docx' ? 'bg-blue-100 text-blue-600' :
                                        'bg-gray-100 text-gray-600'
                                }`}>
                                {item.type === 'link' ? <LinkIcon size={20} /> : <FileText size={20} />}
                            </div>
                            <div>
                                <h4 className="font-bold text-sm md:text-base">{item.title}</h4>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <span>{item.type.toUpperCase()}</span>
                                    <span>•</span>
                                    <span>{item.size}</span>
                                    <span>•</span>
                                    <span>{item.upload_date}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600">
                                <Download size={16} />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-600" onClick={() => handleDelete(item.id)}>
                                <Trash2 size={16} />
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
