## OAuth Integration App

This is an app that integrates OAuth2 flow into a react native app through the
use of the React-Native-App-Auth package that should be compatible with both
android and ios. You can recreate this on your own by following these directions:

Requirements:

react-native-cli
android studio/xcode

From your terminal, run `react-native init <your project name>`, then
`cd <your project name>` and run `yarn add react-native-app-auth` then
`react-native link react-native-app-auth` Then follow the instructions on the
[react-native-app-auth](https://github.com/FormidableLabs/react-native-app-auth)
readme to properly set up your app. They have been translated below for your
convenience.

### Android:
1. Make sure the Google Maven is in your `android/build.gradle` files
```
repositories {
  google()
}
```

2. Make sure the appcompat version in android/app/build.gradle matches the one
expected by AppAuth
```
dependencies {
  compile "com.android.support:appcompat-v7:25.3.1"
}
```

3. Update the `compileSdkVersion` to 25 if it's lower than that
```
android {
  compileSdkVersion 25
}
```

4. To capture the authorization redirect, add the following property to the
defaultConfig in `android/app/build.gradle`
```
android {
  defaultConfig {
    manifestPlaceholders = [
      appAuthRedirectScheme: '<your redirect server>'
    ]
  }
}
```
When finished, it should look something like this:
```
...
android {
    compileSdkVersion rootProject.ext.compileSdkVersion

    defaultConfig {
        ...
        versionName "1.0"
        ndk {
            abiFilters "armeabi-v7a", "x86"
        }
        manifestPlaceholders = [
          appAuthRedirectScheme: 'com.oktapreview.dev-846863'
        ]
    }
...
```

5. Upgrade the version of Gradle by either opening the project in Android Studio
and performing the suggested upgrade, or by updating the last line of your
`android/gradle/wrapper` file to include version 4.4
```
distributionUrl=https\://services.gradle.org/distributions/gradle-4.4-all.zip
```
### iOS:
1. Use CocoaPods to install AppAuth dependencies. Add a file called `Podfile`
to your `ios` folder. In this file, add the following lines:
```
platform :ios, '11.0'

target '<your app name (exactly as in app.json)>' do
 pod 'AppAuth', '>= 0.94'
end
```
From your terminal,
```
sudo gem install cocoapods
cd ios
pod install
```

2. If you intend to support iOS 10 and older, you need to define the supported redirect URL schemes in your `ios/Info.plist` as follows:
```
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLName</key>
    <string><your app redirect server></string>
    <key>CFBundleURLSchemes</key>
    <array>
      <string><oauth host url></string>
    </array>
  </dict>
</array>
```
It should look like this:
```
	<key>CFBundleIdentifier</key>
	<string>org.reactjs.native.example.$(PRODUCT_NAME:rfc1034identifier)</string>
	<key>CFBundleURLTypes</key>
	<array>
	  <dict>
	    <key>CFBundleURLName</key>
	    <string>com.oktapreview.dev-846863</string>
	    <key>CFBundleURLSchemes</key>
	    <array>
	      <string>dev-846863.oktapreview.com</string>
	    </array>
	  </dict>
	</array>
	<key>CFBundleInfoDictionaryVersion</key>
	<string>6.0</string>
```

3. Define openURL callback in AppDelegate
You need to retain the auth session, in order to continue the authorization
flow from the redirect. Add app authorization redirect flow lines to
`ios/<your app name>/AppDelegate.h` so it looks like this (the added lines have
a + next to them):
```
#import <UIKit/UIKit.h>
+ #import <AppAuth/Appauth.h>
+ #import "RNAppAuthAuthorizationFlowManager.h"

@interface AppDelegate : UIResponder <UIApplicationDelegate>

@property (nonatomic, strong) UIWindow *window;

@end

+ @interface AppDelegate()<RNAppAuthAuthorizationFlowManager> {
+   id <OIDAuthorizationFlowSession> _currentSession;
+ }
+ @end
```
Also these lines need to be added to `ios/<your app name>/AppDelegate.m` after
`@implementation AppDelegate`:
```
-(void)setCurrentAuthorizationFlowSession:(id<OIDAuthorizationFlowSession>)session {
   // retain session for further use
   _currentSession = session;
}
```
and these lines right before `@end`:
```
- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<NSString *, id> *)options {
  BOOL shouldOpenUrl = [_currentSession resumeAuthorizationFlowWithURL:url];
  _currentSession = nil;
  return shouldOpenUrl;
}
```

### Usage
 Refer to the [Supported Method Documentation](https://github.com/FormidableLabs/react-native-app-auth#user-content-supported-methods) for information about specific utilization, or use the
 very basic setup detailed in this repo. For specific providers, refer to the [Usage Documentation](https://github.com/FormidableLabs/react-native-app-auth#usage).
