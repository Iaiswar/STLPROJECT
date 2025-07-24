import { useState } from "react";
import axios from "axios";

interface TrainingContent {
  id: string;
  description: string;
  training_file?: string;  // Changed from training_file to match your API
  url_link?: string | null;
  topic?: number;
}


interface MaterialDisplayProps {
  trainingContents: TrainingContent[];
  onDeleteContent: (contentId: string) => void;
  lineId?: string;
}

export default function MaterialDisplay({ 
  trainingContents, 
  onDeleteContent,
  lineId
}: MaterialDisplayProps) {
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');

    console.log(trainingContents)
    
  const handleMaterialClick = (content: TrainingContent) => {
    console.log('Clicked Training material:', content);

  if (content.url_link) {
  let finalUrl = content.url_link.trim();

  // Prepend protocol if missing
  if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
    finalUrl = 'https://' + finalUrl;  // safer default
  }

  console.log('Opening URL link:', finalUrl);
  window.open(finalUrl, '_blank', 'noopener,noreferrer');
}else if (content.training_file) {
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
    if (['glb', 'gltf', 'obj', 'fbx'].includes(extension)) return '3D Model';
    if (['apk', 'ipa'].includes(extension)) return 'Training App';

    return 'File';
  };

  const getFileIcon = (content: TrainingContent) => {
    if (content.url_link) {
      return (
        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      );
    }

    if (content.training_file) {
      const extension = content.training_file.split('.').pop()?.toLowerCase();

      if (['glb', 'gltf', 'obj', 'fbx'].includes(extension || '')) {
        return (
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        );
      }

      if (['apk', 'ipa'].includes(extension || '')) {
        return (
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      }

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

      return (
        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    }

    return null;
  };

  const handleDeleteContent = async (contentId: string) => {
    if (!window.confirm('Are you sure you want to delete this Training material?')) {
      return;
    }

    try {
      const response = await axios.delete(`http://127.0.0.1:8000/levelthree-contents/${contentId}/`);

      if (response.status === 204) {
        onDeleteContent(contentId);
        alert('Training Material deleted successfully');
      } else {
        alert('Failed to delete material');
      }
    } catch (error) {
      console.error('Error deleting material:', error);
      alert('An error occurred while deleting the material');
    }
  };

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
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* Header with view toggle */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-medium text-gray-800">Training Materials</h3>
        <div className="flex border rounded-lg overflow-hidden">
          <button
            onClick={() => setViewType('grid')}
            className={`p-2 ${viewType === 'grid' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700'}`}
            title="Grid view"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewType('list')}
            className={`p-2 ${viewType === 'list' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700'}`}
            title="List view"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content display */}
      {trainingContents.length > 0 ? (
        <>
          {viewType === 'grid' && renderGridView()}
          {viewType === 'list' && renderListView()}
        </>
      ) : (
        <div className="text-center py-12 text-gray-500 border-2 border-dashed rounded-lg">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-lg mb-2">No Training materials uploaded yet</p>
          <p>Click "Upload Training Material" to add 3D models, applications, and other resources</p>
        </div>
      )}
    </div>
  );
}