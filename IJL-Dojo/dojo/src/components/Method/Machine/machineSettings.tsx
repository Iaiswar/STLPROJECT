import React, { useState } from 'react';
import { Save, X, Settings } from 'lucide-react';

const MachineSettings = ({
    editingMachine = null,
    onSave,
    onCancel,
    onViewList
}) => {
    const [formData, setFormData] = useState({
        name: editingMachine?.name || '',
        image: editingMachine?.image || '',
        level: editingMachine?.level || 1,
        process: editingMachine?.process || ''
    });

    // API endpoint
    const API_BASE = 'http://127.0.0.1:8000';

    // Handle form submission
    const handleSubmit = async () => {
        // Basic validation
        if (!formData.name.trim() || !formData.process.trim()) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            const machineData = {
                name: formData.name.trim(),
                image: formData.image.trim(),
                level: formData.level,
                process: formData.process.trim()
            };

            if (editingMachine) {
                // Update existing machine
                console.log(`PUT ${API_BASE}/machines/${editingMachine.id}/`, machineData);
                // In real implementation:
                // const response = await fetch(`${API_BASE}/machines/${editingMachine.id}/`, {
                //   method: 'PUT',
                //   headers: { 'Content-Type': 'application/json' },
                //   body: JSON.stringify(machineData)
                // });
                // const updatedMachine = await response.json();

                onSave({ ...editingMachine, ...machineData }, true);
            } else {
                // Create new machine
                console.log(`POST ${API_BASE}/machines/`, machineData);
                // In real implementation:
                // const response = await fetch(`${API_BASE}/machines/`, {
                //   method: 'POST',
                //   headers: { 'Content-Type': 'application/json' },
                //   body: JSON.stringify(machineData)
                // });
                // const newMachine = await response.json();

                const newMachine = {
                    id: Date.now(), // Temporary ID generation
                    ...machineData
                };
                onSave(newMachine, false);
            }

            // Reset form
            setFormData({ name: '', image: '', level: 1, process: '' });
        } catch (error) {
            console.error('Error saving machine:', error);
            alert('Error saving machine. Please try again.');
        }
    };

    // Handle cancel
    const handleCancel = () => {
        setFormData({ name: '', image: '', level: 1, process: '' });
        if (onCancel) onCancel();
    };

    // Handle input changes
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: field === 'level' ? parseInt(value) : value
        }));
    };

    // Preview image
    const previewImage = formData.image && formData.image.trim() !== '';

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center gap-3">
                            <Settings className="w-8 h-8 text-blue-600" />
                            <h1 className="text-3xl font-bold text-gray-900">
                                {editingMachine ? 'Edit Machine' : 'Add New Machine'}
                            </h1>
                        </div>

                        {editingMachine && (
                            <button
                                onClick={handleCancel}
                                className="text-gray-600 hover:text-gray-900 flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                            >
                                <X className="w-4 h-4" />
                                Cancel
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Form Section */}
                    <div className="bg-white rounded-xl shadow-md p-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Machine Details</h2>

                        <div className="space-y-6">
                            {/* Machine Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Machine Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                                    placeholder="Enter machine name"
                                    maxLength={100}
                                />
                            </div>

                            {/* Image URL */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Image URL
                                </label>
                                <input
                                    type="url"
                                    value={formData.image}
                                    onChange={(e) => handleInputChange('image', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                                    placeholder="https://example.com/machine-image.jpg"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Enter a valid image URL for the machine photo
                                </p>
                            </div>

                            {/* Level */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Machine Level
                                </label>
                                <select
                                    value={formData.level}
                                    onChange={(e) => handleInputChange('level', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                                >
                                    <option value={1}>Level 1 - Basic</option>
                                    <option value={2}>Level 2 - Intermediate</option>
                                    <option value={3}>Level 3 - Advanced</option>
                                </select>
                            </div>

                            {/* Process */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Process Type *
                                </label>
                                <input
                                    type="text"
                                    value={formData.process}
                                    onChange={(e) => handleInputChange('process', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                                    placeholder="e.g., Milling, 3D Printing, Cutting, Welding"
                                    maxLength={50}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-6">
                                <button
                                    onClick={handleSubmit}
                                    disabled={!formData.name.trim() || !formData.process.trim()}
                                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
                                >
                                    <Save className="w-5 h-5" />
                                    {editingMachine ? 'Update Machine' : 'Save Machine'}
                                </button>

                                {onViewList && (
                                    <button
                                        onClick={onViewList}
                                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                    >
                                        View List
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default MachineSettings;