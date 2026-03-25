import { useState, useEffect } from 'react';
import { TrendingUp, RefreshCw, Calendar, Lightbulb, AlertTriangle, CheckCircle, FileText } from 'lucide-react';

interface ProgressEntry {
  date: string;
  weekday: string;
  highlights: string[];
  decisions: string[];
  blockers: string[];
  actionItems: string[];
  notes: string[];
}

interface ProgressData {
  entries: ProgressEntry[];
  dateRange: {
    start: string;
    end: string;
  };
}

export function ProgressLog() {
  const [data, setData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/todos/progress/parsed');
      const result = await response.json();
      if (result.success) {
        setData({
          entries: result.entries || [],
          dateRange: result.dateRange || { start: '', end: '' },
        });
      }
    } catch (error) {
      console.error('Failed to fetch progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateRange = (start: string, end: string) => {
    if (!start || !end) return '';
    
    const startDate = new Date(start + 'T12:00:00');
    const endDate = new Date(end + 'T12:00:00');
    
    const formatOptions: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'short' 
    };
    
    return `${startDate.toLocaleDateString('pt-BR', formatOptions)} - ${endDate.toLocaleDateString('pt-BR', formatOptions)}`;
  };

  const formatDate = (dateStr: string, weekday: string) => {
    const date = new Date(dateStr + 'T12:00:00');
    const day = date.getDate();
    const month = date.toLocaleDateString('pt-BR', { month: 'short' });
    return { day, month, weekday };
  };

  // Filter entries to last 2 weeks
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
  const twoWeeksAgoStr = twoWeeksAgo.toISOString().split('T')[0];

  const filteredEntries = data?.entries.filter(entry => entry.date >= twoWeeksAgoStr) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <TrendingUp className="text-green-600" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Progress Log</h2>
            {data?.dateRange && (
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <Calendar size={14} />
                Ultimas 2 semanas ({formatDateRange(data.dateRange.start, data.dateRange.end)})
              </p>
            )}
          </div>
        </div>
        <button
          onClick={fetchProgress}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <RefreshCw size={16} />
          Atualizar
        </button>
      </div>

      {/* Empty State */}
      {filteredEntries.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">Nenhum registro encontrado</h3>
          <p className="text-gray-500">
            O progress log e atualizado automaticamente pelo Morning Briefing.
          </p>
        </div>
      )}

      {/* Timeline */}
      <div className="space-y-4">
        {filteredEntries.map((entry, index) => {
          const { day, month, weekday } = formatDate(entry.date, entry.weekday);
          const isToday = entry.date === new Date().toISOString().split('T')[0];
          
          return (
            <div 
              key={entry.date} 
              className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all ${
                isToday ? 'border-blue-300 ring-2 ring-blue-100' : 'border-gray-200'
              }`}
            >
              {/* Date Header */}
              <div className={`flex items-center gap-4 p-4 border-b ${
                isToday ? 'bg-blue-50 border-blue-100' : 'bg-gray-50 border-gray-100'
              }`}>
                <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-lg ${
                  isToday ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-700'
                }`}>
                  <span className="text-xl font-bold">{day}</span>
                  <span className="text-xs uppercase">{month}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 capitalize">{weekday}</h3>
                  {isToday && <span className="text-xs text-blue-600 font-medium">Hoje</span>}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                {/* Highlights */}
                {entry.highlights.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 text-blue-600 mb-2">
                      <Lightbulb size={16} />
                      <span className="text-sm font-medium">Highlights</span>
                    </div>
                    <ul className="space-y-1.5">
                      {entry.highlights.map((item, i) => (
                        <li key={i} className="text-sm text-gray-700 pl-6 relative before:content-[''] before:absolute before:left-2 before:top-2 before:w-1.5 before:h-1.5 before:bg-blue-400 before:rounded-full"
                            dangerouslySetInnerHTML={{ 
                              __html: item
                                .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                                .replace(/\[ \]/g, '<span class="text-gray-400">[ ]</span>')
                                .replace(/\[x\]/g, '<span class="text-green-600">[x]</span>')
                            }} 
                        />
                      ))}
                    </ul>
                  </div>
                )}

                {/* Decisions */}
                {entry.decisions.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 text-purple-600 mb-2">
                      <CheckCircle size={16} />
                      <span className="text-sm font-medium">Decisoes</span>
                    </div>
                    <ul className="space-y-1.5">
                      {entry.decisions.map((item, i) => (
                        <li key={i} className="text-sm text-gray-700 pl-6 relative before:content-[''] before:absolute before:left-2 before:top-2 before:w-1.5 before:h-1.5 before:bg-purple-400 before:rounded-full"
                            dangerouslySetInnerHTML={{ 
                              __html: item.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                            }} 
                        />
                      ))}
                    </ul>
                  </div>
                )}

                {/* Blockers */}
                {entry.blockers.length > 0 && (
                  <div className="bg-red-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-red-600 mb-2">
                      <AlertTriangle size={16} />
                      <span className="text-sm font-medium">Blockers</span>
                    </div>
                    <ul className="space-y-1.5">
                      {entry.blockers.map((item, i) => (
                        <li key={i} className="text-sm text-red-800 pl-6 relative before:content-[''] before:absolute before:left-2 before:top-2 before:w-1.5 before:h-1.5 before:bg-red-500 before:rounded-full"
                            dangerouslySetInnerHTML={{ 
                              __html: item.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                            }} 
                        />
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Items */}
                {entry.actionItems.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 text-green-600 mb-2">
                      <CheckCircle size={16} />
                      <span className="text-sm font-medium">Action Items</span>
                    </div>
                    <ul className="space-y-1.5">
                      {entry.actionItems.map((item, i) => (
                        <li key={i} className="text-sm text-gray-700 pl-6 relative before:content-[''] before:absolute before:left-2 before:top-2 before:w-1.5 before:h-1.5 before:bg-green-400 before:rounded-full"
                            dangerouslySetInnerHTML={{ 
                              __html: item
                                .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                                .replace(/\[ \]/g, '<span class="text-gray-400">[ ]</span>')
                                .replace(/\[x\]/g, '<span class="text-green-600">[x]</span>')
                            }} 
                        />
                      ))}
                    </ul>
                  </div>
                )}

                {/* Notes */}
                {entry.notes.length > 0 && (
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                      <FileText size={16} />
                      <span className="text-sm font-medium">Notas</span>
                    </div>
                    <ul className="space-y-1">
                      {entry.notes.map((item, i) => (
                        <li key={i} className="text-sm text-gray-600 italic pl-4"
                            dangerouslySetInnerHTML={{ 
                              __html: item.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                            }} 
                        />
                      ))}
                    </ul>
                  </div>
                )}

                {/* Empty entry message */}
                {entry.highlights.length === 0 && entry.decisions.length === 0 && 
                 entry.blockers.length === 0 && entry.actionItems.length === 0 && 
                 entry.notes.length === 0 && (
                  <p className="text-sm text-gray-400 italic text-center py-4">
                    Nenhum registro para este dia
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
