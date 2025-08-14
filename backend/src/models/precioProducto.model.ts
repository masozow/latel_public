import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize.js";
import { PrecioProductoAttributes, PrecioProductoCreationAttributes } from "../schemas/precioProducto.schema.js";

class PrecioProducto extends Model<PrecioProductoAttributes, PrecioProductoCreationAttributes> implements PrecioProductoAttributes {
  declare id: number;
  declare descripcionPrecioProducto: string;
  declare estadoId: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

PrecioProducto.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      field: "Id",
    },
    descripcionPrecioProducto: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: "DescripcionPrecioProducto",
    },
    estadoId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: "Estado_Id",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "createdAt",
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "updatedAt",
    },
  },
  {
    sequelize,
    tableName: "PrecioProducto",
    timestamps: true,
  }
);

export default PrecioProducto;