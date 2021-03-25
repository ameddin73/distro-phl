// this is patching a problem in jest as described here: https://github.com/facebook/jest/issues/7780#issuecomment-615890410
const JSDOMEnvironment = require("jest-environment-jsdom");

class JestEnv extends JSDOMEnvironment {
    constructor(config) {
        super(
            Object.assign({}, config, {
                globals: Object.assign({}, config.globals, {
                    Uint32Array: Uint32Array,
                    Uint8Array: Uint8Array,
                    ArrayBuffer: ArrayBuffer,
                }),
            }),
        );
    }

    async setup() {
    }

    async teardown() {
    }

}

module.exports = JestEnv;