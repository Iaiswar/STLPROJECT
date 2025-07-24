import { useState, useRef, ChangeEvent, FormEvent } from "react";
import axios from "axios";

interface TrainingContent {
  id: string;
  description: string;
  arvr_file?: string;
  url_link?: string;
  topic: number; // Add topic field to match your API
}

interface UploadModalProps {
  showUploadModal: boolean;
  setShowUploadModal: (show: boolean) => void;
  onUploadSuccess: (newContent: TrainingContent) => void;
  lineId?: string; // This is your topic ID
}

type UploadType = 'file' | 'link';

interface FormState {
  description: string;
  file: File | null;
  url: string;
  type: UploadType;
}

export default function UploadModal({
  showUploadModal,
  setShowUploadModal,
  onUploadSuccess,
  lineId
}: UploadModalProps) {
  const [formState, setFormState] = useState<FormState>({
    description: '',
    file: null,
    url: '',
    type: 'file'
  });
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!formState.description.trim()) {
      alert('Please enter a description');
      return;
    }

    if (formState.type === 'file' && !formState.file) {
      alert('Please select a file');
      return;
    }

    if (formState.type === 'link' && !formState.url.trim()) {
      alert('Please enter a valid URL');
      return;
    }

    if (!lineId) {
      alert('Topic ID is missing');
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('description', formState.description);
      formData.append('topic', lineId); // Add topic ID to the form data

      if (formState.type === 'file' && formState.file) {
        formData.append('training_file', formState.file); // Changed from arvr_file to training_file
      } else if (formState.type === 'link') {
        formData.append('url_link', formState.url);
      }

      const response = await axios.post('http://127.0.0.1:8000/levelthree-contents/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        onUploadSuccess(response.data);
        resetForm();
        setShowUploadModal(false);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormState(prev => ({
        ...prev,
        file: e.target.files![0],
        url: '' // Clear URL when file is selected
      }));
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (type: UploadType) => {
    setFormState(prev => ({
      ...prev,
      type,
      file: type === 'link' ? null : prev.file,
      url: type === 'file' ? '' : prev.url
    }));
  };

  const resetForm = () => {
    setFormState({
      description: '',
      file: null,
      url: '',
      type: 'file'
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    resetForm();
    setShowUploadModal(false);
  };

  if (!showUploadModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-purple-800">Upload Training Material</h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700"
              disabled={isLoading}
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <input
                type="text"
                name="description"
                value={formState.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-purple-500 focus:border-purple-500"
                placeholder="Describe your content"
                required
              />
            </div>

            {/* Upload Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Type *
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => handleTypeChange('file')}
                  className={`px-4 py-2 rounded ${formState.type === 'file' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
                >
                  File Upload
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange('link')}
                  className={`px-4 py-2 rounded ${formState.type === 'link' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
                >
                  Web Link
                </button>
              </div>
            </div>

            {/* File Upload */}
            {formState.type === 'file' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  File *
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  required={formState.type === 'file'}
                  accept=".glb,.gltf,.obj,.fbx,.apk,.ipa,.pdf,.ppt,.pptx,.doc,.docx,.mp4,.mov,.avi,.mkv"
                />
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-gray-200 rounded-l hover:bg-gray-300"
                  >
                    Choose File
                  </button>
                  <div className="flex-1 p-2 border border-l-0 rounded-r bg-gray-50 text-sm text-gray-500 truncate">
                    {formState.file?.name || 'No file selected'}
                  </div>
                </div>
              </div>
            )}

            {/* URL Input */}
            {formState.type === 'link' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL *
                </label>
                <input
                  type="text"
                  name="url"
                  value={formState.url}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring-purple-500 focus:border-purple-500"
                  placeholder="https://example.com/ar-experience"
                  required={formState.type === 'link'}
                />
              </div>
            )}

            {/* Submit Buttons */}
            <div className="pt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </span>
                ) : 'Upload Material'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}