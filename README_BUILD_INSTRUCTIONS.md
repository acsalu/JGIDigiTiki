## How the project was built
$ react-native init JGIDigiTiki
$ cd JGIDigiTiki
$ npm install
$ react-native run-android
$ npm install --save react-native-background-timer react-native-zip-archive react-native-orientation react-native-localization react-native-fs realm react-native-mail react-navigation assert dateformat gps-distance lodash react-native-easy-grid react-redux redux string-format react-native-busy-indicator react-native-radio-buttons
$ react-native link

Open 'android' folder in Android Studio:
# Don't updated Gradle Android plugin to 3.0.0 and Gradle to 4.1

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
org.gradle.jvmargs=-Xmx2048M

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
