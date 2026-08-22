import React, { useState } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  PhoneCall, 
  Sparkles, 
  Building, 
  User, 
  Calendar, 
  Clock, 
  Calculator, 
  MessageCircle, 
  Mic, 
  ClipboardCopy, 
  ChevronRight, 
  Flame, 
  ShieldCheck, 
  AlertTriangle,
  ArrowRight,
  HelpCircle,
  Smartphone,
  Sun,
  Layers,
  FileSpreadsheet,
  Bot,
  BellRing,
  Volume2
} from 'lucide-react';
import { ViewTab } from '../types';

interface UserGuideProps {
  onNavigateTab: (tab: ViewTab) => void;
  onOpenQuickAdd: () => void;
  onOpenDirectWhatsApp?: () => void;
}

export const UserGuide: React.FC<UserGuideProps> = ({ 
  onNavigateTab, 
  onOpenQuickAdd,
  onOpenDirectWhatsApp 
}) => {
  const [activeSection, setActiveSection] = useState<string>('chatbot');

  const sections = [
    { id: 'chatbot', title: '🤖 Chatbot & Alarmas Sonoras', icon: Bot, color: 'text-emerald-700' },
    { id: 'semaforo', title: '🚦 Sistema de Semáforo', icon: ShieldCheck, color: 'text-emerald-700' },
    { id: 'captura', title: '⚡ Captura Rápida (15s)', icon: PhoneCall, color: 'text-blue-700' },
    { id: 'matcher', title: '💎 Smart Matcher Inmobiliario', icon: Sparkles, color: 'text-amber-700' },
    { id: 'visitas', title: '📋 Bitácora & Reporte al Dueño', icon: Calendar, color: 'text-indigo-700' },
    { id: 'calculadora', title: '🧮 Calculadora de Cierre', icon: Calculator, color: 'text-teal-700' },
    { id: 'whatsapp', title: '📲 WhatsApp & Respaldos', icon: MessageCircle, color: 'text-emerald-700' },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Guide Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-emerald-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-3 backdrop-blur-sm">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Manual Rápido del Asesor Inmobiliario</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-['Outfit',sans-serif]">
            Guía Práctica de Trabajo en Campo (Móvil)
          </h2>
          <p className="mt-2 text-sm sm:text-base text-blue-50 leading-relaxed">
            Aprende cómo usar la <strong>Agenda 360°</strong> desde tu celular para capturar prospectos al colgar, recordar seguimientos calientes y cerrar más tratos sin libretas ni desorden.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={onOpenQuickAdd}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-slate-900 font-bold text-xs sm:text-sm shadow-md hover:bg-blue-50 transition-all active:scale-95"
            >
              <PhoneCall className="w-4 h-4 text-emerald-600" />
              Probar Captura Rápida
            </button>
            <button
              onClick={() => onNavigateTab('agenda')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/30 transition-all"
            >
              Ir a la Agenda Principal
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Navigation Pills for Mobile */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {sections.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-200'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : sec.color}`} />
              <span>{sec.title}</span>
            </button>
          );
        })}
      </div>

      {/* CONTENT SECTIONS */}

      {/* 0. CHATBOT & ALARMAS SONORAS */}
      {activeSection === 'chatbot' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md">
                  Automatización Inmobiliaria 24/7
                </span>
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2 mt-1">
                  <Bot className="w-5 h-5 text-emerald-600" />
                  Chatbot Inmobiliario & Sistema de Alarmas Sonoras
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('chatbot')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 whitespace-nowrap self-start sm:self-auto"
              >
                <span>Abrir Chatbot & Citas</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              El sistema cuenta con un motor inteligente para <strong>atender prospectos en WhatsApp</strong>, capturar su presupuesto, calificar su intención, <strong>agendar llamadas/citas automáticamente</strong> y <strong>notificarte con alarmas sonoras</strong> para que nunca olvides un compromiso.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Feature 1 */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm">
                  1
                </div>
                <h4 className="font-bold text-slate-900 text-sm">
                  🤖 Chatbot WhatsApp Inteligente
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Flujos guiados para prospectos compradores (calificación de presupuesto y zona), propietarios que quieren vender, y respuestas a preguntas frecuentes inmobiliarias.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm">
                  2
                </div>
                <h4 className="font-bold text-slate-900 text-sm">
                  📅 Agendamiento Directo
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Permite al cliente o al asesor seleccionar día y hora. El bot crea la cita en la agenda y ofrece guardar el contacto como lead en 1 toque.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm">
                  3
                </div>
                <h4 className="font-bold text-slate-900 text-sm">
                  🔔 Alarmas Sonoras en Tiempo Real
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Sintetizador de sonido con 4 tonos (Campana, Digital, Marimba y Urgente) que emite alerta acústica y voz cuando la hora de la llamada o cita se cumple.
                </p>
              </div>
            </div>

            {/* How to use steps */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <BellRing className="w-4 h-4 text-amber-600" />
                Cómo funciona la Alerta Acústica en Campo:
              </h4>
              <ul className="text-xs text-slate-700 space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                  <span><strong>Monitoreo Automático:</strong> El sistema evalúa tus citas cada 10 segundos. Si tienes una cita programada para hoy a las 10:30 hrs y activaste la alarma, sonará puntualmente.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                  <span><strong>Ventana de Acción Rápida:</strong> Al sonar la alarma, se despliega una pantalla que te permite <strong>llamar de inmediato</strong>, <strong>abrir WhatsApp</strong> con mensaje de confirmación pre-llenado, o <strong>posponer 5 minutos</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                  <span><strong>Prueba de Tonos:</strong> En la pestaña <em>Chatbot & Citas</em> puedes presionar "Probar Alarma" en cualquier tarjeta de cita o escuchar cada tono en el selector.</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      )}

      {/* 1. SISTEMA DE SEMÁFORO */}
      {activeSection === 'semaforo' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              1. El Método del Semáforo Inmobiliario (Paz Mental)
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              El secreto para no abrumarse con 100 contactos es clasificar cada persona en 3 colores claros. Cada mañana, tu prioridad número 1 es el color <strong>Verde</strong>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Verde */}
              <div className="bg-emerald-50/80 border-2 border-emerald-400 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-600 text-white shadow-sm">
                    🟢 VERDE
                  </span>
                  <span className="text-xs font-bold text-emerald-800">Cierre Inminente</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1.5">Apartados, Ofertas y Exclusivas</h4>
                <p className="text-xs text-slate-700 leading-relaxed mb-3">
                  Clientes que ya hicieron propuesta, dieron apartado o dueños que te acaban de firmar la exclusividad.
                </p>
                <div className="bg-white rounded-xl p-2.5 border border-emerald-200 text-[11px] text-emerald-900 font-medium">
                  💡 <strong>Regla de Oro:</strong> Revisa y contacta a estos clientes entre 9:00 AM y 11:00 AM todos los días.
                </div>
              </div>

              {/* Amarillo */}
              <div className="bg-amber-50/80 border-2 border-amber-400 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500 text-slate-950 shadow-sm">
                    🟡 AMARILLO
                  </span>
                  <span className="text-xs font-bold text-amber-900">Seguimiento</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1.5">En Búsqueda y Visitas</h4>
                <p className="text-xs text-slate-700 leading-relaxed mb-3">
                  Prospectos que vieron una casa y están analizando, o dueños pendientes de fijar fecha de cita.
                </p>
                <div className="bg-white rounded-xl p-2.5 border border-amber-200 text-[11px] text-amber-900 font-medium">
                  ⚠️ <strong>Detector Automático:</strong> Si pasan más de 3 días sin contacto, la tarjeta mostrará una alerta ámbar.
                </div>
              </div>

              {/* Rojo */}
              <div className="bg-rose-50/80 border-2 border-rose-300 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-rose-600 text-white shadow-sm">
                    🔴 ROJO
                  </span>
                  <span className="text-xs font-bold text-rose-800">Archivado</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1.5">Descartados o Congelados</h4>
                <p className="text-xs text-slate-700 leading-relaxed mb-3">
                  Clientes que compraron con otra inmobiliaria, no tienen presupuesto o dueños que retiraron la propiedad.
                </p>
                <div className="bg-white rounded-xl p-2.5 border border-rose-200 text-[11px] text-rose-900 font-medium">
                  🛡️ <strong>Higiene Mental:</strong> Se ocultan automáticamente para no estorbarte, pero puedes verlos filtrando por Rojo.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. CAPTURA RÁPIDA */}
      {activeSection === 'captura' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-2">
                <PhoneCall className="w-5 h-5 text-blue-600" />
                2. Captura Rápida en 15 Segundos (Al Colgar la Llamada)
              </h3>
              <p className="text-sm text-slate-600">
                Nunca más pierdas un cliente anotado en una servilleta o en la mente mientras manejas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Paso 1: Dictado por voz */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">A. Botón de Dictado por Voz (Micrófono)</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Toca el icono del micrófono en las notas y háblale a tu teléfono: <em>"Llamó el Lic. Roberto, busca casa en Juriquilla con 3 recámaras y presupuesto de 4.2 millones..."</em>. El sistema lo escribe al vuelo.
                  </p>
                </div>
              </div>

              {/* Paso 2: Pegado Inteligente de WhatsApp */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                  <ClipboardCopy className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">B. Botón "Pegar de WhatsApp"</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Copia cualquier mensaje que te enviaron por WhatsApp y toca <strong>"Pegar y Autollenar"</strong>. La app extraerá teléfono, presupuesto, zona y nombre automáticamente.
                  </p>
                </div>
              </div>
            </div>

            {/* Selector Dueño vs Prospecto */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
              <h4 className="text-sm font-bold text-amber-950 mb-1 flex items-center gap-2">
                <Building className="w-4 h-4 text-indigo-600" />
                <span>¿Por qué es importante elegir Dueño vs. Prospecto?</span>
              </h4>
              <p className="text-xs text-amber-900 leading-relaxed">
                Si registras a un <strong>🏠 Dueño</strong> con su propiedad y precio, y luego registras a un <strong>👤 Prospecto</strong> con su presupuesto y zona deseada, el <strong>Smart Matcher</strong> los cruzará al segundo para avisarte de inmediato.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. SMART MATCHER */}
      {activeSection === 'matcher' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              3. Smart Matcher: El Dinero Escondido en tu Inventario
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Muchas comisiones se pierden porque olvidamos que un cliente de hace dos semanas buscaba justo la casa que un propietario nos acaba de entregar hoy.
            </p>

            <div className="bg-gradient-to-r from-amber-50 to-emerald-50 border border-amber-200 rounded-2xl p-5 space-y-3">
              <h4 className="text-sm font-bold text-slate-900">¿Cómo funciona el cruce inteligente?</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                  <div className="font-bold text-indigo-700 mb-1">1. Dueño tiene:</div>
                  <div className="text-slate-700">Casa en Zibatá de $3,500,000 MXN</div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                  <div className="font-bold text-sky-700 mb-1">2. Prospecto busca:</div>
                  <div className="text-slate-700">Casa en Zibatá, presupuesto hasta $3,800,000 MXN</div>
                </div>
                <div className="bg-emerald-600 text-white p-3 rounded-xl shadow-sm">
                  <div className="font-bold mb-1">3. Coincidencia 100% ⚡</div>
                  <div className="text-emerald-100">Boton directo de WhatsApp para mandar la ficha técnica en 1 clic.</div>
                </div>
              </div>
            </div>

            <div className="flex justify-start">
              <button
                onClick={() => onNavigateTab('matcher')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm shadow-sm transition-all"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                Explorar Pestaña de Smart Matcher
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. BITÁCORA Y REPORTE AL DUEÑO */}
      {activeSection === 'visitas' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              4. Bitácora de Visitas & Reportes de 1-Clic al Propietario
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              El reclamo número uno de los dueños es: <em>"Mi asesor nunca me avisa qué opinan los clientes que van a ver la casa"</em>. Con esta herramienta lo solucionas en 10 segundos al salir de la cita.
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0">1</span>
                <p className="text-xs text-slate-700">
                  En la tarjeta del prospecto, toca el botón <strong>"Registrar Visita"</strong> (icono de portapapeles).
                </p>
              </div>
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0">2</span>
                <p className="text-xs text-slate-700">
                  Selecciona la opinión del cliente sobre el precio (Justo / Alto / Atractivo), condición de la casa y nivel de interés.
                </p>
              </div>
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0">3</span>
                <p className="text-xs text-slate-700 font-medium">
                  Toca <strong>"Enviar Reporte por WhatsApp al Dueño"</strong>. Se redacta un mensaje formal y profesional listo para enviar.
                </p>
              </div>
            </div>

            <div className="flex justify-start">
              <button
                onClick={() => onNavigateTab('visitas')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
              >
                <Calendar className="w-4 h-4" />
                Ver Bitácora de Visitas Realizadas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. CALCULADORA DE CIERRE */}
      {activeSection === 'calculadora' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-teal-600" />
              5. Calculadora Financiera en Cita (Despejar Dudas en Vivo)
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Muchos compradores se frenan porque no saben cuánto necesitan de enganche ni cuánto cuesta la escrituración.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-teal-50 border border-teal-200 p-4 rounded-xl">
                <h4 className="font-bold text-teal-950 mb-1">Simulación Notarial y de Enganche</h4>
                <p className="text-teal-900">
                  Calcula automáticamente el 10%, 15% o 20% de enganche más el 4% estimado de impuestos notariales y avalúo para darles la cifra real de desembolso inicial.
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
                <h4 className="font-bold text-blue-950 mb-1">Estimador de Mensualidad Bancaria</h4>
                <p className="text-blue-900">
                  Simula la mensualidad a 15 o 20 años para que el comprador vea que su presupuesto mensual califica con facilidad.
                </p>
              </div>
            </div>

            <div className="flex justify-start">
              <button
                onClick={() => onNavigateTab('calculadora')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
              >
                <Calculator className="w-4 h-4" />
                Abrir Calculadora Financiera
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. WHATSAPP Y RESPALDOS */}
      {activeSection === 'whatsapp' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-emerald-600" />
              6. Plantillas Rápidas de WhatsApp & Respaldo Seguro
            </h3>

            {/* Direct WhatsApp Callout Card */}
            <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-extrabold uppercase tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  Línea WhatsApp Asesor
                </span>
                <div className="text-xl font-black text-slate-900 font-mono">
                  +52 (775) 128-0009
                </div>
                <p className="text-xs text-slate-600">
                  Acceso directo configurado para enviar fichas, recibir prospectos y coordinar visitas al instante.
                </p>
              </div>

              <button
                type="button"
                onClick={onOpenDirectWhatsApp}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Abrir Chat WhatsApp</span>
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <strong className="text-slate-900 block mb-1">📲 Plantillas en 1 Toque:</strong>
                Toca el botón verde de WhatsApp en cualquier tarjeta para abrir el menú de plantillas pre-redactadas: Saludo, Confirmación de Cita, Envío de Ficha y Requisitos de Apartado.
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <strong className="text-slate-900 block mb-1">💾 Tus Datos se Guardan Automáticamente:</strong>
                Toda la información se almacena localmente en la memoria de tu celular. En la parte superior derecha puedes tocar el botón de <strong>Exportar Respaldo (JSON)</strong> para descargar una copia de seguridad cuando quieras.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tips for outdoor mobile use */}
      <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-2">
          <Sun className="w-5 h-5 text-amber-600" />
          <span>Consejo de Visibilidad Bajo el Sol</span>
        </div>
        <p className="text-xs text-amber-800 leading-relaxed">
          Esta interfaz está configurada con fondo blanco de <strong>alto contraste</strong>, textos oscuros y botones grandes para que puedas ver y tocar claramente mientras estás en la calle o esperando afuera de una propiedad.
        </p>
      </div>

    </div>
  );
};
