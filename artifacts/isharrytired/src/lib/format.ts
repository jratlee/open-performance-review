export function formatDate(value: string | Date, options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }) {
  return new Intl.DateTimeFormat('en-GB', options).format(new Date(value));
}

export function resultLabel(result: string) {
  return result === 'in_line' ? 'About the same' : result === 'no_reliable_read' ? 'Not enough to tell' : result.charAt(0).toUpperCase() + result.slice(1);
}

export function resultTone(result: string) {
  return result === 'higher' ? 'higher' : result === 'lower' ? 'lower' : result === 'in_line' ? 'inline' : 'unclear';
}

export function signalLabel(signal: string) {
  const labels: Record<string, string> = {
    movement: 'movement',
    stage_coverage: 'stage coverage',
    pauses: 'pauses',
    crowd_interaction: 'crowd response',
    vocal_variation: 'voice changes',
    staging: 'staging',
  };
  return labels[signal] ?? signal.replaceAll('_', ' ');
}

export function confidenceLabel(value: string | null) {
  return value === 'high' ? 'Strong support' : value === 'medium' ? 'Some support' : value === 'low' ? 'Early read' : 'Still checking';
}

export function coverageLabel(status: string) {
  return status === 'complete' ? 'Enough evidence' : status === 'partial' ? 'Some evidence' : 'Not enough evidence';
}

export function sourceQualityLabel(value: string) {
  return value === 'good' ? 'clear source' : value === 'usable' ? 'some context' : value;
}

export function coverageSummary(status: string) {
  return status === 'complete'
    ? 'Enough linked records are visible to make a careful comparison.'
    : status === 'partial'
      ? 'Some useful records are present, but parts of the run are harder to compare.'
      : 'There are not enough comparable records yet to make a fair call.';
}

export function showSummary(result: string) {
  return result === 'lower'
    ? 'A quieter stage pattern than the other records in this project.'
    : result === 'higher'
      ? 'A livelier stage pattern than the other records in this project.'
      : result === 'in_line'
        ? 'Broadly close to the other records in this project.'
        : 'There are observations, but not enough comparable evidence to call it either way.';
}

export function momentSummary(result: string) {
  return result === 'lower'
    ? 'This moment came in quieter than the other records we could compare.'
    : result === 'higher'
      ? 'This moment showed more visible movement or response than the comparable records.'
      : result === 'in_line'
        ? 'This moment looked broadly like the other records in the project.'
        : 'There are not enough comparable sources to call this moment.';
}