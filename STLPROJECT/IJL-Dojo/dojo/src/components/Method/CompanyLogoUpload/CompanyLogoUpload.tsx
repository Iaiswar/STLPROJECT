import React, { useState, useEffect } from 'react';

interface Logo {
  id: number;
  name: string;
  logo: string;
  uploaded_at: string;
}

const CompanyLogoUpload: React.FC = () => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    logo: null as File | null
  });
  const [logos, setLogos] = useState<Logo[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null); // ✅ preview state added

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/logos/');
        if (response.ok) {
          const data = await response.json();
          setLogos(data);
          if (data.length > 0) {
            handleEdit(data[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching logos:', error);
        setErrorMessage('Failed to fetch logos. Please try again.');
      }
    };

    fetchLogos();
  }, []);

  useEffect(() => {
    if (formData.logo) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string); // ✅ show selected file preview
      };
      reader.readAsDataURL(formData.logo);
    }
  }, [formData.logo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        logo: file
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.logo && !isEditing) {
      setErrorMessage('Please select a logo file');
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append('name', formData.name);
    if (formData.logo) {
      data.append('logo', formData.logo);
    }

    try {
      const url = isEditing 
        ? `http://127.0.0.1:8000/logos/${formData.id}/`
        : 'http://127.0.0.1:8000/logos/';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${isEditing ? 'update' : 'upload'} logo`);
      }
      
      setSuccessMessage(`Logo ${isEditing ? 'updated' : 'uploaded'} successfully!`);
      resetForm();

      const logosResponse = await fetch('http://127.0.0.1:8000/logos/');
      if (logosResponse.ok) {
        const logosData = await logosResponse.json();
        setLogos(logosData);
        if (logosData.length > 0) {
          handleEdit(logosData[0]); // ✅ triggers preview update
        }
      }
    } catch (error: any) {
      console.error('Error:', error);
      setErrorMessage(error.message || `Failed to ${isEditing ? 'update' : 'upload'} logo. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      logo: null
    });
    setIsEditing(false);
    setPreview(null); // ✅ clear preview
    const fileInput = document.getElementById('logo') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleEdit = (logo: Logo) => {
    setFormData({
      id: logo.id.toString(),
      name: logo.name,
      logo: null
    });
    setIsEditing(true);
    setPreview(logo.logo); // ✅ set preview to existing logo
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this logo?')) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/logos/${id}/`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete logo');
        }

        setLogos(logos.filter(logo => logo.id !== id));
        setSuccessMessage('Logo deleted successfully!');
        resetForm();
      } catch (error) {
        console.error('Error deleting logo:', error);
        setErrorMessage('Failed to delete logo. Please try again.');
      }
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto mt-6 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        {logos.length > 0 ? 'Edit Company Logo' : 'Upload Company Logo'}
      </h2>
      
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {errorMessage}
        </div>
      )}
      
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}

      {(logos.length === 0 || isEditing) && (
        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <form onSubmit={handleSubmit}>
            {isEditing && (
              <input type="hidden" name="id" value={formData.id} />
            )}
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter company name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isEditing ? 'New Logo File (Leave blank to keep current)' : 'Logo File *'}
                </label>
                <input
                  type="file"
                  id="logo"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required={!isEditing}
                />
                <p className="mt-1 text-sm text-gray-500">
                  Supported formats: JPG, PNG, GIF, SVG (Max 5MB)
                </p>

                {/* ✅ Preview block */}
                {preview && (
                  <div className="mt-3">
                    <img
                      src={preview}
                      alt="Preview"
                      className="h-32 object-contain border rounded-md"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-4 pt-2">
                {isEditing && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {isEditing ? 'Updating...' : 'Uploading...'}
                    </>
                  ) : isEditing ? 'Update Logo' : 'Upload Logo'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Company Logo</h3>
        {logos.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {logos.map((logo) => (
              <div key={logo.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-center mb-3">
                  <img 
                    src={logo.logo}
                    alt={logo.name} 
                    className="h-32 object-contain"
                  />
                </div>
                <div className="text-center">
                  <h4 className="font-medium text-gray-800">{logo.name}</h4>
                  <p className="text-sm text-gray-500 mb-3">
                    Uploaded: {new Date(logo.uploaded_at).toLocaleDateString()}
                  </p>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => handleEdit(logo)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Edit Logo
                    </button>
                    <button
                      onClick={() => handleDelete(logo.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Delete Logo
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No logo uploaded yet</p>
        )}
      </div>
    </div>
  );
};

export default CompanyLogoUpload;
