import { useState, useEffect } from 'react';
import { CheckSquare, Plus, RefreshCw, Loader2, MessageSquare, Send, ChevronDown, ChevronUp, Star, CheckCircle2 } from 'lucide-react';
import { useToast } from './Toast';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: 'P1' | 'P2' | 'P3' | null;
  section: string;
  starred: boolean;
}

interface TaskWithNotes extends Task {
  notes?: string[];
  notesExpanded?: boolean;
}

export function TodoList() {
  const [tasks, setTasks] = useState<TaskWithNotes[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'P1' | 'P2' | 'P3'>('P2');
  const [isAdding, setIsAdding] = useState(false);
  const [updatingTasks, setUpdatingTasks] = useState<Set<string>>(new Set());
  const [newNotes, setNewNotes] = useState<Record<string, string>>({});
  const [loadingNotes, setLoadingNotes] = useState<Set<string>>(new Set());
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/todos');
      const data = await response.json();
      if (data.success) {
        setTasks(data.tasks.parsed || []);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const newCompleted = !task.completed;
    
    // Optimistic update for immediate feedback
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, completed: newCompleted } : t
    ));
    setUpdatingTasks(prev => new Set(prev).add(id));

    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: newCompleted }),
      });

      if (!response.ok) {
        // Revert on failure
        setTasks(prev => prev.map(t => 
          t.id === id ? { ...t, completed: !newCompleted } : t
        ));
        showError('Erro ao atualizar tarefa');
      } else {
        // Refresh tasks to get updated sections (task moves between sections)
        await fetchTasks();
      }
    } catch (error) {
      console.error('Failed to update task:', error);
      // Revert on error
      setTasks(prev => prev.map(t => 
        t.id === id ? { ...t, completed: !newCompleted } : t
      ));
      showError('Erro ao atualizar tarefa');
    } finally {
      setUpdatingTasks(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const toggleStar = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const newStarred = !task.starred;
    
    // Optimistic update
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, starred: newStarred } : t
    ));

    try {
      const response = await fetch(`/api/todos/${id}/star`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        // Revert on failure
        setTasks(prev => prev.map(t => 
          t.id === id ? { ...t, starred: !newStarred } : t
        ));
        showError('Erro ao atualizar estrela');
      }
    } catch (error) {
      console.error('Failed to toggle star:', error);
      setTasks(prev => prev.map(t => 
        t.id === id ? { ...t, starred: !newStarred } : t
      ));
      showError('Erro ao atualizar estrela');
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) return;
    
    setIsAdding(true);
    
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: newTask, 
          priority: newTaskPriority,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.task) {
          setTasks(prev => [...prev, { ...data.task, starred: false }]);
        }
        setNewTask('');
        showSuccess('Tarefa adicionada');
        // Refresh to get accurate state from file
        await fetchTasks();
      } else {
        showError('Erro ao adicionar tarefa');
      }
    } catch (error) {
      console.error('Failed to add task:', error);
      showError('Erro ao adicionar tarefa');
    } finally {
      setIsAdding(false);
    }
  };

  const toggleNotes = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const isExpanding = !task.notesExpanded;
    
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, notesExpanded: isExpanding } : t
    ));

    // Fetch notes if expanding and not loaded
    if (isExpanding && !task.notes) {
      setLoadingNotes(prev => new Set(prev).add(taskId));
      try {
        const response = await fetch(`/api/todos/notes/${taskId}`);
        const data = await response.json();
        if (data.success) {
          setTasks(prev => prev.map(t => 
            t.id === taskId ? { ...t, notes: data.notes } : t
          ));
        }
      } catch (error) {
        console.error('Failed to fetch notes:', error);
      } finally {
        setLoadingNotes(prev => {
          const next = new Set(prev);
          next.delete(taskId);
          return next;
        });
      }
    }
  };

  const addNote = async (taskId: string) => {
    const noteText = newNotes[taskId]?.trim();
    if (!noteText) return;

    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    setLoadingNotes(prev => new Set(prev).add(taskId));

    try {
      const response = await fetch(`/api/todos/notes/${taskId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          taskText: task.text,
          note: noteText,
        }),
      });

      if (response.ok) {
        // Add note to local state
        const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        const newNote = `${time} - ${noteText}`;
        
        setTasks(prev => prev.map(t => 
          t.id === taskId ? { ...t, notes: [...(t.notes || []), newNote] } : t
        ));
        setNewNotes(prev => ({ ...prev, [taskId]: '' }));
        showSuccess('Nota adicionada');
      } else {
        showError('Erro ao adicionar nota');
      }
    } catch (error) {
      console.error('Failed to add note:', error);
      showError('Erro ao adicionar nota');
    } finally {
      setLoadingNotes(prev => {
        const next = new Set(prev);
        next.delete(taskId);
        return next;
      });
    }
  };

  // Separate starred tasks, completed tasks, and regular active tasks
  const starredTasks = tasks.filter(t => t.starred && !t.completed);
  const completedTasks = tasks.filter(t => t.completed);
  const regularTasks = tasks.filter(t => !t.starred && !t.completed);

  const groupedTasks = regularTasks.reduce((acc, task) => {
    const section = task.section || 'Outros';
    // Skip "Concluídas Hoje" section as completed tasks are shown separately
    if (section === 'Concluídas Hoje') return acc;
    if (!acc[section]) acc[section] = [];
    acc[section].push(task);
    return acc;
  }, {} as Record<string, TaskWithNotes[]>);

  const renderTask = (task: TaskWithNotes, showSection = false) => (
    <div key={task.id}>
      {/* Task Row */}
      <div
        className={`flex items-center gap-3 p-3 hover:bg-gray-50 transition-all ${
          task.completed ? 'opacity-60' : ''
        } ${updatingTasks.has(task.id) ? 'opacity-50' : ''}`}
      >
        {/* Star Button */}
        <button
          onClick={(e) => toggleStar(task.id, e)}
          className={`p-1 rounded transition-colors ${
            task.starred 
              ? 'text-yellow-500 hover:text-yellow-600' 
              : 'text-gray-300 hover:text-yellow-400'
          }`}
        >
          <Star size={18} fill={task.starred ? 'currentColor' : 'none'} />
        </button>

        {updatingTasks.has(task.id) ? (
          <Loader2 size={16} className="w-4 h-4 animate-spin text-blue-500" />
        ) : (
          <input
            type="checkbox"
            checked={task.completed}
            onChange={(e) => toggleTask(task.id, e as unknown as React.MouseEvent)}
            onClick={(e) => e.stopPropagation()}
            className="w-4 h-4 rounded border-gray-300 cursor-pointer"
          />
        )}
        {task.priority && (
          <span className={`text-xs px-2 py-0.5 rounded font-medium ${
            task.priority === 'P1' ? 'bg-red-100 text-red-700' :
            task.priority === 'P2' ? 'bg-yellow-100 text-yellow-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {task.priority}
          </span>
        )}
        <span 
          onClick={(e) => {
            e.stopPropagation();
            toggleNotes(task.id);
          }}
          className={`flex-1 cursor-pointer hover:text-blue-600 transition-colors ${task.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}
        >
          {task.text}
        </span>
        {showSection && task.section && (
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
            {task.section.replace(/^Hoje - /, '').replace(/\(.*\)/, '').trim()}
          </span>
        )}
        {/* Notes toggle button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleNotes(task.id);
          }}
          className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
            task.notesExpanded 
              ? 'bg-blue-100 text-blue-700' 
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
          }`}
        >
          <MessageSquare size={14} />
          {task.notes && task.notes.length > 0 && (
            <span className="font-medium">{task.notes.length}</span>
          )}
          {task.notesExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Notes Section (Expandable) */}
      {task.notesExpanded && (
        <div className="px-3 pb-3 bg-gray-50 border-t border-gray-100">
          {/* Notes List */}
          <div className="ml-10 space-y-2 mb-3 pt-3">
            {loadingNotes.has(task.id) ? (
              <div className="flex items-center gap-2 py-2 text-gray-500 text-sm">
                <Loader2 size={14} className="animate-spin" />
                Carregando notas...
              </div>
            ) : task.notes && task.notes.length > 0 ? (
              task.notes.map((note, i) => (
                <div key={i} className="text-sm text-gray-600 py-1.5 px-3 bg-white rounded border border-gray-200">
                  {note}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 italic py-1">Nenhuma nota ainda</p>
            )}
          </div>

          {/* Add Note Input */}
          <div className="ml-10 flex gap-2">
            <input
              type="text"
              value={newNotes[task.id] || ''}
              onChange={(e) => setNewNotes(prev => ({ ...prev, [task.id]: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && addNote(task.id)}
              placeholder="Adicionar nota..."
              className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => addNote(task.id)}
              disabled={!newNotes[task.id]?.trim() || loadingNotes.has(task.id)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingNotes.has(task.id) ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Send size={14} />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckSquare className="text-blue-600" size={24} />
          <h2 className="text-xl font-semibold text-gray-800">To-Do's</h2>
        </div>
        <button
          onClick={fetchTasks}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <RefreshCw size={16} />
          Sincronizar
        </button>
      </div>

      {/* Add Task */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !isAdding && addTask()}
          placeholder="Nova tarefa..."
          disabled={isAdding}
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />
        <select
          value={newTaskPriority}
          onChange={(e) => setNewTaskPriority(e.target.value as 'P1' | 'P2' | 'P3')}
          disabled={isAdding}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="P1">P1</option>
          <option value="P2">P2</option>
          <option value="P3">P3</option>
        </select>
        <button
          onClick={addTask}
          disabled={isAdding || !newTask.trim()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isAdding ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Plus size={18} />
          )}
          Adicionar
        </button>
      </div>

      {/* Starred Tasks - Priority Section */}
      {starredTasks.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-yellow-100 flex items-center gap-2">
            <Star className="text-yellow-500" size={20} fill="currentColor" />
            <h3 className="font-semibold text-gray-800">Prioridades do Dia</h3>
            <span className="text-sm text-gray-500">({starredTasks.length})</span>
          </div>
          <div className="divide-y divide-yellow-100">
            {starredTasks.map((task) => renderTask(task, true))}
          </div>
        </div>
      )}

      {/* Regular Task List */}
      <div className="space-y-4">
        {Object.entries(groupedTasks).map(([section, sectionTasks]) => (
          <div key={section} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-3 border-b border-gray-100 bg-gray-50">
              <h3 className="font-medium text-gray-700">{section}</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {sectionTasks.map((task) => renderTask(task))}
              {sectionTasks.length === 0 && (
                <p className="p-3 text-sm text-gray-400 italic">Nenhuma tarefa</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Completed Tasks Section */}
      {completedTasks.length > 0 && (
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200 shadow-sm overflow-hidden opacity-80">
          <div className="p-4 border-b border-gray-100 flex items-center gap-2">
            <CheckCircle2 className="text-green-500" size={20} />
            <h3 className="font-semibold text-gray-600">Concluídas</h3>
            <span className="text-sm text-gray-400">({completedTasks.length})</span>
          </div>
          <div className="divide-y divide-gray-100">
            {completedTasks.map((task) => renderTask(task, true))}
          </div>
        </div>
      )}
    </div>
  );
}
