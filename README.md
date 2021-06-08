# CoquiSTTJs

Coqui STT runtime transcript NodeJs client, including multithread (server) usage examples.

## What's Coqui STT?

[Coqui STT on github](https://github.com/coqui-ai/STT) is an open-source Speech-To-Text engine, project fork of Mozilla DeepSpeech.
Documentation for installation, usage, and training models are available on 
[Coqui STT documentation](https://stt.readthedocs.io/en/latest/).

Now, you want to access Coqui STT speech to text transcription, from nodeJs. 
Coqui STT official native NodeJs API:

- [Native client source code](https://github.com/coqui-ai/STT/tree/main/native_client/javascript)
- [API Documentation](https://stt.readthedocs.io/en/latest/NodeJS-API.html)
- [Usage Examples](https://github.com/coqui-ai/STT-examples#javascript)


## ✨ Coqui STT run-time decoding, using NodeJs

This project supplies to nodeJs developers a simple [API interface](stt.js) on top of the Coqui STT native NodeJs binding. 
Here the current API javascript endpoints:

- `loadModel(modelFile, scorerFile)`
- `transcriptBuffer(audioBuffer, model)`
- `transcriptFile(audioFile, model)`
- `freeModel(model)`
 

## 📦 Install

### Install Coqui STT engine, models, audio

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

### Install CoquiSTTJs 

 ```bash
 npm install coquisttjs
 ```


## 🛠 Usage examples and tests

Some [usage examples](examples) and [tests](tests/). Examples include:

- [Simple sentence-based speech-to-text](examples/README.md#simple-sentence-based-speech-to-text)
- [`coquihttp` A simple Speech-to-text HTTP Server](examples/README.md#simple-speech-to-text-http-server)
- [`coquihttp` as RHASSPY speech-to-text remote HTTP Server](examples/README.md#coquihttp-as-rhasspy-speech-to-text-remote-http-server)
- [SocketIO server pseudocode](examples/README.md#socketio-server-pseudocode)


## 🎁 Bonus tracks

- [`audioutils.js`](lib/audioutils.js) fast transcoding to PCM, using ffmpeg process (install ffmpeg before). 


## 🧶 Status 

- The project is in a very draft stage.
- Current Coqui STT npm package solve the DeepSpeech 
  [issue](https://github.com/mozilla/DeepSpeech/issues/3642).
  In facts current npm package `deepspeech` cause a crash using node version 16.0.0.
  BTW I had success using DeeSpeech npm package with Node version 14.16.1. 
  See my project [DeepSpeechJs](https://github.com/solyarisoftware/deepspeechjs).
- Complete the high-level API interface. E.g. including metadata as parameters


## How to contribute

If you like the project, please ⭐️ star this repository to show your support! 🙏

Any contribute is welcome. 
- [Discussions](https://github.com/solyarisoftware/voskJs/discussions). 
  Please open a new discussion (a publich chat on github) for any specific open topic, 
  for a clarification, change request proposals, etc.
- [Issues](https://github.com/solyarisoftware/voskJs/issues) Please submit issues for bugs, etc
- [e-mail](giorgio.robino@gmail.com) You can contact me privately, via email.


## License

MIT (c) Giorgio Robino 

---

[top](#)
