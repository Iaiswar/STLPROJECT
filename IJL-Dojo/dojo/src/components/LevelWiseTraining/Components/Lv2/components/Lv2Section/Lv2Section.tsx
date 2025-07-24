import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { processData } from '../../Processdata';
import Navbar from '../../../../../Navbar/Navbar';


const Lv2Section: React.FC = () => {
  const { sectionId } = useParams<{ sectionId: string }>();
  const navigate = useNavigate();
  const section = processData[Number(sectionId)];

  if (!section) return <div>Section not found</div>;

  return (
    <>
      <Navbar heading={section.heading} />

      <div className="p-4">
        {/* <button 
        onClick={() => navigate(-1)} 
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        ← Back
      </button> */}
        {/* <h1 className="text-2xl font-bold mb-6"></h1> */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {section.subheadings.map((subheading, index) => (
            <div
              key={index}
              className="relative overflow-hidden border border-gray-200 rounded-lg cursor-pointer group shadow-md hover:shadow-lg transition-all duration-300 h-[220px] flex flex-col"
              onClick={async () => {
                if (subheading.subcontent && subheading.subcontent.length > 0) {
                  navigate(`/lvl2/section/${sectionId}/subheading/${index}`);
                } else {
                  // Handle direct evaluation test navigation with dynamic skill lookup
                  const topicName = subheading.name;

                  // Dynamically find skill ID from backend based on topic name
                  let skillId = null;
                  try {
                    const response = await fetch('http://127.0.0.1:8000/api/skills/');
                    const skills = await response.json();
                    const matchingSkill = skills.find((skill: any) => skill.skill === topicName);
                    skillId = matchingSkill ? matchingSkill.id : null;
                  } catch (error) {
                    console.error('Failed to fetch skills:', error);
                  }

                  console.log('Selected topic:', topicName);
                  console.log('Dynamic skillId:', skillId);

                  navigate('/TrainingOptionsPage', {
                    state: {
                      lineId: index,
                      lineName: topicName,
                      sectionTitle: section.heading,
                      prevpage: 'lvl2',
                      questionPaperId: null, // You may want to add question paper mapping
                      skillId,
                      skillName: topicName, // Pass the actual topic name as skill name
                    },
                  });
                }
              }}

            >
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold text-[#1c2a4d] mb-1 group-hover:text-white transition-colors duration-300 z-10">
                  {subheading.name}
                </h3>
                {subheading.subcontent.length > 0 && (
                  <p className="text-gray-600 text-sm flex-1 group-hover:text-white transition-colors duration-300 z-10">
                    {subheading.subcontent.length} steps available
                  </p>
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 w-0 group-hover:w-full transition-all duration-500 ease-out z-0"></div>
            </div>
          ))}
        </div>
      </div></>
  );
};

export default Lv2Section;