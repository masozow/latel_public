import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize.js";
import { DetalleCompraAttributes, DetalleCompraCreationAttributes } from "../schemas/detalleCompra.schema.js";

class DetalleCompra
  extends Model<DetalleCompraAttributes, DetalleCompraCreationAttributes>
  implements DetalleCompraAttributes
{
  declare id: bigint;
  declare compraId: number;
  declare productoId: number;
  declare cantidadCompra: number;
  declare precioCompra: number;
  declare subTotalCompra: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

DetalleCompra.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      field: "Id",
    },
    compraId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: "Compra_Id",
    },
    productoId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: "Producto_Id",
    },
    cantidadCompra: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "CantidadCompra",
    },
    precioCompra: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      field: "PrecioCompra",
    },
    subTotalCompra: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      field: "SubTotalCompra",
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
    tableName: "DetalleCompra",
    timestamps: true,
  }
);

export default DetalleCompra;