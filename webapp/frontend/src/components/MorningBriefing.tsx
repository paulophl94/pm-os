import { useState, useEffect } from 'react';
import { 
  Sun, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle,
  MessageSquare,
  Calendar,
  Target,
  Zap,
  Users,
  ExternalLink,
  Briefcase,
  Clock,
  XCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useToast } from './Toast';

interface BriefingStats {
  meetings: number;
  actionItems: number;
  blockers: number;
  jiraInProgress: number;
  jiraPending: number;
}

interface JiraIssue {
  key: string;
  url: string;
  title: string;
  assignee: string;
  priority: string;
  updated?: string;
}

interface TeamInitiative {
  key: string;
  url: string;
  title: string;
  assignee: string;
  status: string;
  priority: string;
}

interface TeamInitiatives {
  subscriptions: TeamInitiative[];
  b2b: TeamInitiative[];
}

interface Meeting {
  title: string;
  date: string;
  participants: string;
  duration: string;
  summary: string;
  decisions: string[];
  actionItems: string[];
}

interface Briefing {
  date: string;
  dayOverview: string;
  weekOverview: string;
  immediateAttention: string[];
  proposedTodos: Array<{
    text: string;
    priority: 'P1' | 'P2';
    source: string;
    approved?: boolean;
    description?: string;
  }>;
  stats: BriefingStats;
  jiraInProgress: JiraIssue[];
  jiraPending: JiraIssue[];
  meetings: Meeting[];
  blockers: string[];
  teamInitiatives?: TeamInitiatives;
}

