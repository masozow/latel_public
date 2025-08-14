import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize.js";
import { PermisoAttributes, PermisoCreationAttributes } from "../schemas/permiso.schema.js";

class Permiso
  extends Model<PermisoAttributes, PermisoCreationAttributes>
  implements PermisoAttributes
{
  declare id: number;
  declare descripcionPermiso: string;
  declare estadoId: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Permiso.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      field: "Id",
    },
    descripcionPermiso: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: "DescripcionPermiso",
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
    tableName: "Permiso",
    timestamps: true,
  }
);

export default Permiso;