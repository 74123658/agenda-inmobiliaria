import React, { useState } from 'react';
import { 
  Phone, 
  MessageCircle, 
  MapPin, 
  Calendar, 
  Clock, 
  AlertCircle, 
  DollarSign, 
  Bed, 
  Bath, 
  Car, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  ChevronDown, 
  Send,
  Building,
  User,
  Zap,
  Calculator
} from 'lucide-react';
import { LeadItem, StatusColor } from '../types';
import { formatCurrency, generateWhatsAppUrl } from '../utils/whatsapp';
import { calculateDaysAgo } from '../utils/storage';

interface LeadCardProps {
  lead: LeadItem;
  onUpdateStatus: (id: string, newStatus: StatusColor) => void;
  onOpenWhatsAppMenu: (lead: LeadItem) => void;
  onLogVisit: (lead: LeadItem) => void;
  onEdit: (lead: LeadItem) => void;
  onDelete: (id: string) => void;
  onOpenCalculator?: (lead: LeadItem) => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({
  lead,
  onUpdateStatus,
  onOpenWhatsAppMenu,
  onLogVisit,
  onEdit,
  onDelete,
  onOpenCalculator,
}) => {
  const [showQuickNote, setShowQuickNote] = useState(false);
  const daysWithoutContact = calculateDaysAgo(lead.lastContactDate);
  const isOwner = lead.type === 'dueno';

  const isToday = () => {
    if (!lead.nextActionDate) return false;
    const today = new Date().toISOString().split('T')[0];
    return lead.nextActionDate === today;
  };

  const isOverdue = () => {
    if (!lead.nextActionDate) return false;
    const today = new Date().toISOString().split('T')[0];
    return lead.nextActionDate < today;
  };

  const getBorderColor = () => {
    switch (lead.status) {
      case 'verde':
        return 'border-emerald-500 ring-2 ring-emerald-200/60 bg-white shadow-sm hover:shadow-md';
      case 'amarillo':
        return 'border-amber-400 ring-2 ring-amber-200/60 bg-white shadow-sm hover:shadow-md';
      case 'rojo':
        return 'border-slate-300 bg-slate-50/90 opacity-85 hover:opacity-100 shadow-sm';
    }
  };

  const getStatusBadge = () => {
    switch (lead.status) {
      case 'verde':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            🟢 Cierre / Apartado
          </span>
        );
      case 'amarillo':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-950 border border-amber-300 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            🟡 Seguimiento Activo
          </span>
        );
      case 'rojo':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold bg-rose-100 text-rose-900 border border-rose-200">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            🔴 Archivado
          </span>
        );
    }
  };

  return (
    <div
      id={`lead-card-${lead.id}`}
      className={`rounded-2xl border p-4 sm:p-5 transition-all flex flex-col justify-between relative group ${getBorderColor()}`}
    >
      {/* Top Header info */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          
          {/* Tag Type + Status */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wide border ${
                isOwner
                  ? 'bg-indigo-50 text-indigo-900 border-indigo-200'
                  : 'bg-sky-50 text-sky-900 border-sky-200'
              }`}
            >
              {isOwner ? <Building className="w-3.5 h-3.5 text-indigo-700" /> : <User className="w-3.5 h-3.5 text-sky-700" />}
              {isOwner ? '🏠 Dueño' : '👤 Prospecto'}
            </span>
            {getStatusBadge()}
          </div>

          {/* Quick Status Color Switcher buttons */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-300 shadow-inner">
            <button
              onClick={() => onUpdateStatus(lead.id, 'verde')}
              title="Cambiar a Verde (Cierre)"
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${
                lead.status === 'verde' ? 'bg-emerald-600 ring-2 ring-emerald-400' : 'bg-emerald-200 border border-emerald-400'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-white"></span>
            </button>
            <button
              onClick={() => onUpdateStatus(lead.id, 'amarillo')}
              title="Cambiar a Amarillo (Seguimiento)"
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${
                lead.status === 'amarillo' ? 'bg-amber-500 ring-2 ring-amber-400' : 'bg-amber-200 border border-amber-400'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-white"></span>
            </button>
            <button
              onClick={() => onUpdateStatus(lead.id, 'rojo')}
              title="Cambiar a Rojo (Descartar)"
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${
                lead.status === 'rojo' ? 'bg-rose-600 ring-2 ring-rose-400' : 'bg-rose-200 border border-rose-400'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-white"></span>
            </button>
          </div>
        </div>

        {/* Client Name & Quick Call / WA */}
        <div className="flex items-baseline justify-between gap-2 mb-1.5">
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            {lead.name}
          </h3>
          <div className="flex items-center gap-1.5">
            <a
              href={`tel:${lead.phone}`}
              title={`Llamar a ${lead.phone}`}
              className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors"
            >
              <Phone className="w-4 h-4" />
            </a>
            <button
              onClick={() => onOpenWhatsAppMenu(lead)}
              title="Abrir WhatsApp con plantillas"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Property Title & Zone */}
        <div className="mb-3">
          <div className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <span>{lead.propertyTitle}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 mt-1">
            <span className="flex items-center gap-1 font-semibold text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              {lead.zone}
            </span>
            <span className="capitalize px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium border border-slate-200">
              {lead.propertyType}
            </span>
            <span className="uppercase text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
              {lead.operationType}
            </span>
          </div>
        </div>

        {/* Price & Commission breakdown */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 mb-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">
              {isOwner ? 'Precio de Inmueble' : 'Presupuesto'}
            </span>
            <span className="text-base sm:text-lg font-extrabold text-slate-900">
              {formatCurrency(lead.price, lead.currency)}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-emerald-700 block">
              Comisión Estimada
            </span>
            <span className="text-sm sm:text-base font-extrabold text-emerald-800">
              {formatCurrency(lead.estimatedCommission || lead.price * 0.04, lead.currency)}
            </span>
          </div>
        </div>

        {/* Specs if available (Beds, Baths, Parking) */}
        {(lead.bedrooms || lead.bathrooms || lead.parking) && (
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-700 mb-3 px-1">
            {lead.bedrooms ? (
              <span className="flex items-center gap-1" title="Recámaras">
                <Bed className="w-3.5 h-3.5 text-slate-500" /> {lead.bedrooms} Rec.
              </span>
            ) : null}
            {lead.bathrooms ? (
              <span className="flex items-center gap-1" title="Baños">
                <Bath className="w-3.5 h-3.5 text-slate-500" /> {lead.bathrooms} Baños
              </span>
            ) : null}
            {lead.parking ? (
              <span className="flex items-center gap-1" title="Estacionamientos">
                <Car className="w-3.5 h-3.5 text-slate-500" /> {lead.parking} Autos
              </span>
            ) : null}
          </div>
        )}

        {/* Next Action Box (Highlighted for Today) */}
        <div
          className={`rounded-xl p-3 border mb-3 transition-colors ${
            isToday()
              ? 'bg-amber-100/90 border-amber-500 text-amber-950 font-semibold shadow-xs'
              : isOverdue()
              ? 'bg-rose-100/90 border-rose-500 text-rose-950 font-semibold shadow-xs'
              : 'bg-slate-50 border-slate-200 text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold mb-1">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {isToday() ? '🔥 TAREA PARA HOY:' : isOverdue() ? '⚠️ ACCIÓN PENDIENTE:' : 'Próxima Acción:'}
            </span>
            <span className="text-[11px] font-mono font-extrabold">{lead.nextActionDate || 'Sin fecha'}</span>
          </div>
          <p className="text-xs font-medium line-clamp-2">
            {lead.nextActionNote || 'Sin notas de acción definida'}
          </p>
        </div>

        {/* Days Without Contact Alert (For Yellow Leads) */}
        {lead.status === 'amarillo' && daysWithoutContact >= 2 && (
          <div className="flex items-center gap-1.5 text-xs text-amber-900 bg-amber-100 px-2.5 py-1.5 rounded-lg border border-amber-300 mb-3 font-medium">
            <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>
              <strong>{daysWithoutContact} días</strong> sin contacto. ¡Dale seguimiento para evitar que se enfríe!
            </span>
          </div>
        )}

        {/* Expandable Notes */}
        {lead.notes && (
          <div className="mb-3 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-900 block mb-0.5">Notas de la libreta:</span>
            <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{lead.notes}</p>
          </div>
        )}
      </div>

      {/* Footer Action Buttons */}
      <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-1 text-xs">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onLogVisit(lead)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-bold border border-indigo-200 transition-colors"
            title="Registrar Visita & Feedback"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>+ Visita</span>
          </button>

          {onOpenCalculator && (
            <button
              onClick={() => onOpenCalculator(lead)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 font-bold border border-teal-200 transition-colors"
              title="Calcular Enganche y Gastos"
            >
              <Calculator className="w-3.5 h-3.5 text-teal-600" />
              <span className="hidden sm:inline">Calc</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(lead)}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-colors"
            title="Editar ficha"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(lead.id)}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors"
            title="Eliminar registro"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
