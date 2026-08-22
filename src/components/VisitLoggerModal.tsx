import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  MessageCircle, 
  Sparkles, 
  Building, 
  User, 
  Calendar, 
  ThumbsUp, 
  DollarSign, 
  Clock,
  Send,
  FileText
} from 'lucide-react';
import { LeadItem, VisitRecord, StatusColor } from '../types';
import { generateOwnerVisitReportText, generateWhatsAppUrl } from '../utils/whatsapp';

interface VisitLoggerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveVisit: (visit: Omit<VisitRecord, 'id'>, updateLeadStatus?: StatusColor) => void;
  leads: LeadItem[];
  selectedLead?: LeadItem | null;
}

export const VisitLoggerModal: React.FC<VisitLoggerModalProps> = ({
  isOpen,
  onClose,
  onSaveVisit,
  leads,
  selectedLead,
}) => {
  const owners = leads.filter((l) => l.type === 'dueno');
  const buyers = leads.filter((l) => l.type === 'prospecto');

  const [selectedBuyerId, setSelectedBuyerId] = useState(
    selectedLead?.type === 'prospecto' ? selectedLead.id : buyers[0]?.id || ''
  );
  const [selectedOwnerId, setSelectedOwnerId] = useState(
    selectedLead?.type === 'dueno' ? selectedLead.id : owners[0]?.id || ''
  );

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('11:00 AM');
  const [priceFeedback, setPriceFeedback] = useState<'justo' | 'alto' | 'atractivo'>('justo');
  const [conditionFeedback, setConditionFeedback] = useState<'excelente' | 'bueno' | 'regular' | 'requiere_reparacion'>('excelente');
  const [interestLevel, setInterestLevel] = useState<'muy_alto' | 'interesado' | 'lo_pensara' | 'descartado'>('muy_alto');
  const [clientComments, setClientComments] = useState('');
  const [updateToStatus, setUpdateToStatus] = useState<StatusColor>('amarillo');

  if (!isOpen) return null;

  const currentOwner = leads.find((l) => l.id === selectedOwnerId);
  const currentBuyer = leads.find((l) => l.id === selectedBuyerId);

  const previewReportText = () => {
    if (!currentOwner) return '';
    const tempVisit: VisitRecord = {
      id: 'temp',
      leadId: currentBuyer?.id || '',
      propertyTitle: currentOwner.propertyTitle,
      clientName: currentBuyer?.name || 'Prospecto interesado',
      date,
      time,
      priceFeedback,
      conditionFeedback,
      interestLevel,
      clientComments: clientComments.trim(),
      resultingStatus: updateToStatus,
    };
    return generateOwnerVisitReportText(currentOwner, tempVisit);
  };

  const handleSaveAndNotify = (sendWhatsApp: boolean) => {
    const propertyTitle = currentOwner ? currentOwner.propertyTitle : 'Inmueble';
    const clientName = currentBuyer ? currentBuyer.name : 'Prospecto interesado';

    const newVisit: Omit<VisitRecord, 'id'> = {
      leadId: currentBuyer?.id || currentOwner?.id || 'gen',
      propertyTitle,
      clientName,
      date,
      time,
      priceFeedback,
      conditionFeedback,
      interestLevel,
      clientComments,
      resultingStatus: updateToStatus,
      notifiedOwnerAt: sendWhatsApp ? new Date().toISOString() : undefined,
    };

    onSaveVisit(newVisit, updateToStatus);

    if (sendWhatsApp && currentOwner?.phone) {
      const report = previewReportText();
      const url = generateWhatsAppUrl(currentOwner.phone, report);
      window.open(url, '_blank');
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-slate-300 rounded-2xl shadow-2xl overflow-hidden my-8 text-slate-900">
        
        {/* Header */}
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Bitácora de Visita & Reporte para Dueño
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Registra impresiones y manda informe profesional en 1 clic
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Prospecto que visitó */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                👤 Prospecto que realizó la visita:
              </label>
              <select
                value={selectedBuyerId}
                onChange={(e) => setSelectedBuyerId(e.target.value)}
                className="w-full p-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-medium focus:outline-none focus:bg-white focus:border-sky-600"
              >
                {buyers.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.zone} - ${b.price?.toLocaleString('es-MX')})
                  </option>
                ))}
              </select>
            </div>

            {/* Inmueble / Dueño visitado */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                🏠 Inmueble del Dueño visitado:
              </label>
              <select
                value={selectedOwnerId}
                onChange={(e) => setSelectedOwnerId(e.target.value)}
                className="w-full p-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-medium focus:outline-none focus:bg-white focus:border-indigo-600"
              >
                {owners.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.propertyTitle} - {o.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Fecha y Hora */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Fecha de la Visita
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 text-xs rounded-lg bg-slate-50 border border-slate-300 text-slate-900 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Hora
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="Ej: 4:30 PM"
                className="w-full p-2 text-xs rounded-lg bg-slate-50 border border-slate-300 text-slate-900 font-medium"
              />
            </div>
          </div>

          {/* Feedback: Nivel de Interés */}
          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wide">
              Nivel de Interés del Prospecto
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'muy_alto', label: '🔥 Muy Alto / Cierre', desc: 'Quiere apartar / oferta' },
                { id: 'interesado', label: '👍 Interesado', desc: 'Comparando opciones' },
                { id: 'lo_pensara', label: '🤔 Lo Pensará', desc: 'Revisará crédito/familia' },
                { id: 'descartado', label: '❌ Descartado', desc: 'No se ajustó al requerimiento' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setInterestLevel(opt.id as any);
                    if (opt.id === 'muy_alto') setUpdateToStatus('verde');
                    else if (opt.id === 'descartado') setUpdateToStatus('rojo');
                    else setUpdateToStatus('amarillo');
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    interestLevel === opt.id
                      ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="block text-xs font-bold text-slate-900">{opt.label}</span>
                  <span className="block text-[10px] text-slate-500 mt-0.5 font-medium">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Percepción de Precio & Estado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Opinión sobre el Precio
              </label>
              <select
                value={priceFeedback}
                onChange={(e) => setPriceFeedback(e.target.value as any)}
                className="w-full p-2 text-xs rounded-lg bg-slate-50 border border-slate-300 text-slate-900 font-medium"
              >
                <option value="justo">Precio justo y competitivo</option>
                <option value="alto">Percibido ligeramente alto</option>
                <option value="atractivo">Excelente oportunidad de precio</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Opinión sobre el Estado del Inmueble
              </label>
              <select
                value={conditionFeedback}
                onChange={(e) => setConditionFeedback(e.target.value as any)}
                className="w-full p-2 text-xs rounded-lg bg-slate-50 border border-slate-300 text-slate-900 font-medium"
              >
                <option value="excelente">Excelente / Impecable</option>
                <option value="bueno">Buen estado general</option>
                <option value="regular">Regular / Mantenimiento normal</option>
                <option value="requiere_reparacion">Requiere mejoras o pintura</option>
              </select>
            </div>
          </div>

          {/* Comentarios del cliente */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Comentarios clave del prospecto (feedback textual):
            </label>
            <textarea
              value={clientComments}
              onChange={(e) => setClientComments(e.target.value)}
              placeholder="Ej: Le encantó la cocina y la iluminación. Preguntó si el precio es negociable si paga de contado."
              rows={2}
              className="w-full p-2.5 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-600"
            />
          </div>

          {/* Vista previa del mensaje de WhatsApp para el Dueño */}
          <div className="bg-emerald-50/70 rounded-xl p-3.5 border border-emerald-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-emerald-700" />
                Mensaje automático listo para enviar al Dueño por WhatsApp:
              </span>
              <span className="text-[10px] text-emerald-700 font-medium">
                Ahorra tiempo y proyecta profesionalismo
              </span>
            </div>
            <pre className="text-xs text-slate-800 font-sans whitespace-pre-wrap bg-white p-3 rounded-lg border border-emerald-200 max-h-32 overflow-y-auto leading-relaxed">
              {previewReportText()}
            </pre>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-600 font-medium">
            Actualizará el estatus del prospecto a{' '}
            <strong className="text-emerald-700 uppercase font-extrabold">{updateToStatus}</strong>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => handleSaveAndNotify(false)}
              className="w-1/2 sm:w-auto px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors"
            >
              Guardar Solo en Bitácora
            </button>

            <button
              type="button"
              onClick={() => handleSaveAndNotify(true)}
              className="w-1/2 sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all hover:scale-[1.02]"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Guardar & Enviar a Dueño</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
