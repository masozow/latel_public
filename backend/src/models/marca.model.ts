import {
  DataTypes,
  Model,
  Optional,
} from "sequelize";
import sequelize from "../config/sequelize.js";

export interface MarcaAttributes {
  id: number;
  descripcionMarca: string ;
  estadoId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MarcaCreationAttributes
  extends Optional<
    MarcaAttributes,
    "id" |  "createdAt" | "updatedAt"
  > {}

class Marca
  extends Model<MarcaAttributes, MarcaCreationAttributes>
  implements MarcaAttributes
{
  declare id: number;
  declare descripcionMarca: string ;
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
        allowNull: true,
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