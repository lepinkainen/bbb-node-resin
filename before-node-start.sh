#!/bin/bash

#use this script to launch anything you need before your node.js project launches.
echo "Starting Home automation server"

#Set the root password as root if not set as an ENV variable
export PASSWD=${PASSWD:=root}
echo "root:$PASSWD" | chpasswd

echo "Starting supervisor"
/etc/init.d/supervisor start
