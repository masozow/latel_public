import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize.js";
import { CompraAttributes, CompraCreationAttributes } from "../schemas/compra.schema.js";

class Compra
  extends Model<CompraAttributes, CompraCreationAttributes>
  implements CompraAttributes
{
  declare id: number;
  declare proveedorId: number;
  declare fechaCompra: Date;
  declare totalCompra: number;
  declare numeroDocumentoCompra?: string | null;
  declare serieDocumentoCompra?: string | null;
  declare pagaIVA: boolean;
  declare compraContadoOCredito: boolean;
  declare estadoId: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Compra.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      field: "Id",
    },
    proveedorId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: "Proveedor_Id",
    },
    fechaCompra: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "FechaCompra",
    },
    totalCompra: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      field: "TotalCompra",
    },
    numeroDocumentoCompra: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "NumeroDocumentoCompra",
    },
    serieDocumentoCompra: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "SerieDocumentoCompra",
    },
    pagaIVA: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: "PagaIVA",
    },
    compraContadoOCredito: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: "CompraContadoOCredito",
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
    tableName: "Compra",
    timestamps: true,
  }
);

export default Compra;