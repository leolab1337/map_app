import DaoUtil from "../util/DaoUtil.js";
import OrderData from "../model/OrderData.js";

const daoUtil = new DaoUtil();

/**
 * The class provides functionality for manipulating(CRUD operations) with Order SQL table.
 * This table contains orders data such as manufacturer username, client username, shipment address id and delivery address id
 */
export default class OrderDataDAO {
    /**
     * The method creates new Order in the OrderData SQL table
     * @param {Object} data object with the order data, where manufacturerUsername, clientUsername, shipmentAddressId, deliveryAddressId fields are manditory
     * @returns created Order object, if operation was sucessful or null if not
     */
    async create(data) {
        const { manufacturerUsername, clientUsername, shipmentAddressId, deliveryAddressId } = data;

        if (daoUtil.containNoNullArr([manufacturerUsername, clientUsername, shipmentAddressId, deliveryAddressId]) && daoUtil.containNoBlankArr([manufacturerUsername, clientUsername])) {
            try {
                const resp = await OrderData.create(data);
                return resp;
            } catch (e) {
                console.log("OrderDataDAO: Could not execute the query");
                console.log(e);
                return null;
            }
        } else {
            console.log("OrderDataDAO: Wrong parameter provided");
            return null;
        }
    }

    /**
     * The method reads Order with provided primary key(orderId)
     * @param {int} primaryKey primary key of the order
     * @returns founded Order object, if operation was sucessful or null if not
     */
    async read(primaryKey) {
        if (primaryKey != null) {
            try {
                const resp = await OrderData.findByPk(primaryKey, { include: [{ all: true }] });
                return resp != null ? resp.dataValues : null;
            } catch (e) {
                console.log("OrderDataDAO: Could not execute the query");
                console.log(e);
                return null;
            }
        } else {
            console.error("OrderDataDAO: Wrong parameter provided");
            return null;
        }
    }

    /**
     * The method reads Order with provided primary keys(orderId)
     * @param {Array} primaryKeys array with primary keys of the orders
     * @returns array with founded Order objects, if operation was sucessful or null if not
     */
    async readByIds(primaryKeys) {
        if (primaryKeys != null) {
            try {
                let resp = await OrderData.findAll({
                    where: {
                        orderId: {
                            [Op.or]: primaryKeys
                        }
                    },
                    include: [{ all: true }]
                });

                return daoUtil.unpackOrderResp(resp);
            } catch (e) {
                console.log("OrderDataDAO: Could not execute the query");
                console.log(e);
                return null;
            }
        } else {
            console.error("OrderDataDAO: Wrong parameter provided");
            return null;
        }
    }

    /**
     * The method reads all Orders of the OrderData SQL table
     * @returns array of the founded Order objects, if operation was sucessful or null if not
     */
    async readAll() {
        try {
            const resp = await OrderData.findAll({ include: [{ all: true }] });
            return daoUtil.getDataValues(resp);
        } catch (e) {
            console.log("OrderDataDAO: Could not execute the query");
            console.log(e);
            return false;
        }
    }

    /**
     * The method updates existing Order data in the OrderDAta SQL table
     * @param {Object} data object with the order data, such as manufacturerUsername, clientUsername, shipmentAddressId, deliveryAddressId
     * @returns true, if the operation was sucessful or false if not
     */
    async update(data) {
        const { orderId } = data;

        if (orderId != null) {
            try {
                const resp = await OrderData.update(
                    data, { where: { orderId: orderId } }
                );

                return resp[0] > 0;
            } catch (e) {
                console.log("OrderDataDAO: Could not execute the query");
                console.log(e);
                return false;
            }
        } else {
            console.log("OrderDataDAO: Wrong parameter provided");
            return false;
        }
    }

    /**
     * The method deletes order with provided primary key(orderId)
     * @param {int} primaryKey primary key of the order
     * @returns true if operation was sucessful or false if not
     */
    async delete(primaryKey) {
        if (primaryKey != null) {
            try {
                const resp = await OrderData.destroy({ where: { orderId: primaryKey } });
                return resp > 0;
            } catch (e) {
                console.log("OrderDataDAO: Could not execute the query");
                console.log(e);
                return false;
            }
        } else {
            console.log("OrderDataDAO: Wrong parameter provided");
            return false;
        }
    }
}