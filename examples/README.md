# VoskJs Usage Examples

- [Simple program for a sentence-based speech-to-text](#simple-program-for-a-sentence-based-speech-to-text)
- [SocketIO server pseudocode](#socketio-server-pseudocode)
- [`voskjshttp` as RHASSPY speech-to-text remote HTTP Server](#voskjshttp-as-rhasspy-speech-to-text-remote-http-server)

## Simple program for a sentence-based speech-to-text   

[`transcript.js`](transcript.js) is a basic demo using VoskJs functionalities. 

The program transcript (recognize, in Vosk parlance) a speech in a wav file, 
using a specified language model. 
This is the brainless Vosk interface, perfect for embedded / standalone systems, 
but also as entry point for any custom server applications.

NOTE
With trascript function default settings, 
a dedicated thread is spawned for each transcript processing. 
That means that the nodejs main thread is not 'saturated' by the CPU-intensive transcript processing.
Latency performance will be optimal if your host has at least 2 cores.

```bash
$ node simplest
```
```
model directory      : ../models/vosk-model-en-us-aspire-0.2
speech file name     : ../audio/2830-3980-0043.wav
load model latency   : 28439ms
{
  result: [
    { conf: 0.980969, end: 1.02, start: 0.33, word: 'experience' },
    { conf: 1, end: 1.349919, start: 1.02, word: 'proves' },
    { conf: 0.997301, end: 1.71, start: 1.35, word: 'this' }
  ],
  text: 'experience proves this'
}
transcript latency : 471ms
```


## SocketIO server pseudocode

HTTP server is not the only way to go! 
Consider by example a client-server architecture using [socketio](https://socket.io/) 
websocket-based real-time bidirectional event-based communication library. 

Here below a simplified server-side pseudo-code taht shows how to use voskJs transcript:

```javascript
const {transcript, toPCM } = require('voskjs')
const app = require('express')()

// get SSL certificate
const credentials = {
  key: fs.readFileSync(KEY_FILENAME, 'utf8'), 
  cert: fs.readFileSync(CERT_FILENAME, 'utf8')
}

// create the https server
const server = https.createServer(credentials, app)

// create the socketio channel 
const io = require('socket.io')(server)

// a websocket message arrived
io.on('connection', (socket) => {
  // the client sent an audio buffer
  socket.on('audioMessage', msg => {

    // save audio buffer into a local file, giving a unique name
    const audioFileCompressed = filenameUUID()
    await msgToAudioFile(audioFileCompressed, msg)

    // convert the received audio into a PCM buffer 
    const buffer = toPCM(audioFileCompressed)

    // voskjs speech to text 
    const voskResult = await transcriptFromBuffer(buffer, model)

  })
})
```

---

[top](#) | [home](../README.md)

