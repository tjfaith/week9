"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookInstance = void 0;
const { DataTypes, Model } = require("sequelize");
const database_config_1 = __importDefault(require("../config/database.config"));
class BookInstance extends Model {
}
exports.BookInstance = BookInstance;
BookInstance.init({
    id: {
        type: DataTypes.UUIDV4,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    icon: {
        type: DataTypes.STRING,
        allowNull: true
    },
    bookSummary: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    bookLink: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isPublished: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    datePublished: {
        type: DataTypes.TIME,
        defaultValue: new Date().getTime(),
        allowNull: false
    },
    serialNumber: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    author_id: {
        type: DataTypes.UUIDV4,
        allowNull: false
    }
}, {
    sequelize: database_config_1.default,
    tableName: 'books'
});
// BookInstance.hasOne(AuthorInstance, {primaryKey:'id', as: 'author'})
// AuthorInstance.belongsTo(BookInstance, {foreignKey:'author_id', as: 'authors'})
// // BookInstance(AuthorInstance, {foreignKey:'author_id', as: 'books'})
// AuthorInstance.belongsTo(BookInstance, {foreignKey:'author_id', as: 'authors'})
