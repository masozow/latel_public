import {
  DataTypes,
  Model,
  Optional,
} from "sequelize";
import sequelize from "../config/sequelize.js";

export interface FormaPagoAttributes {
  id: number;
  descripcionFormaPago: string ;
  estadoId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FormaPagoCreationAttributes
  extends Optional<
    FormaPagoAttributes,
    "id" | "createdAt" | "updatedAt"
  > {}

class FormaPago
  extends Model<FormaPagoAttributes, FormaPagoCreationAttributes>
  implements FormaPagoAttributes
{
  declare id: number;
  declare descripcionFormaPago: string;
  declare estadoId: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}


  FormaPago.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        field: "Id",
      },
      descripcionFormaPago: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: "DescripcionFormaPago",
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
      tableName: "FormaPago",
      timestamps: true,
    }
  );

export default FormaPago;