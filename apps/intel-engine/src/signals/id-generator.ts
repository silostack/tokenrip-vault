const SIGNAL_ID_REGEX = /^sig-(\d{8})-(\d{3})$/;

export function generateSignalId(existingIds: string[], dateStr: string): string {
  const compactDate = dateStr.replace(/-/g, '');

  let maxSeq = 0;
  for (const id of existingIds) {
    const match = id.match(SIGNAL_ID_REGEX);
    if (match && match[1] === compactDate) {
      const seq = parseInt(match[2], 10);
      if (seq > maxSeq) maxSeq = seq;
    }
  }

  const next = (maxSeq + 1).toString().padStart(3, '0');
  return `sig-${compactDate}-${next}`;
}

export function parseSignalId(id: string): { date: string; sequence: number } {
  const match = id.match(SIGNAL_ID_REGEX);
  if (!match) {
    throw new Error(`Invalid signal ID format: "${id}". Expected sig-YYYYMMDD-NNN`);
  }
  return {
    date: match[1],
    sequence: parseInt(match[2], 10),
  };
}
