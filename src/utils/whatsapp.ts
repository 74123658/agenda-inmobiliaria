import { LeadItem, VisitRecord } from '../types';

export function cleanPhoneNumber(phone: string): string {
  // Remove non-numeric characters except +
  const cleaned = phone.replace(/[^0-9]/g, '');
  // If no country code and length is 10, default to +52 (Mexico) or standard
  if (cleaned.length === 10) {
    return `52${cleaned}`;
  }
  return cleaned;
}

export function formatCurrency(amount: number, currency: string = 'MXN'): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function generateWhatsAppUrl(phone: string, text: string): string {
  const cleanPhone = cleanPhoneNumber(phone);
  const encodedText = encodeURIComponent(text.trim());
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

export interface QuickTemplate {
  id: string;
  title: string;
  preview: string;
  getText: (lead: LeadItem, extra?: any) => string;
}

export const WHATSAPP_TEMPLATES: QuickTemplate[] = [
  {
    id: 'saludo_seguimiento',
    title: '💬 Saludo de Seguimiento',
    preview: 'Hola [Nombre], te saludo con gusto para darle seguimiento...',
    getText: (lead) => {
      if (lead.type === 'dueno') {
        return `Hola ${lead.name}, te saludo con gusto. Quería comentarte sobre el estatus de promoción de tu propiedad "${lead.propertyTitle}". Tenemos prospectos interesados y me gustaría coordinar los siguientes pasos. ¿Cómo estás de tiempo para una breve llamada?`;
      }
      return `¡Hola ${lead.name}! Te saludo con gusto. Quería dar seguimiento a tu búsqueda de "${lead.propertyTitle}" en ${lead.zone}. ¿Tienes unos minutos hoy para platicar de un par de opciones que acaban de entrar?`;
    },
  },
  {
    id: 'confirmar_cita',
    title: '📅 Confirmación de Cita / Visita',
    preview: 'Hola [Nombre], confirmando nuestra cita para ver el inmueble...',
    getText: (lead) => {
      return `Hola ${lead.name}, gusto en saludarte. Te confirmo nuestra cita programada para ver la propiedad en ${lead.zone}. La ubicación y detalles están listos. ¿Me confirmas si todo en orden con tu horario? ¡Quedo muy atento!`;
    },
  },
  {
    id: 'ficha_rapida',
    title: '📋 Envío de Ficha & Características',
    preview: 'Hola [Nombre], te comparto la información de la propiedad...',
    getText: (lead) => {
      const priceFormatted = formatCurrency(lead.price, lead.currency);
      const beds = lead.bedrooms ? `\n🛏️ ${lead.bedrooms} Recámaras` : '';
      const baths = lead.bathrooms ? `\n🚿 ${lead.bathrooms} Baños` : '';
      const park = lead.parking ? `\n🚗 ${lead.parking} Estacionamientos` : '';
      return `¡Hola ${lead.name}! Te comparto la información clave de "${lead.propertyTitle}":\n\n📍 Zona: ${lead.zone}\n💰 Inversión: ${priceFormatted} (${lead.operationType === 'venta' ? 'Venta' : 'Renta'})${beds}${baths}${park}\n\nQuedo a tus órdenes para agendar una visita en el horario que mejor te acomode.`;
    },
  },
  {
    id: 'cierre_apartado',
    title: '🟢 Documentos de Apartado / Cierre',
    preview: 'Hola [Nombre], para asegurar la propiedad necesitamos...',
    getText: (lead) => {
      return `Hola ${lead.name}, ¡excelente decisión avanzar con el apartado de "${lead.propertyTitle}"! Para elaborar el contrato de promesa y apartar formalmente el inmueble requerimos:\n1. Identificación oficial (INE/Pasaporte)\n2. Comprobante de domicilio reciente\n3. Constancia de Situación Fiscal (RFC)\n\n¿Me los podrás compartir por este medio para tener todo listo?`;
    },
  },
];

export function generateOwnerVisitReportText(owner: LeadItem, visit: VisitRecord): string {
  const priceLabels = {
    justo: 'Percibido en precio justo y competitivo',
    alto: 'Percibido ligeramente alto para la zona',
    atractivo: 'Percibido como excelente oportunidad de precio',
  };

  const interestLabels = {
    muy_alto: 'Interés muy alto (Evaluando oferta / apartado)',
    interesado: 'Interesado (Comparando opciones)',
    lo_pensara: 'Evaluando con familia / banco',
    descartado: 'Descartado por características específicas',
  };

  return `Estimado/a ${owner.name},\n\nLe comparto el reporte de retroalimentación de la visita realizada a su propiedad "${owner.propertyTitle}":\n\n👤 Prospecto: ${visit.clientName}\n📅 Fecha: ${visit.date}${visit.time ? ` - ${visit.time}` : ''}\n🔍 Nivel de interés: ${interestLabels[visit.interestLevel] || visit.interestLevel}\n💵 Opinión del precio: ${priceLabels[visit.priceFeedback] || visit.priceFeedback}\n📝 Comentarios clave: "${visit.clientComments || 'Visita satisfactoria'}"\n\nSeguimos dando el máximo impulso para concretar el cierre a la brevedad. Cualquier duda estoy a sus órdenes.`;
}
