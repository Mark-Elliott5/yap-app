'use client';

function ClientLocaleTime({ date }: { date: string | Date }) {
  return typeof date === 'string'
    ? new Date(date + 'Z').toLocaleTimeString()
    : date.toLocaleTimeString();
}

export default ClientLocaleTime;
