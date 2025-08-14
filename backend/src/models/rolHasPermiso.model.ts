import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize.js";
import { RolHasPermisoAttributes, RolHasPermisoCreationAttributes } from "../schemas/rolHasPermiso.schema.js";

class RolHasPermiso
  extends Model<RolHasPermisoAttributes, RolHasPermisoCreationAttributes>
  implements RolHasPermisoAttributes
{
  declare id: number;
  declare rolId: number;
  declare permisoId: number;
  declare accesoPermiso: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

RolHasPermiso.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      field: "Id",
    },
    rolId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: "Rol_Id",
    },
    permisoId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: "Permiso_Id",
    },
    accesoPermiso: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: "AccesoPermiso",
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
    tableName: "Rol_has_Permiso",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["Id", "Rol_Id", "Permiso_Id"],
      },
      {
        fields: ["Rol_Id"],
      },
      {
        fields: ["Permiso_Id"],
      },
    ],
  }
);

export default RolHasPermiso;