import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import OperatorTestsViewer from "../../../OperatorDashbaord/components/OperatorTestsViewer/OperatorTestsViewer";

interface Lesson {
  title: string;
  date: string;
  // duration: string;
  details: string;
}

interface TabData {
  id: string;
  title: string;
  content: string;
}

interface UploadedMaterial {
  id: string;
  position: number;
  name: string;
  type: 'video' | 'pdf' | 'ppt' | 'link' | 'other';
  url: string;
  file?: File | null;
  uploadedAt: Date;
}

const lessons = [
  // Level 1 Lessons
  {
    level: 1,
    title: 'GENERAL INFORMATION TRAINING',
    date: 'Day 1',
    description: 'An introduction to the organization, its structure, customers, and operational practices.',
    details: 'About Group & Company, Organization Structure, About Customers & additional [Latest] information from customer, About New Model, Plant Layout, Dress Code,MCQ'
  },
  {
    level: 1,
    title: 'SAFETY TRAINING',
    date: 'Day 2',
    description: 'Covers fundamental safety principles including PPE, emergency procedures, and hazard identification.',
    details: 'Safety Intro, PPE\'s, Kiken Yochi, Fire Extinguisher uses & type, Emergency exit & safety symbols,MCQ'
  },
  {
    level: 1,
    title: '5 SENSES TRAINING',
    date: 'Day 2',
    description: 'Focus on sensory development and coordination to enhance judgment and efficiency.',
    details: 'About 5 Senses, Hand Synchronization: OK/NG parts sense development, Eye/Hand coordination development, Visual Judgement,MCQ'
  },
  {
    level: 1,
    title: 'PRODUCT AWARENESS TRAINING',
    date: 'Day 3',
    description: 'Provides an overview of product applications, safety, and regulatory considerations.',
    details: 'Product application overview, Product Fitment & Safety awareness, Do & Don\'ts, Legal awareness.'
  },
  {
    level: 1,
    title: 'PROCESS AWARENESS TRAINING',
    date: 'Day 3',
    description: 'Introduces process flow and 4M change awareness across multiple product lines.',
    details: '4M change awareness, Process flow awareness of all products: KN7/INJ/FPK/NG INJ/FUEL PIPE ASSY,MCQ'
  },
  {
    level: 1,
    title: 'PRODUCTION AWARENESS TRAINING',
    date: 'Day 4',
    description: 'Explains key production rules, document usage, and control techniques.',
    details: 'Shop floor rule awareness, FIFO, Lot control, Production regular documents (DPR/DR/4M Change),MCQ'
  },
  {
    level: 1,
    title: 'QUALITY AWARENESS TRAINING',
    date: 'Day 4',
    description: 'Covers the basics of quality control, defect handling, and regulatory standards.',
    details: 'Quality definition, Abnormality handling & NG handling rule, Defect matrix awareness, QC tool basic awareness, Regulatory marking,MCQ'
  },
  {
    level: 1,
    title: 'MAINTENANCE AWARENESS TRAINING',
    date: 'Day 5',
    description: 'Introduces types of maintenance and tool usage relevant to plant upkeep.',
    details: 'Basic maintenance, Type of maintenance, Tools awareness for maintenance uses,MCQ'
  },
  {
    level: 1,
    title: 'ERGONOMICS AWARENESS TRAINING',
    date: 'Day 5',
    description: 'Focuses on physical well-being through ergonomic practices and coordination skills.',
    details: 'Eye/Hand coordination practice, Human sustenance,MCQ'
  },
  {
    level: 1,
    title: 'INNOVATION TRAINING',
    date: 'Day 6',
    description: 'Introduces the concept of continuous improvement through games and Kaizen techniques.',
    details: 'Kaizen, Game 1, Game 2,MCQ'
  },
  {
    level: 1,
    title: 'Evaluation',
    date: 'Day 7',
    description: 'Assessment based on all the Modules',
    details: 'MCQ'
  },

  // Level 2 Lessons
  {
    level: 2,
    title: 'MATERIAL MOVEMENT SYSTEM',
    date: 'Day 1',
    description: 'Covers FIFO control, lot tag usage, and material handling procedures.',
    details: 'FIFO control, Lot Control & Lot tag, Use me first & Feed me first management, Part handling & storage awareness,MCQ'
  },
  {
    level: 2,
    title: 'MEASURING INSTRUMENT AWARENESS',
    date: 'Day 2',
    description: 'Introduces proper use and handling of measuring instruments.',
    details: 'Applicable measuring instruments awareness, Instruments operating/handling awareness,MCQ'
  },
  {
    level: 2,
    title: 'REGULAR DOCUMENTS USES AWARENESS',
    date: 'Day 3',
    description: 'Focuses on correct usage of shop floor documents and management sheets.',
    details: 'Filling method of Machine, Master & Data/Dim check sheet, 5’S check sheet, Others related check sheets, 4M change Management.'
  },
  {
    level: 2,
    title: 'ATTENTION POINT & CRITICAL POINTS OF PROCESS',
    date: 'Day 4',
    description: 'Explains critical and attention-required process steps.',
    details: 'Explanation of all attention points, awareness of Critical Process/Important Process (MARU-A).'
  },
  {
    level: 2,
    title: 'PROCEDURE FOR FIRST PART APPROVAL & SETUP CHANGE',
    date: 'Day 5',
    description: 'Outlines procedure for initial part approval and changeover setup.',
    details: 'Training for First part quality parameter confirmation, Setup changeover training [if applicable].'
  },
  {
    level: 2,
    title: 'EXPLANATION OF STANDARD OPERATION PROCEDURES AND WORKING METHOD',
    date: 'Day 5',
    description: 'Provides details on defined process work standards and OS explanation.',
    details: 'OS explanation, defined process work instructions,MCQ'
  },
  {
    level: 2,
    title: 'EQUIPMENT / MACHINE OPERATION TRAINING',
    date: 'Day 6',
    description: 'Covers practical training on equipment handling and operation.',
    details: 'Awareness of machine operations and actual machine operating awareness, Machine On/Off training,MCQ'
  }
];


