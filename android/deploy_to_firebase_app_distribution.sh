
# Set env variable FIREBASE_TOKEN to the FIREBASE_REFRESH_TOKEN you stored in your project's Bitbucket repository
export FIREBASE_TOKEN=$FIREBASE_REFRESH_TOKEN

# Needed for env variable changes
./gradlew --stop

# Build and deploy apk to Firebase App Distribution
./gradlew assembleRelease appDistributionUploadRelease