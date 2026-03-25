import { useState, useEffect } from 'react';
import { 
  Users, 
  RefreshCw, 
  Calendar,
  MessageSquare,
  AlertCircle,
  Building,
  User
} from 'lucide-react';

interface PersonSummary {
  name: string;
  filename: string;
  role: string;
  company: string;
  relationship: string;
  lastInteraction: string;
  openItemsCount: number;
  meetingCount: number;
}

function daysSince(dateStr: string): number {
  if (!dateStr) return -1;
  const d = new Date(dateStr);
  const now = new Date();
  return Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
}

function getRelationshipColor(rel: string): string {
  const r = rel.toLowerCase();
  if (r.includes('internal')) return 'bg-blue-100 text-blue-700';
  if (r.includes('external')) return 'bg-purple-100 text-purple-700';
  if (r.includes('partner')) return 'bg-emerald-100 text-emerald-700';
  return 'bg-gray-100 text-gray-700';
}

function PersonCard({ person }: { person: PersonSummary }) {
  const days = daysSince(person.lastInteraction);
  const isStale = days > 14;
  
  return (
    <div className={`bg-white rounded-xl border shadow-sm p-5 transition-all hover:shadow-md ${
      isStale ? 'border-yellow-200' : 'border-gray-200'
    }`}>
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center flex-shrink-0">
          <User size={20} className="text-gray-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-800 truncate">{person.name}</h3>
            {person.relationship && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${getRelationshipColor(person.relationship)}`}>
                {person.relationship}
              </span>
            )}
          </div>
          {person.role && (
            <p className="text-sm text-gray-500 truncate">{person.role}</p>
          )}
          {person.company && (
            <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
              <Building size={11} />
              {person.company}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="text-center p-2 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center gap-1 text-gray-500 mb-0.5">
            <Calendar size={12} />
          </div>
          <p className="text-xs text-gray-500">Last seen</p>
          <p className={`text-sm font-medium ${isStale ? 'text-yellow-600' : 'text-gray-700'}`}>
            {days >= 0 ? `${days}d ago` : 'Never'}
          </p>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center gap-1 text-gray-500 mb-0.5">
            <MessageSquare size={12} />
          </div>
          <p className="text-xs text-gray-500">Meetings</p>
          <p className="text-sm font-medium text-gray-700">{person.meetingCount}</p>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center gap-1 text-gray-500 mb-0.5">
            <AlertCircle size={12} />
          </div>
          <p className="text-xs text-gray-500">Open</p>
          <p className={`text-sm font-medium ${person.openItemsCount > 0 ? 'text-orange-600' : 'text-gray-700'}`}>
            {person.openItemsCount}
          </p>
        </div>
      </div>
    </div>
  );
}

export function PeopleView() {
  const [people, setPeople] = useState<PersonSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'internal' | 'external' | 'partner'>('all');

  useEffect(() => { loadPeople(); }, []);

  const loadPeople = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/dashboard/people');
      const result = await response.json();
      if (result.success) {
        setPeople(result.people || []);
      }
    } catch (err) {
      console.error('Error loading people:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = filter === 'all' 
    ? people 
    : people.filter(p => p.relationship.toLowerCase().includes(filter));

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Loading people...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      <div className="flex items-center justify-between pt-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users size={24} className="text-teal-600" />
            <h1 className="text-2xl font-bold text-gray-800">People</h1>
          </div>
          <p className="text-gray-500 text-sm">
            Stakeholder relationships and interaction history
          </p>
        </div>
        <button
          onClick={loadPeople}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {people.length > 0 && (
        <div className="flex gap-2">
          {(['all', 'internal', 'external', 'partner'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors capitalize ${
                filter === f 
                  ? 'bg-teal-600 text-white' 
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {f} {f !== 'all' ? '' : `(${people.length})`}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <Users size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-lg font-semibold text-gray-600 mb-2">
            {people.length === 0 ? 'No person pages yet' : 'No matches'}
          </h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Person pages are created when you process meeting notes or manually create them in <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">context/people/</code>
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered
            .sort((a, b) => {
              if (a.openItemsCount !== b.openItemsCount) return b.openItemsCount - a.openItemsCount;
              return daysSince(a.lastInteraction) - daysSince(b.lastInteraction);
            })
            .map(person => (
              <PersonCard key={person.filename} person={person} />
            ))
          }
        </div>
      )}
    </div>
  );
}
