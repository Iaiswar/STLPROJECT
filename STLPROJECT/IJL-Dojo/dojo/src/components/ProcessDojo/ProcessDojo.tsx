import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';

const ProcessDojo: React.FC = () => {
    const navigate = useNavigate();
    const [dojoNames, setDojoNames] = useState([
        'Induction',
        'Safety Dojo',
        'Refreshment Training',
        'Skill Upgradation',
        'Welding',
        'Buffing',
        'Drilling',
        'Milling',
        'Grinding',
        'Painting',
        'Turning',
        'Boring',
        'Broaching',
        'Taping',
        'Shaping',
        'Add more'
    ]);
    const [newDojoName, setNewDojoName] = useState('');

    const handleClick = (name: string) => {
        if (name === 'Add more') {
            return; // Don't navigate for "Add more"
        }
        const encodedName = encodeURIComponent(name);
        navigate(`/dojo/${encodedName}`);
    };

    const handleAddMore = () => {
        const newName = prompt('Enter new dojo name:');
        if (newName && newName.trim() !== '') {
            // Insert before "Add more"
            const newNames = [...dojoNames];
            newNames.splice(dojoNames.length - 1, 0, newName.trim());
            setDojoNames(newNames);
        }
    };

    return (
        <div className="">
            <Navbar heading='Process Dojo Module' />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 p-4 gap-4 w-full mx-auto">
                {dojoNames.map((name, index) => (
                    <div
                        key={index}
                        onClick={() => name === 'Add more' ? handleAddMore() : handleClick(name)}
                        className={`relative overflow-hidden border border-gray-300 p-4 rounded-lg font-medium text-center cursor-pointer group shadow-xl h-[120px] flex items-center justify-center
                            ${name === 'Add more' ? 
                                'bg-gray-100 hover:bg-gray-200 border-dashed' : 
                                'bg-white hover:border-gray-500'}`}
                    >
                        <span className={`relative z-10 ${name === 'Add more' ? 'text-gray-500' : 'text-[#1c2a4d] group-hover:text-white'} transition-colors duration-500`}>
                            {name}
                        </span>

                        {name !== 'Add more' && (
                            <div
                                className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 w-0 group-hover:w-full transition-all ease-out"
                                style={{
                                    transitionDuration: '1s',
                                    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                                }}
                            ></div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProcessDojo;