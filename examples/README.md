# Usage Examples

- [Simple sentence-based speech-to-text](#simple-sentence-based-speech-to-text)
- [Multithreading speech-to-text](#multithreading-speech-to-text)
- [SocketIO server pseudocode](#socketio-server-pseudocode)
- [Simple Speech-to-text HTTP Server](#simple-speech-to-text-http-server)

## Simple sentence-based speech-to-text   

[`transcript.js`](transcript.js) is a basic demo using Coqui STT. 

The program transcript a speech (from a wav file), 
using a specified language model and scorer. 

```bash
$ node transcript.js 2> /dev/null
transcript: experience proves this (1100ms)
```

Warning: 
Coqui STT functions (loading model in memory and the run-time decoding) 
are all running on a single thread, so the transcript task block the main nodejs thread.


## Multithreading speech-to-text

The single thread behaviour doesn't work for speech to text server applications. 
In [`thread_transcript.js`](thread_transcript.js)
a dedicated thread is spawned for each transcript processing. 
That means that the nodejs main thread is not 'saturated' by the CPU-intensive transcript processing.
Latency performance will be optimal if your host has at least 2 cores.

```javascript
  const result = await transcriptThread(modelPath, scorerPath, audioBuffer)
```

The function `transcriptThread` could be used as enabler 
to run server (concurrent requests) speech to text platforms.

Warning: 
Spawning a thread for each transcript request is a sub-optimal first-fit solution, 
because for each request a separate worker thread is created and ran. 
The good news is that, due to the smart Coqui STT architecture, the model is loaded in memory once, 
and the loading elapsed time is afterward just few milliseconds.
Nevertheless, spawining a thread, loading and freeing the model, 
increases the original (single-thread) latency of many tents of milliseconds.

To optimize latencies, instead of running a separate thread for each request, 
probably a better architeture invole a threading pool. To do.

## SocketIO server pseudocode

Consider a client-server architecture using [socketio](https://socket.io/) 
websocket-based real-time bidirectional event-based communication library. 
Here below a simplified server-side pseudo-code taht shows how to use voskJs transcript:

```javascript
const { transcriptThread } = require('./thread_transcript.js')
const { toPCM } = require('../toPCM.js')
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

    // Coqui STT speech to text 
    const result = await transcriptThread(modelPath, scorerPath, buffer)

  })
})
```

## Simple speech-to-text HTTP Server

Coming soon.

---

[top](#) | [home](../README.md)

