#!/usr/bin/env node

const path = require('path')
const http = require('http')
const url = require('url')

const { transcriptProcess } = require('./process_transcript')
const { getArgs } = require('../lib/getArgs')
const { unixTimeMsecs, setTimer, getTimer } = require('../lib/chronos')
const { log } = require('../lib/log')
const { info } = require('../lib/info')

const HTTP_PATH = '/transcript'
const HTTP_PORT = 3000


/**
 * Module global variables
 */
let debug
let activeRequests = 0
let modelName
let scorerName
let pathRegexp


function helpAndExit(programName) {
  
  console.log('Simple demo HTTP JSON server, loading a Coqui STT engine model to transcript speeches.')
  console.log( info() )
  console.log()
  console.log('The server has the endpoint:')
  console.log()
  console.log('  HTTP POST /transcript')
  console.log('  The request query string arguments contain parameters,')
  console.log('  the request body contains the WAV file name to be submitted to the server.')
  console.log()
  console.log('Usage:')
  console.log()
  console.log(`  ${programName} --model=<model file>.pbmm> \\ `)
  console.log('                 --scorer=<scorer file>.scorer> \\ ')
  console.log(`                [--port=<server port number. Default: ${HTTP_PORT}>] \\ `)
  console.log(`                [--path=<server endpoint path. Default: ${HTTP_PATH}>] \\ `)
  console.log()    
  console.log('Server settings example:')
  console.log()    
  console.log('  stdout includes minimal info, default port number is 3000')
  console.log(`  node ${programName} --model=../models/coqui-stt-0.9.3-models.pbmm --scorer=../models/coqui-stt-0.9.3-models.scorer`)
  console.log()
  console.log('Client requests examples:')
  console.log()
  console.log('  POST /transcript - body includes the speech file')
  console.log()    
  console.log('  curl -s \\ ')
  console.log('       -X POST \\ ')
  console.log('       -H "Accept: application/json" \\ ')
  console.log('       -H "Content-Type: audio/wav" \\ ')
  console.log('       --data-binary="@../audio/2830-3980-0043.wav" \\ ')
  console.log('       "http://localhost:3000/transcript?id=1620060067830&model=coqui-stt-0.9.3-models.pbmm&scorer=coqui-stt-0.9.3-models.scorer"')
  console.log()    

  process.exit(1)

}  


/**
 * validateArgs
 * command line parsing
 *
 * @param {String}                    args
 * @param {String}                    programName
 *
 * @returns {SentenceAndAttributes}
 * @typedef {Object} SentenceAndAttributes
 * @property {String} language 
 * 
 */
function validateArgs(args, programName) {


  // model is a cli mandatory argument
  const modelName = args.model 
  const scorerName = args.scorer 

  if ( !modelName || !scorerName ) 
    helpAndExit(programName)
  
  const serverPort = !args.port ? HTTP_PORT : args.port 
  const serverPath = !args.path ? HTTP_PATH : args.path 

  return { modelName, scorerName, serverPort, serverPath }
}



/**
 * errorResponse
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
 */ 
function errorResponse(message, statusCode, res) {
  res.statusCode = statusCode
  res.end(`{"error":"${message}"}`)
  log(message, 'ERROR')
}


// return JSON data structure
function responseJson(id, latency, result, res) {
  res.setHeader('Content-Type', 'application/json')
  return JSON.stringify({
    //... { request: JSON.stringify(queryObject) },
    ... { id },
    ... { latency },
    ... { result } 
    })
}  


function responseText(result, res) {
  res.setHeader('Content-Type', 'text/plain')
  return result 
}  


function successResponse(requestId, json, res) {
  log(`response ${requestId} ${json}`)
  res.end(json)
}


/**
 * get request body
 *
 * @function
 * @async
 * 
 * @param {Object}           req
 * @return {Promise<Buffer>}
 */ 
function getRequestBody(req) {
  return new Promise( (resolve) => {

    let speechAsBuffer = Buffer.alloc(0) 
    
    req.on('data', (chunk) => speechAsBuffer = Buffer.concat([speechAsBuffer, chunk]) )

    // all the body is received 
    req.on('end', () => resolve(speechAsBuffer) )

  })
}  


