import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize.js";
import { BodegaAttributes, BodegaCreationAttributes } from "../schemas/bodega.schema.js";

class Bodega extends Model<BodegaAttributes, BodegaCreationAttributes> implements BodegaAttributes {
  declare id: number;
  declare descripcionBodega: string;
  declare ubicacionBodega?: string | null;
  declare estadoId: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Bodega.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      field: "Id",
    },
    descripcionBodega: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: "DescripcionBodega",
    },
    ubicacionBodega: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "UbicacionBodega",
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
    tableName: "Bodega",
    timestamps: true,
    indexes: [
      {
        fields: ["DescripcionBodega"],
        unique: true,
      },
    ],
  }
);

export default Bodega;
