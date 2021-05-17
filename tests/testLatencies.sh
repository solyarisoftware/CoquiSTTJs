#!/bin/bash

echo
echo '#' 
echo '# testLatencies.sh'
echo '# test elapsed time / resopurce (using /urs/bin/time)'
echo '# and CPU cores usage (using pidstat) in different cases'
echo '#' 
echo

echo
echo '#' 
echo '# Test 1: stt cli command'
echo '#' 
echo

/usr/bin/time --verbose pidstat 1 -u -e \
  stt \
  --model \
  ../models/coqui-stt-0.9.3-models.pbmm \
  --scorer ../models/coqui-stt-0.9.3-models.scorer \
  --audio ../audio/2830-3980-0043.wav

echo
echo 'wait few seconds..'
echo
sleep 5

echo
echo '#' 
echo '# Test 2: node stt.js'
echo '#' 
echo
/usr/bin/time --verbose pidstat 1 -u -e \
  node ../stt.js \
  ../models/coqui-stt-0.9.3-models.pbmm \
  ../models/coqui-stt-0.9.3-models.scorer \
  ../audio/2830-3980-0043.wav

