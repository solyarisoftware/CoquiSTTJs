/**
 * @module workerTranscriptBuffer
 * @worker_thread
 *
 */ 
const { /*threadId,*/ workerData, parentPort } = require('worker_threads')
const { transcriptBuffer, loadModel, freeModel } = require('../stt')

function main() { 

  // take parameters from main/parent thread
  const { audioBuffer } = workerData 

  const modelPath = '../models/coqui-stt-0.9.3-models.pbmm'
  const scorerPath = '../models/coqui-stt-0.9.3-models.scorer'

  // load Coqui STT model
  const model = loadModel(modelPath, scorerPath)

  try { 
    const result = transcriptBuffer(audioBuffer, model)

    // communicate result to main thread
    parentPort.postMessage( result )
  }  
  catch (error) { 
    throw `transcriptBuffer: ${error}` 
  } 

  freeModel(model)

  //  console.log( `Done. Thread id: ${threadId}. Transcript: ${transcript}`  )

}

main()
