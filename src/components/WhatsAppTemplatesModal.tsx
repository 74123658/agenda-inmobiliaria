import React, { useState } from 'react';
import { 
  X, 
  MessageCircle, 
  Send, 
  Copy, 
  CheckCircle2, 
  Sparkles, 
  Phone,
  User,
  Building
} from 'lucide-react';
import { LeadItem } from '../types';
import { WHATSAPP_TEMPLATES, generateWhatsAppUrl } from '../utils/whatsapp';

interface WhatsAppTemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: LeadItem | null;
}

export const WhatsAppTemplatesModal: React.FC<WhatsAppTemplatesModalProps> = ({
  isOpen,
  onClose,
  lead,
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('saludo_seguimiento');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !lead) return null;

  const currentTemplate = WHATSAPP_TEMPLATES.find((t) => t.id === selectedTemplateId) || WHATSAPP_TEMPLATES[0];

  const effectiveText = customMessage !== '' ? customMessage : currentTemplate.getText(lead);

  const handleSelectTemplate = (id: string) => {
    setSelectedTemplateId(id);
    const tmpl = WHATSAPP_TEMPLATES.find((t) => t.id === id);
    if (tmpl) {
      setCustomMessage(tmpl.getText(lead));
    }
  };

  const handleSendWhatsApp = () => {
    const url = generateWhatsAppUrl(lead.phone, effectiveText);
    window.open(url, '_blank');
    onClose();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(effectiveText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white border border-slate-300 rounded-2xl shadow-2xl overflow-hidden my-8 text-slate-900">
        
        {/* Header */}
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <MessageCircle className="w-5 h-5 fill-emerald-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                Enviar WhatsApp a {lead.name}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {lead.phone} • {lead.type === 'dueno' ? 'Dueño' : 'Prospecto'} • {lead.zone}
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

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Template Selector Pills */}
          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-2 uppercase tracking-wide">
              Elige una plantilla rápida:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {WHATSAPP_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => handleSelectTemplate(tmpl.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    selectedTemplateId === tmpl.id
                      ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="block text-xs font-bold text-slate-900">{tmpl.title}</span>
                  <span className="block text-[11px] text-slate-500 truncate mt-0.5 font-medium">{tmpl.preview}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Editable text area */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Mensaje a enviar (puedes editar antes de mandar):
            </label>
            <textarea
              value={effectiveText}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={6}
              className="w-full p-3 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-600 font-sans whitespace-pre-wrap leading-relaxed"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-300 transition-colors shadow-xs"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
            <span>{copied ? '¡Copiado!' : 'Copiar Texto'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSendWhatsApp}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all hover:scale-[1.02] active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Abrir en WhatsApp</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
