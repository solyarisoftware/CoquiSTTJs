# Usage Examples

- [Simple sentence-based speech-to-text](#simple-sentence-based-speech-to-text)

- [`coquihttp` A simple Speech-to-text HTTP Server](#simple-speech-to-text-http-server)
- [`coquihttp` as RHASSPY speech-to-text remote HTTP Server](#coquihttp-as-rhasspy-speech-to-text-remote-http-server)
- [SocketIO server pseudocode](#socketio-server-pseudocode)

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

## Simple speech-to-text HTTP Server

[`coquihttp.js`](coquihttp.js) is a very simple HTTP API server 
that can process concurrent/multi-user transcript requests, 
using specified language model/scorer.

A dedicated process is spawned for each transcript processing request, 
so latency performance will be optimal if your host has multiple cores.

Currently the server support just a single endpoint: 

- HTTP POST /transcript

Server settings:

```bash
$ cd examples && node coquihttp.js 
```
or, if you installed this package as global:
```bash
$ coquihttp
```
```
Simple demo HTTP JSON server, loading a Coqui STT engine model to transcript speeches.
package coquisttjs version 0.0.17, Coqui STT version 0.10.0-alpha.6

The server has the endpoint:

  HTTP POST /transcript
  The request query string arguments contain parameters,
  the request body contains the WAV file name to be submitted to the server.

Usage:

  coquihttp --model=<model file>.pbmm> \ 
                 --scorer=<scorer file>.scorer> \ 
                [--port=<server port number. Default: 3000>] \ 
                [--path=<server endpoint path. Default: /transcript>] \ 

Server settings example:

  stdout includes minimal info, default port number is 3000
  node coquihttp --model=../models/coqui-stt-0.9.3-models.pbmm --scorer=../models/coqui-stt-0.9.3-models.scorer

Client requests examples:

  POST /transcript - body includes the speech file

  curl -s \ 
       -X POST \ 
       -H "Accept: application/json" \ 
       -H "Content-Type: audio/wav" \ 
       --data-binary="@../audio/2830-3980-0043.wav" \ 
       "http://localhost:3000/transcript?id=1620060067830&model=coqui-stt-0.9.3-models.pbmm&scorer=coqui-stt-0.9.3-models.scorer"
```

Server run example:

```bash
$ node coquihttp.js  --model=../models/coqui-stt-0.9.3-models.pbmm --scorer=../models/coqui-stt-0.9.3-models.scorer 2> /dev/null
```

- Client call example:

  ```bash
  $ curl -s \
  -X POST \
  -H "Accept: application/json" \
  -H "Content-Type: audio/wav" \
  --data-binary "@audio/2830-3980-0043.wav" \
  http://localhost:3000/transcript \
  | python3 -m json.tool
  ```

  The JSON returned by the transcript endpoint: 
  ```
  {
    "id": 1623159640590,
    "latency": 1156,
    "duration": 1976,
    "rtf": 0.59,
    "text": "experience proves this"
  }
  ```

- Server side stdout:

  ```
  1623054527778 package coquisttjs version 0.0.17, Coqui STT version 0.10.0-alpha.6
  1623054527780 Model name: ../models/coqui-stt-0.9.3-models.pbmm
  1623054527780 Scorer name: ../models/coqui-stt-0.9.3-models.scorer
  1623054527780 HTTP server port: 3000
  1623054527780 HTTP server path: /transcript
  1623054527781 server coquihttp.js running at http://localhost:3000
  1623054527782 endpoint http://localhost:3000/transcript
  1623054527782 press Ctrl-C to shutdown
  1623054527782 ready to listen incoming requests
  1623054530648 request POST 1623054530648 speechBuffer
  1623054531750 response 1623054530648 {"id":1623054530648,"latency":1099,"result":"experience proves this"}
  ```

### HTTP Server Tests

[`tests/`](../tests/) directory contains some utility bash scripts (client*.sh) 
to test the server endpoint with POST methods.


### Multiprocessing vs Multithreading speech-to-text Server architecture

The single thread behaviour doesn't work for speech to text server applications. 
In [`process_transcript.js`](process_transcript.js)
a dedicated process is spawned for each transcript processing. 
That means that the nodejs main thread is not blocked by the CPU-intensive transcript processing.
Latency performance will be optimal if your host has at least 2 cores.

```javascript
  const result = await transcriptProcess(modelPath, scorerPath, audioBuffer)
```

The function `transcriptProcess` can be used as enabler 
to run server (concurrent requests) speech to text architecture.

```
master thread/process 
┌───────┐
│       │       worker 1
│       │ req 1 ┌──────┐
│       ├───────►      │
│       │       │      │        worker 2
│       ◄───────┤proc  │        ┌──────┐
│       │res    └──────┘        │      │
│       │                 req 2 │      │
│       ├───────────────────────►      │
│       │                       │      │
│       │       worker 3        │      │
│       │       ┌──────┐        │      │
│       ├───────►      │        │      │
│       ◄───────┤proc  │        │      │
│       │       └──────┘        │      │
│       │                       │      │
│       │                  res  │      │
│       ◄───────────────────────┤proc  │
│       │                       └──────┘   worker 4
│       │                                  ┌──────┐
│       ├──────────────────────────────────►      │
│       ◄──────────────────────────────────┤proc  │
│       │                                  └──────┘
└───────┘
```

Warning: 
Spawning a process for each transcript request is a sub-optimal first-fit solution, 
because for each request a process is forked and ran. 
The good news is that, due to the smart Coqui STT architecture, 
the model is loaded in memory once (because mmaped), 
and the model loading elapsed time is afterward just few milliseconds.
Nevertheless, spawining a process, loading and freeing the model, 
increases the original (single-thread) latency of many tents of milliseconds.

To optimize latencies, instead of running a separate process for each request, 
probably a better architeture invole a subprocess pool. To do.

Note:
You could ask why workers have been implemented as processes instead of nodejs *workerThreads*.
In practice I got segmentation violations fatal issue when using worker threads. 
See also discussion topic: 
[How to use Coqui STT for a text-to-speech server (in NodeJs)](https://github.com/coqui-ai/STT/discussions/1870).


## `coquihttp` as RHASSPY speech-to-text remote HTTP Server

[RHASSPY](https://rhasspy.readthedocs.io/en/latest/) is an open source, 
fully offline set of voice assistant services.

RHASSPY uses, as option, a [Remote HTTP Server ](https://rhasspy.readthedocs.io/en/latest/speech-to-text/#remote-http-server)
to transform speech (WAV) to text. This is typically used in a client/server set up, 
where Rhasspy does speech/intent recognition on a home server with decent CPU/RAM available.

You can run `coquihttp` as RHASSPY speech-to-text remote HTTP Server
Following these specifications:

- https://rhasspy.readthedocs.io/en/latest/speech-to-text/#remote-http-server
- https://rhasspy.readthedocs.io/en/latest/usage/#http-api
- https://rhasspy.readthedocs.io/en/latest/reference/#http-api


1. Install the server

   Install on your home server, as described [here](../README.md#-install): 
   - Coqui STT engine
   - `npm install -g @solyarisoftware/coquisttjs`
   - A Coqui STT language model/scorer of your choice

2. Run the server 

   ```
   $ coquihttp \
     --model=../models/coqui-stt-0.9.3-models.pbmm \
     --scorer=../models/coqui-stt-0.9.3-models.scorer \
     --path=/api/speech-to-text \
     --port=12101
   ```

3. Curl client tests

   Two bash scripts are available in the tests/ directory:

   - [`clientRHASSPYtext.sh`](../tests/clientRHASSPYtext.sh) get a text/plain response from the server
     ```
     $ clientRHASSPYtext.sh
     ```
     ```
     experience proves this
     ```

   - [`clientRHASSPYjson.sh`](../tests/clientRHASSPYjson.sh) get an application/json response from the server

     ```
     $ clientRHASSPYjson.sh
     ```
     ```
     {
       "id": 1623159640590,
       "latency": 1156,
       "duration": 1976,
       "rtf": 0.59,
       "text": "experience proves this"
     }
     ```


## SocketIO server pseudocode

Consider a client-server architecture using [socketio](https://socket.io/) 
websocket-based real-time bidirectional event-based communication library. 
Here below a simplified server-side pseudo-code taht shows how to use coquisttjs transcript:

```javascript
const { transcriptProcess } = require('./process_transcript')
const { toPCM } = require('../audioutils')
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
    const result = await transcriptProcess(modelPath, scorerPath, buffer)

  })
})
```

---

[top](#) | [home](../README.md)

