import Client from "../model/Client.js";
import BasicService from "./BasicService.js";
import { clientCreate, clientUpdate } from "./validation/client.js";
import { idField } from "./validation/idField.js";
import OrderDataService from "./OrderDataService.js";
import { DEFactory } from "../router/api/v2/routeBuilder/core/service/dataExtractors/DEFactory.js";
import { validateInput } from "../router/api/v2/routeBuilder/core/service/validateInput.js";
import { SERVICE_ERROR_TYPE_NAME } from "../router/api/v2/routeBuilder/core/config.js";
import { ServiceError } from "../router/api/v2/routeBuilder/core/service/dataExtractors/error/ServiceError.js";
import { SEReason } from "../router/api/v2/routeBuilder/core/service/dataExtractors/error/SEReason.js";

/**
 * The class provides functionality for manipulating(CRUD operations) with Client SQL table.
 * This table contains clients data such as client username and name
 */
export default class ClientService {
    constructor() {
        this.extractor = DEFactory.create();
        this.service = new BasicService(Client, 'ClientService');
        this.orderService = new OrderDataService();
    }
    
    /**
     * The method creates new client in the Client SQL table
     * @param {Client} data object with the client data, where clientUsername field is mandatory
     * @returns created Client object, if operation was successful or null if not
     */
    create = validateInput(async (data) => {
        const { username } = data;

        try {
            const isClient = await this.service.searchOne({where: {
                username: username
            }});

            if(isClient)
                return new ServiceError({
                    reason: SEReason.NOT_UNIQUE,
                    message: 'Client with that username already exists',
                    field: 'username'
                });

            return this.service.create(data);
        } catch (e) {
            console.error('ClientService create: Could not execute the query');
            return new ServiceError({ reason: SEReason.UNEXPECTED, additional: e });
        }
    }, clientCreate)

    /**
     * The method reads Client with provided primary key(clientUsername)
     * @param {number} id primary key of the client
     * @param {number} profileId 
     * @returns founded Client object, if operation was successful or null if not
     */
    async readOneByIdAndProfileId(id, profileId) {
        return this.service.searchOne({where: {id, profileId}});
    }

    /**
     * The method reads all Clients of the Client SQL table
     * @param {number} profileId 
     * @returns array of the founded Client objects, if operation was successful or null if not
     */
    async readAllByProfileId(profileId, pagination) {
        return this.service.readAll({
            where: {profileId},
            limit: pagination?.limit,
            offset: pagination?.offset
        });
    }

    /**
     * The method updates existing client data in the Client SQL table
     * @param {Client} data object with the client data, such as clientUsername or name
     * @returns true, if the operation was successful or false if not
     */
     update = validateInput(async(client) => {
        if(!client.username)
            return this.service.updateById(client);

        try {
            const existingClient = await this.service.searchOne({where: {username: client.username}});
            if(!existingClient)
                return this.service.updateById(client);

            const isServiceError = existingClient.type && existingClient.type === SERVICE_ERROR_TYPE_NAME.description;

            if(!isServiceError && existingClient.id !== client.id)
                return new ServiceError({
                    reason: SEReason.NOT_UNIQUE,
                    field: 'username',
                    message: 'Client with this username already exists'
                });

            return this.service.updateById(client);
        } catch (e) {
            console.error(`ClientService update(): Could not execute the query`, e);
            return new ServiceError({reason: SEReason.UNEXPECTED, additional: e});
        }
    }, clientUpdate);

    /**
     * The method deletes client with provided primary key(clientUsername)
     * @param {string} primaryKey primary key of the client
     * @returns true if operation was successful or false if not
     */
    delete = validateInput(async (primaryKey) => {
        try {  
            await this.orderService.deleteByCondition({where: {senderId: primaryKey}});
            await this.orderService.deleteByCondition({where: {recipientId: primaryKey}});
            return this.service.deleteById(primaryKey);
        } catch (e) {
            console.error(`ClientService delete(): Could not execute the query`, e);
            return new ServiceError({reason: SEReason.UNEXPECTED, additional: e});
        }
    }, idField); 
}