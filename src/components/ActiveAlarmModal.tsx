import React, { useEffect } from 'react';
import { 
  BellRing, 
  Phone, 
  MessageCircle, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Volume2, 
  VolumeX, 
  X, 
  MapPin, 
  User 
} from 'lucide-react';
import { AppointmentRecord } from '../types';
import { soundEngine } from '../utils/audio';
import { cleanPhoneNumber } from '../utils/whatsapp';

interface ActiveAlarmModalProps {
  isOpen: boolean;
  appointment: AppointmentRecord | null;
  onClose: () => void;
  onSnooze: (aptId: string, minutes: number) => void;
  onMarkAttended: (aptId: string) => void;
}

export const ActiveAlarmModal: React.FC<ActiveAlarmModalProps> = ({
  isOpen,
  appointment,
  onClose,
  onSnooze,
  onMarkAttended,
}) => {
  useEffect(() => {
    if (!isOpen || !appointment) return;

    // Play sound immediately
    soundEngine.playAlarm(appointment.alarmSound || 'campana');

    // Announce via speech synth if supported
    soundEngine.speakText(`Atención asesor: Cita programada con ${appointment.leadName}`);

    // Pulse sound every 4.5 seconds for attention
    const interval = setInterval(() => {
      soundEngine.playAlarm(appointment.alarmSound || 'campana');
    }, 4500);

    return () => clearInterval(interval);
  }, [isOpen, appointment]);

  if (!isOpen || !appointment) return null;

  const phoneForWa = cleanPhoneNumber(appointment.leadPhone || '7751280009');
  const waText = `¡Hola ${appointment.leadName}! Te contacto puntualmente para nuestra ${
    appointment.type === 'cita_visita' ? 'visita inmobiliaria' : 'llamada de asesoría'
  } programada para hoy. ¿Estás listo?`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Container with glowing alert outline */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-amber-500 overflow-hidden text-slate-900 animate-in zoom-in-95 duration-150 ring-8 ring-amber-500/20">
        
        {/* Animated Top Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-5 text-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center animate-bounce shadow-md">
              <BellRing className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-black tracking-widest uppercase bg-slate-950/20 px-2 py-0.5 rounded-md text-slate-950">
                ¡ALERTA SONORA DE CITA!
              </span>
              <h3 className="text-xl font-black tracking-tight leading-none mt-1">
                Recordatorio de Actividad
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-950/20 hover:bg-slate-950/40 text-slate-950 flex items-center justify-center transition-colors"
            title="Silenciar y cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          
          {/* Main Title & Lead Info */}
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-black">
              <Clock className="w-3.5 h-3.5" />
              <span>Programada a las {appointment.time} hrs ({appointment.date})</span>
            </div>
            
            <h4 className="text-xl font-black text-slate-900 pt-1">
              {appointment.title}
            </h4>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-700 font-semibold pt-1">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4 text-slate-400" />
                {appointment.leadName}
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1 font-mono text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                {appointment.leadPhone}
              </span>
            </div>
          </div>

          {/* Details Pill */}
          {appointment.notes && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 leading-relaxed font-medium">
              <strong className="text-slate-900 block mb-0.5">Notas del Compromiso:</strong>
              {appointment.notes}
            </div>
          )}

          {/* Quick Contact Primary Actions */}
          <div className="grid grid-cols-2 gap-3">
            <a
              href={`https://wa.me/${phoneForWa}?text=${encodeURIComponent(waText)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-95 text-center"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Enviar WhatsApp</span>
            </a>

            <a
              href={`tel:${appointment.leadPhone}`}
              onClick={onClose}
              className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-95 text-center"
            >
              <Phone className="w-4 h-4" />
              <span>Llamar Ahora</span>
            </a>
          </div>

          {/* Secondary Actions: Snooze / Mark as Completed */}
          <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2">
            
            {/* Snooze 5 min */}
            <button
              onClick={() => onSnooze(appointment.id, 5)}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Posponer 5 minutos</span>
            </button>

            {/* Mark as Completed */}
            <button
              onClick={() => onMarkAttended(appointment.id)}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-black transition-colors"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Marcar como Atendida</span>
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};
