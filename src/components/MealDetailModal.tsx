import React, { useState, useEffect } from 'react';
import { MealItem } from '../types.ts';
import { playMechanicalClick, playBrassChime } from '../utils/audio.ts';

interface MealDetailModalProps {
  meal: MealItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (meal: MealItem) => void;
  onDelete: (id: string) => void;
}

export const MealDetailModal: React.FC<MealDetailModalProps> = ({
  meal,
  isOpen,
  onClose,
  onSave,
  onDelete,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [calories, setCalories] = useState(0);
  const [protein, setProtein] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [fats, setFats] = useState(0);

  useEffect(() => {
    if (meal) {
      setTitle(meal.title);
      setDescription(meal.description);
      setCalories(meal.calories);
      setProtein(meal.protein);
      setCarbs(meal.carbs);
      setFats(meal.fats);
    }
  }, [meal]);

  if (!isOpen || !meal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playMechanicalClick();
    playBrassChime();
    onSave({
      ...meal,
      title,
      description,
      calories,
      protein,
      carbs,
      fats,
    });
    onClose();
  };

  const handleDelete = () => {
    playMechanicalClick();
    if (confirm('Delete this journal record from the folio?')) {
      onDelete(meal.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl bg-surface-container-low p-6 md:p-8 shadow-[0_20px_50px_rgba(39,24,20,0.5),0_0_0_1px_rgba(255,255,255,0.7)] border border-outline-variant/80 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-outline-variant/60">
          <div className="flex items-center gap-3">
            <img
              src={meal.imageUrl}
              alt={meal.title}
              className="w-12 h-12 rounded-lg object-cover shadow-sm border border-outline-variant/60"
            />
            <div>
              <span className="font-label-sm text-label-sm text-surface-tint uppercase font-bold tracking-widest">
                {meal.categoryLabel} • {meal.time}
              </span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Refine Culinary Record</h3>
            </div>
          </div>
          <button
            onClick={() => {
              playMechanicalClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="font-label-sm uppercase font-bold text-on-surface-variant block mb-1">
              Course Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-surface-container-lowest text-on-surface font-title-md border border-outline-variant/60 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="font-label-sm uppercase font-bold text-on-surface-variant block mb-1">
              Ingredients &amp; Notes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-surface-container-lowest text-on-surface font-body-md border border-outline-variant/60 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-surface-container-lowest p-2.5 rounded-lg border border-outline-variant/50">
              <span className="font-label-sm text-primary uppercase font-bold block">Energy (kcal)</span>
              <input
                type="number"
                value={calories}
                onChange={(e) => setCalories(Number(e.target.value))}
                className="w-full bg-transparent font-title-lg font-bold text-on-surface focus:outline-none mt-1"
              />
            </div>
            <div className="bg-surface-container-lowest p-2.5 rounded-lg border border-outline-variant/50">
              <span className="font-label-sm text-primary uppercase font-bold block">Protein (g)</span>
              <input
                type="number"
                value={protein}
                onChange={(e) => setProtein(Number(e.target.value))}
                className="w-full bg-transparent font-title-lg font-bold text-on-surface focus:outline-none mt-1"
              />
            </div>
            <div className="bg-surface-container-lowest p-2.5 rounded-lg border border-outline-variant/50">
              <span className="font-label-sm text-secondary uppercase font-bold block">Carbs (g)</span>
              <input
                type="number"
                value={carbs}
                onChange={(e) => setCarbs(Number(e.target.value))}
                className="w-full bg-transparent font-title-lg font-bold text-on-surface focus:outline-none mt-1"
              />
            </div>
            <div className="bg-surface-container-lowest p-2.5 rounded-lg border border-outline-variant/50">
              <span className="font-label-sm text-tertiary uppercase font-bold block">Fats (g)</span>
              <input
                type="number"
                value={fats}
                onChange={(e) => setFats(Number(e.target.value))}
                className="w-full bg-transparent font-title-lg font-bold text-on-surface focus:outline-none mt-1"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-outline-variant/40 flex items-center justify-between">
            <button
              type="button"
              onClick={handleDelete}
              className="px-3.5 py-2 rounded-lg bg-surface-container text-error hover:bg-error-container font-label-md font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">delete</span>
              <span>Remove</span>
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  playMechanicalClick();
                  onClose();
                }}
                className="px-4 py-2 rounded-lg bg-surface-container-high text-on-surface font-label-md font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-primary text-on-primary font-label-md font-bold shadow-md cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
