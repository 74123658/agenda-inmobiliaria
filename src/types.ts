export type LeadType = 'dueno' | 'prospecto';

export type StatusColor = 'verde' | 'amarillo' | 'rojo';

export type PropertyType = 'casa' | 'departamento' | 'terreno' | 'local' | 'oficina' | 'bodega' | 'otro';

export type OperationType = 'venta' | 'renta';

export interface VisitRecord {
  id: string;
  leadId: string;
  propertyTitle: string;
  clientName: string;
  date: string;
  time?: string;
  priceFeedback: 'justo' | 'alto' | 'atractivo';
  conditionFeedback: 'excelente' | 'bueno' | 'regular' | 'requiere_reparacion';
  interestLevel: 'muy_alto' | 'interesado' | 'lo_pensara' | 'descartado';
  clientComments: string;
  resultingStatus: StatusColor;
  notifiedOwnerAt?: string;
}

export interface LeadItem {
  id: string;
  type: LeadType;
  name: string;
  phone: string;
  propertyTitle: string;
  propertyType: PropertyType;
  operationType: OperationType;
  zone: string;
  price: number;
  currency: 'MXN' | 'USD';
  commissionPercent?: number;
  estimatedCommission?: number;
  status: StatusColor;
  nextActionDate: string; // YYYY-MM-DD
  nextActionNote: string;
  lastContactDate: string; // ISO string
  notes: string;
  bedrooms?: number;
  bathrooms?: number;
  parking?: number;
  addressOrReference?: string;
  tags?: string[];
  createdAt: string;
  urgent?: boolean;
}

export interface SmartMatch {
  id: string;
  ownerLead: LeadItem;
  buyerLead: LeadItem;
  matchScore: number;
  reasons: string[];
}

export type ViewTab = 'agenda' | 'matcher' | 'visitas' | 'chatbot' | 'calculadora' | 'guia';

export type AppointmentType = 'llamada' | 'cita_visita' | 'seguimiento' | 'reunion_cierre';
export type AppointmentStatus = 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
export type AlarmSoundType = 'campana' | 'digital' | 'marimba' | 'urgente';

export interface AppointmentRecord {
  id: string;
  leadId?: string;
  leadName: string;
  leadPhone: string;
  leadType: LeadType;
  type: AppointmentType;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm (24h) or "16:30"
  propertyTitle?: string;
  notes?: string;
  status: AppointmentStatus;
  alarmEnabled: boolean;
  alarmSound: AlarmSoundType;
  alarmOffsetMinutes: number; // 0 = at time, 15 = 15m before, etc.
  createdAt: string;
  triggered?: boolean;
}

export type FilterStatus = 'todos' | 'verde' | 'amarillo' | 'rojo';
export type FilterType = 'todos' | 'duenos' | 'prospectos';
export type DateFilter = 'hoy' | 'proximos' | 'semana' | 'todos' | 'vencidos';
