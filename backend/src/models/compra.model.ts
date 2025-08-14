import {
  DataTypes,
  Model,
  Optional,
} from "sequelize";
import sequelize from "../config/sequelize.js";

export interface CompraAttributes {
  id: number;
  proveedorId: number;
  fechaCompra: Date;
  totalCompra: number;
  numeroDocumentoCompra?:number | null;
  serieDocumentoCompra?:number | null;
  pagaIVA:boolean;
  compraContadoOCredito:boolean;
  estadoId:number;
  createdAt?: Date;
  updatedAt?: Date;
}   

export interface CompraCreationAttributes
  extends Optional<
    CompraAttributes,
    | "id"
    | "numeroDocumentoCompra"
    | "serieDocumentoCompra"
    | "createdAt"
    | "updatedAt"
  > {}

class Compra
  extends Model<CompraAttributes, CompraCreationAttributes>
  implements CompraAttributes
{
  declare id: number;
  declare proveedorId: number;
  declare fechaCompra: Date;
  declare totalCompra: number;
  declare numeroDocumentoCompra?: number | null ;
  declare serieDocumentoCompra?: number | null ;
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
        allowNull: true,
        field: "FechaCompra",
      },
      totalCompra: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        field: "TotalCompra",
      },
      numeroDocumentoCompra:{
         type: DataTypes.STRING,
        allowNull: true,
        field: "NumeroDocumentoCompra",
      },
      serieDocumentoCompra:{
         type: DataTypes.STRING,
        allowNull: true,
        field: "SerieDocumentoCompra",
      },
      pagaIVA: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "PagaIVA",
      },
      compraContadoOCredito: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
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