const processData = [
  {
    heading: "Comp Section",
    subheadings: [
      {
        name: "Washing Machine",
        subcontent: []
      },
      {
        name: "Terminal Pre-setting",
        subcontent: []
      },
      {
        name: "Wire Winding",
        subcontent: []
      },
      {
        name: "Cutting Machine",
        subcontent: []
      },
      {
        name: "Electrodeposition",
        subcontent: []
      },
      {
        name: "Boss Cut",
        subcontent: []
      },
      {
        name: "Resistance",
        subcontent: []
      },
      {
        name: "Final Inspection",
        subcontent: []
      },


      {
        name: "Inj Comp A",
        subcontent: ["Operation", "Final Inspection"]
      },
      {
        name: "Inj Comp B",
        subcontent: ["Operation", "Terminal Height Check", "Final Inspection"]
      },
      {
        name: "Inj Comp C",
        subcontent: ["Operation", "Final Inspection"]
      }


    ]
  },
  {
    heading: "VC Grinding",
    subheadings: [
      {
        name: "Rough Grinding",
        subcontent: []
      },
      {
        name: "Finish Grinding",
        subcontent: []
      },
      {
        name: "Washing (LV-Oil)",
        subcontent: []
      },
      {
        name: "Final Inspection",
        subcontent: []
      },
      {
        name: "Packaging",
        subcontent: []
      }
    ]
  },
  {
    heading: "Fuel Pipe Assembly",
    subheadings: [
      {
        name: "Ring Backup",
        subcontent: []
      },
      {
        name: "Cap Insert",
        subcontent: []
      },
      {
        name: "Child Part Assembly",
        subcontent: []
      },
      {
        name: "Inj Pipe Comp Inspection",
        subcontent: []
      },
      {
        name: "Insert Inserting",
        subcontent: []
      },
      {
        name: "Stay Assembly",
        subcontent: []
      }
    ]
  },
  {
    heading: "Try Assembly",
    subheadings: [
      {
        name: "Operation",
        subcontent: []
      },
      {
        name: "Final Inspection",
        subcontent: []
      },
      {
        name: "Cabani Inspection",
        subcontent: []
      },
      {
        name: "Leak Test",
        subcontent: []
      }
    ]
  },
  {
    heading: "PI",
    subheadings: [
      {
        name: "Process 1",
        subcontent: ["5S Line Patrolling", "Basic Measuring Instrument"]
      },
      {
        name: "Process 2",
        subcontent: ["Contamination Verification", "UTM"]
      },
      {
        name: "Process 3",
        subcontent: ["Cutting Machine", "Polishing Machine"]
      },
      {
        name: "Process 4",
        subcontent: ["Roundness", "Surface", "Contour", "Profile Projector"]
      },
      {
        name: "Process 5",
        subcontent: ["VMM", "Rejection Analysis"]
      }
    ]
  }
];


