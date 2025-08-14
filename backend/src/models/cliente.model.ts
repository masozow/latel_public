import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize.js";
import { ClienteAttributes, ClienteCreationAttributes } from "../schemas/cliente.schema.js";

class Cliente
  extends Model<ClienteAttributes, ClienteCreationAttributes>
  implements ClienteAttributes
{
  declare id: number;
  declare nitCliente?: string | null;
  declare tipoClienteId: number;
  declare tieneCreditoCliente: boolean;
  declare entidadId: number;
  declare saldoCreditoCliente?: number | null;
  declare montoLimiteCreditoCliente?: number | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Cliente.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      field: "Id",
    },
    nitCliente: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      field: "NITCliente",
    },
    tipoClienteId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: "TipoCliente_Id",
    },
    tieneCreditoCliente: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: "TieneCreditoCliente",
    },
    entidadId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: "Entidad_Id",
    },
    saldoCreditoCliente: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      field: "SaldoCreditoCliente",
    },
    montoLimiteCreditoCliente: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      field: "MontoLimiteCreditoCliente",
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
    tableName: "Cliente",
    timestamps: true,
  }
);

export default Cliente;