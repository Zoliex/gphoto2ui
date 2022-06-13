while true
do
pkill -f gphoto2
node /home/pi/gphoto2ui/index.js
sleep 1
done