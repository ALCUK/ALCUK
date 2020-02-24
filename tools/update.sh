(update.sh)
#!/bin/bash
echo "====PULL EZSET===="
cd ./../
git pull
echo "====ENV SETTING===="
export DATABASE_URI=mongodb://localhost:27017/ezset
export PORT=5000
export SOCKET_PORT=5050
export JWT_SECRET=somesecretwowowowokasjdk
echo " DATABASE_URI : $DATABASE_URI"
echo " PORT : $PORT"
echo " SOCKET_PORT : $SOCKET_PORT"
echo " JWT_SECRET : $JWT_SECRET"
echo "====start service===="
cd ./frontend
yarn install
yarn build
cd ./../backend
yarn install
yarn build
yarn start
echo "====================="