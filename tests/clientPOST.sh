#!/bin/bash 

ipaddress="localhost"
port=3000

#speechFile="../audio/2830-3980-0043.pcm"
speechFile="../audio/2830-3980-0043.wav"
model="coqui-stt-0.9.3-models.pbmm"
scorer="coqui-stt-0.9.3-models.scorer"

# get unix timestamp in milliseconds, and use it as request id
id=$(($(date +%s%N)/1000000))

#
# Request:
# POST request, with query string arguments  
# HTTP POST /transcript?id='12121212'&speech='filename.wav'& ...
# send audio WAV file as body
#
# Response:
# A JSON is expected 
#

# WARNING
# with curl, --data-urlencode and --data-binary can NOT coexists, See:
# https://stackoverflow.com/questions/62578702/mixing-curls-data-binary-and-the-ability-to-encode-url-search-params 
# https://stackoverflow.com/questions/296536/how-to-urlencode-data-for-curl-command/298258

quesryArguments="id=$id&model=$model&scorer=$scorer"

curl -s \
-X POST \
-H "Accept: application/json" \
-H "Content-Type: audio/wav" \
--data-binary "@$speechFile" \
http://$ipaddress:$port/transcript?$queryArguments \
| python3 -m json.tool

