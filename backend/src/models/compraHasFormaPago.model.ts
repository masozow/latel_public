import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize.js";
import { CompraHasFormaPagoAttributes, CompraHasFormaPagoCreationAttributes } from "../schemas/compraHasFormaPago.schema.js";

class CompraHasFormaPago
  extends Model<CompraHasFormaPagoAttributes, CompraHasFormaPagoCreationAttributes>
  implements CompraHasFormaPagoAttributes
{
  declare id: bigint;
  declare compraId: number;
  declare formaPagoId: number;
  declare montoPagoCompra: number;
  declare comprobantePagoId?: bigint | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

CompraHasFormaPago.init(
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
    formaPagoId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: "FormaPago_Id",
    },
    montoPagoCompra: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      field: "MontoPagoCompra",
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
    tableName: "Compra_has_FormaPago",
    timestamps: true,
  }
);

export default CompraHasFormaPago;