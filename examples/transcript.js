const fs = require('fs')
const { setTimer, getTimer } = require('../lib/chronos')
const { transcriptBuffer, loadModel, freeModel } = require('../stt')

const DEBUG_WORKER = false

/**
 * transcript a Buffer, using a specified Model and Scorer
 *
 * @function
 * @sync
 *
 * @param {String} modelPath
 * @param {String} scorerPath
 * @param {Buffer} audioBuffer
 * @return {String} transcript result
 *
 */ 
function transcriptNoThread(modelPath, scorerPath, audioBuffer) { 

  let result

  setTimer('worker')

  //
  // load Coqui STT model
  //
  setTimer('loadModel')

  const model = loadModel(modelPath, scorerPath)
  
  if (DEBUG_WORKER)
    console.log(`worker: load model elapsed: ${getTimer('loadModel')}ms`)

  //
  // transcript the audio buffer
  //
  try { 
    setTimer('transcriptBuffer')
    
    result = transcriptBuffer(audioBuffer, model)
    
    if (DEBUG_WORKER)
      console.log(`worker: transcriptBuffer elapsed: ${getTimer('transcriptBuffer')}ms`)
  }  
  catch (error) { 
    throw `transcriptBuffer: ${error}` 
  } 

  //
  // free the model
  //
  setTimer('freeModel')
  
  freeModel(model)
    
  if (DEBUG_WORKER)
    console.log(`worker: free model elapsed: ${getTimer('freeModel')}ms`)
  
  if (DEBUG_WORKER)
   console.log(`worker: total elapsed: ${getTimer('worker')}ms`)

  return result
}

function main() {

  const modelPath = '../models/coqui-stt-0.9.3-models.pbmm'
  const scorerPath = '../models/coqui-stt-0.9.3-models.scorer'
  const sourceFile = '../audio/2830-3980-0043.wav'

  //
  // load an audio file into a Buffer
  //
  // https://nodejs.org/api/fs.html#fs_file_system_flags
  const audioBuffer = fs.readFileSync(sourceFile, { flag: 'rs+' } )
  
  setTimer('transcriptTask')

  const result = transcriptNoThread(modelPath, scorerPath, audioBuffer)
  
  console.log(`transcript: ${result} (${getTimer('transcriptTask')}ms)`)
}  


if (require.main === module)
  main()

module.exports = { transcriptNoThread }

