import {
  DataTypes,
  Model,
  Optional,
} from "sequelize";
import sequelize from "../config/sequelize.js";

export interface EntidadBancariaAttributes {
  id: number;
  entidadId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EntidadBancariaCreationAttributes
  extends Optional<
    EntidadBancariaAttributes,
    | "id"
    | "createdAt"
    | "updatedAt"
  > {}

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


export default EntidadBancaria