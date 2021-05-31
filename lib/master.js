/**
 * @file master
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
//const { threadId, workerData, parentPort } = require('worker_threads')
const fs = require('fs')
const { setTimer, getTimer } = require('./chronos')
const { runThread } = require('./workerThreads')

/**
 * main
 * unit test
 */ 
async function main() {

  const sourceFile = '../audio/2830-3980-0043.wav'

  // https://nodejs.org/api/fs.html#fs_file_system_flags
  const audioBuffer = fs.readFileSync(sourceFile, { flag: 'rs+' } )

  const workerData = { audioBuffer }
  const workerFile = './worker.js'

  try {
    setTimer('runThread')
    const result = await runThread(workerFile, workerData )
    console.log(`master: total elapsed: ${getTimer('runThread')}ms`)
    console.log(`master: transcript: ${result}`)
  }  
  catch (error) {
    console.error(error) 
  }  

}

main()
