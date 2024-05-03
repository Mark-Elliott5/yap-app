'use client';

function LocaleDateString({
  className,
  date,
}: {
  className?: string;
  date: Date;
}) {
  return (
    <span className={className}>{new Date(date).toLocaleDateString()}</span>
  );
}

export default LocaleDateString;
