import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { UserPlus, ArrowLeft, ChevronRight, ChevronLeft, CreditCard, BookOpen, User, Fingerprint, Lock, Code, Globe, Calculator, Palette, Zap, Shirt, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox'; // Ensure Checkbox is imported if available, or use input type='checkbox'
import { formatCurrency } from '../utils/formatters';
import LanguageToggle from '../components/LanguageToggle'; import ThemeToggle from '../components/ThemeToggle';
import AcademicCard from '../components/AcademicCard';
import PaymentSummary from '../components/PaymentSummary';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { usePageTitle } from '../hooks/usePageTitle';

import { MOZ_PROVINCES, COUNTRIES, BR_STATES, US_STATES } from '../components/constants';


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

    // Password Visibility State
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Phase 3: Student ID State
    const [studentIdData, setStudentIdData] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isGeneratingId, setIsGeneratingId] = useState(false);

    useEffect(() => {
        if (currentStep === 3 && !studentIdData) {
            const generateId = async () => {
                setIsGeneratingId(true);
                try {
                    const response = await api.post('/student-id/generate', {
                        document_number: formData.document_number,
                        first_name: formData.first_name,
                        last_name: formData.last_name
                    });
                    if (response.data.success || response.data.student_id) {
                        setStudentIdData(response.data.student_id);
                        // Store the generated ID in main formData for final submission
                        setFormData(prev => ({ ...prev, student_code: response.data.student_id.student_code }));
                    }
                } catch (err) {
                    console.error("ID Generation Error", err);
                    setError(t('id_generation_error', 'Erro ao gerar ID. Verifique seus dados.'));
                } finally {
                    setIsGeneratingId(false);
                }
            };

            // Only generate if we have minimum required data
            if (formData.document_number && formData.first_name) {
                generateId();
            }
        }
    }, [currentStep, formData.document_number, formData.first_name, formData.last_name, studentIdData, t]);

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

    // --- Validation Logic ---
    const validateStep1 = () => {
        const required = ['first_name', 'last_name', 'birth_date', 'gender', 'nationality', 'document_number', 'phone_number'];
        const missing = required.filter(field => !formData[field]);

        if (missing.length > 0) {
            setError(t('fill_required_fields', 'Preencha todos os campos obrigatórios'));
            toast.error(t('missing_fields_error', 'Faltam campos obrigatórios'));
            console.log("Missing:", missing);
            return false;
        }

        // Age check again just in case
        const birthDate = new Date(formData.birth_date);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        if (age < 14) {
            setError(t('age_restriction_error', 'Idade mínima é 14 anos'));
            return false;
        }
        return true;
    };

    const validateStep2 = () => {
        if (formData.selected_courses.length === 0) {
            setError(t('select_at_least_one_course', 'Selecione pelo menos 1 curso'));
            return false;
        }
        // Check Modality and Schedule for each course
        for (const course of formData.selected_courses) {
            if (!course.modality) {
                setError(t('missing_modality', `Selecione a modalidade para: ${course.title}`));
                return false;
            }
            if (!course.schedule) {
                setError(t('missing_schedule', `Selecione o horário para: ${course.title}`));
                return false;
            }
        }
        return true;
    };

    const validateStep4 = () => {
        if (!formData.payment) {
            setError(t('payment_required', 'Selecione e confirme um método de pagamento'));
            return false;
        }
        return true;
    };

    const nextStep = (e) => {
        e.preventDefault();
        setError('');

        let isValid = true;

        if (currentStep === 1) isValid = validateStep1();
        else if (currentStep === 2) isValid = validateStep2();
        else if (currentStep === 4) isValid = validateStep4();

        if (isValid && currentStep < totalSteps) {
            setCurrentStep(curr => curr + 1);
        }
    };

    const prevStep = () => {
        setError('');
        if (currentStep > 1) {
            setCurrentStep(curr => curr - 1);
        }
    };

    // Password Strength Logic
    const getPasswordStrength = (pass) => {
        let score = 0;
        if (!pass) return 0;
        if (pass.length >= 6) score += 25;
        if (pass.length >= 10) score += 10;
        if (/[A-Z]/.test(pass)) score += 15;
        if (/[0-9]/.test(pass)) score += 20;
        if (/[^A-Za-z0-9]/.test(pass)) score += 30; // Symbol
        return Math.min(100, score);
    };

    const passwordStrength = getPasswordStrength(formData.password);

    const PasswordStrengthMeter = () => (
        <div className="mt-2 space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
                <span>{t('password_strength', 'Força da Senha')}</span>
                <span className={`${passwordStrength >= 50 ? 'text-green-600' : 'text-red-500'}`}>
                    {passwordStrength}%
                </span>
            </div>
            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                    className={`h-full transition-all duration-300 ${passwordStrength < 30 ? 'bg-red-500' :
                        passwordStrength < 70 ? 'bg-yellow-500' :
                            'bg-green-500'
                        }`}
                    style={{ width: `${passwordStrength}%` }}
                />
            </div>
            <p className="text-[10px] text-gray-400">
                {t('password_policy', 'Mínimo 6 caracteres, letras, números e símbolos (@!$%^&*)')}
            </p>
        </div>
    );

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.password_confirmation) {
            setError(t('passwords_mismatch', 'As senhas não coincidem'));
            return;
        }

        const pass = formData.password;
        if (pass.length < 6 || pass.length > 12) {
            setError(t('password_length_error', 'A senha deve ter entre 6 e 12 caracteres'));
            return;
        }

        if (passwordStrength < 50) {
            setError(t('password_weak_error', 'A senha é muito fraca. Tente misturar letras, números e símbolos.'));
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const payload = {
                name: `${formData.first_name} ${formData.last_name}`,
                email: formData.email,
                password: formData.password,
                role: 'student',

                // Personal Info
                first_name: formData.first_name,
                last_name: formData.last_name,
                father_name: formData.father_name, // Assuming these are added to formData
                mother_name: formData.mother_name, // Assuming these are added to formData
                birth_date: formData.birth_date,
                gender: formData.gender,
                nationality: formData.nationality,
                document_type: formData.document_type === 'Other' ? 'Other' : formData.document_type, // or handle specifics
                document_number: formData.document_type === 'Other' ? formData.other_doc_number : formData.document_number, // Corrected to document_number

                // Address / Location (Adjusted based on existing formData structure)
                province: formData.birth_place_type === 'MZ' ? formData.birth_place : null, // If MZ, birth_place is province
                city: formData.birth_place_type === 'Other' ? formData.birth_place : null, // If Other, birth_place is city/text

                // Other Profile
                phone: `${formData.phone_code} ${formData.phone_number}`, // Combined phone
                marital_status: formData.civil_status,
                occupation: formData.occupation,
                education_level: formData.education_level,
                has_special_needs: formData.has_special_needs, // Corrected from special_needs === 'Yes'
                special_needs_description: formData.special_needs_description, // Corrected from special_needs_desc

                // Student Code (generated in step 3)
                student_code: studentIdData?.student_code,

                // Courses
                courses: formData.selected_courses.map(c => ({
                    id: c.id,
                    modality: c.modality,
                    schedule: c.schedule // Sending Schedule/Turno
                })),

                // Payment (from Step 4)
                payment: formData.payment
            };

            console.log("Register Payload:", payload);

            const response = await api.post('/auth/register', payload);

            if (response.data.success || response.data.access_token) {
                // Show Success Screen instead of redirecting
                toast.success(t('account_created_login_required', 'Conta criada com sucesso! Por favor, faça login.'));
                setIsSuccess(true);
            }

        } catch (err) {
            console.error("Registration Error:", err);
            // Handle validation errors from backend
            let errorMsg = '';
            if (err.response && err.response.data) {
                if (err.response.data.errors) {
                    errorMsg = Object.values(err.response.data.errors).flat().join(' ');
                } else if (err.response.data.message) {
                    errorMsg = err.response.data.message;
                }
            }

            setError(errorMsg || t('registration_failed', 'Falha no registro. Verifica os dados e tenta novamente.'));
        } finally {
            setIsLoading(false);
        }
    };

    const currentYear = new Date().getFullYear();
    const version = "v1.2.2";

    // Step Rendering Logic
    const renderStep = (stepOverride) => {
        const step = stepOverride || currentStep;
        switch (step) {
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
                                                                        {t(`modality_${m.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`, m)}
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
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col items-center">
                        <div className="text-center mb-2">
                            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                                {isGeneratingId ? (
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                ) : (
                                    <Fingerprint className="text-primary" size={24} />
                                )}
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{t('id_verification', 'Cartão de Inscrição')}</h2>
                            <p className="text-sm text-gray-500">{t('step_3_desc', 'Seu identificador único no sistema')}</p>
                        </div>

                        {studentIdData ? (
                            <AcademicCard
                                studentData={{
                                    name: `${formData.first_name} ${formData.last_name}`,
                                    student_code: studentIdData.student_code,
                                    courses: formData.selected_courses,
                                    valid_until: '15 Dias (Provisório)'
                                }}
                            />
                        ) : (
                            <div className="text-center py-10 text-gray-500">
                                {isGeneratingId ? 'Gerando seu ID Único...' : 'Erro ao gerar ID. Tente novamente.'}
                            </div>
                        )}

                        {/* Hidden buttons handled by wizard navigation, but maybe we want specific actions here */}
                    </div>
                );

            case 4: // Payment
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="text-center mb-6">
                            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                                <CreditCard className="text-primary" size={24} />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{t('payment_info', 'Pagamento & Inscrição')}</h2>
                            <p className="text-sm text-gray-500">{t('step_4_desc', 'Confirme os detalhes e garanta sua vaga')}</p>
                        </div>

                        {studentIdData ? (
                            <PaymentSummary
                                studentData={{
                                    name: `${formData.first_name} ${formData.last_name}`,
                                    student_code: studentIdData.student_code,
                                    doc_number: formData.doc_number || formData.other_doc_number
                                }}
                                courses={formData.selected_courses}
                                onComplete={(paymentResult) => {
                                    // Store payment result in form data (or state) to be sent in final step
                                    setFormData(prev => ({ ...prev, payment: paymentResult }));
                                    nextStep({ preventDefault: () => { } }); // Move to next step automatically
                                    // Actually PaymentSummary has a button "Confirmar Pagamento".
                                    // So we can move next here.
                                }}
                            />
                        ) : (
                            <div className="text-red-500 text-center">
                                Erro: ID do estudante não encontrado. Volte ao passo anterior.
                            </div>
                        )}
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

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="font-medium">{t('email_label', 'Email Address')}</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="student@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 h-11"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2 relative">
                                    <Label htmlFor="password" className="font-medium">{t('password_label', 'Password')}</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 pr-10 h-11"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors focus:outline-none p-1"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2 relative">
                                    <div className="flex justify-between items-center h-6"> {/* Fixed height for label row alignment */}
                                        <Label htmlFor="confirm_password" className="font-medium">{t('confirm_password_label', 'Confirm Password')}</Label>
                                        {formData.password_confirmation && (
                                            <span className={`text-xs flex items-center gap-1 font-medium px-2 py-0.5 rounded-full ${formData.password === formData.password_confirmation ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                                {formData.password === formData.password_confirmation ? <CheckCircle size={10} /> : <XCircle size={10} />}
                                                {formData.password === formData.password_confirmation ? t('password_match', 'Match') : t('password_mismatch_short', 'No Match')}
                                            </span>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <Input
                                            id="confirm_password"
                                            name="password_confirmation"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={formData.password_confirmation}
                                            onChange={handleChange}
                                            className={`bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 pr-10 h-11 ${formData.password_confirmation && formData.password !== formData.password_confirmation ? 'border-red-300 focus-visible:ring-red-500' : ''
                                                }`}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors focus:outline-none p-1"
                                        >
                                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                                <PasswordStrengthMeter />
                            </div>
                        </div>



                    </div>
                );
            case 6: // Success Screen
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center py-8">
                        <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                        </div>

                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {t('registration_success_title', 'Inscrição Concluída!')}
                        </h2>

                        <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto text-lg leading-relaxed">
                            {t('registration_success_desc', 'Sua conta foi criada com sucesso. Agora você pode acessar o portal do estudante.')}
                        </p>

                        <div className="pt-8">
                            <Link to="/login">
                                <Button className="w-full sm:w-auto px-8 py-6 text-lg bg-primary hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-105">
                                    {t('go_to_login', 'Ir para Login')}
                                    <ChevronRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
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
                        ].map((s) => {
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
                        {isSuccess ? renderStep(6) : renderStep()}
                    </div>

                    {/* Navigation Buttons - Hide on Success Screen */}
                    {!isSuccess && (
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
                                // Hide Next button on Payment Step (4) because user must confirm payment via specific button
                                currentStep === 4 ? null : (
                                    <Button
                                        type="button"
                                        onClick={nextStep}
                                        className="flex items-center px-6 bg-primary hover:bg-blue-700 text-white"
                                    >
                                        {t('next', 'Next')}
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                )
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
                    )}
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
