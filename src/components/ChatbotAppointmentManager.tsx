import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Calendar, 
  Clock, 
  Bell, 
  BellRing, 
  BellOff, 
  Volume2, 
  VolumeX, 
  Play, 
  Plus, 
  CheckCircle2, 
  MessageCircle, 
  Phone, 
  Send, 
  Sparkles, 
  User, 
  Building, 
  Trash2, 
  Edit3, 
  AlertTriangle, 
  ChevronRight, 
  HelpCircle,
  Check,
  RefreshCw
} from 'lucide-react';
import { LeadItem, AppointmentRecord, AppointmentType, AlarmSoundType, StatusColor } from '../types';
import { soundEngine } from '../utils/audio';
import { formatCurrency, cleanPhoneNumber } from '../utils/whatsapp';

interface ChatbotAppointmentManagerProps {
  leads: LeadItem[];
  appointments: AppointmentRecord[];
  onAddAppointment: (apt: Omit<AppointmentRecord, 'id' | 'createdAt'>) => void;
  onUpdateAppointment: (apt: AppointmentRecord) => void;
  onDeleteAppointment: (id: string) => void;
  onAddLeadFromBot: (lead: Omit<LeadItem, 'id' | 'createdAt'>) => void;
  onTriggerAlarmTest: (apt: AppointmentRecord) => void;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  options?: { label: string; value: string; action?: string; leadData?: any; aptData?: any }[];
  isCompleteCard?: boolean;
  cardData?: {
    clientName: string;
    phone: string;
    interest: string;
    type: AppointmentType;
    date: string;
    time: string;
    zone: string;
    budget?: number;
  };
}

