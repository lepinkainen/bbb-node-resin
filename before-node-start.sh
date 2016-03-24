#!/bin/bash

#use this script to launch anything you need before your node.js project launches.
echo "Starting Home automation server"

echo "Starting 1-wire"
mkdir -p /mnt/1wire
/etc/init.d/owserver start
owfs

echo "Starting mosquitto"
/etc/init.d/mosquitto start

echo "Starting dropbear"
#Set the root password as root if not set as an ENV variable
export PASSWD=${PASSWD:=root}
#Set the root password
echo "root:$PASSWD" | chpasswd
#Spawn dropbear
dropbear
