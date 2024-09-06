import { SEReason } from "../../../../../router/api/v2/routeBuilder/core/service/dataExtractors/error/SEReason";
import MatcherReturner from "../../../jest_util/MatcherReturner";
import { isErrorWithReason } from "../isErrorWithReason";

/**
 * Jest matcher checks whenever provided param is an array 
 * containing at least one ServiceError with reason NOT_FOUND
 * @param {*} object object to check
 * @returns {{ message: () => string, pass: boolean }}
 */
export function toContainSE_NOT_FOUND(object) {
    const returner = new MatcherReturner({received: object, utils: this.utils});

    if(!object || !Array.isArray(object))
        return returner.passFalse('Received object is not array');
    
    const isValid = object.find(item => isErrorWithReason(item, SEReason.NOT_FOUND));

    return isValid ?
        returner.passTrue('Expected to not receive an array containing ServiceError with reason NOT_FOUND') :
        returner.passFalse('Expected to receive an array containing at least ServiceError with reason NOT_FOUND')
}

expect.extend({toContainSE_NOT_FOUND});