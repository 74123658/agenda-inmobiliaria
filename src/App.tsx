import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Sparkles, 
  Building, 
  User, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Filter, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  PhoneCall,
  RotateCcw,
  Download,
  Flame,
  Bot,
  BellRing
} from 'lucide-react';
import { 
  LeadItem, 
  VisitRecord, 
  AppointmentRecord,
  ViewTab, 
  StatusColor, 
  FilterType, 
  DateFilter 
} from './types';
import { 
  loadLeads, 
  saveLeads, 
  loadVisits, 
  saveVisits, 
  loadAppointments,
  saveAppointments,
  exportBackup, 
  calculateDaysAgo 
} from './utils/storage';
import { calculateSmartMatches } from './utils/matcher';
import { INITIAL_LEADS, INITIAL_VISITS, INITIAL_APPOINTMENTS } from './data/mockData';
import { soundEngine } from './utils/audio';
import { Header } from './components/Header';
import { LeadCard } from './components/LeadCard';
import { QuickAddModal } from './components/QuickAddModal';
import { SmartMatcher } from './components/SmartMatcher';
import { VisitLoggerModal } from './components/VisitLoggerModal';
import { VisitsList } from './components/VisitsList';
import { FinanceCalculator } from './components/FinanceCalculator';
import { WhatsAppTemplatesModal } from './components/WhatsAppTemplatesModal';
import { WhatsAppDirectAccessModal } from './components/WhatsAppDirectAccessModal';
import { ChatbotAppointmentManager } from './components/ChatbotAppointmentManager';
import { ActiveAlarmModal } from './components/ActiveAlarmModal';
import { UserGuide } from './components/UserGuide';
import { MessageCircle } from 'lucide-react';

