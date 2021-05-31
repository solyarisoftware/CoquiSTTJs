const packageJson = require('../package')

const version = packageJson.version
const coquiSttVersion = packageJson.dependencies.stt.slice(1)
//const authorName = packageJson.author.name
const moduleName = packageJson.name

const info = () =>
  `package ${moduleName} version ${version}, Coqui STT version ${coquiSttVersion}`

function main() {
  console.log( info() )
}  

if (require.main === module) 
  main()

module.exports = { info }

