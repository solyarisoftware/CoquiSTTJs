# CoquiSTTJs

Coqui STT runtime transcript NodeJs client. With usage examples and tests.


## What's Coqui STT?

[Coqui STT on github](https://github.com/coqui-ai/STT) is an open-source Speech-To-Text engine, project fork of Mozilla DeepSpeech.

Documentation for installation, usage, and training models are available on 
[Coqui STT documentation](https://stt.readthedocs.io/en/latest/).


## Coqui STT run-time transcript, using NodeJs

You want to access Coqui STT speech to text transcriptionm from nodeJs. 

This project supplies to nodeJs developers a simple [API interface](stt.js) on top of the Coqui STT native NodeJs binding. 
Here the current API javascript endpoints:

- `loadModel(modelFile, scorerFile)`
- `transcriptBuffer(audioBuffer, model)`
- `transcriptFile(audioFile, model)`
- `freeModel(model)`
 

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

2. Install CoquiSTTJs 

   ```bash
   git clone https://solyarisoftware/coquiSTTjs 
   ```

3. Install the official Coqui STT npm package

   ```bash
   cd coquiSTTjs
   npm install stt
   ```


## Notes 

- Some latency tests [here](tests/)!

- Current Coqui STT npm package solve the DeepSpeech 
  [issue](https://github.com/mozilla/DeepSpeech/issues/3642).
  In facts current npm package `deepspeech` cause a crash using node version 16.0.0.
  BTW I had success using DeeSpeech npm package with Node version 14.16.1.

- What's a well formatted WAV audio file?

  Coqui STT requires a 16bit 16 KHz mono WAV input audio file.
  ```
  sudo apt install sox
  sudo apt install mediainfo
  ```

  To record such a file:
  ```
  rec -f S16_BE -r 16000 -c 1 my_recording.wav
  ```
  ```
  mediainfo my_recording.wav
  ```
  ```
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

## Coqui STT official native NodeJs API

- [Native client source code](https://github.com/coqui-ai/STT/tree/main/native_client/javascript)
- [API Documentation](https://stt.readthedocs.io/en/latest/NodeJS-API.html)
- [Usage Examples](https://github.com/coqui-ai/STT-examples#javascript)


## To do

- The project is in a very draft stage.
- Complete the high-level API interface. E.g. including metadata as parameters
- Develop a (web) multiprocess or multithread server architecture. 
  See: [How to use DeepSpeech for a text-to-speech server (in NodeJs)](https://discourse.mozilla.org/t/how-to-use-deepspeech-for-a-text-to-speech-server-in-nodejs/79636/2) 


## License

MIT (c) Giorgio Robino 


---

[top](#)
