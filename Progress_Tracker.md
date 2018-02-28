### Version 0.3.5

## Next development backlog:
1. Use react-native-mixin: This will eliminate a lot of hard work tracking down bugs, such as crashes caused by timeouts firing after a component has been unmounted. http://facebook.github.io/react-native/docs/timers.html
2. Use Redux for managing follows

### Version 0.3.4

## Questions:

## Solved Bugs
1. GPS reports multiple records per interval
2. Output formatting for date and time columns:
  o   Export-follow.csv
  §  FOL_date column: Please output just the date, not the time
  §  FOL_time_begin: Please convert to English time

  o   Export-food.csv
  §  FB_FOL_date: Please output the date only, not the time
  §  FB_begin_feed_time & FB_end_feed_time: Please convert to English time

  o   Export-other-species.csv
  §  Same fixes as in Export-food.csv

## Bugs in progress
8. FollowScreen: There are still lots of issues when going back to previous intervals to change arrival data.
For example, if the user realizes that he previously mis-identified a chimp, he’ll need to go back and change it. For the chimp that was previously marked as present, the user can now choose the null arrival icon (great!), but there is no null option in the certainty column like there is for 5m, JK and Groom. Then, when the user navigates to the next interval, that chimp is still listed as being there (although the exported data seem correct). --- Added Null in C -- Make manual corrections in following screen if something is corrected in the previous screen.
11. EndFollow button doesn't end it. All follows show up in Continue Follow screen. EndTime is not being recorded.
7. Summary Screen: display foods and other species
10. Update corrections in previous intervals.
3. Give unique Ids for all elements in the database so that it can be updated. -- Rewrite previous entries in Realm

## Bugs Pipeline: to be solved in next version
9. FollowScreen: Also, when the user navigates back to previous intervals, and then forward again, 5m and JK data (but not grooming) are lost (they appear briefly, then disappear)
6. FollowScreen: Sometimes the Icons are too big, pushing the females off the edge of the screen. Fixed when app is killed and restarted. --- which icons? >> The chimp names and columns
4. Settings: Switch from English to Swahili. Need to pass on local language state from this.props.screenProps to reflect on all strings globally in the app

### Version 0.3.3.3

## Questions:

2. List Follows in "Continue Follow is now listed by most recent to oldest". Is this a good idea? >> Yes
3. 15. Entering foods: When I choose a start time, food name or part name, the choice remains selected for a
few seconds, then reverts to the default (e.g. “Chagua Chakula”). Not noticed. -- Solved
16. Entering other species - Same problem as with the foods – fields keep resetting. Not noticed. How to replicate? -- solved

1. If [] shows the Chimp's status, what is the meaning of the column 'C'?
>>Column “C” indicates how “certain” the researcher is that the chimpanzee is present in the group. Sometimes the forest is so thick, or the group very spread out, that the researcher doesn’t know exactly who is there. So, a check mark indicates that a given chimp is definitely there. A dot means that the researcher thinks he/she might be there, but doesn’t know for sure. A blank indicates that the chimp is definitely NOT there.

6. FollowScreen: Sometimes the Icons are too big, pushing the females off the edge of the screen. Fixed when app is killed and restarted. --- which icons?
>>The chimp names and columns

7. Summary Screen – crashes when press on a time to return to. FollowScreen -> SummaryScreen -> FollowScreen crashes app. Solved partially to make sure the app doesn't crash. Are the follow details displayed as expected?
>>> Yes, the app no longer crashes, and navigates to the correct screen.
>>>I’d like to have foods and other species displayed on the summary screen, if possible

8. Follow Screen: When you navigate to the new interval, 5m, JK and G are supposed to be blank?
>>Yes please

## Solved bugs
3. Initial screen: Please make the buttons (New Follow, Continue Follow, Export data) bigger
5. Great that a researcher name is now required, but need a specific error message (like “Please enter name of researcher”)
14. Main screen: If don’t enter a time, get a generic error message. Please have the error message read,
“Please choose a start time”. Same for “Community” – error message should be, “Please choose the community”. And for Target; “Please choose the target”
12. SummaryScreen: Please make font bigger for chimp IDs, and rotate chimp IDs 180 degrees
7. FollowScreen: A suggestion - rather than display the actual GPS coordinates, display the error? Or an indication if there is a signal or not? --- "OK", "Not found" as GPS Status
11. SummaryScreen: arrivals screen shows all chimps, not specific to either Kasekela or Mitumba

