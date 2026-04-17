export function formatMinutes(value) {
  if (!value && value !== 0) {
    return '0 min';
  }

  if (value < 60) {
    return `${value} min`;
  }

  const hours = Math.floor(value / 60);
  const minutes = value % 60;
  return `${hours}h ${minutes.toString().padStart(2, '0')}min`;
}
