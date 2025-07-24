import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface Lesson {
    id: number;
    content: string;
    topic: number;
    subtopic: number | null;
    day: number;
    subunits: any[];
}

interface DayData {
    day: string;
    lessons: Lesson[];
}

interface GroupedLessons {
    [key: string]: DayData;
}

const Level2Content = () => {
    const { id, text } = useParams<{ id?: string; text?: string }>();
    const navigate = useNavigate();

    // Handle parameters with validation
    const paramId = id && !isNaN(Number(id)) ? parseInt(id, 10) : 1;
    const paramText = (text === 'topic' || text === 'subtopic') ? text : 'topic';

    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [levelName, setLevelName] = useState('Training Details');

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                let apiUrl = '';

                if (paramText === 'topic') {
                    apiUrl = `http://127.0.0.1:8000/level2-units/topic/${paramId}/`;
                } else if (paramText === 'subtopic') {
                    apiUrl = `http://127.0.0.1:8000/units/by-subtopic/${paramId}/`;
                }

                const response = await fetch(apiUrl);
                if (!response.ok) throw new Error('Network response was not ok');

                const jsonData: Lesson[] = await response.json();
                console.log('API response:', jsonData);

                const filtered = jsonData;

                console.log('Filtered data:', {
                    paramId,
                    paramText,
                    filteredCount: filtered.length,
                    filtered
                });

                const titleText = filtered.length > 0 ?
                    filtered[0].content :
                    `${paramText} ${paramId}`;
                setLevelName(`${titleText} Training Details`);

                setLessons(filtered);
                setLoading(false);
            } catch (err) {
                console.error('Fetch error:', err);
                setError('Failed to load lessons');
                setLoading(false);
            }
        };

        fetchLessons();
    }, [paramId, paramText]);

    const groupLessonsByDay = (lessonsToGroup: Lesson[]): GroupedLessons => {
        const grouped: GroupedLessons = {};
        lessonsToGroup.forEach(lesson => {
            const day = ` ${lesson.day}`;
            if (!grouped[day]) {
                grouped[day] = { day, lessons: [] };
            }
            grouped[day].lessons.push(lesson);
        });
        return grouped;
    };

    const handleLessonClick = (lessonId: number, content: string) => {
        if (content.toLowerCase() === '10 cycle') {
            navigate('/TenCycle'); // Navigate to home
        } else {
            navigate(`/level2/${lessonId}`);
        }
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-6">
                <div className="flex justify-center items-center h-64">
                    <p>Loading lessons...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-6">
                <div className="flex justify-center items-center h-64">
                    <p className="text-red-500">{error}</p>
                </div>
            </div>
        );
    }

    const groupedLessons = groupLessonsByDay(lessons);

    return (
        <div className="max-w-6xl mx-auto px-4 py-6">
            <h2 className="text-2xl font-bold mb-4 text-[#1c2a4d]">Working Procedure Knowledge as per Production and Quality Parameters</h2>

            {lessons.length === 0 && (
                <p className="text-center text-gray-500">
                    No lessons available for this {paramText}.
                </p>
            )}

            <div className="space-y-6">
                {Object.keys(groupedLessons)
                    .sort((a, b) => {
                        const dayA = parseInt(a.replace(/\D/g, ''), 10);
                        const dayB = parseInt(b.replace(/\D/g, ''), 10);
                        return dayA - dayB;
                    })
                    .map(dayKey => {
                        const dayData = groupedLessons[dayKey];
                        return (
                            <div key={dayKey} className="bg-white rounded-lg p-6 flex gap-8">
                                <div className="w-1/4 text-center">
                                    <p className="text-2xl font-bold text-[#1c2a4d]">{dayKey}</p>
                                </div>
                                <div className="flex-1 space-y-4">
                                    {dayData.lessons.map(lesson => (
                                        <div
                                            key={lesson.id}
                                            className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                            onClick={() => handleLessonClick(lesson.id, lesson.content)}
                                        >
                                            <p
                                                className={`font-semibold 
                                                ${lesson.content.toLowerCase() === '10 cycle' ? 'text-blue-600' : 'text-[#1c2a4d]'} 
                                                hover:text-blue-600`
                                                }
                                            >
                                                {lesson.content}
                                            </p>
                                        </div>

                                    ))}
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default Level2Content;