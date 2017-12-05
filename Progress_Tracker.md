### Version 0.3.2

## Solved:
1. React Native, React-Navigation upgraded to latest versions. Deprecated components fixed. Data flow restored.
2. Added Version number to MenuScreen. Needs to be updated every time a new version is out.
3. speciesNumbers was not undefined
4. Food selection crashed the app
5. End Follow button sometimes went missing
6. Settings button on Homescreen went missing
7. Added "Msoke", "maji" to food-list and food-part list
8. "Continue" button in following chimps - a single vertical line.
9. Researcher name is required to start a NewFollow.

## In progress:
1. Working on adding Log. To catch app crashes and isolate GPS bug: Added Location to the FollowScreen. You can choose intervals at which Location is recorded. It is 15 min by default. Can choose 15sec for debugging purposes.

If GPS lock isn't found in the first interval, the state never changes. This maybe because Timeout is not happening. If a GPS lock is found, then the GPS location is recorded every interval. 

2. Disable multiple press of "Begin" on New FollowScreen
3. NewFollowScreen -- time -- display only now?
4. I don't see wadudu wengine. And kumbi-kumbi is already on food-list. --- Bug: Onto foods, and specifically the food part list, please add "kumbi kumbi" (I guess this is appropriate when eating insana) and "wadudu" (currently there is wadudu wengine but they also want just a simple wadudu option).
5. Exploring Realm re-write of previous entries. -- Bug: Once a chimp is entered on a time period, but if a researcher realizes that the chimp is actually not there (or maybe just hit the wrong button); when they click the empty box to indicate the chimp is not there....the chimp is still shown with 5m/nearest neighbor options, and shows up in subsequent scans (just with a blank arrival/departure box) near the top with present chimps. Instead, of course, once the blank box is chosen, it should revert back to the default, absent condition and not still be there in future scans.
7. Trying to isolate bug from Logs -- A reminder from when you talked with Madua previously about when staff enter data from earlier scans when they forgot sometime (maybe within 5 meters), sometimes the data is not preserved when they move forward. I wasn't able to replicate this error just now, but apparently you and Madua discussed this already.

## Questions:
- BAL and FIC not found: BAL and FIC should be assigned 'female'; I already mentioned this update to everyone for the BIO table. Also, since the staff call her "Ficma", not Facma as in the bio table, the bio table should probably be changed to the staff's preferred name to keep things consistent as she grows up.

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
