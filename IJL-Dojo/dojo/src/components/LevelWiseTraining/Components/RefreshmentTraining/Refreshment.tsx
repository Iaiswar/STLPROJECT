import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Scheduling from './components/Scheduling';
import CalendarOverview from './components/CalendarOverview';
import Notification from './components/Notification';
import Training from './components/Training';
import Curriculum from './components/Curriculum';
import Status from './components/Status';



function App() {
  const [activeModule, setActiveModule] = useState('scheduling');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | string | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<number | string | null>(null);

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'scheduling':
        return <Scheduling />;
      case 'calendar':
        return <CalendarOverview />;
      case 'notification':
        return <Notification />;
      case 'training':
        return (
          <Training 
            setActiveModule={setActiveModule} 
            setSelectedCategoryId={setSelectedCategoryId} 
            setSelectedTopicId={setSelectedTopicId} 
          />
        );
      case 'curriculum':
        return (
          <Curriculum 
            selectedCategoryId={selectedCategoryId} 
            selectedTopicId={selectedTopicId} 
            setSelectedCategoryId={setSelectedCategoryId} 
            setSelectedTopicId={setSelectedTopicId} 
          />
        );
      case 'status':
        return <Status />;
      default:
        return <Scheduling />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />
      <main className="flex-1 ml-64 p-8">
        {renderActiveModule()}
      </main>
    </div>
  );
}

export default App;