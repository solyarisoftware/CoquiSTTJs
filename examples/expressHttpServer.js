#!/usr/bin/env node

const path = require('path')
const express = require('express')

const { getArgs } = require('../lib/getArgs')
const { log } = require('../lib/log')
const { info } = require('../lib/info')
const { unixTimeMsecs, setTimer, getTimer } = require('../lib/chronos')

const { transcriptThread } = require('./thread_transcript')

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


function shutdown(signal) {

  log(`${signal} received`)
  
  log('Shutdown done')
  
  process.exit(0)
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
  return result.text 
}  


function successResponse(requestId, json, res) {
  log(`response ${requestId} ${json}`)
  res.end(json)
}


async function responseTranscriptPost(id, buffer, model, scorer, acceptText, res) {

  // log POST request  
  log(`request POST ${id} ${'speechBuffer'} ${model} ${scorer}`)

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
    const result = await transcriptThread( model, scorer, buffer )

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


async function main() {

  // get command line arguments 
  const { args } = getArgs()
  
  //const programName = path.basename(__filename, '.js')
  const programName = 'expressHttpServer' 

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

  const app = express()

  app.use(express.raw({ type: '*/*' }))

  app.post( serverPath, async (req, res) => {
    

    // set id to the is query string argument 
    // if id argument is not present in the quesy string, 
    // set the id with current timestamp in msecs.
    const currentTime = unixTimeMsecs()
    //const id = requestedId ? requestedId : currentTime
    const id = currentTime

    
    const requestAcceptText = false 
    const speechAsBuffer = req.body

    await responseTranscriptPost(id, speechAsBuffer, modelName, scorerName, requestAcceptText, res)

    //console.log(req.body);
    // res.end();
  })

  app.listen(HTTP_PORT, (err) => {
    if (!err) {
      log(`server ${path.basename(__filename)} running at http://localhost:${serverPort}`)
      log(`endpoint http://localhost:${serverPort}${serverPath}`)
      log('press Ctrl-C to shutdown')
      log('ready to listen incoming requests')
    }  
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

