import { LeadItem, VisitRecord, AppointmentRecord } from '../types';
import { INITIAL_LEADS, INITIAL_VISITS, INITIAL_APPOINTMENTS } from '../data/mockData';

const LEADS_STORAGE_KEY = 'crm_inmobiliario_leads_v1';
const VISITS_STORAGE_KEY = 'crm_inmobiliario_visits_v1';
const APPOINTMENTS_STORAGE_KEY = 'crm_inmobiliario_appointments_v1';

export function loadLeads(): LeadItem[] {
  try {
    const raw = localStorage.getItem(LEADS_STORAGE_KEY);
    if (!raw) {
      saveLeads(INITIAL_LEADS);
      return INITIAL_LEADS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading leads from localStorage', e);
    return INITIAL_LEADS;
  }
}

export function saveLeads(leads: LeadItem[]): void {
  try {
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
  } catch (e) {
    console.error('Error saving leads to localStorage', e);
  }
}

export function loadVisits(): VisitRecord[] {
  try {
    const raw = localStorage.getItem(VISITS_STORAGE_KEY);
    if (!raw) {
      saveVisits(INITIAL_VISITS);
      return INITIAL_VISITS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading visits from localStorage', e);
    return INITIAL_VISITS;
  }
}

export function saveVisits(visits: VisitRecord[]): void {
  try {
    localStorage.setItem(VISITS_STORAGE_KEY, JSON.stringify(visits));
  } catch (e) {
    console.error('Error saving visits to localStorage', e);
  }
}

export function loadAppointments(): AppointmentRecord[] {
  try {
    const raw = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
    if (!raw) {
      saveAppointments(INITIAL_APPOINTMENTS);
      return INITIAL_APPOINTMENTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading appointments from localStorage', e);
    return INITIAL_APPOINTMENTS;
  }
}

export function saveAppointments(appointments: AppointmentRecord[]): void {
  try {
    localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(appointments));
  } catch (e) {
    console.error('Error saving appointments to localStorage', e);
  }
}

export function exportBackup(leads: LeadItem[], visits: VisitRecord[], appointments: AppointmentRecord[] = []): void {
  const data = {
    exportedAt: new Date().toISOString(),
    version: '2.0',
    leads,
    visits,
    appointments,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `respaldo_inmobiliario_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function calculateDaysAgo(isoDate: string): number {
  if (!isoDate) return 0;
  const past = new Date(isoDate).getTime();
  const now = new Date().getTime();
  const diffMs = now - past;
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}
