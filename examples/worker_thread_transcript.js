/**
 * @file worker_thread_transcript 
 * @worker_thread 
 *
 * The file is a worker thread (worker). 
 * The worker receive a Buffer (an audio file) from the master (parent) thread
 * and transcript the audio using Coqui STT functions.
 *
 * @see master_thread_transcript.js 
 *
 */ 
const { sendToParent, workerData } = require('../lib/threads')
const { transcriptNoThread } = require('./transcript.js')

// 
// take parameters from main/parent thread
//
const { modelPath, scorerPath, audioBuffer } = workerData 

// 
// the function is called when the thread is created
//
const result = transcriptNoThread(modelPath, scorerPath, audioBuffer)

// 
// communicate result to main thread
//
sendToParent(result)

// end of worker thread
