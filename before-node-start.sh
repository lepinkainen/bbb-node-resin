#!/bin/bash

#Set the root password as root if not set as an ENV variable (for dropbear)
export PASSWD=${PASSWD:=root}
echo "root:$PASSWD" | chpasswd

echo "Starting supervisor"
supervisord -c /usr/local/etc/supervisord.conf