// // Define a placeholder OperatorTestsViewer component
// const OperatorTestsViewer = () => {
//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md">
//       <h2 className="text-xl font-bold mb-4">Multiple Choice Questions</h2>
//       <div className="space-y-6">
//         {/* Example MCQ question */}
//         <div className="border rounded-lg p-4 bg-gray-50">
//           <p className="font-medium mb-3">1. What is the primary purpose of FIFO in production management?</p>
//           <div className="space-y-2">
//             <div className="flex items-center">
//               <input type="radio" id="q1a" name="q1" className="mr-2" />
//               <label htmlFor="q1a">To ensure products are stored efficiently</label>
//             </div>
//             <div className="flex items-center">
//               <input type="radio" id="q1b" name="q1" className="mr-2" />
//               <label htmlFor="q1b">To use oldest materials first to prevent obsolescence</label>
//             </div>
//             <div className="flex items-center">
//               <input type="radio" id="q1c" name="q1" className="mr-2" />
//               <label htmlFor="q1c">To organize products by size</label>
//             </div>
//             <div className="flex items-center">
//               <input type="radio" id="q1d" name="q1" className="mr-2" />
//               <label htmlFor="q1d">To maximize storage capacity</label>
//             </div>
//           </div>
//         </div>

//         {/* Example MCQ question */}
//         <div className="border rounded-lg p-4 bg-gray-50">
//           <p className="font-medium mb-3">2. Which of the following is NOT a part of the 5S methodology?</p>
//           <div className="space-y-2">
//             <div className="flex items-center">
//               <input type="radio" id="q2a" name="q2" className="mr-2" />
//               <label htmlFor="q2a">Sort</label>
//             </div>
//             <div className="flex items-center">
//               <input type="radio" id="q2b" name="q2" className="mr-2" />
//               <label htmlFor="q2b">Standardize</label>
//             </div>
//             <div className="flex items-center">
//               <input type="radio" id="q2c" name="q2" className="mr-2" />
//               <label htmlFor="q2c">Streamline</label>
//             </div>
//             <div className="flex items-center">
//               <input type="radio" id="q2d" name="q2" className="mr-2" />
//               <label htmlFor="q2d">Sustain</label>
//             </div>
//           </div>
//         </div>

//         {/* <div className="mt-6 flex justify-between">
//           <button className="px-4 py-2 bg-gray-200 rounded">Previous</button>
//           <div>
//             <span className="mx-4">Question 2 of 10</span>
//           </div>
//           <button className="px-4 py-2 bg-blue-500 text-white rounded">Next</button>
//         </div> */}
//       </div>
//     </div>
//   );
// };

// Helper function to parse details string into tabs
const parseDetailsToTabs = (details: string): TabData[] => {
  const alsoIncludesIndex = details.indexOf('Also includes:');
  let parts: string[] = [];

  if (alsoIncludesIndex !== -1) {
    const firstPart = details.substring(0, alsoIncludesIndex).trim();
    const secondPart = details.substring(alsoIncludesIndex + "Also includes:".length).trim();

    const firstPartItems = firstPart.split(/,\s*(?![^()]*\))/);
    const secondPartItems = secondPart.split(/,\s*(?![^()]*\))/);

    parts = [...firstPartItems, ...secondPartItems];
  } else {
    parts = details.split(/,\s*(?![^()]*\))/);
  }

  return parts.map((part, index) => {
    let cleanPart = part.trim();
    if (cleanPart.endsWith('etc.')) {
      cleanPart = cleanPart.substring(0, cleanPart.length - 4).trim();
    }
    return {
      id: `tab${index + 1}`,
      title: cleanPart,
      content: `Detailed information about ${cleanPart}`
    };
  });
};

