import OrderData from "../model/OrderData.js";
import {Op, QueryTypes} from "sequelize";
import BasicService from "./BasicService.js";
import { idField } from "./validation/idField.js";
import { orderCreate, orderIds, orderUpdate } from "./validation/order.js";
import { DEFactory } from "../router/api/v2/routeBuilder/core/service/dataExtractors/DEFactory.js";
import Client from "../model/Client.js";
import { validateInput } from "../router/api/v2/routeBuilder/core/service/validateInput.js";
import { ServiceError } from "../router/api/v2/routeBuilder/core/service/dataExtractors/error/ServiceError.js";
import { SEReason } from "../router/api/v2/routeBuilder/core/service/dataExtractors/error/SEReason.js";
import isServiceError from "../router/api/v2/routeBuilder/core/service/dataExtractors/error/isServiceError.js";

/**
 * The class provides functionality for manipulating(CRUD operations) with Order SQL table.
 * This table contains orders data such as manufacturer username, client username, shipment address id and delivery address id
 */
export default class OrderDataService {
    constructor() {
        this.extractor = DEFactory.create();
        this.service = new BasicService(OrderData, 'OrderDataService');
    }
    
    /**
     * The method creates new Order in the OrderData SQL table
     * @param {OrderData} data object with the order data, where manufacturerUsername, clientUsername, shipmentAddressId, deliveryAddressId fields are mandatory
     * @returns created Order object, if operation was successful or null if not
     */
    async create(data) {
        return this.service.create(data, orderCreate);
    }

    /**
     * The method reads Order with provided primary key(orderId)
     * @param {int} primaryKey primary key of the order
     * @param {int} profileId 
     * @returns founded Order object, if operation was successful or null if not
     */
    async readOneByIdAndProfileId(id, profileId) {
        return this.service.readOneById(id, idField, {
            where: {profileId}, 
            include: [
                { model: Client, as: 'Sender' },
                { model: Client, as: 'Recipient' }
            ]
        });
    }

    async readOneById(id) {
        return this.service.readOneById(id, idField);
    }

    /**
     * The method reads Order with provided primary keys(orderId)
     * @param {int[]} primaryKeys array with primary keys of the orders
     * @param {number} profileId 
     * @returns array with founded Order objects, if operation was successful or null if not
     */
    deleteProfileOrdersByIds = validateInput(async (primaryKeys, profileId) => {
        return this.service.deleteByCondition({
            where: {
                id: {
                    [Op.or]: primaryKeys
                },
                profileId
            },
            include: [
                { model: Client, as: 'Sender' },
                { model: Client, as: 'Recipient' }
           ]
        });
    }, orderIds);

    /**
     * The method reads all Orders of the OrderData SQL table
     * @param {int} profileId 
     * @returns array of the founded Order objects, if operation was successful or null if not
     */
    async readAllByProfileId(profileId, pagination) {
        return this.service.readAll({
            where: {
                profileId
            },
            include: [
                { model: Client, as: 'Sender' },
                { model: Client, as: 'Recipient' }
            ],
            limit: pagination?.limit,
            offset: pagination?.offset
        });
    }

    async readAllByIds(orderIds) {
        return this.service.readAll({
            where: {
                [Op.or]: {id: orderIds}
            },
            include: [
                { model: Client, as: 'Sender' },
                { model: Client, as: 'Recipient' }
            ]
        });
    }

    /**
     * 
     * @param {number} profileId 
     * @param {number[]} orderIds 
     * @returns 
     */
    async readOrderIdsByProfileIdAndIds(profileId, orderIds) {
        const orders = await this.service.readAll({
            attributes: ['id'],
            where: {
                profileId,
                [Op.or]: {id: orderIds}
            },
            include: [
                { model: Client, as: 'Sender' },
                { model: Client, as: 'Recipient' }
            ]
        });

        if(orders && (isServiceError(orders) || isServiceError(orders[0])))
            return orders;

        if(!orders || orders.length === 0)
            return new ServiceError({reason: SEReason.NOT_FOUND, message: 'Could not find any orders'});

        return orders.map(o => o.id);
    }

    /**
     * The method updates existing Order data in the OrderDAta SQL table
     * @param {Partial<OrderData>} data object with the order data, such as manufacturerUsername, clientUsername, shipmentAddressId, deliveryAddressId
     * @returns true, if the operation was successful or false if not
     */
    async update(data) {
        return this.service.updateById(data, orderUpdate);
    }

    /**
     * The method deletes order with provided primary key(orderId)
     * @param {int} primaryKey primary key of the order
     * @returns true if operation was successful or false if not
     */
    async delete(primaryKey) {
        return this.service.deleteById(primaryKey, idField);
    }

     /**
     * The method deletes order with provided primary key(orderId)
     * @param {sequelize.DestroyOptions} condition primary key of the order
     * @returns true if operation was successful or false if not
     */
     async deleteByCondition(condition) {
        return this.service.deleteByCondition(condition);
    }
}