import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize.js";
import { EntidadAttributes, EntidadCreationAttributes } from "../schemas/entidad.schema.js";

class Entidad
  extends Model<EntidadAttributes, EntidadCreationAttributes>
  implements EntidadAttributes
{
  declare id: number;
  declare nombre: string;
  declare direccion?: string | null;
  declare telefono?: string | null;
  declare email?: string | null;
  declare estadoId: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Entidad.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      field: "Id",
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "Nombre",
    },
    direccion: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "Direccion",
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "Telefono",
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      field: "Email",
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
    tableName: "Entidad",
    timestamps: true,
  }
);

export default Entidad;