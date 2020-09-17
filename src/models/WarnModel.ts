import {Optional, Model, Sequelize, DataTypes} from "sequelize";
import {Snowflake} from "discord.js";

module.exports = (sequelize: Sequelize) => {
    interface WarnAttributes {
        id: number;
        discordID: Snowflake;
        reason: string;
        countWarn: number;
    }
    interface WarnCreationAttributes extends Optional<WarnAttributes, "id"> {}

    class WarnModel extends Model<WarnAttributes, WarnCreationAttributes> implements WarnAttributes {
        id!: number;
        discordID!: Snowflake;
        reason!: string;
        countWarn!: number;
        // timestamps!
        public readonly createdAt!: Date;
        public readonly updatedAt!: Date;
    }
    WarnModel.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        discordID: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        reason: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        countWarn: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
        sequelize,
        modelName: 'Warn',
        tableName: 'warn'
    });
    return WarnModel
}