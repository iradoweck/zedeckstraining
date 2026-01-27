import React from 'react';

const partners = [
    {
        name: "Zedecks IT",
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrG_Q7g303H0zZxdHaoF52H23OQwmVzhCEvA&s",
        height: "h-16"
    },
    {
        name: "Microsoft Windows",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png",
        height: "h-12" // Adjusted for visual balance
    }
];

export default function Partners() {
    return (
        <section className="py-12 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/50">
            <div className="max-w-7xl mx-auto px-6">
                <p className="text-center text-sm font-medium text-gray-400 mb-8 uppercase tracking-widest">
                    Parceiros Oficiais
                </p>
                <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-80 grayscale hover:grayscale-0 transition-all duration-500">
                    {partners.map((partner, index) => (
                        <div key={index} className="flex items-center justify-center">
                            <img
                                src={partner.logo}
                                alt={partner.name}
                                className={`${partner.height} w-auto object-contain hover:scale-110 transition-transform duration-300`}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
