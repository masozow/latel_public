import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize.js";
import { CuotaCreditoClienteAttributes, CuotaCreditoClienteCreationAttributes } from "../schemas/cuotaCreditoCliente.schema.js";

class CuotaCreditoCliente
  extends Model<CuotaCreditoClienteAttributes, CuotaCreditoClienteCreationAttributes>
  implements CuotaCreditoClienteAttributes
{
  declare id: bigint;
  declare fechaProgramadaPagoCuotaCreditoCliente?: Date | null;
  declare creditoClienteId: number;
  declare montoCuotaCreditoCliente: number;
  declare pagoCuotaCreditoClienteId?: bigint | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

CuotaCreditoCliente.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      field: "Id",
    },
    fechaProgramadaPagoCuotaCreditoCliente: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "FechaProgramadaPagoCuotaCreditoCliente",
    },
    creditoClienteId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: "CreditoCliente_Id",
    },
    montoCuotaCreditoCliente: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      field: "MontoCuotaCreditoCliente",
    },
    pagoCuotaCreditoClienteId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: "PagoCuotaCreditoCliente_Id",
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
    tableName: "CuotaCreditoCliente",
    timestamps: true,
  }
);

export default CuotaCreditoCliente;