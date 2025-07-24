import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Nav from "../../../../../../HomeNav/nav";
import MaterialDisplay from "./FileUploadDisplayComponent/FileUploadDisplayComponent";
import UploadModal from "./FileUploadUploadComponent/FileUploadUploadComponent";
import axios from "axios";

interface LocationState {
  lineId?: string;
  lineName?: string;
  prevpage?: string;
  sectionTitle?: string;
}

interface TrainingContent {
  id: string;
  description: string;
  training_file?: string;  // Changed from FileUpload_file to match Django model
  url_link?: string;
  topic?: number;  // Added to match your API response
}

export default function FileUploadComponent() {
  const location = useLocation();
  const { lineId, lineName, prevpage, sectionTitle } = (location.state as LocationState) || {};
  const [trainingContents, setTrainingContents] = useState<TrainingContent[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch training contents with topic filtering
  const fetchTrainingContents = async () => {
    try {
      setLoading(true);
      const url = lineId 
        ? `http://127.0.0.1:8000/leveltwo-contents/?topic_id=${lineId}`
        : 'http://127.0.0.1:8000/leveltwo-contents/';
      
      const response = await axios.get(url);
      setTrainingContents(response.data.results || response.data);
      setLoading(false);
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Failed to load training contents');
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchTrainingContents();
  }, [lineId]);  // Refetch when lineId changes

  const handleUploadSuccess = (newContent: TrainingContent) => {
    setTrainingContents(prev => [...prev, newContent]);
    fetchTrainingContents();  // Refresh the list to ensure consistency
  };

  const handleDeleteContent = async (contentId: string) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/leveltwo-contents/${contentId}/`);
      setTrainingContents(prev => prev.filter(content => content.id !== contentId));
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete content');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <div className="text-gray-600">Loading training contents...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 mb-2">{error}</div>
          <button
            onClick={fetchTrainingContents}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Nav />
      <div className="max-w-xxl mx-auto p-6 ">
        {/* Header with dynamic title based on lineName */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            Training Materials
            {/* {lineName ? `${lineName} Training` : 'Training Materials'} */}
          </h1>
          <p className="text-gray-600 text-center">
            {/* {lineName 
              ? `Resources for ${lineName} training`
              : 'Upload and manage training resources including files and web links'} */}
              Upload and manage training resources including files and web links
          </p>
        </div>

        {/* Upload Button */}
        <div className="mb-6 flex justify-end mr-5">
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2 shadow-md transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Upload Training Content</span>
          </button>
        </div>

        {/* Content Display */}
        <MaterialDisplay
          trainingContents={trainingContents}
          onDeleteContent={handleDeleteContent}
          lineId={lineId}
        />

        {/* Upload Modal */}
        {showUploadModal && (
          <UploadModal
            showUploadModal={showUploadModal}
            setShowUploadModal={setShowUploadModal}
            onUploadSuccess={handleUploadSuccess}
            lineId={lineId}
          />
        )}
      </div>
    </>
  );
}