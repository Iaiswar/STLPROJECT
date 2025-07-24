import React from "react";
import { FaPlay } from "react-icons/fa";

interface VideoItem {
  name: string;
  videoId: string;
}

const DojoVideoResources: React.FC = () => {
  const videos: VideoItem[] = [
    { name: "Safety Demonstration", videoId: "1Cu_QiVW9mM" },
    { name: "Machine Operation", videoId: "MyAzjhXRWUQ" },
    { name: "Advanced Techniques", videoId: "03KeLl9h1F8" },
    { name: "Maintenance Guide", videoId: "VCEqZ9hMXPk" },
  
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col  h-[270px]"> {/* Fixed height container */}
      <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Video Resources</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto pr-2  [scrollbar-width:none] [-ms-overflow-style:none]"> {/* Scrollable content */}
        {videos.map((video, index) => (
          <YouTubeVideoCard key={index} videoId={video.videoId} title={video.name} />
        ))}
      </div>
    </div>
  );
};

interface YouTubeVideoCardProps {
  videoId: string;
  title: string;
}

const YouTubeVideoCard: React.FC<YouTubeVideoCardProps> = ({ videoId, title }) => {
  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div 
      className="cursor-pointer transition-transform hover:-translate-y-1"
      onClick={() => window.open(youtubeUrl, "_blank")}
    >
      <div className="relative aspect-video overflow-hidden rounded-lg">
        <img 
          src={thumbnailUrl} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center transition-opacity hover:bg-opacity-50">
          <FaPlay className="text-white text-xl opacity-80 hover:opacity-100" />
        </div>
      </div>
      <h3 className="mt-2 text-sm font-medium text-gray-800 text-center line-clamp-2">
        {title}
      </h3>
    </div>
  );
};

export default DojoVideoResources;