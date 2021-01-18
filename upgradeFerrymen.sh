#!/bin/bash

ssh uibot@centos "cd /opt/deploy/ferrymen && git pull && ./stop.sh && ./start.sh"
