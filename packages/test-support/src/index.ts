export interface FoundationProbe {
  readonly label: string;
  readonly ready: true;
}

export function createFoundationProbe(label: string): FoundationProbe {
  return { label, ready: true };
}
