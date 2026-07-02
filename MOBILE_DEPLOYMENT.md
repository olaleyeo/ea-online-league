# Mobile App Deployment Guide (Expo EAS)

This guide explains how to build and deploy the React Native (Expo) app using Expo Application Services (EAS).

## Prerequisites
1. Install the EAS CLI: `npm install -g eas-cli`
2. Login to Expo: `eas login`
3. Configure the project: `eas build:configure` (this generates `eas.json`).

## 1. Environment Variables
EAS allows you to define build profiles in `eas.json` pointing to different environment variables (see `MOBILE_ENVIRONMENT.md` for details).

## 2. Building for Android (APK / AAB)
To create an APK for testing on an Android device:
```bash
eas build -p android --profile preview
```

To create an AAB for the Google Play Store:
```bash
eas build -p android --profile production
```

## 3. Building for iOS
To build for iOS Simulator:
```bash
eas build -p ios --profile development
```

To build for Apple App Store (Requires Apple Developer account):
```bash
eas build -p ios --profile production
```

## 4. Over-The-Air (OTA) Updates
Expo allows you to push JavaScript and asset updates directly to users' devices without going through the app store review process.

1. Ensure your `app.json` has `updates.url` configured (done via `eas update:configure`).
2. Publish an OTA update to your production channel:
```bash
eas update --branch production --message "Fixed bracket UI bug"
```
Users will download the update seamlessly the next time they open the app.
