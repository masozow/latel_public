import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize.js";
import { CompraHasEstadoAttributes } from "../schemas/compraHasEstado.schema.js";

class CompraHasEstado
  extends Model<CompraHasEstadoAttributes>
  implements CompraHasEstadoAttributes
{
  declare compraId: number;
  declare estadoId: number;
  declare usuarioId: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

CompraHasEstado.init(
  {
    compraId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      field: "Compra_Id",
    },
    estadoId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      field: "Estado_Id",
    },
    usuarioId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: "Usuario_Id",
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
    tableName: "Compra_has_Estado",
    timestamps: true,
  }
);

export default CompraHasEstado;