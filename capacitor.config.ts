import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  // appId intentionally left unchanged - it's the native app's bundle identifier; changing it
  // would break store-listing/update continuity for an already-published app, same caution as
  // wrangler.toml's project name (see docs/DECISIONS.md).
  appId: 'com.calderon.efaturaxml',
  appName: 'SchemaFlow',
  webDir: 'dist',
};

export default config;