async function requestListener(req, res) {

  //if ( !req.url.match(/^\/transcript/) )
  if ( !req.url.match(pathRegexp) )
    return errorResponse(`path not allowed ${req.url}`, 405, res)

  //
  // if request header accept attribute is 'text/plain'
  // response body is text, otherwise
  // response body is 'application/json'
  //
  const requestAcceptText = (req.headers.accept === 'text/plain') ? true : false

  // HTTP POST /transcript
  if (req.method === 'POST') {
    
    // get request headers attribute: "content-type" 
    const { 'content-type': contentType } = req.headers

    if (debug)
      log(`request POST content type ${contentType}`, 'DEBUG')

    // get request query string arguments
    const queryObject = url.parse(req.url,true).query

    const requestedModelName = queryObject.model 
    const requestedScorerName = queryObject.scorer 
    const requestedId = queryObject.id 
  
    // set id to the is query string argument 
    // if id argument is not present in the quesy string, 
    // set the id with current timestamp in msecs.
    const currentTime = unixTimeMsecs()
    const id = requestedId ? requestedId : currentTime

    // log POST request  
    log(`request POST ${id} ${'speechBuffer'} ${requestedModelName? requestedModelName: ''} ${requestedScorerName? requestedScorerName: ''}`, null, currentTime)

    /*
    // TODO
    // if query arguments "model" and "scorer" are specified in the client request,
    // they must be equal to the model name and the scorer name loaded by the server
    if ( requestedModelName && (requestedModelName !== modelName) ) 
      return errorResponse(`id ${id} model ${requestedModelName} unknown`, 404, res)

    if ( requestedScorerName && (requestedScorerName !== scorerName) ) 
      return errorResponse(`id ${id} scorer ${requestedScorerName} unknown`, 404, res)
    */

    // get request body binary data, containing speech WAV file 
    // TODO Validation of body
    
    const attachedFileTime = setTimer()

    const speechAsBuffer = await getRequestBody(req)
    
    if (debug) 
      log(`HTTP POST attached file elapsed ${getTimer(attachedFileTime)}ms`, 'DEBUG')

    return responseTranscriptPost(id, speechAsBuffer, modelName, scorerName, requestAcceptText, res)
    
  }
  
  // all other HTTP methods 
  else
    return errorResponse(`method not allowed ${req.method}`, 405, res)

}  


async function responseTranscriptPost(id, buffer, model, scorer, acceptText, res) {

  if (debug) 
    log(`Body Buffer length ${Buffer.byteLength(buffer)}`)
    
  try {

    if (debug) {
      // new thread started, increment global counter of active thread running
      activeRequests++
      log(`active requests ${activeRequests}`, 'DEBUG')
    }

    const transcriptTime = setTimer()

    // speech recognition of an audio file
    const result = await transcriptProcess( model, scorer, buffer )

    if (debug) {
      // thread finished, decrement global counter of active thread running
      activeRequests--
      log(`active requests ${activeRequests}`, 'DEBUG')
    }  

    const latency = getTimer(transcriptTime)

    if (debug)
      log(`latency ${id} ${latency}ms`, 'DEBUG')
    
    const body = acceptText ? 
      responseText(result, res) : 
      responseJson(id, latency, result, res)

    return successResponse(id, body, res)

  }  
  catch (error) {
    return errorResponse(`id ${id} transcript function ${error}`, 415, res)
  }  

}  


function shutdown(signal) {

  log(`${signal} received`)
  
  log('Shutdown done')
  
  process.exit(0)
}  


async function main() {

  // get command line arguments 
  const { args } = getArgs()
  
  //const programName = path.basename(__filename, '.js')
  const programName = 'httpServer' 

  const validatedArgs = validateArgs(args, programName )
  const { serverPort, serverPath } = validatedArgs

  // set modelName  and scorerName as a global variable
  ;( { modelName, scorerName } = validatedArgs )

  pathRegexp = new RegExp('^' + serverPath )

  log( info() )
  log(`Model name: ${modelName}`)
  log(`Scorer name: ${scorerName}`)
  log(`HTTP server port: ${serverPort}`)
  log(`HTTP server path: ${serverPath}`)

  /*
  log(`wait loading Coqui STT model ${modelName} and scorer ${scorerName}scorer. Be patient)`);
  setTimer('loadModel')

  // create a Coqui STT runtime model
  model = loadModel(modelDirectory)

  log(`Coqui STT model loaded in ${getTimer('loadModel')} msecs`)
  */

  // create the HTTP server instance
  const server = http.createServer( async (req, res) => requestListener(req, res) )

  // listen incoming client requests
  server.listen( serverPort, () => {
    log(`server ${path.basename(__filename)} running at http://localhost:${serverPort}`)
    log(`endpoint http://localhost:${serverPort}${serverPath}`)
    log('press Ctrl-C to shutdown')
    log('ready to listen incoming requests')
  })
  
  // shutdown management
  process.on('SIGTERM', shutdown )
  process.on('SIGINT', shutdown )

  //
  // Shutdown on uncaughtException 
  // https://flaviocopes.com/node-exceptions/
  //
  process.on('uncaughtException', (err) => { 
      log(`there was an uncaught error: ${err}`, 'FATAL')
      shutdown('uncaughtException')
  })
  

}

main()

