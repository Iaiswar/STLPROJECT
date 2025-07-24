// STL CODE


import React from 'react'
import { useState } from 'react';
import { User, Building, GraduationCap, FileText, Calendar, Upload, MessageSquare, Users, Save, RefreshCw } from 'lucide-react';

interface IntakeFormData {
    date: string;
    contractor: string;
    category: 'Casual' | 'NAPS' | '';
    candidateName: string;
    education: string;
    bioData: File | null;
    department: string;
    remark: string;
    handoverByAdminName: string;
    handoverToDojoName: string;
}

interface Department {
    id: number;
    name: string;
}

const ManpowerIntakeForm: React.FC = () => {
    const [formData, setFormData] = useState<IntakeFormData>({
        date: new Date().toISOString().split('T')[0],
        contractor: '',
        category: '',
        candidateName: '',
        education: '',
        bioData: null,
        department: '',
        remark: '',
        handoverByAdminName: '',
        handoverToDojoName: ''
    });

    const [departments, setDepartments] = useState<Department[]>([]);
    const [errors, setErrors] = useState<Partial<IntakeFormData>>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error' | 'submitting'>('idle');
    const [submitError, setSubmitError] = useState<string | null>(null);

    // Fetch departments on component mount
    React.useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/stl-departments/');
                const data = await response.json();
                setDepartments(data);
            } catch (error) {
                console.error('Failed to fetch departments:', error);
            }
        };
        fetchDepartments();
    }, []);

    const handleInputChange = (field: keyof IntakeFormData, value: string) => {
        setFormData(prev => ({
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

    const handleFileChange = (file: File | null) => {
        setFormData(prev => ({
            ...prev,
            bioData: file
        }));
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<IntakeFormData> = {};

        if (!formData.date) {
            newErrors.date = 'Date is required';
        }

        if (!formData.contractor.trim()) {
            newErrors.contractor = 'Contractor name is required';
        }

        if (!formData.category) {
            newErrors.category = 'Category is required';
        }

        if (!formData.candidateName.trim()) {
            newErrors.candidateName = 'Candidate name is required';
        }

        if (!formData.education.trim()) {
            newErrors.education = 'Education is required';
        }

        if (!formData.department) {
            newErrors.department = 'Department is required';
        }

        if (!formData.handoverByAdminName.trim()) {
            newErrors.handoverByAdminName = 'Admin name is required';
        }

        if (!formData.handoverToDojoName.trim()) {
            newErrors.handoverToDojoName = 'DOJO person name is required';
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
            const formDataToSend = new FormData();
            
            // Sheet metadata
            formDataToSend.append('ref_no', 'HRM-F-26');
            formDataToSend.append('rev_no', '00');
            formDataToSend.append('rev_date', formData.date);
            
            // Entry data as JSON string
            const entryData = {
                sr_no: 1, // Will be handled by backend
                contractor_name: formData.contractor,
                category: formData.category,
                candidate_name: formData.candidateName,
                education: formData.education,
                department: parseInt(formData.department),
                remark: formData.remark
            };
            formDataToSend.append('entries_data', JSON.stringify([entryData]));
            
            // Handover data as JSON string
            const handoverData = {
                admin_name: formData.handoverByAdminName,
                dojo_person_name: formData.handoverToDojoName
            };
            formDataToSend.append('handover_data', JSON.stringify(handoverData));
            
            // Revision logs data as JSON string
            const revisionData = [{
                sno: 1,
                rev_no: '00',
                rev_date: formData.date,
                rev_history: 'New Document updated',
                reason_for_change: 'Initial entry'
            }];
            formDataToSend.append('revision_logs_data', JSON.stringify(revisionData));
            
            // Bio-data file
            if (formData.bioData) {
                formDataToSend.append('bio_data_0', formData.bioData);
            }

            const response = await fetch('http://127.0.0.1:8000/intake-sheets/', {
                method: 'POST',
                body: formDataToSend,
            });

            if (!response.ok) {
                const errorData = await response.json();
                const message = errorData.detail || errorData.message || 'Failed to save intake data';
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
        setFormData({
            date: new Date().toISOString().split('T')[0],
            contractor: '',
            category: '',
            candidateName: '',
            education: '',
            bioData: null,
            department: '',
            remark: '',
            handoverByAdminName: '',
            handoverToDojoName: ''
        });
        setErrors({});
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4 flex justify-center">
            <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Header */}
                <div className="bg-blue-600 text-white p-6">
                    <h1 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
                        <Users className="w-6 h-6" />
                        DOJO Manpower Intake Form
                    </h1>
                    <p className="text-blue-100 text-center mt-2">HRM-F-26 | Add New Candidate</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Date */}
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                                <Calendar className="w-4 h-4 inline mr-2" />
                                Date *
                            </label>
                            <input
                                type="date"
                                id="date"
                                value={formData.date}
                                onChange={(e) => handleInputChange('date', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.date ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                        </div>

                        {/* Contractor */}
                        <div>
                            <label htmlFor="contractor" className="block text-sm font-medium text-gray-700 mb-2">
                                <Building className="w-4 h-4 inline mr-2" />
                                Contractor *
                            </label>
                            <input
                                type="text"
                                id="contractor"
                                value={formData.contractor}
                                onChange={(e) => handleInputChange('contractor', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.contractor ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter contractor name"
                            />
                            {errors.contractor && <p className="text-red-500 text-sm mt-1">{errors.contractor}</p>}
                        </div>

                        {/* Category */}
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                <FileText className="w-4 h-4 inline mr-2" />
                                Category *
                            </label>
                            <select
                                id="category"
                                value={formData.category}
                                onChange={(e) => handleInputChange('category', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
                            >
                                <option value="">Select Category</option>
                                <option value="Casual">Casual</option>
                                <option value="NAPS">NAPS</option>
                            </select>
                            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                        </div>

                        {/* Candidate Name */}
                        <div>
                            <label htmlFor="candidateName" className="block text-sm font-medium text-gray-700 mb-2">
                                <User className="w-4 h-4 inline mr-2" />
                                Candidate Name *
                            </label>
                            <input
                                type="text"
                                id="candidateName"
                                value={formData.candidateName}
                                onChange={(e) => handleInputChange('candidateName', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.candidateName ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter candidate full name"
                            />
                            {errors.candidateName && <p className="text-red-500 text-sm mt-1">{errors.candidateName}</p>}
                        </div>

                        {/* Education */}
                        <div>
                            <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-2">
                                <GraduationCap className="w-4 h-4 inline mr-2" />
                                Education *
                            </label>
                            <input
                                type="text"
                                id="education"
                                value={formData.education}
                                onChange={(e) => handleInputChange('education', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.education ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter education qualification"
                            />
                            {errors.education && <p className="text-red-500 text-sm mt-1">{errors.education}</p>}
                        </div>

                        {/* Department */}
                        <div>
                            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                                <Building className="w-4 h-4 inline mr-2" />
                                Department *
                            </label>
                            <select
                                id="department"
                                value={formData.department}
                                onChange={(e) => handleInputChange('department', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.department ? 'border-red-500' : 'border-gray-300'}`}
                            >
                                <option value="">Select Department</option>
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                                ))}
                            </select>
                            {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
                        </div>

                        {/* Bio-Data Upload */}
                        <div className="md:col-span-2">
                            <label htmlFor="bioData" className="block text-sm font-medium text-gray-700 mb-2">
                                <Upload className="w-4 h-4 inline mr-2" />
                                Bio-Data (Optional)
                            </label>
                            <input
                                type="file"
                                id="bioData"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {formData.bioData && (
                                <p className="text-green-600 text-sm mt-1">✓ {formData.bioData.name}</p>
                            )}
                        </div>

                        {/* Remark */}
                        <div className="md:col-span-2">
                            <label htmlFor="remark" className="block text-sm font-medium text-gray-700 mb-2">
                                <MessageSquare className="w-4 h-4 inline mr-2" />
                                Remark
                            </label>
                            <textarea
                                id="remark"
                                value={formData.remark}
                                onChange={(e) => handleInputChange('remark', e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter any remarks or comments"
                            />
                        </div>

                        {/* Handover Information */}
                        <div className="md:col-span-2">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Handover Information</h3>
                        </div>

                        {/* Admin Name */}
                        <div>
                            <label htmlFor="handoverByAdminName" className="block text-sm font-medium text-gray-700 mb-2">
                                <User className="w-4 h-4 inline mr-2" />
                                Handover By (Admin) *
                            </label>
                            <input
                                type="text"
                                id="handoverByAdminName"
                                value={formData.handoverByAdminName}
                                onChange={(e) => handleInputChange('handoverByAdminName', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.handoverByAdminName ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Admin person name"
                            />
                            {errors.handoverByAdminName && <p className="text-red-500 text-sm mt-1">{errors.handoverByAdminName}</p>}
                        </div>

                        {/* DOJO Person Name */}
                        <div>
                            <label htmlFor="handoverToDojoName" className="block text-sm font-medium text-gray-700 mb-2">
                                <User className="w-4 h-4 inline mr-2" />
                                Handover To (DOJO) *
                            </label>
                            <input
                                type="text"
                                id="handoverToDojoName"
                                value={formData.handoverToDojoName}
                                onChange={(e) => handleInputChange('handoverToDojoName', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.handoverToDojoName ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="DOJO person name"
                            />
                            {errors.handoverToDojoName && <p className="text-red-500 text-sm mt-1">{errors.handoverToDojoName}</p>}
                        </div>
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
                                    Save Intake
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

                {/* Status Messages */}
                {formStatus === 'success' && (
                    <div className="px-6 pb-6">
                        <div className="p-3 rounded-md text-sm bg-green-100 text-green-800">
                            ✓ Intake form submitted successfully! You can add another candidate or view all records.
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

export default ManpowerIntakeForm;











// import React from 'react'
// import { useState } from 'react';
// import { User, CreditCard, Mail, Phone, Save, RefreshCw, User as UserIcon, VenusAndMars  } from 'lucide-react';

// interface UserInfo {
//     firstName: string;
//     lastName: string;
//     email: string;
//     phoneNumber: string;
//     sex: string;
// }

// const UserInfoEntry: React.FC = () => {
//     const [userInfo, setUserInfo] = useState<UserInfo>({
//         firstName: '',
//         lastName: '',
//         email: '',
//         phoneNumber: '',
//         sex: 'M'
//     });

//     const [errors, setErrors] = useState<Partial<UserInfo>>({});
//     const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
//     const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error' | 'submitting'>('idle');
//     const [submitError, setSubmitError] = useState<string | null>(null);

//     const handleInputChange = (field: keyof UserInfo, value: string) => {
//         setUserInfo(prev => ({
//             ...prev,
//             [field]: value
//         }));

//         if (errors[field]) {
//             setErrors(prev => ({
//                 ...prev,
//                 [field]: ''
//             }));
//         }
//     };

//     const validateForm = (): boolean => {
//         const newErrors: Partial<UserInfo> = {};

//         if (!userInfo.firstName.trim()) {
//             newErrors.firstName = 'First name is required';
//         }

//         if (!userInfo.lastName.trim()) {
//             newErrors.lastName = 'Last name is required';
//         }

//         if (userInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email)) {
//             newErrors.email = 'Please enter a valid email address';
//         }

//         if (!userInfo.phoneNumber.trim()) {
//             newErrors.phoneNumber = 'Phone number is required';
//         } else if (!/^\+?[\d\s-()]{10,15}$/.test(userInfo.phoneNumber)) {
//             newErrors.phoneNumber = 'Please enter a valid phone number';
//         }

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();

//         if (!validateForm()) return;

//         setFormStatus('submitting');
//         setIsSubmitting(true);
//         setSubmitError(null);

//         try {
//             const response = await fetch('http://127.0.0.1:8000/temp-user-info/', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     firstName: userInfo.firstName,
//                     lastName: userInfo.lastName,
//                     email: userInfo.email || null,
//                     phoneNumber: userInfo.phoneNumber,
//                     sex: userInfo.sex
//                 }),
//             });

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 const message =
//                     errorData.detail ||
//                     errorData.message ||
//                     Object.values(errorData).join('\n') ||
//                     'Failed to save user info';
//                 setFormStatus('error');
//                 setSubmitError(message);
//                 return;
//             }

//             setFormStatus('success');
//             handleReset();
//         } catch (error: unknown) {
//             setFormStatus('error');
//             setSubmitError(error instanceof Error ? error.message : 'An unknown error occurred.');
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const handleReset = () => {
//         setUserInfo({
//             firstName: '',
//             lastName: '',
//             email: '',
//             phoneNumber: '',
//             sex: 'M'
//         });
//         setErrors({});
//     };

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4 flex justify-center">
//             <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
//                 {/* Header */}
//                 <div className="bg-blue-600 text-white p-6">
//                     <h1 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
//                         <UserIcon className="w-6 h-6" />
//                         User Information
//                     </h1>
//                     <p className="text-blue-100 text-center mt-2">Please fill in your details</p>
//                 </div>

//                 {/* Form */}
//                 <form onSubmit={handleSubmit} className="p-6">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         {/* First Name */}
//                         <div>
//                             <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
//                                 <User className="w-4 h-4 inline mr-2" />
//                                 First Name
//                             </label>
//                             <input
//                                 type="text"
//                                 id="firstName"
//                                 value={userInfo.firstName}
//                                 onChange={(e) => handleInputChange('firstName', e.target.value)}
//                                 className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
//                                 placeholder="Enter your first name"
//                             />
//                             {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
//                         </div>

//                         {/* Last Name */}
//                         <div>
//                             <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
//                                 <User className="w-4 h-4 inline mr-2" />
//                                 Last Name
//                             </label>
//                             <input
//                                 type="text"
//                                 id="lastName"
//                                 value={userInfo.lastName}
//                                 onChange={(e) => handleInputChange('lastName', e.target.value)}
//                                 className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
//                                 placeholder="Enter your last name"
//                             />
//                             {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
//                         </div>

//                         {/* Email */}
//                         <div>
//                             <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//                                 <Mail className="w-4 h-4 inline mr-2" />
//                                 Email (Optional)
//                             </label>
//                             <input
//                                 type="email"
//                                 id="email"
//                                 value={userInfo.email}
//                                 onChange={(e) => handleInputChange('email', e.target.value)}
//                                 className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
//                                 placeholder="Enter your email address"
//                             />
//                             {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
//                         </div>

//                         {/* Phone Number */}
//                         <div>
//                             <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
//                                 <Phone className="w-4 h-4 inline mr-2" />
//                                 Phone Number
//                             </label>
//                             <input
//                                 type="tel"
//                                 id="phoneNumber"
//                                 value={userInfo.phoneNumber}
//                                 onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
//                                 className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
//                                 placeholder="Enter your phone number"
//                             />
//                             {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
//                         </div>

//                         {/* Sex */}
//                         <div>
//                             <label htmlFor="sex" className="block text-sm font-medium text-gray-700 mb-2">
//                                 <VenusAndMars  className="w-4 h-4 inline mr-2" />
//                                 Sex
//                             </label>
//                             <select
//                                 id="sex"
//                                 value={userInfo.sex}
//                                 onChange={(e) => handleInputChange('sex', e.target.value)}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             >
//                                 <option value="M">Male</option>
//                                 <option value="F">Female</option>
//                                 <option value="O">Other</option>
//                             </select>
//                         </div>

//                         {/* Temp ID (readonly, will be generated by backend) */}
//                         {/* <div>
//                             <label htmlFor="tempId" className="block text-sm font-medium text-gray-700 mb-2">
//                                 <CreditCard className="w-4 h-4 inline mr-2" />
//                                 Temp ID
//                             </label>
//                             <input
//                                 type="text"
//                                 id="tempId"
//                                 readOnly
//                                 value="Will be auto-generated"
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
//                             />
//                         </div> */}
//                     </div>

//                     {/* Buttons */}
//                     <div className="flex gap-4 pt-6">
//                         <button
//                             type="submit"
//                             disabled={isSubmitting}
//                             className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-white font-medium transition-colors ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
//                         >
//                             {isSubmitting ? (
//                                 <>
//                                     <RefreshCw className="w-4 h-4 animate-spin" />
//                                     Saving...
//                                 </>
//                             ) : (
//                                 <>
//                                     <Save className="w-4 h-4" />
//                                     Save
//                                 </>
//                             )}
//                         </button>

//                         <button
//                             type="button"
//                             onClick={handleReset}
//                             disabled={isSubmitting}
//                             className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
//                         >
//                             Reset
//                         </button>
//                     </div>
//                 </form>

//                 {/* Status Message */}
//                 {formStatus === 'success' && (
//                     <div className="px-6 pb-6">
//                         <div className="p-3 rounded-md text-sm bg-green-100 text-green-800">
//                             ✓ Form submitted successfully!
//                         </div>
//                     </div>
//                 )}

//                 {formStatus === 'error' && (
//                     <div className="px-6 pb-6">
//                         <div className="p-3 rounded-md text-sm bg-red-100 text-red-800">
//                             ⚠ Failed to submit form: {submitError}
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default UserInfoEntry;