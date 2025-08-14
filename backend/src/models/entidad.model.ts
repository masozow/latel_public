import {
  DataTypes,
  Model,
  Optional,
} from "sequelize";
import sequelize from "../config/sequelize.js";

export interface EntidadAttributes {
  id: number;
  nombre: string ;
  direccion?: string | null;
  telefono?: string | null;
  email?: string | null;
  estadoId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EntidadCreationAttributes
  extends Optional<
    EntidadAttributes,
    "id"  | "direccion" | "telefono" | "email" | "createdAt" | "updatedAt"
  > {}

class Entidad
  extends Model<EntidadAttributes, EntidadCreationAttributes>
  implements EntidadAttributes
{
  declare id: number;
  declare nombre: string ;
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
        allowNull: true,
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