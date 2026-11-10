import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.mitadt.trafficmonitor",
  appName: "TraffiQ",
  webDir: "dist",
  server: {
    androidScheme: "https",
    cleartext: true,
  },
  plugins: {
    CapacitorHttpServer: {
      enabled: false,
    },
  },
};

export default config;