## How the project was built
$ create-react-native-app JGIDigiTiki
$ cd JGIDigiTiki

To run app in Expo App on your phone:
$ yarn run start

To run app in Expo on Android Emulator
$ yarn run start -> a

To eject from Expo:
$ yarn run eject

$ npm install
$ react-native run-android

Open 'android' folder in Android Studio:
Updated Gradle Android plugin to 3.0.0 and Gradle to 4.1

For the Gradle Android plugin v3 migration: as described in the official migration guide (https://developer.android.com/studio/build/gradle-plugin-3-0-0-migration.html113), please make sure that you add google() to the repositories list in build.gradle!

In fact you’ll most likely need both google() and jcenter() right now.

$ npm i react-native-background-timer --save
$ react-native link
# Error: Command `link` unrecognized
Make sure that you have run `npm install`  

## Install with '--save' and 'react-native link':
react-native-background-timer
react-native-zip-archive
react-native-orientation
react-native-localization
react-native-fs
realm
RNMail

## Change all 'compile' to 'implementation'

## For react-native-orientation to work, implement the following method:
Implement onConfigurationChanged method in MainActivity.java

    import android.content.Intent; // <--- import
    import android.content.res.Configuration; // <--- import

    public class MainActivity extends ReactActivity {
      ......
      @Override
      public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        Intent intent = new Intent("onConfigurationChanged");
        intent.putExtra("newConfig", newConfig);
        this.sendBroadcast(intent);
      }
      ......
    }

# Add permissions
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />

# Adding signature so that you can assembleRelease
Add digitiki-release-key.keystore to android/app

## Add the following to android/gradle.properties
android.useDeprecatedNdk=true
MYAPP_RELEASE_STORE_FILE=digitiki-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=digitiki-key
MYAPP_RELEASE_STORE_PASSWORD=digitiki
MYAPP_RELEASE_KEY_PASSWORD=digitiki

# To speed up build, add the following to android/gradle.properties especially jvmargs of 2GB is great!
org.gradle.daemon=true
org.gradle.jvmargs=-Xmx2048M
org.gradle.configureondemand=true

# Edit the file android/app/build.gradle in your project folder and add the signing config,

...
android {
    ...
    defaultConfig { ... }
    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
                storeFile file(MYAPP_RELEASE_STORE_FILE)
                storePassword MYAPP_RELEASE_STORE_PASSWORD
                keyAlias MYAPP_RELEASE_KEY_ALIAS
                keyPassword MYAPP_RELEASE_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            ...
            signingConfig signingConfigs.release
        }
    }
}
...

# Error: "Native module moduleX tried to override moduleX for module name moduleX. If this was your intention set canOverrideExistingModule=true"
Remove duplicate entries in MainApplication.java in android/app/src/.../MainApplication.java

## Code up
Install missing modules in package.json. Run 'npm install'
Change index.js
