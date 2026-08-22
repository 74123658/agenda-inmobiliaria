import React from 'react';
import { 
  ShieldCheck, 
  Calendar, 
  MessageCircle, 
  Building, 
  User, 
  ThumbsUp, 
  Plus,
  Send
} from 'lucide-react';
import { VisitRecord, LeadItem } from '../types';
import { generateOwnerVisitReportText, generateWhatsAppUrl } from '../utils/whatsapp';

interface VisitsListProps {
  visits: VisitRecord[];
  leads: LeadItem[];
  onOpenVisitLogger: () => void;
}

export const VisitsList: React.FC<VisitsListProps> = ({
  visits,
  leads,
  onOpenVisitLogger,
}) => {
  const handleResendReport = (visit: VisitRecord) => {
    // Find matching owner for this property
    const matchingOwner = leads.find(
      (l) => l.type === 'dueno' && (l.propertyTitle === visit.propertyTitle || l.id === visit.leadId)
    );

    if (matchingOwner?.phone) {
      const text = generateOwnerVisitReportText(matchingOwner, visit);
      const url = generateWhatsAppUrl(matchingOwner.phone, text);
      window.open(url, '_blank');
    } else {
      alert('No se encontró el teléfono del propietario para esta propiedad.');
    }
  };

  const getInterestBadge = (level: string) => {
    switch (level) {
      case 'muy_alto':
        return <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300">🔥 Interés Muy Alto / Oferta</span>;
      case 'interesado':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">👍 Interesado</span>;
      case 'lo_pensara':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-300">🤔 Lo Pensará</span>;
      case 'descartado':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300">❌ Descartado</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs bg-slate-100 text-slate-700 font-bold border border-slate-200">{level}</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white border border-slate-300 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-['Outfit',sans-serif]">
              Bitácora de Visitas & Reporte a Propietarios
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Mantén informados a los dueños con informes profesionales en 1 clic
            </p>
          </div>
        </div>

        <button
          onClick={onOpenVisitLogger}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all hover:scale-[1.02] active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>+ Registrar Nueva Visita</span>
        </button>
      </div>

      {/* Visits List */}
      {visits.length === 0 ? (
        <div className="bg-white border border-slate-300 rounded-2xl p-8 text-center max-w-md mx-auto shadow-sm">
          <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-900 mb-1">No hay visitas registradas</h4>
          <p className="text-xs text-slate-500 mb-4 font-medium">
            Cada vez que muestres una propiedad, regístrala aquí para enviar el reporte de feedback al dueño.
          </p>
          <button
            onClick={onOpenVisitLogger}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-emerald-800 border border-slate-300 text-xs font-bold transition-colors"
          >
            Registrar Primera Visita
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {visits.map((vis) => (
            <div
              key={vis.id}
              className="bg-white border border-slate-300 hover:border-slate-400 rounded-2xl p-5 shadow-sm flex flex-col justify-between gap-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
                    📅 {vis.date} {vis.time ? `• ${vis.time}` : ''}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    {vis.propertyTitle}
                  </h3>
                </div>

                <div>
                  {getInterestBadge(vis.interestLevel)}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Prospecto</span>
                  <span className="font-bold text-sky-800 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-sky-600" /> {vis.clientName}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Percepción de Precio</span>
                  <span className="font-bold text-slate-800 capitalize">
                    {vis.priceFeedback === 'justo' ? '✓ Precio Justo' : vis.priceFeedback === 'atractivo' ? '🌟 Oportunidad' : '⚠️ Ligeramente Alto'}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Estado del Inmueble</span>
                  <span className="font-bold text-slate-800 capitalize">
                    {vis.conditionFeedback.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {vis.clientComments && (
                <div className="text-xs bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-800">
                  <span className="text-[11px] font-bold text-slate-600 block mb-0.5">Comentarios de la visita:</span>
                  <p className="italic font-medium">"{vis.clientComments}"</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                <span className="text-slate-500 text-[11px] font-medium">
                  {vis.notifiedOwnerAt ? '✓ Reporte enviado al propietario por WhatsApp' : 'Pendiente de enviar reporte'}
                </span>

                <button
                  onClick={() => handleResendReport(vis)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Re-enviar Reporte a Dueño por WhatsApp</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
