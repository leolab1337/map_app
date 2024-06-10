import StringValidator from "../util/StringValidator.js";
import DaoUtil from "../util/DaoUtil.js";
import Address from "../model/Address.js";
import BasicService from "./BasicService.js";
import { addressCreate, addressSearch, addressUpdate } from "./validation/address.js";
import { idField } from "./validation/idField.js";


const stringValidator = new StringValidator();
const daoUtil = new DaoUtil();

/**
 * The class provides functionality for manipulating(CRUD operations) with Address SQL table.
 * This table contains addresses data such as city, street, building number, flat and coordinates(lon, lat)
 */
export default class AddressService {
    constructor() {
        this.extractor = DEFactory.create();
        this.service = new BasicService(Address, 'AddressService');
    }

    /**
     * The method creates new address in the Address SQL table
     * @param {Object} data object with the address data, where city, street, building, lon, lat fields are mandatory
     * @returns created Address object, if operation was successful or null if not
     */
    async create(data) {
        return this.service.create(data, addressCreate);
    }

    /**
     * The method reads Address with provided primary key(addressId)
     * @param {int} primaryKey primary key of the address
     * @returns founded Address object, if operation was successful or null if not
     */
    async read(primaryKey) {
        return this.service.readOneById(primaryKey, idField);
    }

    /**
     * The method reads all Address of the Address SQL table
     * @returns founded Addresses objects array, if operation was successful or null if not
     */
    async readAll() {
        return this.service.readAll();
    }

    /**
     * The method updates existing address data in the Address SQL table
     * @param {Object} data object with the address data, such as city, street, building, flat, lon, lat
     * @returns updated Address object, if operation was successful or null if not
     */
    async update(data) {
        return this.service.update(data, { where: { addressId: addressId } }, addressUpdate);
    }

    /**
     * The method deletes Address with provided primary key(addressId)
     * @param {int} primaryKey primary key of the address
     * @returns true if operation was successful or false if not
     */
    async delete(primaryKey) {
        return this.service.deleteById(primaryKey, idField);
    }

    /**
     * The method searches for all Address with provided fields
     * @param {Object} options object, which contains searching parameters, such as city, street, building, flat, lon, lat
     * @returns founded Address objects array, if operation was successful or null if not
     */
    async search(options) {
        return this.service.searchOne({where: options}, addressSearch);
    }
}