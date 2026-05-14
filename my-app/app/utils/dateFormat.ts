export const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };

  const datePart = date.toLocaleDateString('en-GB', dateOptions);
  const timePart = date.toLocaleTimeString('en-GB', timeOptions);

  return `${datePart} at ${timePart}`;
};