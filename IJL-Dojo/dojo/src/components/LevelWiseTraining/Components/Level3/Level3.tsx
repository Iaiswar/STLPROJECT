

// import React, { useEffect, useState, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const accentColors = [
//   'border-green-400',
//   'border-pink-400',
//   'border-violet-400',
//   'border-orange-400',
//   'border-yellow-400',
//   'border-cyan-400',
// ];

// interface Section {
//   id: number;
//   title: string;
//   skill_training: number;
// }

// interface Topic {
//   id: number;
//   title: string;
//   section: number;
//   leveltwo_subtopics: any[]; // Add this based on your data structure
//   leveltwo_units: any[];     // Add this based on your data structure
// }

// // add cheyu ivadam
// const paperIdMap: Record<string, number> = {
//   'Push on Fix': 35,
//   'Reflector Assy/Pre-aiming/De-static':36,
//   'LED Checking /Glue dispense / Lens with EXT Screw / De Static/Lens pressing':37,
//   'Screwing':38,
//   'Leak & Light':39,
//   'PES UNIT':40,
//   'PCB Bracket Assy.':41,
//   'Body Assy.':42,
//   'Glue Dispensing & Photometric':43,
//   'Ref. PCB Assy.':44,
//   'Stud Bolt/Body Assy./Ultrasonic Welding/LED Checking':45,
//   'Hot Plate Welding & Annealing':46,
//   'Bezel Assy./Cord or bulb Assy./Filter cap Assy./Leak & Light testing':47,
//   'Lens Holder Assy & Light testing':48,
//   'Ref. Assy.':49,
//   'Grease dispensing & Impulse welding':50,
//   'DRL Sub Assy.':51,
//   'Laser Welding':52,
//   'Final Inspection':53,
//   'Gauge Measurements':54,
//   'BMC Operation' : 55,
//   'PC Lens Operation' :56,
//   'Extension Operation':57,
//   'RCL Lens Operation':58,
//   'Deflashing (BMC)':59,
//   'Spray Lacquering & Spray Painting Operation':60,
//   'Input Wipping & De -Static Operation':61,
//   'Aluminising Operation':62,
//   'Output Quality Checking':63,
//   'IFM':64,
//   'PDI':65,
//   'BULB OR CORD ASSY':66,
//   'SPD':67,

// };

// const Level3: React.FC = () => {
//   const navigate = useNavigate();
//   const [sections, setSections] = useState<Section[]>([]);
//   const [topics, setTopics] = useState<Topic[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [activeTab, setActiveTab] = useState(0);

//   // Predefined gradients for consistent styling
//   const gradients = useMemo(() => [
//     'linear-gradient(90deg, #9c27b0, #673ab7)',
//     'linear-gradient(90deg, #03a9f4, #00bcd4)',
//     'linear-gradient(90deg, #4caf50, #8bc34a)',
//     'linear-gradient(90deg, #ff9800, #f44336)',
//     'linear-gradient(90deg, #1976d2, #303f9f)',
//     'linear-gradient(90deg, #f44336, #e91e63)'
//   ], []);

