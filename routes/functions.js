/*
- check if the function is already loaded
- if not, load the function in memory and call it
- if yes, call it
*/
const fork = require('child_process').fork

async function wasmForkFunctions (fastify, options) {

  let wasmProcesses = options.wasmProcesses
  let wasmFunctionsFolder = options.wasmFunctionsFolder

  /*
  url_api=$(gp url 8080)
  function_name="hey"
  function_version="0.0.0"
  http POST "${url_api}/functions/${function_name}/${function_version}" \
      name=Bob \
      rwaapi_data:"hello world" \
      rwaapi_token:"tada"
  */

  fastify.post(`/functions/:function_name/:function_version`, async (request, reply) => {
    let jsonParameters = request.body
    let headers = request.headers
    
    let functionName = request.params.function_name
    let functionVersion = request.params.function_version

    if(request.headers["rwaapi_data"] === undefined) { request.headers["rwaapi_data"] = `` }
    if(request.headers["rwaapi_token"] === undefined) { request.headers["rwaapi_token"] = `` }
    if(request.headers["rwaapi_function_name"] === undefined) { request.headers["rwaapi_function_name"] = functionName }
    if(request.headers["rwaapi_function_version"] === undefined) { request.headers["rwaapi_function_version"] = functionVersion }

    let wasmFile = `${functionName}_v_${functionVersion}.wasm`

    var newWasmProcess

    if(wasmProcesses[wasmFile]) {
      // call it
      newWasmProcess = wasmProcesses[wasmFile] 

      newWasmProcess.send({
        cmd: "exec",
        wasmFile: wasmFile,
        //wasmFunctionsFolder: wasmFunctionsFolder,
        jsonParameters: jsonParameters,
        headers: headers
      })
      
    } else {
      // load it, then call it
      newWasmProcess = fork("./libs/wasm.child.process.js")
      wasmProcesses[wasmFile] = newWasmProcess

      newWasmProcess.send({
        cmd: "load",
        wasmFile: wasmFile,
        wasmFunctionsFolder: wasmFunctionsFolder,
        jsonParameters: jsonParameters,
        headers: headers
      })

    } // endif

    newWasmProcess.once("message", (message) => {
      if(message.success) {
        reply
          .header('Content-Type', 'application/json; charset=utf-8')
          .send({result: JSON.parse(message.success)})
      } else {
        if(message.failure) {
          reply.code(500).send({failure: message.failure})
        } else {
          reply.code(500).send({failure: "unknown error"})
        }
      }
    })
    await reply
  })
}

module.exports = wasmForkFunctions
