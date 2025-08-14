import {
  DataTypes,
  Model,
  Optional,
} from "sequelize";
import sequelize from "../config/sequelize.js";

export interface VentaAttributes {
  id: number;
  clienteId: number;
  fechaVenta: Date;
  totalVenta: number;
  numeroDocumentoVenta?:string | null;
  serieDocumentoVenta?:string | null;
  generaIVA:boolean;
  estadoId:number;
  createdAt?: Date;
  updatedAt?: Date;
}   

export interface VentaCreationAttributes
  extends Optional<
    VentaAttributes,
    | "id"
    | "numeroDocumentoVenta"
    | "serieDocumentoVenta"
    | "createdAt"
    | "updatedAt"
  > {}

class Venta
  extends Model<VentaAttributes, VentaCreationAttributes>
  implements VentaAttributes
{
  declare id: number;
  declare clienteId: number;
  declare fechaVenta: Date;
  declare totalVenta: number;
  declare numeroDocumentoVenta?: string | null ;
  declare serieDocumentoVenta?: string | null ;
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
      fechaVenta: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "FechaVenta",
      },
      totalVenta: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        field: "TotalVenta",
      },
      numeroDocumentoVenta:{
         type: DataTypes.STRING,
        allowNull: true,
        field: "NumeroDocumentoVenta",
      },
      serieDocumentoVenta:{
         type: DataTypes.STRING,
        allowNull: true,
        field: "SerieDocumentoVenta",
      },
      generaIVA: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
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