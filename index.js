/**
 * @module index.js 
 */ 
const stt = require('./stt')

const publicFuntions = stt

module.exports = stt

// debug
if (require.main === module) {
  console.log(publicFuntions)
}  

