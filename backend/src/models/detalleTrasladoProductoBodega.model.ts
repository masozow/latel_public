import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize.js";
import { DetalleTrasladoProductoBodegaAttributes, DetalleTrasladoProductoBodegaCreationAttributes } from "../schemas/detalleTrasladoProductoBodega.schema.js";

class DetalleTrasladoProductoBodega
  extends Model<DetalleTrasladoProductoBodegaAttributes, DetalleTrasladoProductoBodegaCreationAttributes>
  implements DetalleTrasladoProductoBodegaAttributes
{
  declare id: bigint;
  declare trasladoProductoId: number;
  declare bodegaOrigen: number;
  declare bodegaDestino: number;
  declare productoId: number;
  declare cantidadProductoTrasladado: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

DetalleTrasladoProductoBodega.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      field: "Id",
    },
    trasladoProductoId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: "TrasladoProducto_Id",
    },
    bodegaOrigen: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: "BodegaOrigen",
    },
    bodegaDestino: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: "BodegaDestino",
    },
    productoId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: "Producto_Id",
    },
    cantidadProductoTrasladado: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "CantidadProductoTrasladado",
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
    tableName: "DetalleTrasladoProductoBodega",
    timestamps: true,
  }
);

export default DetalleTrasladoProductoBodega;