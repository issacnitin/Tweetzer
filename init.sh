#! /usr/bin/sudo

cd backend
docker-compose up -d --build
sudo echo "127.0.0.1 tweetzer.com www.tweetzer.com" >> /etc/hosts
echo "Open browser, go to tweetzer.com"
echo "Please delete the entry from /etc/hosts"