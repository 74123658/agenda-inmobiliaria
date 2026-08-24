import React, { useState } from 'react';
import { 
  Building2, 
  Bot, 
  BellRing, 
  Sparkles, 
  PhoneCall, 
  ShieldCheck, 
  Calculator, 
  MessageCircle, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Smartphone, 
  Laptop, 
  Volume2, 
  Send, 
  User, 
  ArrowRight,
  HelpCircle,
  Clock,
  Flame,
  FileSpreadsheet,
  Layers,
  ThumbsUp
} from 'lucide-react';
import { ViewTab } from '../types';
import { cleanPhoneNumber } from '../utils/whatsapp';

interface CaratulaGuiaTotalProps {
  onNavigateTab: (tab: ViewTab) => void;
  onOpenQuickAdd: () => void;
  onOpenDirectWhatsApp: () => void;
  onTestAlarmSample: () => void;
}

export const CaratulaGuiaTotal: React.FC<CaratulaGuiaTotalProps> = ({
  onNavigateTab,
  onOpenQuickAdd,
  onOpenDirectWhatsApp,
  onTestAlarmSample,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedFunction, setSelectedFunction] = useState<string | null>(null);

  const directPhone = '7751280009';
  const cleanPhone = cleanPhoneNumber(directPhone);

  const feedbackWhatsappMessage = `¡Hola Ing. Ramírez! He cargado y probado la Agenda Inmobiliaria 360° en mi dispositivo. 

📱 Dispositivo probado: [Celular / Ordenador]
⭐ Experiencia de uso: [Excelente / Buena / Por revisar]
🔔 Prueba de Alarmas Sonoras: [Funcionó al 100% / Requiere ajuste]
🤖 Prueba del Chatbot y WhatsApp: [Funcionó al 100% / Sugiero un cambio]

Comentarios u observaciones para dejar el proyecto listo:
`;

  const functionalModules = [
    {
      id: 'chatbot',
      title: '1. Chatbot Inmobiliario 24/7 & Agendamiento',
      badge: 'Automatización Inteligente',
      icon: Bot,
      color: 'from-emerald-500 to-teal-700',
      textColor: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      tab: 'chatbot' as ViewTab,
      description: 'Atiende prospectos compradores, califica presupuestos y zonas, capta dueños vendedores y agenda citas automáticamente sin intervención manual.',
      keyPoints: [
        'Atención continua en WhatsApp con el apelativo del Ing. Ramírez.',
        'Calificación inmediata de compradores por zona y presupuesto ($2.5M - $10M+).',
        'Captación de dueños con estimación de comisión de venta.',
        'Creación automática de citas y prospectos en 🟢 Semáforo Verde.',
      ],
      actionLabel: 'Abrir Chatbot',
    },
    {
      id: 'alarmas',
      title: '2. Sistema de Alarmas Sonoras & Voz',
      badge: 'Alerta Acústica en Campo',
      icon: BellRing,
      color: 'from-amber-500 to-orange-600',
      textColor: 'text-amber-700',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      tab: 'chatbot' as ViewTab,
      description: 'Sintetizador Web Audio nativo con 4 tonos sonoros y sintetizador de voz que alerta al Ing. Ramírez exactamente a la hora de la llamada o cita.',
      keyPoints: [
        '4 tonos seleccionables: Campana Cristalina, Digital, Marimba y Alarma Urgente.',
        'Sintetizador de voz personalizado que anuncia: "Atención Ing. Ramírez: Cita programada con [Cliente]".',
        'Pantalla de acción rápida para Llamar o Enviar WhatsApp con un solo toque.',
        'Opción de Posponer 5 minutos o Marcar como Atendida.',
      ],
      actionLabel: 'Probar Alarma Ahora',
      onAction: onTestAlarmSample,
    },
    {
      id: 'semaforo',
      title: '3. Sistema de Semáforo Tri-Color (Agenda 360°)',
      badge: 'Cierre Comercial',
      icon: ShieldCheck,
      color: 'from-emerald-600 to-green-700',
      textColor: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      tab: 'agenda' as ViewTab,
      description: 'Priorización visual de prospectos y propietarios para concentrar el 80% del tiempo en negociaciones calientes con alta probabilidad de cierre.',
      keyPoints: [
        '🟢 Verde (Caliente): Clientes con crédito aprobado o listos para apartar.',
        '🟡 Amarillo (Tibio): Visitas en proceso o búsqueda activa a 15 días.',
        '🔴 Rojo (Frío / Incubación): Seguimiento espaciado sin saturar la vista principal.',
        'Contadores de comisiones proyectadas en tiempo real.',
      ],
      actionLabel: 'Ver Agenda 360°',
    },
    {
      id: 'captura',
      title: '4. Captura Rápida de Llamada (15 Segundos)',
      badge: 'Operación con 1 Mano',
      icon: PhoneCall,
      color: 'from-blue-600 to-indigo-700',
      textColor: 'text-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      tab: 'agenda' as ViewTab,
      description: 'Formulario ultra ágil optimizado para capturar datos de un cliente o dueño mientras estás al teléfono o manejando, sin campos innecesarios.',
      keyPoints: [
        'Selector instantáneo: ¿Es Prospecto Comprador o Dueño Propietario?',
        'Asignación inmediata de semáforo (Verde / Amarillo / Rojo).',
        'Compromiso de siguiente acción y fecha con recordatorio.',
        'Cálculo automático de comisión estimada de venta (4% - 5%).',
      ],
      actionLabel: 'Abrir Captura Rápida',
      onAction: onOpenQuickAdd,
    },
    {
      id: 'matcher',
      title: '5. Smart Matcher Inmobiliario',
      badge: 'Cruce Automático de Inventario',
      icon: Sparkles,
      color: 'from-amber-600 to-yellow-600',
      textColor: 'text-amber-700',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      tab: 'matcher' as ViewTab,
      description: 'Algoritmo inteligente que cruza las propiedades de los dueños con los presupuestos y zonas de los prospectos para generar ventas cruzadas.',
      keyPoints: [
        'Identificación de coincidencias por zona geográfica, tipo de inmueble y rango de precio.',
        'Generación de mensajes de WhatsApp pre-diseñados listos para enviar a ambas partes.',
        'Detección de comisión compartida o comisión directa para el Ing. Ramírez.',
      ],
      actionLabel: 'Ver Smart Matcher',
    },
    {
      id: 'calculadora',
      title: '6. Calculadora Financiera de Cierre & Créditos',
      badge: 'Asesoría Hipotecaria',
      icon: Calculator,
      color: 'from-purple-600 to-indigo-700',
      textColor: 'text-purple-700',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      tab: 'calculadora' as ViewTab,
      description: 'Herramienta para calcular en vivo con el cliente su enganche, mensualidad estimada bancaria o Infonavit, gastos notariales y comisión neta.',
      keyPoints: [
        'Desglose del 10%, 20% o 30% de enganche.',
        'Simulador de mensualidad a 15 y 20 años con tasas vigentes.',
        'Cálculo de gastos notariales e ISAI (5% a 7%).',
        'Botón directo para enviar la corrida financiera por WhatsApp.',
      ],
      actionLabel: 'Abrir Calculadora',
    },
    {
      id: 'bitacora',
      title: '7. Bitácora de Visitas & Registro de Objeciones',
      badge: 'Seguimiento de Propiedades',
      icon: Layers,
      color: 'from-sky-600 to-blue-700',
      textColor: 'text-sky-700',
      bgColor: 'bg-sky-50',
      borderColor: 'border-sky-200',
      tab: 'visitas' as ViewTab,
      description: 'Registro estructurado de cada visita realizada a las propiedades para reportar al dueño el feedback del cliente y el nivel de interés.',
      keyPoints: [
        'Calificación de la visita (De 1 a 5 estrellas).',
        'Registro de objeciones (Precio, acabados, ubicación, estacionamiento).',
        'Informe automático listo para compartir al propietario por WhatsApp.',
      ],
      actionLabel: 'Ver Bitácora',
    },
    {
      id: 'whatsapp',
      title: '8. WhatsApp Directo & Plantillas Profesionales',
      badge: 'Contacto al 775 128 0009',
      icon: MessageCircle,
      color: 'from-emerald-500 to-green-600',
      textColor: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      tab: 'agenda' as ViewTab,
      description: 'Envío de mensajes a prospectos y propietarios sin necesidad de guardarlos en los contactos de tu teléfono móvil.',
      keyPoints: [
        'Enlace configurado directamente con el número WhatsApp 775 128 0009.',
        'Plantillas de primer contacto, confirmación de cita, seguimiento y envío de ficha.',
        'Botón flotante permanente para acceso en 1 segundo desde cualquier pantalla.',
      ],
      actionLabel: 'Abrir WhatsApp Directo',
      onAction: onOpenDirectWhatsApp,
    },
  ];

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-300 shadow-xl overflow-hidden mb-8 transition-all">
      
      {/* HEADER DE CARÁTULA PRINCIPAL */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white p-5 sm:p-7 border-b border-slate-800 relative overflow-hidden">
        
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          
          {/* Titular & Branding */}
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-500/30">
                <Building2 className="w-3.5 h-3.5" />
                Despacho Inmobiliario 360°
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black uppercase tracking-wider border border-amber-500/30">
                <User className="w-3.5 h-3.5" />
                Titular: ING. RAMÍREZ
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700">
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                Móvil & PC
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white font-['Outfit',sans-serif]">
              Carátula & Guía Total del Asesor Inmobiliario
            </h2>

            <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
              Bienvenido <strong className="text-emerald-400 font-bold">Ing. Ramírez</strong>. Esta plataforma integra en un solo lugar la gestión de llamadas, el <strong className="text-amber-300 font-bold">Chatbot 24/7</strong>, el <strong className="text-emerald-300 font-bold">Sistema de Alarmas Sonoras</strong> y el <strong className="text-sky-300 font-bold">Semáforo Comercial</strong> para máxima efectividad de cierre.
            </p>
          </div>

          {/* Quick Action Toggle & Feedback Button */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch gap-3 shrink-0">
            <a
              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(feedbackWhatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition-all active:scale-95 text-center"
            >
              <Send className="w-4 h-4 fill-slate-950" />
              <span>💬 Enviar Reporte de Experiencia</span>
            </a>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors border border-slate-700"
            >
              <span>{isExpanded ? 'Ocultar Guía de Funciones' : 'Ver Guía Completa de Funciones'}</span>
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

        </div>

      </div>

      {/* BODY DE LA GUÍA TOTAL INTERACTIVA */}
      {isExpanded && (
        <div className="p-5 sm:p-7 space-y-7 bg-slate-50/50">
          
          {/* BANNER DE PASOS DE VALIDACIÓN RÁPIDA (PARA EL ING. RAMÍREZ EN SU MÓVIL / PC) */}
          <div className="bg-gradient-to-r from-emerald-900/90 via-slate-900 to-slate-900 text-white rounded-2xl p-5 border border-emerald-800 shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                    Protocolo de Validación en Vivo
                  </span>
                </div>
                <h3 className="text-lg font-black text-white">
                  ¿Cómo probar la aplicación en tu celular u ordenador?
                </h3>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  Realiza estas 3 pruebas rápidas para comprobar el funcionamiento sonoro, el flujo del Chatbot y la integración con tu WhatsApp:
                </p>
              </div>

              {/* Action Buttons inside Banner */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={onTestAlarmSample}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>1. Probar Alarma Sonora</span>
                </button>

                <button
                  onClick={() => onNavigateTab('chatbot')}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95"
                >
                  <Bot className="w-4 h-4" />
                  <span>2. Probar Chatbot</span>
                </button>

                <button
                  onClick={onOpenQuickAdd}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-colors"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>3. Capturar Llamada</span>
                </button>
              </div>
            </div>

            {/* Checklist items */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-800 text-xs">
              <div className="flex items-start gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Audio Web:</strong> Sonará una campana y voz diciendo: <em>"Atención Ing. Ramírez"</em>.</span>
              </div>
              <div className="flex items-start gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>WhatsApp Directo:</strong> Los botones abren el chat al <strong>775 128 0009</strong> sin registrar contacto.</span>
              </div>
              <div className="flex items-start gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Guardado Local:</strong> No pierdes tus prospectos ni tus citas al cerrar o recargar el navegador.</span>
              </div>
            </div>
          </div>

          {/* GRID DE LAS 8 FUNCIONES TOTALES */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Manual de Funciones Operativas (Paso a Paso)
                </h3>
                <p className="text-xs text-slate-600">
                  Haz clic en cualquier función para ejecutarla o revisa los puntos clave de operación.
                </p>
              </div>
              <span className="text-xs font-extrabold text-slate-500 bg-slate-200/80 px-2.5 py-1 rounded-lg">
                8 Módulos Activos
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {functionalModules.map((module) => {
                const Icon = module.icon;
                return (
                  <div
                    key={module.id}
                    className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3 group hover:border-slate-300"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className={`w-10 h-10 rounded-xl ${module.bgColor} ${module.textColor} border ${module.borderColor} flex items-center justify-center font-black group-hover:scale-105 transition-transform`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          {module.badge}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-slate-900 text-sm leading-tight">
                        {module.title}
                      </h4>

                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                        {module.description}
                      </p>

                      <ul className="space-y-1 pt-1 border-t border-slate-100">
                        {module.keyPoints.slice(0, 2).map((point, idx) => (
                          <li key={idx} className="text-[11px] text-slate-700 flex items-start gap-1.5 leading-tight">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1 shrink-0"></span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => {
                        if (module.onAction) {
                          module.onAction();
                        } else {
                          onNavigateTab(module.tab);
                        }
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-900 text-slate-800 hover:text-white font-bold text-xs transition-all active:scale-95 mt-2"
                    >
                      <span>{module.actionLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECCIÓN DE RETROALIMENTACIÓN DIRECTA PARA EL USUARIO */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6">
            
            <div className="space-y-3 max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-wider">
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Canal de Soporte & Ajustes Finales</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white">
                ¿Probaste la app en tu teléfono u ordenador? ¡Queremos conocer tu experiencia!
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Para dejar el proyecto 100% afinado a tu gusto, envíanos tu retroalimentación directa a WhatsApp con un solo clic. Cuéntanos qué tal se escuchan las alarmas sonoras, cómo sientes la velocidad de captura o si deseas personalizar algún texto del Chatbot.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto shrink-0">
              <a
                id="btn-caratula-feedback-whatsapp"
                href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(feedbackWhatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/30 transition-all active:scale-95 text-center"
              >
                <MessageCircle className="w-5 h-5 fill-slate-950" />
                <span>Enviar Reporte por WhatsApp</span>
              </a>

              <button
                onClick={() => {
                  window.scrollTo({ top: 600, behavior: 'smooth' });
                }}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors"
              >
                <span>Explorar Tablero Principal</span>
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
