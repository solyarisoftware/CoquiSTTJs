#!/bin/bash

echo 
echo 'testPerformances.sh'
echo 'test elapsed time / resopurce (using /urs/bin/time)'
echo 'and CPU cores usage (using pidstat) in different cases'

echo
echo 'Test 1: deepspeech cli command'
echo

deepspeech_cli.sh 

sleep 5

echo
echo 'Test 2: node deepSpeechTranscriptSpawn'
echo

/usr/bin/time --verbose pidstat 1 -u -e node deepSpeechTranscriptSpawn.js 

sleep 5

echo
echo 'Test 3: node deepSpeechTranscriptNative'
echo

/usr/bin/time --verbose pidstat 1 -u -e node deepSpeechTranscriptNative.js

