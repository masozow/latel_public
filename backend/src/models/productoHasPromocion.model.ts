import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize.js";
import { ProductoHasPromocionAttributes } from "../schemas/productoHasPromocion.schema.js";

class ProductoHasPromocion
  extends Model<ProductoHasPromocionAttributes>
  implements ProductoHasPromocionAttributes
{
  declare productoId: number;
  declare promocionId: number;
}

ProductoHasPromocion.init(
  {
    productoId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      field: "Producto_Id",
    },
    promocionId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      field: "Promocion_Id",
    },
  },
  {
    sequelize,
    tableName: "Producto_has_Promocion",
    timestamps: false,
  }
);

export default ProductoHasPromocion;