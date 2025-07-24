import { useState, useEffect, useRef } from "react";


import axios from "axios";
import OperatorTestsViewer from "../../../OperatorDashbaord/components/OperatorTestsViewer/OperatorTestsViewer";
import Nav from "../../../HomeNav/nav";

interface TabData {
  id: string;
  title: string;
  content: string;
}

interface TrainingContent {
  id: string;
  description: string;
  training_file?: string;
  url_link?: string;
  sho_content: number;
}

interface ShoContent {
  id: number;
  subtopic: number;
  title: string;
}

export default function Shokuchou() {


  const [activeTab, setActiveTab] = useState<string>("tab1");
  const [trainingContents, setTrainingContents] = useState<TrainingContent[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState<'file' | 'link'>('file');
  const [newMaterial, setNewMaterial] = useState<{
    description: string;
    file: File | null;
    url: string;
  }>({ description: '', file: null, url: '' });
  const [ShoContents, setShoContents] = useState<ShoContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');

  // Fetch subtopic contents when component mounts
  useEffect(() => {
    const fetchShoContents = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://127.0.0.1:8000/sho-content/`);

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: ShoContent[] = await response.json();
        console.log('Sho Contents:', data);

        setShoContents(data);
        setLoading(false);
      } catch (error) {
        console.error('Fetch error:', error);
        setError('Failed to load lesson contents');
        setLoading(false);
      }
    };

    fetchShoContents();
  }, []);

  // Fetch training contents for the active tab using the correct endpoint
  useEffect(() => {
    const fetchTrainingContents = async () => {
      if (ShoContents.length === 0) return;

      const activeTabIndex = parseInt(activeTab.replace('tab', '')) - 1;
      const currentShoContent = ShoContents[activeTabIndex];

      if (!currentShoContent) return;

      try {
        // Use the endpoint with sho_content_id
        const response = await fetch(
          `http://127.0.0.1:8000/Sho-training-content-by-id/${currentShoContent.id}/`
        );

        if (response.ok) {
          const data: TrainingContent[] = await response.json();
          console.log('Training contents:', data);
          setTrainingContents(data);
        } else {
          console.error('Failed to fetch training contents');
          setTrainingContents([]);
        }
      } catch (error) {
        console.error('Error fetching training contents:', error);
        setTrainingContents([]);
      }
    };

    fetchTrainingContents();
  }, [activeTab, ShoContents]);

  // Generate tabs from subtopic contents
  const detailTabs: TabData[] = ShoContents.map((content, index) => ({
    id: `tab${index + 1}`,
    title: content.title,
    content: `Detailed information about ${content.title}`
  }));

  // Set first tab as active when tabs are loaded
  useEffect(() => {
    if (detailTabs.length > 0 && !activeTab) {
      setActiveTab(detailTabs[0].id);
    }
  }, [detailTabs]);

  const activeTabData = detailTabs.find(tab => tab.id === activeTab) || detailTabs[0];
  const isMCQTab = activeTabData?.title.toLowerCase() === "revision";

  // Get the current subcontent ID for the active tab
  const getCurrentSubcontentId = (): number | null => {
    const activeTabIndex = parseInt(activeTab.replace('tab', '')) - 1;
    const currentShoContent = ShoContents[activeTabIndex];
    return currentShoContent ? currentShoContent.id : null;
  };

  const onTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMaterial.description || (uploadType === 'file' && !newMaterial.file) || (uploadType === 'link' && !newMaterial.url)) {
      alert('Please fill all required fields');
      return;
    }

    const activeTabIndex = parseInt(activeTab.replace('tab', '')) - 1;
    const currentShoContent = ShoContents[activeTabIndex];

    if (!currentShoContent) {
      alert('No subtopic content selected');
      return;
    }

    try {
      setUploadLoading(true);
      const formData = new FormData();
      formData.append('description', newMaterial.description);
      formData.append('sho_content', currentShoContent.id.toString());

      if (uploadType === 'file' && newMaterial.file) {
        formData.append('training_file', newMaterial.file);
      } else if (uploadType === 'link' && newMaterial.url) {
        formData.append('url_link', newMaterial.url);
      }

      console.log('formData', formData);
      const response = await fetch('http://127.0.0.1:8000/sho-training-content/create/', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const newContent: TrainingContent = await response.json();
        setTrainingContents([...trainingContents, newContent]);
        setNewMaterial({ description: '', file: null, url: '' });
        setShowUploadModal(false);
        alert('Material uploaded successfully!');
      } else {
        const errorData = await response.json();
        console.error('Upload failed:', errorData);
        alert('Failed to upload material. Please try again.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('An error occurred while uploading. Please try again.');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setNewMaterial({ ...newMaterial, file: e.target.files[0] });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleMaterialClick = (content: TrainingContent) => {
    console.log('Clicked material:', content);

    if (content.url_link) {
      console.log('Opening URL link:', content.url_link);
      window.open(content.url_link, '_blank', 'noopener,noreferrer');
    } else if (content.training_file) {
      let fileURL;

      if (content.training_file.startsWith('http')) {
        fileURL = content.training_file;
      } else if (content.training_file.startsWith('/media/')) {
        fileURL = `http://127.0.0.1:8000${content.training_file}`;
      } else if (content.training_file.startsWith('media/')) {
        fileURL = `http://127.0.0.1:8000/${content.training_file}`;
      } else {
        fileURL = `http://127.0.0.1:8000/media/${content.training_file}`;
      }

      console.log('Opening file URL:', fileURL);

      fetch(fileURL, { method: 'HEAD' })
        .then(response => {
          if (response.ok) {
            window.open(fileURL, '_blank', 'noopener,noreferrer');
          } else {
            console.error('File not found at:', fileURL);
            alert(`File not found at: ${fileURL}\nPlease check if the file exists and the media URL is configured correctly.`);
          }
        })
        .catch(error => {
          console.error('Error checking file:', error);
          window.open(fileURL, '_blank', 'noopener,noreferrer');
        });
    } else {
      console.log('No file or URL found for material:', content);
      alert('No file or URL associated with this material.');
    }
  };

  const getFileTypeFromUrl = (url: string): string => {
    const extension = url.split('.').pop()?.toLowerCase();

    if (!extension) return 'File';

    if (extension === 'pdf') return 'PDF';
    if (['mp4', 'mov', 'avi', 'mkv'].includes(extension)) return 'Video';
    if (['ppt', 'pptx'].includes(extension)) return 'Presentation';
    if (['doc', 'docx'].includes(extension)) return 'Document';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(extension)) return 'Image';

    return 'File';
  };

  const getFileIcon = (content: TrainingContent, sizeClass = 'w-5 h-5') => {
    if (content.url_link) {
      return (
        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      );
    }

    if (content.training_file) {
      const extension = content.training_file.split('.').pop()?.toLowerCase();

      if (extension === 'pdf') {
        return (
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      }

      if (['mp4', 'mov', 'avi', 'mkv'].includes(extension || '')) {
        return (
          <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      }

      if (['ppt', 'pptx'].includes(extension || '')) {
        return (
          <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      }

      if (['doc', 'docx'].includes(extension || '')) {
        return (
          <svg className={`${sizeClass} text-blue-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      }

      if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(extension || '')) {
        return (
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm4 12l3.2-4.2a1 1 0 011.6 0l2.4 3.2 1.6-2.1a1 1 0 011.6 0L21 17H5z" />
          </svg>
        );
      }

      return (
        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <div className="w-72 bg-white shadow-md"></div>
        <div className="flex-1 p-6 overflow-auto flex items-center justify-center">
          <div>Loading lesson contents...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-100">
        <div className="w-72 bg-white shadow-md"></div>
        <div className="flex-1 p-6 overflow-auto flex items-center justify-center">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  const handleDeleteContent = async (contentId: string) => {
    if (!window.confirm('Are you sure you want to delete this material?')) {
      return;
    }
    console.log(contentId)
    try {
      const response = await axios.delete(`http://127.0.0.1:8000/sho-training-content/${contentId}/`);

      if (response.status === 204) {
        setTrainingContents(trainingContents.filter(content => content.id !== contentId));
        alert('Material deleted successfully');
      } else {
        alert('Failed to delete material');
      }
    } catch (error) {
      console.error('Error deleting material:', error);
      alert('An error occurred while deleting the material');
    }
  };
  console.log(trainingContents)

  const renderGridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {trainingContents.map((content) => (
        <div
          key={content.id}
          className="group flex flex-col p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200 hover:shadow-sm"
          onClick={() => handleMaterialClick(content)}
        >
          <div className="flex items-center mb-3">
            <div className="mr-3 flex-shrink-0">
              {getFileIcon(content)}
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
            {content.training_file ?
              `File: ${getFileTypeFromUrl(content.training_file)}` :
              'Web Link'
            }
          </div>
        </div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-2">
      {trainingContents.map((content) => (
        <div
          key={content.id}
          className="group flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200 hover:shadow-sm"
        >
          <div className="mr-3 flex-shrink-0">
            {getFileIcon(content)}
          </div>
          <div
            className="flex-1 min-w-0"
            onClick={() => handleMaterialClick(content)}
          >
            <span className="text-gray-800 hover:text-blue-600 block font-medium truncate">
              {content.description}
            </span>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs text-gray-500">
                {content.training_file ?
                  `File: ${getFileTypeFromUrl(content.training_file)}` :
                  'Web Link'
                }
              </span>
              {content.training_file && (
                <span className="text-xs text-gray-400" title={content.training_file}>
                  • {content.training_file.split('/').pop()}
                </span>
              )}
              {content.url_link && (
                <span className="text-xs text-gray-400" title={content.url_link}>
                  • {content.url_link.length > 30 ? content.url_link.substring(0, 30) + '...' : content.url_link}
                </span>
              )}
            </div>
          </div>
          <div className="ml-2 flex space-x-2">
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
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
    <Nav />
     <div className="flex h-screen mt-[56px] bg-gray-100">
      {/* Left sidebar */}
      <div className="w-72 bg-white shadow-md">
        <nav className="flex flex-col p-2">
          {detailTabs.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => onTabClick(tab.id)}
              className={`p-3 my-1 text-left rounded-lg transition-colors duration-200 flex items-center ${activeTab === tab.id ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-blue-100"
                }`}
            >
              <span className="mr-2 font-medium text-lg">{index + 1}.</span>
              <span className="font-medium">{tab.title}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Right content area */}
      <div className="flex-1 p-6 overflow-auto">
        <div className=" mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">{activeTabData?.title || 'Loading...'}</h1>
            <div className="text-sm text-gray-600">
              Content {activeTab?.replace('tab', '')} of {detailTabs.length}
            </div>
          </div>

          {isMCQTab ? (
            <OperatorTestsViewer subcontentId={getCurrentSubcontentId()} />
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-700 mb-6">{activeTabData?.content || 'Content not available'}</p>

              {/* Training Materials Section */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800">Training Materials</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    + Upload Material
                  </button>
                  <div className="flex border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewType('grid')}
                      className={`p-2 ${viewType === 'grid' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
                      title="Grid view"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setViewType('list')}
                      className={`p-2 ${viewType === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
                      title="List view"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {trainingContents.length > 0 ? (
                <>
                  {viewType === 'grid' && renderGridView()}
                  {viewType === 'list' && renderListView()}
                </>
              ) : (
                <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                  No materials uploaded yet. Click "Upload Material" to add resources.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Upload New Material</h2>

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
                      className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter material description"
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
                        className={`px-4 py-2 rounded ${uploadType === 'file' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                      >
                        File Upload
                      </button>
                      <button
                        type="button"
                        onClick={() => setUploadType('link')}
                        className={`px-4 py-2 rounded ${uploadType === 'link' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
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
                        onChange={handleFileChange}
                        className="hidden"
                        required={uploadType === 'file'}
                        accept=".pdf,.ppt,.pptx,.doc,.docx,.mp4,.mov,.avi,.mkv"
                      />
                      <div className="flex items-center">
                        <button
                          type="button"
                          onClick={triggerFileInput}
                          className="px-4 py-2 bg-gray-200 rounded-l hover:bg-gray-300"
                        >
                          Choose File
                        </button>
                        <div className="flex-1 p-2 border border-l-0 rounded-r bg-gray-50 text-sm text-gray-500 truncate">
                          {newMaterial.file ? newMaterial.file.name : 'No file selected'}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Supported formats: PDF, PPT, DOC, MP4, MOV, AVI, MKV
                      </p>
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
                        className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://example.com"
                        required={uploadType === 'link'}
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
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
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
}