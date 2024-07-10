'use client';

/**
 * Convert number or BigInt to compact form per user locale, e.g. 1452 -> 1.5K.
 */
function ClientCompactNum({ num }: { num: number | bigint }) {
  if (typeof num !== 'number' && typeof num !== 'bigint') return;
  const abbreviation = new Intl.NumberFormat(undefined, {
    notation: 'compact',
  }).format(num);

  return abbreviation;
}

export default ClientCompactNum;
