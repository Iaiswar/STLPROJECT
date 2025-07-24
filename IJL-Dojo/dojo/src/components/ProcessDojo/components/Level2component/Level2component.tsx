import React, { useState, useEffect } from "react";
import Nav from '../HomeNav/nav';

interface TrainingContent {
  id: number;
  description: string;
  training_file?: string;
  url_link?: string;
  subunit: number;
}

interface SubUnit {
  id: number;
  leveltwo_contents: TrainingContent[];
  title: string;
  unit: number;
}

interface Unit {
  id: number;
  subunits: SubUnit[];
  content: string;
  topic: number;
  subtopic: number | null;
  day: number;
}

interface Subtopic {
  id: number;
  leveltwo_units: Unit[];
  title: string;
  topic: number;
}

interface Topic {
  id: number;
  leveltwo_subtopics: Subtopic[];
  leveltwo_units: Unit[];
  title: string;
  section: number;
}

interface Section {
  id: number;
  leveltwo_topics: Topic[];
  title: string;
  skill_training: number;
}

const Level2Component: React.FC = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<number | null>(null);
  const [expandedTopic, setExpandedTopic] = useState<number | null>(null);
  const [selectedContent, setSelectedContent] = useState<TrainingContent[]>([]);
  const [selectedTitle, setSelectedTitle] = useState<string>("");

  // Fetch training contents
  useEffect(() => {
    const fetchTrainingContents = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://127.0.0.1:8000/level2-sections/`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch Level 2 contents');
        }
        
        const data: Section[] = await response.json();
        setSections(data);
      } catch (err) {
        console.error('Error fetching Level 2 contents:', err);
        setError('Failed to load Level 2 contents');
      } finally {
        setLoading(false);
      }
    };

    fetchTrainingContents();
  }, []);

  const toggleSection = (sectionId: number) => {
    if (expandedSection === sectionId) {
      setExpandedSection(null);
      setExpandedTopic(null);
      setSelectedContent([]);
      setSelectedTitle("");
    } else {
      setExpandedSection(sectionId);
      setExpandedTopic(null);
      setSelectedContent([]);
      setSelectedTitle("");
    }
  };

  const toggleTopic = (topic: Topic) => {
    if (expandedTopic === topic.id) {
      setExpandedTopic(null);
      setSelectedContent([]);
      setSelectedTitle("");
    } else {
      setExpandedTopic(topic.id);
      
      // If topic has subtopics, don't show content yet
      if (topic.leveltwo_subtopics.length > 0) {
        setSelectedContent([]);
        setSelectedTitle("");
      } else {
        // If no subtopics, collect all content from units
        const allContents: TrainingContent[] = [];
        topic.leveltwo_units.forEach(unit => {
          unit.subunits.forEach(subunit => {
            allContents.push(...subunit.leveltwo_contents);
          });
        });
        setSelectedContent(allContents);
        setSelectedTitle(topic.title);
      }
    }
  };

  const selectSubtopic = (subtopic: Subtopic) => {
    // Collect all content from subtopic units
    const allContents: TrainingContent[] = [];
    subtopic.leveltwo_units.forEach(unit => {
      unit.subunits.forEach(subunit => {
        allContents.push(...subunit.leveltwo_contents);
      });
    });
    setSelectedContent(allContents);
    setSelectedTitle(subtopic.title);
  };

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
    if (!url) return 'File';
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

  const renderContentArea = () => {
    if (selectedContent.length === 0) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-gray-500 max-w-md">
            <div className="relative mb-8">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-yellow-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">Select a Topic</h3>
            <p className="text-gray-500 leading-relaxed">
              Browse through the navigation menu on the left to discover training materials. 
              Click on any section or topic to view available content.
            </p>
            <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Choose from sections, topics, and subtopics</span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="h-full overflow-auto">
        {selectedTitle && (
          <div className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 pb-6 mb-8 z-10 rounded-lg shadow-sm p-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{selectedTitle}</h2>
            <div className="flex items-center text-gray-600">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="font-medium">{selectedContent.length} training materials available</span>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {selectedContent.map((content) => (
            <div
              key={content.id}
              className="group flex flex-col p-8 bg-white border border-gray-200 rounded-2xl hover:bg-gradient-to-br hover:from-white hover:to-blue-50 cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-blue-200 hover:-translate-y-1"
              onClick={() => handleMaterialClick(content)}
            >
              <div className="flex items-start mb-6">
                <div className="mr-5 flex-shrink-0 p-3 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl group-hover:from-blue-100 group-hover:to-indigo-200 transition-colors duration-300">
                  {getFileIcon(content, 'w-8 h-8')}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-gray-800 font-bold text-lg leading-tight group-hover:text-blue-700 transition-colors duration-300 mb-2">
                    {content.description}
                  </h3>
                </div>
              </div>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-sm font-medium text-gray-600 bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-2 rounded-full group-hover:from-blue-100 group-hover:to-indigo-200 group-hover:text-blue-700 transition-all duration-300">
                  {content.training_file ? 
                    getFileTypeFromUrl(content.training_file) : 
                    'Web Link'
                  }
                </span>
                <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full group-hover:bg-blue-500 transition-all duration-300">
                  <svg className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg font-medium text-gray-700">Loading Level 2 contents...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-red-500">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div className="text-lg font-medium">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - Navigation */}
      <div className="w-[20%] bg-white shadow-lg border-r border-gray-200 overflow-auto">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Level 2 Training</h1>
          <p className="text-gray-600 text-sm">Navigate through training materials</p>
        </div>
        
        <div className="p-3">
          <div className="space-y-3">
            {sections.map((section) => (
              <div key={section.id} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <button
                  className={`w-full text-left p-4 font-medium flex justify-between items-center transition-all duration-200 ${
                    expandedSection === section.id 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                  onClick={() => toggleSection(section.id)}
                >
                  <span className={`font-semibold text-sm ${expandedSection === section.id ? 'text-white' : ''}`}>
                    {section.title}
                  </span>
                  <svg
                    className={`w-4 h-4 transform transition-transform duration-200 ${
                      expandedSection === section.id ? 'rotate-180 text-white' : 'text-gray-500'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {expandedSection === section.id && (
                  <div className="bg-gradient-to-b from-gray-50 to-white border-t border-gray-100">
                    {section.leveltwo_topics.length > 0 ? (
                      <div className="space-y-2 p-3">
                        {section.leveltwo_topics.map((topic) => (
                          <div key={topic.id} className="border border-gray-100 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                            <button
                              className={`w-full text-left p-3 font-medium flex justify-between items-center transition-all duration-200 ${
                                expandedTopic === topic.id 
                                  ? 'bg-gradient-to-r from-indigo-400 to-purple-500 text-white' 
                                  : 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 text-gray-700'
                              }`}
                              onClick={() => toggleTopic(topic)}
                            >
                              <span className={`text-sm font-medium ${expandedTopic === topic.id ? 'text-white' : ''}`}>
                                {topic.title}
                              </span>
                              <svg
                                className={`w-3 h-3 transform transition-transform duration-200 ${
                                  expandedTopic === topic.id ? 'rotate-180 text-white' : 'text-gray-400'
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            
                            {expandedTopic === topic.id && topic.leveltwo_subtopics.length > 0 && (
                              <div className="bg-gradient-to-b from-purple-50 to-indigo-50 border-t border-purple-100">
                                <div className="space-y-1 p-2">
                                  {topic.leveltwo_subtopics.map((subtopic) => (
                                    <button
                                      key={subtopic.id}
                                      className="w-full text-left p-2 hover:bg-white hover:text-indigo-700 hover:shadow-sm rounded-md transition-all duration-200 flex justify-between items-center text-xs group"
                                      onClick={() => selectSubtopic(subtopic)}
                                    >
                                      <span className="font-medium text-gray-700 group-hover:text-indigo-700">
                                        {subtopic.title}
                                      </span>
                                      <svg
                                        className="w-3 h-3 text-gray-400 group-hover:text-indigo-500 transform group-hover:translate-x-1 transition-all duration-200"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                      </svg>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500 p-4 text-center bg-gray-50">
                        <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        No topics available
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {sections.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm font-medium">No materials available</p>
              <p className="text-xs text-gray-400 mt-1">Check back later for updates</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1  bg-gradient-to-br from-gray-50 to-blue-50">
        {renderContentArea()}
      </div>
    </div>
  );
};

export default Level2Component;