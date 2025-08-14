import {
  DataTypes,
  Model,
  Optional,
} from "sequelize";
import sequelize from "../config/sequelize.js";

export interface VentaHasFormaPagoAttributes {
  id: bigint;
  ventaId: number;
  formaPagoId: number;
  montoFormaPagoVenta: number;
  comprobantePagoId?: bigint | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface VentaHasFormaPagoCreationAttributes
  extends Optional<
    VentaHasFormaPagoAttributes,
    "id"  | "comprobantePagoId" | "createdAt" | "updatedAt"
  > {}

class VentaHasFormaPago
  extends Model<VentaHasFormaPagoAttributes, VentaHasFormaPagoCreationAttributes>
  implements VentaHasFormaPagoAttributes
{
  declare id: bigint;
  declare ventaId: number;
  declare formaPagoId: number;
  declare montoFormaPagoVenta: number;
  declare comprobantePagoId?: bigint | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}


  VentaHasFormaPago.init(
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
      formaPagoId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        field: "FormaPago_Id",
      },
      montoFormaPagoVenta: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        field: "MontoFormaPagoVenta",
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
      tableName: "Venta_has_FormaPago",
      timestamps: true,
    }
  );


export default VentaHasFormaPago;