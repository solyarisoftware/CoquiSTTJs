# Some tests

## Latency comparison tests

The bash script `testLatencies.sh` compares elapsed times 
of transcript of the audio file `./audio/4507-16021-0012.wav` 
(corresponding to text *why should one halt on the way*), in 2 cases:

- using a bash script running the CLI `stt` official client 
- using the nodejs native client [stt.js](sttjs.js)

```
$ cd tests
$ testLatencies.sh 
```

```
#
# testLatencies.sh
# test elapsed time / resopurce (using /urs/bin/time)
# and CPU cores usage (using pidstat) in different cases
#


#
# Test 1: stt cli command
#

Linux 5.8.0-53-generic (giorgio-HP-Laptop-17-by1xxx) 	17/05/2021 	_x86_64_	(8 CPU)
Loading model from file ../models/coqui-stt-0.9.3-models.pbmm
TensorFlow: v2.3.0-6-g23ad988fcde
 Coqui STT: v0.10.0-alpha.4-78-g1f3d2dab
2021-05-17 12:08:31.668756: I tensorflow/core/platform/cpu_feature_guard.cc:142] This TensorFlow binary is optimized with oneAPI Deep Neural Network Library (oneDNN)to use the following CPU instructions in performance-critical operations:  AVX2 FMA
To enable them in other operations, rebuild TensorFlow with the appropriate compiler flags.
Loaded model in 0.0162s.
Loading scorer from files ../models/coqui-stt-0.9.3-models.scorer
Loaded scorer in 0.000317s.
Running inference.

12:08:31      UID       PID    %usr %system  %guest   %wait    %CPU   CPU  Command
12:08:32     1000     23714  154,00   58,00    0,00    0,00  212,00     2  stt
experience proves this
Inference took 1.081s for 1.975s audio file.

Average:     1000     23714  154,00   58,00    0,00    0,00  212,00     -  stt
	Command being timed: "pidstat 1 -u -e stt --model ../models/coqui-stt-0.9.3-models.pbmm --scorer ../models/coqui-stt-0.9.3-models.scorer --audio ../audio/2830-3980-0043.wav"
	User time (seconds): 0.00
	System time (seconds): 0.00
	Percent of CPU this job got: 0%
	Elapsed (wall clock) time (h:mm:ss or m:ss): 0:01.34
	Average shared text size (kbytes): 0
	Average unshared data size (kbytes): 0
	Average stack size (kbytes): 0
	Average total size (kbytes): 0
	Maximum resident set size (kbytes): 2244
	Average resident set size (kbytes): 0
	Major (requiring I/O) page faults: 0
	Minor (reclaiming a frame) page faults: 112
	Voluntary context switches: 3
	Involuntary context switches: 0
	Swaps: 0
	File system inputs: 0
	File system outputs: 0
	Socket messages sent: 0
	Socket messages received: 0
	Signals delivered: 0
	Page size (bytes): 4096
	Exit status: 0

wait few seconds..


#
# Test 2: node stt.js
#

Linux 5.8.0-53-generic (giorgio-HP-Laptop-17-by1xxx) 	17/05/2021 	_x86_64_	(8 CPU)
TensorFlow: v2.3.0-6-g23ad988fcde
 Coqui STT: v0.10.0-alpha.4-78-g1f3d2dab
2021-05-17 12:08:37.891352: I tensorflow/core/platform/cpu_feature_guard.cc:142] This TensorFlow binary is optimized with oneAPI Deep Neural Network Library (oneDNN)to use the following CPU instructions in performance-critical operations:  AVX2 FMA
To enable them in other operations, rebuild TensorFlow with the appropriate compiler flags.
Model { _impl: SwigProxy {} }

pbmm                 : ../models/coqui-stt-0.9.3-models.pbmm
scorer               : ../models/coqui-stt-0.9.3-models.scorer
elapsed              : 11ms


12:08:37      UID       PID    %usr %system  %guest   %wait    %CPU   CPU  Command
12:08:38     1000     23751  111,00   10,00    0,00    0,00  121,00     7  node
audio file           : ../audio/2830-3980-0043.wav
transcript           : experience proves this
elapsed              : 1058ms

free model elapsed   : 6ms


Average:     1000     23751  111,00   10,00    0,00    0,00  121,00     -  node
	Command being timed: "pidstat 1 -u -e node ../stt.js ../models/coqui-stt-0.9.3-models.pbmm ../models/coqui-stt-0.9.3-models.scorer ../audio/2830-3980-0043.wav"
	User time (seconds): 0.00
	System time (seconds): 0.00
	Percent of CPU this job got: 0%
	Elapsed (wall clock) time (h:mm:ss or m:ss): 0:01.17
	Average shared text size (kbytes): 0
	Average unshared data size (kbytes): 0
	Average stack size (kbytes): 0
	Average total size (kbytes): 0
	Maximum resident set size (kbytes): 2360
	Average resident set size (kbytes): 0
	Major (requiring I/O) page faults: 0
	Minor (reclaiming a frame) page faults: 113
	Voluntary context switches: 3
	Involuntary context switches: 0
	Swaps: 0
	File system inputs: 0
	File system outputs: 0
	Socket messages sent: 0
	Socket messages received: 0
	Signals delivered: 0
	Page size (bytes): 4096
	Exit status: 0

```


