let imports = {};
let wasm;
const { TextDecoder } = require(String.raw`util`);

let WASM_VECTOR_LEN = 0;

let cachegetNodeBufferMemory0 = null;
function getNodeBufferMemory0() {
    if (cachegetNodeBufferMemory0 === null || cachegetNodeBufferMemory0.buffer !== wasm.memory.buffer) {
        cachegetNodeBufferMemory0 = Buffer.from(wasm.memory.buffer);
    }
    return cachegetNodeBufferMemory0;
}

function passStringToWasm0(arg, malloc) {

    const len = Buffer.byteLength(arg);
    const ptr = malloc(len);
    getNodeBufferMemory0().write(arg, ptr, len);
    WASM_VECTOR_LEN = len;
    return ptr;
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}
/**
* @param {string} parameters
* @param {string} headers
* @returns {string}
*/
module.exports.handle = function(parameters, headers) {
    try {
        var ptr0 = passStringToWasm0(parameters, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ptr1 = passStringToWasm0(headers, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        wasm.handle(8, ptr0, len0, ptr1, len1);
        var r0 = getInt32Memory0()[8 / 4 + 0];
        var r1 = getInt32Memory0()[8 / 4 + 1];
        return getStringFromWasm0(r0, r1);
    } finally {
        wasm.__wbindgen_free(r0, r1);
    }
};

module.exports.initializeWasm = function(wasmFile, args, options) {
  
    return new Promise((resolve, reject) => {
        try {
            const path = require('path').join(__dirname, wasmFile)
            const bytes = require('fs').readFileSync(path)

            const wasmModule = new WebAssembly.Module(bytes)
            const wasmInstance = new WebAssembly.Instance(wasmModule, imports)

            wasm = wasmInstance.exports
            resolve(wasm)
        } catch (error) {
            reject(error)
        }
    })
}

module.exports.__wasm = wasm;

