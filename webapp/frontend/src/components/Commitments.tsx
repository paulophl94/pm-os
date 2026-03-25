import { useState, useEffect } from 'react';
import { 
  Handshake, 
  RefreshCw, 
  AlertTriangle,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';

interface Commitment {
  what: string;
  who: string;
  since: string;
  context: string;
  taskId?: string;
  completed: boolean;
  daysOld: number;
}

interface CommitmentData {
  iOwe: Commitment[];
  othersOweMe: Commitment[];
  completed: Commitment[];
}

function getStalenessColor(days: number): string {
  if (days <= 2) return 'text-green-600 bg-green-50';
  if (days <= 5) return 'text-yellow-600 bg-yellow-50';
  return 'text-red-600 bg-red-50';
}

function getStalenessIcon(days: number) {
  if (days <= 2) return <Clock size={14} className="text-green-500" />;
  if (days <= 5) return <Clock size={14} className="text-yellow-500" />;
  return <AlertTriangle size={14} className="text-red-500" />;
}

function CommitmentCard({ commitment, direction }: { commitment: Commitment; direction: 'owe' | 'owed' }) {
  return (
    <div className={`p-3 rounded-lg border transition-all ${
      commitment.daysOld > 5 
        ? 'border-red-200 bg-red-50/50' 
        : commitment.daysOld > 2 
          ? 'border-yellow-200 bg-yellow-50/30' 
          : 'border-gray-200 bg-white'
    }`}>
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 p-1 rounded ${direction === 'owe' ? 'bg-blue-100' : 'bg-emerald-100'}`}>
          {direction === 'owe' 
            ? <ArrowUpRight size={14} className="text-blue-600" /> 
            : <ArrowDownLeft size={14} className="text-emerald-600" />
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-800 font-medium">{commitment.what}</p>
          {commitment.who && (
            <p className="text-xs text-gray-500 mt-1">
              {direction === 'owe' ? 'To: ' : 'From: '}{commitment.who}
            </p>
          )}
          {commitment.context && (
            <p className="text-xs text-gray-400 mt-0.5">{commitment.context}</p>
          )}
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {getStalenessIcon(commitment.daysOld)}
          <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${getStalenessColor(commitment.daysOld)}`}>
            {commitment.daysOld}d
          </span>
        </div>
      </div>
      {commitment.taskId && (
        <p className="text-xs text-gray-400 mt-1.5 ml-8 font-mono">{commitment.taskId}</p>
      )}
    </div>
  );
}

export function Commitments() {
  const [data, setData] = useState<CommitmentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadCommitments(); }, []);

  const loadCommitments = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/dashboard/commitments');
      const result = await response.json();
      if (result.success) {
        setData(result.commitments);
      }
    } catch (err) {
      console.error('Error loading commitments:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Loading commitments...</p>
      </div>
    );
  }

  const hasCommitments = data && (data.iOwe.length > 0 || data.othersOweMe.length > 0);
  const staleCount = data 
    ? [...data.iOwe, ...data.othersOweMe].filter(c => c.daysOld > 3).length 
    : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      <div className="flex items-center justify-between pt-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Handshake size={24} className="text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">Commitments</h1>
          </div>
          <p className="text-gray-500 text-sm">Promises made and received — tracked from meeting notes</p>
        </div>
        <div className="flex items-center gap-3">
          {staleCount > 0 && (
            <span className="text-xs font-medium text-red-600 bg-red-50 px-2.5 py-1 rounded-full flex items-center gap-1">
              <AlertTriangle size={12} />
              {staleCount} stale
            </span>
          )}
          <button
            onClick={loadCommitments}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>
      </div>

      {!hasCommitments ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <Handshake size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-lg font-semibold text-gray-600 mb-2">No commitments tracked</h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Commitments are extracted automatically when you process meeting notes. 
            Try: <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">process meeting notes</code>
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-blue-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ArrowUpRight size={18} className="text-blue-600" />
                  <h2 className="font-semibold text-gray-800">I Owe</h2>
                </div>
                <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                  {data?.iOwe.length || 0}
                </span>
              </div>
            </div>
            <div className="p-4 space-y-2">
              {data?.iOwe.length === 0 ? (
                <p className="text-sm text-gray-400 italic text-center py-4">All clear</p>
              ) : (
                data?.iOwe.map((c, i) => <CommitmentCard key={i} commitment={c} direction="owe" />)
              )}
            </div>
          </section>

          <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-emerald-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ArrowDownLeft size={18} className="text-emerald-600" />
                  <h2 className="font-semibold text-gray-800">Others Owe Me</h2>
                </div>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                  {data?.othersOweMe.length || 0}
                </span>
              </div>
            </div>
            <div className="p-4 space-y-2">
              {data?.othersOweMe.length === 0 ? (
                <p className="text-sm text-gray-400 italic text-center py-4">Nothing pending</p>
              ) : (
                data?.othersOweMe.map((c, i) => <CommitmentCard key={i} commitment={c} direction="owed" />)
              )}
            </div>
          </section>
        </div>
      )}

      {data && data.completed.length > 0 && (
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-2 text-green-600 mb-4">
            <CheckCircle2 size={20} />
            <h2 className="text-lg font-semibold">Completed ({data.completed.length})</h2>
          </div>
          <ul className="space-y-2">
            {data.completed.slice(0, 5).map((c, i) => (
              <li key={i} className="text-sm text-gray-500 flex items-center gap-2">
                <CheckCircle2 size={14} className="text-green-400" />
                <span className="line-through">{c.what}</span>
                {c.who && <span className="text-gray-400">({c.who})</span>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
