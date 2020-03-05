#! /usr/bin/sudo

sudo rm -rf ./temp/
cd backend
docker-compose up -d --build --force-recreate
sudo echo "127.0.0.1 tweetzer.com www.tweetzer.com" >> /etc/hosts
echo "Open browser, go to tweetzer.com"
echo "Don't forget to delete the entry from /etc/hosts"
