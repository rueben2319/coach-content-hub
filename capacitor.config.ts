
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.43982ef684ba4718aed03ccebe6d2c0c',
  appName: 'coach-content-hub',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    url: 'https://43982ef6-84ba-4718-aed0-3ccebe6d2c0c.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#ffffff',
      showSpinner: false
    },
    StatusBar: {
      style: 'default',
      backgroundColor: '#ffffff'
    },
    Keyboard: {
      resize: 'body',
      style: 'dark'
    }
  }
};

export default config;
