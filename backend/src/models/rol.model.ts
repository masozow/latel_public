import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize.js";
import { RolAttributes, RolCreationAttributes } from "../schemas/rol.schema.js";

class Rol extends Model<RolAttributes, RolCreationAttributes> implements RolAttributes {
  declare id: number;
  declare descripcionRol: string;
  declare estadoId: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Rol.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      field: "Id",
    },
    descripcionRol: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "DescripcionRol",
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
    tableName: "Rol",
    timestamps: true,
    indexes: [
      {
        fields: ["DescripcionRol"],
        unique: true,
      },
    ],
  }
);

export default Rol;
