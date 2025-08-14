import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize.js";
import { TipoClienteAttributes, TipoClienteCreationAttributes } from "../schemas/tipoCliente.schema.js";

class TipoCliente
  extends Model<TipoClienteAttributes, TipoClienteCreationAttributes>
  implements TipoClienteAttributes
{
  declare id: number;
  declare descripcionTipoCliente: string;
  declare estadoId: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

TipoCliente.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      field: "Id",
    },
    descripcionTipoCliente: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: "DescripcionTipoCliente",
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
    tableName: "TipoCliente",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["Id"],
        name: "Id_UNIQUE",
      },
      {
        fields: ["Estado_Id"],
        name: "fk_TipoCliente_Estado1_idx",
      },
    ],
  }
);

export default TipoCliente;