'use client';

function ClientLocaleDate({ date }: { date: string | Date }) {
  return typeof date === 'string'
    ? new Date(date + 'Z').toLocaleDateString()
    : date.toLocaleDateString();
}

export default ClientLocaleDate;
