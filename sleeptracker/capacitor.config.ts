import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'sleeptracker',
  webDir: 'www',
  plugins: {
    SocialSharing: {
      enabled: true // ✅ Enable Social Sharing plugin
    }
  }
};

export default config;
