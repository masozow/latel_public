import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize.js";
import { ProductoHasPrecioProductoAttributes, ProductoHasPrecioProductoCreationAttributes } from "../schemas/productoHasPrecio.schema.js";

class ProductoHasPrecioProducto
  extends Model<ProductoHasPrecioProductoAttributes, ProductoHasPrecioProductoCreationAttributes>
  implements ProductoHasPrecioProductoAttributes
{
  declare id: bigint;
  declare productoId: number;
  declare precioProductoId: number;
  declare montoPrecioProducto: number;
  declare estadoId: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}
  ProductoHasPrecioProducto.init(
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        field: "Id",
      },
      productoId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        field: "Producto_Id",
      },
      precioProductoId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        field: "PrecioProducto_Id",
      },
      montoPrecioProducto: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        field: "MontoPrecioProducto",
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
      tableName: "Producto_has_PrecioProducto",
      timestamps: true,
      indexes: [
        {
          name: "fk_Producto_has_PrecioProducto_Producto1_idx",
          fields: ["Producto_Id"],
        },
        {
          name: "fk_Producto_has_PrecioProducto_PrecioProducto1_idx",
          fields: ["PrecioProducto_Id"],
        },
        {
          name: "fk_Producto_has_PrecioProducto_Estado1_idx",
          fields: ["Estado_Id"],
        },
      ],
    }
  );


export default ProductoHasPrecioProducto