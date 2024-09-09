import { SEReason } from "../../../../../router/api/v2/routeBuilder/core/service/dataExtractors/error/SEReason";
import MatcherReturner from "../../../jest_util/MatcherReturner";
import { isErrorWithReason } from "../isErrorWithReason";

/**
 * Jest matcher checks whenever provided param is an array 
 * containing at least one ServiceError with reason MISCONFIGURED
 * @param {*} object object to check
 * @returns {{ message: () => string, pass: boolean }}
 */
export function toContainSE_MISCONFIGURED(object) {
    const returner = new MatcherReturner({received: object, utils: this.utils});

    if(!object || !Array.isArray(object))
        return returner.passFalse('Received object is not array');
    
    const isValid = object.find(item => isErrorWithReason(item, SEReason.MISCONFIGURED));

    return isValid ?
        returner.passTrue('Expected to not receive an array containing any ServiceErrors with reason MISCONFIGURED') :
        returner.passFalse('Expected to receive an array containing at least one ServiceError with reason MISCONFIGURED')
}

expect.extend({toContainSE_MISCONFIGURED});