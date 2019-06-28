#!/bin/bash
env_name=prod
if [[ "${env_name}" == "dev" ]]
then 
  env_name="apidev"
elif [[ "${env_name}" == "prod" ]]
then
  env_name="apiweb"
else
  echo "请选择部署环境：[dev or prod]"
  exit 1
fi

ssh ${env_name} "rm -rf /opt/deploy/user_center_ui/*"
scp -r dist/* ${env_name}:/opt/deploy/user_center_ui/
