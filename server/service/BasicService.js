import {Model} from "sequelize";
import { DEFactory } from "../router/api/v2/test/routeBuilder/core/service/dataExtractors/DEFactory.js";
import { ServiceError } from "../router/api/v2/test/routeBuilder/core/service/dataExtractors/error/ServiceError.js";
import { validateInput } from "../router/api/v2/test/routeBuilder/core/service/validateInput.js";
import { SEReason } from "../router/api/v2/test/routeBuilder/core/service/dataExtractors/error/SEReason.js";


export default class BasicService{
    /**
     * 
     * @param {Model} model to query
     * @param {string=} serviceName service name to print in logs
     */
    constructor(model, serviceName){
        this.model = model;
        this.extractor = DEFactory.create();
        this.serviceName = serviceName ?? 'BasicService';
    }

    /**
     * Create new object
     * @param {any} newObject 
     * @param {ServiceValidation=} validation 
     * @param {sequelize.CreateOptions=} options
     *
     * @returns {Promise<any> | Promise<ServiceError>}
     */
    create = async (newObject, validation, options={}) => {
        return validateInput(async () => {
            try {
                const resp = await this.model.create(newObject, options);
                return this.extractor.extract(resp);
            } catch (e) {
                console.error(`${this.serviceName} create(): Could not execute the query`, e);
                return new ServiceError({ reason: SEReason.UNEXPECTED, additional: e });
            }
        }, validation)(newObject, options);
    }

    /**
     * Read object by id
     * @param {number | string} primaryKey 
     * @param {ServiceValidation=} validation 
     * @param {Omit<sequelize.FindOptions<any>, "where">=} options 
     *
     * @returns {Promise<any> | Promise<ServiceError>}
     */
    readOneById = async (primaryKey, validation, options={}) => {
        return validateInput(async () => {
            try {
                const resp = await this.model.findByPk(primaryKey, options);
                return this.extractor.extract(resp);
            } catch(e) {
                console.error(`${this.serviceName} readOneById(): Could not execute the query`, e);
                return new ServiceError({reason: SEReason.UNEXPECTED, additional: e});
            }
        }, validation)(primaryKey, options);
    }

    /**
     * Read object by id
     * @param {sequelize.FindOptions<any>} search query
     * @param {ServiceValidation=} validation  
     *
     * @returns {Promise<any> | Promise<ServiceError>}
     */
    searchOne = async (search, validation) => {
        return validateInput(async () => {
            try {
                const resp = await this.model.findOne(search);
                return this.extractor.extract(resp);
            } catch(e) {
                console.error(`${this.serviceName} searchOne(): Could not execute the query`, e);
                return new ServiceError({reason: SEReason.UNEXPECTED, additional: e});
            }
        }, validation)(search);
    }


    /**
     * Read all objects
     * @param {sequelize.FindOptions<any>=} options
     *
     * @returns {Promise<any[]> | Promise<ServiceError>} 
     */
    async readAll(options={}) {
        try {
            const resp = await this.model.findAll(options);
            return this.extractor.extract(resp);
        } catch (e) {
            console.error(`${this.serviceName} readAll(): Could not execute the query`, e);
            return new ServiceError({reason: SEReason.UNEXPECTED, additional: e});
        }
    }

    /**
     * Update existing object
     * @param {any} objectToUpdate 
     * @param {ServiceValidation=} validation  
     * @param {sequelize.UpdateOptions=} options 
     *
     * @returns {Promise<boolean> | Promise<ServiceError>}
     */
    async update (objectToUpdate, validation, options={}) {
        return validateInput(async () => {
            try{
                const resp = await this.model.update(objectToUpdate, options);
                return resp[0] > 0;
            } catch (e){
                console.error(`${this.serviceName} update(): Could not execute the query`, e);
                return new ServiceError({reason: SEReason.UNEXPECTED, additional: e});
            }
        }, validation)(objectToUpdate, options);
    }

    /**
     * Delete object by id
     * @param {number | string} primaryKey 
     * @param {ServiceValidation=} validation 
     * @param {sequelize.DestroyOptions=} options
     *
     * @returns {Promise<boolean> | Promise<ServiceError>}
     */
    async deleteById(primaryKey, validation, options={}) {
        return validateInput(async () => {
            try {
                const resp = await this.model.destroy({ ...options, where: { id: primaryKey } });
                return resp > 0;
            } catch (e) {
                console.error(`${this.serviceName} deleteById(): Could not execute the query`, e);
                return new ServiceError({reason: SEReason.UNEXPECTED, additional: e});
            }
        }, validation)(primaryKey, options);
    } 
}