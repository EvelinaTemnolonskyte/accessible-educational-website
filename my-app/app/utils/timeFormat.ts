function getTimeParts(seconds: number) {
  const totalSeconds = Math.max(0, Math.floor(seconds || 0));
  return {
    h: Math.floor(totalSeconds / 3600),
    m: Math.floor((totalSeconds % 3600) / 60),
    s: totalSeconds % 60
  };
}

export function formatDuration(seconds: number | null | undefined): string {
  if (seconds === null || seconds === undefined || seconds <= 0) {
    return '0 sec';
  }
  
  const { h, m, s } = getTimeParts(seconds);
  const parts: string[] = [];

  if (h > 0) parts.push(`${h} h`);
  if (m > 0) parts.push(`${m} min`);
  if (s > 0 || (h === 0 && m === 0)) parts.push(`${s} sec`);

  return parts.join(' ');
}

export function formatTimeSpent(seconds: number | null | undefined): string {
  if (seconds === null || seconds === undefined || seconds <= 0) {
    return '0 min 0 sec';
  }

  const { h, m, s } = getTimeParts(seconds);

  if (h > 0) {
    return `${h} h ${m} min ${s} sec`;
  }
  
  return `${m} min ${s} sec`;
}