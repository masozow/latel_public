import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize.js";
import { DetalleVentaAttributes, DetalleVentaCreationAttributes } from "../schemas/detalleVenta.schema.js";

class DetalleVenta
  extends Model<DetalleVentaAttributes, DetalleVentaCreationAttributes>
  implements DetalleVentaAttributes
{
  declare id: bigint;
  declare ventaId: number;
  declare productoId: number;
  declare cantidadVenta: number;
  declare precioVenta: number;
  declare subTotalVenta: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

DetalleVenta.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      field: "Id",
    },
    ventaId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: "Venta_Id",
    },
    productoId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: "Producto_Id",
    },
    cantidadVenta: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "CantidadVenta",
    },
    precioVenta: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      field: "PrecioVenta",
    },
    subTotalVenta: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      field: "SubTotalVenta",
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
    tableName: "DetalleVenta",
    timestamps: true,
  }
);

export default DetalleVenta;