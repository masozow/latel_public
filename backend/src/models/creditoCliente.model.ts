import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize.js";
import { CreditoClienteAttributes, CreditoClienteCreationAttributes } from "../schemas/creditoCliente.schema.js";

class CreditoCliente
  extends Model<CreditoClienteAttributes, CreditoClienteCreationAttributes>
  implements CreditoClienteAttributes
{
  declare id: number;
  declare clienteId: number;
  declare ventaId: number;
  declare fechaLimiteCreditoCliente: Date;
  declare cantidadCuotasCreditoCliente?: number | null;
  declare montoCreditoCliente: number;
  declare estadoId: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

CreditoCliente.init(
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
    ventaId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: "Venta_Id",
    },
    fechaLimiteCreditoCliente: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "FechaLimiteCreditoCliente",
    },
    montoCreditoCliente: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      field: "MontoCreditoCliente",
    },
    cantidadCuotasCreditoCliente: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "CantidadCuotasCreditoCliente",
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
    tableName: "CreditoCliente",
    timestamps: true,
  }
);

export default CreditoCliente;