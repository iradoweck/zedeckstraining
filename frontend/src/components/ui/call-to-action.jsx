"use client";

import React from "react";
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CallToAction() {
    return (
        <section className="relative py-24 overflow-hidden bg-gray-900 text-white isolate">
            {/* Animated Background Gradients */}
            <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/30 rounded-full blur-3xl opacity-50 animate-pulse-slow"></div>
            <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl opacity-50 animate-pulse-slow delay-1000"></div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm mb-6 animate-fade-in-up">
                    <Sparkles size={14} className="text-yellow-400" />
                    <span className="font-medium text-gray-200">Comece sua jornada hoje</span>
                </div>

                <h2 className="text-4xl md:text-6xl font-bold font-heading mb-6 tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent animate-fade-in-up delay-100">
                    Pronto para transformar <br /> seu futuro?
                </h2>

                <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
                    Junte-se a centenas de alunos que já estão construindo carreiras de sucesso com a Zedeck's Training.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up delay-300">
                    <Link to="/register">
                        <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 hover:scale-105 transition-all duration-300 text-lg px-8 py-6 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                            Inscreva-se Agora <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                    <Link to="/courses">
                        <Button variant="outline" size="lg" className="border-white/20 hover:bg-white/10 text-white px-8 py-6 rounded-full backdrop-blur-sm">
                            Ver Cursos Disponíveis
                        </Button>
                    </Link>
                </div>
            </div>

            <style jsx>{`
                @keyframes pulse-slow {
                    0%, 100% { transform: scale(1); opacity: 0.5; }
                    50% { transform: scale(1.2); opacity: 0.3; }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 8s infinite ease-in-out;
                }
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.8s ease-out forwards;
                }
                .delay-100 { animation-delay: 0.1s; }
                .delay-200 { animation-delay: 0.2s; }
                .delay-300 { animation-delay: 0.3s; }
            `}</style>
        </section>
    );
}