export default function LessonDetailsPage() {
  const { id } = useParams(); // Get ID from URL path parameter
  const navigate = useNavigate();
  const location = useLocation();
  const [lessonIndex, setLessonIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>("tab1");
  const [uploadedMaterials, setUploadedMaterials] = useState<UploadedMaterial[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState<'file' | 'link'>('file');
  const [newMaterial, setNewMaterial] = useState<{
    name: string;
    position: number;
    file: File | null;
    url: string;
  }>({ name: '', position: uploadedMaterials.length + 1, file: null, url: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);


  // Update lessonIndex when the ID parameter changes
  useEffect(() => {
    console.log("URL param id:", id);
    if (id) {
      const parsedId = parseInt(id, 10);
      if (!isNaN(parsedId) && parsedId >= 0 && parsedId < lessons.length) {
        setLessonIndex(parsedId);
        setActiveTab("tab1");
      } else {
        navigate("/lesson-details/0", { replace: true });
      }
    } else {
      navigate("/lesson-details/0", { replace: true });
    }
  }, [id, navigate]);

  // const detailTabs = parseDetailsToTabs(lessons[lessonIndex].details);
  // const activeTabData = detailTabs.find(tab => tab.id === activeTab) || detailTabs[0];

  // // Check if the active tab is MCQ
  // const isMCQTab = activeTabData.title.toUpperCase() === "MCQ";

  // const onTabClick = (tabId: string) => {
  //   setActiveTab(tabId);
  // };



  const detailTabs = parseDetailsToTabs(lessons[lessonIndex].details);
  const activeTabData = detailTabs.find(tab => tab.id === activeTab) || detailTabs[0];
  const isMCQTab = activeTabData.title.toUpperCase() === "MCQ";

  const onTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMaterial.name || (uploadType === 'file' && !newMaterial.file) || (uploadType === 'link' && !newMaterial.url)) {
      alert('Please fill all required fields');
      return;
    }

    let fileType: 'video' | 'pdf' | 'ppt' | 'link' | 'other' = 'link';
    if (uploadType === 'file' && newMaterial.file) {
      const extension = newMaterial.file.name.split('.').pop()?.toLowerCase();
      if (extension === 'pdf') fileType = 'pdf';
      else if (['mp4', 'mov', 'avi'].includes(extension || '')) fileType = 'video';
      else if (['ppt', 'pptx'].includes(extension || '')) fileType = 'ppt';
      else fileType = 'other';
    }

    const material: UploadedMaterial = {
      id: Date.now().toString(),
      position: newMaterial.position,
      name: newMaterial.name,
      type: fileType,
      url: uploadType === 'link' ? newMaterial.url : URL.createObjectURL(newMaterial.file!),
      file: uploadType === 'file' ? newMaterial.file : null,
      uploadedAt: new Date()
    };

    setUploadedMaterials([...uploadedMaterials, material]);
    setNewMaterial({ name: '', position: uploadedMaterials.length + 2, file: null, url: '' });
    setShowUploadModal(false);
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setNewMaterial({ ...newMaterial, file: e.target.files[0] });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'video': return '🎬';
      case 'ppt': return '📊';
      case 'link': return '🔗';
      default: return '📁';
    }
  };

  const handleMaterialClick = (material: UploadedMaterial) => {
    if (material.type === 'link') {
      // Open web links in a new tab
      window.open(material.url, '_blank');
    } else if (material.file) {
      // For files, create a temporary URL and open it
      const fileURL = URL.createObjectURL(material.file);
      window.open(fileURL, '_blank');
      // Note: You should revoke the URL when done to avoid memory leaks
      // This would need to be handled in a cleanup function
    } else if (material.url) {
      // For files that were stored as URLs (like from previous uploads)
      window.open(material.url, '_blank');
    }
  };

  const handleDeleteMaterial = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the click event
    setUploadedMaterials(uploadedMaterials.filter(material => material.id !== id));
  };
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left sidebar */}
      <div className="w-72 bg-white shadow-md">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">{lessons[lessonIndex].title}</h2>
        </div>
        <nav className="flex flex-col p-2">
          {detailTabs.map((tab, index) => (
            <button
              key={`${lessonIndex}-${tab.id}`}
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
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">{activeTabData.title}</h1>
            <div className="text-sm text-gray-600">
              Lesson {lessonIndex + 1} of {lessons.length} | Content {activeTab.replace('tab', '')} of {detailTabs.length}
            </div>
          </div>
          {/* Render either the MCQ component or the regular content based on tab selection */}
          {isMCQTab ? (
            <OperatorTestsViewer />
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-700 mb-6">{activeTabData.content}</p>

              {/* Upload Materials Section */}
              <div className="border-t pt-6 mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-800">Training Materials</h3>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    + Upload Material
                  </button>
                </div>

                {uploadedMaterials.length > 0 ? (
                  <div className="space-y-2">
                    {uploadedMaterials
                      .sort((a, b) => a.position - b.position)
                      .map((material) => (
                        <div
                          key={material.id}
                          className="group flex items-center p-3 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleMaterialClick(material)}
                        >
                          <span className="text-gray-500 mr-3">•</span>
                          <span className="text-gray-800 hover:text-blue-600 flex-1">
                            {material.name}
                          </span>
                          <button
                            onClick={(e) => handleDeleteMaterial(material.id, e)}
                            className="invisible group-hover:visible text-red-500 hover:text-red-700 p-1"
                            title="Delete"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                    No materials uploaded yet. Click "Upload Material" to add resources.
                  </div>
                )}
              </div>
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
                      Material Name *
                    </label>
                    <input
                      type="text"
                      value={newMaterial.name}
                      onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                      className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter material name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Position Number *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newMaterial.position}
                      onChange={(e) => setNewMaterial({ ...newMaterial, position: parseInt(e.target.value) || 1 })}
                      className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
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
                        Supported formats: PDF, PPT, MP4, etc.
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
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Upload Material
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}