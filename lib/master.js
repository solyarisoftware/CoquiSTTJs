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
const { runWorker } = require('./runWorker')

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
    const result = await runWorker(workerFile, workerData )
    console.log(result)
  }  
  catch (error) {
    console.error(error) 
  }  

}

main()
