# Changelog

- 0.1.0
  - httpServer renamed coquihttp 
  - coquihttp JSON response updated. attribute result is now called text. Added attributes rtf, duration.

- 0.0.18
  - workerThread ubstituted with forked processes.
  - documenattion updated
  - coquihttp also configurable to be used as RHASSPY rempte HTTP Server

- 0.0.17
  - workerThreads create a segmentation violation.
  - The issue is solved substituting worker threads with forked processes.
 
- 0.0.15
  - client/server tests added. The server crashes.
  - added httpServer example

- 0.0.13
  - developed briks to build a (web) multi-process or multi-thread server architecture. See: 
    - [How to use Coqui STT for a text-to-speech server (in NodeJs)](https://github.com/coqui-ai/STT/discussions/1870) 
    - [How to use DeepSpeech for a text-to-speech server (in NodeJs)](https://discourse.mozilla.org/t/how-to-use-deepspeech-for-a-text-to-speech-server-in-nodejs/79636/2)
  - added usage examples

- 0.0.6
  - documenation update
  - npm package published
  - test script testPerformances.sh updated 

---

[top](#) | [home](README.md)


