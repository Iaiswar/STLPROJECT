import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../HomeNav/nav';

interface Level {
  name: string;
  subheading: string;
  route?: string;
}

const LevelWiseTraining: React.FC = () => {
  const navigate = useNavigate();

  // Define levels with their routes in a single configuration
  const levels = useMemo<Level[]>(() => [
    {
      name: 'Level 0',
      subheading: '',
      route: '/Level0'
    },
    {
      name: 'Level 1',
      subheading: 'Basic Training DOJO',
      route: '/Level1'
    },
    {
      name: 'Level 2',
      subheading: '',
      route: '/lvl2'
    },
    {
      name: 'Level 3',
      subheading: '',
      route: '/Level3'
    },
    {
      name: 'Level 4',
      subheading: '',
      route: '/Level4'
    },
    {
      name: 'Multi skilling',
      subheading: '',
      route: '/allocation'
    },
    {
      name: 'Refresher Training',
      subheading: '',
      route: '/refreshment'
    },
    {
      name: 'HANCHOU',
      subheading: '',
      route: '/Hanchou'
    },
    {
      name: 'SHOKU CHOU',
      subheading: '',
      route: '/Shokuchou'
    },
 
  ], []);

  // Predefined gradients for consistent styling
  const gradients = useMemo(() => [
    'linear-gradient(90deg, #9c27b0, #673ab7)',
    'linear-gradient(90deg, #03a9f4, #00bcd4)',
    'linear-gradient(90deg, #4caf50, #8bc34a)',
    'linear-gradient(90deg, #ff9800, #f44336)',
    'linear-gradient(90deg, #1976d2, #303f9f)',
    'linear-gradient(90deg, #f44336, #e91e63)'
  ], []);

  // Simplified click handler using the predefined routes
  const handleClick = (level: Level) => {
    if (level.route) {
      navigate(level.route);
    } else {
      navigate(`/level-training/${level.name}`);
    }
  };

  // Get gradient style for a card
  const getGradientStyle = (index: number) => {
    return gradients[index % gradients.length];
  };

  return (
    <div>
      <Nav />
      <div className="mx-auto px-4 py-8 pt-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {levels.map((level, index) => {
            const gradientStyle = getGradientStyle(index);
            
            return (
              <div
                key={`${level.name}-${index}`}
                onClick={() => handleClick(level)}
                className={`
                  bg-white border border-gray-200 rounded-lg cursor-pointer 
                  shadow-md hover:shadow-lg transition-all duration-300 
                  h-[220px] w-full flex flex-col
                  relative overflow-hidden
                  group
                `}
              >
                <div 
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ background: gradientStyle }}
                ></div>
                
                <div className="p-5 flex-1 flex flex-col">
                  {level.subheading && (
                    <h3 className="text-2xl font-bold text-[#1c2a4d] mb-1 group-hover:text-white transition-colors duration-300 z-10">
                      {level.subheading}
                    </h3>
                  )}
                  <h3 className="text-2xl font-bold text-gray-600 group-hover:text-white transition-colors duration-300 z-10">
                    {level.name}
                  </h3>
                </div>
                
                <div 
                  className="absolute inset-0 w-0 group-hover:w-full transition-all duration-500 ease-out z-0 opacity-0 group-hover:opacity-100"
                  style={{ background: gradientStyle }}
                ></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LevelWiseTraining;