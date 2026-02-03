import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, ArrowLeft, ChevronRight, ChevronLeft, CreditCard, BookOpen, User, Fingerprint, Lock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox'; // Ensure Checkbox is imported if available, or use input type='checkbox'
import LanguageToggle from '../components/LanguageToggle';
import ThemeToggle from '../components/ThemeToggle';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { usePageTitle } from '../hooks/usePageTitle';

// --- Constants ---
const COUNTRIES = [
    { code: 'MZ', name: 'Moçambique', flag: '🇲🇿' },
    { code: 'AO', name: 'Angola', flag: '🇦🇴' },
    { code: 'BR', name: 'Brasil', flag: '🇧🇷' },
    { code: 'CV', name: 'Cabo Verde', flag: '🇨🇻' },
    { code: 'GW', name: 'Guiné-Bissau', flag: '🇬🇼' },
    { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
    { code: 'ST', name: 'São Tomé e Príncipe', flag: '🇸🇹' },
    { code: 'ZA', name: 'África do Sul', flag: '🇿🇦' },
    { code: 'US', name: 'Estados Unidos', flag: '🇺🇸' },
    { code: 'CN', name: 'China', flag: '🇨🇳' },
    { code: 'IN', name: 'Índia', flag: '🇮🇳' },
    { code: 'FR', name: 'França', flag: '🇫🇷' },
    { code: 'DE', name: 'Alemanha', flag: '🇩🇪' },
];

const PHONE_CODES = [
    { code: '+258', country: 'MZ', flag: '🇲🇿' },
    { code: '+244', country: 'AO', flag: '🇦🇴' },
    { code: '+55', country: 'BR', flag: '🇧🇷' },
    { code: '+238', country: 'CV', flag: '🇨🇻' },
    { code: '+245', country: 'GW', flag: '🇬🇼' },
    { code: '+351', country: 'PT', flag: '🇵🇹' },
    { code: '+239', country: 'ST', flag: '🇸🇹' },
    { code: '+27', country: 'ZA', flag: '🇿🇦' },
    { code: '+1', country: 'US', flag: '🇺🇸' },
];

const MOZ_PROVINCES = [
    "Maputo Cidade", "Maputo Província", "Gaza", "Inhambane", "Sofala", "Manica", "Tete", "Zambézia", "Nampula", "Cabo Delgado", "Niassa"
];

// --- Helpers ---
const toTitleCase = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\w/g, function (match) {
        return match.toUpperCase();
    });
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

    const [formData, setFormData] = useState({
        // Phase 1: Personal (Extended)
        first_name: '',
        last_name: '',
        father_name: '',
        mother_name: '',
        birth_date: '',
        birth_place_type: 'Other', // 'MZ', 'BR', 'US', 'Other'
        birth_place: '', // State or Custom Text
        gender: '',
        nationality: 'Moçambique',
        phone_code: '+258',
        phone_number: '',
        civil_status: '',
        occupation: '',
        education_level: '',
        has_special_needs: false,
        special_needs_description: '',

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

        if (age < 12) {
            setError(t('age_restriction_error', 'Must be at least 12 years old'));
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

                        {/* Parents (Optional/Standard) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="father_name">{t('father_name_label', 'Father Name')}</Label>
                                <Input
                                    id="father_name"
                                    name="father_name"
                                    value={formData.father_name}
                                    onChange={handleNameChange}
                                    className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="mother_name">{t('mother_name_label', 'Mother Name')}</Label>
                                <Input
                                    id="mother_name"
                                    name="mother_name"
                                    value={formData.mother_name}
                                    onChange={handleNameChange}
                                    className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                                />
                            </div>
                        </div>

                        {/* Date, Gender, Phone */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="birth_date">{t('birth_date_label', 'Date of Birth')} <span className="text-red-500">*</span></Label>
                                <Input
                                    id="birth_date"
                                    name="birth_date"
                                    type="date"
                                    value={formData.birth_date}
                                    onChange={handleDateChange} // Validates >12
                                    className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="gender">{t('gender_label', 'Gender')} <span className="text-red-500">*</span></Label>
                                <Select
                                    name="gender"
                                    value={formData.gender || undefined}
                                    onValueChange={(val) => handleSelectChange('gender', val)}
                                    required
                                >
                                    <SelectTrigger className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                                        <SelectValue placeholder={t('select_gender', 'Select')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="M">{t('gender_male', 'Male')}</SelectItem>
                                        <SelectItem value="F">{t('gender_female', 'Female')}</SelectItem>
                                        <SelectItem value="O">{t('gender_other', 'Other')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">{t('phone_label', 'Phone')} <span className="text-red-500">*</span></Label>
                                <div className="flex gap-2">
                                    <Select
                                        value={formData.phone_code}
                                        onValueChange={(val) => handleSelectChange('phone_code', val)}
                                    >
                                        <SelectTrigger className="w-[100px] bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {PHONE_CODES.map(c => (
                                                <SelectItem key={c.country} value={c.code}>
                                                    <span className="mr-2">{c.flag}</span> {c.code}
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

                        {/* Nationality & Birth Place */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="nationality">{t('nationality_label', 'Nationality')}</Label>
                                <Select
                                    name="nationality"
                                    value={formData.nationality}
                                    onValueChange={(val) => {
                                        // Auto-set birth place type if needed
                                        const type = val === 'Moçambique' ? 'MZ' : val === 'Brasil' ? 'BR' : val === 'Estados Unidos' ? 'US' : 'Other';
                                        setFormData(prev => ({ ...prev, nationality: val, birth_place_type: type, birth_place: '' }));
                                    }}
                                >
                                    <SelectTrigger className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {COUNTRIES.map(c => (
                                            <SelectItem key={c.code} value={c.name}>
                                                <span className="mr-2">{c.flag}</span> {c.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="birth_place">{t('birth_place_label', 'Place of Birth')}</Label>
                                {formData.birth_place_type === 'MZ' ? (
                                    <Select
                                        value={formData.birth_place}
                                        onValueChange={(val) => handleSelectChange('birth_place', val)}
                                    >
                                        <SelectTrigger className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                                            <SelectValue placeholder="Selecione Província" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {MOZ_PROVINCES.map(p => (
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
                                        placeholder={formData.nationality === 'Moçambique' ? 'Província' : 'Cidade/Estado'}
                                        className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Civil Status & Document */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
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

                            {/* Document Type + Number (Grid inside) */}
                            <div className="space-y-2">
                                <Label htmlFor="document_type">{t('doc_type_label', 'Doc Type')}</Label>
                                <div className={`grid ${formData.document_type === 'Other' ? 'grid-cols-2' : 'grid-cols-1'} gap-2`}>
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
                                                className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 col-span-2"
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
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="text-center mb-6">
                            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                                <BookOpen className="text-primary" size={24} />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{t('courses_selection', 'Course Selection')}</h2>
                            <p className="text-sm text-gray-500">{t('step_2_desc', 'Choose your learning path')}</p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="course">{t('course_label', 'Select Course')}</Label>
                                <Select
                                    name="course"
                                    value={formData.course || undefined}
                                    onValueChange={(val) => handleSelectChange('course', val)}
                                >
                                    <SelectTrigger className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                                        <SelectValue placeholder={t('select_course', 'Select a Course')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="web_design">Web Design & Development</SelectItem>
                                        <SelectItem value="accounting">Contabilidade e Gestão</SelectItem>
                                        <SelectItem value="english">Inglês Profissional</SelectItem>
                                        <SelectItem value="informatics">Informática Avançada</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="modality">{t('modality_label', 'Modality')}</Label>
                                    <Select
                                        name="modality"
                                        value={formData.modality || undefined}
                                        onValueChange={(val) => handleSelectChange('modality', val)}
                                    >
                                        <SelectTrigger className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                                            <SelectValue placeholder={t('select_modality', 'Select Mode')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="presencial">Presencial</SelectItem>
                                            <SelectItem value="online">Online</SelectItem>
                                            <SelectItem value="hybrid">Híbrido</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="shift">{t('shift_label', 'Shift')}</Label>
                                    <Select
                                        name="shift"
                                        value={formData.shift || undefined}
                                        onValueChange={(val) => handleSelectChange('shift', val)}
                                    >
                                        <SelectTrigger className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                                            <SelectValue placeholder={t('select_shift', 'Select Shift')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="morning">Manhã (08:00 - 12:00)</SelectItem>
                                            <SelectItem value="afternoon">Tarde (13:00 - 17:00)</SelectItem>
                                            <SelectItem value="evening">Noite (18:00 - 21:00)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
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
