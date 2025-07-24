import React, { useState } from 'react';
import Navbar from '../../../Navbar/Navbar';

const checklist = [
    {
        level: 'Level 1',
        items: [
            {
                question: "Does operator know the 5'S methodology?",
                method: 'Defined procedures & Verbal Viva',
            },
            {
                question: "Does operator know about the 'STOP ➜ CALL ➜ WAIT' procedure?",
                method: 'Defined procedures & Verbal Viva',
            },
            {
                question: 'Does operator know about the FIFO Management?',
                method: 'Defined procedures & Verbal Viva',
            },
            {
                question: 'Does operator know about the change point information flow?',
                method: 'Defined procedures & Verbal Viva',
            },
            {
                question: 'Does operator know about the machine startup process?',
                method: 'As per startup work instruction',
            },
        ],
    },
    {
        level: 'Level 2',
        items: [
            {
                question: 'Does operator know the method of machine cleaning?',
                method: 'As per 5S Check sheet',
            },
            {
                question: 'Does operator able to read the pressure gauge & fill the same in the check sheet?',
                method: 'As per Machine Check sheet',
            },
            {
                question: 'Does operator know the procedure of Master Sample verification?',
                method: 'As per Master Check sheet',
            },
            {
                question: 'Does operator follow the Operations Working Steps?',
                method: 'As per Operation standard & Work instruction',
            },
            {
                question: 'Does operator know the method of rejection handling?',
                method: 'As per defined rejection handling rules',
            },
            {
                question: 'Does operator know how to clean machine inside like sensor, wire area prob etc.',
                method: 'As per 5S Check sheet',
            },
        ],
    },
    {
        level: 'Level 3',
        items: [
            {
                question:
                    'Does operator know jig / tool replacement while changeover? (Applicable if any setup available on the observance Process)',
                method: 'As per setup change over',
            },
            {
                question: 'Does operator know defect impact on next process?',
                method: 'As per final inspection WI',
            },
            {
                question: 'Does operator follow Drop Part System?',
                method: 'As per drop part rule',
            },
            {
                question: 'Does operator know the last three customer complaints?',
                method: 'As per UQI',
            },
        ],
    },
    {
        level: 'Level 4',
        items: [
            {
                question: 'Does operator know the method of abnormality handling?',
                method: 'As per abnormality handling control rule',
            },
            {
                question: 'Does operator know how the abnormality handling communication route?',
                method: 'As per abnormality handling control rule',
            },
            {
                question: 'Does operator know about the abnormality condition or matrix?',
                method: 'As per abnormality matrix',
            },
            {
                question: 'Does operator know the internal quality abnormality handling rule?',
                method: 'As per abnormality handling control rule',
            },
            {
                question: 'Does operator know the customer end quality abnormality handling rule?',
                method: 'As per abnormality handling control rule',
            },
        ],
    },
];


const levelMap = {
    'Level 1': 1,
    'Level 2': 2,
    'Level 3': 3,
    'Level 4': 4,
} as const;


type LevelKey = keyof typeof levelMap;


