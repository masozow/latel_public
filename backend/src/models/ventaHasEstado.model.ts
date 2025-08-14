import {
  DataTypes,
  Model,
  Optional,
} from "sequelize";
import sequelize from "../config/sequelize.js";

export interface VentaHasEstadoAttributes {
  ventaId: number;
  estadoId: number;
  usuarioId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface VentaHasEstadoCreationAttributes
  extends Optional<VentaHasEstadoAttributes, "createdAt" | "updatedAt"> {}

class VentaHasEstado
  extends Model<VentaHasEstadoAttributes, VentaHasEstadoCreationAttributes>
  implements VentaHasEstadoAttributes
{
  declare ventaId: number;
  declare estadoId: number;
  declare usuarioId: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}


  VentaHasEstado.init(
    {
      ventaId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        field: "Venta_Id",
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
      tableName: "Venta_has_Estado",
      timestamps: true,
    }
  );

export default VentaHasEstado;