export const ChatbotAppointmentManager: React.FC<ChatbotAppointmentManagerProps> = ({
  leads,
  appointments,
  onAddAppointment,
  onUpdateAppointment,
  onDeleteAppointment,
  onAddLeadFromBot,
  onTriggerAlarmTest,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'bot' | 'citas' | 'sonidos'>('bot');
  const [selectedBotFlow, setSelectedBotFlow] = useState<'comprador' | 'propietario' | 'recordatorio' | 'faq'>('comprador');
  
  // Sound testing state
  const [soundEnabled, setSoundEnabled] = useState(soundEngine.isEnabled());
  const [selectedAlarmSound, setSelectedAlarmSound] = useState<AlarmSoundType>('campana');
  const [isTestingSound, setIsTestingSound] = useState<string | null>(null);

  // New Appointment Modal
  const [isNewAptModalOpen, setIsNewAptModalOpen] = useState(false);
  const [newAptLeadId, setNewAptLeadId] = useState('');
  const [newAptLeadName, setNewAptLeadName] = useState('');
  const [newAptPhone, setNewAptPhone] = useState('7751280009');
  const [newAptType, setNewAptType] = useState<AppointmentType>('llamada');
  const [newAptTitle, setNewAptTitle] = useState('');
  const [newAptDate, setNewAptDate] = useState(new Date().toISOString().split('T')[0]);
  const [newAptTime, setNewAptTime] = useState('16:00');
  const [newAptNotes, setNewAptNotes] = useState('');
  const [newAptAlarmSound, setNewAptAlarmSound] = useState<AlarmSoundType>('campana');
  const [newAptAlarmOffset, setNewAptAlarmOffset] = useState<number>(15);

  // Chatbot conversation state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Filter for appointments
  const [aptFilter, setAptFilter] = useState<'todos' | 'hoy' | 'pendientes' | 'completadas'>('todos');

  // Auto scroll chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  // Initial bot message on flow change
  useEffect(() => {
    initBotScenario(selectedBotFlow);
  }, [selectedBotFlow]);

  const initBotScenario = (scenario: 'comprador' | 'propietario' | 'recordatorio' | 'faq') => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let initial: ChatMessage[] = [];

    if (scenario === 'comprador') {
      initial = [
        {
          id: 'msg-1',
          sender: 'bot',
          text: '¡Hola! 👋 Bienvenido a la Asesoría Inmobiliaria del Ing. Ramírez (WhatsApp: 775 128 0009). Soy su asistente virtual inteligente.\n\nDetecto que busca una propiedad. ¿Qué tipo de inmueble le interesa?',
          time: nowTime,
          options: [
            { label: '🏡 Casa con jardín', value: 'casa', action: 'step_zone' },
            { label: '🏢 Departamento céntrico', value: 'departamento', action: 'step_zone' },
            { label: '📐 Terreno para construir', value: 'terreno', action: 'step_zone' },
            { label: '🏪 Local comercial u oficina', value: 'local', action: 'step_zone' },
          ],
        },
      ];
    } else if (scenario === 'propietario') {
      initial = [
        {
          id: 'msg-1',
          sender: 'bot',
          text: '¡Hola estimado propietario! 🏠 En el despacho del Ing. Ramírez le ayudamos a vender o rentar su inmueble con máxima seguridad, respaldo legal y rapidez.\n\n¿Qué tipo de propiedad desea que promovamos?',
          time: nowTime,
          options: [
            { label: 'Vender Casa / Depto', value: 'vender_casa', action: 'owner_zone' },
            { label: 'Poner en Renta', value: 'renta', action: 'owner_zone' },
            { label: 'Vender Terreno / Rancho', value: 'terreno', action: 'owner_zone' },
          ],
        },
      ];
    } else if (scenario === 'recordatorio') {
      const targetApt = appointments[0] || {
        leadName: 'Ing. Carlos Mendoza',
        date: 'Hoy',
        time: '4:30 PM',
        title: 'Firma de Contrato Promesa',
        leadPhone: '7751280009',
      };
      initial = [
        {
          id: 'msg-1',
          sender: 'bot',
          text: `🔔 *RECORDATORIO AUTOMÁTICO DE CITA*\n\nHola ${targetApt.leadName}, el Ing. Ramírez le recuerda su cita programada:\n\n📅 Fecha: *${targetApt.date}*\n⏰ Hora: *${targetApt.time}*\n📌 Asunto: *${targetApt.title}*\n\n¿Nos confirma su asistencia con el Ing. Ramírez?`,
          time: nowTime,
          options: [
            { label: '✅ Sí, confirmadísimo', value: 'confirmar', action: 'reminder_confirm' },
            { label: '⏰ Reagendar horario', value: 'reagendar', action: 'reminder_reschedule' },
            { label: '📞 Deseo llamada previa', value: 'llamar', action: 'reminder_call' },
          ],
        },
      ];
    } else {
      // FAQ
      initial = [
        {
          id: 'msg-1',
          sender: 'bot',
          text: '¡Hola! 🤖 Soy el asistente inteligente del Ing. Ramírez. ¿Qué consulta o duda le gustaría resolver en este momento?',
          time: nowTime,
          options: [
            { label: '¿Qué gastos notariales debo prever?', value: 'notaria', action: 'faq_ans' },
            { label: '¿Aceptan crédito Infonavit o Bancario?', value: 'credito', action: 'faq_ans' },
            { label: '¿Cuánto cobra el Ing. Ramírez de comisión?', value: 'comision', action: 'faq_ans' },
            { label: 'Agendar llamada con el Ing. Ramírez', value: 'humano', action: 'schedule_human' },
          ],
        },
      ];
    }

    setChatMessages(initial);
  };

  const handleOptionClick = (option: NonNullable<ChatMessage['options']>[0]) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // User message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: option.label,
      time: nowTime,
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      processBotLogic(option);
      setIsTyping(false);
      soundEngine.playMessagePop();
    }, 600);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userInput.trim(),
      time: nowTime,
    };

    setChatMessages((prev) => [...prev, userMsg]);
    const inputVal = userInput.trim();
    setUserInput('');
    setIsTyping(true);

    setTimeout(() => {
      processFreeTextLogic(inputVal);
      setIsTyping(false);
      soundEngine.playMessagePop();
    }, 700);
  };

  const processBotLogic = (option: NonNullable<ChatMessage['options']>[0]) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const { action, value } = option;

    if (action === 'step_zone') {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `Excelente elección. Tenemos opciones de ${value === 'casa' ? 'casas residenciales' : value === 'departamento' ? 'departamentos' : 'inmuebles'} con alta plusvalía.\n\n¿En qué zona o colonia prefieres buscar?`,
          time: nowTime,
          options: [
            { label: '📍 Del Valle / Nápoles', value: 'Del Valle', action: 'step_budget' },
            { label: '📍 Polanco / Anzures', value: 'Polanco', action: 'step_budget' },
            { label: '📍 Roma / Condesa', value: 'Roma Norte', action: 'step_budget' },
            { label: '📍 Otra Zona / Tulancingo Centro', value: 'Centro', action: 'step_budget' },
          ],
        },
      ]);
    } else if (action === 'step_budget') {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `Perfecto, en la zona de ${value} contamos con propiedades verificadas.\n\n¿Cuál es tu rango aproximado de inversión o presupuesto?`,
          time: nowTime,
          options: [
            { label: '💵 $2.5M a $4.0M MXN', value: '3500000', action: 'step_schedule' },
            { label: '💵 $4.0M a $6.5M MXN', value: '5200000', action: 'step_schedule' },
            { label: '💵 $6.5M a $10M+ MXN', value: '8500000', action: 'step_schedule' },
            { label: '🔑 Renta ($15k - $35k/mes)', value: '25000', action: 'step_schedule' },
          ],
        },
      ]);
    } else if (action === 'step_schedule') {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: '¡Listo! Para presentarle las 3 opciones verificadas por el Ing. Ramírez y coordinar una atención personalizada sin compromiso, ¿qué modalidad prefiere?',
          time: nowTime,
          options: [
            { label: '📞 Llamada con el Ing. Ramírez (Hoy 5:00 PM)', value: 'llamada_hoy', action: 'finalize_buyer_apt', aptData: { type: 'llamada', time: '17:00' } },
            { label: '🏠 Visita al Inmueble con el Ing. Ramírez', value: 'visita_manana', action: 'finalize_buyer_apt', aptData: { type: 'cita_visita', time: '11:00' } },
            { label: '💬 Ficha por WhatsApp del Ing. Ramírez (7751280009)', value: 'whatsapp_direct', action: 'finalize_buyer_apt', aptData: { type: 'seguimiento', time: '12:00' } },
          ],
        },
      ]);
    } else if (action === 'finalize_buyer_apt') {
      const aptType: AppointmentType = option.aptData?.type || 'llamada';
      const scheduledTime = option.aptData?.time || '17:00';
      const clientName = 'Lic. Javier Morales (Prospecto WhatsApp)';
      const clientPhone = '7751280009';
      const targetZone = 'Del Valle / Polanco';

      // Auto create Appointment
      onAddAppointment({
        leadName: clientName,
        leadPhone: clientPhone,
        leadType: 'prospecto',
        type: aptType,
        title: aptType === 'cita_visita' ? 'Visita Guiada con Ing. Ramírez' : 'Llamada de Calificación con Ing. Ramírez',
        date: new Date().toISOString().split('T')[0],
        time: scheduledTime,
        propertyTitle: 'Propiedad Seleccionada por Chatbot',
        notes: `Generado automáticamente por Chatbot para el Ing. Ramírez. Presupuesto estimado $4.5M en ${targetZone}.`,
        status: 'confirmada',
        alarmEnabled: true,
        alarmSound: 'campana',
        alarmOffsetMinutes: 15,
      });

      // Auto create Lead
      onAddLeadFromBot({
        type: 'prospecto',
        name: clientName,
        phone: clientPhone,
        propertyTitle: 'Interés en Casa/Depto vía Chatbot',
        propertyType: 'casa',
        operationType: 'venta',
        zone: targetZone,
        price: 4500000,
        currency: 'MXN',
        status: 'verde',
        nextActionDate: new Date().toISOString().split('T')[0],
        nextActionNote: `Atender ${aptType} a las ${scheduledTime} hrs pactada en Chatbot`,
        lastContactDate: new Date().toISOString(),
        notes: 'Lead captado y calificado automáticamente para el Ing. Ramírez.',
      });

      soundEngine.playSuccess();

      setChatMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `🎉 *¡CITA AGENDADA CON ÉXITO!* 🎉\n\nEstimado *ING. RAMÍREZ*, se ha registrado en su Agenda Inmobiliaria con semáforo 🟢 *VERDE*.\n🔔 *Alarma Sonora Activada* con sonido de campana 15 min antes.\n📲 Notificación enviada al WhatsApp *${clientPhone}*.`,
          time: nowTime,
          isCompleteCard: true,
          cardData: {
            clientName,
            phone: clientPhone,
            interest: 'Casa/Depto $4.5M MXN',
            type: aptType,
            date: 'Hoy',
            time: scheduledTime,
            zone: targetZone,
          },
        },
      ]);
    } else if (action === 'owner_zone') {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: 'Excelente. Para que el Ing. Ramírez elabore su estudio de valor comercial y coordine la sesión fotográfica del inmueble, ¿en qué zona se ubica su propiedad?',
          time: nowTime,
          options: [
            { label: '📍 Del Valle / Nápoles', value: 'Del Valle', action: 'owner_schedule' },
            { label: '📍 Polanco / Anzures', value: 'Polanco', action: 'owner_schedule' },
            { label: '📍 Tulancingo / Hidalgo', value: 'Tulancingo', action: 'owner_schedule' },
            { label: '📍 Otra Ubicación', value: 'Otra', action: 'owner_schedule' },
          ],
        },
      ]);
    } else if (action === 'owner_schedule') {
      const ownerName = 'Sr. Guillermo Peña (Propietario)';
      const ownerPhone = '7751280009';

      onAddAppointment({
        leadName: ownerName,
        leadPhone: ownerPhone,
        leadType: 'dueno',
        type: 'cita_visita',
        title: 'Visita de Captación & Valuación con Ing. Ramírez',
        date: new Date().toISOString().split('T')[0],
        time: '18:00',
        propertyTitle: `Inmueble en ${value} para Promoción`,
        notes: 'Propietario listo para revisión de documentos con el Ing. Ramírez.',
        status: 'confirmada',
        alarmEnabled: true,
        alarmSound: 'marimba',
        alarmOffsetMinutes: 30,
      });

      onAddLeadFromBot({
        type: 'dueno',
        name: ownerName,
        phone: ownerPhone,
        propertyTitle: `Propiedad en ${value} (En Venta)`,
        propertyType: 'casa',
        operationType: 'venta',
        zone: String(value),
        price: 5200000,
        currency: 'MXN',
        commissionPercent: 5,
        estimatedCommission: 260000,
        status: 'amarillo',
        nextActionDate: new Date().toISOString().split('T')[0],
        nextActionNote: 'Visita de captación a las 6:00 PM con Ing. Ramírez',
        lastContactDate: new Date().toISOString(),
        notes: 'Captado por Chatbot de Propietarios para el Ing. Ramírez.',
      });

      soundEngine.playSuccess();

      setChatMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `🏠 *¡VISITA DE CAPTACIÓN REGISTRADA!* 🏠\n\nEstimado *ING. RAMÍREZ*, se programó la visita para hoy a las 6:00 PM con ${ownerName}.\n🔔 *Alarma Sonora y Recordatorio Activados*.\n📊 Se añadió a su Agenda con comisión potencial estimada de $260,000 MXN.`,
          time: nowTime,
          isCompleteCard: true,
          cardData: {
            clientName: ownerName,
            phone: ownerPhone,
            interest: `Captación de Inmueble en ${value}`,
            type: 'cita_visita',
            date: 'Hoy',
            time: '18:00 hrs',
            zone: String(value),
          },
        },
      ]);
    } else if (action === 'reminder_confirm') {
      soundEngine.playSuccess();
      setChatMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: '✨ *¡Cita Confirmada por el Cliente!* ✨\n\nEstimado *ING. RAMÍREZ*, el cliente ha confirmado su asistencia puntual. La cita se actualizó a *Confirmada* y la alarma sonará en su dispositivo en el horario programado.',
          time: nowTime,
        },
      ]);
    } else if (action === 'reminder_reschedule') {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: 'Entendido. Le comparto los horarios disponibles en la agenda del Ing. Ramírez:\n\n1️⃣ Mañana 10:30 AM\n2️⃣ Mañana 4:30 PM\n3️⃣ Sábado 11:00 AM\n\n¿Cuál se acomoda mejor a su horario?',
          time: nowTime,
          options: [
            { label: 'Mañana 10:30 AM', value: 'manana_1030', action: 'reminder_confirm' },
            { label: 'Mañana 4:30 PM', value: 'manana_1630', action: 'reminder_confirm' },
            { label: 'Sábado 11:00 AM', value: 'sabado_1100', action: 'reminder_confirm' },
          ],
        },
      ]);
    } else if (action === 'reminder_call') {
      soundEngine.playAlarm('urgente');
      setChatMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: '🚨 *SOLICITUD DE LLAMADA INMEDIATA*\n\nEstimado *ING. RAMÍREZ*, el cliente solicita una llamada previa de 3 minutos antes de acudir. Le sugerimos marcarle directamente.',
          time: nowTime,
        },
      ]);
    } else if (action === 'faq_ans') {
      let resp = '';
      if (value === 'notaria') {
        resp = '📜 *Gastos Notariales e Impuestos (ISAI):*\nEn compras inmobiliarias tramitadas con el Ing. Ramírez, los gastos notariales suelen representar entre el 5% y 7% del valor total de la propiedad (incluye escrituración, avalúo fiscal, derechos de registro y honorarios del notario).';
      } else if (value === 'credito') {
        resp = '💳 *Créditos Aceptados:*\nEl despacho del Ing. Ramírez trabaja con todos los bancos (Santander, BBVA, Banorte, Scotiabank), Infonavit Total, Cofinavit y Fovissste. Tramitamos su precalificación en menos de 24 horas sin costo extra.';
      } else if (value === 'comision') {
        resp = '💼 *Comisión de Venta del Ing. Ramírez:*\nLa comisión estándar es del 4% al 5% a éxito (solo se cobra si se vende). Incluye estudio de mercado, fotos profesionales, promoción en portales prémium y asesoría legal completa hasta la firma notarial.';
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: resp,
          time: nowTime,
          options: [
            { label: '📅 Agendar llamada con el Ing. Ramírez', value: 'call', action: 'schedule_human' },
            { label: '❓ Otra duda frecuente', value: 'faq', action: 'faq_reset' },
          ],
        },
      ]);
    } else if (action === 'schedule_human' || action === 'faq_reset') {
      initBotScenario('comprador');
    }
  };

  const processFreeTextLogic = (text: string) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const lower = text.toLowerCase();

    if (lower.includes('cita') || lower.includes('agenda') || lower.includes('visita') || lower.includes('ver') || lower.includes('llamar')) {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `Con gusto agendamos su cita con el Ing. Ramírez para atender "${text}".\n\n¿Qué día y horario prefiere?`,
          time: nowTime,
          options: [
            { label: '📅 Hoy por la tarde (5:00 PM)', value: 'hoy_tarde', action: 'finalize_buyer_apt', aptData: { type: 'cita_visita', time: '17:00' } },
            { label: '📅 Mañana por la mañana (11:00 AM)', value: 'manana_manana', action: 'finalize_buyer_apt', aptData: { type: 'cita_visita', time: '11:00' } },
            { label: '📞 Llamada telefónica con el Ing. Ramírez', value: 'llamada', action: 'finalize_buyer_apt', aptData: { type: 'llamada', time: '16:30' } },
          ],
        },
      ]);
    } else if (lower.includes('precio') || lower.includes('costo') || lower.includes('cuanto') || lower.includes('millon')) {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: 'El Ing. Ramírez cuenta con un inventario verificado desde $1.8M hasta $15M MXN. ¿Qué presupuesto de inversión tiene contemplado para enviarle el catálogo filtrado?',
          time: nowTime,
          options: [
            { label: 'Hasta $3.5M MXN', value: '3.5M', action: 'step_schedule' },
            { label: 'De $3.5M a $7.0M MXN', value: '7.0M', action: 'step_schedule' },
            { label: 'Más de $7.0M MXN (Prémium)', value: '10M', action: 'step_schedule' },
          ],
        },
      ]);
    } else {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `Recibido: "${text}". El Ing. Ramírez o su equipo atenderá su mensaje de inmediato. Para coordinar atención prioritaria, seleccione una acción:`,
          time: nowTime,
          options: [
            { label: '📅 Agendar Visita con Ing. Ramírez', value: 'visita', action: 'finalize_buyer_apt', aptData: { type: 'cita_visita', time: '17:00' } },
            { label: '📞 Solicitar Llamada del Ing. Ramírez', value: 'llamada', action: 'finalize_buyer_apt', aptData: { type: 'llamada', time: '16:00' } },
            { label: '💬 Escribir al WhatsApp 775 128 0009', value: 'wa', action: 'finalize_buyer_apt', aptData: { type: 'seguimiento', time: '12:00' } },
          ],
        },
      ]);
    }
  };

  const handleTestSound = (soundType: AlarmSoundType) => {
    setIsTestingSound(soundType);
    soundEngine.playAlarm(soundType);
    setTimeout(() => {
      setIsTestingSound(null);
    }, 1200);
  };

  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    soundEngine.setEnabled(nextState);
    setSoundEnabled(nextState);
    if (nextState) {
      soundEngine.playSuccess();
    }
  };

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAptLeadName.trim() || !newAptTitle.trim()) return;

    onAddAppointment({
      leadId: newAptLeadId || undefined,
      leadName: newAptLeadName.trim(),
      leadPhone: newAptPhone.trim() || '7751280009',
      leadType: 'prospecto',
      type: newAptType,
      title: newAptTitle.trim(),
      date: newAptDate,
      time: newAptTime,
      notes: newAptNotes.trim(),
      status: 'confirmada',
      alarmEnabled: true,
      alarmSound: newAptAlarmSound,
      alarmOffsetMinutes: newAptAlarmOffset,
    });

    soundEngine.playSuccess();
    setIsNewAptModalOpen(false);

    // Reset fields
    setNewAptLeadName('');
    setNewAptTitle('');
    setNewAptNotes('');
  };

  // Group and sort appointments
  const todayStr = new Date().toISOString().split('T')[0];
  const filteredAppointments = appointments.filter((apt) => {
    if (aptFilter === 'hoy') return apt.date === todayStr;
    if (aptFilter === 'pendientes') return apt.status === 'pendiente' || apt.status === 'confirmada';
    if (aptFilter === 'completadas') return apt.status === 'completada';
    return true;
  });

  const todayCount = appointments.filter((a) => a.date === todayStr && a.status !== 'completada').length;
  const pendingCount = appointments.filter((a) => a.status === 'pendiente' || a.status === 'confirmada').length;

  return (
    <div id="section-chatbot-appointments" className="space-y-6">
      
      {/* Top Banner Navigation & Quick Alarms Status */}
      <div className="bg-white border border-slate-300 rounded-3xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shadow-xs">
              <Bot className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit',sans-serif] tracking-tight">
                  Chatbot & Alarmas de Citas
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  WhatsApp 775 128 0009
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Contesta prospectos, agenda citas y activa alarmas con sonido para llamadas prioritarias.
              </p>
            </div>
          </div>

          {/* Sound Toggle and Sub-Tabs */}
          <div className="flex flex-wrap items-center gap-2 self-stretch lg:self-auto justify-end">
            
            {/* Sound Master Switch */}
            <button
              onClick={handleToggleSound}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold border transition-all ${
                soundEnabled
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100'
              }`}
              title={soundEnabled ? 'Sonidos y Alarmas Activadas' : 'Sonidos Silenciados'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-rose-600" />}
              <span>{soundEnabled ? 'Sonido Activado' : 'Silenciado'}</span>
            </button>

            {/* Test Alarm Immediate Button */}
            <button
              onClick={() => {
                const sampleApt: AppointmentRecord = appointments[0] || {
                  id: 'test-now',
                  leadName: 'Cliente Urgente (Prueba)',
                  leadPhone: '7751280009',
                  leadType: 'prospecto',
                  type: 'llamada',
                  title: '¡Hora de la llamada de cierre!',
                  date: todayStr,
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  status: 'pendiente',
                  alarmEnabled: true,
                  alarmSound: selectedAlarmSound,
                  alarmOffsetMinutes: 0,
                  createdAt: new Date().toISOString(),
                };
                onTriggerAlarmTest(sampleApt);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black shadow-xs transition-all active:scale-95"
              title="Disparar alarma y sonido de prueba en pantalla completa"
            >
              <BellRing className="w-4 h-4" />
              <span>⚡ Probar Alarma</span>
            </button>

            {/* Sub-tab pills */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setActiveSubTab('bot')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeSubTab === 'bot'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                💬 Chatbot Bot
              </button>
              <button
                onClick={() => setActiveSubTab('citas')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  activeSubTab === 'citas'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                📅 Citas ({pendingCount})
              </button>
              <button
                onClick={() => setActiveSubTab('sonidos')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeSubTab === 'sonidos'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🔔 Tonos de Alarma
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* ===================== SUBTAB 1: CHATBOT INTERACTIVO ===================== */}
      {activeSubTab === 'bot' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Flow Selector & Controls */}
          <div className="lg:col-span-4 space-y-4">
            
            <div className="bg-white border border-slate-300 rounded-3xl p-5 shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
                  Selecciona el Flujo del Chatbot
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Prueba las respuestas automáticas antes de enviarlas al cliente.
                </p>
              </div>

              <div className="space-y-2">
                {[
                  {
                    id: 'comprador',
                    title: '🏢 Calificar & Agendar Comprador',
                    desc: 'Pide tipo, zona, presupuesto y agenda llamada/visita.',
                    badge: 'Más Usado',
                    color: 'emerald',
                  },
                  {
                    id: 'propietario',
                    title: '🏠 Captación de Propietario (Dueño)',
                    desc: 'Recaba datos de casa y agenda visita de valuación.',
                    badge: 'Dueños',
                    color: 'indigo',
                  },
                  {
                    id: 'recordatorio',
                    title: '🔔 Recordatorio Automático de Cita',
                    desc: 'Pide confirmación 24h antes y avisa al asesor.',
                    badge: 'Anti-Faltas',
                    color: 'amber',
                  },
                  {
                    id: 'faq',
                    title: '🤖 Dudas de Crédito & Notaría',
                    desc: 'Explica gastos, Infonavit y comisiones de venta.',
                    badge: 'IA FAQ',
                    color: 'purple',
                  },
                ].map((flow) => {
                  const isSelected = selectedBotFlow === flow.id;
                  return (
                    <button
                      key={flow.id}
                      onClick={() => setSelectedBotFlow(flow.id as any)}
                      className={`w-full p-3 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{flow.title}</span>
                        <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                          {flow.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 font-medium leading-relaxed">
                        {flow.desc}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-slate-200">
                <button
                  onClick={() => initBotScenario(selectedBotFlow)}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reiniciar Conversación</span>
                </button>
              </div>
            </div>

            {/* Quick Automation Info Card */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-3xl p-4 shadow-xs">
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                  Beneficio de la Automatización
                </h4>
              </div>
              <ul className="text-xs text-emerald-900 space-y-1.5 font-medium leading-relaxed">
                <li>• <strong>Cero prospectos perdidos:</strong> responde en 10 segundos día y noche.</li>
                <li>• <strong>Auto-Registro:</strong> guarda automáticamente el contacto en tu semáforo 🟢.</li>
                <li>• <strong>Alarma al móvil:</strong> te notifica con sonido antes de cada cita.</li>
              </ul>
            </div>

          </div>

          {/* Right Column: WhatsApp Simulator Chat Interface */}
          <div className="lg:col-span-8">
            <div className="bg-white border border-slate-300 rounded-3xl overflow-hidden shadow-xs flex flex-col h-[580px]">
              
              {/* Chat Header */}
              <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center">
                      <Bot className="w-6 h-6" />
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900"></span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">
                        Asistente Virtual del Ing. Ramírez
                      </h4>
                      <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                        En línea 24/7
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-mono">
                      WhatsApp: +52 775 128 0009 | Asesoría Inmobiliaria
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                    Simulador Interactivo
                  </span>
                </div>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 p-4 sm:p-5 overflow-y-auto bg-slate-50/70 space-y-4">
                {chatMessages.map((msg) => {
                  const isBot = msg.sender === 'bot';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isBot ? 'items-start' : 'items-end'} animate-in fade-in slide-in-from-bottom-1 duration-150`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[75%] p-3.5 rounded-2xl text-xs sm:text-sm whitespace-pre-wrap leading-relaxed shadow-xs ${
                          isBot
                            ? 'bg-white border border-slate-200 text-slate-900 rounded-tl-xs'
                            : 'bg-emerald-600 text-white rounded-tr-xs font-medium'
                        }`}
                      >
                        {msg.text}

                        {/* Complete Confirmation Card inside bot message */}
                        {msg.isCompleteCard && msg.cardData && (
                          <div className="mt-3 p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-slate-900 text-xs space-y-1.5 font-sans">
                            <div className="font-bold text-emerald-950 flex items-center gap-1.5 border-b border-emerald-200 pb-1">
                              <Calendar className="w-4 h-4 text-emerald-700" />
                              Ficha de Cita Creada
                            </div>
                            <div><strong>Cliente:</strong> {msg.cardData.clientName} ({msg.cardData.phone})</div>
                            <div><strong>Tipo:</strong> {msg.cardData.type === 'cita_visita' ? '🏠 Visita al Inmueble' : '📞 Llamada de Asesoría'}</div>
                            <div><strong>Horario:</strong> {msg.cardData.date} a las {msg.cardData.time}</div>
                            <div><strong>Zona:</strong> {msg.cardData.zone}</div>
                            <div className="pt-1 text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                              <Bell className="w-3.5 h-3.5" />
                              Alarma con sonido programada en sistema
                            </div>
                          </div>
                        )}

                        <span
                          className={`block text-[10px] mt-1 text-right ${
                            isBot ? 'text-slate-400' : 'text-emerald-100'
                          }`}
                        >
                          {msg.time}
                        </span>
                      </div>

                      {/* Interactive Option Chips for Bot Messages */}
                      {isBot && msg.options && msg.options.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5 max-w-[90%]">
                          {msg.options.map((opt, i) => (
                            <button
                              key={i}
                              onClick={() => handleOptionClick(opt)}
                              className="px-3 py-1.5 rounded-full bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-300 hover:border-emerald-500 text-xs font-bold shadow-xs transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-1"
                            >
                              <span>{opt.label}</span>
                              <ChevronRight className="w-3 h-3 text-emerald-600" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-white border border-slate-200 text-slate-500 w-20 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                )}

                <div ref={chatBottomRef} />
              </div>

              {/* Chat Input Footer */}
              <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Escribe como si fueras el cliente (ej: 'Quiero ver la casa hoy a las 5')"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
                <button
                  type="submit"
                  disabled={!userInput.trim()}
                  className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold transition-all active:scale-95 shadow-xs"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

            </div>
          </div>

        </div>
      )}

      {/* ===================== SUBTAB 2: LISTA DE CITAS & RECORDATORIOS ===================== */}
      {activeSubTab === 'citas' && (
        <div className="space-y-4">
          
          {/* Citas Filter Header & Actions */}
          <div className="bg-white border border-slate-300 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'todos', label: 'Todas las Citas', count: appointments.length },
                { id: 'hoy', label: '🔔 Para Hoy', count: todayCount },
                { id: 'pendientes', label: '⏳ Pendientes', count: pendingCount },
                { id: 'completadas', label: '✅ Completadas', count: appointments.filter(a => a.status === 'completada').length },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setAptFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    aptFilter === f.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {f.label} ({f.count})
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsNewAptModalOpen(true)}
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-xs transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Agendar Nueva Cita</span>
            </button>
          </div>

          {/* Appointments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAppointments.length === 0 ? (
              <div className="col-span-full py-12 text-center bg-white border border-slate-300 rounded-3xl">
                <Calendar className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-800">No hay citas en este filtro</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Usa el botón "Agendar Nueva Cita" o activa el Chatbot para agendarlas automáticamente.
                </p>
              </div>
            ) : (
              filteredAppointments.map((apt) => {
                const isToday = apt.date === todayStr;
                const isCompleted = apt.status === 'completada';

                return (
                  <div
                    key={apt.id}
                    className={`bg-white border rounded-3xl p-5 space-y-4 shadow-xs transition-all ${
                      isCompleted
                        ? 'border-slate-200 opacity-75'
                        : isToday
                        ? 'border-emerald-400 ring-2 ring-emerald-500/10'
                        : 'border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            isCompleted
                              ? 'bg-slate-400'
                              : isToday
                              ? 'bg-emerald-500 animate-pulse'
                              : 'bg-amber-500'
                          }`}
                        />
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                          {apt.type === 'cita_visita'
                            ? '🏠 Visita Presencial'
                            : apt.type === 'llamada'
                            ? '📞 Llamada Telefónica'
                            : apt.type === 'reunion_cierre'
                            ? '🤝 Reunión de Cierre'
                            : '💬 Seguimiento'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            onUpdateAppointment({
                              ...apt,
                              alarmEnabled: !apt.alarmEnabled,
                            });
                          }}
                          className={`p-1.5 rounded-lg text-xs font-bold border transition-colors ${
                            apt.alarmEnabled
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                              : 'bg-slate-100 text-slate-400 border-slate-200'
                          }`}
                          title={apt.alarmEnabled ? 'Alarma activada' : 'Alarma apagada'}
                        >
                          {apt.alarmEnabled ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={() => onDeleteAppointment(apt.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Eliminar cita"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Title & Contact Info */}
                    <div>
                      <h4 className={`text-base font-bold text-slate-900 ${isCompleted ? 'line-through text-slate-500' : ''}`}>
                        {apt.title}
                      </h4>
                      <div className="text-xs font-semibold text-slate-700 mt-1 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{apt.leadName}</span>
                        <span className="text-slate-400">•</span>
                        <span className="font-mono text-slate-600">{apt.leadPhone}</span>
                      </div>
                    </div>

                    {/* Date & Time Pill */}
                    <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                        <Calendar className="w-4 h-4 text-emerald-600" />
                        <span>{isToday ? '¡HOY!' : apt.date}</span>
                        <span className="text-slate-400">•</span>
                        <Clock className="w-4 h-4 text-emerald-600" />
                        <span className="font-mono">{apt.time} hrs</span>
                      </div>

                      {/* Sound Badge & Test Button */}
                      <button
                        onClick={() => handleTestSound(apt.alarmSound || 'campana')}
                        className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-white px-2 py-1 rounded-lg border border-slate-200 hover:border-emerald-300 shadow-2xs"
                        title="Probar sonido de esta cita"
                      >
                        <Volume2 className="w-3 h-3 text-emerald-600" />
                        <span className="capitalize">{apt.alarmSound || 'Campana'}</span>
                      </button>
                    </div>

                    {apt.notes && (
                      <p className="text-xs text-slate-600 font-medium line-clamp-2 bg-amber-50/60 p-2 rounded-xl border border-amber-200">
                        📌 {apt.notes}
                      </p>
                    )}

                    {/* Action Buttons */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <a
                          href={`https://wa.me/${cleanPhoneNumber(apt.leadPhone)}?text=${encodeURIComponent(
                            `Hola ${apt.leadName}, te contacto sobre nuestra cita programada para ${isToday ? 'hoy' : apt.date} a las ${apt.time}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all"
                          title="Mandar WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>WhatsApp</span>
                        </a>

                        <a
                          href={`tel:${apt.leadPhone}`}
                          className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold transition-all"
                          title="Llamada telefónica"
                        >
                          <Phone className="w-3.5 h-3.5 text-slate-600" />
                        </a>
                      </div>

                      <button
                        onClick={() => {
                          onUpdateAppointment({
                            ...apt,
                            status: isCompleted ? 'confirmada' : 'completada',
                          });
                        }}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          isCompleted
                            ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            : 'bg-slate-900 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{isCompleted ? 'Reabrir' : 'Atendida'}</span>
                      </button>
                    </div>

                  </div>
                );
              })
            )}
          </div>

        </div>
      )}

      {/* ===================== SUBTAB 3: CONFIGURACIÓN DE SONIDOS & TONOS ===================== */}
      {activeSubTab === 'sonidos' && (
        <div className="bg-white border border-slate-300 rounded-3xl p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Biblioteca de Tonos y Alarmas Sonoras
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              Sintetizador Web Audio API integrado: tonos limpios, audibles y sin cortes para notificaciones inmobiliarias.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                id: 'campana',
                name: 'Campana Doble Prémium',
                desc: 'Acorde armónico en C6/G6. Ideal para citas confirmadas y recordatorios suaves.',
                icon: '🔔',
              },
              {
                id: 'digital',
                name: 'Digital Tech Beep',
                desc: 'Pulsaciones nítidas estilo smartwatch. Excelente para llamadas prioritarias.',
                icon: '⏱️',
              },
              {
                id: 'marimba',
                name: 'Marimba Cálida',
                desc: 'Acorde tríada suave de madera. Muy amigable y no invasivo.',
                icon: '🪵',
              },
              {
                id: 'urgente',
                name: 'Alarma de Alta Prioridad',
                desc: 'Tono triple de alerta intensa. Para citas en los próximos 5 minutos.',
                icon: '🚨',
              },
            ].map((snd) => {
              const isTesting = isTestingSound === snd.id;
              const isSelected = selectedAlarmSound === snd.id;

              return (
                <div
                  key={snd.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/20'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="text-2xl mb-2">{snd.icon}</div>
                  <h4 className="text-xs font-bold text-slate-900">{snd.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-1 mb-3 leading-relaxed">
                    {snd.desc}
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTestSound(snd.id as AlarmSoundType)}
                      className="flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold border border-slate-300 shadow-2xs transition-all active:scale-95"
                    >
                      <Play className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                      <span>{isTesting ? 'Sonando...' : 'Escuchar'}</span>
                    </button>

                    <button
                      onClick={() => setSelectedAlarmSound(snd.id as AlarmSoundType)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                      }`}
                    >
                      {isSelected ? 'Por Defecto' : 'Elegir'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-900">
                  Prueba de Sonido de Confirmación & Mensaje
                </h5>
                <p className="text-xs text-slate-600">
                  Escucha el sonido ascendente que se emite cuando el bot agenda una cita exitosa.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => soundEngine.playMessagePop()}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold border border-slate-300 shadow-2xs"
              >
                Pop Mensaje
              </button>
              <button
                onClick={() => soundEngine.playSuccess()}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-2xs"
              >
                Fanfarria Éxito ✨
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODAL: NUEVA CITA MANUAL ===================== */}
      {isNewAptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white border border-slate-300 rounded-3xl shadow-2xl overflow-hidden my-8 text-slate-900">
            
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Agendar Cita o Llamada con Alarma
                  </h3>
                  <p className="text-xs text-slate-400">
                    Configura fecha, hora y tono de notificación
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsNewAptModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="p-5 sm:p-6 space-y-4">
              
              {/* Tipo de Cita */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Tipo de Actividad
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'llamada', label: '📞 Llamada Telefónica' },
                    { id: 'cita_visita', label: '🏠 Visita al Inmueble' },
                    { id: 'reunion_cierre', label: '🤝 Firma / Cierre' },
                    { id: 'seguimiento', label: '💬 Seguimiento WhatsApp' },
                  ].map((t) => (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => setNewAptType(t.id as any)}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                        newAptType === t.id
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lead Selector or Direct Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Vincular a Contacto Existente (Opcional):
                </label>
                <select
                  value={newAptLeadId}
                  onChange={(e) => {
                    const lId = e.target.value;
                    setNewAptLeadId(lId);
                    const found = leads.find((l) => l.id === lId);
                    if (found) {
                      setNewAptLeadName(found.name);
                      setNewAptPhone(found.phone);
                      setNewAptTitle(`Llamada con ${found.name} sobre ${found.propertyTitle}`);
                    }
                  }}
                  className="w-full p-2.5 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-medium"
                >
                  <option value="">-- Escribir datos manualmente --</option>
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} ({l.type === 'dueno' ? 'Dueño' : 'Prospecto'}) - {l.zone}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nombre del Cliente *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAptLeadName}
                    onChange={(e) => setNewAptLeadName(e.target.value)}
                    placeholder="Ej: Lic. Mariana Garza"
                    className="w-full p-2.5 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAptPhone}
                    onChange={(e) => setNewAptPhone(e.target.value)}
                    placeholder="Ej: 7751280009"
                    className="w-full p-2.5 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono font-medium"
                  />
                </div>
              </div>

              {/* Asunto */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Asunto o Motivo de la Cita *
                </label>
                <input
                  type="text"
                  required
                  value={newAptTitle}
                  onChange={(e) => setNewAptTitle(e.target.value)}
                  placeholder="Ej: Visita guiada a casa en Del Valle y entrega de corrida"
                  className="w-full p-2.5 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-medium"
                />
              </div>

              {/* Fecha y Hora */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Fecha *
                  </label>
                  <input
                    type="date"
                    required
                    value={newAptDate}
                    onChange={(e) => setNewAptDate(e.target.value)}
                    className="w-full p-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Hora (24h) *
                  </label>
                  <input
                    type="time"
                    required
                    value={newAptTime}
                    onChange={(e) => setNewAptTime(e.target.value)}
                    className="w-full p-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-medium font-mono"
                  />
                </div>
              </div>

              {/* Sonido de Alarma & Anticipación */}
              <div className="grid grid-cols-2 gap-3 bg-emerald-50/60 p-3 rounded-2xl border border-emerald-200">
                <div>
                  <label className="block text-xs font-bold text-emerald-900 mb-1">
                    🔔 Tono de Alarma:
                  </label>
                  <select
                    value={newAptAlarmSound}
                    onChange={(e) => {
                      const snd = e.target.value as AlarmSoundType;
                      setNewAptAlarmSound(snd);
                      soundEngine.playAlarm(snd);
                    }}
                    className="w-full p-2 text-xs rounded-xl bg-white border border-emerald-300 text-slate-900 font-medium"
                  >
                    <option value="campana">Campana Doble</option>
                    <option value="digital">Digital Beep</option>
                    <option value="marimba">Marimba Cálida</option>
                    <option value="urgente">Alarma Urgente</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-emerald-900 mb-1">
                    ⏰ Avisarme con:
                  </label>
                  <select
                    value={newAptAlarmOffset}
                    onChange={(e) => setNewAptAlarmOffset(Number(e.target.value))}
                    className="w-full p-2 text-xs rounded-xl bg-white border border-emerald-300 text-slate-900 font-medium"
                  >
                    <option value={0}>Al momento exacto</option>
                    <option value={5}>5 minutos antes</option>
                    <option value={15}>15 minutos antes</option>
                    <option value={30}>30 minutos antes</option>
                    <option value={60}>1 hora antes</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Notas adicionales (Opcional):
                </label>
                <textarea
                  value={newAptNotes}
                  onChange={(e) => setNewAptNotes(e.target.value)}
                  rows={2}
                  placeholder="Ej: El cliente viene con su cónyuge. Solicitar llaves al vigilante."
                  className="w-full p-2.5 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 font-medium"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewAptModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md transition-all active:scale-95"
                >
                  Guardar Cita & Activar Alarma
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
