import clsx from 'clsx';
import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WizardLayout({ children, currentStep, totalSteps }) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
            <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
                <Link to="/" className="flex items-center gap-2 font-bold text-xl text-gray-900 dark:text-white">
                    <Shield className="text-primary" size={24} />
                    <span>Zedeck's Training</span>
                </Link>
                <div className="text-sm text-gray-500">
                    Step {currentStep} of {totalSteps}
                </div>
            </header>

            <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
                <div className="w-full max-w-3xl">
                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-500 ease-out"
                                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-gray-500 font-medium">
                            <span className={clsx(currentStep >= 1 && "text-primary")}>Personal</span>
                            <span className={clsx(currentStep >= 2 && "text-primary")}>Course</span>
                            <span className={clsx(currentStep >= 3 && "text-primary")}>ID Card</span>
                            <span className={clsx(currentStep >= 4 && "text-primary")}>Payment</span>
                            <span className={clsx(currentStep >= 5 && "text-primary")}>Account</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-10 border border-gray-100 dark:border-gray-700">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
