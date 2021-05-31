/**
 * @file master
 *
 * thread module utility usage example:
 *
 * The parent (master) thread spawn a worker thread (worker) 
 * with asyncronous function runThread(), waiting for a response back.
 *
 * The master pass to the worker thread a Buffer (an audio file) to be transcriped.
 *
 * @see worker.js 
 *
 */ 
const fs = require('fs')
const { setTimer, getTimer } = require('./chronos')
const { runThread } = require('./threads')

/**
 * unit test
 */ 
async function master() {

  const sourceFile = '../audio/2830-3980-0043.wav'

  // https://nodejs.org/api/fs.html#fs_file_system_flags
  const audioBuffer = fs.readFileSync(sourceFile, { flag: 'rs+' } )

  const workerData = { audioBuffer }
  const workerFile = './worker.js'

  try {
    setTimer('runThread')
    
    const result = await runThread(workerFile, workerData )
    
    console.log(`master: total elapsed : ${getTimer('runThread')}ms`)
    console.log(`master: transcript    : ${result}`)
  }  
  catch (error) {
    console.error(error) 
  }  

}

master()
