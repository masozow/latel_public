import {
  DataTypes,
  Model,
} from "sequelize";
import sequelize from "../config/sequelize.js";
import { EstadoAttributes, EstadoCreationAttributes } from "../schemas/estado.schema.js";

class Estado extends Model<EstadoAttributes, EstadoCreationAttributes> implements EstadoAttributes {
  declare id: number;
  declare descripcionEstado: string;
  declare activoEstado: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Estado.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      field: "Id",
    },
    descripcionEstado: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: "DescripcionEstado",
    },
    activoEstado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: "ActivoEstado",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "Estado",
    timestamps: true,
  }
);

export default Estado;
