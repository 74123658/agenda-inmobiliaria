import { LeadItem, SmartMatch } from '../types';

export function calculateSmartMatches(leads: LeadItem[]): SmartMatch[] {
  const owners = leads.filter((l) => l.type === 'dueno' && l.status !== 'rojo');
  const buyers = leads.filter((l) => l.type === 'prospecto' && l.status !== 'rojo');

  const matches: SmartMatch[] = [];

  for (const owner of owners) {
    for (const buyer of buyers) {
      let score = 0;
      const reasons: string[] = [];

      // 1. Operation type match (venta vs renta)
      if (owner.operationType === buyer.operationType) {
        score += 30;
        reasons.push(`Misma operación (${owner.operationType.toUpperCase()})`);
      } else {
        continue; // Skip if one is venta and other is renta
      }

      // 2. Property type match
      if (owner.propertyType === buyer.propertyType) {
        score += 30;
        reasons.push(`Mismo tipo de inmueble (${owner.propertyType})`);
      } else if (
        (owner.propertyType === 'casa' && buyer.propertyType === 'departamento') ||
        (owner.propertyType === 'departamento' && buyer.propertyType === 'casa')
      ) {
        score += 15;
        reasons.push(`Inmueble residencial afín (${buyer.propertyType} / ${owner.propertyType})`);
      }

      // 3. Zone / Location Match
      const cleanOwnerZone = (owner.zone || '').toLowerCase().trim();
      const cleanBuyerZone = (buyer.zone || '').toLowerCase().trim();

      if (cleanOwnerZone && cleanBuyerZone) {
        if (cleanOwnerZone === cleanBuyerZone || cleanOwnerZone.includes(cleanBuyerZone) || cleanBuyerZone.includes(cleanOwnerZone)) {
          score += 25;
          reasons.push(`Misma zona de interés (${owner.zone})`);
        } else {
          // Check common words
          const ownerWords = cleanOwnerZone.split(/\s+/);
          const hasCommon = ownerWords.some((w) => w.length > 3 && cleanBuyerZone.includes(w));
          if (hasCommon) {
            score += 15;
            reasons.push(`Zona cercana o coincidente (${owner.zone})`);
          }
        }
      }

      // 4. Budget vs Asking Price
      if (owner.price > 0 && buyer.price > 0) {
        const ratio = buyer.price / owner.price;
        if (ratio >= 0.95 && ratio <= 1.25) {
          score += 15;
          reasons.push(`Presupuesto ideal (Presupuesto $${(buyer.price / 1000000).toFixed(1)}M vs Precio $${(owner.price / 1000000).toFixed(1)}M)`);
        } else if (ratio >= 0.85 && ratio < 0.95) {
          score += 10;
          reasons.push(`Presupuesto negociable (-10% del precio)`);
        } else if (ratio > 1.25) {
          score += 10;
          reasons.push(`Presupuesto holgado para este inmueble`);
        }
      }

      // Cap at 100%
      const finalScore = Math.min(100, score);

      if (finalScore >= 50) {
        matches.push({
          id: `match-${owner.id}-${buyer.id}`,
          ownerLead: owner,
          buyerLead: buyer,
          matchScore: finalScore,
          reasons,
        });
      }
    }
  }

  // Sort by match score descending
  return matches.sort((a, b) => b.matchScore - a.matchScore);
}
