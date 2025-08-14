import {
  DataTypes,
  Model,
  Optional,
} from "sequelize";
import sequelize from "../config/sequelize.js";

export interface LineaProductoAttributes {
  id: number;
  descripcionLineaProducto: string;
  estadoId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LineaProductoCreationAttributes
  extends Optional<
    LineaProductoAttributes,
    "id" | "createdAt" | "updatedAt"
  > {}

class LineaProducto
  extends Model<LineaProductoAttributes, LineaProductoCreationAttributes>
  implements LineaProductoAttributes
{
  declare id: number;
  declare descripcionLineaProducto: string;
  declare estadoId: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}


  LineaProducto.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        field: "Id",
      },
      descripcionLineaProducto: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        field: "DescripcionLineaProducto",
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
      tableName: "LineaProducto",
      timestamps: true,
    }
  );

export default LineaProducto;