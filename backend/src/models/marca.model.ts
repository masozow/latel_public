import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize.js";
import { MarcaAttributes, MarcaCreationAttributes } from "../schemas/marca.schema.js";

class Marca
  extends Model<MarcaAttributes, MarcaCreationAttributes>
  implements MarcaAttributes
{
  declare id: number;
  declare descripcionMarca: string;
  declare estadoId: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Marca.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      field: "Id",
    },
    descripcionMarca: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: "DescripcionMarca",
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
    tableName: "Marca",
    timestamps: true,
  }
);

export default Marca;