## Bugs In progress of being solved:
## SettingsScreen
4. Initial screen: The app crashes when try to switch from English to Swahili. Need to pass on local language state from this.props.screenProps to reflect on all strings globally in the app
## GPS:
1. GPS: it's still giving me only one location per follow. I noticed that when I first started the follow, it gave me coordinates on the main screen (very cool!), but then when I moved to the next interval, it said 'you are at 0,0'. I made sure to wait at least 15 minutes, but it never reported a location (either on the tablet or in the output file). --- rewrote the functions entirely. Added GPS Monitor screen.
2. GPS: the app always gives the same starting coordinates, and doesn't update after the specified number of minutes. --- Needs to be replicated.
13. I made sure I had a strong signal (outside), then started a follow at 11:00. At 11:15 I moved the unit several meters, then again at 11:30 before stopping the follow. See the attached output – the location never changes, and it seems to be trying to take several readings per interval.

## Bugs yet to be solved:
8. FollowScreen: There are still lots of issues when going back to previous intervals to change arrival data
For example, if the user realizes that he previously mis-identified a chimp, he’ll need to go back and change it. For the chimp that was previously marked as present, the user can now choose the null arrival icon (great!), but there is no null option in the certainty column like there is for 5m, JK and Groom. Then, when the user navigates to the next interval, that chimp is still listed as being there (although the exported data seem correct).
9. FollowScreen: Also, when the user navigates back to previous intervals, and then forward again, 5m and JK data (but not grooming) are lost (they appear briefly, then disappear)

### Version 0.3.2

## Solved:
1. React Native, React-Navigation upgraded to latest versions. Deprecated components fixed. Data flow restored.

app
    android {
        compileSdkVersion 25
        buildToolsVersion "25.0.1"

        defaultConfig {
            applicationId "com.jgidigitiki"
            minSdkVersion 22
            targetSdkVersion 25

gradle.properties
    android.useDeprecatedNdk=true
    MYAPP_RELEASE_STORE_FILE=digitiki-release-key.keystore
    MYAPP_RELEASE_KEY_ALIAS=digitiki-key
    MYAPP_RELEASE_STORE_PASSWORD=digitiki
    MYAPP_RELEASE_KEY_PASSWORD=digitiki

    org.gradle.jvmargs=-Xmx1536M

Error: node_modules/.../RNZipArchivePackage.java:20: error: method does not override or implement a method from a supertype
  @Override
-- Remove Override on line 19

To find the latest gradle:
buildscript {
    repositories {
        google()
        jcenter()
    }

    dependencies {
        classpath 'com.android.tools.build:gradle:3.0.1'
    }
}

2. Added Version number to MenuScreen. To keep track of which version is being tested.
3. SpeciesNumber selection crashed the app
5. End Follow button sometimes went missing
6. Settings button on Homescreen went missing
7. Added "Msoke", "maji" to food-list and food-part list
8. "Continue" button in following chimps - a single vertical line.
9. Researcher name is required to start a NewFollow.

## In progress:
1. Working on adding Log to catch app crashes and isolate GPS bug. If GPS lock isn't found in the first interval, the state never changes. Tested on multiple devices to see if it was a hardware issue or software. I see that I often lose the values while testing indoors. My hypothesis now is that it is a software issue. Trying the following: Added Location to the FollowScreen. You can choose intervals at which Location is recorded. It is 15 min by default. Can choose 15sec for debugging purposes. Tries again and again until lock is found. Needs extensive testing. At first -- the values are 0,0. If lock is not found, the values are x, x until a lock is found. If GPS is lost, then value again becomes x,x.

2. Disable multiple click of "Begin" on New FollowScreen.

3. Exploring Realm re-write of previous entries for error correction. -- Bug: Once a chimp is entered on a time period, but if a researcher realizes that the chimp is actually not there (or maybe just hit the wrong button); when they click the empty box to indicate the chimp is not there....the chimp is still shown with 5m/nearest neighbor options, and shows up in subsequent scans (just with a blank arrival/departure box) near the top with present chimps. Instead, of course, once the blank box is chosen, it should revert back to the default, absent condition and not still be there in future scans.

4. Trying to isolate bug from Logs -- Bug: A reminder from when you talked with Madua previously about when staff enter data from earlier scans when they forgot sometime (maybe within 5 meters), sometimes the data is not preserved when they move forward. I wasn't able to replicate this error just now, but apparently you and Madua discussed this already.

5. Styles on MenuScreen go missing sometimes.

## Questions:
1. BAL and FIC not found: BAL and FIC should be assigned 'female'; I already mentioned this update to everyone for the BIO table. Also, since the staff call her "Ficma", not Facma as in the bio table, the bio table should probably be changed to the staff's preferred name to keep things consistent as she grows up.

2. I don't see wadudu wengine. And kumbi-kumbi is already on food-list. --- Bug: Onto foods, and specifically the food part list, please add "kumbi kumbi" (I guess this is appropriate when eating insana) and "wadudu" (currently there is wadudu wengine but they also want just a simple wadudu option).

3. NewFollowScreen -- time -- displays every possible time. If the system clock is set to the local time, then it is possible to suggest a smaller range of time options?

### Version 0.3.1

## TODO: Bug List

1) BAL and FIC should be assigned 'female'; I already mentioned this update to everyone for the BIO table. Also, since the staff call her "Ficma", not Facma as in the bio table, the bio table should probably be changed to the staff's preferred name to keep things consistent as she grows up.

2) On the "New Follow" screen, researcher name is currently optional. Sometimes people forget to enter; it would be good to make this required, like the other inputs in that screen. I don't see a reason why it wouldn't ever be entered.

