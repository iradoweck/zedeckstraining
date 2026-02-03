import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, ArrowLeft, ChevronRight, ChevronLeft, CreditCard, BookOpen, User, Fingerprint, Lock, Code, Globe, Calculator, Palette, Zap, Shirt } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox'; // Ensure Checkbox is imported if available, or use input type='checkbox'
import { formatCurrency } from '../utils/formatters';
import LanguageToggle from '../components/LanguageToggle'; import ThemeToggle from '../components/ThemeToggle';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { usePageTitle } from '../hooks/usePageTitle';

import { MOZ_PROVINCES, COUNTRIES, BR_STATES, US_STATES } from '../components/constants';
import { useQuery } from '@tanstack/react-query';

// --- Helpers ---
const toTitleCase = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\w/g, function (match) {
        return match.toUpperCase();
    });
};

const COURSE_ICONS = {
    'code': Code,
    'globe': Globe,
    'calculator': Calculator,
    'palette': Palette,
    'zap': Zap
};

import { motion, AnimatePresence } from 'framer-motion';

export default function Register() {
    usePageTitle();
    const { t } = useTranslation();
    const { user } = useAuth();
    const navigate = useNavigate();

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    // Wizard State
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 5;
    const [availableCourses, setAvailableCourses] = useState([]);
    const [isLoadingCourses, setIsLoadingCourses] = useState(false);

    useEffect(() => {
        const fetchCourses = async () => {
            setIsLoadingCourses(true);
            try {
                const response = await api.get('/courses'); // Ensure this endpoint exists
                setAvailableCourses(response.data.data || response.data);
            } catch (error) {
                console.error("Failed to fetch courses", error);
            } finally {
                setIsLoadingCourses(false);
            }
        };
        fetchCourses();
    }, []);

    const [formData, setFormData] = useState({
        // Phase 1: Personal (Extended)
        first_name: '',
        last_name: '',
        birth_date: '',
        birth_place_type: 'MZ', // 'MZ', 'BR', 'US', 'Other' (Default matches nationality 'MZ')
        birth_place: '', // State or Custom Text
        gender: '',
        nationality: 'MZ',
        phone_code: '+258',
        phone_number: '',
        civil_status: '',
        occupation: '',
        education_level: '',
        has_special_needs: false,
        special_needs_description: '',

        // Phase 2: Courses
        selected_courses: [], // Array of { id, title, schedule } (Max 2)

        // Documents
        document_type: 'BI',
        document_name: '', // For 'Other'
        document_number: '',

        // Phase 2: Courses
        course: '',
        modality: '',

        // Phase 4: Payment
        payment_method: '',

        // Phase 5: Account
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleNameChange = (e) => {
        const { name, value } = e.target;
        // Auto-capitalize initials
        const formatted = toTitleCase(value);
        setFormData(prev => ({ ...prev, [name]: formatted }));
    };

    const handleDateChange = (e) => {
        const val = e.target.value;
        const birthDate = new Date(val);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age < 14) {
            setError(t('age_restriction_error', 'Must be at least 14 years old'));
        } else {
            setError('');
        }
        setFormData(prev => ({ ...prev, birth_date: val }));
    };

    const handleSelectChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const nextStep = (e) => {
        e.preventDefault();
        setError('');
        // Simple validation per step could go here
        if (currentStep < totalSteps) {
            setCurrentStep(curr => curr + 1);
        }
    };

    const prevStep = () => {
        setError('');
        if (currentStep > 1) {
            setCurrentStep(curr => curr - 1);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (formData.password !== formData.password_confirmation) {
            setError(t('passwords_mismatch', 'Passwords do not match'));
            setIsLoading(false);
            return;
        }

        if (formData.password !== formData.password_confirmation) {
            setError(t('passwords_mismatch', 'Passwords do not match'));
            setIsLoading(false);
            return;
        }

        try {
            await api.post('/auth/register', {
                ...formData,
                name: `${formData.first_name} ${formData.last_name}`.trim(), // Combine names
                role: 'student'
            });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || t('registration_failed', 'Registration failed'));
        } finally {
            setIsLoading(false);
        }
    };

    const currentYear = new Date().getFullYear();
    const version = "v1.2.2";

    // Step Rendering Logic
    const renderStep = () => {
        switch (currentStep) {
            case 1: // Personal Info
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="text-center mb-6">
                            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                                <User className="text-primary" size={24} />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{t('personal_info', 'Personal Information')}</h2>
                            <p className="text-sm text-gray-500">{t('step_1_desc', 'Tell us about yourself')}</p>
                        </div>

                        {/* Name & Surname */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="first_name">{t('first_name_label', 'First Name')} <span className="text-red-500">*</span></Label>
                                <Input
                                    id="first_name"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleNameChange} // Auto-Capitalize
                                    className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="last_name">{t('last_name_label', 'Last Name')} <span className="text-red-500">*</span></Label>
                                <Input
                                    id="last_name"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleNameChange} // Auto-Capitalize
                                    className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                                    required
                                />
                            </div>
                        </div>

                        {/* Date, Gender, Phone */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="birth_date">{t('birth_date_label', 'Date of Birth')} <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="birth_date"
                                        name="birth_date"
                                        type="date"
                                        value={formData.birth_date}
                                        onChange={handleDateChange} // Validates >14
                                        className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">{t('phone_label', 'Phone')} <span className="text-red-500">*</span></Label>
                                    <div className="flex gap-2">
                                        <Select
                                            value={formData.phone_code}
                                            onValueChange={(val) => handleSelectChange('phone_code', val)}
                                        >
                                            <SelectTrigger className="w-[80px] bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 px-2 justify-center">
                                                <span className={`fi fi-${COUNTRIES.find(c => c.dial_code === formData.phone_code)?.code.toLowerCase()} text-lg`}></span>
                                            </SelectTrigger>
                                            <SelectContent className="max-h-[200px]">
                                                {COUNTRIES.map(c => (
                                                    <SelectItem key={c.code} value={c.dial_code}>
                                                        <span className={`fi fi-${c.code.toLowerCase()} mr-2`}></span> {c.dial_code}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Input
                                            name="phone_number"
                                            placeholder="840000000"
                                            value={formData.phone_number}
                                            onChange={handleChange}
                                            className="flex-1 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Visual Gender Selection */}
                            <div className="space-y-2">
                                <Label>{t('gender_label', 'Gender')} <span className="text-red-500">*</span></Label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['M', 'F', 'O'].map((g) => (
                                        <div
                                            key={g}
                                            onClick={() => handleSelectChange('gender', g)}
                                            className={`cursor-pointer rounded-lg border-2 p-2 flex flex-col items-center justify-center transition-all ${formData.gender === g
                                                ? 'border-primary bg-primary/5 text-primary'
                                                : 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-primary/50'
                                                }`}
                                        >
                                            <span className="text-xl">
                                                {g === 'M' ? '👨' : g === 'F' ? '👩' : '🧑'}
                                            </span>
                                            <span className="text-[10px] font-medium uppercase tracking-wide">
                                                {g === 'M' ? t('gender_male', 'Male') : g === 'F' ? t('gender_female', 'Female') : t('gender_other', 'Other')}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Nationality & Birth Place */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="nationality">{t('nationality_label', 'Nationality')}</Label>
                                <Select
                                    name="nationality"
                                    value={formData.nationality}
                                    onValueChange={(val) => {
                                        // Val is now the Country Code (e.g., 'MZ')
                                        const type = ['MZ', 'BR', 'US'].includes(val) ? val : 'Other';
                                        setFormData(prev => ({ ...prev, nationality: val, birth_place_type: type, birth_place: '' }));
                                    }}
                                >
                                    <SelectTrigger className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                                        <span className="flex items-center">
                                            <span className={`fi fi-${formData.nationality.toLowerCase()} mr-2 text-lg`}></span>
                                            {t(`country_${formData.nationality.toLowerCase()}`)}
                                        </span>
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[300px]">
                                        {COUNTRIES.map(c => (
                                            <SelectItem key={c.code} value={c.code}>
                                                <span className={`fi fi-${c.code.toLowerCase()} mr-2`}></span> {t(`country_${c.code.toLowerCase()}`)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="birth_place">{t('birth_place_label', 'Place of Birth')}</Label>
                                {['MZ', 'BR', 'US'].includes(formData.birth_place_type) ? (
                                    <Select
                                        value={formData.birth_place}
                                        onValueChange={(val) => handleSelectChange('birth_place', val)}
                                    >
                                        <SelectTrigger className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                                            <SelectValue placeholder={t('select_state', 'Select State/Province')} />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-[200px]">
                                            {(formData.birth_place_type === 'MZ' ? MOZ_PROVINCES : formData.birth_place_type === 'BR' ? BR_STATES : US_STATES).map(p => (
                                                <SelectItem key={p} value={p}>{p}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <Input
                                        id="birth_place"
                                        name="birth_place"
                                        value={formData.birth_place}
                                        onChange={handleChange}
                                        placeholder={formData.nationality === 'MZ' ? 'Província' : 'Cidade/Estado'}
                                        className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Civil Status & Document */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Civil Status (Smaller width) */}
                            <div className="space-y-2 col-span-1">
                                <Label htmlFor="civil_status">{t('civil_status_label', 'Civil Status')}</Label>
                                <Select
                                    name="civil_status"
                                    value={formData.civil_status || undefined}
                                    onValueChange={(val) => handleSelectChange('civil_status', val)}
                                >
                                    <SelectTrigger className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                                        <SelectValue placeholder={t('select_civil_status', 'Select')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Single">{t('civil_single', 'Single')}</SelectItem>
                                        <SelectItem value="Married">{t('civil_married', 'Married')}</SelectItem>
                                        <SelectItem value="Divorced">{t('civil_divorced', 'Divorced')}</SelectItem>
                                        <SelectItem value="Widowed">{t('civil_widowed', 'Widowed')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Document Info (Wider to fit on one line) */}
                            <div className="space-y-2 col-span-1 md:col-span-2">
                                <Label htmlFor="document_type">{t('doc_type_label', 'Identification Document')}</Label>
                                <div className={`grid gap-2 ${formData.document_type === 'Other' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
                                    {/* Doc Type */}
                                    <Select
                                        name="document_type"
                                        value={formData.document_type || undefined}
                                        onValueChange={(val) => handleSelectChange('document_type', val)}
                                    >
                                        <SelectTrigger className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="BI">BI / ID Card</SelectItem>
                                            <SelectItem value="Passport">{t('doc_passport', 'Passaporte')}</SelectItem>
                                            <SelectItem value="DrivingLicense">{t('doc_driving_license', 'Letter of Driving')}</SelectItem>
                                            <SelectItem value="DIRE">DIRE</SelectItem>
                                            <SelectItem value="Other">{t('doc_other', 'Outro')}</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {/* Doc Fields */}
                                    {formData.document_type === 'Other' ? (
                                        <>
                                            <Input
                                                name="document_name"
                                                placeholder={t('doc_name_label', 'Doc Name')}
                                                value={formData.document_name}
                                                onChange={handleChange}
                                                className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                                            />
                                            <Input
                                                name="document_number"
                                                placeholder={t('doc_number_label', 'Number')}
                                                value={formData.document_number}
                                                onChange={handleChange}
                                                className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                                            />
                                        </>
                                    ) : (
                                        <Input
                                            name="document_number"
                                            placeholder={t('doc_number_label', 'Document Number')}
                                            value={formData.document_number}
                                            onChange={handleChange}
                                            className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Education & Occupation */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="education_level">{t('education_level_label', 'Education Level')} <span className="text-red-500">*</span></Label>
                                <Select
                                    name="education_level"
                                    value={formData.education_level || undefined}
                                    onValueChange={(val) => handleSelectChange('education_level', val)}
                                    required
                                >
                                    <SelectTrigger className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                                        <SelectValue placeholder={t('select_education', 'Select')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Basic">{t('edu_basic', 'Basic')}</SelectItem>
                                        <SelectItem value="Medium">{t('edu_medium', 'Medium')}</SelectItem>
                                        <SelectItem value="Bachelor">{t('edu_bachelor', 'Bachelor')}</SelectItem>
                                        <SelectItem value="Master">{t('edu_master', 'Master')}</SelectItem>
                                        <SelectItem value="Doctorate">{t('edu_doctorate', 'Doctorate')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="occupation">{t('occupation_label', 'Occupation')}</Label>
                                <Input
                                    id="occupation"
                                    name="occupation"
                                    value={formData.occupation}
                                    onChange={handleChange}
                                    className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                                />
                            </div>
                        </div>

                        {/* Special Needs */}
                        <div className="space-y-4 pt-2 border-t border-gray-100 dark:border-gray-700 mt-4">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="has_special_needs"
                                    name="has_special_needs"
                                    checked={formData.has_special_needs}
                                    onChange={(e) => setFormData(prev => ({ ...prev, has_special_needs: e.target.checked }))}
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                                />
                                <Label htmlFor="has_special_needs" className="font-normal cursor-pointer select-none">
                                    {t('special_needs_label', 'Possui alguma necessidade educativa especial?')}
                                </Label>
                            </div>

                            {formData.has_special_needs && (
                                <div className="animate-in fade-in slide-in-from-top-2 ml-6">
                                    <Label htmlFor="special_needs_description" className="text-xs text-gray-500 mb-1 block">
                                        {t('special_needs_desc_label', 'Descreva a necessidade (Opcional)')}
                                    </Label>
                                    <Input
                                        id="special_needs_description"
                                        name="special_needs_description"
                                        value={formData.special_needs_description}
                                        onChange={handleChange}
                                        placeholder="Ex: Dificuldade de locomoção, audição, etc."
                                        className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 2: // Courses
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4 ring-4 ring-primary/5">
                                <BookOpen className="text-primary" size={28} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('courses_selection', 'Selecione seu Curso')}</h2>
                            <p className="text-gray-500 max-w-md mx-auto">{t('step_2_desc', 'Escolha até 2 cursos para começar sua jornada profissional.')}</p>
                        </div>

                        {isLoadingCourses ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-48 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar pb-4">
                                {availableCourses.map(course => {
                                    const isSelected = formData.selected_courses?.some(c => c.id === course.id);
                                    const selectedData = formData.selected_courses?.find(c => c.id === course.id);
                                    const Icon = COURSE_ICONS[course.options?.icon] || BookOpen;

                                    // Dynamic Uniform Logic
                                    const isOnline = selectedData?.modality === 'Online';
                                    const showUniform = course.options?.uniform_required && !isOnline;
                                    const uniformCost = course.options?.uniform_cost || 0;

                                    // Modalities available for this course
                                    const availableModalities = course.options?.modalities || ['Presencial'];

                                    return (
                                        <div
                                            key={course.id}
                                            onClick={() => {
                                                if (!isSelected) {
                                                    if (formData.selected_courses.length >= 2) return;
                                                    // Initialize with first modality if available, else empty
                                                    const defaultModality = availableModalities.includes('Presencial') ? 'Presencial' : availableModalities[0];

                                                    setFormData(prev => ({
                                                        ...prev,
                                                        selected_courses: [...prev.selected_courses, {
                                                            id: course.id,
                                                            title: course.title,
                                                            price: course.price,
                                                            schedule: '',
                                                            modality: defaultModality,
                                                            uniform_required: course.options?.uniform_required,
                                                            uniform_cost: uniformCost || 0
                                                        }]
                                                    }));
                                                }
                                                // Allow toggle deselect (optional, kept simple here to match existing ux pattern or enhanced)
                                                // Actually, let's keep the card click as "Select" and provide a distinct close button for "Deselect" to avoid accidental clicks? 
                                                // Or toggle. Toggle is better for UX if it's clear.
                                            }}
                                            className={`
                                                relative overflow-hidden rounded-2xl border-2 transition-all duration-300 flex flex-col
                                                ${isSelected
                                                    ? 'border-primary shadow-lg shadow-primary/10 bg-white dark:bg-gray-800'
                                                    : 'border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-700 hover:bg-white dark:hover:bg-gray-800'
                                                }
                                                ${(!isSelected && formData.selected_courses.length >= 2) ? 'opacity-40 grayscale pointer-events-none' : 'cursor-pointer'}
                                            `}
                                        >

                                            {/* Header Section */}
                                            <div className="p-5 flex items-start gap-4">
                                                <div className={`
                                                    p-3 rounded-xl shrink-0 transition-colors duration-300
                                                    ${isSelected ? 'bg-primary text-white' : 'bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 shadow-sm'}
                                                `}>
                                                    <Icon size={24} strokeWidth={isSelected ? 2 : 1.5} />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start">
                                                        <h3 className={`font-bold text-lg leading-tight truncate pr-2 ${isSelected ? 'text-primary' : 'text-gray-900 dark:text-gray-100'}`}>
                                                            {course.title}
                                                        </h3>
                                                        {isSelected && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setFormData(prev => ({ ...prev, selected_courses: prev.selected_courses.filter(c => c.id !== course.id) }));
                                                                }}
                                                                className="text-gray-400 hover:text-red-500 p-1 hover:bg-red-50 rounded-full transition-colors"
                                                            >
                                                                ✕
                                                            </button>
                                                        )}
                                                    </div>
                                                    <p className="mt-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                                        {formatCurrency(course.price)}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Expanded Controls */}
                                            {isSelected && (
                                                <div className="px-5 pb-5 pt-0 space-y-4 animate-in slide-in-from-top-2 fade-in" onClick={e => e.stopPropagation()}>

                                                    {/* Divider */}
                                                    <div className="h-px w-full bg-gray-100 dark:bg-gray-700 my-2" />

                                                    {/* Modality Selector (Pills) */}
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('modality_label', 'Modalidade')}</Label>
                                                        <div className="flex flex-wrap gap-2">
                                                            {availableModalities.map(m => {
                                                                const isActive = selectedData.modality === m;
                                                                return (
                                                                    <button
                                                                        key={m}
                                                                        type="button"
                                                                        onClick={() => {
                                                                            const updated = formData.selected_courses.map(c => c.id === course.id ? { ...c, modality: m } : c);
                                                                            setFormData(prev => ({ ...prev, selected_courses: updated }));
                                                                        }}
                                                                        className={`
                                                                            px-3 py-1.5 text-xs font-medium rounded-lg border transition-all
                                                                            ${isActive
                                                                                ? 'bg-primary text-white border-primary shadow-sm'
                                                                                : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-primary/50'
                                                                            }
                                                                        `}
                                                                    >
                                                                        {m}
                                                                    </button>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>

                                                    {/* Shift Selector */}
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('shift_label', 'Turno / Horário')}</Label>
                                                        <Select
                                                            value={selectedData.schedule}
                                                            onValueChange={(val) => {
                                                                const updated = formData.selected_courses.map(c => c.id === course.id ? { ...c, schedule: val } : c);
                                                                setFormData(prev => ({ ...prev, selected_courses: updated }));
                                                            }}
                                                        >
                                                            <SelectTrigger className="w-full bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-sm h-10">
                                                                <SelectValue placeholder={t('select_schedule_placeholder', 'Selecione o Horário')} />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {course.schedules?.map((s, idx) => (
                                                                    <SelectItem key={idx} value={s}>{s}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    {/* Uniform Box */}
                                                    <div className={`rounded-xl p-3 flex items-center gap-3 text-sm transition-colors
                                                        ${showUniform
                                                            ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-100 border border-amber-100 dark:border-amber-900/50'
                                                            : 'bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-100 border border-green-100 dark:border-green-900/50'
                                                        }
                                                    `}>
                                                        <div className={`p-2 rounded-full ${showUniform ? 'bg-amber-100 dark:bg-amber-900/50' : 'bg-green-100 dark:bg-green-900/50'}`}>
                                                            {showUniform ? <Shirt size={16} /> : <Zap size={16} />}
                                                        </div>
                                                        <div className="flex-1">
                                                            {showUniform ? (
                                                                <div className="flex justify-between items-center">
                                                                    <span className="font-medium">{t('uniform_required', 'Uniforme Obrigatório')}</span>
                                                                    <span className="font-bold">{formatCurrency(uniformCost)}</span>
                                                                </div>
                                                            ) : (
                                                                <span className="font-medium">{t('uniform_exempt', 'Isento de Uniforme (Online)')}</span>
                                                            )}
                                                        </div>
                                                    </div>

                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
                            <p className="text-sm text-gray-500">
                                {t('courses_selected_count', { count: formData.selected_courses.length, max: 2, defaultValue: `${formData.selected_courses.length} de 2 cursos selecionados` })}
                            </p>
                        </div>
                    </div>
                );

            case 3: // ID Card
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="text-center mb-6">
                            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                                <Fingerprint className="text-primary" size={24} />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{t('id_verification', 'Identification')}</h2>
                            <p className="text-sm text-gray-500">{t('step_3_desc', 'Verify your identity')}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="document_type">{t('doc_type_label', 'Doc Type')}</Label>
                                <Select
                                    name="document_type"
                                    value={formData.document_type || undefined}
                                    onValueChange={(val) => handleSelectChange('document_type', val)}
                                >
                                    <SelectTrigger className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="BI">BI / ID Card</SelectItem>
                                        <SelectItem value="Passport">Passaporte</SelectItem>
                                        <SelectItem value="DIRE">DIRE</SelectItem>
                                        <SelectItem value="Voter">Cartão Eleitor</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="document_number">{t('doc_number_label', 'Document Number')}</Label>
                                <Input
                                    id="document_number"
                                    name="document_number"
                                    placeholder="Ex: 1101001001001B"
                                    value={formData.document_number}
                                    onChange={handleChange}
                                    className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                );

            case 4: // Payment
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="text-center mb-6">
                            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                                <CreditCard className="text-primary" size={24} />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{t('payment_info', 'Payment Method')}</h2>
                            <p className="text-sm text-gray-500">{t('step_4_desc', 'Secure your enrollment')}</p>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                                <h3 className="text-sm font-medium mb-2">{t('order_summary', 'Order Summary')}</h3>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">{t('enrollment_fee', 'Enrollment Fee')}</span>
                                    <span className="font-semibold text-primary">2.500,00 MT</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="payment_method">{t('payment_method_label', 'Payment Method')}</Label>
                                <Select
                                    name="payment_method"
                                    value={formData.payment_method || undefined}
                                    onValueChange={(val) => handleSelectChange('payment_method', val)}
                                >
                                    <SelectTrigger className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                                        <SelectValue placeholder={t('select_payment', 'Select Method')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="mpesa">M-Pesa</SelectItem>
                                        <SelectItem value="emola">E-Mola</SelectItem>
                                        <SelectItem value="bank_transfer">Transferência Bancária</SelectItem>
                                        <SelectItem value="pos">POS (Presencial)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                );

            case 5: // Account
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="text-center mb-6">
                            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                                <Lock className="text-primary" size={24} />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{t('account_setup', 'Account Setup')}</h2>
                            <p className="text-sm text-gray-500">{t('step_5_desc', 'Create your credentials')}</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">{t('email_label', 'Email Address')}</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="student@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">{t('password_label', 'Password')}</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm_password">{t('confirm_password_label', 'Confirm Password')}</Label>
                                <Input
                                    id="confirm_password"
                                    name="password_confirmation"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password_confirmation}
                                    onChange={handleChange}
                                    className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950 px-4 py-24 relative">
            {/* Header Controls */}
            <div className="absolute top-6 left-6 z-50">
                <Link to="/" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors font-medium group">
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span>{t('back_home', 'Back to Home')}</span>
                </Link>
            </div>

            <div className="absolute top-4 right-4 flex gap-2 z-50">
                <LanguageToggle />
                <ThemeToggle />
            </div>

            {/* Main Card */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-2xl border border-gray-100 dark:border-gray-700 relative z-10">

                {/* Wizard Progress Stepper */}
                <div className="mb-10">
                    <div className="flex items-center justify-between relative">
                        {/* Connecting Line Background */}
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-gray-700 -z-0 rounded-full" />

                        {/* Active Progress Line */}
                        <div
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-primary transition-all duration-500 ease-in-out -z-0 rounded-full"
                            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                        />

                        {[
                            { step: 1, icon: User, label: t('personal_short', 'Info') },
                            { step: 2, icon: BookOpen, label: t('courses_short', 'Courses') },
                            { step: 3, icon: Fingerprint, label: t('id_short', 'ID') },
                            { step: 4, icon: CreditCard, label: t('payment_short', 'Pay') },
                            { step: 5, icon: Lock, label: t('account_short', 'Account') }
                        ].map((s, idx) => {
                            const isCompleted = currentStep > s.step;
                            const isActive = currentStep === s.step;
                            const Icon = s.icon;

                            return (
                                <div key={s.step} className="relative z-10 flex flex-col items-center group">
                                    <div
                                        className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isActive
                                            ? 'bg-primary border-primary text-white scale-110 shadow-lg shadow-primary/30'
                                            : isCompleted
                                                ? 'bg-primary border-primary text-white'
                                                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500'
                                            }`}
                                    >
                                        <Icon size={isActive ? 20 : 18} />
                                    </div>

                                    {/* Label */}
                                    <span className={`absolute -bottom-6 md:-bottom-8 text-[10px] md:text-sm font-medium whitespace-nowrap transition-colors duration-300 ${isActive
                                        ? 'text-primary'
                                        : isCompleted
                                            ? 'text-gray-700 dark:text-gray-300'
                                            : 'text-gray-400'
                                        }`}>
                                        {s.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-6 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="min-h-[300px]">
                        {renderStep()}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={prevStep}
                            disabled={currentStep === 1 || isLoading}
                            className={`flex items-center px-6 ${currentStep === 1 ? 'opacity-0 pointer-events-none' : ''}`}
                        >
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            {t('back', 'Back')}
                        </Button>

                        {currentStep < totalSteps ? (
                            <Button
                                type="button"
                                onClick={nextStep}
                                className="flex items-center px-6 bg-primary hover:bg-blue-700 text-white"
                            >
                                {t('next', 'Next')}
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                className="flex items-center px-6 bg-green-600 hover:bg-green-700 text-white"
                                disabled={isLoading}
                            >
                                {isLoading ? t('creating_account', 'Creating...') : t('finish_register', 'Create Account')}
                                {!isLoading && <UserPlus className="ml-2 h-4 w-4" />}
                            </Button>
                        )}
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        {t('have_account', "Already have an account?")}{' '}
                        <Link to="/login" className="text-primary font-bold hover:underline">
                            {t('login_link', 'Log in')}
                        </Link>
                    </p>
                </div>
            </div>

            {/* Footer */}
            <footer className="absolute bottom-4 w-full text-center text-[10px] text-gray-400 dark:text-gray-600 opacity-60">
                <p>
                    &copy; 2025-{currentYear} Zedeck's Training | {t('rights_reserved', 'Todos os direitos reservados')} | v{version}
                </p>
            </footer>
        </div>
    );
}
