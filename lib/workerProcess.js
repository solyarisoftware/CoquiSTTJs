/**
 * @module fork
 *
 */ 
const fork = require('child_process').fork

async function runProcess(workerFilename, messageToWorker) {

  const worker = forkProcess(workerFilename) 

  const result = await messageProcess(worker, messageToWorker )
  
  killProcess(worker)

  return result
}  


/**
 * run a worker/child process 
 *
 * @function
 * @async
 *
 * @param {String} forkProcess 
 * @param {Object} jobArguments 
 * @return {Promise<WorkerResultObject>}
 *
 */
function messageProcess(forkedProcess, message) {

  return new Promise( (resolve, reject) => { 

    forkedProcess.send(message)
    
    forkedProcess.on('message', message => resolve(message) )

    forkedProcess.on('exit', (code) => {
      if (code) {
        console.error(`master: child process exited with code ${code}`)
        reject(code)
      }  
    })

  })

}


/**
 * fork a new worker/child process 
 *
 * @function
 * @param {String} filename 
 * @return {ForkProcessObject}
 *
 */
function forkProcess(filename) {

  // Buffer must not serialized
  // https://nodejs.org/api/child_process.html#child_process_child_process_fork_modulepath_args_options
  return fork(filename, [], { serialization: 'advanced' })

}  


/**
 * fork a new worker/child process 
 *
 * @function
 * @param {ForkProcessObject} forkedProcess 
 *
 */
function killProcess(forkedProcess) {
  forkedProcess.kill() 
}  


module.exports = {
  forkProcess,
  messageProcess,
  killProcess,
  runProcess
}  

