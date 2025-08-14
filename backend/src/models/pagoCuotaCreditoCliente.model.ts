import {
  DataTypes,
  Model,
  Optional,
} from "sequelize";
import sequelize from "../config/sequelize.js";

export interface PagoCuotaCreditoClienteAttributes {
  id: bigint;
  formaPagoId: number;
  montoPagoCuotaCreditoCliente: number;
  comprobantePagoId?: number | null;
  estadoId:number;
  createdAt?: Date;
  updatedAt?: Date;
}   

export interface PagoCuotaCreditoClienteCreationAttributes
  extends Optional<
    PagoCuotaCreditoClienteAttributes,
    | "id"
    | "comprobantePagoId"
    | "createdAt"
    | "updatedAt"
  > {}

class PagoCuotaCreditoCliente
  extends Model<PagoCuotaCreditoClienteAttributes, PagoCuotaCreditoClienteCreationAttributes>
  implements PagoCuotaCreditoClienteAttributes
{
  declare id: bigint;
  declare formaPagoId: number;
  declare montoPagoCuotaCreditoCliente: number;
  declare comprobantePagoId?: number | null;
  declare estadoId: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}


  PagoCuotaCreditoCliente.init(
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        field: "Id",
      },
      formaPagoId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        field: "FormaPago_Id",
      },
      montoPagoCuotaCreditoCliente: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        field: "MontoPagoCuotaCreditoCliente",
      },
      comprobantePagoId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
        field: "ComprobantePago_Id",
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
      tableName: "PagoCuotaCreditoCliente",
      timestamps: true,
    }
  );

export default PagoCuotaCreditoCliente;