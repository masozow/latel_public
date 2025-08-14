import {
  DataTypes,
  Model,
  Optional,
} from "sequelize";
import sequelize from "../config/sequelize.js";

export interface PagoCuotaCreditoProveedorAttributes {
  id: bigint;
  formaPagoId: number;
  montoPagoCreditoProveedor: number;
  comprobantePagoId?: bigint | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PagoCuotaCreditoProveedorCreationAttributes
  extends Optional<
    PagoCuotaCreditoProveedorAttributes,
    "id" | "comprobantePagoId" | "createdAt" | "updatedAt"
  > {}

class PagoCuotaCreditoProveedor
  extends Model<
    PagoCuotaCreditoProveedorAttributes,
    PagoCuotaCreditoProveedorCreationAttributes
  >
  implements PagoCuotaCreditoProveedorAttributes
{
  declare id: bigint;
  declare formaPagoId: number;
  declare montoPagoCreditoProveedor: number;
  declare comprobantePagoId?: bigint | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}


  PagoCuotaCreditoProveedor.init(
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
      montoPagoCreditoProveedor: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        field: "MontoPagoCreditoProveedor",
      },
      comprobantePagoId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
        field: "ComprobantePago_Id",
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
      tableName: "PagoCuotaCreditoProveedor",
      timestamps: true,
    }
  );

export default PagoCuotaCreditoProveedor;