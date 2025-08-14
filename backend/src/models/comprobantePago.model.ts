import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize.js";
import { ComprobantePagoAttributes, ComprobantePagoCreationAttributes } from "../schemas/comprobantePago.schema.js";

class ComprobantePago
  extends Model<ComprobantePagoAttributes, ComprobantePagoCreationAttributes>
  implements ComprobantePagoAttributes
{
  declare id: bigint;
  declare numeroDocumentoComprobantePago?: string | null;
  declare serieDocumentoComprobantePago?: string | null;
  declare codigoIdentificadorComprobantePago?: string | null;
  declare fechaDocumentoComprobantePago: Date;
  declare entidadBancariaId?: number | null;
  declare montoComprobantePago: number;
  declare anotacionComprobantePago?: string | null;
  declare estadoId: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

ComprobantePago.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      field: "Id",
    },
    numeroDocumentoComprobantePago: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "NumeroDocumentoComprobantePago"
    },
    serieDocumentoComprobantePago: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "SerieDocumentoComprobantePago"
    },
    codigoIdentificadorComprobantePago: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "CodigoIdentificadorComprobantePago"
    },
    fechaDocumentoComprobantePago: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "FechaDocumentoComprobantePago",
    },
    entidadBancariaId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      field: "EntidadBancaria_Id",
    },
    montoComprobantePago: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      field: "MontoComprobantePago",
    },
    anotacionComprobantePago: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "AnotacionComprobantePago"
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
    tableName: "ComprobantePago",
    timestamps: true,
  }
);

export default ComprobantePago;