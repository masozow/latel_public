import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize.js";
import { TipoProductoAttributes, TipoProductoCreationAttributes } from "../schemas/tipoProducto.schema.js";

class TipoProducto
  extends Model<TipoProductoAttributes, TipoProductoCreationAttributes>
  implements TipoProductoAttributes
{
  declare id: number;
  declare descripcionTipoProducto: string;
  declare estadoId: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

TipoProducto.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      field: "Id",
    },
    descripcionTipoProducto: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: "DescripcionTipoProducto",
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
    tableName: "TipoProducto",
    timestamps: true,
  }
);

export default TipoProducto;