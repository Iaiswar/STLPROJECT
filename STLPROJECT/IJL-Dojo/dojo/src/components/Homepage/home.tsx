import React from 'react';
import Tile from './Tile';
import { tiles } from './tileData';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pb-6">
        {/* Header Section */}
        <div className="bg-[#001740] text-white text-center py-4 md:py-6 px-4 mb-6">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-2">
            Digital Operations Excellence
          </h1>
          <h3 className="text-sm md:text-md font-semibold italic">
            Empowering Industrial Excellence Through Digital Transformation
          </h3>
        </div>

        {/* Tiles Section - always 2 columns for links */}
        <div className="px-4 sm:px-6 lg:px-8 xl:px-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 w-full max-w-[1800px] mx-auto">
            {tiles.map(tile => (
              <Tile
                key={tile.title}
                title={tile.title}
                links={tile.links}
                icon={tile.icon}
                iconBgColor={tile.iconBgColor}
                iconColor={tile.iconColor}
                statusText={tile.statusText}  
                borderTopColor={tile.borderTopColor}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;