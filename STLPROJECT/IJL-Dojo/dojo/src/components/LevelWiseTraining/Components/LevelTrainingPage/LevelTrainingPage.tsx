import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../../Navbar/Navbar';

interface Lesson {
    level: number;
    title: string;
    date: string;
    description: string;
    details: string;
}

interface Level {
    name: string;
    subheading: string;
}

interface DayData {
    day: string;
    lessons: Lesson[];
}

interface GroupedLessons {
    [key: string]: DayData;
}

const allLessons = [
  // Level 1 Lessons
  {
    level: 1,
    title: 'GENERAL INFORMATION TRAINING' ,
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

const levels: Level[] = [
    {
        name: 'Level 1',
        subheading: 'Basic Training DOJO',
    },
    {
        name: 'Level 2',
        subheading: 'Working Procedure Knowledge as per Production and Quality Parameters',
    },
    {
        name: 'Level 3',
        subheading: 'On the Job Training and Effective Confirmation',
    },
    {
        name: 'Level 4',
        subheading: 'Mastery & Leadership',
    },
    {
        name: 'Cross-Functional Training',
        subheading: 'Multi skilling',
    },
    {
        name: 'Specialized Training',
        subheading: 'Personal Obervent Sheet',
    }
];

const groupLessonsByDay = (lessonsToGroup: Lesson[]): GroupedLessons => {
    const grouped: GroupedLessons = {};
    lessonsToGroup.forEach(lesson => {
        const day = lesson.date;
        if (!grouped[day]) {
            grouped[day] = {
                day: day,
                lessons: []
            };
        }
        grouped[day].lessons.push(lesson);
    });
    return grouped;
};

const LevelTrainingPage = () => {
    const { level } = useParams<{ level: string }>();
    const navigate = useNavigate();
        const newLevel = level === "Level 2" ? 2 : 1;
    // Parse level from URL or default to 1
    // const currentLevelNumber = parseInt(level || '1', 10);
    
    // Find the level details from the levels array
    const currentLevel = levels.find(l => l.name.includes(newLevel.toString())) || 
                        levels[0]; // Fallback to Level 1 if not found
    
    // Filter lessons for the current level, fallback to level 1 if none found
    const levelLessons = allLessons.filter(l => l.level === newLevel);
    const lessonsToDisplay = levelLessons.length > 0 ? levelLessons : 
                           allLessons.filter(l => l.level === 1);
    
    const groupedLessons = groupLessonsByDay(lessonsToDisplay);

    const handleLessonClick = (lessonIndex: number) => {
        navigate(`/lesson-details/${lessonIndex}`);
    };

    return (
        <div>
            <Navbar heading={`${currentLevel.name} Training Details`} />
            <div className="max-w-6xl mx-auto px-4 py-6">
                <div className="mb-8">
                    {/* <h1 className="text-2xl font-bold text-[#1c2a4d]">{currentLevel.name}</h1> */}
                    <h2 className="text-2xl font-bold text-[#1c2a4d]">{currentLevel.subheading}</h2>
                </div>

                <div className="space-y-6">
                    {Object.keys(groupedLessons).sort().map((dayKey) => {
                        const dayData = groupedLessons[dayKey];
                        return (
                            <div key={dayKey} className="bg-white rounded-lg p-6 flex gap-8">
                                <div className="w-1/4">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-[#1c2a4d]">{dayKey}</p>
                                    </div>
                                </div>

                                <div className="flex-1 space-y-4">
                                    {dayData.lessons.map((lesson: Lesson, index: number) => {
                                        const globalIndex = allLessons.findIndex(l => 
                                            l.level === lesson.level && 
                                            l.title === lesson.title && 
                                            l.date === lesson.date
                                        );
                                        
                                        return (
                                            <div 
                                                key={`${dayKey}-${index}`} 
                                                className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                                onClick={() => handleLessonClick(globalIndex)}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <p className="font-semibold text-[#1c2a4d] hover:text-blue-600">
                                                            {lesson.title}
                                                        </p>
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            {lesson.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default LevelTrainingPage;