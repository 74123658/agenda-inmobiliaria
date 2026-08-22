import React from 'react';
import { 
  Sparkles, 
  MessageCircle, 
  ArrowRight, 
  CheckCircle2, 
  Building, 
  User, 
  MapPin, 
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { SmartMatch, LeadItem } from '../types';
import { formatCurrency, generateWhatsAppUrl } from '../utils/whatsapp';

interface SmartMatcherProps {
  matches: SmartMatch[];
  onOpenQuickAdd: () => void;
}

export const SmartMatcher: React.FC<SmartMatcherProps> = ({
  matches,
  onOpenQuickAdd,
}) => {
  const handleSendToBuyer = (match: SmartMatch) => {
    const owner = match.ownerLead;
    const buyer = match.buyerLead;
    const priceFormatted = formatCurrency(owner.price, owner.currency);

    const message = `¡Hola ${buyer.name}! Te contacto de inmediato porque acabo de captar una propiedad que coincide al ${match.matchScore}% con lo que estás buscando:\n\n🏡 *${owner.propertyTitle}*\n📍 *Zona:* ${owner.zone}\n💰 *Inversión:* ${priceFormatted} (${owner.operationType === 'venta' ? 'Venta' : 'Renta'})\n\n¿Te gustaría que te mande la ficha completa y agendemos una visita exclusiva antes de que se publique masivamente?`;

    const url = generateWhatsAppUrl(buyer.phone, message);
    window.open(url, '_blank');
  };

  const handleSendToOwner = (match: SmartMatch) => {
    const owner = match.ownerLead;
    const buyer = match.buyerLead;
    const budgetFormatted = formatCurrency(buyer.price, buyer.currency);

    const message = `Estimado/a ${owner.name}, le escribo para comentarle que tengo un prospecto calificado (${buyer.name}) con presupuesto disponible de ${budgetFormatted} buscando una propiedad en ${owner.zone}.\n\nMe gustaría coordinar una visita a su inmueble "${owner.propertyTitle}". ¿Qué horario le viene mejor esta semana?`;

    const url = generateWhatsAppUrl(owner.phone, message);
    window.open(url, '_blank');
  };

  if (matches.length === 0) {
    return (
      <div className="bg-white border border-slate-300 rounded-2xl p-8 text-center max-w-xl mx-auto my-8 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
          <Sparkles className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">
          No hay coincidencias activas en este momento
        </h3>
        <p className="text-sm text-slate-600 mb-6 font-medium">
          A medida que registres propietarios con inmuebles y prospectos con presupuesto, el sistema cruzará automáticamente las mejores oportunidades de venta.
        </p>
        <button
          onClick={onOpenQuickAdd}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all inline-flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>+ Registrar Nuevo Contacto</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-50 via-white to-emerald-50 border border-amber-300 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
              <Sparkles className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-slate-900 font-['Outfit',sans-serif]">
              Smart Matcher: Cruce Automático de Inmuebles ⚡
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
            Detectamos <strong>{matches.length} oportunidades de venta inmediata</strong> cruzando las casas captadas con compradores en cartera.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-amber-100/80 px-3.5 py-2 rounded-xl border border-amber-300 text-xs text-amber-950 font-bold">
          <span>🎯 Tiempo de prospección: Reducido a 0</span>
        </div>
      </div>

      {/* Matches Grid */}
      <div className="grid grid-cols-1 gap-4">
        {matches.map((match) => {
          const owner = match.ownerLead;
          const buyer = match.buyerLead;

          return (
            <div
              key={match.id}
              className="bg-white border border-slate-300 hover:border-amber-400 rounded-2xl p-5 shadow-sm transition-all"
            >
              {/* Top Score Banner */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-extrabold text-xs sm:text-sm border border-emerald-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-700" />
                    <span>{match.matchScore}% Coincidencia</span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                    Operación lista para agendar
                  </span>
                </div>

                {/* Match Reasons Badges */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {match.reasons.map((r, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200"
                    >
                      ✓ {r}
                    </span>
                  ))}
                </div>
              </div>

              {/* Both Sides Cards (Owner vs Buyer) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                
                {/* 1. Propietario / Inmueble */}
                <div className="bg-indigo-50/70 rounded-xl p-4 border border-indigo-200 relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 text-[11px] font-bold uppercase">
                      <Building className="w-3 h-3" /> Dueño Vendedor
                    </span>
                    <span className="text-xs font-bold text-indigo-950 font-mono">
                      {formatCurrency(owner.price, owner.currency)}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm mb-1">{owner.name}</h4>
                  <p className="text-xs text-slate-700 font-semibold line-clamp-1 mb-2">
                    🏠 {owner.propertyTitle}
                  </p>

                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span className="flex items-center gap-1 text-slate-700 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-indigo-600" /> {owner.zone}
                    </span>
                    <span className="text-indigo-800 font-bold">{owner.phone}</span>
                  </div>
                </div>

                {/* 2. Prospecto / Comprador */}
                <div className="bg-sky-50/70 rounded-xl p-4 border border-sky-200 relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sky-100 text-sky-900 text-[11px] font-bold uppercase">
                      <User className="w-3 h-3" /> Prospecto Comprador
                    </span>
                    <span className="text-xs font-bold text-sky-950 font-mono">
                      Presupuesto: {formatCurrency(buyer.price, buyer.currency)}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm mb-1">{buyer.name}</h4>
                  <p className="text-xs text-slate-700 font-semibold line-clamp-1 mb-2">
                    🔍 {buyer.propertyTitle}
                  </p>

                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span className="flex items-center gap-1 text-slate-700 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-sky-600" /> {buyer.zone}
                    </span>
                    <span className="text-sky-800 font-bold">{buyer.phone}</span>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2">
                <button
                  onClick={() => handleSendToOwner(match)}
                  className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-300 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-indigo-600" />
                  <span>Avisar al Propietario</span>
                </button>

                <button
                  onClick={() => handleSendToBuyer(match)}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all hover:scale-[1.01]"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>📲 Enviar Propiedad a {buyer.name.split(' ')[0]} por WhatsApp</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
