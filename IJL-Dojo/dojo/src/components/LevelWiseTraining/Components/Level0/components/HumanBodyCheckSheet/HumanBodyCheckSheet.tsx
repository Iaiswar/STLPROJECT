import { useEffect, useState } from 'react';
import { Check, X, Plus, Save } from 'lucide-react';

interface CheckItem {
  description: string;
  status: 'pass' | 'fail' | '';
}

interface CheckData {
  [key: string]: CheckItem;
}

interface UserInfo {
  id: number;
  firstName: string;
  lastName: string;
  tempId: string;
  email: string;
  phoneNumber: string;
  sex: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}


interface HumanBodyCheckSheetProps {
  tempId: string;
  userDetails: UserInfo;
}

const HumanBodyCheckSheet: React.FC<HumanBodyCheckSheetProps> = ({ tempId, userDetails }) => {


  const { firstName, lastName, email, phoneNumber, sex } = userDetails;

  const [checkData, setCheckData] = useState<CheckData>({
    '1': { description: 'रंग पहचानने में सक्षम (Color Blind to nahi)', status: '' },
    '2': { description: 'आंखों की गति (Eye Movement)-सभी दिशाओं में सामान्य / सीमित', status: '' },
    '3': { description: 'सभी उंगलियों / अंगुठा सही व कार्यशील हैं?', status: '' },
    '4': { description: 'हाथ, उंगलियों या हथेलियों में कोई विकृति या कटाव?', status: '' },
    '5': { description: 'चलने की क्षमता पर उठने, मोड़ने, झुकाने की गति (Joint Mobility - Hip/Knee/Ankle)', status: '' },
    '6': { description: 'क्या वह व्यक्ति ठीक से सुन सकता है या नहीं', status: '' },
    '7': { description: 'झुकने, घुसने, खड़े होने में कोई बाधा', status: '' }
  });

  const [newItem, setNewItem] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [isExisting, setIsExisting] = useState<boolean>(false);

  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/human-body-checks/?temp_id=${tempId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            const record = data[0];
            setIsExisting(true);
            setCheckData({
              '1': { description: checkData['1'].description, status: record.color_vision },
              '2': { description: checkData['2'].description, status: record.eye_movement },
              '3': { description: checkData['3'].description, status: record.fingers_functionality },
              '4': { description: checkData['4'].description, status: record.hand_deformity },
              '5': { description: checkData['5'].description, status: record.joint_mobility },
              '6': { description: checkData['6'].description, status: record.hearing },
              '7': { description: checkData['7'].description, status: record.bending_ability },
              ...record.additional_checks.reduce((acc: CheckData, item: any, index: number) => {
                const id = (index + 8).toString();
                acc[id] = { description: item.description, status: item.status };
                return acc;
              }, {})
            });
          }
        }
      } catch (err) {
        console.error('Failed to fetch existing check data', err);
      }
    };

    fetchExistingData();
  }, [tempId]);

  const handleStatusChange = (id: string, status: 'pass' | 'fail' | '') => {
    setCheckData(prev => ({
      ...prev,
      [id]: { ...prev[id], status }
    }));
  };

  const addNewItem = () => {
    if (newItem.trim()) {
      const existingIds = Object.keys(checkData).map(id => parseInt(id));
      const newId = Math.max(...existingIds) + 1;
      setCheckData(prev => ({
        ...prev,
        [newId.toString()]: { description: newItem, status: '' }
      }));
      setNewItem('');
      setShowAddForm(false);
    }
  };

  const saveData = async () => {
    try {
      if (isExisting) {
        alert('Data already exists for this tempId. No update allowed.');
        return;
      }

      const checkResults = {
        temp_id: tempId,
        color_vision: checkData['1'].status || 'pending',
        eye_movement: checkData['2'].status || 'pending',
        fingers_functionality: checkData['3'].status || 'pending',
        hand_deformity: checkData['4'].status || 'pending',
        joint_mobility: checkData['5'].status || 'pending',
        hearing: checkData['6'].status || 'pending',
        bending_ability: checkData['7'].status || 'pending',
        additional_checks: Object.entries(checkData)
          .filter(([id]) => parseInt(id) > 7)
          .map(([id, item]) => ({
            description: item.description,
            status: item.status || 'pending'
          })),
        notes: ''
      };

      const response = await fetch('http://127.0.0.1:8000/human-body-checks/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkResults)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to save check data');
      }

      alert('Data saved successfully!');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      alert(`Error: ${message}`);
    }
  };

  const getStatusColor = (status: 'pass' | 'fail' | '') => {
    if (status === 'pass') return 'bg-green-100 border-green-300';
    if (status === 'fail') return 'bg-red-100 border-red-300';
    return 'bg-gray-50 border-gray-300';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="border-2 border-gray-800 rounded-lg overflow-hidden">
        <div className="bg-gray-100 border-b-2 border-gray-800 p-4">
          <h1 className="text-xl font-bold text-center">Human Body Check Point (Level-0)</h1>
        </div>

        <div className="bg-gray-50 p-4  border border-black">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            User Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-start">
                <span className="text-gray-600 font-medium w-24">Name:</span>
                <span className="text-gray-800">{firstName} {lastName}</span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-600 font-medium w-24">Temp ID:</span>
                <span className="text-gray-800 font-mono bg-gray-100 px-2 py-1 rounded">
                  {tempId}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-start">
                <span className="text-gray-600 font-medium w-24">Email:</span>
                <span className="text-gray-800 break-all">{email}</span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-600 font-medium w-24">Phone:</span>
                <span className="text-gray-800">{phoneNumber}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-12 border-b-2 border-gray-800">
          <div className="col-span-1 p-3 border-r-2 border-gray-800 font-semibold text-center">Sr No</div>
          <div className="col-span-9 p-3 border-r-2 border-gray-800 font-semibold text-center">Description</div>
          <div className="col-span-2 p-3 font-semibold text-center">✓ / ✗</div>
        </div>

        {Object.entries(checkData).map(([id, item]) => (
          <div key={id} className={`grid grid-cols-12 border-b border-gray-300 ${getStatusColor(item.status)}`}>
            <div className="col-span-1 p-3 border-r-2 border-gray-800 text-center font-medium">{id}</div>
            <div className="col-span-9 p-3 border-r-2 border-gray-800">
              <span className="text-sm">{item.description}</span>
            </div>
            <div className="col-span-2 p-3 flex justify-center items-center">
              <button
                onClick={() => {
                  let nextStatus: 'pass' | 'fail' | '' = '';
                  if (item.status === '') nextStatus = 'pass';
                  else if (item.status === 'pass') nextStatus = 'fail';
                  else nextStatus = '';
                  handleStatusChange(id, nextStatus);
                }}
                className={`p-3 rounded border-2 transition-colors w-16 h-12 flex items-center justify-center ${item.status === 'pass'
                  ? 'bg-green-500 border-green-500 text-white'
                  : item.status === 'fail'
                    ? 'bg-red-500 border-red-500 text-white'
                    : 'bg-white border-gray-300 hover:border-blue-500'
                  }`}
              >
                {item.status === 'pass' && <Check className="w-5 h-5" />}
                {item.status === 'fail' && <X className="w-5 h-5" />}
                {item.status === '' && <span className="text-gray-400">-</span>}
              </button>
            </div>
          </div>
        ))}

        {showAddForm && (
          <div className="grid grid-cols-12 border-b border-gray-300 bg-blue-50">
            <div className="col-span-1 p-3 border-r-2 border-gray-800 text-center">+</div>
            <div className="col-span-9 p-3 border-r-2 border-gray-800">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="Enter new check item..."
                className="w-full p-2 border rounded"
                onKeyPress={(e) => e.key === 'Enter' && addNewItem()}
              />
            </div>
            <div className="col-span-2 p-3 flex justify-center gap-2">
              <button
                onClick={addNewItem}
                className="px-3 py-1 bg-green-500 text-white rounded text-sm"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-end items-center">

        <button
          onClick={saveData}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          <Save className="w-4 h-4" /> Save Data
        </button>
      </div>
    </div>
  );
};

export default HumanBodyCheckSheet;