/**
 * @file 
 *
 * The parent (master) thread spawn a worker thread (worker) 
 * with asyncronous function runThread(), waiting for a response back.
 *
 * The master pass to the worker thread a Buffer (an audio file) to be transcriped.
 *
 *
 */ 
const fs = require('fs')
const { setTimer, getTimer } = require('../lib/chronos')
const { runProcess } = require('../lib/workerProcess')

/**
 * transcript a Buffer, using a specified Model and Scorer
 *
 * @function
 * @public
 * @async
 *
 * @param {String} modelPath
 * @param {String} scorerPath
 * @param {Buffer} audioBuffer
 * @return {String} transcript result
 *
 */ 
async function transcriptProcess(modelPath, scorerPath, audioBuffer) { 

  const workerFile = './process_transcript_worker.js'
  const workerData = { modelPath, scorerPath, audioBuffer }

  // transcript is done in a worker thread
  return runProcess( workerFile, workerData )

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

  const runThreadTime = setTimer()

  const result = await transcriptProcess(modelPath, scorerPath, audioBuffer)

  console.log(`transcript: ${result} (${getTimer(runThreadTime)}ms)`)
}


if (require.main === module)
  master()

module.exports = { transcriptProcess }

