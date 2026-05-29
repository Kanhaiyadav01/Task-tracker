// Convert seconds into a readable format like "1h 23m 10s"
const formatDuration = (seconds) => {
  if (!seconds || seconds === 0) return '0s';

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  let result = '';
  if (h > 0) result += `${h}h `;
  if (m > 0) result += `${m}m `;
  if (s > 0 || result === '') result += `${s}s`;

  return result.trim();
};

module.exports = { formatDuration };