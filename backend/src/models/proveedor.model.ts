import {
  DataTypes,
  Model,
  Optional,
} from "sequelize";
import sequelize from "../config/sequelize.js";

export interface ProveedorAttributes {
  id: number;
  nitProveedor?: string | null;
  ubicacionProveedor?:string|null;
  entidadId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProveedorCreationAttributes
  extends Optional<
    ProveedorAttributes,
    | "id"
    | "nitProveedor"
    | "ubicacionProveedor"
    | "createdAt"
    | "updatedAt"
  > {}

class Proveedor
  extends Model<ProveedorAttributes, ProveedorCreationAttributes>
  implements ProveedorAttributes
{
  declare id: number;
  declare nitProveedor?: string | null;
  declare ubicacionProveedor?: string | null;
  declare entidadId: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}


  Proveedor.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        field: "Id",
      },
      nitProveedor: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        field: "NitProveedor",
      },
      ubicacionProveedor: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "UbicacionProveedor",
      },
      entidadId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        field: "Entidad_Id",
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
      tableName: "Proveedor",
      timestamps: true,
    }
  );

export default Proveedor;