/**
 * 
 *
 * @See DeepSpeech API documentation
 *      https://deepspeech.readthedocs.io/en/v0.9.3/NodeJS-API.html
 *
 * @See DeepSpeech NodeJs binding code
 *      https://github.com/mozilla/DeepSpeech/blob/master/native_client/javascript/index.ts
 *
 * @See DeepSpeech NodeJs examples 
 *      https://github.com/mozilla/DeepSpeech-examples#javascript
 *      https://github.com/mozilla/DeepSpeech-examples/blob/r0.9/nodejs_wav/index.js
 */ 

const fs = require('fs').promises
const path = require('path')
const DeepSpeech = require('deepspeech')

/**
 * deepSpeechInitialize
 *
 * Initialize the model 
 * with specified pbmm and scorer files
 *
 * @param {String} modelPath 
 * @param {String} scorerPath
 *
 * @return {Object} DeepSpeech Model
 *
 * TODO
 * - add metadata object as parameter
 *
 */
function deepSpeechInitialize(modelPath, scorerPath) {

  const model = new DeepSpeech.Model(modelPath)
  
  model.enableExternalScorer(scorerPath)
  
  return model
}  


/**
 * deepSpeechFreeModel
 *
 * Frees associated resources and destroys model object.
 *
 * @param {DeepSpeechMemoryModelObject} model
 *
 */
function deepSpeechFreeModel(model) {
  DeepSpeech.FreeModel(model)
}  


/**
 * deepSpeechTranscript
 *
 * return the speech to text (transcript) 
 * of the audio contained in the specified filename 
 *
 * The function is async to avoid the caller thread is blocked
 * - during audio file reading
 * - but especially during the DeepSpeech engine processing.
 *
 * @param {String}                      audioFile
 * @param {DeepSpeechMemoryModelObject} model
 *
 * @return {Promise<String>}            text transcript 
 */ 
async function deepSpeechTranscript(audioFile, model) {
  
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

  const modelPath = process.argv[2] || './models/deepspeech-0.9.3-models.pbmm'
  const scorerPath = process.argv[3] || './models/deepspeech-0.9.3-models.scorer'
  const audioFile = process.argv[4] || './audio/4507-16021-0012.wav'

  const scriptName = path.basename(__filename, '.js')

  console.log(`\nusage: node ${scriptName} [<model pbmm file>] [<model scorer file>] [<audio file>]`)
  console.log(`using: node ${scriptName} ${modelPath} ${scorerPath} ${audioFile}\n`)


  let start, end
 
  start = new Date()

  //
  // Initialize DeepSpeech model
  //
  const model = deepSpeechInitialize(modelPath, scorerPath)

  end = new Date() - start

  console.log()
  console.log(`pbmm                 : ${modelPath}`)
  console.log(`scorer               : ${scorerPath}`)
  console.log(`elapsed              : ${end}ms\n`)
 
  start = new Date()

  //
  // transcript an audio file
  //
  const result = await deepSpeechTranscript(audioFile, model)

  end = new Date() - start

  console.log(`audio file           : ${audioFile}`)
  console.log(`transcript           : ${result}`)
  console.log(`elapsed              : ${end}ms\n`)

  start = new Date()

  deepSpeechFreeModel(model)

  end = new Date() - start
  
  console.log(`free model elapsed   : ${end}ms\n`)

}


if (require.main === module) 
  main()


module.exports = { 
  deepSpeechInitialize,
  deepSpeechTranscript,
  deepSpeechFreeModel
}

