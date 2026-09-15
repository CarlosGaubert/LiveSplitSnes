/**
 * Formats a duration in milliseconds into a speedrun timer string:
 * - Under 1 min: "42.15" or "0:42.15"
 * - Under 1 hour: "12:34.56"
 * - 1 hour or more: "1:02:34.5"
 */
export function formatTime(
  ms: number | null | undefined,
  options: {
    showHours?: boolean;
    alwaysShowMinutes?: boolean;
    decimalDigits?: number;
    fallback?: string;
  } = {}
): string {
  if (ms === null || ms === undefined || isNaN(ms)) {
    return options.fallback ?? '-';
  }

  const isNegative = ms < 0;
  const absMs = Math.abs(ms);

  const totalSeconds = Math.floor(absMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const fraction = absMs % 1000;

  const decimalDigits = options.decimalDigits ?? (hours > 0 ? 1 : 2);
  let fractionStr = '';
  if (decimalDigits === 1) {
    fractionStr = Math.floor(fraction / 100).toString();
  } else if (decimalDigits === 2) {
    fractionStr = Math.floor(fraction / 10).toString().padStart(2, '0');
  } else if (decimalDigits === 3) {
    fractionStr = fraction.toString().padStart(3, '0');
  }

  let result = '';
  if (hours > 0 || options.showHours) {
    result = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else if (minutes > 0 || options.alwaysShowMinutes) {
    result = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  } else {
    result = `${seconds}`;
  }

  if (decimalDigits > 0) {
    result += `.${fractionStr}`;
  }

  return isNegative ? `-${result}` : result;
}

/**
 * Formats a delta time with an explicit sign (+/-)
 */
export function formatDelta(deltaMs: number | null | undefined): string {
  if (deltaMs === null || deltaMs === undefined) {
    return '-';
  }
  const sign = deltaMs > 0 ? '+' : deltaMs < 0 ? '-' : '±';
  const absFormatted = formatTime(Math.abs(deltaMs), {
    showHours: false,
    alwaysShowMinutes: Math.abs(deltaMs) >= 60000,
    decimalDigits: 2,
  });
  return `${sign}${absFormatted}`;
}

/**
 * Parses time string like "12:34.56" or "1:02:34" to milliseconds
 */
export function parseTimeToMs(timeStr: string): number | null {
  if (!timeStr || timeStr.trim() === '-' || timeStr.trim() === '') return null;
  const clean = timeStr.trim();
  const parts = clean.split(':');

  if (parts.length === 3) {
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const [seconds, millis] = parts[2].split('.');
    const sec = parseInt(seconds, 10);
    const ms = millis ? parseInt(millis.padEnd(3, '0').slice(0, 3), 10) : 0;
    return (hours * 3600 + minutes * 60 + sec) * 1000 + ms;
  } else if (parts.length === 2) {
    const minutes = parseInt(parts[0], 10);
    const [seconds, millis] = parts[1].split('.');
    const sec = parseInt(seconds, 10);
    const ms = millis ? parseInt(millis.padEnd(3, '0').slice(0, 3), 10) : 0;
    return (minutes * 60 + sec) * 1000 + ms;
  } else if (parts.length === 1) {
    const [seconds, millis] = parts[0].split('.');
    const sec = parseInt(seconds, 10);
    const ms = millis ? parseInt(millis.padEnd(3, '0').slice(0, 3), 10) : 0;
    return sec * 1000 + ms;
  }
  return null;
}
