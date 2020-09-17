import {Optional, Model, Sequelize, DataTypes} from "sequelize";
import {Snowflake} from "discord.js";

module.exports = (sequelize: Sequelize) => {
    interface SettingStatAttributes {
        id: number;
        guildID: Snowflake;
        userChanID: Snowflake;
        botChanID: Snowflake;
        roleChanID: Snowflake;
        boostChanID: Snowflake;
    }
    interface SettingStatCreationAttributes extends Optional<SettingStatAttributes, "id"> {}

    class SettingStatModel extends Model<SettingStatAttributes, SettingStatCreationAttributes> implements SettingStatAttributes {
        id: number;
        guildID: Snowflake;
        userChanID: Snowflake;
        botChanID: Snowflake;
        roleChanID: Snowflake;
        boostChanID: Snowflake;
        // timestamps!
        public readonly createdAt!: Date;
        public readonly updatedAt!: Date;
    }
    SettingStatModel.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        guildID: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        userChanID: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        botChanID: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        roleChanID: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        boostChanID: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'SettingStat',
        tableName: 'setting_stat'
    });
    return SettingStatModel
}