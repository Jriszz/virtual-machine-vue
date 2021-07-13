#!/bin/bash
npm --version
node --version
pwd
if [ -d dist ]
then
  echo "删除原有的dist目录"
  rm -rf dist
fi

npm install
npm run build




version_no=$(date "+%Y%m%d%H%M%S")
echo "$version_no"

docker build . -t blueprint:88/blueprint/user-center-ui:latest -t blueprint:88/blueprint/user-center-ui:"$version_no"
# shellcheck disable=SC2181
if [ $? -ne 0 ]
then
  echo "docker build failed"
  exit 1
fi

docker login blueprint:88
# shellcheck disable=SC2181
if [ $? -ne 0 ]
then
  echo "docker login harbor failed"
  exit 1
fi

docker push blueprint:88/blueprint/user-center-ui:latest
docker push blueprint:88/blueprint/user-center-ui:"$version_no"
