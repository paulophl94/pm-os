import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { MorningBriefing } from './components/MorningBriefing';
import { TodoList } from './components/TodoList';
import { ProgressLog } from './components/ProgressLog';
import { Backlog } from './components/Backlog';
import { Scratchpad } from './components/Scratchpad';
import { Commitments } from './components/Commitments';
import { InitiativeProgress } from './components/InitiativeProgress';
import { PeopleView } from './components/PeopleView';

type View = 'briefing' | 'todos' | 'progress' | 'backlog' | 'commitments' | 'initiatives' | 'people';

function App() {
  const [currentView, setCurrentView] = useState<View>('briefing');
  const [scratchpadContent, setScratchpadContent] = useState('');

  const renderView = () => {
    switch (currentView) {
      case 'briefing':
        return <MorningBriefing />;
      case 'todos':
        return <TodoList />;
      case 'progress':
        return <ProgressLog />;
      case 'backlog':
        return <Backlog />;
      case 'commitments':
        return <Commitments />;
      case 'initiatives':
        return <InitiativeProgress />;
      case 'people':
        return <PeopleView />;
      default:
        return <MorningBriefing />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header with Scratchpad */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">
            PM Co-Pilot
            <span className="text-sm font-normal text-gray-500 ml-2">
              Chief of Staff Digital
            </span>
          </h1>
          <Scratchpad 
            content={scratchpadContent} 
            onChange={setScratchpadContent} 
          />
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-auto p-6">
          {renderView()}
        </div>
      </main>
    </div>
  );
}

export default App;
