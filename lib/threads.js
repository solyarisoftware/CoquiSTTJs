/**
 * @module threads
 * Nodejs worker threads utility
 * Supply functions to spawn worker threads
 *
 *
 *  master 
 * ┌───────┐
 * │       │       worker 1
 * │       │req    ┌──────┐
 * │       ├───────►      │
 * │       │       │      │        worker 2
 * │       ◄───────┤thread│        ┌──────┐
 * │       │res    └──────┘        │      │
 * │       │                  req  │      │
 * │       ├───────────────────────►      │
 * │       │                       │      │
 * │       │       worker 3        │      │
 * │       │       ┌──────┐        │      │
 * │       ├───────►      │        │      │
 * │       ◄───────┤thread│        │      │
 * │       │       └──────┘        │      │
 * │       │                       │      │
 * │       │                  res  │      │
 * │       ◄───────────────────────┤thread│
 * │       │                       └──────┘   worker 4
 * │       │                                  ┌──────┐
 * │       ├──────────────────────────────────►      │
 * │       ◄──────────────────────────────────┤thread│
 * │       │                                  └──────┘
 * └───────┘
 *
 */ 
const os = require('os')
const { Worker, /*threadId,*/ workerData, parentPort } = require('worker_threads')

let activeWorkers = 0


/**
 * runThread
 * spawn a nodejs worker thread
 * asynch function waiting the thread termination
 *
 * @function
 * @public
 * @async
 *
 * @param {String}           workerFile file name of the nodejs worker thread child
 * @param {Object}           workerData object containing initial data to be passed to the worker thread
 *
 * @return {Promise<Object>} object containing thread data result
 *
 */ 
function runThread(workerFile, workerData) {

  return new Promise((resolve, reject) => {
    
    const worker = new Worker(workerFile, { workerData } )
    
    // new thread started, increment global counter of active thread running
    activeWorkers++

    worker.on('message', data => { 
      // thread finished, decrement global counter of active thread running
      activeWorkers--
      resolve(data) 
    })

    worker.on('error', reject)
    
    worker.on('exit', (code) => {
      if (code !== 0)
        reject(new Error(`Worker stopped with exit code ${code}`))
    })

  })

}


/**
 * sendToParent
 * send message from the worker thread to the parent thread 
 *
 * @function
 * @public
 *
 * @param {Object}           message 
 *
 */ 
function sendToParent(message) {
  parentPort.postMessage( message )
}  


/**
 * sendToChild
 * send message from the parent thread to the child thread 
 *
 * @function
 * @public
 *
 * @param {WorkerObject}     worker 
 * @param {Object}           message 
 *
 */ 
function sendToChild(worker, message) {
  // TODO
  // https://nodejs.org/api/worker_threads.html#worker_threads_worker_parentport
  worker.send( message )
}  



/**
 * unit test
 */ 
function main() {

  // take the number of virtual cores (vCPU) 
  const cpuCount = os.cpus().length

  console.log()
  console.log(`CPU cores in this host: ${cpuCount}`) 
  console.log()
}  


if (require.main === module) 
  main()


module.exports = {

  // data
  workerData, 
  activeWorkers,

  // functions
  runThread,
  sendToParent,
  sendToChild

}
