import {
  DataTypes,
  Model,
  Optional,
} from "sequelize";
import sequelize from "../config/sequelize.js";

export interface PromocionAttributes {
  id: number;
  estadoId: number;
  fechaInicioPromocion?: Date | null;
  fechaFinPromocion?: Date | null;
  porcentajeDescuentoPromocion?: number | null;
  montoDescuentoPromocion?: number | null;
  descripcionPromocion: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PromocionCreationAttributes
  extends Optional<
    PromocionAttributes,
    "id" |"fechaInicioPromocion" | "fechaFinPromocion" | "porcentajeDescuentoPromocion" | "montoDescuentoPromocion" | "createdAt" | "updatedAt"
  > {}

class Promocion
  extends Model<PromocionAttributes, PromocionCreationAttributes>
  implements PromocionAttributes
{
  declare id: number;
  declare estadoId: number;
  declare fechaInicioPromocion?: Date | null;
  declare fechaFinPromocion?: Date | null;
  declare porcentajeDescuentoPromocion?: number | null;
  declare montoDescuentoPromocion?: number | null;
  declare descripcionPromocion: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}


  Promocion.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        field: "Id",
      },
      estadoId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        field: "Estado_Id",
      },
      fechaInicioPromocion: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "FechaInicioPromocion",
      },
      fechaFinPromocion: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "FechaFinPromocion",
      },
      porcentajeDescuentoPromocion: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        field: "PorcentajeDescuentoPromocion",
      },
      montoDescuentoPromocion: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
        field: "MontoDescuentoPromocion",
      },
      descripcionPromocion: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
        field: "DescripcionPromocion",
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
      tableName: "Promocion",
      timestamps: true,
    }
  );

  
export default Promocion;