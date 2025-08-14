import {
  DataTypes,
  Model,
  Optional,
} from "sequelize";
import sequelize from "../config/sequelize.js";

export interface BodegaHasProductoAttributes {
  id: bigint;
  bodegaId: number;
  productoId: number;
  existencia?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BodegaHasProductoCreationAttributes
  extends Optional<
    BodegaHasProductoAttributes,
    "id" | "existencia" | "createdAt" | "updatedAt"
  > {}

class BodegaHasProducto
  extends Model<BodegaHasProductoAttributes, BodegaHasProductoCreationAttributes>
  implements BodegaHasProductoAttributes
{
  declare id: bigint;
  declare bodegaId: number;
  declare productoId: number;
  declare existencia?: number | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}


  BodegaHasProducto.init(
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        field: "Id",
      },
      bodegaId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        field: "Bodega_Id",
      },
      productoId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        field: "Producto_Id",
      },
      existencia: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "Existencia",
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
      tableName: "Bodega_has_Producto",
      timestamps: true,
      indexes: [
        {
          unique: false,
          fields: ["Producto_Id"],
          name: "fk_Bodega_has_Producto_Producto1_idx",
        },
        {
          unique: false,
          fields: ["Bodega_Id"],
          name: "fk_Bodega_has_Producto_Bodega1_idx",
        },
        {
          unique: true,
          fields: ["Id"],
          name: "Id_UNIQUE",
        },
      ],
      // Note: The composite PK is (Id, Bodega_Id, Producto_Id) in DB, 
      // but Sequelize requires a single primary key, so we keep 'id' as PK here.
    }
  );

export default BodegaHasProducto;