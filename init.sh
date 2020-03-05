#! /usr/bin/sudo

RED='\033[0;35m'
NC='\033[0m' # No Color

sudo rm -rf ./temp/
cd backend
sudo echo "127.0.0.1 tweetzer.com www.tweetzer.com" >> /etc/hosts
printf "${RED}Open browser, go to tweetzer.com once the docker-compose logs has stabilized\n"
printf "Don't forget to delete the entry from /etc/hosts\n${NC}"
docker-compose up -d --build --force-recreate
