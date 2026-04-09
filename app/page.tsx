"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Camera, ChevronRight, Plus, Minus, Droplet, Activity, User, Target, X, ImageIcon, Loader2 } from 'lucide-react';

// --- CONFIGURACIÓN BASE DE LA API ---
const API_URL = 'https://calorietrackerbackend-m0z5.onrender.com/api';

// ==========================================
// INTERFACES (TIPADOS PARA TYPESCRIPT)
// ==========================================

interface FormularioData {
  gender: string;
  edad: string;
  peso: string;
  altura: string;
  nivelActividad: string;
  cuello: string;
  cintura: string;
  cadera: string;
  meta: string;
  velocidadKgSemana: string;
}

interface Macros {
  Calories: number;
  Protein: number;
  Carbs: number;
  Fat: number;
  Fiber: number;
  Water: number;
}

interface DailyTrack {
  CaloriesCount: number;
  Protein: number;
  Carbs: number;
  Fat: number;
  Fiber: number;
  Water: number;
}

interface FoodLog {
  IDFoodLog?: string;
  Food: string;
  Calories: number;
  Protein: number;
  Carbs: number;
  Fat: number;
  Fiber: number;
}

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  
  // Estados tipados
  const [macros, setMacros] = useState<Macros | null>(null);
  const [dailyTrack, setDailyTrack] = useState<DailyTrack>({
    CaloriesCount: 0, Protein: 0, Carbs: 0, Fat: 0, Fiber: 0, Water: 0
  });
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);

  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    try {
      const res = await fetch(`${API_URL}/user/status`);
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      
      if (data.isRegistered) {
        setIsRegistered(true);
        setMacros(data.macros);
        setDailyTrack(data.dailyTrack);
        setFoodLogs(data.foodLogs);
      } else {
        setIsRegistered(false);
      }
    } catch (error) {
      console.warn("⚠️ No se pudo conectar al backend Go.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#100C08] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#FF9408] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#100C08] text-[#F3F4F5] font-sans selection:bg-[#FF9408] selection:text-[#100C08]">
      {!isRegistered ? (
        <OnboardingForm 
          onComplete={(newMacros) => {
            setMacros(newMacros);
            setIsRegistered(true);
          }} 
        />
      ) : (
        <Dashboard 
          macros={macros} 
          dailyTrack={dailyTrack} 
          setDailyTrack={setDailyTrack}
          foodLogs={foodLogs}
          setFoodLogs={setFoodLogs}
        />
      )}
    </div>
  );
};

// ==========================================
// VISTA 1: FORMULARIO DE REGISTRO
// ==========================================
interface OnboardingFormProps {
  onComplete: (macros: Macros, form: Partial<FormularioData>) => void;
}

