import React from 'react'
import { useState } from 'react';
import { User, CreditCard, Mail, Phone, Save, RefreshCw, User as UserIcon, VenusAndMars  } from 'lucide-react';

interface UserInfo {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    sex: string;
}

const UserInfoEntry: React.FC = () => {
    const [userInfo, setUserInfo] = useState<UserInfo>({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        sex: 'M'
    });

    const [errors, setErrors] = useState<Partial<UserInfo>>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error' | 'submitting'>('idle');
    const [submitError, setSubmitError] = useState<string | null>(null);

    const handleInputChange = (field: keyof UserInfo, value: string) => {
        setUserInfo(prev => ({
            ...prev,
            [field]: value
        }));

        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<UserInfo> = {};

        if (!userInfo.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!userInfo.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        if (userInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!userInfo.phoneNumber.trim()) {
            newErrors.phoneNumber = 'Phone number is required';
        } else if (!/^\+?[\d\s-()]{10,15}$/.test(userInfo.phoneNumber)) {
            newErrors.phoneNumber = 'Please enter a valid phone number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setFormStatus('submitting');
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const response = await fetch('http://127.0.0.1:8000/temp-user-info/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: userInfo.firstName,
                    lastName: userInfo.lastName,
                    email: userInfo.email || null,
                    phoneNumber: userInfo.phoneNumber,
                    sex: userInfo.sex
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                const message =
                    errorData.detail ||
                    errorData.message ||
                    Object.values(errorData).join('\n') ||
                    'Failed to save user info';
                setFormStatus('error');
                setSubmitError(message);
                return;
            }

            setFormStatus('success');
            handleReset();
        } catch (error: unknown) {
            setFormStatus('error');
            setSubmitError(error instanceof Error ? error.message : 'An unknown error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        setUserInfo({
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            sex: 'M'
        });
        setErrors({});
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4 flex justify-center">
            <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Header */}
                <div className="bg-blue-600 text-white p-6">
                    <h1 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
                        <UserIcon className="w-6 h-6" />
                        User Information
                    </h1>
                    <p className="text-blue-100 text-center mt-2">Please fill in your details</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* First Name */}
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                                <User className="w-4 h-4 inline mr-2" />
                                First Name
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                value={userInfo.firstName}
                                onChange={(e) => handleInputChange('firstName', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter your first name"
                            />
                            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                        </div>

                        {/* Last Name */}
                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                                <User className="w-4 h-4 inline mr-2" />
                                Last Name
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                value={userInfo.lastName}
                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter your last name"
                            />
                            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                <Mail className="w-4 h-4 inline mr-2" />
                                Email (Optional)
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={userInfo.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter your email address"
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                                <Phone className="w-4 h-4 inline mr-2" />
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                id="phoneNumber"
                                value={userInfo.phoneNumber}
                                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter your phone number"
                            />
                            {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                        </div>

                        {/* Sex */}
                        <div>
                            <label htmlFor="sex" className="block text-sm font-medium text-gray-700 mb-2">
                                <VenusAndMars  className="w-4 h-4 inline mr-2" />
                                Sex
                            </label>
                            <select
                                id="sex"
                                value={userInfo.sex}
                                onChange={(e) => handleInputChange('sex', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                                <option value="O">Other</option>
                            </select>
                        </div>

                        {/* Temp ID (readonly, will be generated by backend) */}
                        {/* <div>
                            <label htmlFor="tempId" className="block text-sm font-medium text-gray-700 mb-2">
                                <CreditCard className="w-4 h-4 inline mr-2" />
                                Temp ID
                            </label>
                            <input
                                type="text"
                                id="tempId"
                                readOnly
                                value="Will be auto-generated"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
                            />
                        </div> */}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 pt-6">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-white font-medium transition-colors ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                            {isSubmitting ? (
                                <>
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Save
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={handleReset}
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Reset
                        </button>
                    </div>
                </form>

                {/* Status Message */}
                {formStatus === 'success' && (
                    <div className="px-6 pb-6">
                        <div className="p-3 rounded-md text-sm bg-green-100 text-green-800">
                            ✓ Form submitted successfully!
                        </div>
                    </div>
                )}

                {formStatus === 'error' && (
                    <div className="px-6 pb-6">
                        <div className="p-3 rounded-md text-sm bg-red-100 text-red-800">
                            ⚠ Failed to submit form: {submitError}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserInfoEntry;