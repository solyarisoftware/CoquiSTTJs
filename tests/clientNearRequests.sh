#!/usr/bin/env bash

sleepTime=0.500
times=40

# call httpServer every N msecs for 40 times

for i in $( seq 1 $times ); do


  clientPOST.sh &

  # sleep for N msecs
  sleep $sleepTime

  # sleep for a number of msecs in range 0.010-0.500  
  #sleepTime=`awk 'BEGIN { printf("%.5f", 0.01 + (rand() * 0.1)) }'`
  #sleep $sleepTime

done

wait < <(jobs -p)
echo
echo "done ($i requests)"
echo
