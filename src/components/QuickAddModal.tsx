import React, { useState, useEffect } from 'react';
import { 
  X, 
  Building, 
  User, 
  Phone, 
  DollarSign, 
  MapPin, 
  Calendar, 
  Mic, 
  MicOff, 
  Sparkles, 
  Check, 
  ClipboardPaste,
  Save
} from 'lucide-react';
import { LeadItem, LeadType, PropertyType, OperationType, StatusColor } from '../types';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lead: Omit<LeadItem, 'id' | 'createdAt'>, editingId?: string) => void;
  initialLead?: LeadItem | null;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialLead,
}) => {
  const [type, setType] = useState<LeadType>('prospecto');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [propertyTitle, setPropertyTitle] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('casa');
  const [operationType, setOperationType] = useState<OperationType>('venta');
  const [zone, setZone] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [commissionPercent, setCommissionPercent] = useState<number>(4);
  const [status, setStatus] = useState<StatusColor>('amarillo');
  const [nextActionDate, setNextActionDate] = useState(new Date().toISOString().split('T')[0]);
  const [nextActionNote, setNextActionNote] = useState('');
  const [notes, setNotes] = useState('');
  const [bedrooms, setBedrooms] = useState<number | ''>('');
  const [bathrooms, setBathrooms] = useState<number | ''>('');
  const [parking, setParking] = useState<number | ''>('');

  // Voice dictation state
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [pastedTextModal, setPastedTextModal] = useState(false);
  const [pasteRawText, setPasteRawText] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setSpeechSupported(true);
    }
  }, []);

  useEffect(() => {
    if (initialLead) {
      setType(initialLead.type);
      setName(initialLead.name);
      setPhone(initialLead.phone);
      setPropertyTitle(initialLead.propertyTitle);
      setPropertyType(initialLead.propertyType);
      setOperationType(initialLead.operationType);
      setZone(initialLead.zone);
      setPrice(initialLead.price);
      setCommissionPercent(initialLead.commissionPercent || 4);
      setStatus(initialLead.status);
      setNextActionDate(initialLead.nextActionDate || new Date().toISOString().split('T')[0]);
      setNextActionNote(initialLead.nextActionNote || '');
      setNotes(initialLead.notes || '');
      setBedrooms(initialLead.bedrooms ?? '');
      setBathrooms(initialLead.bathrooms ?? '');
      setParking(initialLead.parking ?? '');
    } else {
      // Reset form
      setType('prospecto');
      setName('');
      setPhone('');
      setPropertyTitle('');
      setPropertyType('casa');
      setOperationType('venta');
      setZone('');
      setPrice('');
      setCommissionPercent(4);
      setStatus('amarillo');
      setNextActionDate(new Date().toISOString().split('T')[0]);
      setNextActionNote('');
      setNotes('');
      setBedrooms('');
      setBathrooms('');
      setParking('');
    }
  }, [initialLead, isOpen]);

  if (!isOpen) return null;

  const handleVoiceToggle = () => {
    if (!speechSupported) {
      alert('Tu navegador no soporta reconocimiento de voz nativo. Por favor escribe directamente.');
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'es-MX';
      recognition.continuous = false;
      recognition.interimResults = false;

      if (!isListening) {
        recognition.start();
        setIsListening(true);

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setNotes((prev) => (prev ? `${prev}\n${transcript}` : transcript));
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };
      } else {
        recognition.stop();
        setIsListening(false);
      }
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  const handleParsePastedText = () => {
    if (!pasteRawText.trim()) return;
    const text = pasteRawText;

    // Detect phone number
    const phoneMatch = text.match(/(?:\+?52\s?)?(?:\(?\d{2,3}\)?[\s.-]?)?\d{3,4}[\s.-]?\d{4}/);
    if (phoneMatch) setPhone(phoneMatch[0].replace(/\s+/g, ''));

    // Detect price/budget (e.g., $3,500,000 or 4.5 millones or 4500000)
    const priceMillionMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:millones|mdp|m\.d\.p|millón)/i);
    if (priceMillionMatch) {
      setPrice(parseFloat(priceMillionMatch[1]) * 1000000);
    } else {
      const rawPriceMatch = text.match(/\$?\s?(\d{1,3}(?:,\d{3})+|\d{5,8})/);
      if (rawPriceMatch) {
        setPrice(parseInt(rawPriceMatch[1].replace(/,/g, ''), 10));
      }
    }

    // Detect property type
    if (/departamento|depa|penthouse|loft/i.test(text)) setPropertyType('departamento');
    else if (/casa|residencia|villa/i.test(text)) setPropertyType('casa');
    else if (/terreno|lote/i.test(text)) setPropertyType('terreno');
    else if (/local|bodega|oficina/i.test(text)) setPropertyType('local');

    // Detect operation
    if (/renta|rentar|alquiler|arrendamiento/i.test(text)) setOperationType('renta');
    else setOperationType('venta');

    // Detect common zones
    const zoneMatch = text.match(/(?:en|zona|colonia|col\.)\s+([A-Za-zÁÉÍÓÚáéíóúñÑ\s]{3,20})/i);
    if (zoneMatch) {
      setZone(zoneMatch[1].trim());
    }

    setNotes((prev) => (prev ? `${prev}\n-- Info pegada --\n${text}` : text));
    setPastedTextModal(false);
    setPasteRawText('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Por favor ingresa el nombre del cliente o contacto.');
      return;
    }

    const numericPrice = Number(price) || 0;
    const estimatedCommission =
      type === 'dueno' && operationType === 'renta'
        ? numericPrice // 1 month of rent
        : numericPrice * ((commissionPercent || 4) / 100);

    onSave(
      {
        type,
        name: name.trim(),
        phone: phone.trim(),
        propertyTitle: propertyTitle.trim() || `${type === 'dueno' ? 'Propiedad de' : 'Requerimiento de'} ${name}`,
        propertyType,
        operationType,
        zone: zone.trim() || 'General',
        price: numericPrice,
        currency: 'MXN',
        commissionPercent,
        estimatedCommission,
        status,
        nextActionDate,
        nextActionNote: nextActionNote.trim() || 'Primer contacto y seguimiento',
        lastContactDate: new Date().toISOString(),
        notes: notes.trim(),
        bedrooms: bedrooms !== '' ? Number(bedrooms) : undefined,
        bathrooms: bathrooms !== '' ? Number(bathrooms) : undefined,
        parking: parking !== '' ? Number(parking) : undefined,
      },
      initialLead?.id
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-slate-300 rounded-2xl shadow-2xl overflow-hidden my-8 text-slate-900">
        
        {/* Header */}
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-base">
              ⚡
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {initialLead ? 'Editar Registro' : 'Captura Rápida (Llamada / Libreta)'}
              </h2>
              <p className="text-xs text-slate-500 font-medium">Guarda en segundos para no perder el hilo de la llamada</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPastedTextModal(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-xs font-bold text-blue-700 border border-blue-200 transition-colors"
              title="Pegar texto de WhatsApp para auto-rellenar"
            >
              <ClipboardPaste className="w-3.5 h-3.5" />
              <span>Pegar de WhatsApp</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal for pasting text */}
        {pastedTextModal && (
          <div className="p-4 bg-indigo-50 border-b border-indigo-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Pega el mensaje de WhatsApp aquí para extraer datos:
              </span>
              <button
                onClick={() => setPastedTextModal(false)}
                className="text-xs text-slate-500 hover:text-slate-800 font-bold"
              >
                ✕ Cerrar
              </button>
            </div>
            <textarea
              value={pasteRawText}
              onChange={(e) => setPasteRawText(e.target.value)}
              placeholder="Ej: Hola me interesa la casa de Coyoacán de 6.5 mdp, soy Carlos cel 5512345678"
              rows={2}
              className="w-full p-2.5 text-xs rounded-xl bg-white border border-indigo-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 mb-2"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleParsePastedText}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
              >
                Auto-completar Campos
              </button>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* 1. Selector Tipo: Dueño vs Prospecto */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
              ¿Quién es el contacto?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                id="btn-select-prospecto"
                onClick={() => setType('prospecto')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs sm:text-sm font-bold transition-all ${
                  type === 'prospecto'
                    ? 'bg-sky-100 border-sky-500 text-sky-950 ring-2 ring-sky-300'
                    : 'bg-slate-50 border-slate-300 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <User className="w-4 h-4 text-sky-600" />
                <span>👤 Prospecto (Comprador / Inquilino)</span>
              </button>

              <button
                type="button"
                id="btn-select-dueno"
                onClick={() => setType('dueno')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs sm:text-sm font-bold transition-all ${
                  type === 'dueno'
                    ? 'bg-indigo-100 border-indigo-500 text-indigo-950 ring-2 ring-indigo-300'
                    : 'bg-slate-50 border-slate-300 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Building className="w-4 h-4 text-indigo-600" />
                <span>🏠 Propietario / Dueño (Vende / Renta)</span>
              </button>
            </div>
          </div>

          {/* 2. Selector Semáforo Tri-Color */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
              Estado Semáforo (Urgencia & Prioridad)
            </label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {/* Verde */}
              <button
                type="button"
                onClick={() => setStatus('verde')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all text-center ${
                  status === 'verde'
                    ? 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-2 ring-emerald-300 font-extrabold'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="flex items-center gap-1 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  🟢 Verde
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5 font-medium">Cierre / Apartado</span>
              </button>

              {/* Amarillo */}
              <button
                type="button"
                onClick={() => setStatus('amarillo')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all text-center ${
                  status === 'amarillo'
                    ? 'bg-amber-100 border-amber-500 text-amber-950 ring-2 ring-amber-300 font-extrabold'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="flex items-center gap-1 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  🟡 Amarillo
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5 font-medium">Seguimiento Activo</span>
              </button>

              {/* Rojo */}
              <button
                type="button"
                onClick={() => setStatus('rojo')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all text-center ${
                  status === 'rojo'
                    ? 'bg-rose-100 border-rose-500 text-rose-950 ring-2 ring-rose-300 font-extrabold'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="flex items-center gap-1 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  🔴 Rojo
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5 font-medium">Archivado</span>
              </button>
            </div>
          </div>

          {/* 3. Nombre y Teléfono (Esenciales) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Nombre del Cliente / Contacto *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Lic. Mariana Gómez"
                className="w-full p-2.5 text-sm rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-medium"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-800">
                  Teléfono / WhatsApp (10 dígitos)
                </label>
                <button
                  type="button"
                  onClick={() => setPhone('7751280009')}
                  className="text-[10px] text-emerald-700 hover:text-emerald-900 font-bold underline"
                  title="Usar número de prueba"
                >
                  Usar 7751280009
                </button>
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ej: 7751280009"
                  className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-medium"
                />
              </div>
            </div>
          </div>

          {/* 4. Inmueble / Requerimiento & Tipo */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-800 mb-1">
                {type === 'dueno' ? 'Nombre o Dirección del Inmueble' : '¿Qué tipo de inmueble busca?'}
              </label>
              <input
                type="text"
                value={propertyTitle}
                onChange={(e) => setPropertyTitle(e.target.value)}
                placeholder={type === 'dueno' ? 'Ej: Casa con Jardín en Francisco Sosa' : 'Ej: Busca Depa 2 Recs cerca de Metro Insurgentes'}
                className="w-full p-2.5 text-sm rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Categoría
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                className="w-full p-2.5 text-sm rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-600 font-medium"
              >
                <option value="casa">Casa</option>
                <option value="departamento">Departamento</option>
                <option value="terreno">Terreno</option>
                <option value="local">Local Comercial</option>
                <option value="oficina">Oficina</option>
                <option value="bodega">Bodega</option>
                <option value="otro">Otro</option>
              </select>
            </div>
          </div>

          {/* 5. Zona, Operación & Precio */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Zona / Colonia
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                  placeholder="Ej: Polanco, Del Valle..."
                  className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-600 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Operación
              </label>
              <select
                value={operationType}
                onChange={(e) => setOperationType(e.target.value as OperationType)}
                className="w-full p-2.5 text-sm rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-600 font-medium"
              >
                <option value="venta">Venta</option>
                <option value="renta">Renta</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                {type === 'dueno' ? 'Precio Solicitado ($)' : 'Presupuesto Máximo ($)'}
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Ej: 5500000"
                  className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-600 font-bold font-mono"
                />
              </div>
            </div>
          </div>

          {/* 6. Recámaras, Baños, Autos (Opcional) */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Recámaras</label>
              <input
                type="number"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value ? Number(e.target.value) : '')}
                placeholder="Ej: 3"
                className="w-full p-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-center font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Baños</label>
              <input
                type="number"
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value ? Number(e.target.value) : '')}
                placeholder="Ej: 2.5"
                step="0.5"
                className="w-full p-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-center font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Estacionamiento</label>
              <input
                type="number"
                value={parking}
                onChange={(e) => setParking(e.target.value ? Number(e.target.value) : '')}
                placeholder="Ej: 2"
                className="w-full p-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-center font-bold"
              />
            </div>
          </div>

          {/* 7. Próxima Acción & Fecha */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-amber-50/80 rounded-xl border border-amber-300">
            <div>
              <label className="block text-xs font-bold text-amber-950 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-700" /> Fecha Próxima Acción
              </label>
              <input
                type="date"
                value={nextActionDate}
                onChange={(e) => setNextActionDate(e.target.value)}
                className="w-full p-2 text-xs rounded-lg bg-white border border-amber-300 text-slate-900 font-bold focus:border-amber-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-amber-950 mb-1">
                Tarea / Acción Específica
              </label>
              <input
                type="text"
                value={nextActionNote}
                onChange={(e) => setNextActionNote(e.target.value)}
                placeholder="Ej: Llamar hoy 5pm para confirmar visita del sábado"
                className="w-full p-2 text-xs rounded-lg bg-white border border-amber-300 text-slate-900 placeholder-slate-400 font-medium focus:border-amber-500"
              />
            </div>
          </div>

          {/* 8. Notas Rápidas & Dictado por voz */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-800">
                Notas rápidas de la llamada / libreta:
              </label>
              {speechSupported && (
                <button
                  type="button"
                  onClick={handleVoiceToggle}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    isListening
                      ? 'bg-rose-600 text-white animate-pulse shadow-md'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}
                >
                  {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-emerald-600" />}
                  <span>{isListening ? 'Grabando voz... (clic para parar)' : 'Dictar por voz'}</span>
                </button>
              )}
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Detalles clave: si tiene crédito aprobado, urgencia de venta, horario preferido, etc."
              rows={3}
              className="w-full p-3 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-600 font-medium"
            />
          </div>

          {/* Footer Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-[1.02] active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>{initialLead ? 'Actualizar Ficha' : 'Guardar en Libreta'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
