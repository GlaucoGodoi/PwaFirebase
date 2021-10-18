
#Compile and watch the library
osascript \
-e 'tell application "System Events"' \
-e 'keystroke "t" using command down' \
-e 'tell application "Terminal" to do script "npm run watch" in selected tab of the front window' \
-e 'end tell'

#Compile cloud functions
osascript \
-e 'tell application "System Events"' \
-e 'keystroke "t" using command down' \
-e 'tell application "Terminal" to do script "cd functions/ && npm run build" in selected tab of the front window' \
-e 'end tell'


#Start the firebase emulators
osascript \
-e 'tell application "System Events"' \
-e 'keystroke "t" using command down' \
-e 'tell application "Terminal" to do script "npm run start-emulators" in selected tab of the front window' \
-e 'end tell'

#Compile and watch the app in development mode
osascript \
-e 'tell application "System Events"' \
-e 'keystroke "t" using command down' \
-e 'tell application "Terminal" to do script "sleep 10" in selected tab of the front window' \
-e 'tell application "Terminal" to do script "npm run client:dev" in selected tab of the front window' \
-e 'end tell'
