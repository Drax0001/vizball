import { useSyncExternalStore } from 'react';

// Signals when the first-visit loader starts lifting, so the hero can begin
// drawing underneath it instead of finishing unseen.
let ready = false;
const subscribers = new Set();

export function markIntroReady() {
  if (ready) return;
  ready = true;
  subscribers.forEach((fn) => fn());
}

export function useIntroReady() {
  return useSyncExternalStore(
    (cb) => {
      subscribers.add(cb);
      return () => subscribers.delete(cb);
    },
    () => ready,
    () => true
  );
}
