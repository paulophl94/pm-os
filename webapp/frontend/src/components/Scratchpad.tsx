import { useState, useEffect } from 'react';
import { StickyNote, X, Save, Loader2 } from 'lucide-react';
import { useToast } from './Toast';

interface ScratchpadProps {
  content: string;
  onChange: (content: string) => void;
}

export function Scratchpad({ content, onChange }: ScratchpadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localContent, setLocalContent] = useState(content);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { showSuccess, showError } = useToast();

  // Load scratchpad content on mount
  useEffect(() => {
    const loadScratchpad = async () => {
      try {
        const response = await fetch('/api/workspace/scratchpad');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.content) {
            setLocalContent(data.content);
            onChange(data.content);
          }
        }
      } catch (error) {
        console.error('Failed to load scratchpad:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadScratchpad();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    onChange(localContent);
    try {
      const response = await fetch('/api/workspace/scratchpad', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: localContent }),
      });
      if (response.ok) {
        showSuccess('Notas salvas');
      } else {
        showError('Erro ao salvar notas');
      }
    } catch (error) {
      console.error('Failed to save scratchpad:', error);
      showError('Erro ao salvar notas');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <StickyNote size={18} />
        <span>Notas rápidas</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <div className="absolute right-0 top-0 w-80 bg-yellow-50 border border-yellow-200 rounded-lg shadow-lg z-50">
        <div className="flex items-center justify-between p-2 border-b border-yellow-200">
          <span className="text-sm font-medium text-yellow-800 flex items-center gap-2">
            <StickyNote size={16} />
            Scratchpad
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="p-1 hover:bg-yellow-100 rounded text-yellow-700 disabled:opacity-50"
              title="Salvar"
            >
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-yellow-100 rounded text-yellow-700"
            >
              <X size={16} />
            </button>
          </div>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 size={24} className="animate-spin text-yellow-600" />
          </div>
        ) : (
          <textarea
            value={localContent}
            onChange={(e) => setLocalContent(e.target.value)}
            placeholder="Anote algo rapidamente..."
            className="w-full h-40 p-3 text-sm bg-transparent resize-none focus:outline-none"
          />
        )}
      </div>
    </div>
  );
}
