import SequelizeUtil from "../modules/SequelizeUtil.js";
import {DataTypes, Model} from "sequelize";
import Client from "./Client.js";


const sequelize = SequelizeUtil.getSequelizeInstance();
const options = {
    sequelize,
    modelName: 'OrderData',
    freezeTableName: true,
    timestamps: false
};

/**
 * This class represents row of the Order Data SQL table.
 * Used by the Sequalize ORM for communicating between Order data SQL table and this software.
 */
export default class OrderData extends Model {}

OrderData.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },

    senderId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    recipientId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, options);

Client.hasMany(OrderData, { foreignKey: 'senderId' });
Client.hasMany(OrderData, { foreignKey: 'recipientId' });

OrderData.belongsTo(Client, { foreignKey: 'senderId' });
OrderData.belongsTo(Client, { foreignKey: 'recipientId' });