3) A reminder from when you talked with Madua previously about when staff enter data from earlier scans when they forgot sometime (maybe within 5 meters), sometimes the data is not preserved when they move forward. I wasn't able to replicate this error just now, but apparently you and Madua discussed this already.

4) In previous versions of the tablet, there was an arrival/departure image option for "continue" (just the vertical line down the middle). It's missing in the current version as something staff can select, but Madua wants it back so that if staff mark someone as gone, but then perhaps they realize that the individual in fact did not leave (or they make a mistake), they can return to that time period and change it from, for example, departure to 'present/continue'. And then that chimp will continue in all following scans.

5) Once a chimp is entered on a time period, but if a researcher realizes that the chimp is actually not there (or maybe just hit the wrong button); when they click the empty box to indicate the chimp is not there....the chimp is still shown with 5m/nearest neighbor options, and shows up in subsequent scans (just with a blank arrival/departure box) near the top with present chimps. Instead, of course, once the blank box is chosen, it should revert back to the default, absent condition and not still be there in future scans.

6) Sometimes, staff receive a message, "Unfortunately, JGI DigiTiki has stopped." They click OK and it brings them to the tablet home screen. They can continue if they know how to search for the previous follows, and probably should be taught this, all of them, but I'm guessing this is a standard response of the program when it encounters some bug/error and quits automatically. The data is still there, it just seems like there is some error causing it to quiet unexpectedly. Not sure what behavior is causing it; they say they are just collecting data normally. This is more an FYI, but perhaps over time we can isolate the bug. In the meantime, I've told Madua, all staff should be taught to find and locate follows that have ended.

7) Onto foods, and specifically the food part list, please add "kumbi kumbi" (I guess this is appropriate when eating insana) and "wadudu" (currently there is wadudu wengine but they also want just a simple wadudu option).

8) Please add "maji" in both food and parts lists, for when they drink water.

9) Please add "Msoke" in both lists too. It's what they are eating when the palm fibers fall to the ground...I'm not sure exactly what the "food part" is, but they'll carry it around and eat it, quite a bit. Pith might be appropriate, but maybe it deserves it's own food part as well. Staff seem to want one.

10) Unrelated, on September 3 2017, the Mitumba times were entered as English times, not Swahili times, in a follow of FS. (For example, instead of starting at 8:15 J, they started at 2:15 A). But Madua has told them to correct this in the future, and they might have already fixed it in their tablets.

11) GPS error. It doesn't get saved. Need automatic recording. Record the first 15 min then doesn't write to database.
