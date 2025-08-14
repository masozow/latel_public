import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize.js";
import { EntidadBancariaAttributes, EntidadBancariaCreationAttributes } from "../schemas/entidadBancaria.schema.js";

class EntidadBancaria
  extends Model<EntidadBancariaAttributes, EntidadBancariaCreationAttributes>
  implements EntidadBancariaAttributes
{
  declare id: number;
  declare entidadId: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

EntidadBancaria.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      field: "Id",
    },
    entidadId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: "Entidad_Id",
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
    tableName: "EntidadBancaria",
    timestamps: true,
  }
);

export default EntidadBancaria;