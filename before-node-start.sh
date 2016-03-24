#!/bin/bash

#use this script to launch anything you need before your node.js project launches.
echo "Starting Home automation server"

echo "Starting 1-wire"
mkdir -p /mnt/1wire
/etc/init.d/owserver start
owfs

echo "Starting mosquitto"
/etc/init.d/mosquitto start