export default function App() {
  const [leads, setLeads] = useState<LeadItem[]>(() => loadLeads());
  const [visits, setVisits] = useState<VisitRecord[]>(() => loadVisits());
  const [appointments, setAppointments] = useState<AppointmentRecord[]>(() => loadAppointments());

  // Views & Filters
  const [currentTab, setCurrentTab] = useState<ViewTab>('agenda');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'todos' | StatusColor>('todos');
  const [typeFilter, setTypeFilter] = useState<FilterType>('todos');
  const [dateFilter, setDateFilter] = useState<DateFilter>('todos');

  // Modals state
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<LeadItem | null>(null);
  
  const [isVisitLoggerOpen, setIsVisitLoggerOpen] = useState(false);
  const [visitSelectedLead, setVisitSelectedLead] = useState<LeadItem | null>(null);

  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [whatsAppSelectedLead, setWhatsAppSelectedLead] = useState<LeadItem | null>(null);

  const [isDirectWhatsAppOpen, setIsDirectWhatsAppOpen] = useState(false);
  const [calculatorSelectedLead, setCalculatorSelectedLead] = useState<LeadItem | null>(null);

  // Active Alarm State
  const [activeAlarmAppointment, setActiveAlarmAppointment] = useState<AppointmentRecord | null>(null);
  const triggeredAlarmsRef = useRef<Set<string>>(new Set());

  // Auto-save on change
  useEffect(() => {
    saveLeads(leads);
  }, [leads]);

  useEffect(() => {
    saveVisits(visits);
  }, [visits]);

  useEffect(() => {
    saveAppointments(appointments);
  }, [appointments]);

  // Periodic alarm watcher (every 10 seconds)
  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentTotalMinutes = currentHours * 60 + currentMinutes;

      appointments.forEach((apt) => {
        if (!apt.alarmEnabled || apt.status === 'completada' || apt.status === 'cancelada') {
          return;
        }

        if (apt.date === todayStr && apt.time) {
          const [h, m] = apt.time.split(':').map(Number);
          if (!isNaN(h) && !isNaN(m)) {
            const aptTotalMinutes = h * 60 + m;
            const triggerMinutes = aptTotalMinutes - (apt.alarmOffsetMinutes || 0);

            // If time has arrived (within 4 minutes window) and not yet dismiss-triggered
            const alarmKey = `${apt.id}-${apt.date}-${apt.time}`;
            if (
              currentTotalMinutes >= triggerMinutes &&
              currentTotalMinutes <= triggerMinutes + 5 &&
              !triggeredAlarmsRef.current.has(alarmKey)
            ) {
              triggeredAlarmsRef.current.add(alarmKey);
              setActiveAlarmAppointment(apt);
            }
          }
        }
      });
    };

    checkAlarms();
    const interval = setInterval(checkAlarms, 10000);
    return () => clearInterval(interval);
  }, [appointments]);

  // Smart Matches calculation
  const smartMatches = useMemo(() => {
    return calculateSmartMatches(leads);
  }, [leads]);

  // Handlers for Leads
  const handleSaveLead = (leadData: Omit<LeadItem, 'id' | 'createdAt'>, editingId?: string) => {
    if (editingId) {
      setLeads((prev) =>
        prev.map((l) => (l.id === editingId ? { ...l, ...leadData } : l))
      );
    } else {
      const newLead: LeadItem = {
        ...leadData,
        id: `lead-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setLeads((prev) => [newLead, ...prev]);
    }
    setIsQuickAddOpen(false);
    setEditingLead(null);
  };

  const handleUpdateStatus = (id: string, newStatus: StatusColor) => {
    setLeads((prev) =>
      prev.map((l) =>
        l.id === id
          ? {
              ...l,
              status: newStatus,
              lastContactDate: new Date().toISOString(),
            }
          : l
      )
    );
  };

  const handleDeleteLead = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este registro de la agenda?')) {
      setLeads((prev) => prev.filter((l) => l.id !== id));
    }
  };

  const handleSaveVisit = (
    visitData: Omit<VisitRecord, 'id'>,
    updateLeadStatus?: StatusColor
  ) => {
    const newVisit: VisitRecord = {
      ...visitData,
      id: `vis-${Date.now()}`,
    };
    setVisits((prev) => [newVisit, ...prev]);

    if (updateLeadStatus && visitData.leadId) {
      handleUpdateStatus(visitData.leadId, updateLeadStatus);
    }
  };

  const handleResetData = () => {
    if (
      window.confirm(
        '¿Deseas restaurar los datos de demostración iniciales? Se reemplazarán los registros actuales.'
      )
    ) {
      setLeads(INITIAL_LEADS);
      setVisits(INITIAL_VISITS);
      setAppointments(INITIAL_APPOINTMENTS);
      saveLeads(INITIAL_LEADS);
      saveVisits(INITIAL_VISITS);
      saveAppointments(INITIAL_APPOINTMENTS);
    }
  };

  const handleExport = () => {
    exportBackup(leads, visits, appointments);
  };

  // Appointment Handlers
  const handleAddAppointment = (aptData: Omit<AppointmentRecord, 'id' | 'createdAt'>) => {
    const newApt: AppointmentRecord = {
      ...aptData,
      id: `apt-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setAppointments((prev) => [newApt, ...prev]);
  };

  const handleUpdateAppointment = (updated: AppointmentRecord) => {
    setAppointments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  };

  const handleDeleteAppointment = (id: string) => {
    if (window.confirm('¿Deseas eliminar esta cita de la agenda?')) {
      setAppointments((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const handleAddLeadFromBot = (leadData: Omit<LeadItem, 'id' | 'createdAt'>) => {
    const newLead: LeadItem = {
      ...leadData,
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setLeads((prev) => [newLead, ...prev]);
  };

  const handleSnoozeAppointment = (aptId: string, minutes: number) => {
    setAppointments((prev) =>
      prev.map((a) => {
        if (a.id === aptId) {
          const now = new Date(Date.now() + minutes * 60000);
          const newTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
          return {
            ...a,
            time: newTime,
            date: now.toISOString().split('T')[0],
          };
        }
        return a;
      })
    );
    setActiveAlarmAppointment(null);
  };

  const handleMarkAppointmentAttended = (aptId: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === aptId ? { ...a, status: 'completada' } : a))
    );
    soundEngine.playSuccess();
    setActiveAlarmAppointment(null);
  };

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];

    return leads.filter((lead) => {
      // 1. Status filter
      if (statusFilter !== 'todos' && lead.status !== statusFilter) {
        return false;
      }
      // If statusFilter is 'todos', hide red leads by default unless searched or specifically chosen
      if (statusFilter === 'todos' && lead.status === 'rojo' && !searchQuery) {
        return false;
      }

      // 2. Type filter
      if (typeFilter === 'duenos' && lead.type !== 'dueno') return false;
      if (typeFilter === 'prospectos' && lead.type !== 'prospecto') return false;

      // 3. Date filter
      if (dateFilter === 'hoy' && lead.nextActionDate !== today) return false;
      if (dateFilter === 'vencidos' && (!lead.nextActionDate || lead.nextActionDate >= today)) return false;
      if (dateFilter === 'semana') {
        const nextWeek = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString().split('T')[0];
        if (!lead.nextActionDate || lead.nextActionDate < today || lead.nextActionDate > nextWeek) return false;
      }

      // 4. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = lead.name.toLowerCase().includes(q);
        const matchesPhone = lead.phone.includes(q);
        const matchesZone = (lead.zone || '').toLowerCase().includes(q);
        const matchesProp = (lead.propertyTitle || '').toLowerCase().includes(q);
        const matchesNotes = (lead.notes || '').toLowerCase().includes(q);
        const matchesNext = (lead.nextActionNote || '').toLowerCase().includes(q);
        if (!matchesName && !matchesPhone && !matchesZone && !matchesProp && !matchesNotes && !matchesNext) {
          return false;
        }
      }

      return true;
    });
  }, [leads, statusFilter, typeFilter, dateFilter, searchQuery]);

  // Separate owners vs prospects in Agenda view
  const ownerLeads = filteredLeads.filter((l) => l.type === 'dueno');
  const buyerLeads = filteredLeads.filter((l) => l.type === 'prospecto');

  // Count actions due today
  const todayDate = new Date().toISOString().split('T')[0];
  const actionsTodayCount = leads.filter((l) => l.nextActionDate === todayDate && l.status !== 'rojo').length;
  const pendingAptsCount = appointments.filter((a) => a.status === 'pendiente' || a.status === 'confirmada').length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col selection:bg-emerald-500 selection:text-white font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Header with quick stats & navigation */}
      <Header
        leads={leads}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onOpenQuickAdd={() => {
          setEditingLead(null);
          setIsQuickAddOpen(true);
        }}
        onExportBackup={handleExport}
        onResetData={handleResetData}
        matchCount={smartMatches.length}
        onOpenDirectWhatsApp={() => setIsDirectWhatsAppOpen(true)}
        pendingAppointmentsCount={pendingAptsCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* TAB 1: AGENDA & LEADS 360° */}
        {currentTab === 'agenda' && (
          <div className="space-y-6">
            
            {/* Filter Toolbar */}
            <div className="bg-white border border-slate-300 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              
              {/* Type Switcher (Todos / Dueños / Prospectos) */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 self-start md:self-auto">
                <button
                  id="filter-type-todos"
                  onClick={() => setTypeFilter('todos')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    typeFilter === 'todos'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Todos ({leads.filter((l) => l.status !== 'rojo').length})
                </button>

                <button
                  id="filter-type-duenos"
                  onClick={() => setTypeFilter('duenos')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    typeFilter === 'duenos'
                      ? 'bg-indigo-100 text-indigo-900 border border-indigo-300 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Building className="w-3.5 h-3.5 text-indigo-600" />
                  <span>🏠 Dueños ({leads.filter((l) => l.type === 'dueno' && l.status !== 'rojo').length})</span>
                </button>

                <button
                  id="filter-type-prospectos"
                  onClick={() => setTypeFilter('prospectos')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    typeFilter === 'prospectos'
                      ? 'bg-sky-100 text-sky-900 border border-sky-300 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <User className="w-3.5 h-3.5 text-sky-600" />
                  <span>👤 Prospectos ({leads.filter((l) => l.type === 'prospecto' && l.status !== 'rojo').length})</span>
                </button>
              </div>

              {/* Date Filters (Hoy / Semana / Todos) */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                <button
                  id="filter-date-hoy"
                  onClick={() => setDateFilter(dateFilter === 'hoy' ? 'todos' : 'hoy')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    dateFilter === 'hoy'
                      ? 'bg-amber-500 text-white shadow-md font-extrabold'
                      : 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  <span>Para Hoy ({actionsTodayCount})</span>
                </button>

                <button
                  id="filter-date-semana"
                  onClick={() => setDateFilter(dateFilter === 'semana' ? 'todos' : 'semana')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    dateFilter === 'semana'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  Esta Semana
                </button>

                <button
                  id="filter-date-todos"
                  onClick={() => setDateFilter('todos')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    dateFilter === 'todos'
                      ? 'bg-slate-800 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  Todas las Fechas
                </button>
              </div>

            </div>

            {/* Smart Match Notification Banner if matches found */}
            {smartMatches.length > 0 && (
              <div
                onClick={() => setCurrentTab('matcher')}
                className="cursor-pointer bg-gradient-to-r from-amber-50 via-white to-emerald-50 border border-amber-300 hover:border-amber-500 rounded-2xl p-4 shadow-sm transition-all flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5 text-amber-600 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <span>¡Smart Matcher detectó {smartMatches.length} coincidencias inmediatas!</span>
                    </h4>
                    <p className="text-xs text-slate-600 font-medium">
                      Hay compradores calificados que buscan exactamente las propiedades que te dieron los dueños.
                    </p>
                  </div>
                </div>

                <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
                  Ver Coincidencias →
                </span>
              </div>
            )}

            {/* Empty State */}
            {filteredLeads.length === 0 ? (
              <div className="bg-white border border-slate-300 rounded-2xl p-10 text-center max-w-md mx-auto my-8 shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                  <Search className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  No hay contactos con este filtro
                </h3>
                <p className="text-xs text-slate-500 mb-6 font-medium">
                  Prueba cambiando los filtros de semáforo o fecha, o registra una nueva llamada entrante.
                </p>
                <button
                  onClick={() => {
                    setStatusFilter('todos');
                    setTypeFilter('todos');
                    setDateFilter('todos');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-emerald-800 border border-slate-300 text-xs font-bold transition-colors"
                >
                  Limpiar Filtros
                </button>
              </div>
            ) : typeFilter === 'todos' ? (
              /* Two-Column Layout: Dueños vs Prospectos */
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Columna Dueños */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-300">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-md bg-indigo-100 text-indigo-700">
                        <Building className="w-4 h-4" />
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">
                        🏠 Propietarios / Dueños ({ownerLeads.length})
                      </h3>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">Inmuebles en Promoción</span>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {ownerLeads.length === 0 ? (
                      <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-500 font-medium">
                        No hay propietarios en este filtro.
                      </div>
                    ) : (
                      ownerLeads.map((lead) => (
                        <LeadCard
                          key={lead.id}
                          lead={lead}
                          onUpdateStatus={handleUpdateStatus}
                          onOpenWhatsAppMenu={(l) => {
                            setWhatsAppSelectedLead(l);
                            setIsWhatsAppModalOpen(true);
                          }}
                          onLogVisit={(l) => {
                            setVisitSelectedLead(l);
                            setIsVisitLoggerOpen(true);
                          }}
                          onEdit={(l) => {
                            setEditingLead(l);
                            setIsQuickAddOpen(true);
                          }}
                          onDelete={handleDeleteLead}
                          onOpenCalculator={(l) => {
                            setCalculatorSelectedLead(l);
                            setCurrentTab('calculadora');
                          }}
                        />
                      ))
                    )}
                  </div>
                </div>

                {/* Columna Prospectos */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-300">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-md bg-sky-100 text-sky-700">
                        <User className="w-4 h-4" />
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">
                        👤 Prospectos Compradores ({buyerLeads.length})
                      </h3>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">Demanda & Citas Activas</span>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {buyerLeads.length === 0 ? (
                      <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-500 font-medium">
                        No hay prospectos en este filtro.
                      </div>
                    ) : (
                      buyerLeads.map((lead) => (
                        <LeadCard
                          key={lead.id}
                          lead={lead}
                          onUpdateStatus={handleUpdateStatus}
                          onOpenWhatsAppMenu={(l) => {
                            setWhatsAppSelectedLead(l);
                            setIsWhatsAppModalOpen(true);
                          }}
                          onLogVisit={(l) => {
                            setVisitSelectedLead(l);
                            setIsVisitLoggerOpen(true);
                          }}
                          onEdit={(l) => {
                            setEditingLead(l);
                            setIsQuickAddOpen(true);
                          }}
                          onDelete={handleDeleteLead}
                          onOpenCalculator={(l) => {
                            setCalculatorSelectedLead(l);
                            setCurrentTab('calculadora');
                          }}
                        />
                      ))
                    )}
                  </div>
                </div>

              </div>
            ) : (
              /* Single Filter List Layout */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredLeads.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    onUpdateStatus={handleUpdateStatus}
                    onOpenWhatsAppMenu={(l) => {
                      setWhatsAppSelectedLead(l);
                      setIsWhatsAppModalOpen(true);
                    }}
                    onLogVisit={(l) => {
                      setVisitSelectedLead(l);
                      setIsVisitLoggerOpen(true);
                    }}
                    onEdit={(l) => {
                      setEditingLead(l);
                      setIsQuickAddOpen(true);
                    }}
                    onDelete={handleDeleteLead}
                    onOpenCalculator={(l) => {
                      setCalculatorSelectedLead(l);
                      setCurrentTab('calculadora');
                    }}
                  />
                ))}
              </div>
            )}

          </div>
        )}

        {/* TAB 2: SMART MATCHER */}
        {currentTab === 'matcher' && (
          <SmartMatcher
            matches={smartMatches}
            onOpenQuickAdd={() => {
              setEditingLead(null);
              setIsQuickAddOpen(true);
            }}
          />
        )}

        {/* TAB 3: BITÁCORA DE VISITAS & REPORTES */}
        {currentTab === 'visitas' && (
          <VisitsList
            visits={visits}
            leads={leads}
            onOpenVisitLogger={() => {
              setVisitSelectedLead(null);
              setIsVisitLoggerOpen(true);
            }}
          />
        )}

        {/* TAB 4: CHATBOT & GESTOR DE CITAS CON ALARMAS SONORAS */}
        {currentTab === 'chatbot' && (
          <ChatbotAppointmentManager
            leads={leads}
            appointments={appointments}
            onAddAppointment={handleAddAppointment}
            onUpdateAppointment={handleUpdateAppointment}
            onDeleteAppointment={handleDeleteAppointment}
            onAddLeadFromBot={handleAddLeadFromBot}
            onTriggerAlarmTest={(apt) => setActiveAlarmAppointment(apt)}
          />
        )}

        {/* TAB 5: CALCULADORA DE CIERRE */}
        {currentTab === 'calculadora' && (
          <FinanceCalculator
            lead={calculatorSelectedLead}
            onMarkAsGreen={(id) => {
              handleUpdateStatus(id, 'verde');
              soundEngine.playSuccess();
              alert('¡Estatus actualizado a 🟢 Verde (Apartado / Cierre)!');
            }}
          />
        )}

        {/* TAB 6: GUÍA DE USO PARA EL AGENTE INMOBILIARIO */}
        {currentTab === 'guia' && (
          <UserGuide 
            onNavigateTab={(tab) => setCurrentTab(tab)} 
            onOpenQuickAdd={() => {
              setEditingLead(null);
              setIsQuickAddOpen(true);
            }}
            onOpenDirectWhatsApp={() => setIsDirectWhatsAppOpen(true)}
          />
        )}

      </main>

      {/* MODAL 1: Quick Add Modal (Captura Rápida) */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => {
          setIsQuickAddOpen(false);
          setEditingLead(null);
        }}
        onSave={handleSaveLead}
        initialLead={editingLead}
      />

      {/* MODAL 2: Visit Logger Modal */}
      <VisitLoggerModal
        isOpen={isVisitLoggerOpen}
        onClose={() => {
          setIsVisitLoggerOpen(false);
          setVisitSelectedLead(null);
        }}
        onSaveVisit={handleSaveVisit}
        leads={leads}
        selectedLead={visitSelectedLead}
      />

      {/* MODAL 3: WhatsApp Templates Modal for specific lead */}
      <WhatsAppTemplatesModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => {
          setIsWhatsAppModalOpen(false);
          setWhatsAppSelectedLead(null);
        }}
        lead={whatsAppSelectedLead}
      />

      {/* MODAL 4: WhatsApp Direct Access for 7751280009 */}
      <WhatsAppDirectAccessModal
        isOpen={isDirectWhatsAppOpen}
        onClose={() => setIsDirectWhatsAppOpen(false)}
        defaultPhone="7751280009"
        advisorName="Asesor Inmobiliario 360°"
      />

      {/* MODAL 5: Active Alarm Fullscreen Notification with Audio Synthesizer */}
      <ActiveAlarmModal
        isOpen={activeAlarmAppointment !== null}
        appointment={activeAlarmAppointment}
        onClose={() => setActiveAlarmAppointment(null)}
        onSnooze={handleSnoozeAppointment}
        onMarkAttended={handleMarkAppointmentAttended}
      />

      {/* Floating Action Buttons Desktop & Mobile */}
      <div className="fixed bottom-5 right-5 z-30 flex flex-col items-end gap-2.5">
        
        {/* Floating Chatbot / Alarms Quick Launcher */}
        <button
          id="btn-floating-chatbot"
          onClick={() => setCurrentTab('chatbot')}
          className="group flex items-center gap-2 px-3.5 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold shadow-xl shadow-slate-900/30 active:scale-90 hover:scale-105 transition-all border border-slate-700"
          title="Abrir Chatbot & Alarmas de Citas"
        >
          <Bot className="w-5 h-5 text-emerald-400" />
          <span className="hidden sm:inline text-xs font-bold tracking-tight">
            Chatbot & Alarmas
          </span>
          {pendingAptsCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          )}
        </button>

        {/* Floating WhatsApp Quick Launcher (All screens) */}
        <button
          id="btn-floating-whatsapp-7751280009"
          onClick={() => setIsDirectWhatsAppOpen(true)}
          className="group flex items-center gap-2 px-3.5 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow-xl shadow-emerald-600/30 active:scale-90 hover:scale-105 transition-all"
          title="WhatsApp 775 128 0009"
        >
          <MessageCircle className="w-5 h-5 fill-current" />
          <span className="hidden sm:inline text-xs font-bold font-mono tracking-tight">
            WhatsApp 775 128 0009
          </span>
          <span className="flex sm:hidden text-xs font-bold">
            WA
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
        </button>

        {/* Floating Phone Capture on Mobile */}
        <div className="md:hidden">
          <button
            id="btn-floating-quick-add-mobile"
            onClick={() => {
              setEditingLead(null);
              setIsQuickAddOpen(true);
            }}
            className="w-13 h-13 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center shadow-xl shadow-emerald-500/40 active:scale-90 transition-transform"
            title="Captura Rápida de Llamada"
          >
            <PhoneCall className="w-5 h-5 text-slate-950" />
          </button>
        </div>
      </div>

    </div>
  );
}
