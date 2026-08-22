import React from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  ShieldCheck, 
  Clock, 
  Archive, 
  Download, 
  RotateCcw,
  Sparkles,
  PhoneCall,
  Calculator,
  BookOpen,
  MessageCircle,
  Phone,
  Bot,
  BellRing
} from 'lucide-react';
import { LeadItem, StatusColor, ViewTab } from '../types';
import { formatCurrency } from '../utils/whatsapp';

interface HeaderProps {
  leads: LeadItem[];
  currentTab: ViewTab;
  setCurrentTab: (tab: ViewTab) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: 'todos' | StatusColor;
  setStatusFilter: (status: 'todos' | StatusColor) => void;
  onOpenQuickAdd: () => void;
  onExportBackup: () => void;
  onResetData: () => void;
  matchCount: number;
  onOpenDirectWhatsApp?: () => void;
  pendingAppointmentsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  leads,
  currentTab,
  setCurrentTab,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  onOpenQuickAdd,
  onExportBackup,
  onResetData,
  matchCount,
  onOpenDirectWhatsApp,
  pendingAppointmentsCount = 0,
}) => {
  const greenLeads = leads.filter((l) => l.status === 'verde');
  const yellowLeads = leads.filter((l) => l.status === 'amarillo');
  const redLeads = leads.filter((l) => l.status === 'rojo');

  const totalCommissionsGreen = greenLeads.reduce((acc, curr) => {
    return acc + (curr.estimatedCommission || (curr.price * 0.04));
  }, 0);

  const totalCommissionsYellow = yellowLeads.reduce((acc, curr) => {
    return acc + (curr.estimatedCommission || (curr.price * 0.04));
  }, 0);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm text-slate-900">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Logo & Identity */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center shadow-md text-white font-bold text-lg">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-['Outfit',sans-serif] text-xl font-extrabold text-slate-900 tracking-tight">
                    Agenda Inmobiliaria <span className="text-emerald-600">360°</span>
                  </h1>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Tri-Color CRM
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium hidden sm:block">
                  Control visual de llamadas, dueños, prospectos y cierres
                </p>
              </div>
            </div>

            {/* Mobile Actions: WhatsApp + Guía + Quick Add */}
            <div className="flex items-center gap-1.5 md:hidden">
              <button
                id="btn-header-wa-mobile"
                onClick={onOpenDirectWhatsApp}
                className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 text-xs font-extrabold shadow-xs transition-all active:scale-95"
                title="WhatsApp Directo 775 128 0009"
              >
                <MessageCircle className="w-4 h-4 fill-emerald-600 text-emerald-700" />
                <span className="text-[11px]">7751280009</span>
              </button>

              <button
                onClick={() => setCurrentTab('guia')}
                className={`flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                  currentTab === 'guia'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-blue-50 text-blue-800 border-blue-200'
                }`}
                title="Manual de Uso"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Guía</span>
              </button>

              <button
                id="btn-quick-add-mobile"
                onClick={onOpenQuickAdd}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
              >
                <PhoneCall className="w-4 h-4" />
                <span>+ Captura</span>
              </button>
            </div>
          </div>

          {/* Quick Stats / Semáforo Bar */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {/* Verde */}
            <button
              id="filter-stat-verde"
              onClick={() => setStatusFilter(statusFilter === 'verde' ? 'todos' : 'verde')}
              className={`flex flex-col px-3 py-2 rounded-xl border text-left transition-all ${
                statusFilter === 'verde'
                  ? 'bg-emerald-100/90 border-emerald-500 ring-2 ring-emerald-500/40 shadow-sm'
                  : 'bg-emerald-50/70 border-emerald-200 hover:bg-emerald-100/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                  Cierres / Exclusivas
                </span>
                <span className="text-xs font-extrabold text-emerald-900 bg-emerald-200/80 px-1.5 py-0.2 rounded-md">
                  {greenLeads.length}
                </span>
              </div>
              <span className="text-[11px] text-emerald-700 font-bold truncate mt-0.5">
                {formatCurrency(totalCommissionsGreen)} en comisiones
              </span>
            </button>

            {/* Amarillo */}
            <button
              id="filter-stat-amarillo"
              onClick={() => setStatusFilter(statusFilter === 'amarillo' ? 'todos' : 'amarillo')}
              className={`flex flex-col px-3 py-2 rounded-xl border text-left transition-all ${
                statusFilter === 'amarillo'
                  ? 'bg-amber-100/90 border-amber-500 ring-2 ring-amber-500/40 shadow-sm'
                  : 'bg-amber-50/70 border-amber-200 hover:bg-amber-100/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-[11px] font-bold text-amber-900">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Seguimiento Activo
                </span>
                <span className="text-xs font-extrabold text-amber-950 bg-amber-200/80 px-1.5 py-0.2 rounded-md">
                  {yellowLeads.length}
                </span>
              </div>
              <span className="text-[11px] text-amber-800 font-bold truncate mt-0.5">
                {formatCurrency(totalCommissionsYellow)} en juego
              </span>
            </button>

            {/* Rojo */}
            <button
              id="filter-stat-rojo"
              onClick={() => setStatusFilter(statusFilter === 'rojo' ? 'todos' : 'rojo')}
              className={`flex flex-col px-3 py-2 rounded-xl border text-left transition-all ${
                statusFilter === 'rojo'
                  ? 'bg-rose-100/90 border-rose-500 ring-2 ring-rose-500/40 shadow-sm'
                  : 'bg-rose-50/70 border-rose-200 hover:bg-rose-100/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-[11px] font-bold text-rose-800">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  Archivados
                </span>
                <span className="text-xs font-extrabold text-rose-950 bg-rose-200/80 px-1.5 py-0.2 rounded-md">
                  {redLeads.length}
                </span>
              </div>
              <span className="text-[11px] text-rose-700 font-medium mt-0.5 truncate">
                {statusFilter === 'rojo' ? 'Mostrando todos' : 'Ocultos por defecto'}
              </span>
            </button>
          </div>

          {/* Action Buttons Desktop */}
          <div className="hidden md:flex items-center gap-2">
            <button
              id="btn-whatsapp-direct-header"
              onClick={onOpenDirectWhatsApp}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 font-extrabold text-xs sm:text-sm shadow-xs transition-all hover:scale-[1.02] active:scale-95"
              title="Abrir WhatsApp Directo 775 128 0009"
            >
              <MessageCircle className="w-4 h-4 fill-emerald-600 text-emerald-700" />
              <span>WhatsApp: 775 128 0009</span>
            </button>

            <button
              id="btn-quick-add-desktop"
              onClick={onOpenQuickAdd}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all hover:scale-[1.02] active:scale-95"
            >
              <PhoneCall className="w-4 h-4 text-white" />
              <span>+ Captura Rápida</span>
            </button>

            <button
              id="btn-export-backup"
              onClick={onExportBackup}
              title="Descargar Respaldo JSON"
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              id="btn-reset-data"
              onClick={onResetData}
              title="Restaurar datos iniciales"
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 border border-slate-300 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs & Search */}
        <div className="mt-3 pt-3 border-t border-slate-200 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          {/* Main Navigation Tabs */}
          <nav className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            <button
              id="tab-agenda"
              onClick={() => setCurrentTab('agenda')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                currentTab === 'agenda'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Agenda & Leads 360°</span>
            </button>

            <button
              id="tab-matcher"
              onClick={() => setCurrentTab('matcher')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                currentTab === 'matcher'
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-extrabold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-600 fill-amber-500" />
              <span>Smart Matcher</span>
              {matchCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-900 text-[10px] font-extrabold border border-amber-300">
                  {matchCount}
                </span>
              )}
            </button>

            <button
              id="tab-visitas"
              onClick={() => setCurrentTab('visitas')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                currentTab === 'visitas'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Bitácora & Reportes</span>
            </button>

            <button
              id="tab-chatbot"
              onClick={() => setCurrentTab('chatbot')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                currentTab === 'chatbot'
                  ? 'bg-emerald-600 text-white shadow-sm font-extrabold'
                  : 'text-slate-700 bg-emerald-50/70 hover:bg-emerald-100/80 border border-emerald-200'
              }`}
            >
              <Bot className="w-4 h-4 text-emerald-600" />
              <span>Chatbot & Citas</span>
              {pendingAppointmentsCount > 0 && (
                <span className="flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-emerald-200 text-emerald-950 text-[10px] font-extrabold border border-emerald-300">
                  <BellRing className="w-2.5 h-2.5" />
                  {pendingAppointmentsCount}
                </span>
              )}
            </button>

            <button
              id="tab-calculadora"
              onClick={() => setCurrentTab('calculadora')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                currentTab === 'calculadora'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>Calculadora de Cierre</span>
            </button>

            <button
              id="tab-guia"
              onClick={() => setCurrentTab('guia')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                currentTab === 'guia'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-blue-700 bg-blue-50/80 hover:bg-blue-100 border border-blue-200'
              }`}
            >
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>📖 Guía de Uso</span>
            </button>
          </nav>

          {/* Quick Search */}
          <div className="relative w-full lg:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              id="input-global-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar cliente, colonia, precio..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-100 border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 hover:text-slate-900 p-1"
              >
                ✕
              </button>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};
