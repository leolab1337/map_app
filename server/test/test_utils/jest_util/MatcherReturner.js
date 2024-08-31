/**
 * Class for helping to return appropriate responses for jest custom matchers
 */
export default class MatcherReturner{
    /**
     * 
     * @param {{ expected?: any, received?: any, utils?: any }=} param0 
     */
    constructor({ expected, received, utils } = {}){
        this.#expected = expected;
        this.#received = received;
        this.#utils = utils;
    }
    #expected;
    #received;
    #utils;

    /**
     * Returns an object required for jest matcher function 
     * to return with field pass set to false 
     * @param {string} message message to print
     * @param {{ onlyMessage?: boolean, expected?: any }=} options options for some additional info to print
     * @returns {{ pass: false, message: () => string }}
    */
    passFalse(message, options) {
        const messageToPrint = this.#determineMessageToPrint(message, options);
        
        return {
            message: () => messageToPrint,
            pass: false
        }
    }

    /**
     * Returns an object required for jest matcher function 
     * to return with field pass set to true 
     * @param {string} message message to print
     * @param {{ onlyMessage?: boolean, expected?: any }=} options options for some additional info to print
     * @returns {{ pass: true, message: () => string }}
    */
    passTrue(message, options) {
        const messageToPrint = this.#determineMessageToPrint(message, options);
    
        return {
            message: () => messageToPrint,
            pass: true
        }
    }

    /**
     * Returns an appropriate message to print 
     * based on the class state and provided param
     * @param {string} message message to print
     * @param {{ onlyMessage?: boolean, expected?: any }=} options options for some additional info to print
     * @returns {string}
    */
    #determineMessageToPrint(message, options){
        if((options && options.onlyMessage) || !this.#utils)
            return message;

        let messageToPrint = message;

        const expected = options?.expected ?? this.#expected;

        const expectedMsg = expected ? `\nExpected ${this.#utils.printReceived(expected)}` : '';
        const receivedMsg = this.#received ? `\nReceived ${this.#utils.printExpected(this.#received)}\n` : '';

        return message + expectedMsg + receivedMsg;
    }
}