cd frontend
npm install
npm run-script build
cd ../backend
docker-compose up --build

echo "127.0.0.1 tweetzer.com www.tweetzer.com" >> /etc/hosts

echo "Please delete the entry from /etc/hosts"