const PersonnelObservanceSheet: React.FC = () => {
    const [selectedLevel, setSelectedLevel] = useState<LevelKey>('Level 1');

    const filteredChecklist = checklist.slice(0, levelMap[selectedLevel]);

    let serial = 1;

    return (<>
    
    <Navbar />
        <div className="max-w-5xl mx-auto p-6 border border-gray-400 rounded bg-white text-sm">
            <h2 className="text-xl font-bold uppercase text-center mb-4">Personnel Observance Sheet</h2>

            <table className="w-full mb-4 border border-gray-400 text-sm">
                <tbody>
                    <tr>
                        <td className="border border-gray-400 px-2 py-1 font-semibold w-1/4">Document No:</td>
                        <td className="border border-gray-400 px-2 py-1 w-1/4"></td>
                        <td className="border border-gray-400 px-2 py-1 font-semibold w-1/4">Rev. No / Date:</td>
                        <td className="border border-gray-400 px-2 py-1 w-1/4"></td>
                    </tr>
                    <tr>
                        <td className="border border-gray-400 px-2 py-1 font-semibold">Effective Date:</td>
                        <td className="border border-gray-400 px-2 py-1"></td>
                        <td className="border border-gray-400 px-2 py-1 font-semibold">Retention Period:</td>
                        <td className="border border-gray-400 px-2 py-1"></td>
                    </tr>
                    <tr>
                        <td className="border border-gray-400 px-2 py-1 font-semibold">Name / E.Code:</td>
                        <td className="border border-gray-400 px-2 py-1"></td>
                        <td className="border border-gray-400 px-2 py-1 font-semibold">Date:</td>
                        <td className="border border-gray-400 px-2 py-1"></td>
                    </tr>
                    <tr>
                        <td className="border border-gray-400 px-2 py-1 font-semibold">Process Name:</td>
                        <td className="border border-gray-400 px-2 py-1">
                            <select
                                className="w-full border-none outline-none rounded px-2 py-1"
                                value={selectedLevel}
                                onChange={e => setSelectedLevel(e.target.value as LevelKey)}
                            >
                                {Object.keys(levelMap).map((level) => (
                                    <option key={level} value={level}>
                                        {level}
                                    </option>
                                ))}
                            </select>
                        </td>
                        <td className="border border-gray-400 px-2 py-1 font-semibold">Line Name / Line No.:</td>
                        <td className="border border-gray-400 px-2 py-1"></td>
                    </tr>
                </tbody>
            </table>

            <table className="w-full border border-gray-400 text-sm">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border border-gray-400 px-2 py-1">S.No</th>
                        <th className="border border-gray-400 px-2 py-1">Level</th>
                        <th className="border border-gray-400 px-2 py-1">Activity Check Question</th>
                        <th className="border border-gray-400 px-2 py-1">Observation Standards / Method</th>
                        <th className="border border-gray-400 px-2 py-1">Result (OK/NG)</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredChecklist.map(({ level, items }) =>
                        items.map((item, idx) => (
                            <tr key={`${level}-${idx}`}>
                                <td className="border border-gray-400 px-2 py-1 text-center">{serial++}</td>
                                <td className="border border-gray-400 px-2 py-1 text-center">{idx === 0 ? level : ''}</td>
                                <td className="border border-gray-400 px-2 py-1">{item.question}</td>
                                <td className="border border-gray-400 px-2 py-1">{item.method}</td>
                                <td className="border border-gray-400 px-2 py-1 text-center"></td>
                            </tr>
                        ))
                    )}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={5} className="border border-gray-400 p-0">
                            {/* <div className="px-2 py-1">
                                <div className="font-semibold">
                                    1. Consider Pass If working as per defined rule & given instruction
                                </div>
                                <div className="font-semibold">
                                    2. Consider Fail If Not working as per defined rule & given instruction, then plan for next step as below mention steps:
                                </div>
                            </div> */}
                            
                            <table className="w-full border-t border-gray-400 text-sm">
                                <thead>
                                    <tr>
                                        <th className="border-r border-b border-gray-400 px-2 py-1 w-1/6">S.NO.</th>
                                        <th className="border-r border-b border-gray-400 px-2 py-1 w-2/5">OBSERVATIONS (Failure Points)</th>
                                        <th className="border-r border-b border-gray-400 px-2 py-1 w-1/6">Re-Training Date</th>
                                        <th colSpan={3} className="border-b border-gray-400 px-2 py-1">DEGREE OF CONFIRMATION / EVALUATION</th>
                                        <th className="border-l border-b border-gray-400 px-2 py-1 w-1/6">Trainee Sign. (OPERATOR)</th>
                                        <th className="border-l border-b border-gray-400 px-2 py-1 w-1/6">Trainer's confirmation Sign.</th>
                                    </tr>
                                    <tr>
                                        <th colSpan={3}  className="border-r border-gray-400" ></th>
                                        <th className="border-r border-b border-gray-400 px-2 py-1">1st</th>
                                        <th className="border-r border-b border-gray-400 px-2 py-1">2nd</th>
                                        <th className="border-r border-b border-gray-400 px-2 py-1">3rd</th>
                                        <th colSpan={2} className="border-b border-gray-400"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[...Array(5)].map((_, idx) => (
                                        <tr key={`obs-${idx}`}>
                                            <td className="border-r border-b border-gray-400 px-2 py-3"></td>
                                            <td className="border-r border-b border-gray-400 px-2 py-3"></td>
                                            <td className="border-r border-b border-gray-400 px-2 py-3"></td>
                                            <td className="border-r border-b border-gray-400 px-2 py-3"></td>
                                            <td className="border-r border-b border-gray-400 px-2 py-3"></td>
                                            <td className="border-r border-b border-gray-400 px-2 py-3"></td>
                                            <td className="border-r border-b border-gray-400 px-2 py-3"></td>
                                            <td className="border-b border-gray-400 px-2 py-3"></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* <div className="flex justify-between mt-4 pb-4 px-2">
                                <div>
                                    <div className="mt-6 border-t border-gray-400 pt-1 w-48">Section Head Sign.</div>
                                </div>
                                <div>
                                    <div>Approved By: _____________</div>
                                </div>
                            </div>

                            <div className="flex px-2 pb-2">
                                <div className="text-xs italic">Next observation Date for same process confirmation .........................................</div>
                            </div> */}
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div></>
    );
};

export default PersonnelObservanceSheet;