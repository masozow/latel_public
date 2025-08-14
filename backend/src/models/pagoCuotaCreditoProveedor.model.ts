import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize.js";
import { PagoCuotaCreditoProveedorAttributes, PagoCuotaCreditoProveedorCreationAttributes } from "../schemas/pagoCuotaCreditoProveedor.schema.js";

class PagoCuotaCreditoProveedor
  extends Model<PagoCuotaCreditoProveedorAttributes, PagoCuotaCreditoProveedorCreationAttributes>
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