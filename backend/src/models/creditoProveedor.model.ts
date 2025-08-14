import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize.js";
import { CreditoProveedorAttributes, CreditoProveedorCreationAttributes } from "../schemas/creditoProveedor.schema.js";

class CreditoProveedor
  extends Model<CreditoProveedorAttributes, CreditoProveedorCreationAttributes>
  implements CreditoProveedorAttributes
{
  declare id: number;
  declare montoCreditoProveedor: number;
  declare fechaLimiteCreditoProveedor?: Date | null;
  declare cantidadCuotasCreditoProveedor?: number | null;
  declare compraId: number;
  declare proveedorId: number;
  declare estadoId: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

CreditoProveedor.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      field: "Id",
    },
    montoCreditoProveedor: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      field: "MontoCreditoProveedor",
    },
    fechaLimiteCreditoProveedor: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "FechaLimiteCreditoProveedor",
    },
    cantidadCuotasCreditoProveedor: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "CantidadCuotasCreditoProveedor",
    },
    compraId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: "Compra_Id",
    },
    proveedorId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: "Proveedor_Id",
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
    tableName: "CreditoProveedor",
    timestamps: true,
  }
);

export default CreditoProveedor;