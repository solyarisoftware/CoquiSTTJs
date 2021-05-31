/**
 * @module worker
 *
 * thread module utility usage example:
 *
 * The file is a worker thread (worker). 
 * The worker receive a Buffer (an audio file) from the master (parent) thread
 * and transcript the audio using Coqui STT functions.
 *
 * @see master.js 
 *
 */ 
const { setTimer, getTimer } = require('../lib/chronos')
const { sendParent, workerData } = require('../lib/threads')
const { transcriptBuffer, loadModel, freeModel } = require('../stt')

const DEBUG_WORKER = false

function worker() { 

  setTimer('worker')

  // take parameters from main/parent thread
  const { audioBuffer } = workerData 

  //
  // load Coqui STT model
  //
  setTimer('loadModel')

  const modelPath = '../models/coqui-stt-0.9.3-models.pbmm'
  const scorerPath = '../models/coqui-stt-0.9.3-models.scorer'

  const model = loadModel(modelPath, scorerPath)
  
  if (DEBUG_WORKER)
    console.log(`worker: load model elapsed: ${getTimer('loadModel')}ms`)

  //
  // transcript the audio buffer
  //
  try { 
    setTimer('transcriptBuffer')
    
    const result = transcriptBuffer(audioBuffer, model)
    
    if (DEBUG_WORKER)
      console.log(`worker: transcriptBuffer elapsed: ${getTimer('transcriptBuffer')}ms`)
    
    // communicate result to main thread
    sendParent(result)
  }  
  catch (error) { 
    throw `transcriptBuffer: ${error}` 
  } 


  //
  // free the model
  //
  freeModel(model)
  
  if (DEBUG_WORKER)
   console.log(`worker: total elapsed: ${getTimer('worker')}ms`)

}

worker()
