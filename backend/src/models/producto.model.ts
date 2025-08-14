import {
  DataTypes,
  Model,
  Optional,
} from "sequelize";
import sequelize from "../config/sequelize.js";

export interface ProductoAttributes {
  id: number;
  codigoProducto: string;
  descripcionProducto: string;
  anotacionProducto?:string|null; 
  costoProducto: number;
  totalExistenciaProducto:number;
  estadoId: number;
  marcaId: number;
  tipoProductoId: number;
  lineaProductoId?: number | null;
  precioPorDefectoId?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductoCreationAttributes
  extends Optional<
    ProductoAttributes,
    | "id"
    | "lineaProductoId"
    | "anotacionProducto"
    | "precioPorDefectoId"
    | "createdAt"
    | "updatedAt"
  > {}

class Producto
  extends Model<ProductoAttributes, ProductoCreationAttributes>
  implements ProductoAttributes
{
  declare id: number;
  declare codigoProducto: string;
  declare descripcionProducto: string;
  declare anotacionProducto?:string|null;
  declare costoProducto: number;
  declare totalExistenciaProducto:number;
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
      allowNull: true,
      unique: true,
      field: "CodigoProducto",
    },
    descripcionProducto: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "DescripcionProducto",
    },
    anotacionProducto: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "AnotacionProducto",
    },
    costoProducto: {
      type: DataTypes.DECIMAL,
      allowNull: true,
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
