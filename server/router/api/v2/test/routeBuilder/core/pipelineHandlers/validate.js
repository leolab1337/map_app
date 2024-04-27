import {createAsyncHandler} from "../util/createAsyncHandler.js";
import Joi from "joi";

/**
 *
 * @param {
 * [{schema: SchemaMap<any, false>, location: 'body' | 'query' | 'param' | undefined}] |
 * {schema: SchemaMap<any, false>, location: 'body' | 'query' | 'param' | undefined}
 * } validation array or object for validation, which should contain Joi validation schema and the req obj field to validate
 */
const validate = (validation) => {
    return createAsyncHandler(async function (req, res, next) {
        try {
            if(Array.isArray(validation)) {
                for(let i = 0, len=validation.length; i < len; i++)
                    await validateData(req, validation[i]);

                return next();
            }

            await validateData(req, validation);
            return next();
        } catch (error) {
            error.status = 400;
            throw error;
        }
    })
}

/**
 * @param {{}} req
 * @param {schema: SchemaMap<any, false>, location: 'body' | 'query' | 'param' | undefined} validationObj
 */
async function validateData(req, validationObj) {
    const {schema, location='body'} = validationObj;
    await Joi.object(schema).validateAsync(req[location]);
}

export default validate;