import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../../Navbar/Navbar";
import OperatorTestsViewer from "../../../OperatorDashbaord/components/OperatorTestsViewer/OperatorTestsViewer";


// Define interfaces for your data
interface TrainingContent {
  id: string;
  description: string;
  training_file?: string;
  url_link?: string;
  content_type: string;
  subtopic_content?: number;
}

// Training Materials Component
const Level1Component: React.FC = () => {
  const [trainingContents, setTrainingContents] = useState<TrainingContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');

  // Fetch training contents
  useEffect(() => {
    const fetchTrainingContents = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://127.0.0.1:8000/training-contents/`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch training contents');
        }
        
        const data: TrainingContent[] = await response.json();
        setTrainingContents(data);
      } catch (err) {
        console.error('Error fetching training contents:', err);
        setError('Failed to load training contents');
      } finally {
        setLoading(false);
      }
    };

    fetchTrainingContents();
  }, []);

  const handleMaterialClick = (content: TrainingContent) => {
    if (content.url_link) {
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

      window.open(fileURL, '_blank', 'noopener,noreferrer');
    } else {
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
        <svg className={`${sizeClass} text-blue-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      );
    }

    if (content.training_file) {
      const extension = content.training_file.split('.').pop()?.toLowerCase();

      if (extension === 'pdf') {
        return (
          <svg className={`${sizeClass} text-red-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      }

      if (['mp4', 'mov', 'avi', 'mkv'].includes(extension || '')) {
        return (
          <svg className={`${sizeClass} text-purple-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      }

      if (['ppt', 'pptx'].includes(extension || '')) {
        return (
          <svg className={`${sizeClass} text-orange-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      }

      if (['doc', 'docx'].includes(extension || '')) {
        return (
          <svg className={`${sizeClass} text-blue-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      }

      if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(extension || '')) {
        return (
          <svg className={`${sizeClass} text-green-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm4 12l3.2-4.2a1 1 0 011.6 0l2.4 3.2 1.6-2.1a1 1 0 011.6 0L21 17H5z" />
          </svg>
        );
      }
    }

    return (
      <svg className={`${sizeClass} text-gray-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
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
          onClick={() => handleMaterialClick(content)}
        >
          <div className="mr-3 flex-shrink-0">
            {getFileIcon(content)}
          </div>
          <div className="flex-1 min-w-0">
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
          <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div>Loading training contents...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-800">Training Materials</h3>
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

      {trainingContents.length > 0 ? (
        <>
          {viewType === 'grid' && renderGridView()}
          {viewType === 'list' && renderListView()}
        </>
      ) : (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
          No materials available.
        </div>
      )}
    </div>
  );
};

export default Level1Component