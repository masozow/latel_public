import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize.js";
import { UsuarioAttributes, UsuarioCreationAttributes } from "../schemas/usuario.schema.js";
import Entidad from "./entidad.model.js";

class Usuario extends Model<UsuarioAttributes, UsuarioCreationAttributes> implements UsuarioAttributes {
  declare id: number;
  declare password: string;
  declare rolId: number;
  declare entidadId: number;
  declare entidad?: Entidad;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Usuario.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      field: "Id",
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "Password",
    },
    rolId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: "Rol_Id",
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
    tableName: "Usuario",
    timestamps: true,
  }
);

export default Usuario;
