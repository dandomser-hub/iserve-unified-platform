export const PROTOTYPE_DISCLOSURE = {
  label: 'Prototype simulation',
  summary: 'Fictional data and browser-session changes only.',
  limitations: [
    'No production authentication',
    'No persistent database',
    'No official submission or fund processing',
  ],
} as const;

export const QUALITY_TARGETS = {
  maximumJavaScriptChunkKiB: 350,
  maximumTotalJavaScriptKiB: 1024,
  requiredRouteLoadingStrategy: 'route-level lazy loading',
} as const;
