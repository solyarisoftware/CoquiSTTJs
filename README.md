# CoquiSTTJs
Coqui STT nodejs binding usage examples

Coqui STT runtime transcript NodeJs native client.
Some examples and tests. 

## What's Coqui STT?

[Coqui STT](https://github.com/coqui-ai/STT) is an open-source Speech-To-Text engine.
Documentation for installation, usage, and training models are available on [Coqui STT documentation](https://stt.readthedocs.io/en/latest/).


## Coqui STT run-time transcript, using NodeJs

You want to access Coqui STT speech to text runtime transcription from a well formatted WAV file, using NodeJs.
I tested two options:

1. Spawning, from your NodeJs main thread, an external Coqui STT command line program.
   That's the simplest, dumb and slow way in terms of performances.
   In general, spawning an external process, catching his stdout is a trivial approach, 
   but applicable all times you do not have better inter process communication options. 

   Example: [deepSpeechTranscriptSpawn.js](deepSpeechTranscriptSpawn.js).

2. Using Coqui STT native NodeJs client interface. 
   That's a more performant way.
 
   Example: [deepSpeechTranscriptNative.js](deepSpeechTranscriptNative.js).
 
   The example is very raugh, presuming the audio file is a "well formatted" WAV file. 
   The audio file is just read in memory and the deepspeech `model.stt()` API is called.
   [Official examples](https://github.com/mozilla/Coqui STT-examples#javascript) repo
   contains audio examples that show how to validate WAV, 
   and speeech processing from streaming / in-memory buffers.

### Coqui STT official native NodeJs API

- [Native client source code](https://github.com/coqui-ai/STT/tree/main/native_client/javascript)
- [API Documentation](https://stt.readthedocs.io/en/latest/NodeJS-API.html)
- [Usage Examples](https://github.com/coqui-ai/STT-examples#javascript)

### Wat's a well formatted WAV audio file?

Coqui STT requires a 16bit 16 KHz mono WAV input audio file.
To record such a file:
```
sudo apt install sox
sudo apt install mediainfo

rec -f S16_BE -r 16000 -c 1 my_recording.wav

mediainfo my_recording.wav
General
Complete name                            : my_recording.wav
Format                                   : Wave
File size                                : 64.0 KiB
Duration                                 : 2 s 48 ms
Overall bit rate mode                    : Constant
Overall bit rate                         : 256 kb/s

Audio
Format                                   : PCM
Format settings                          : Little / Signed
Codec ID                                 : 1
Duration                                 : 2 s 48 ms
Bit rate mode                            : Constant
Bit rate                                 : 256 kb/s
Channel(s)                               : 1 channel
Sampling rate                            : 16.0 kHz
Bit depth                                : 16 bits
Stream size                              : 64.0 KiB (100%)
```

## Install

1. Install Coqui STT

   ```bash
   # Create a virtual environment
   $ python3 -m venv venv-stt
   $ source venv-stt/bin/activate

   # Install 🐸STT
   $ python3 -m pip install -U pip
   $ python3 -m pip install stt

   # Download 🐸's pre-trained English models
   $ curl -LO https://github.com/coqui-ai/STT/releases/download/v0.9.3/coqui-stt-0.9.3-models.pbmm
   $ curl -LO https://github.com/coqui-ai/STT/releases/download/v0.9.3/coqui-stt-0.9.3-models.scorer

   # Download some example audio files
   $ curl -LO https://github.com/coqui-ai/STT/releases/download/v0.9.3/audio-0.9.3.tar.gz
   $ tar -xvf audio-0.9.3.tar.gz

   # Transcribe an audio file
   $ stt --model coqui-stt-0.9.3-models.pbmm --scorer coqui-stt-0.9.3-models.scorer --audio audio/2830-3980-0043.wav
   ```

2. Install this repo
   ```bash
   git clone https://solyarisoftware/deepspeeechjs && cd deepspeeechjs
   ```

3. Install the official Coqui STT npm package
   ```bash
   npm install deepspeech
   ```

## Run the test

The bash script `testLatencies.sh` compares elapsed times 
of transcript of the audio file `./audio/4507-16021-0012.wav` 
(corresponding to text *why should one halt on the way*), in 2 cases:

- using a bash script running the CLI `stt` official client 
- using the nodejs native client [stt.js](sttjs.js)

```
(venv-stt) $ testLatencies.sh
```
```

(venv-stt) $ testLatencies.sh

#
# testLatencies.sh
# test elapsed time / resopurce (using /urs/bin/time)
# and CPU cores usage (using pidstat) in different cases
#


#
# Test 1: stt cli command
#

Linux 5.8.0-53-generic (giorgio-HP-Laptop-17-by1xxx) 	14/05/2021 	_x86_64_	(8 CPU)
Loading model from file models/coqui-stt-0.9.3-models.pbmm
TensorFlow: v2.3.0-6-g23ad988fcde
 Coqui STT: v0.10.0-alpha.4-78-g1f3d2dab
2021-05-14 18:27:52.509167: I tensorflow/core/platform/cpu_feature_guard.cc:142] This TensorFlow binary is optimized with oneAPI Deep Neural Network Library (oneDNN)to use the following CPU instructions in performance-critical operations:  AVX2 FMA
To enable them in other operations, rebuild TensorFlow with the appropriate compiler flags.
Loaded model in 0.00898s.
Loading scorer from files models/coqui-stt-0.9.3-models.scorer
Loaded scorer in 0.000106s.
Running inference.

18:27:52      UID       PID    %usr %system  %guest   %wait    %CPU   CPU  Command
18:27:53     1000    164565  158,00   56,00    0,00    0,00  214,00     7  stt
experience proves this
Inference took 1.115s for 1.975s audio file.

Average:     1000    164565  158,00   56,00    0,00    0,00  214,00     -  stt
	Command being timed: "pidstat 1 -u -e stt --model models/coqui-stt-0.9.3-models.pbmm --scorer models/coqui-stt-0.9.3-models.scorer --audio audio/2830-3980-0043.wav"
	User time (seconds): 0.00
	System time (seconds): 0.00
	Percent of CPU this job got: 0%
	Elapsed (wall clock) time (h:mm:ss or m:ss): 0:01.35
	Average shared text size (kbytes): 0
	Average unshared data size (kbytes): 0
	Average stack size (kbytes): 0
	Average total size (kbytes): 0
	Maximum resident set size (kbytes): 2260
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

#
# Test 2: node stt
#

Linux 5.8.0-53-generic (giorgio-HP-Laptop-17-by1xxx) 	14/05/2021 	_x86_64_	(8 CPU)
TensorFlow: v2.3.0-6-g23ad988fcde
 Coqui STT: v0.10.0-alpha.4-78-g1f3d2dab
2021-05-14 18:27:58.763404: I tensorflow/core/platform/cpu_feature_guard.cc:142] This TensorFlow binary is optimized with oneAPI Deep Neural Network Library (oneDNN)to use the following CPU instructions in performance-critical operations:  AVX2 FMA
To enable them in other operations, rebuild TensorFlow with the appropriate compiler flags.

pbmm                 : models/coqui-stt-0.9.3-models.pbmm
scorer               : models/coqui-stt-0.9.3-models.scorer
elapsed              : 9ms


18:27:58      UID       PID    %usr %system  %guest   %wait    %CPU   CPU  Command
18:27:59     1000    164594  114,00    8,00    0,00    0,00  122,00     2  node
audio file           : audio/2830-3980-0043.wav
transcript           : experience proves this
elapsed              : 1110ms

free model elapsed   : 10ms


Average:     1000    164594  114,00    8,00    0,00    0,00  122,00     -  node
	Command being timed: "pidstat 1 -u -e node stt models/coqui-stt-0.9.3-models.pbmm models/coqui-stt-0.9.3-models.scorer audio/2830-3980-0043.wav"
	User time (seconds): 0.00
	System time (seconds): 0.00
	Percent of CPU this job got: 0%
	Elapsed (wall clock) time (h:mm:ss or m:ss): 0:01.23
	Average shared text size (kbytes): 0
	Average unshared data size (kbytes): 0
	Average stack size (kbytes): 0
	Average total size (kbytes): 0
	Maximum resident set size (kbytes): 2260
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


## Note 

IMPORTANT: unfortunately npm package `deepspeech` cause a crash using node version 16.0.0.
See [issue](https://github.com/mozilla/DeepSpeech/issues/3642).
To run this project you have to downgrade installed Node version. 
By example I had success with Node version 14.16.1.


## Changelog

- 0.0.3 test script testPerformances.sh updated 


## To do

- The project is in a very draft stage.
- Add a better high-level API interface. E.g. including metadata as parameters
- Add a (web) server architectue. 
  See: [How to use DeepSpeech for a text-to-speech server (in NodeJs)](https://discourse.mozilla.org/t/how-to-use-deepspeech-for-a-text-to-speech-server-in-nodejs/79636/2) 


## License

MIT (c) Giorgio Robino 

