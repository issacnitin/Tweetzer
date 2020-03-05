#! /usr/bin/sudo

RED='\033[0;35m'
NC='\033[0m' # No Color

git clean -xdf
cd backend
sudo echo "127.0.0.1 tweetzer.com www.tweetzer.com" >> /etc/hosts
printf "${RED}Open browser, go to tweetzer.com 5 minutes after the docker-compose logs has stabilized (I'm building frontend in docker)\n"
printf "Don't forget to delete the entry from /etc/hosts\n${NC}"
docker-compose up -d --build --force-recreate
