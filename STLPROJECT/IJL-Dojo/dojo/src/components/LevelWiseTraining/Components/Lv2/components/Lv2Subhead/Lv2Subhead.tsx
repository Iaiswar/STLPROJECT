import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../../../../Navbar/Navbar';

interface Subtopic {
  id: number;
  title: string;
}

interface Topic {
  id: number;
  title: string;
  leveltwo_subtopics: Subtopic[];
}

const accentColors = [
  'border-green-400',
  'border-pink-400',
  'border-violet-400',
  'border-orange-400',
  'border-yellow-400',
  'border-cyan-400',
];

const Lv2Subhead: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const [topic, setTopic] = useState<Topic | null>(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/level2-topics/')
      .then((res) => {
        const found = res.data.find((t: Topic) => t.id === Number(topicId));
        setTopic(found || null);
      })
      .catch((err) => {
        console.error('Error fetching topic:', err);
      });
  }, [topicId]);

  if (!topic) return <div className="p-4 text-red-600">Topic not found</div>;

  return (
    <>
      <Navbar heading={topic.title} />
      <div className="p-4">
        {topic.leveltwo_subtopics.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {topic.leveltwo_subtopics.map((sub, index) => (
              <div
                key={sub.id}
                className={`p-6 w-full h-[100px] sm:w-auto rounded-md shadow-sm bg-white cursor-pointer ${accentColors[index % accentColors.length]}`}
                style={{ borderLeftWidth: '6px' }}
                onClick={() => navigate(`/lvl2/units/subtopic/${sub.id}`)}

              >
                <h3 className="text-base font-bold text-gray-900">{sub.title}</h3>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No subtopics found for this topic.</p>
        )}
      </div>
    </>
  );
};

export default Lv2Subhead;
