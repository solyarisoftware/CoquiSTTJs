/**
 * @module stt.js
 *
 * @See STT API documentation
 * https://stt.readthedocs.io/en/latest/NodeJS-API.html
 *
 * @See STT NodeJs binding code
 * https://github.com/coqui-ai/STT/tree/main/native_client/javascript
 *
 * @See STT NodeJs examples 
 * https://github.com/coqui-ai/STT-examples#javascript
 */ 

const fs = require('fs').promises
const path = require('path')
const STT = require('stt')

/**
 * loadmodel
 *
 * load the model 
 * with specified pbmm and scorer files
 *
 * @param {String} modelPath 
 * @param {String} scorerPath
 *
 * @return {Object} STT Model
 *
 * TODO
 * - add metadata object as parameter
 *
 */
function loadModel(modelPath, scorerPath) {

  const model = new STT.Model(modelPath)
  
  model.enableExternalScorer(scorerPath)
  
  return model
}  


/**
 * freeModel
 *
 * Frees associated resources and destroys model object.
 *
 * @param {STTMemoryModelObject} model
 *
 */
function freeModel(model) {
  STT.FreeModel(model)
}  


/**
 * transcriptBuffer
 *
 * return the speech to text (transcript) 
 * of the audio contained in the specified audio PCM buffer 
 *
 * The function is async to avoid the caller thread is blocked
 * - during audio file reading
 * - but especially during the STT engine processing.
 *
 * @param {Buffer}               audioBuffer
 * @param {STTMemoryModelObject} model
 *
 * @return {Promise<String>}     text transcript 
 */ 
async function transcriptBuffer(audioBuffer, model) {
  
  // WARNING: 
  // no audioBuffer validation is done.
  // The audio fle must be a WAV audio in raw format.
	
  try { 
    const transcript = model.stt(audioBuffer)
    return transcript
  }
  catch (error) { 
    throw `model.stt error: ${error}` 
  } 
    
}


/**
 * transcriptFile
 *
 * return the speech to text (transcript) 
 * of the audio contained in the specified filename 
 *
 * The function is async to avoid the caller thread is blocked
 * - during audio file reading
 * - but especially during the STT engine processing.
 *
 * @param {String}               audioFile
 * @param {STTMemoryModelObject} model
 *
 * @return {Promise<String>}     text transcript 
 */ 
async function transcriptFile(audioFile, model) {
  
  let audioBuffer

  // read the Wav file in memory
  try { 
    audioBuffer = await fs.readFile(audioFile) 
  }  
  catch (error) { 
    throw `readFile error: ${error}` 
  } 

  // WARNING: 
  // no audioBuffer validation is done.
  // The audio fle must be a WAV audio in raw format.
	
  try { 
    const transcript = model.stt(audioBuffer)
    return transcript
  }
  catch (error) { 
    throw `model.stt error: ${error}` 
  } 
    
}


async function main() {

  const scriptName = path.basename(__filename, '.js')

  if (process.argv.length < 5) { 
    console.log()
    console.log(`usage  : node ${scriptName} <model pbmm file> <model scorer file> <audio file>`)
    console.log(`example: node ${scriptName} models/coqui-stt-0.9.3-models.pbmm models/coqui-stt-0.9.3-models.scorer audio/4507-16021-0012.wav`)
    console.log()
    process.exit(1)  
  }  
  
  const modelPath = process.argv[2]
  const scorerPath = process.argv[3]
  const audioFile = process.argv[4]

  const startModel = new Date()

  //
  // load STT model
  //
  const model = loadModel(modelPath, scorerPath)

  const stopModel = new Date()

  console.log()
  console.log(`pbmm                 : ${modelPath}`)
  console.log(`scorer               : ${scorerPath}`)
  console.log(`elapsed              : ${stopModel - startModel}ms\n`)
 
  const startTranscript = new Date()

  //
  // transcript an audio file
  //
  const result = await transcriptFile(audioFile, model)

  const stopTranscript = new Date()

  console.log(`audio file           : ${audioFile}`)
  console.log(`transcript           : ${result}`)
  console.log(`elapsed              : ${stopTranscript - startTranscript}ms\n`)

  const startFreeModel = new Date()

  freeModel(model)

  const stopFreeModel = new Date()
  
  console.log(`free model elapsed   : ${stopFreeModel - startFreeModel}ms\n`)

}


if (require.main === module) 
  main()


module.exports = { 
  loadModel,
  transcriptBuffer,
  transcriptFile,
  transcript: transcriptFile, // alias
  freeModel
}

