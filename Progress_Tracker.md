### Version 0.3.3

## Solved bugs
3. Initial screen: Please make the buttons (New Follow, Continue Follow, Export data) bigger
5. Great that a researcher name is now required, but need a specific error message (like “Please enter name of researcher”)
14. Main screen: If don’t enter a time, get a generic error message. Please have the error message read,
“Please choose a start time”. Same for “Community” – error message should be, “Please choose the community”. And for Target; “Please choose the target”
12. SummaryScreen: Please make font bigger for chimp IDs, and rotate chimp IDs 180 degrees
7. FollowScreen: A suggestion - rather than display the actual GPS coordinates, display the error? Or an indication if there is a signal or not? --- "OK", "Not found" as GPS Status
11. SummaryScreen: arrivals screen shows all chimps, not specific to either Kasekela or Mitumba
10. List Follows in "Continue Follow by recent to oldest" ??

## Bugs In progress of being solved:
## SettingsScreen
4. Initial screen: The app crashes when try to switch from English to Swahili. Need to pass on local language state from this.props.screenProps to reflect on all strings globally in the app
## GPS:
1. GPS: it's still giving me only one location per follow. I noticed that when I first started the follow, it gave me coordinates on the main screen (very cool!), but then when I moved to the next interval, it said 'you are at 0,0'. I made sure to wait at least 15 minutes, but it never reported a location (either on the tablet or in the output file). --- rewrote the functions entirely. Added GPS Monitor screen.
2. GPS: the app always gives the same starting coordinates, and doesn't update after the specified number of minutes. --- Needs to be replicated.
13. I made sure I had a strong signal (outside), then started a follow at 11:00. At 11:15 I moved the unit several meters, then again at 11:30 before stopping the follow. See the attached output – the location never changes, and it seems to be trying to take several readings per interval.
## FollowScreen
15. Entering foods: When I choose a start time, food name or part name, the choice remains selected for a
few seconds, then reverts to the default (e.g. “Chagua Chakula”). Not noticed.
16. Entering other species - Same problem as with the foods – fields keep resetting. Not noticed. How to replicate?
6. FollowScreen: Sometimes the Icons are too big, pushing the females off the edge of the screen. Fixed when app is killed and restarted. --- which icons?
10. Summary Screen – crashes when press on a time to return to. FollowScreen -> SummaryScreen -> FollowScreen crashes app.

## Bugs yet to be solved:
8. FollowScreen: There are still lots of issues when going back to previous intervals to change arrival data
For example, if the user realizes that he previously mis-identified a chimp, he’ll need to go back and change it. For the chimp that was previously marked as present, the user can now choose the null arrival icon (great!), but there is no null option in the certainty column like there is for 5m, JK and Groom. Then, when the user navigates to the next interval, that chimp is still listed as being there (although the exported data seem correct).
9. FollowScreen: Also, when the user navigates back to previous intervals, and then forward again, 5m and JK data (but not grooming) are lost (they appear briefly, then disappear)

### Version 0.3.2

## Solved:
1. React Native, React-Navigation upgraded to latest versions. Deprecated components fixed. Data flow restored.
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
