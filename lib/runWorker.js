/**
 * @module runWorker
 *
 */ 
const { Worker } = require('worker_threads')
const os = require('os')

let activeWorkers = 0


/**
 * runWorker
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
function runWorker(workerFile, workerData) {

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
  // counter
  activeWorkers,
  
  // function
  runWorker 
}

