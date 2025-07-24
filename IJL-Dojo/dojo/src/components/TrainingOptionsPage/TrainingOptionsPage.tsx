
import { useState, useEffect, useRef } from "react";
import { CheckCircle, GraduationCap, CalendarCheck } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Nav from "../HomeNav/nav";

interface TrainingContent {
  id: string;
  description: string;
  l2_file?: string;
  url_link?: string;
}

interface LocationState {
  lineId?: string;
  lineName?: string;
  prevpage?: string;
  sectionTitle?: string;
  questionPaperId?: number;  // <-- added here
}

const TrainingOptionsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { lineId, lineName, prevpage, sectionTitle, questionPaperId } = (location.state as LocationState) || {};

  console.log('Received state:', { lineId, lineName, prevpage, sectionTitle, questionPaperId });

  // l2fileupload Materials State
  const [trainingContents, setTrainingContents] = useState<TrainingContent[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState<'file' | 'link'>('file');
  const [newMaterial, setNewMaterial] = useState<{
    description: string;
    file: File | null;
    url: string;
  }>({ description: '', file: null, url: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch l2fileupload training contents
  useEffect(() => {
    const fetchArVrContents = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://127.0.0.1:8000/L2fileupload/');
        if (!response.ok) throw new Error('Network response was not ok');
        const data: TrainingContent[] = await response.json();
        setTrainingContents(data);
        setLoading(false);
      } catch (error) {
        console.error('Fetch error:', error);
        setError('Failed to load L2fileuploadign contents');
        setLoading(false);
      }
    };
    fetchArVrContents();
  }, []);

  // Navigation handlers
  const handleEvaluationTestClick = () => {
    navigate("/assign-remote", {
      state: {
        lineId,
        lineName,
        prevpage,
        sectionTitle,
        questionPaperId,  // <-- pass questionPaperId forward
      }
    });
  };
  const handleOJTClick = () => navigate("/");
  const handleTenCycleClick = () => {
    navigate("/SearchBar", {
      state: {
        lineId,
        lineName,
        prevpage,
        sectionTitle
      }
    });
  };

  // l2fileupload Material Handlers
  const handleUploadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newMaterial.description || (uploadType === 'file' && !newMaterial.file) || 
        (uploadType === 'link' && !newMaterial.url)) {
      alert('Please fill all required fields');
      return;
    }

    try {
      setUploadLoading(true);
      const formData = new FormData();
      formData.append('description', newMaterial.description);

      if (uploadType === 'file' && newMaterial.file) {
        formData.append('l2_file', newMaterial.file);
      } else if (uploadType === 'link' && newMaterial.url) {
        formData.append('url_link', newMaterial.url);
      }
    
      const response = await axios.post('http://127.0.0.1:8000/L2fileupload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 201) {
        setTrainingContents([...trainingContents, response.data]);
        setNewMaterial({ description: '', file: null, url: '' });
        setShowUploadModal(false);
        alert('L2file Material uploaded successfully!');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('An error occurred while uploading. Please try again.');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleMaterialClick = (content: TrainingContent) => {
    if (content.url_link) {
      window.open(content.url_link, '_blank', 'noopener,noreferrer');
    } else if (content.l2_file) {
      const fileURL = content.l2_file.startsWith('http') ? content.l2_file :
        content.l2_file.startsWith('/media/') ? `http://127.0.0.1:8000${content.l2_file}` :
        content.l2_file.startsWith('media/') ? `http://127.0.0.1:8000/${content.l2_file}` :
        `http://127.0.0.1:8000/media/${content.l2_file}`;
      
      window.open(fileURL, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDeleteContent = async (contentId: string) => {
    if (!window.confirm('Are you sure you want to delete this L2file material?')) return;
    
    try {
      await axios.delete(`http://127.0.0.1:8000/L2fileupload/${contentId}/`);
      setTrainingContents(trainingContents.filter(content => content.id !== contentId));
    } catch (error) {
      console.error('Error deleting material:', error);
      alert('An error occurred while deleting the material');
    }
  };

  // Render functions
  const renderTrainingOptions = () => (
    <div className="p-4 bg-gray-50 rounded-lg mx-auto mb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div 
          className="flex flex-col items-center p-6 bg-white rounded-lg hover:bg-blue-50 hover:border-blue-200 border-2 border-transparent transition-all duration-200 cursor-pointer shadow-sm"
          onClick={handleEvaluationTestClick}
        >
          <CheckCircle className="w-10 h-10 text-blue-500 mb-4" />
          <span className="text-gray-700 font-medium text-lg text-center">Evaluation Test</span>
        </div>
        
        <div 
          className="flex flex-col items-center p-6 bg-white rounded-lg hover:bg-green-50 hover:border-green-200 border-2 border-transparent transition-all duration-200 cursor-pointer shadow-sm"
          onClick={handleOJTClick}
        >
          <GraduationCap className="w-10 h-10 text-green-500 mb-4" />
          <span className="text-gray-700 font-medium text-lg text-center">On-Job Training</span>
        </div>
        
        <div 
          className="flex flex-col items-center p-6 bg-white rounded-lg hover:bg-purple-50 hover:border-purple-200 border-2 border-transparent transition-all duration-200 cursor-pointer shadow-sm"
          onClick={handleTenCycleClick}
        >
          <CalendarCheck className="w-10 h-10 text-purple-500 mb-4" />
          <span className="text-gray-700 font-medium text-lg text-center">Ten Cycle</span>
        </div>
      </div>
    </div>
  );

  const renderARVRMaterials = () => (
    <div className="bg-white p-6 rounded-lg shadow-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-medium text-gray-800"></h3>
        <button
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Upload file Material</span>
        </button>
      </div>

      {trainingContents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {trainingContents.map((content) => (
            <div
              key={content.id}
              className="group flex flex-col p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200 hover:shadow-sm"
              onClick={() => handleMaterialClick(content)}
            >
              <div className="flex items-center mb-3">
                <div className="mr-3 flex-shrink-0">
                  <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-gray-800 hover:text-blue-600 block font-medium truncate">
                    {content.description}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteContent(content.id);
                  }}
                  className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100"
                  title="Delete this material"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <div className="text-xs text-gray-500 mt-auto">
                {content.l2_file ? '3D Model/File' : 'Web Link'}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 border-2 border-dashed rounded-lg">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-lg mb-2">No L2file materials uploaded yet</p>
        </div>
      )}
    </div>
  );

  return (
    <>
      <Nav />
      <div className="mx-auto p-6 pt-20">
        {/* Training Options */}
        {renderTrainingOptions()}

        {/* AR/VR Materials Section */}
        {renderARVRMaterials()}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4 text-purple-800">Upload L2file Material</h2>
                <form onSubmit={handleUploadSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Material Description *
                      </label>
                      <input
                        type="text"
                        value={newMaterial.description}
                        onChange={(e) => setNewMaterial({ ...newMaterial, description: e.target.value })}
                        className="w-full p-2 border rounded focus:ring-purple-500 focus:border-purple-500"
                        placeholder="e.g., 3D Engine Model"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Upload Type *
                      </label>
                      <div className="flex space-x-4">
                        <button
                          type="button"
                          onClick={() => setUploadType('file')}
                          className={`px-4 py-2 rounded ${uploadType === 'file' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
                        >
                          File Upload
                        </button>
                        <button
                          type="button"
                          onClick={() => setUploadType('link')}
                          className={`px-4 py-2 rounded ${uploadType === 'link' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
                        >
                          Web Link
                        </button>
                      </div>
                    </div>

                    {uploadType === 'file' ? (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Select File *
                        </label>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={(e) => e.target.files && setNewMaterial({ ...newMaterial, file: e.target.files[0] })}
                          className="hidden"
                          required
                          accept=".glb,.gltf,.obj,.fbx,.apk,.ipa"
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
                            {newMaterial.file ? newMaterial.file.name : 'No file selected'}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          URL *
                        </label>
                        <input
                          type="url"
                          value={newMaterial.url}
                          onChange={(e) => setNewMaterial({ ...newMaterial, url: e.target.value })}
                          className="w-full p-2 border rounded focus:ring-purple-500 focus:border-purple-500"
                          placeholder="https://example.com/ar-experience"
                          required
                        />
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowUploadModal(false)}
                      className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                      disabled={uploadLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
                      disabled={uploadLoading}
                    >
                      {uploadLoading ? 'Uploading...' : 'Upload Material'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TrainingOptionsPage;