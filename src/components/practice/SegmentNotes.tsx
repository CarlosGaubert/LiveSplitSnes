import React, { useState } from 'react';
import { BookOpen, Plus, Trash2, Eye, Check } from 'lucide-react';
import { PracticeSegment } from '../../types/practice';

interface SegmentNotesProps {
  segment: PracticeSegment;
  onUpdateNotes: (notes: string, cues: string[]) => void;
}

export const SegmentNotes: React.FC<SegmentNotesProps> = ({ segment, onUpdateNotes }) => {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesText, setNotesText] = useState(segment.notes);
  const [newCueText, setNewCueText] = useState('');

  const handleSaveNotes = () => {
    onUpdateNotes(notesText, segment.visualCues);
    setIsEditingNotes(false);
  };

  const handleAddCue = () => {
    if (!newCueText.trim()) return;
    const updatedCues = [...segment.visualCues, newCueText.trim()];
    onUpdateNotes(segment.notes, updatedCues);
    setNewCueText('');
  };

  const handleRemoveCue = (index: number) => {
    const updatedCues = segment.visualCues.filter((_, i) => i !== index);
    onUpdateNotes(segment.notes, updatedCues);
  };

  return (
    <div className="flex flex-col gap-2 p-3 bg-black/40 rounded-lg border border-white/10 select-none text-xs font-mono">
      {/* Strategy Notes */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-indigo-300 font-semibold">
          <BookOpen size={13} />
          <span>Estrategia / Setup:</span>
        </div>
        {!isEditingNotes ? (
          <button
            onClick={() => {
              setNotesText(segment.notes);
              setIsEditingNotes(true);
            }}
            className="text-[10px] text-white/50 hover:text-white underline"
          >
            Editar
          </button>
        ) : (
          <button
            onClick={handleSaveNotes}
            className="text-[10px] text-emerald-400 font-bold hover:underline flex items-center gap-1"
          >
            <Check size={11} />
            <span>Guardar</span>
          </button>
        )}
      </div>

      {isEditingNotes ? (
        <textarea
          value={notesText}
          onChange={(e) => setNotesText(e.target.value)}
          className="w-full bg-black/60 border border-white/20 rounded p-1.5 text-white/90 text-xs font-sans focus:outline-none focus:border-indigo-400 h-16 resize-none"
          placeholder="Escribe aquí notas o consejos para este truco..."
        />
      ) : (
        <p className="text-white/70 text-[11px] font-sans leading-relaxed bg-white/5 p-2 rounded border border-white/5">
          {segment.notes || <span className="italic text-white/30">Sin notas de estrategia configuradas.</span>}
        </p>
      )}

      {/* Visual Cues Checklist */}
      <div className="mt-1">
        <div className="flex items-center gap-1.5 text-amber-300 font-semibold text-[11px] mb-1.5">
          <Eye size={12} />
          <span>Puntos de referencia visual (Cues):</span>
        </div>

        <div className="flex flex-col gap-1">
          {segment.visualCues.map((cue, idx) => (
            <div
              key={idx}
              className="flex items-start justify-between gap-1.5 p-1.5 rounded bg-white/5 border border-white/5 group hover:bg-white/10 transition"
            >
              <div className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1 flex-shrink-0" />
                <span className="text-[11px] text-white/80 font-sans">{cue}</span>
              </div>
              <button
                onClick={() => handleRemoveCue(idx)}
                title="Eliminar referencia"
                className="text-white/20 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition p-0.5"
              >
                <Trash2 size={11} />
              </button>
            </div>
          ))}

          {/* Add Cue Input */}
          <div className="flex items-center gap-1 mt-1">
            <input
              type="text"
              value={newCueText}
              onChange={(e) => setNewCueText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCue()}
              placeholder="Nueva referencia visual..."
              className="flex-1 bg-black/60 border border-white/15 rounded px-2 py-1 text-[11px] text-white focus:outline-none focus:border-amber-400 font-sans"
            />
            <button
              onClick={handleAddCue}
              className="p-1 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition"
            >
              <Plus size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
