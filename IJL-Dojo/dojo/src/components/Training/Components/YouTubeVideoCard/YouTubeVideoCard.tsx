import React from "react";
import { FaPlay } from "react-icons/fa";

interface YouTubeVideoCardProps {
  videoId: string;
  title: string;
}

const YouTubeVideoCard: React.FC<YouTubeVideoCardProps> = ({ videoId, title }) => {
  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div
      className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md min-w-[250px] text-center cursor-pointer"
      onClick={() => window.open(youtubeUrl, "_blank")}
    >
      <div className="relative">
        <img src={thumbnailUrl} alt={title} className="w-full rounded-lg" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-60 rounded-full p-3">
          <FaPlay className="text-white text-2xl" />
        </div>
      </div>
      <h3 className="mt-2 text-lg font-bold text-[#16163e]">{title}</h3>
    </div>
  );
};

interface YouTubeVideoListProps {
  header: string;
  videos: { videoId: string; title: string }[];
}

const YouTubeVideoList: React.FC<YouTubeVideoListProps> = ({ header, videos }) => {
  return (
    <div className="flex flex-col p-2 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-[#16163e] p-3">{header}</h2>
      <div className="flex flex-col space-y-4 max-h-[250px] overflow-y-auto pr-3 scroll-smooth">
        {videos.map((video, index) => (
          <YouTubeVideoCard key={index} videoId={video.videoId} title={video.title} />
        ))}
      </div>
    </div>
  );
};

export default YouTubeVideoList;
