/**
 * @module worker
 * @worker_thread
 *
 */ 
const { transcriptBuffer, loadModel, freeModel } = require('../stt')
const { sendParent, workerData } = require('./workerThreads')
const { setTimer, getTimer } = require('./chronos')

function worker() { 

  setTimer('worker')
  // take parameters from main/parent thread
  const { audioBuffer } = workerData 

  const modelPath = '../models/coqui-stt-0.9.3-models.pbmm'
  const scorerPath = '../models/coqui-stt-0.9.3-models.scorer'

  // load Coqui STT model
  setTimer('loadModel')
  const model = loadModel(modelPath, scorerPath)
  console.log(`worker: load model elapsed: ${getTimer('loadModel')}ms`)

  try { 
    setTimer('transcriptBuffer')
    const result = transcriptBuffer(audioBuffer, model)
    console.log(`worker: transcriptBuffer elapsed: ${getTimer('transcriptBuffer')}ms`)
    
    // communicate result to main thread
    sendParent(result)
  }  
  catch (error) { 
    throw `transcriptBuffer: ${error}` 
  } 

  freeModel(model)
  console.log(`worker: total elapsed: ${getTimer('worker')}ms`)

}

worker()
