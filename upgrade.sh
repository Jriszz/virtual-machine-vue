#!/bin/bash
npm run build && tar -zcvf dist.tgz dist && rm -rf dist && scp dist.tgz uibot@centos:/opt/deploy && rm -f dist.tgz
ssh uibot@centos "cd /opt/deploy && ./upgrade-user-center-ui.sh"

