'use client';

import { useState, useEffect } from 'react';
import { Dumbbell, Utensils, Flame, Droplets } from 'lucide-react';
import {
  useGetDailyLogQuery,
  useSaveWorkoutMutation,
  useSaveNutritionMutation,
  useLazyGetWorkoutPlanQuery,
} from '../slices/healthApiSlice';
import { Workout, Nutrition } from '../types/healthTypes';
import { MuscleMatrix } from './MuscleMatrix';
import { BiometricTrendlines } from './BiometricTrendlines';
import { PRTerminal } from './PRTerminal';

export default function Health() {
  const [activeTab, setActiveTab] = useState<'workout' | 'nutrition'>('workout');
  const today = new Date().toISOString().split('T')[0];

  // RTK Query hooks
  const { data: dailyLog, isLoading: isLogLoading } = useGetDailyLogQuery(today);
  const [saveWorkout, { isLoading: isSavingWorkout }] = useSaveWorkoutMutation();
  const [saveNutrition, { isLoading: isSavingNutrition }] = useSaveNutritionMutation();
  const [triggerGetPlan, { isFetching: isFetchingPlan }] = useLazyGetWorkoutPlanQuery();

  // Form States
  const [workout, setWorkout] = useState<Workout>({
    routine_name: '',
    duration_mins: 45,
    exercises: '',
    intensity: 7,
  });

  const [nutrition, setNutrition] = useState<Nutrition>({
    calories: 0,
    protein_grams: 0,
    water_liters: 0,
    notes: '',
  });

  // Sync log data with form state
  useEffect(() => {
    if (dailyLog) {
      if (dailyLog.nutrition) {
        setNutrition((prev) => ({ ...prev, ...dailyLog.nutrition }));
      }
      if (dailyLog.workout) {
        setWorkout((prev) => ({ ...prev, ...dailyLog.workout }));
      } else {
        // If no workout logged, try to fetch plan for today
        const dayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        triggerGetPlan(dayName).then(({ data }) => {
          if (data) {
            setWorkout((prev) => ({
              ...prev,
              routine_name: data.routine_name,
              exercises: data.exercises,
            }));
          }
        });
      }
    }
  }, [dailyLog, triggerGetPlan]);

  const handleSaveWorkout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveWorkout({ date: today, ...workout }).unwrap();
    } catch (err) {
      console.error('Failed to save workout:', err);
    }
  };

  const handleSaveNutrition = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveNutrition({ date: today, ...nutrition }).unwrap();
    } catch (err) {
      console.error('Failed to save nutrition:', err);
    }
  };

  const importRoutine = async () => {
    const dayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    try {
      const { data } = await triggerGetPlan(dayName);
      if (data) {
        setWorkout((prev) => ({
          ...prev,
          routine_name: data.routine_name,
          exercises: data.exercises,
        }));
      } else {
        alert(`No plan found for ${dayName}. Go to Settings to define it.`);
      }
    } catch (err) {
      console.error('Failed to import routine:', err);
    }
  };

  const isLoading = isLogLoading || isSavingWorkout || isSavingNutrition || isFetchingPlan;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Flame className="text-orange-500" />
          Physical Protocol
        </h1>
        <p className="text-muted-foreground mt-1">Track your biological inputs and outputs.</p>
      </div>

      {/* Top Section: Biometric Trendlines */}
      <BiometricTrendlines />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* LEFT COLUMN (60% -> 3/5 cols) */}
        <div className="lg:col-span-3 space-y-6">
          {/* TABS */}
          <div className="flex p-1 bg-input rounded-xl border border-border w-full md:w-fit transition-colors">
            <button
              onClick={() => setActiveTab('workout')}
              className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                activeTab === 'workout'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Dumbbell size={16} /> Workout
            </button>
            <button
              onClick={() => setActiveTab('nutrition')}
              className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                activeTab === 'nutrition'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Utensils size={16} /> Nutrition
            </button>
          </div>

          {/* --- WORKOUT FORM --- */}
          {activeTab === 'workout' && (
            <form
              onSubmit={handleSaveWorkout}
              className="bg-card p-6 rounded-2xl space-y-4 shadow-sm animate-in fade-in duration-300"
            >
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={importRoutine}
                  className="text-xs flex items-center gap-2 bg-orange-500/10 text-orange-600 dark:text-orange-400 px-3 py-1.5 rounded-lg hover:bg-orange-500/20 transition-all font-medium"
                >
                  <Dumbbell size={12} />
                  Load Today's Routine
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1 font-medium">Routine Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Push Day / Cardio"
                    className="w-full bg-input border border-border rounded-xl p-3 text-foreground placeholder-muted-foreground/50 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all duration-200"
                    value={workout.routine_name}
                    onChange={(e) => setWorkout({ ...workout, routine_name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1 font-medium">Duration (Mins)</label>
                  <input
                    type="number"
                    className="w-full bg-input border border-border rounded-xl p-3 text-foreground placeholder-muted-foreground/50 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all duration-200"
                    value={workout.duration_mins}
                    onChange={(e) =>
                      setWorkout({ ...workout, duration_mins: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-muted-foreground mb-1 font-medium">Exercises & Stats</label>
                <textarea
                  placeholder="Bench: 80kg 3x8&#10;Incline: 30kg 3x12..."
                  className="w-full h-32 bg-input border border-border rounded-xl p-3 text-foreground placeholder-muted-foreground/50 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none resize-none font-mono text-sm transition-all duration-200"
                  value={workout.exercises}
                  onChange={(e) => setWorkout({ ...workout, exercises: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs text-muted-foreground mb-1 font-medium">
                  Intensity (1-10): {workout.intensity}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  className="w-full accent-orange-500 cursor-pointer"
                  value={workout.intensity}
                  onChange={(e) =>
                    setWorkout({ ...workout, intensity: parseInt(e.target.value) || 1 })
                  }
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-50 cursor-pointer shadow-sm hover:shadow"
              >
                {isLoading ? 'Processing...' : 'Log Workout'}
              </button>
            </form>
          )}

          {/* --- NUTRITION FORM --- */}
          {activeTab === 'nutrition' && (
            <form
              onSubmit={handleSaveNutrition}
              className="bg-card p-6 rounded-2xl space-y-4 shadow-sm animate-in fade-in duration-300"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1 font-medium">Calories (kcal)</label>
                  <input
                    type="number"
                    className="w-full bg-input border border-border rounded-xl p-3 text-foreground placeholder-muted-foreground/50 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all duration-200"
                    value={nutrition.calories}
                    onChange={(e) =>
                      setNutrition({ ...nutrition, calories: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1 font-medium">Protein (g)</label>
                  <input
                    type="number"
                    className="w-full bg-input border border-border rounded-xl p-3 text-foreground placeholder-muted-foreground/50 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all duration-200"
                    value={nutrition.protein_grams}
                    onChange={(e) =>
                      setNutrition({ ...nutrition, protein_grams: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1 font-medium flex items-center gap-1">
                    <Droplets size={12} className="text-blue-500" /> Water (L)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full bg-input border border-border rounded-xl p-3 text-foreground placeholder-muted-foreground/50 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all duration-200"
                    value={nutrition.water_liters}
                    onChange={(e) =>
                      setNutrition({ ...nutrition, water_liters: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-muted-foreground mb-1 font-medium">Meals / Notes</label>
                <textarea
                  placeholder="Breakfast: Eggs&#10;Lunch: Chicken..."
                  className="w-full h-32 bg-input border border-border rounded-xl p-3 text-foreground placeholder-muted-foreground/50 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none resize-none font-mono text-sm transition-all duration-200"
                  value={nutrition.notes}
                  onChange={(e) => setNutrition({ ...nutrition, notes: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-50 cursor-pointer shadow-sm hover:shadow"
              >
                {isLoading ? 'Processing...' : 'Log Nutrition'}
              </button>
            </form>
          )}
        </div>

        {/* RIGHT COLUMN (40% -> 2/5 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <MuscleMatrix />
          <PRTerminal />
        </div>
      </div>
    </div>
  );
}
