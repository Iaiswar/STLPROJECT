import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Station {
  id: number;
  skill: string;
  station_number: number;
  minimum_skill_required: string;
  min_operator_required: number;
}

interface Level {
  id: number;
  name: string;
  name_display: string;
}

const SkillNavigationDemo: React.FC = () => {
  const navigate = useNavigate();
  const [stations, setStations] = useState<Station[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stationsRes, levelsRes] = await Promise.all([
          fetch('http://127.0.0.1:8000/api/skills'),
          fetch('http://127.0.0.1:8000/levels/')
        ]);

        const stationsData = await stationsRes.json();
        const levelsData = await levelsRes.json();

        setStations(stationsData);
        setLevels(levelsData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSkillClick = (station: Station, level: Level) => {
    // Navigate to assign employees with pre-filled skill and level
    navigate('/assign-remote', {
      state: {
        skillId: station.id,
        levelId: level.id,
        skillName: station.skill,
        levelName: level.name_display,
        fromNavigation: true,
        questionPaperId: 1 // You can make this dynamic based on your needs
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Dynamic Skill Assignment Demo
      </h1>
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          How it works:
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>Click on any skill + level combination below</li>
          <li>You'll be navigated to the assign employees page</li>
          <li>The skill and level will be pre-filled and uneditable</li>
          <li>After completing the quiz, skill matrix will be automatically updated</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stations.map((station) => (
          <div key={station.id} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {station.skill}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Station {station.station_number} | Min Required: {station.minimum_skill_required}
            </p>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Select Level:</h4>
              {levels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => handleSkillClick(station, level)}
                  className="w-full px-4 py-2 text-left bg-blue-50 hover:bg-blue-100 
                           border border-blue-200 rounded-md transition-colors
                           text-blue-800 font-medium"
                >
                  {level.name_display}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">
          Example: Push on Fix Navigation
        </h3>
        <p className="text-yellow-700">
          When you click "Push on Fix" + "Level 2", it will navigate to assign employees 
          with skill="Push on Fix" and level="Level 2" pre-filled and uneditable, 
          just like the tencycle navigation pattern you requested.
        </p>
      </div>
    </div>
  );
};

export default SkillNavigationDemo;
