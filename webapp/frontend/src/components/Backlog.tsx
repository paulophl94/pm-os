import { useState, useEffect } from 'react';
import { Archive, RefreshCw, ArrowUp, Loader2, Inbox } from 'lucide-react';
import { useToast } from './Toast';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: 'P1' | 'P2' | 'P3' | null;
  section: string;
}

export function Backlog() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [promotingTasks, setPromotingTasks] = useState<Set<string>>(new Set());
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchBacklog();
  }, []);

  const fetchBacklog = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/todos/backlog');
      const data = await response.json();
      if (data.success) {
        setTasks(data.backlog.parsed || []);
      }
    } catch (error) {
      console.error('Failed to fetch backlog:', error);
    } finally {
      setLoading(false);
    }
  };

  const promoteToTodo = async (task: Task) => {
    setPromotingTasks(prev => new Set(prev).add(task.id));
    
    try {
      const response = await fetch(`/api/todos/promote/${task.id}`, {
        method: 'POST',
      });

      if (response.ok) {
        // Remove from backlog list
        setTasks(prev => prev.filter(t => t.id !== task.id));
        showSuccess('Tarefa movida para To-Do\'s');
      } else {
        showError('Erro ao promover tarefa');
      }
    } catch (error) {
      console.error('Failed to promote task:', error);
      showError('Erro ao promover tarefa');
    } finally {
      setPromotingTasks(prev => {
        const next = new Set(prev);
        next.delete(task.id);
        return next;
      });
    }
  };

  const groupedTasks = tasks.reduce((acc, task) => {
    const section = task.section || 'Outros';
    if (!acc[section]) acc[section] = [];
    acc[section].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

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
          <div className="p-2 bg-purple-100 rounded-lg">
            <Archive className="text-purple-600" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Backlog</h2>
            <p className="text-sm text-gray-500">Tarefas futuras e de baixa prioridade</p>
          </div>
        </div>
        <button
          onClick={fetchBacklog}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <RefreshCw size={16} />
          Sincronizar
        </button>
      </div>

      {/* Info */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-center gap-3">
        <ArrowUp className="text-purple-600" size={20} />
        <p className="text-purple-800 text-sm">
          Clique no icone <ArrowUp size={14} className="inline mx-1" /> para promover uma tarefa para To-Do's de hoje.
        </p>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {Object.entries(groupedTasks).map(([section, sectionTasks]) => (
          <div key={section} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-medium text-gray-700">{section}</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {sectionTasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center gap-3 p-4 hover:bg-gray-50 transition-all ${
                    promotingTasks.has(task.id) ? 'opacity-50 bg-purple-50' : ''
                  }`}
                >
                  <div className="w-4 h-4 rounded border-2 border-gray-300" />
                  <span className="flex-1 text-gray-700">{task.text}</span>
                  <button
                    onClick={() => promoteToTodo(task)}
                    disabled={promotingTasks.has(task.id)}
                    className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Promover para To-Do's"
                  >
                    {promotingTasks.has(task.id) ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <ArrowUp size={18} />
                    )}
                  </button>
                </div>
              ))}
              {sectionTasks.length === 0 && (
                <p className="p-4 text-sm text-gray-400 italic">Nenhuma tarefa nesta secao</p>
              )}
            </div>
          </div>
        ))}
        
        {Object.keys(groupedTasks).length === 0 && (
          <div className="text-center py-16">
            <Inbox size={64} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">Backlog vazio</h3>
            <p className="text-gray-400">Tarefas futuras aparecerão aqui</p>
          </div>
        )}
      </div>
    </div>
  );
}