//   // Get gradient style for a card
//   const getGradientStyle = (index: number) => {
//     return gradients[index % gradients.length];
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const [sectionsResponse, topicsResponse] = await Promise.all([
//           axios.get('http://127.0.0.1:8000/level2-sections/'),
//           axios.get('http://127.0.0.1:8000/level2-topics/'),
//         ]);
//         setSections(sectionsResponse.data);
//         setTopics(topicsResponse.data);
//         setLoading(false);
//       } catch (err) {
//         console.error('Error fetching data:', err);
//         setError('Failed to load data');
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   useEffect(() => {
//     axios.get('http://127.0.0.1:8000/level2-units/').then(response => {
//       console.log(response);
//     });
//   }, []);

//   if (loading) {
//     return <div className="p-4">Loading...</div>;
//   }

//   if (error) {
//     return <div className="p-4 text-red-500">{error}</div>;
//   }

//   if (sections.length === 0) {
//     return <div className="p-4">No sections available</div>;
//   }

//   // Get topics for the currently active tab/section
//   const currentSectionId = sections[activeTab]?.id;
//   const currentTopics = topics.filter(topic => topic.section === currentSectionId);

//   // SINGLE handleTopicClick function (no nesting)
//   const handleTopicClick = (topic: Topic) => {
//     const currentSection = sections[activeTab];

//     const questionPaperId = paperIdMap[topic.title] ?? null;

//     console.log('Selected topic:', topic);
//     console.log('Current section:', currentSection);
//     console.log('Mapped questionPaperId:', questionPaperId);

//     // navigate('/TrainingOptionsPage', {
//     //   state: {
//     //     lineId: topic.id,
//     //     lineName: topic.title,
//     //     sectionTitle: currentSection?.title,
//     //     prevpage: 'lvl2',
//     //     questionPaperId,
//     //   },
//     // });
//     navigate('/Level3TrainingOptionsPage', {
//       state: {
//         lineId: topic.id,
//         lineName: topic.title,
//         sectionTitle: currentSection?.title, // or just the title
//         prevpage: 'Level 3',
//         questionPaperId,
//       }
//     });
//   };

//   return (
//     <div className="p-4 scrollbar-hide">
//       <div className="border-b border-gray-200">
//         <nav className="-mb-px flex space-x-8 overflow-x-auto">
//           {sections.map((section, index) => (
//             <button
//               key={section.id}
//               onClick={() => setActiveTab(index)}
//               className={`flex-1 whitespace-nowrap py-4 px-4 border-b-2 font-bold text-xl text-center ${
//                 activeTab === index
//                   ? 'border-[#1c2a4d] text-[#1c2a4d]'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//               }`}
//             >
//               {section.title}
//             </button>
//           ))}
//         </nav>
//       </div>

//       <div className="mt-6">
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//           {currentTopics.length > 0 ? (
//             currentTopics.map((topic, index) => {
//               const gradientStyle = getGradientStyle(index);
              
//               return (
//                 <div
//                   key={topic.id}
//                   className={`
//                     p-6 w-full h-[100px] sm:w-auto rounded-md shadow-sm bg-white 
//                     cursor-pointer transition-all duration-300 hover:shadow-lg
//                     relative overflow-hidden group
//                   `}
//                 >
//                   {/* Gradient left border */}
//                   <div 
//                     className="absolute top-0 left-0 w-[6px] h-full rounded-l-md"
//                     style={{ background: gradientStyle }}
//                   ></div>
                  
//                   <div
//                     onClick={() => handleTopicClick(topic)}
//                     className="h-full flex flex-col z-10 relative"
//                   >
//                     <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-white transition-colors duration-300">
//                       {topic.title}
//                     </h3>
//                     <div className="mt-auto text-xs text-gray-500 group-hover:text-white transition-colors duration-300">
//                       {topic.leveltwo_subtopics?.length > 0 && (
//                         <span>{topic.leveltwo_subtopics.length} subtopics</span>
//                       )}
//                       {topic.leveltwo_subtopics?.length === 0 && topic.leveltwo_units?.length > 0 && (
//                         <span>{topic.leveltwo_units.length} units</span>
//                       )}
//                     </div>
//                   </div>
                  
//                   <div 
//                     className="absolute inset-0 w-0 group-hover:w-full transition-all duration-500 ease-out z-0 opacity-0 group-hover:opacity-100"
//                     style={{ background: gradientStyle }}
//                   ></div>
//                 </div>
//               );
//             })
//           ) : (
//             <div className="col-span-full text-center py-8 text-gray-500">No topics available for this section</div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Level3;



import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const accentColors = [
  'border-green-400',
  'border-pink-400',
  'border-violet-400',
  'border-orange-400',
  'border-yellow-400',
  'border-cyan-400',
];

interface Section {
  id: number;
  title: string;
  skill_training: number;
}

interface Topic {
  id: number;
  title: string;
  section: number;
  leveltwo_subtopics: any[]; // Add this based on your data structure
  leveltwo_units: any[];     // Add this based on your data structure
}

// add cheyu ivadam
const paperIdMap: Record<string, number> = {
  'Push on Fix': 35,
  'Reflector Assy/Pre-aiming/De-static':36,
  'LED Checking /Glue dispense / Lens with EXT Screw / De Static/Lens pressing':37,
  'Screwing':38,
  'Leak & Light':39,
  'PES UNIT':40,
  'PCB Bracket Assy.':41,
  'Body Assy.':42,
  'Glue Dispensing & Photometric':43,
  'Ref. PCB Assy.':44,
  'Stud Bolt/Body Assy./Ultrasonic Welding/LED Checking':45,
  'Hot Plate Welding & Annealing':46,
  'Bezel Assy./Cord or bulb Assy./Filter cap Assy./Leak & Light testing':47,
  'Lens Holder Assy & Light testing':48,
  'Ref. Assy.':49,
  'Grease dispensing & Impulse welding':50,
  'DRL Sub Assy.':51,
  'Laser Welding.':52,
  'Final Inspection':53,
  'Gauge Measurements':54,
  'BMC Operation' : 55,
  'PC Lens Operation' :56,
  'Extension Operation':57,
  'RCL Lens Operation':58,
  'Deflashing (BMC)':59,
  'Spray Lacquering & Spray Painting Operation':60,
  'Input Wipping & De -Static Operation':61,
  'Aluminising Operation':62,
  'Output Quality Checking':63,
  'IFM':64,
  'PDI':65,
  'BULB OR CORD ASSY':66,
  'SPD':67,

};

const skillIdMap: Record<string, number> = {
  'Push on Fix': 2,
  'Reflector Assy/Pre-aiming/De-static':3,
  'LED Checking /Glue dispense / Lens with EXT Screw / De Static/Lens pressing':4,
  'Screwing':5,
  'Leak & Light':6,
  'PES UNIT':7,
  'PCB Bracket Assy.':8,
  'Body Assy.':9,
  'Glue Dispensing & Photometric':10,
  'Ref. PCB Assy.':11,
  'Stud Bolt/Body Assy./Ultrasonic Welding/LED Checking':12,
  'Hot Plate Welding & Annealing':13,
  'Bezel Assy./Cord or bulb Assy./Filter cap Assy./Leak & Light testing':14,
  'Lens Holder Assy & Light testing':15,
  'Ref. Assy.':16,
  'Grease dispensing & Impulse welding':17,
  'DRL Sub Assy.':18,
  'Laser Welding':19,
  'Final Inspection':20,
  'Gauge Measurements':21,
  'BMC Operation' : 22,
  'PC Lens Operation' :23,
  'Extension Operation':24,
  'RCL Lens Operation':25,
  'Deflashing (BMC)':26,
  'Spray Lacquering & Spray Painting Operation':27,
  'Input Wipping & De -Static Operation':28,
  'Aluminising Operation':29,
  'Output Quality Checking':30,
  'IFM':31,
  'PDI':32,
  'BULB OR CORD ASSY':33,
  'SPD':34
};

const Level3: React.FC = () => {
  const navigate = useNavigate();
  const [sections, setSections] = useState<Section[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  // Predefined gradients for consistent styling
  const gradients = useMemo(() => [
    'linear-gradient(90deg, #9c27b0, #673ab7)',
    'linear-gradient(90deg, #03a9f4, #00bcd4)',
    'linear-gradient(90deg, #4caf50, #8bc34a)',
    'linear-gradient(90deg, #ff9800, #f44336)',
    'linear-gradient(90deg, #1976d2, #303f9f)',
    'linear-gradient(90deg, #f44336, #e91e63)'
  ], []);

  // Get gradient style for a card
  const getGradientStyle = (index: number) => {
    return gradients[index % gradients.length];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [sectionsResponse, topicsResponse] = await Promise.all([
          axios.get('http://127.0.0.1:8000/level2-sections/'),
          axios.get('http://127.0.0.1:8000/level2-topics/'),
        ]);
        setSections(sectionsResponse.data);
        setTopics(topicsResponse.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/level2-units/').then(response => {
      console.log(response);
    });
  }, []);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (sections.length === 0) {
    return <div className="p-4">No sections available</div>;
  }

  // Get topics for the currently active tab/section
  const currentSectionId = sections[activeTab]?.id;
  const currentTopics = topics.filter(topic => topic.section === currentSectionId);

  // SINGLE handleTopicClick function (no nesting)
  const handleTopicClick = async (topic: Topic) => {
    const currentSection = sections[activeTab];

    const questionPaperId = paperIdMap[topic.title] ?? null;

    // Dynamically find skill ID from backend based on topic name
    let skillId = null;
    try {
      const response = await fetch('http://127.0.0.1:8000/api/skills/');
      const skills = await response.json();
      const matchingSkill = skills.find((skill: any) => skill.skill === topic.title);
      skillId = matchingSkill ? matchingSkill.id : null;
    } catch (error) {
      console.error('Failed to fetch skills:', error);
      // Fallback to hardcoded map if API fails
      skillId = skillIdMap[topic.title] ?? null;
    }

    console.log('Selected topic:', topic);
    console.log('Current section:', currentSection);
    console.log('Mapped questionPaperId:', questionPaperId);
    console.log('Dynamic skillId:', skillId);

    navigate('/Level3TrainingOptionsPage', {
      state: {
        lineId: topic.id,
        lineName: topic.title,
        sectionTitle: currentSection?.title,
        prevpage: 'Level 3',
        questionPaperId,
        skillId,
        skillName: topic.title, // Pass the actual topic name as skill name
      }
    });
  };

  return (
    <div className="p-4 scrollbar-hide">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {sections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => setActiveTab(index)}
              className={`flex-1 whitespace-nowrap py-4 px-4 border-b-2 font-bold text-xl text-center ${
                activeTab === index
                  ? 'border-[#1c2a4d] text-[#1c2a4d]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {section.title}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentTopics.length > 0 ? (
            currentTopics.map((topic, index) => {
              const gradientStyle = getGradientStyle(index);
              
              return (
                <div
                  key={topic.id}
                  className={`
                    p-6 w-full h-[100px] sm:w-auto rounded-md shadow-sm bg-white 
                    cursor-pointer transition-all duration-300 hover:shadow-lg
                    relative overflow-hidden group
                  `}
                >
                  {/* Gradient left border */}
                  <div 
                    className="absolute top-0 left-0 w-[6px] h-full rounded-l-md"
                    style={{ background: gradientStyle }}
                  ></div>
                  
                  <div
                    onClick={() => handleTopicClick(topic)}
                    className="h-full flex flex-col z-10 relative"
                  >
                    <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-white transition-colors duration-300">
                      {topic.title}
                    </h3>
                    <div className="mt-auto text-xs text-gray-500 group-hover:text-white transition-colors duration-300">
                      {topic.leveltwo_subtopics?.length > 0 && (
                        <span>{topic.leveltwo_subtopics.length} subtopics</span>
                      )}
                      {topic.leveltwo_subtopics?.length === 0 && topic.leveltwo_units?.length > 0 && (
                        <span>{topic.leveltwo_units.length} units</span>
                      )}
                    </div>
                  </div>
                  
                  <div 
                    className="absolute inset-0 w-0 group-hover:w-full transition-all duration-500 ease-out z-0 opacity-0 group-hover:opacity-100"
                    style={{ background: gradientStyle }}
                  ></div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">No topics available for this section</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Level3;