#!/bin/bash
set -e

echo "=================================================================="
echo "🚀 SOULRISE PANCHANG: AUTOMATIC RELEASE BUILD & BUILDSHARE UPLOAD"
echo "=================================================================="

# 1. Environment Setup
export JAVA_HOME="/opt/homebrew/Cellar/openjdk@17/17.0.20/libexec/openjdk.jdk/Contents/Home"
export ANDROID_HOME="/opt/homebrew/share/android-commandlinetools"
export PATH="$ANDROID_HOME/platform-tools:$PATH"

PROJECT_DIR="/Users/Achal/.gemini/antigravity/scratch/HinduPanchangReactNative"
DEST_DIR="/Users/Achal/Applications/My Apps"
APK_SOURCE="$PROJECT_DIR/android/app/build/outputs/apk/release/app-release.apk"
APK_DEST="$DEST_DIR/SoulRisePanchang.apk"

API_KEY="sk_23599b26b658e320b7fadb243fc12df57ad86f6305a31362914220c1fab6ec84"

# 2. Compile Release APK
echo "\n📦 Step 1: Compiling Release APK with Gradle..."
cd "$PROJECT_DIR/android"
./gradlew assembleRelease

# 3. Copy to Local My Apps Directory
echo "\n📁 Step 2: Copying APK to $APK_DEST..."
mkdir -p "$DEST_DIR"
cp "$APK_SOURCE" "$APK_DEST"

# 4. Automatic Upload to BuildShare
echo "\n🌐 Step 3: Uploading directly to BuildShare 'SoulRise Panchang'..."
UPLOAD_RESPONSE=$(curl -s -X POST \
  -H "x-api-key: $API_KEY" \
  -H "Authorization: Bearer $API_KEY" \
  -F "apk=@$APK_DEST" \
  ${APP_ID:+-F "appId=$APP_ID"} \
  "https://api.buildshare.in/api/v1/builds/upload")

echo "BuildShare Response: $UPLOAD_RESPONSE"

echo "\n=================================================================="
echo "✅ BUILD & AUTOMATIC UPLOAD COMPLETED SUCCESSFULLY!"
echo "=================================================================="
