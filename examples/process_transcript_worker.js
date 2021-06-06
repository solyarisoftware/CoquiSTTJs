/**
 * @file 
 *
 * The file is a worker thread (worker). 
 * The worker receive a Buffer (an audio file) from the master (parent) thread
 * and transcript the audio using Coqui STT functions.
 *
 *
 */ 
const { transcriptNoThread } = require('./transcript.js')

/**
 * sleep for a number of milliseconds
 *
 * @param {Integer} ms milliseconds to sleep
 * @return Promise
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}


async function fakeWorker(message) {

  console.log('worker: parent process request:')
  console.log(message)

  const msecs = 2000
  await sleep(msecs);
  
  const result = 'this is a test' 

  return result

}


function worker(message) {

  const { modelPath, scorerPath, audioBuffer } = message 

  const result = transcriptNoThread(modelPath, scorerPath, audioBuffer)
  
  return result
}


// receive messages from the parent process
process.on( 'message', async (message) => {
  process.send( await worker(message) )
  })

// end of worker thread
