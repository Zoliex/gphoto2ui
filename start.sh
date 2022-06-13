cd /home/pi/gphoto2ui/
while true
do
pkill -f gphoto2
node ./index.js
sleep 1
done