import {
  DataTypes,
  Model,
  Optional,
} from "sequelize";
import sequelize from "../config/sequelize.js";

export interface PrecioProductoAttributes {
  id: number;
  descripcionPrecioProducto: string;
  estadoId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PrecioProductoCreationAttributes
  extends Optional<
    PrecioProductoAttributes,
    "id" | "createdAt" | "updatedAt"
  > {}

class PrecioProducto
  extends Model<PrecioProductoAttributes, PrecioProductoCreationAttributes>
  implements PrecioProductoAttributes
{
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
        allowNull: true,
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