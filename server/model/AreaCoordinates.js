import SequelizeUtil from "../modules/SequelizeUtil.js";
import {DataTypes, Model} from "sequelize";
import Area from "./Area.js";


const sequelize = SequelizeUtil.getSequelizeInstance();
const options = {
    sequelize,
    modelName: 'AreaCoordinates',
    freezeTableName: true,
    timestamps: false
};

/**
 * This class represents row of the Area coordinates SQL table.
 * Used by the Sequalize ORM for communicating between Area coordinates SQL table and this software.
 */
export default class AreaCoordinates extends Model {}

AreaCoordinates.init({
    coordinateId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },

    orderNumber: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    polygonNumber: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    lon: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },

    lat: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },

    areaName: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
}, options);

//create one-to-many relationship with Area table
Area.hasMany(AreaCoordinates, { foreignKey: 'areaName' });
AreaCoordinates.belongsTo(Area, { foreignKey: 'areaName' });