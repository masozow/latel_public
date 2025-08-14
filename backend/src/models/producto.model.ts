import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize.js";
import { ProductoAttributes, ProductoCreationAttributes } from "../schemas/producto.schema.js";

class Producto
  extends Model<ProductoAttributes, ProductoCreationAttributes>
  implements ProductoAttributes
{
  declare id: number;
  declare codigoProducto: string;
  declare descripcionProducto: string;
  declare anotacionProducto?: string | null; 
  declare costoProducto: number;
  declare totalExistenciaProducto: number;
  declare estadoId: number;
  declare marcaId: number;
  declare tipoProductoId: number;
  declare lineaProductoId?: number | null;
  declare precioPorDefectoId?: number | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Producto.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      field: "Id",
    },
    codigoProducto: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: "CodigoProducto",
    },
    descripcionProducto: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "DescripcionProducto",
    },
    anotacionProducto: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "AnotacionProducto",
    },
    costoProducto: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      field: "CostoProducto",
    },
    totalExistenciaProducto: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "TotalExistenciaProducto",
    },
    estadoId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: "Estado_Id",
    },
    marcaId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: "Marca_Id",
    },
    tipoProductoId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: "TipoProducto_Id",
    },
    lineaProductoId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      field: "LineaProducto_Id",
    },
    precioPorDefectoId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      field: "PrecioPorDefecto_Id",
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
    tableName: "Producto",
    timestamps: true,
  }
);

export default Producto;