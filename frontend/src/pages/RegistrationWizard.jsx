import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, Shield, ChevronLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { cn } from '../lib/utils';

// Import existing steps
import Step1Personal from '../components/wizard/Step1Personal';
import Step2Course from '../components/wizard/Step2Course';
import Step3ID from '../components/wizard/Step3ID';
import Step4Payment from '../components/wizard/Step4Payment';
import Step5Account from '../components/wizard/Step5Account';

const steps = [
    { id: "personal", title: "Dados Pessoais" },
    { id: "course", title: "Cursos" },
    { id: "idcard", title: "Cartão ID" },
    { id: "payment", title: "Pagamento" },
    { id: "account", title: "Conta" },
];

const contentVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.2 } },
};

export default function RegistrationWizard() {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        // Step 1: Personal
        firstName: '',
        lastName: '',
        fatherName: '',
        motherName: '',
        birthDate: '',
        birthPlace: '',
        nationality: 'Moçambicana',
        documentType: 'BI',
        documentNumber: '',
        gender: '',
        educationLevel: '',
        hasSpecialNeeds: false,
        specialNeedsDescription: '',
        occupation: '',

        // Step 2: Course
        courses: [], // Array of selected courses (max 2)
        schedule: '',
        examModality: '', // for English II/III
        programmingType: '', // for Programming

        // Step 3: Generated ID
        generatedId: '',
        profilePhoto: null,

        // Step 4: Payment
        paymentMethod: '',
        paymentProof: null,
        uniformOption: 'no',

        // Step 5: Account
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });

    const updateFormData = (data) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    // Render step content wrapper
    const renderStepContent = () => {
        const props = { formData, updateFormData, onNext: nextStep, onBack: prevStep };

        switch (currentStep) {
            case 1: return <Step1Personal {...props} />;
            case 2: return <Step2Course {...props} />;
            case 3: return <Step3ID {...props} />;
            case 4: return <Step4Payment {...props} />;
            case 5: return <Step5Account {...props} onBack={prevStep} />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center">

            {/* Header */}
            <div className="mb-8 text-center flex flex-col items-center">
                <div className="flex items-center gap-2 mb-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg">
                    <Shield className="text-primary h-8 w-8" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Zedeck's Training</h1>
                <p className="text-gray-500 dark:text-gray-400">Portal de Inscrições Online</p>
            </div>

            <div className="w-full max-w-4xl">
                {/* Progress Steps */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex justify-between relative mb-8">
                        {/* Connecting Line */}
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 -translate-y-1/2 z-0 rounded-full"></div>
                        <motion.div
                            className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                            transition={{ duration: 0.3 }}
                        />

                        {steps.map((step, index) => {
                            const stepNum = index + 1;
                            const isActive = stepNum === currentStep;
                            const isCompleted = stepNum < currentStep;

                            return (
                                <div key={step.id} className="relative z-10 flex flex-col items-center">
                                    <motion.div
                                        className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 font-bold text-sm cursor-default bg-gray-50 dark:bg-gray-900",
                                            isActive ? "border-primary bg-primary text-white shadow-lg shadow-primary/30" :
                                                isCompleted ? "border-primary bg-primary text-white" : "border-gray-300 dark:border-gray-600 text-gray-400"
                                        )}
                                        whileHover={{ scale: 1.1 }}
                                    >
                                        {isCompleted ? <Check className="w-5 h-5" /> : stepNum}
                                    </motion.div>
                                    <span className={cn(
                                        "absolute top-12 text-xs font-medium whitespace-nowrap transition-colors duration-300",
                                        isActive ? "text-primary" : "text-gray-500 dark:text-gray-400"
                                    )}>
                                        {step.title}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Main Content Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <Card className="border-none shadow-2xl dark:bg-gray-800/50 backdrop-blur-sm overflow-hidden min-h-[500px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={contentVariants}
                                className="h-full"
                            >
                                <CardContent className="p-6 sm:p-10 h-full">
                                    {renderStepContent()}
                                </CardContent>
                            </motion.div>
                        </AnimatePresence>
                    </Card>
                </motion.div>
            </div>

            <div className="mt-8 text-xs text-gray-400 text-center">
                &copy; {new Date().getFullYear()} Zedeck's Training. All rights reserved.
            </div>
        </div>
    );
}
