import { useState, useEffect } from 'react';
import { 
  Rocket, 
  RefreshCw, 
  AlertTriangle,
  FileText,
  ChevronRight,
  Clock,
  CheckCircle2,
  Circle
} from 'lucide-react';

interface InitiativeDocument {
  type: string;
  path: string;
  status: string;
  date: string;
}

interface Initiative {
  id: string;
  name: string;
  status: string;
  priority: string;
  quarter: string;
  currentPhase: string;
  completedPhases: string[];
  documents: InitiativeDocument[];
  nextActions: string[];
  blockers: string[];
  daysSinceUpdate: number;
  isStale: boolean;
}

const ALL_PHASES = ['research', 'one_pager', 'requirements', 'user_stories', 'development', 'launch'];

const PHASE_LABELS: Record<string, string> = {
  research: 'Research',
  one_pager: 'One-Pager',
  requirements: 'Requirements',
  user_stories: 'User Stories',
  development: 'Development',
  launch: 'Launch',
};

function PhaseTimeline({ completedPhases, currentPhase }: { completedPhases: string[]; currentPhase: string }) {
  return (
    <div className="flex items-center gap-1 mt-3">
      {ALL_PHASES.map((phase, i) => {
        const isCompleted = completedPhases.includes(phase);
        const isCurrent = phase === currentPhase;
        return (
          <div key={phase} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                isCompleted 
                  ? 'bg-green-500' 
                  : isCurrent 
                    ? 'bg-blue-500 ring-2 ring-blue-200' 
                    : 'bg-gray-200'
              }`}>
                {isCompleted ? (
                  <CheckCircle2 size={14} className="text-white" />
                ) : isCurrent ? (
                  <Clock size={12} className="text-white" />
                ) : (
                  <Circle size={12} className="text-gray-400" />
                )}
              </div>
              <span className={`text-[10px] mt-1 max-w-[60px] text-center leading-tight ${
                isCompleted ? 'text-green-600 font-medium' : isCurrent ? 'text-blue-600 font-medium' : 'text-gray-400'
              }`}>
                {PHASE_LABELS[phase] || phase}
              </span>
            </div>
            {i < ALL_PHASES.length - 1 && (
              <div className={`w-4 h-0.5 mb-4 ${
                isCompleted ? 'bg-green-400' : 'bg-gray-200'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function InitiativeCard({ initiative }: { initiative: Initiative }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all ${
      initiative.isStale ? 'border-red-200' : initiative.status === 'blocked' ? 'border-yellow-200' : 'border-gray-200'
    }`}>
      <div 
        className="p-5 cursor-pointer hover:bg-gray-50/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                initiative.priority === 'P1' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {initiative.priority}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                initiative.status === 'in_progress' ? 'bg-blue-100 text-blue-700' 
                : initiative.status === 'blocked' ? 'bg-red-100 text-red-700'
                : 'bg-gray-100 text-gray-700'
              }`}>
                {initiative.status.replace('_', ' ')}
              </span>
              {initiative.quarter && (
                <span className="text-xs text-gray-400">{initiative.quarter}</span>
              )}
            </div>
            <h3 className="font-semibold text-gray-800">{initiative.name}</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              Phase: <span className="font-medium">{PHASE_LABELS[initiative.currentPhase] || initiative.currentPhase}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            {initiative.isStale && (
              <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full flex items-center gap-1">
                <AlertTriangle size={12} />
                {initiative.daysSinceUpdate}d stale
              </span>
            )}
            <ChevronRight size={16} className={`text-gray-400 transition-transform ${expanded ? 'rotate-90' : ''}`} />
          </div>
        </div>
        <PhaseTimeline completedPhases={initiative.completedPhases} currentPhase={initiative.currentPhase} />
      </div>

      {expanded && (
        <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-4">
          {initiative.documents.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Documents</h4>
              <ul className="space-y-1.5">
                {initiative.documents.map((doc, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <FileText size={14} className={doc.status === 'completed' ? 'text-green-500' : 'text-yellow-500'} />
                    <span className="text-gray-700">{doc.type}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      doc.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
                    }`}>
                      {doc.status}
                    </span>
                    <span className="text-xs text-gray-400">{doc.date}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {initiative.nextActions.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Next Actions</h4>
              <ul className="space-y-1">
                {initiative.nextActions.map((action, i) => (
                  <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                    <ChevronRight size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {initiative.blockers.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-2">Blockers</h4>
              <ul className="space-y-1">
                {initiative.blockers.map((blocker, i) => (
                  <li key={i} className="text-sm text-red-600 flex items-start gap-2">
                    <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
                    {blocker}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function InitiativeProgress() {
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [lastUpdated, setLastUpdated] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadInitiatives(); }, []);

  const loadInitiatives = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/dashboard/initiatives');
      const result = await response.json();
      if (result.success) {
        setInitiatives(result.initiatives || []);
        setLastUpdated(result.lastUpdated || '');
      }
    } catch (err) {
      console.error('Error loading initiatives:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Loading initiatives...</p>
      </div>
    );
  }

  const activeInitiatives = initiatives.filter(i => i.status !== 'completed');
  const staleCount = activeInitiatives.filter(i => i.isStale).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      <div className="flex items-center justify-between pt-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Rocket size={24} className="text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-800">Initiative Pipeline</h1>
          </div>
          <p className="text-gray-500 text-sm">
            Product initiatives and document pipeline
            {lastUpdated && <span className="text-gray-400"> — last updated {lastUpdated}</span>}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {staleCount > 0 && (
            <span className="text-xs font-medium text-red-600 bg-red-50 px-2.5 py-1 rounded-full flex items-center gap-1">
              <AlertTriangle size={12} />
              {staleCount} stale
            </span>
          )}
          <button
            onClick={loadInitiatives}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>
      </div>

      {activeInitiatives.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <Rocket size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-lg font-semibold text-gray-600 mb-2">No active initiatives</h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Create an initiative with: <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">Create new initiative [name]</code>
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeInitiatives
            .sort((a, b) => (a.priority < b.priority ? -1 : 1))
            .map(initiative => (
              <InitiativeCard key={initiative.id} initiative={initiative} />
            ))
          }
        </div>
      )}
    </div>
  );
}
