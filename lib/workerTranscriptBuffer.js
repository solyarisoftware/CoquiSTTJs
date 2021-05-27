/**
 * @module workerTranscriptBuffer
 * @worker_thread
 *
 * @See STT API documentation
 * https://stt.readthedocs.io/en/latest/NodeJS-API.html
 *
 * @See STT NodeJs binding code
 * https://github.com/coqui-ai/STT/tree/main/native_client/javascript
 *
 * @See STT NodeJs examples 
 * https://github.com/coqui-ai/STT-examples#javascript
 *
 */ 
const { threadId, workerData, parentPort } = require('worker_threads')

const DEBUG = true

/**
 * workerTranscriptBuffer
 *
 * return the speech to text (transcript) 
 * of the audio contained in the specified audio PCM buffer 
 *
 * @function
 * @sync
 * @private
 *
 * @param {Buffer}               audioBuffer
 * @param {STTMemoryModelObject} model
 * @return {String}     text transcript 
 *
 * @todo 
 * no audioBuffer validation is done.
 * The audio fle must be a WAV audio in raw format.
 */ 
function workerTranscriptBuffer(audioBuffer, model) {

  try { 
    return model.stt(audioBuffer)
  }
  catch (error) { 
    throw `model.stt: ${error}` 
  } 

}

// take parameters from main/parent thread
const { audioBuffer, model } = workerData

// synchronous long-running CPU-bound computation
const transcript = workerTranscriptBuffer(audioBuffer, model)

if (DEBUG)
  console.log( `Done. Thread id: ${threadId}. Transcript: ${transcript}`  )

// communicate result to main thread
parentPort.postMessage( transcript )

