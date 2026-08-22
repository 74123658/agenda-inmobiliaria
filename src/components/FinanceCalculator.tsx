import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  DollarSign, 
  Percent, 
  FileCheck, 
  Copy, 
  MessageCircle, 
  Sparkles,
  CheckCircle2,
  TrendingUp,
  ShieldAlert
} from 'lucide-react';
import { LeadItem, StatusColor } from '../types';
import { formatCurrency, generateWhatsAppUrl } from '../utils/whatsapp';

interface FinanceCalculatorProps {
  lead?: LeadItem | null;
  onClose?: () => void;
  onMarkAsGreen?: (leadId: string) => void;
}

export const FinanceCalculator: React.FC<FinanceCalculatorProps> = ({
  lead,
  onClose,
  onMarkAsGreen,
}) => {
  const [propertyPrice, setPropertyPrice] = useState<number>(lead?.price || 4500000);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20); // 20%
  const [notaryExpensePercent, setNotaryExpensePercent] = useState<number>(4.5); // 4.5% promedio CDMX/México
  const [interestRateAnnual, setInterestRateAnnual] = useState<number>(10.5); // 10.5% anual bancaria
  const [termYears, setTermYears] = useState<number>(20); // 20 años
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (lead?.price) {
      setPropertyPrice(lead.price);
    }
  }, [lead]);

  // Calculations
  const downPaymentAmount = propertyPrice * (downPaymentPercent / 100);
  const notaryExpenses = propertyPrice * (notaryExpensePercent / 100);
  const totalInitialCash = downPaymentAmount + notaryExpenses;
  const loanAmount = Math.max(0, propertyPrice - downPaymentAmount);

  // Mortgage monthly payment formula: P * r * (1+r)^n / ((1+r)^n - 1)
  const monthlyRate = interestRateAnnual / 100 / 12;
  const totalMonths = termYears * 12;
  const monthlyPayment =
    loanAmount > 0 && monthlyRate > 0
      ? (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1)
      : 0;

  const getFinancialBreakdownText = () => {
    const propertyTitle = lead?.propertyTitle || 'Inmueble Seleccionado';
    const clientName = lead?.name || 'Estimado/a cliente';

    return `📑 *SIMULACIÓN FINANCIERA DE ADQUISICIÓN*\nPara: ${clientName}\nPropiedad: ${propertyTitle}\n\n` +
      `🏠 *Valor del Inmueble:* ${formatCurrency(propertyPrice)}\n` +
      `-----------------------------------\n` +
      `💵 *Enganche (${downPaymentPercent}%):* ${formatCurrency(downPaymentAmount)}\n` +
      `⚖️ *Gastos Notariales e Impuestos est. (${notaryExpensePercent}%):* ${formatCurrency(notaryExpenses)}\n` +
      `💰 *Desembolso Inicial Total:* ${formatCurrency(totalInitialCash)}\n` +
      `-----------------------------------\n` +
      `🏦 *Monto de Crédito a Financiar:* ${formatCurrency(loanAmount)}\n` +
      `📅 *Plazo:* ${termYears} años (Tasa est. ${interestRateAnnual}% anual)\n` +
      `💳 *Mensualidad Hipotecaria Estimada:* ${formatCurrency(monthlyPayment)}/mes\n\n` +
      `¿Avanzamos con la solicitud de precalificación para apartar tu propiedad?`;
  };

  const handleCopyText = () => {
    const text = getFinancialBreakdownText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendWhatsApp = () => {
    if (!lead?.phone) return;
    const text = getFinancialBreakdownText();
    const url = generateWhatsAppUrl(lead.phone, text);
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white border border-slate-300 rounded-2xl p-5 sm:p-6 shadow-sm space-y-6 text-slate-900">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              Calculadora de Cierre & Enganche
              {lead && <span className="text-xs font-semibold text-slate-500">({lead.name})</span>}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Desbloquea las dudas financieras del comprador en plena llamada o cita
            </p>
          </div>
        </div>

        {lead && onMarkAsGreen && (
          <button
            onClick={() => onMarkAsGreen(lead.id)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Apartado Listo (🟢 Cambiar a Verde)</span>
          </button>
        )}
      </div>

      {/* Main Grid: Inputs vs Output Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Precio del Inmueble ($ MXN)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
              <input
                type="number"
                value={propertyPrice}
                onChange={(e) => setPropertyPrice(Number(e.target.value) || 0)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono font-bold text-base focus:outline-none focus:bg-white focus:border-emerald-600"
              />
            </div>
          </div>

          {/* Sliders */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
            {/* Enganche */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>% de Enganche Deseado:</span>
                <span className="text-emerald-700 font-extrabold">{downPaymentPercent}% ({formatCurrency(downPaymentAmount)})</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                step="5"
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                <span>10% (Mínimo)</span>
                <span>20% (Recomendado)</span>
                <span>50%</span>
              </div>
            </div>

            {/* Gastos Notariales */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>% Gastos Notariales & Impuestos (ISAI):</span>
                <span className="text-amber-700 font-extrabold">{notaryExpensePercent}% ({formatCurrency(notaryExpenses)})</span>
              </div>
              <input
                type="range"
                min="3"
                max="8"
                step="0.5"
                value={notaryExpensePercent}
                onChange={(e) => setNotaryExpensePercent(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                <span>3% (Estados)</span>
                <span>4.5% - 5% (CDMX)</span>
                <span>8%</span>
              </div>
            </div>

            {/* Tasa y Plazo */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Tasa Anual Hipotecaria (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={interestRateAnnual}
                  onChange={(e) => setInterestRateAnnual(Number(e.target.value))}
                  className="w-full p-2 text-xs rounded-lg bg-white border border-slate-300 text-slate-900 font-bold font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Plazo del Crédito (Años)</label>
                <select
                  value={termYears}
                  onChange={(e) => setTermYears(Number(e.target.value))}
                  className="w-full p-2 text-xs rounded-lg bg-white border border-slate-300 text-slate-900 font-bold"
                >
                  <option value="10">10 Años</option>
                  <option value="15">15 Años</option>
                  <option value="20">20 Años</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Output: Financial Summary Box */}
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-300 flex flex-col justify-between">
          <div>
            <span className="text-xs font-extrabold text-slate-600 uppercase tracking-wider block mb-3">
              Resumen de Inversión para el Cliente
            </span>

            {/* Main Big Numbers */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[11px] text-slate-500 font-medium block">Desembolso Inicial</span>
                <span className="text-lg sm:text-xl font-black text-amber-700 font-mono">
                  {formatCurrency(totalInitialCash)}
                </span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[11px] text-slate-500 font-medium block">Mensualidad ({termYears}a)</span>
                <span className="text-lg sm:text-xl font-black text-emerald-700 font-mono">
                  {formatCurrency(monthlyPayment)}
                </span>
              </div>
            </div>

            {/* Itemized list */}
            <div className="space-y-2 text-xs text-slate-700 border-t border-slate-200 pt-3">
              <div className="flex justify-between font-medium">
                <span className="text-slate-500">Valor de venta:</span>
                <span className="font-bold text-slate-900">{formatCurrency(propertyPrice)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-slate-500">Enganche ({downPaymentPercent}%):</span>
                <span className="font-bold text-slate-900">{formatCurrency(downPaymentAmount)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-slate-500">Gastos Notariales ({notaryExpensePercent}%):</span>
                <span className="font-bold text-amber-800">{formatCurrency(notaryExpenses)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-slate-500">Monto Crédito Hipotecario:</span>
                <span className="font-bold text-emerald-800">{formatCurrency(loanAmount)}</span>
              </div>
            </div>
          </div>

          {/* Quick Output Actions */}
          <div className="pt-4 mt-4 border-t border-slate-200 flex flex-wrap items-center justify-end gap-2">
            <button
              onClick={handleCopyText}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold border border-slate-300 transition-colors shadow-xs"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
              <span>{copied ? '¡Copiado al Portapapeles!' : 'Copiar Corrida'}</span>
            </button>

            {lead?.phone && (
              <button
                onClick={handleSendWhatsApp}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Enviar por WhatsApp</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