export function MorningBriefing() {
  const [briefing, setBriefing] = useState<Briefing | null>(null);
  const [loading, setLoading] = useState(true);
  const [approvedTodos, setApprovedTodos] = useState<Set<number>>(new Set());
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<number>>(new Set());
  const { showSuccess, showError, showInfo } = useToast();

  const today = new Date().toISOString().split('T')[0];

  // Load briefing on mount
  useEffect(() => {
    loadBriefing();
  }, []);

  const loadBriefing = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/briefing/latest');
      const data = await response.json();
      
      if (data.success && data.briefing) {
        setBriefing(data.briefing);
        setApprovedTodos(new Set());
      } else {
        setBriefing(null);
      }
    } catch (err) {
      console.error('Error loading briefing:', err);
      setBriefing(null);
    } finally {
      setLoading(false);
    }
  };

  const toggleTodoApproval = (index: number) => {
    setApprovedTodos(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (!briefing?.proposedTodos) return;
    
    const unapprovedIndices = briefing.proposedTodos
      .map((todo, i) => todo.approved ? null : i)
      .filter((i): i is number => i !== null);
    
    const allSelected = unapprovedIndices.length > 0 && 
      unapprovedIndices.every(i => approvedTodos.has(i));
    
    if (allSelected) {
      setApprovedTodos(new Set());
    } else {
      setApprovedTodos(new Set(unapprovedIndices));
    }
  };

  const toggleDescription = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedDescriptions(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const approveSelectedTodos = async () => {
    if (!briefing?.proposedTodos || approvedTodos.size === 0) return;

    const todosToApprove = briefing.proposedTodos.filter((_, i) => approvedTodos.has(i));
    
    try {
      for (const todo of todosToApprove) {
        const response = await fetch('/api/todos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: todo.text,
            priority: todo.priority,
            section: `Hoje - ${todo.priority} (${todo.priority === 'P1' ? 'Alta Prioridade' : 'Media Prioridade'})`,
          }),
        });
        
        const data = await response.json();
        
        // If todo has description, add it as a pre-embedded note
        if (todo.description && data.success && data.task?.id) {
          await fetch(`/api/todos/notes/${data.task.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              taskText: todo.text,
              note: `[Briefing] ${todo.description}`,
            }),
          });
        }
      }
      
      // Mark approved todos in the UI
      setBriefing(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          proposedTodos: prev.proposedTodos.map((todo, i) => ({
            ...todo,
            approved: approvedTodos.has(i) ? true : todo.approved,
          })),
        };
      });
      setApprovedTodos(new Set());
      showSuccess(`${todosToApprove.length} tarefa(s) adicionada(s)`);
    } catch (error) {
      console.error('Failed to approve todos:', error);
      showError('Erro ao aprovar tarefas');
    }
  };

  const discardProposedTodos = () => {
    setApprovedTodos(new Set());
    setBriefing(prev => {
      if (!prev) return prev;
      return { ...prev, proposedTodos: [] };
    });
    showInfo('To-Do\'s descartados');
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T12:00:00');
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const getPriorityColor = (priority: string) => {
    const p = priority.toLowerCase();
    if (p === 'highest' || p === 'alta') return 'text-red-600 bg-red-50';
    if (p === 'high') return 'text-orange-600 bg-orange-50';
    if (p === 'medium') return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('progress') || s.includes('development')) return 'text-blue-600 bg-blue-50';
    if (s.includes('review')) return 'text-purple-600 bg-purple-50';
    if (s.includes('blocked')) return 'text-red-600 bg-red-50';
    if (s.includes('done') || s.includes('complete')) return 'text-green-600 bg-green-50';
    return 'text-gray-600 bg-gray-50';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Carregando briefing...</p>
      </div>
    );
  }

  // No briefing found - show instructions to use Claude
  if (!briefing) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <Sun className="w-16 h-16 text-yellow-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          {getGreeting()}, Paulo!
        </h2>
        <p className="text-gray-600 mb-6 max-w-md">
          Nenhum briefing encontrado para hoje. Peca ao Claude para gerar 
          seu Morning Briefing no Cursor.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mb-6">
          <div className="flex items-center gap-2 text-blue-700 mb-2">
            <MessageSquare size={18} />
            <span className="font-semibold">Como gerar</span>
          </div>
          <p className="text-blue-800 text-sm mb-3">
            No Cursor, digite um dos comandos:
          </p>
          <ul className="text-blue-700 text-sm space-y-1">
            <li><code className="bg-blue-100 px-2 py-0.5 rounded">morning briefing</code></li>
            <li><code className="bg-blue-100 px-2 py-0.5 rounded">briefing do dia</code></li>
            <li><code className="bg-blue-100 px-2 py-0.5 rounded">comecar o dia</code></li>
          </ul>
        </div>

        <button
          onClick={loadBriefing}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <RefreshCw size={16} />
          Atualizar
        </button>
      </div>
    );
  }

  // Check if briefing is from today
  const isFromToday = briefing.date === today;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      {/* Header - Greeting */}
      <div className="text-center pt-4">
        <div className="inline-flex items-center gap-2 text-yellow-500 mb-2">
          <Sun size={24} />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-1">
          {getGreeting()}, Paulo!
        </h1>
        <p className="text-gray-500 capitalize flex items-center justify-center gap-2">
          <Calendar size={16} />
          {formatDate(briefing.date)}
        </p>
        {!isFromToday && (
          <p className="text-sm text-yellow-600 mt-2 bg-yellow-50 inline-block px-3 py-1 rounded-full">
            Este briefing nao e de hoje. Peca ao Claude para gerar um novo.
          </p>
        )}
        <button
          onClick={loadBriefing}
          className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <RefreshCw size={14} />
          Atualizar
        </button>
      </div>


      {/* Day Overview - Narrative Section */}
      {briefing.dayOverview && (
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-2 text-blue-600 mb-4">
            <Target size={20} />
            <h2 className="text-lg font-semibold">Visao Geral do Dia</h2>
          </div>
          <div className="prose prose-gray max-w-none">
            {briefing.dayOverview.split('\n').map((paragraph, i) => (
              paragraph.trim() && (
                <p key={i} className="text-gray-700 leading-relaxed mb-3 last:mb-0"
                   dangerouslySetInnerHTML={{ 
                     __html: paragraph
                       .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                       .replace(/\*(.+?)\*/g, '<em>$1</em>')
                   }} 
                />
              )
            ))}
          </div>
        </section>
      )}

      {/* Week Overview - Narrative Section */}
      {briefing.weekOverview && (
        <section className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-100 p-6">
          <div className="flex items-center gap-2 text-indigo-600 mb-4">
            <Calendar size={20} />
            <h2 className="text-lg font-semibold">Foco da Semana</h2>
          </div>
          <div className="prose prose-gray max-w-none">
            {briefing.weekOverview.split('\n').map((paragraph, i) => (
              paragraph.trim() && (
                <p key={i} className="text-gray-700 leading-relaxed mb-3 last:mb-0"
                   dangerouslySetInnerHTML={{ 
                     __html: paragraph
                       .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                       .replace(/\*(.+?)\*/g, '<em>$1</em>')
                   }} 
                />
              )
            ))}
          </div>
        </section>
      )}

      {/* Immediate Attention */}
      {briefing.immediateAttention && briefing.immediateAttention.length > 0 && (
        <section className="bg-amber-50 rounded-xl border border-amber-200 p-6">
          <div className="flex items-center gap-2 text-amber-700 mb-4">
            <Zap size={20} />
            <h2 className="text-lg font-semibold">Atencao Imediata</h2>
          </div>
          <ul className="space-y-3">
            {briefing.immediateAttention.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <AlertTriangle size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700"
                      dangerouslySetInnerHTML={{ 
                        __html: item
                          .replace(/^[-•]\s*/, '')
                          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\*(.+?)\*/g, '<em>$1</em>')
                      }} 
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Blockers */}
      {briefing.blockers && briefing.blockers.length > 0 && (
        <section className="bg-red-50 rounded-xl border border-red-200 p-6">
          <div className="flex items-center gap-2 text-red-700 mb-4">
            <XCircle size={20} />
            <h2 className="text-lg font-semibold">Blockers Ativos</h2>
          </div>
          <ul className="space-y-3">
            {briefing.blockers.map((blocker, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-red-200 text-red-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {i + 1}
                </div>
                <span className="text-gray-700"
                      dangerouslySetInnerHTML={{ 
                        __html: blocker
                          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\*(.+?)\*/g, '<em>$1</em>')
                      }} 
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Team Initiatives */}
      {briefing.teamInitiatives && (briefing.teamInitiatives.subscriptions?.length > 0 || briefing.teamInitiatives.b2b?.length > 0) && (
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-2 text-teal-600 mb-4">
            <Users size={20} />
            <h2 className="text-lg font-semibold">Iniciativas dos Times</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Subscriptions Column */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-blue-800">Subscriptions</h3>
                <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                  {briefing.teamInitiatives.subscriptions?.length || 0} issues
                </span>
              </div>
              {briefing.teamInitiatives.subscriptions && briefing.teamInitiatives.subscriptions.length > 0 ? (
                <ul className="space-y-2">
                  {briefing.teamInitiatives.subscriptions.slice(0, 8).map((issue, i) => (
                    <li key={i} className="bg-white rounded-md p-2 border border-blue-100 text-sm">
                      <div className="flex items-start gap-2">
                        <a 
                          href={issue.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1 flex-shrink-0"
                        >
                          {issue.key}
                          <ExternalLink size={10} />
                        </a>
                        <span className="text-gray-700 truncate flex-1" title={issue.title}>
                          {issue.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${getStatusColor(issue.status)}`}>
                          {issue.status}
                        </span>
                        {issue.assignee && issue.assignee !== '-' && (
                          <span className="text-xs text-gray-500 truncate">
                            {issue.assignee}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 italic">Nenhuma issue em andamento</p>
              )}
            </div>

            {/* B2B Column */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-4 border border-emerald-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-emerald-800">B2B</h3>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                  {briefing.teamInitiatives.b2b?.length || 0} issues
                </span>
              </div>
              {briefing.teamInitiatives.b2b && briefing.teamInitiatives.b2b.length > 0 ? (
                <ul className="space-y-2">
                  {briefing.teamInitiatives.b2b.slice(0, 8).map((issue, i) => (
                    <li key={i} className="bg-white rounded-md p-2 border border-emerald-100 text-sm">
                      <div className="flex items-start gap-2">
                        <a 
                          href={issue.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-emerald-600 hover:text-emerald-800 font-medium inline-flex items-center gap-1 flex-shrink-0"
                        >
                          {issue.key}
                          <ExternalLink size={10} />
                        </a>
                        <span className="text-gray-700 truncate flex-1" title={issue.title}>
                          {issue.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${getStatusColor(issue.status)}`}>
                          {issue.status}
                        </span>
                        {issue.assignee && issue.assignee !== '-' && (
                          <span className="text-xs text-gray-500 truncate">
                            {issue.assignee}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 italic">Nenhuma issue em andamento</p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Jira Overview */}
      {((briefing.jiraInProgress && briefing.jiraInProgress.length > 0) || (briefing.jiraPending && briefing.jiraPending.length > 0)) && (
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-2 text-purple-600 mb-4">
            <Briefcase size={20} />
            <h2 className="text-lg font-semibold">Jira Overview</h2>
          </div>
          
          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-sm text-purple-600 font-medium mb-1">Em Andamento</div>
              <div className="text-2xl font-bold text-gray-800">{briefing.jiraInProgress?.length || 0}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 font-medium mb-1">Pendentes</div>
              <div className="text-2xl font-bold text-gray-800">{briefing.jiraPending?.length || 0}</div>
            </div>
          </div>

          {/* High Priority Issues */}
          {(() => {
            const highPriorityIssues = [
              ...(briefing.jiraInProgress || []),
              ...(briefing.jiraPending || [])
            ].filter(issue => {
              const p = issue.priority?.toLowerCase();
              return p === 'highest' || p === 'high' || p === 'alta';
            });
            
            if (highPriorityIssues.length > 0) {
              return (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <AlertTriangle size={16} className="text-red-500" />
                    Prioridades Altas ({highPriorityIssues.length})
                  </h3>
                  <ul className="space-y-2">
                    {highPriorityIssues.slice(0, 5).map((issue, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm">
                        <a 
                          href={issue.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1"
                        >
                          {issue.key}
                          <ExternalLink size={12} />
                        </a>
                        <span className="text-gray-700 truncate flex-1" title={issue.title}>
                          {issue.title}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(issue.priority)}`}>
                          {issue.priority}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }
            return null;
          })()}

          {/* Recently Updated */}
          {briefing.jiraInProgress && briefing.jiraInProgress.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Clock size={16} className="text-blue-500" />
                Atualizados Recentemente
              </h3>
              <ul className="space-y-2">
                {briefing.jiraInProgress
                  .filter(issue => issue.updated)
                  .slice(0, 3)
                  .map((issue, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <a 
                        href={issue.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1"
                      >
                        {issue.key}
                        <ExternalLink size={12} />
                      </a>
                      <span className="text-gray-700 truncate flex-1" title={issue.title}>
                        {issue.title}
                      </span>
                      <span className="text-xs text-gray-500">{issue.updated}</span>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {/* Pending without assignee */}
          {(() => {
            const unassigned = (briefing.jiraPending || []).filter(issue => !issue.assignee || issue.assignee === '-');
            if (unassigned.length > 0) {
              return (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Users size={16} className="text-amber-500" />
                    Sem Responsavel ({unassigned.length})
                  </h3>
                  <ul className="space-y-2">
                    {unassigned.slice(0, 3).map((issue, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm">
                        <a 
                          href={issue.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1"
                        >
                          {issue.key}
                          <ExternalLink size={12} />
                        </a>
                        <span className="text-gray-700 truncate flex-1" title={issue.title}>
                          {issue.title}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }
            return null;
          })()}
        </section>
      )}

      {/* Proposed Todos */}
      {briefing.proposedTodos && briefing.proposedTodos.length > 0 && (() => {
        const unapprovedIndices = briefing.proposedTodos
          .map((todo, i) => todo.approved ? null : i)
          .filter((i): i is number => i !== null);
        const unapprovedCount = unapprovedIndices.length;
        const allSelected = unapprovedCount > 0 && unapprovedIndices.every(i => approvedTodos.has(i));
        
        return (
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle size={20} />
                <h2 className="text-lg font-semibold">To-Do's Sugeridos</h2>
              </div>
              {unapprovedCount > 0 && (
                <label 
                  className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 hover:text-gray-800"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input 
                    type="checkbox" 
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Selecionar todos ({unapprovedCount})</span>
                </label>
              )}
            </div>
            <p className="text-sm text-gray-500">
              Selecione os itens que deseja adicionar as suas tarefas de hoje
            </p>
          </div>
          
          <div className="p-4 space-y-2">
            {briefing.proposedTodos.map((todo, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-lg transition-all ${
                  todo.approved 
                    ? 'bg-green-50 opacity-60' 
                    : approvedTodos.has(index) 
                      ? 'bg-blue-50 border border-blue-200' 
                      : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    checked={todo.approved || approvedTodos.has(index)}
                    disabled={todo.approved}
                    onChange={() => !todo.approved && toggleTodoApproval(index)}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className={`text-xs px-2 py-1 rounded font-medium ${
                    todo.priority === 'P1' 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {todo.priority}
                  </span>
                  <span 
                    className={`flex-1 ${todo.approved ? 'line-through text-gray-400' : 'text-gray-700'} ${
                      todo.description && !todo.approved ? 'cursor-pointer hover:text-gray-900' : ''
                    }`}
                    onClick={(e) => todo.description && !todo.approved && toggleDescription(index, e)}
                  >
                    {todo.text}
                  </span>
                  {todo.description && !todo.approved && (
                    <button
                      onClick={(e) => toggleDescription(index, e)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      title={expandedDescriptions.has(index) ? 'Ocultar detalhes' : 'Ver detalhes'}
                    >
                      {expandedDescriptions.has(index) ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>
                  )}
                  {todo.approved && (
                    <span className="text-xs text-green-600 font-medium bg-green-100 px-2 py-1 rounded">
                      Adicionado
                    </span>
                  )}
                </div>
                {todo.description && expandedDescriptions.has(index) && (
                  <p className={`mt-2 ml-8 text-sm ${todo.approved ? 'text-gray-400' : 'text-gray-500'} bg-gray-50 p-2 rounded border-l-2 border-gray-300`}>
                    {todo.description}
                  </p>
                )}
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-3">
            <button 
              onClick={approveSelectedTodos}
              disabled={approvedTodos.size === 0}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <CheckCircle size={18} />
              Adicionar Selecionados ({approvedTodos.size})
            </button>
            <button 
              onClick={discardProposedTodos}
              className="px-4 py-2.5 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
            >
              Descartar
            </button>
          </div>
        </section>
        );
      })()}
    </div>
  );
}
