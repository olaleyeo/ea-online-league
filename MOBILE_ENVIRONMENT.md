# Mobile Environment Variables

The React Native (Expo) app uses `process.env.EXPO_PUBLIC_*` variables to securely bundle configuration into the app at build time.

## Environments

1. **Development (`mobile/.env.development`)**
   - Contains: `EXPO_PUBLIC_API_URL=http://10.0.2.2:3001/api`
   - *Note: `10.0.2.2` is the Android Emulator's alias for your host machine's localhost.*
   - Used when running `expo start`.

2. **Production (`mobile/.env.production`)**
   - Contains: `EXPO_PUBLIC_API_URL=https://app.ealeague.com/api`
   - Used during EAS builds for actual device deployment.

## Loading Environments in EAS
In your `eas.json` (created when you run `eas build:configure`), you can specify which `.env` file each profile uses:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "env": {
        "EXPO_PUBLIC_API_URL": "http://10.0.2.2:3001/api"
      }
    },
    "production": {
      "env": {
        "EXPO_PUBLIC_API_URL": "https://app.ealeague.com/api"
      }
    }
  }
}
```