const OnboardingForm: React.FC<OnboardingFormProps> = ({ onComplete }) => {
  const [formData, setFormData] = useState<FormularioData>({
    gender: '', edad: '', peso: '', altura: '', nivelActividad: '',
    cuello: '', cintura: '', cadera: '', meta: '', velocidadKgSemana: ''
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        edad: parseInt(formData.edad),
        peso: parseFloat(formData.peso),
        altura: parseInt(formData.altura),
        cuello: parseFloat(formData.cuello),
        cintura: parseFloat(formData.cintura),
        cadera: formData.cadera ? parseFloat(formData.cadera) : 0,
        velocidadKgSemana: formData.velocidadKgSemana ? parseFloat(formData.velocidadKgSemana) : 0
      };

      const res = await fetch(`${API_URL}/formulario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Error al guardar');
      
      window.location.reload(); 
    } catch (error) {
      console.warn("⚠️ Fallo fetch, usando mock para avanzar.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 md:py-12 animate-in fade-in duration-500">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold bg-linear-to-r from-[#FF9408] to-[#CA3F16] bg-clip-text text-transparent">
          Configura tu Perfil
        </h1>
        <p className="text-[#DBE0E1] mt-2">Calcularemos tus macros exactos usando inteligencia artificial.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-[#1A1512] p-6 rounded-3xl shadow-xl border border-[#CA3F16]/20">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1 md:col-span-2 flex gap-4 mb-2">
            <label className={`flex-1 flex justify-center p-3 rounded-xl border transition-all ${formData.gender === 'Hombre' ? 'bg-[#95122C]/20 border-[#CA3F16] text-[#FF9408]' : 'bg-[#100C08] border-transparent text-[#DBE0E1]'}`}>
              <input type="radio" name="gender" value="Hombre" className="hidden" onChange={handleChange} required /> Hombre
            </label>
            <label className={`flex-1 flex justify-center p-3 rounded-xl border transition-all ${formData.gender === 'Mujer' ? 'bg-[#95122C]/20 border-[#CA3F16] text-[#FF9408]' : 'bg-[#100C08] border-transparent text-[#DBE0E1]'}`}>
              <input type="radio" name="gender" value="Mujer" className="hidden" onChange={handleChange} required /> Mujer
            </label>
          </div>
          <input type="number" name="edad" placeholder="Edad" onChange={handleChange} required className="w-full bg-[#100C08] border border-[#CA3F16]/30 rounded-xl p-3 focus:border-[#FF9408] outline-none" />
          <input type="number" step="0.1" name="peso" placeholder="Peso (kg)" onChange={handleChange} required className="w-full bg-[#100C08] border border-[#CA3F16]/30 rounded-xl p-3 focus:border-[#FF9408] outline-none" />
          <input type="number" name="altura" placeholder="Altura (cm)" onChange={handleChange} required className="w-full bg-[#100C08] border border-[#CA3F16]/30 rounded-xl p-3 focus:border-[#FF9408] outline-none" />
          
          <select name="nivelActividad" onChange={handleChange} required className="w-full bg-[#100C08] border border-[#CA3F16]/30 rounded-xl p-3 focus:border-[#FF9408] outline-none appearance-none">
            <option value="">Nivel de Actividad</option>
            <option value="sedentario">Sedentario</option>
            <option value="ligero">Ligero</option>
            <option value="moderado">Moderado</option>
            <option value="activo">Activo</option>
            <option value="muy_activo">Muy Activo</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-[#CA3F16]/20 pt-6">
          <input type="number" step="0.1" name="cuello" placeholder="Cuello (cm)" onChange={handleChange} required className="w-full bg-[#100C08] border border-[#CA3F16]/30 rounded-xl p-3 focus:border-[#FF9408] outline-none" />
          <input type="number" step="0.1" name="cintura" placeholder="Cintura (cm)" onChange={handleChange} required className="w-full bg-[#100C08] border border-[#CA3F16]/30 rounded-xl p-3 focus:border-[#FF9408] outline-none" />
          {formData.gender === 'Mujer' && (
            <input type="number" step="0.1" name="cadera" placeholder="Cadera (cm)" onChange={handleChange} required className="w-full bg-[#100C08] border border-[#CA3F16]/30 rounded-xl p-3 focus:border-[#FF9408] outline-none col-span-2" />
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 border-t border-[#CA3F16]/20 pt-6">
          <select name="meta" onChange={handleChange} required className="w-full bg-[#100C08] border border-[#CA3F16]/30 rounded-xl p-3 focus:border-[#FF9408] outline-none appearance-none">
            <option value="">¿Cuál es tu meta?</option>
            <option value="bajar">Bajar de peso</option>
            <option value="mantenerse">Mantenerse</option>
            <option value="aumentar">Aumentar masa muscular</option>
          </select>
          {formData.meta && formData.meta !== 'mantenerse' && (
             <select name="velocidadKgSemana" onChange={handleChange} required className="w-full bg-[#100C08] border border-[#CA3F16]/30 rounded-xl p-3 focus:border-[#FF9408] outline-none appearance-none">
              <option value="">Ritmo (kg por semana)</option>
              <option value="0.25">0.25 kg</option>
              <option value="0.5">0.50 kg</option>
              <option value="1.0">1.00 kg</option>
            </select>
          )}
        </div>

        <button type="submit" disabled={isSubmitting} className="w-full py-4 mt-8 rounded-2xl font-bold text-lg text-white bg-linear-to-r from-[#FF9408] to-[#95122C] hover:opacity-90 transition-all flex justify-center items-center">
          {isSubmitting ? <Loader2 className="animate-spin" /> : 'Calcular Plan'}
        </button>
      </form>
    </div>
  );
};

// ==========================================
// VISTA 2: DASHBOARD PRINCIPAL
// ==========================================
interface DashboardProps {
  macros: Macros | null;
  dailyTrack: DailyTrack;
  setDailyTrack: React.Dispatch<React.SetStateAction<DailyTrack>>;
  foodLogs: FoodLog[];
  setFoodLogs: React.Dispatch<React.SetStateAction<FoodLog[]>>;
}

const Dashboard: React.FC<DashboardProps> = ({ macros, dailyTrack, setDailyTrack, foodLogs, setFoodLogs }) => {
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);

  const goalCalories = macros?.Calories || 2000;
  const eatenCalories = dailyTrack?.CaloriesCount || 0;
  const remainingCalories = goalCalories - eatenCalories;
  const calPercent = Math.min((eatenCalories / goalCalories) * 100, 100);

  const waterGoalMl = (macros?.Water || 2.5) * 1000; 
  const waterEaten = dailyTrack?.Water || 0;

  const handleWaterChange = async (amount: number) => {
    // 1. Actualización visual instantánea (Optimistic UI)
    const currentWater = dailyTrack?.Water || 0;
    const newWater = Math.max(0, currentWater + amount);
    setDailyTrack(prev => ({ ...prev, Water: newWater }));

    // 2. Petición silenciosa al backend
    try {
      const res = await fetch(`${API_URL}/track/water`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }) // mandamos 250 o -250
      });

      if (!res.ok) throw new Error('Error guardando agua');
      
      const data = await res.json();
      // 3. Sincronizamos con el valor real de la BD
      setDailyTrack(data.dia);
    } catch (error) {
      console.error("⚠️ Fallo al actualizar agua en BD:", error);
      // Opcional: Revertir si falla
      setDailyTrack(prev => ({ ...prev, Water: currentWater }));
    }
  };

  const handleNewFoodLog = (newLog: FoodLog, updatedTrack: DailyTrack) => {
    setFoodLogs(prev => [newLog, ...prev]);
    setDailyTrack(updatedTrack);
    setShowUploadModal(false);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#100C08] pb-24 animate-in fade-in">
      <header className="p-6 flex justify-between items-center sticky top-0 bg-[#100C08]/90 backdrop-blur-md z-10">
        <div>
          <h2 className="text-[#DBE0E1] text-sm">Resumen Diario</h2>
          <h1 className="text-2xl font-bold text-[#F3F4F5]">Hola Joel!</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#1A1512] border border-[#CA3F16]/50 flex items-center justify-center">
          <User size={20} className="text-[#FF9408]" />
        </div>
      </header>

      <div className="flex flex-col items-center gap-8 py-10 bg-[#0F0D0C] rounded-3xl p-8 shadow-2xl">
  
  {/* Contenedor Principal con Grid para alinear los datos laterales */}
  <div className="flex items-center justify-between w-full max-w-md">
    
    {/* Columna Izquierda: Comido */}
    <div className="text-center group">
      <span className="text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold mb-1 block group-hover:text-orange-400 transition-colors">Comido</span>
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold text-white leading-none">{eatenCalories}</span>
        <span className="text-[10px] text-gray-600 mt-1">kcal</span>
      </div>
    </div>

    {/* Centro: Gráfico Circular */}
    <div className="relative w-56 h-56 flex justify-center items-center">
      {/* SVG del Anillo */}
      <svg className="absolute w-full h-full transform -rotate-90 filter drop-shadow-[0_0_8px_rgba(149,18,44,0.3)]">
        {/* Círculo de Fondo (Track) */}
        <circle 
          cx="112" cy="112" r="95" 
          stroke="#1A1512" strokeWidth="14" fill="none" 
        />
        {/* Círculo de Progreso */}
        <circle 
          cx="112" cy="112" r="95" 
          stroke="url(#calorieGradient)" strokeWidth="14" fill="none" 
          strokeDasharray={2 * Math.PI * 95} 
          strokeDashoffset={(2 * Math.PI * 95) - ((2 * Math.PI * 95) * (Math.min(calPercent, 100) / 100))} 
          strokeLinecap="round" 
          className="transition-all duration-1000 ease-out" 
        />
        <defs>
          <linearGradient id="calorieGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF9408" />
            <stop offset="100%" stopColor="#95122C" />
          </linearGradient>
        </defs>
      </svg>

      {/* Texto Central */}
      <div className="text-center">
        <span className="text-xs uppercase tracking-widest text-gray-400 font-medium mb-1 block">Restantes</span>
        <div className="flex flex-col items-center">
          <span className="text-6xl font-black text-white tracking-tighter">
            {remainingCalories > 0 ? remainingCalories : 0}
          </span>
          <span className="text-sm font-light text-orange-500/80 -mt-1">KCAL</span>
        </div>
      </div>
    </div>

    {/* Columna Derecha: Objetivo */}
    <div className="text-center group">
      <span className="text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold mb-1 block group-hover:text-red-500 transition-colors">Objetivo</span>
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold text-white leading-none">{goalCalories}</span>
        <span className="text-[10px] text-gray-600 mt-1">kcal</span>
      </div>
    </div>

  </div>

  {/* Opcional: Barra de exceso si se pasa de la meta */}
  {calPercent > 100 && (
    <div className="px-4 py-1 bg-red-900/20 border border-red-900/50 rounded-full">
      <p className="text-[10px] text-red-500 font-bold uppercase tracking-tighter">¡Límite superado!</p>
    </div>
  )}
</div>

      <div className="px-6 py-4 grid grid-cols-4 gap-3">
        {[
          { name: 'Carbs', current: dailyTrack.Carbs, target: macros?.Carbs, color: '#FF9408' },
          { name: 'Proteína', current: dailyTrack.Protein, target: macros?.Protein, color: '#CA3F16' },
          { name: 'Grasas', current: dailyTrack.Fat, target: macros?.Fat, color: '#95122C' },
          { name: 'Fibra', current: dailyTrack.Fiber, target: macros?.Fiber, color: '#DBE0E1' }
        ].map((m, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="text-[10px] text-[#DBE0E1] mb-1 font-medium">{m.current}/{m.target}g</div>
            <div className="w-full h-2 rounded-full bg-[#1A1512] relative overflow-hidden">
              <div className="absolute top-0 left-0 h-full transition-all duration-1000" 
                style={{ width: `${Math.min(((m.current||0)/(m.target||1))*100, 100)}%`, backgroundColor: m.color }} />
            </div>
            <div className="text-xs mt-1 text-[#F3F4F5] font-medium">{m.name}</div>
          </div>
        ))}
      </div>

      <div className="px-6 py-6">
        <div className="bg-[#1A1512] rounded-2xl p-4 flex items-center justify-between border border-[#CA3F16]/20">
          <div className="flex-1 mr-4">
            <div className="flex justify-between items-end mb-2">
              <div className="flex items-center gap-2 text-[#F3F4F5]">
                <Droplet size={18} className="text-[#3b82f6]" />
                <span className="font-semibold">Agua (250mL)</span>
              </div>
              <span className="text-xs text-[#DBE0E1]">{(waterEaten/1000).toFixed(1)}L / {(waterGoalMl/1000).toFixed(1)}L</span>
            </div>
            <div className="w-full h-3 rounded-full overflow-hidden bg-[#100C08] border border-[#1A1512]">
              <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${Math.min((waterEaten/waterGoalMl)*100, 100)}%` }} />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => handleWaterChange(-250)} className="w-8 h-8 rounded-lg bg-[#100C08] border border-[#CA3F16]/30 flex justify-center items-center active:scale-95"><Minus size={16} /></button>
            <button onClick={() => handleWaterChange(250)} className="w-8 h-8 rounded-lg bg-[#CA3F16]/20 border border-[#CA3F16]/50 flex justify-center items-center text-[#FF9408] active:scale-95"><Plus size={16} /></button>
          </div>
        </div>
      </div>

      <div className="px-6 py-2">
        <h3 className="text-xl font-bold tracking-wide text-[#F3F4F5] mb-4">FOOD LOG</h3>
        <div className="space-y-4">
          {foodLogs.length === 0 && <p className="text-[#DBE0E1] text-center italic text-sm">No has registrado comidas hoy.</p>}
          {foodLogs.map((meal, idx) => (
            <div key={idx} className="bg-[#1A1512] rounded-2xl p-4 border border-[#CA3F16]/10 shadow-lg">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-[#F3F4F5] capitalize">{meal.Food}</h4>
                <span className="font-bold text-[#FF9408]">{meal.Calories} kcal</span>
              </div>
              <div className="flex justify-between border-t border-[#CA3F16]/10 pt-3">
                <div className="text-center flex-1 border-r border-[#CA3F16]/10"><div className="text-sm font-bold text-[#F3F4F5]">{meal.Protein}g</div><div className="text-[10px] text-[#DBE0E1] uppercase">Pro</div></div>
                <div className="text-center flex-1 border-r border-[#CA3F16]/10"><div className="text-sm font-bold text-[#F3F4F5]">{meal.Fat}g</div><div className="text-[10px] text-[#DBE0E1] uppercase">Gra</div></div>
                <div className="text-center flex-1 border-r border-[#CA3F16]/10"><div className="text-sm font-bold text-[#F3F4F5]">{meal.Fiber}g</div><div className="text-[10px] text-[#DBE0E1] uppercase">Fib</div></div>
                <div className="text-center flex-1"><div className="text-sm font-bold text-[#F3F4F5]">{meal.Carbs}g</div><div className="text-[10px] text-[#DBE0E1] uppercase">Carb</div></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-6 right-6 z-20">
        <button onClick={() => setShowUploadModal(true)} className="w-16 h-16 rounded-full bg-linear-to-r from-[#FF9408] to-[#95122C] shadow-[0_0_20px_rgba(202,63,22,0.5)] flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all">
          <Camera size={28} />
        </button>
      </div>

      {showUploadModal && <UploadModal onClose={() => setShowUploadModal(false)} onSuccess={handleNewFoodLog} />}
    </div>
  );
};

// ==========================================
// VISTA 3: MODAL DE REGISTRO CON IA
// ==========================================
interface UploadModalProps {
  onClose: () => void;
  onSuccess: (newLog: FoodLog, updatedTrack: DailyTrack) => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ onClose, onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [description, setDescription] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleAnalyze = async () => {
    if (!file || isUploading) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append('image', file);
    formData.append('description', description);

    try {
      const res = await fetch(`${API_URL}/track`, {
        method: 'POST',
        body: formData,
        keepalive: true, // Para evitar timeouts en análisis largos
      });

      if (!res.ok) throw new Error('Error IA');
      
      const data = await res.json();
      onSuccess(data.foodLog, data.dia);

    } catch (error) {
      console.warn("Error al analizar",error);
    }finally{
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center animate-in fade-in">
      <div className="bg-[#1A1512] w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 border border-[#CA3F16]/30 animate-in slide-in-from-bottom-10">
        
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-[#F3F4F5]">Registrar Comida</h3>
          <button onClick={onClose} className="text-[#DBE0E1] hover:text-white"><X size={24} /></button>
        </div>

        <div 
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-48 bg-[#100C08] rounded-2xl border-2 border-dashed border-[#CA3F16]/50 flex flex-col items-center justify-center text-[#DBE0E1] cursor-pointer overflow-hidden relative group"
        >
          {preview ? (
            <img src={preview} alt="Preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-50 transition-all" />
          ) : (
            <>
              <ImageIcon size={40} className="mb-2 text-[#FF9408]" />
              <span>Toca para tomar foto o subir</span>
            </>
          )}
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" capture="environment" className="hidden" />
        </div>

        <div className="mt-4">
          <label className="text-sm text-[#DBE0E1] mb-2 block">Descripción (Opcional pero ayuda a la IA)</label>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ej. Batido de proteínas con leche de almendras y plátano..."
            className="w-full bg-[#100C08] border border-[#CA3F16]/30 rounded-xl p-3 focus:border-[#FF9408] outline-none text-[#F3F4F5] resize-none h-24"
          />
        </div>

        <button 
          onClick={handleAnalyze}
          disabled={!file || isUploading}
          className="w-full mt-6 py-4 rounded-2xl font-bold text-white bg-linear-to-r from-[#FF9408] to-[#95122C] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isUploading ? <><Loader2 className="animate-spin" /> Analizando...</> : 'Analizar e Insertar'}
        </button>

      </div>
    </div>
  );
};

export default App;