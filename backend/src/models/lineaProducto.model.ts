import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize.js";
import { LineaProductoAttributes, LineaProductoCreationAttributes } from "../schemas/lineaProducto.schema.js";

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
      allowNull: false,
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