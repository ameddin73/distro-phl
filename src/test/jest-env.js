const JSDOMEnvironment = require("jest-environment-jsdom");

class JestEnv extends JSDOMEnvironment {
    constructor(config) {
        super(
            // this is patching a problem in jest as described here: https://github.com/facebook/jest/issues/7780#issuecomment-615890410
            Object.assign({}, config, {
                globals: Object.assign({}, config.globals, {
                    Uint32Array: Uint32Array,
                    Uint8Array: Uint8Array,
                    ArrayBuffer: ArrayBuffer,
                }),
            }),
        );
    }

    // see more https://github.com/firebase/firebase-admin-node/issues/1135
    async setup() {
        //TODO setup firebase stuff HERE so that we don't have to worry about dom stuff
    }

    async teardown() {
    }

}

module.exports = JestEnv;