import { describe, expect, it } from 'vitest';
import { PROTOTYPE_DISCLOSURE, QUALITY_TARGETS } from './prototype';

describe('prototype quality controls', () => {
  it('does not imply that demo actions are production transactions', () => {
    expect(PROTOTYPE_DISCLOSURE.summary).toContain('Fictional data');
    expect(PROTOTYPE_DISCLOSURE.summary).toContain('browser-session');
    expect(PROTOTYPE_DISCLOSURE.limitations).toContain('No official submission or fund processing');
  });

  it('discloses missing production security and persistence capabilities', () => {
    expect(PROTOTYPE_DISCLOSURE.limitations).toContain('No production authentication');
    expect(PROTOTYPE_DISCLOSURE.limitations).toContain('No persistent database');
  });

  it('sets enforceable JavaScript bundle limits', () => {
    expect(QUALITY_TARGETS.maximumJavaScriptChunkKiB).toBe(350);
    expect(QUALITY_TARGETS.maximumTotalJavaScriptKiB).toBe(1024);
  });

  it('requires route-level lazy loading', () => {
    expect(QUALITY_TARGETS.requiredRouteLoadingStrategy).toBe('route-level lazy loading');
  });
});
