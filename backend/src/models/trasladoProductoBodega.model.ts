import {
  DataTypes,
  Model,
  Optional,
} from "sequelize";
import sequelize from "../config/sequelize.js";

export interface TrasladoProductoBodegaAttributes {
  id: number;
  usuarioAutoriza: number;
  usuarioEncargado: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TrasladoProductoBodegaCreationAttributes
  extends Optional<
    TrasladoProductoBodegaAttributes,
    "id" | "createdAt" | "updatedAt"
  > {}

class TrasladoProductoBodega
  extends Model<
    TrasladoProductoBodegaAttributes,
    TrasladoProductoBodegaCreationAttributes
  >
  implements TrasladoProductoBodegaAttributes
{
  declare id: number;
  declare usuarioAutoriza: number;
  declare usuarioEncargado: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}


  TrasladoProductoBodega.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        field: "Id",
      },
      usuarioAutoriza: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        field: "UsuarioAutoriza",
      },
      usuarioEncargado: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        field: "UsuarioEncargado",
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
      tableName: "TrasladoProductoBodega",
      timestamps: true,
    }
  );

export default TrasladoProductoBodega;