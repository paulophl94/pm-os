import { 
  Sun, 
  CheckSquare, 
  TrendingUp, 
  Archive,
  Users,
  Handshake,
  Rocket,
  Sparkles
} from 'lucide-react';

type View = 'briefing' | 'todos' | 'progress' | 'backlog' | 'commitments' | 'initiatives' | 'people';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

const menuItems: Array<{ id: View; label: string; icon: React.ReactNode; description: string }> = [
  { id: 'briefing', label: 'Morning Briefing', icon: <Sun size={20} />, description: 'Visao geral do dia' },
  { id: 'todos', label: 'To-Do\'s', icon: <CheckSquare size={20} />, description: 'Tarefas e prioridades' },
  { id: 'progress', label: 'Progress Log', icon: <TrendingUp size={20} />, description: 'Historico de trabalho' },
  { id: 'backlog', label: 'Backlog', icon: <Archive size={20} />, description: 'Itens futuros' },
];

const insightItems: Array<{ id: View; label: string; icon: React.ReactNode; description: string }> = [
  { id: 'commitments', label: 'Commitments', icon: <Handshake size={20} />, description: 'Promessas e pendencias' },
  { id: 'initiatives', label: 'Initiatives', icon: <Rocket size={20} />, description: 'Pipeline de iniciativas' },
  { id: 'people', label: 'People', icon: <Users size={20} />, description: 'Stakeholders e contexto' },
];

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  return (
    <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-950 text-white flex flex-col min-h-screen">
      {/* Logo */}
      <div className="p-5 border-b border-gray-800/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <span className="font-bold text-lg">PM Co-Pilot</span>
            <p className="text-xs text-gray-400">Chief of Staff Digital</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                      : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                  }`}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                  )}
                  
                  <div className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                    {item.icon}
                  </div>
                  
                  <div className="flex-1 text-left">
                    <span className={`text-sm font-medium block ${isActive ? 'text-white' : ''}`}>
                      {item.label}
                    </span>
                    <span className={`text-xs transition-colors ${
                      isActive ? 'text-blue-100' : 'text-gray-500 group-hover:text-gray-400'
                    }`}>
                      {item.description}
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Divider */}
        <div className="my-5 mx-3 border-t border-gray-800/50" />

        {/* Insight items */}
        <p className="px-4 text-xs text-gray-600 uppercase tracking-wider mb-3 font-medium">Insights</p>
        <ul className="space-y-1">
          {insightItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                      : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                  )}
                  <div className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <span className={`text-sm font-medium block ${isActive ? 'text-white' : ''}`}>
                      {item.label}
                    </span>
                    <span className={`text-xs transition-colors ${
                      isActive ? 'text-blue-100' : 'text-gray-500 group-hover:text-gray-400'
                    }`}>
                      {item.description}
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800/50">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>v1.1.0</span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Online
          </span>
        </div>
      </div>
    </aside>
  );
}
