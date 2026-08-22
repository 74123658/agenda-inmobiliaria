import React, { useState } from 'react';
import { 
  MessageCircle, 
  Phone, 
  Copy, 
  CheckCircle2, 
  X, 
  ExternalLink, 
  Send, 
  Sparkles,
  QrCode,
  ShieldCheck,
  Building,
  UserCheck
} from 'lucide-react';
import { cleanPhoneNumber } from '../utils/whatsapp';

interface WhatsAppDirectAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPhone?: string;
  advisorName?: string;
}

export const WhatsAppDirectAccessModal: React.FC<WhatsAppDirectAccessModalProps> = ({
  isOpen,
  onClose,
  defaultPhone = '7751280009',
  advisorName = 'Asesor Inmobiliario 360°',
}) => {
  const rawPhone = defaultPhone;
  const cleanedPhone = cleanPhoneNumber(rawPhone); // 527751280009
  const formattedDisplayPhone = '+52 (775) 128-0009';

  const [selectedPreset, setSelectedPreset] = useState<string>('comprar');
  const [customText, setCustomText] = useState<string>(
    '¡Hola! Me comunico desde la Agenda Inmobiliaria para solicitar información y asesoría sobre propiedades disponibles.'
  );
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const presets = [
    {
      id: 'comprar',
      icon: '🔍',
      label: 'Comprar / Rentar Propiedad',
      text: '¡Hola! Me comunico desde la Agenda Inmobiliaria. Estoy buscando opciones de casas/departamentos en venta y me gustaría recibir opciones disponibles.',
    },
    {
      id: 'propietario',
      icon: '🏠',
      label: 'Soy Dueño (Quiero Vender)',
      text: '¡Hola! Soy propietario y me interesa promover mi inmueble en venta/renta con su agencia. ¿Podríamos coordinar una llamada o visita?',
    },
    {
      id: 'cita',
      icon: '📅',
      label: 'Agendar Cita / Visita',
      text: '¡Hola! Me gustaría agendar una cita para conocer una propiedad disponible en su catálogo. ¿Qué horarios tienen disponibles?',
    },
    {
      id: 'financiero',
      icon: '🧮',
      label: 'Corrida Financiera / Crédito',
      text: '¡Hola! Me gustaría solicitar una corrida de gastos notariales, enganche y mensualidad bancaria para una compra inmobiliaria.',
    },
  ];

  if (!isOpen) return null;

  const handleSelectPreset = (id: string, text: string) => {
    setSelectedPreset(id);
    setCustomText(text);
  };

  const directWhatsAppUrl = `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(customText.trim())}`;
  const directCleanUrl = `https://wa.me/${cleanedPhone}`;

  const handleOpenWhatsApp = () => {
    window.open(directWhatsAppUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(directWhatsAppUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(rawPhone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2200);
  };

  // Safe QR API generator url from standard public qr services
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(directCleanUrl)}`;

  return (
    <div 
      id="modal-whatsapp-direct-access"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-xs overflow-y-auto"
    >
      <div className="relative w-full max-w-lg bg-white border border-slate-300 rounded-3xl shadow-2xl overflow-hidden my-8 text-slate-900 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white text-emerald-700 flex items-center justify-center font-black shadow-md">
              <MessageCircle className="w-6 h-6 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-lg font-extrabold tracking-tight font-['Outfit',sans-serif]">
                  WhatsApp Directo
                </h3>
                <span className="bg-emerald-800/60 text-emerald-100 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border border-emerald-400/40">
                  Activo
                </span>
              </div>
              <p className="text-xs text-emerald-100 font-medium">
                {advisorName} • Tel: {formattedDisplayPhone}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-emerald-100 hover:text-white hover:bg-emerald-800/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5">
          
          {/* Main Direct Action Card */}
          <div className="bg-emerald-50/80 border border-emerald-300 rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
            <div>
              <div className="text-xs font-bold uppercase text-emerald-800 tracking-wider">
                Línea de Atención Inmediata
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight flex items-center gap-2">
                <span>{formattedDisplayPhone}</span>
              </div>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                Disponible para mensajes, notas de voz y llamadas por WhatsApp.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <a
                href={`tel:+52${rawPhone}`}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold shadow-xs transition-all"
                title="Llamada telefónica directa"
              >
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>Llamar</span>
              </a>

              <button
                onClick={handleCopyPhone}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold shadow-xs transition-all"
                title="Copiar número"
              >
                {copiedPhone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4 text-slate-500" />
                )}
                <span>{copiedPhone ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>
          </div>

          {/* Preset Selectors */}
          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-2">
              Mensajes rápidos sugeridos:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {presets.map((p) => {
                const isSelected = selectedPreset === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPreset(p.id, p.text)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-emerald-100/70 border-emerald-600 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                      <span>{p.icon}</span>
                      <span>{p.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Editable Text Area */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">
                Texto del mensaje a enviar:
              </label>
              <span className="text-[11px] text-slate-500 font-medium">
                {customText.length} caracteres
              </span>
            </div>
            <textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              rows={3}
              className="w-full p-3 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-sans leading-relaxed"
              placeholder="Escribe tu mensaje personalizado..."
            />
          </div>

          {/* Optional QR Code View Toggle */}
          {showQr && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <img 
                src={qrImageUrl} 
                alt={`QR WhatsApp ${rawPhone}`}
                className="w-28 h-28 rounded-xl border border-slate-300 bg-white p-1 shadow-xs"
                referrerPolicy="no-referrer"
              />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-900">
                  Escanea el código con tu celular
                </h4>
                <p className="text-xs text-slate-600">
                  Abre la cámara de cualquier teléfono para iniciar el chat directo al número <strong>{formattedDisplayPhone}</strong>.
                </p>
                <div className="pt-1 text-[11px] font-mono text-emerald-800 font-semibold truncate max-w-xs">
                  {directCleanUrl}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowQr(!showQr)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-300 transition-colors shadow-xs"
            >
              <QrCode className="w-4 h-4 text-slate-600" />
              <span>{showQr ? 'Ocultar QR' : 'Ver Código QR'}</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-300 transition-colors shadow-xs"
            >
              {copiedLink ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4 text-slate-500" />
              )}
              <span>{copiedLink ? '¡Enlace Copiado!' : 'Copiar Enlace'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors"
            >
              Cerrar
            </button>

            <button
              id="btn-confirm-open-whatsapp-7751280009"
              onClick={handleOpenWhatsApp}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all hover:scale-[1.02] active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Abrir WhatsApp Ahora ⚡</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
