import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WizardLayout from '../components/wizard/WizardLayout';
import Step1Personal from '../components/wizard/Step1Personal';
import Step2Course from '../components/wizard/Step2Course';
import Step3ID from '../components/wizard/Step3ID';
import Step4Payment from '../components/wizard/Step4Payment';
import Step5Account from '../components/wizard/Step5Account';

export default function RegistrationWizard() {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        // Step 1: Personal
        firstName: '',
        lastName: '',
        birthDate: '',
        birthPlace: '',
        nationality: 'Moçambicana',
        documentType: 'BI',
        documentNumber: '',
        educationLevel: '',
        hasSpecialNeeds: false,
        specialNeedsDescription: '',

        // Step 2: Course
        courses: [], // Array of selected courses (max 2)
        schedule: '',
        examModality: '', // for English II/III
        programmingType: '', // for Programming

        // Step 3: Generated ID
        generatedId: '',

        // Step 4: Payment
        paymentMethod: '',

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

    const renderStep = () => {
        switch (currentStep) {
            case 1: return <Step1Personal formData={formData} updateFormData={updateFormData} onNext={nextStep} />;
            case 2: return <Step2Course formData={formData} updateFormData={updateFormData} onNext={nextStep} onBack={prevStep} />;
            case 3: return <Step3ID formData={formData} updateFormData={updateFormData} onNext={nextStep} onBack={prevStep} />;
            case 4: return <Step4Payment formData={formData} updateFormData={updateFormData} onNext={nextStep} onBack={prevStep} />;
            case 5: return <Step5Account formData={formData} updateFormData={updateFormData} onBack={prevStep} />;
            default: return null;
        }
    };

    return (
        <WizardLayout currentStep={currentStep} totalSteps={5}>
            <AnimatePresence mode='wait'>
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {renderStep()}
                </motion.div>
            </AnimatePresence>
        </WizardLayout>
    );
}
