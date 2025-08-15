import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize.js";
import { VentaAttributes, VentaCreationAttributes } from "../schemas/venta.schema.js";
import { DetalleVentaAttributes } from "../schemas/detalleVenta.schema.js";

class Venta
  extends Model<VentaAttributes, VentaCreationAttributes>
  implements VentaAttributes
{
  declare id: number;
  declare clienteId: number;
  declare bodegaId: number;
  declare fechaVenta: Date;
  declare totalVenta: number;
  declare numeroDocumentoVenta?: string | null;
  declare serieDocumentoVenta?: string | null;
  declare detalleVenta: DetalleVentaAttributes[];
  declare generaIVA: boolean;
  declare estadoId: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Venta.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      field: "Id",
    },
    clienteId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: "Cliente_Id",
    },
    bodegaId: { // NUEVO CAMPO
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: "Bodega_Id",
    },
    fechaVenta: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "FechaVenta",
    },
    totalVenta: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      field: "TotalVenta",
    },
    numeroDocumentoVenta: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "NumeroDocumentoVenta",
    },
    serieDocumentoVenta: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "SerieDocumentoVenta",
    },
    generaIVA: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: "GeneraIVA",
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
    tableName: "Venta",
    timestamps: true,
  }
);

export default Venta;