## httpServer crash test

client side:

```
$ clientNearRequests.sh
```

server side:

```
$ node httpServer.js  --model=../models/coqui-stt-0.9.3-models.pbmm --scorer=../models/coqui-stt-0.9.3-models.scorer
```
```
1622822286076 package coquisttjs version 0.0.14, Coqui STT version 0.10.0-alpha.6
1622822286079 Model name: ../models/coqui-stt-0.9.3-models.pbmm
1622822286079 Scorer name: ../models/coqui-stt-0.9.3-models.scorer
1622822286079 HTTP server port: 3000
1622822286079 HTTP server path: /transcript
1622822286081 server httpServer.js running at http://localhost:3000
1622822286081 endpoint http://localhost:3000/transcript
1622822286082 press Ctrl-C to shutdown
1622822286082 ready to listen incoming requests
1622822288388 request POST 1622822288388 speechBuffer
TensorFlow: v2.3.0-6-g23ad988fcde
 Coqui STT: v0.10.0-alpha.4-78-g1f3d2dab
2021-06-04 17:58:08.468751: I tensorflow/core/platform/cpu_feature_guard.cc:142] This TensorFlow binary is optimized with oneAPI Deep Neural Network Library (oneDNN)to use the following CPU instructions in performance-critical operations:  AVX2 FMA
To enable them in other operations, rebuild TensorFlow with the appropriate compiler flags.
1622822288567 request POST 1622822288567 speechBuffer
TensorFlow: v2.3.0-6-g23ad988fcde
 Coqui STT: v0.10.0-alpha.4-78-g1f3d2dab
1622822288767 request POST 1622822288767 speechBuffer
TensorFlow: v2.3.0-6-g23ad988fcde
 Coqui STT: v0.10.0-alpha.4-78-g1f3d2dab
1622822288979 request POST 1622822288979 speechBuffer
TensorFlow: v2.3.0-6-g23ad988fcde
 Coqui STT: v0.10.0-alpha.4-78-g1f3d2dab
1622822289183 request POST 1622822289183 speechBuffer
TensorFlow: v2.3.0-6-g23ad988fcde
 Coqui STT: v0.10.0-alpha.4-78-g1f3d2dab
1622822289380 request POST 1622822289380 speechBuffer
1622822289592 request POST 1622822289592 speechBuffer
TensorFlow: v2.3.0-6-g23ad988fcde
 Coqui STT: v0.10.0-alpha.4-78-g1f3d2dab
1622822289798 request POST 1622822289798 speechBuffer
TensorFlow: v2.3.0-6-g23ad988fcde
 Coqui STT: v0.10.0-alpha.4-78-g1f3d2dab
1622822290000 request POST 1622822290000 speechBuffer
TensorFlow: v2.3.0-6-g23ad988fcde
 Coqui STT: v0.10.0-alpha.4-78-g1f3d2dab
1622822290214 request POST 1622822290214 speechBuffer
TensorFlow: v2.3.0-6-g23ad988fcde
 Coqui STT: v0.10.0-alpha.4-78-g1f3d2dab
1622822290430 request POST 1622822290430 speechBuffer
1622822290634 request POST 1622822290634 speechBuffer
1622822290830 request POST 1622822290830 speechBuffer
TensorFlow: v2.3.0-6-g23ad988fcde
 Coqui STT: v0.10.0-alpha.4-78-g1f3d2dab
1622822291040 request POST 1622822291040 speechBuffer
TensorFlow: v2.3.0-6-g23ad988fcde
 Coqui STT: v0.10.0-alpha.4-78-g1f3d2dab
Segmentation fault (core dumped)
```

---

[top](#) | [home](../README.md)
