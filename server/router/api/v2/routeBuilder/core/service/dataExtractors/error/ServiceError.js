import {SEReason} from "./SEReason.js";
import {SERVICE_ERROR_TYPE_NAME} from "../../../config.js";

export class ServiceError{
    constructor({
        reason = SEReason.UNEXPECTED,
        field=null,
        message=null,
        additional=null
    }){
        this.reason = reason;
        this.field = field;
        this.message = message;
        this.additional = additional;

        this.typeSymbol = SERVICE_ERROR_TYPE_NAME;
        this.type = SERVICE_ERROR_TYPE_NAME.description;
    }
}