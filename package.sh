ionic cordova build android --prod --release
cp ./platforms/android/build/outputs/apk/release/android-release-unsigned.apk ./
rm -f mobao.apk
jarsigner -verbose -keystore android.keystore -signedjar mobao.apk android-release-unsigned.apk android.keystore
rm -f android-release-unsigned.apk
