import {
  DataTypes,
  Model,
  Optional,
} from "sequelize";
import sequelize from "../config/sequelize.js";

export interface CuotaCreditoProveedorAttributes {
  id: bigint;
  fechaProgramadaPagoCuotaCreditoProveedor?: Date | null;
  montoCuotaCreditoProveedor: number;
  creditoProveedorId: number;
  pagoCuotaCreditoProveedorId?: bigint | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CuotaCreditoProveedorCreationAttributes
  extends Optional<
    CuotaCreditoProveedorAttributes,
    "id" | "pagoCuotaCreditoProveedorId"| "fechaProgramadaPagoCuotaCreditoProveedor" | "createdAt" | "updatedAt"
  > {}

class CuotaCreditoProveedor
  extends Model<
    CuotaCreditoProveedorAttributes,
    CuotaCreditoProveedorCreationAttributes
  >
  implements CuotaCreditoProveedorAttributes
{
  declare id: bigint;
  declare fechaProgramadaPagoCuotaCreditoProveedor?: Date | null;
  declare montoCuotaCreditoProveedor: number;
  declare creditoProveedorId: number;
  declare pagoCuotaCreditoProveedorId?: bigint | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}


  CuotaCreditoProveedor.init(
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        field: "Id",
      },
      fechaProgramadaPagoCuotaCreditoProveedor: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "FechaProgramadaPagoCuotaCreditoProveedor",
      },
      montoCuotaCreditoProveedor: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        field: "MontoCuotaCreditoProveedor",
      },
      creditoProveedorId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        field: "CreditoProveedor_Id",
      },
      pagoCuotaCreditoProveedorId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
        field: "PagoCuotaCreditoProveedor_Id",
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
      tableName: "CuotaCreditoProveedor",
      timestamps: true,
    }
  );


export default CuotaCreditoProveedor;