/**
 * @file master_thread
 *
 * The parent (master) thread spawn a worker thread (worker) 
 * with asyncronous function runThread(), waiting for a response back.
 *
 * The master pass to the worker thread a Buffer (an audio file) to be transcriped.
 *
 * @see worker_thread_transcript.js 
 *
 */ 
const fs = require('fs')
const { setTimer, getTimer } = require('../lib/chronos')
const { runThread } = require('../lib/threads')

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
async function transcriptThread(modelPath, scorerPath, audioBuffer) { 

  const workerFile = './worker_thread_transcript.js'
  const workerData = { modelPath, scorerPath, audioBuffer }

  try {
    setTimer('runThread')
    
    // transcript is done in a worker thread
    const result = await runThread(workerFile, workerData )
    
    console.log(`transcript: ${result} (${getTimer('runThread')}ms)`)
  }  
  catch (error) {
    console.error(error) 
  }  

}


/**
 * unit test
 */ 
async function master() {

  const modelPath = '../models/coqui-stt-0.9.3-models.pbmm'
  const scorerPath = '../models/coqui-stt-0.9.3-models.scorer'
  const sourceFile = '../audio/2830-3980-0043.wav'

  //
  // load an audio file into a Buffer
  //
  // https://nodejs.org/api/fs.html#fs_file_system_flags
  const audioBuffer = fs.readFileSync(sourceFile, { flag: 'rs+' } )

  await transcriptThread(modelPath, scorerPath, audioBuffer)

}


if (require.main === module)
  master()

module.exports = { transcriptThread }

