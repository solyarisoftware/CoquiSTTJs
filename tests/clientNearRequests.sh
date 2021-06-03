#!/usr/bin/env bash

sleepTime=0.5

# call httpServer every N msecs for 40 times

for i in {1..40}; do

  # sleep for N msecs
  sleep $sleepTime

  # sleep for a number of msecs in range 0.010-0.500  
  #sleepTime=`awk 'BEGIN { printf("%.5f", 0.01 + (rand() * 0.1)) }'`
  #sleep $sleepTime

  clientPOST.sh &

done
