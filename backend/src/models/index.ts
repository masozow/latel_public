import Bodega from "./bodega.model.js";
import BodegaHasProducto from "./bodegaHasProducto.model.js";
import Cliente from "./cliente.model.js";
import Compra from "./compra.model.js";
import CompraHasEstado from "./compraHasEstado.model.js";
import CompraHasFormaPago from "./compraHasFormaPago.model.js";
import ComprobantePago from "./comprobantePago.model.js";
import CreditoCliente from "./creditoCliente.model.js";
import CreditoProveedor from "./creditoProveedor.model.js";
import CuotaCreditoCliente from "./cuotaCreditoCliente.model.js";
import CuotaCreditoProveedor from "./cuotaCreditoProveedor.model.js";
import DetalleCompra from "./detalleCompra.model.js";
import DetalleTrasladoProductoBodega from "./detalleTrasladoProductoBodega.model.js";
import DetalleVenta from "./detalleVenta.model.js";
import EntidadBancaria from "./entidadBancaria.model.js";
import Entidad from "./entidad.model.js";
import Estado from "./estado.model.js";
import FormaPago from "./formaPago.model.js";
import LineaProducto from "./lineaProducto.model.js";
import Marca from "./marca.model.js";
import PagoCuotaCreditoCliente from "./pagoCuotaCreditoCliente.model.js";
import PagoCuotaCreditoProveedor from "./pagoCuotaCreditoProveedor.model.js";
import Permiso from "./permiso.model.js";
import PrecioProducto from "./precioProducto.model.js";
import Producto from "./producto.model.js";
import ProductoHasPrecioProducto from "./productoHasPrecioProducto.model.js";
import ProductoHasPromocion from "./productoHasPromocion.model.js";
import Proveedor from "./proveedor.model.js";
import Promocion from "./promocion.model.js";
import Rol from "./rol.model.js";
import RolHasPermiso from "./rolHasPermiso.model.js";
import TipoCliente from "./tipoCliente.model.js";
import TipoProducto from "./tipoProducto.model.js";
import TrasladoProductoBodega from "./trasladoProductoBodega.model.js";
import Usuario from "./usuario.model.js";
import Venta from "./venta.model.js";
import VentaHasEstado from "./ventaHasEstado.model.js";
import VentaHasFormaPago from "./ventaHasFormaPago.model.js";


  //----------------Producto----------------
  // Producto → Estado (NOT NULL)
  Producto.belongsTo(Estado, { foreignKey: { name: "estadoId", allowNull: false }, as: "estado" });
  Estado.hasMany(Producto, { foreignKey: { name: "estadoId", allowNull: false }, as: "productos" });

  // Producto → TipoProducto (NOT NULL)
  Producto.belongsTo(TipoProducto, { foreignKey: { name: "tipoProductoId", allowNull: false }, as: "tipoProducto" });
  TipoProducto.hasMany(Producto, { foreignKey: { name: "tipoProductoId", allowNull: false }, as: "productos" });

  // Producto → Marca (NULL permitido)
  Producto.belongsTo(Marca, { foreignKey: { name: "marcaId", allowNull: true }, as: "marca" });
  Marca.hasMany(Producto, { foreignKey: { name: "marcaId", allowNull: true }, as: "productosMarca" });

  // Producto → PrecioProducto (NULL permitido)
  Producto.belongsTo(PrecioProducto, { foreignKey: { name: "precioPorDefectoId", allowNull: true }, as: "precioPorDefecto" });
  PrecioProducto.hasMany(Producto, { foreignKey: { name: "precioPorDefectoId", allowNull: true }, as: "productosConPrecio" });

  //---------------------- Cliente ----------------------------
  // Cliente → TipoCliente (NOT NULL)
  Cliente.belongsTo(TipoCliente, { foreignKey: { name: "tipoClienteId", allowNull: false }, as: "tipoCliente" });
  TipoCliente.hasMany(Cliente, { foreignKey: { name: "tipoClienteId", allowNull: false }, as: "clientes" });

  // Cliente → Entidad (NOT NULL)
  Cliente.belongsTo(Entidad, { foreignKey: { name: "entidadId", allowNull: false }, as: "entidad" });
  Entidad.hasMany(Cliente, { foreignKey: { name: "entidadId", allowNull: false }, as: "clientes" });

  //----------------Compra----------------
  // Compra -> Estado (estado actual; relación directa en la tabla Compra)
  Compra.belongsTo(Estado, { foreignKey: "estadoId", as: "estado" });
  Estado.hasMany(Compra, { foreignKey: "estadoId", as: "compras" });

  // Compra -> Proveedor (FK directa en Compra)
  Compra.belongsTo(Proveedor, { foreignKey: "proveedorId", as: "proveedor" });
  Proveedor.hasMany(Compra, { foreignKey: "proveedorId", as: "compras" });

  // Compra -> DetalleCompra (1:N directa; DetalleCompra no es tabla pivote)
  Compra.hasMany(DetalleCompra, { foreignKey: "compraId", as: "detallesCompra" });
  DetalleCompra.belongsTo(Compra, { foreignKey: "compraId", as: "compra" });

  //--------------- TipoCliente ---------------
  TipoCliente.belongsTo(Estado, { foreignKey: { name: "estadoId", allowNull: false }, as: "estado" });
  Estado.hasMany(TipoCliente, { foreignKey: { name: "estadoId", allowNull: false }, as: "tiposCliente" });


  // ---------------------------
  // Relaciones de CreditoCliente
  // ---------------------------

  // CreditoCliente -> Cliente (FK directa)
  CreditoCliente.belongsTo(Cliente, { foreignKey: "clienteId", as: "cliente" });
  Cliente.hasMany(CreditoCliente, { foreignKey: "clienteId", as: "creditosCliente" });

  // CreditoCliente -> Venta (FK directa)
  CreditoCliente.belongsTo(Venta, { foreignKey: "ventaId", as: "venta" });
  Venta.hasMany(CreditoCliente, { foreignKey: "ventaId", as: "creditosCliente" });

  // CreditoCliente -> Estado (FK directa)
  CreditoCliente.belongsTo(Estado, { foreignKey: "estadoId", as: "estado" });
  Estado.hasMany(CreditoCliente, { foreignKey: "estadoId", as: "creditosCliente" });


  // ---------------------------
  // Relaciones de FormaPago
  // ---------------------------
  FormaPago.belongsTo(Estado, { foreignKey: "estadoId", as: "estado" });
  Estado.hasMany(FormaPago, { foreignKey: "estadoId", as: "formasPago" });

  //------------------------ Entidad ------------------------
  Entidad.belongsTo(Estado, { foreignKey: { name: "estadoId", allowNull: false }, as: "estado" });
  Estado.hasMany(Entidad, { foreignKey: { name: "estadoId", allowNull: false }, as: "entidades" });

  // ---------------------------
  // Relaciones de EntidadBancaria
  // ---------------------------
  EntidadBancaria.belongsTo(Entidad, { foreignKey: "entidadId", as: "entidad" });
  Entidad.hasMany(EntidadBancaria, { foreignKey: "entidadId", as: "entidadesBancarias" });

  // ---------------------------
  // Relaciones de ComprobantePago
  // ---------------------------
  ComprobantePago.belongsTo(EntidadBancaria, { foreignKey: { name:"entidadBancariaId", allowNull:true }, as: "entidadBancaria" });
  EntidadBancaria.hasMany(ComprobantePago, { foreignKey: { name:"entidadBancariaId", allowNull:true }, as: "comprobantesPago" });

  ComprobantePago.belongsTo(Estado, { foreignKey: "estadoId", as: "estado" });
  Estado.hasMany(ComprobantePago, { foreignKey: "estadoId", as: "comprobantesPago" });

  //--------------- PagoCuotaCreditoCliente -----------------
  PagoCuotaCreditoCliente.belongsTo(FormaPago, { foreignKey: "formaPagoId", as: "formaPago" });
  FormaPago.hasMany(PagoCuotaCreditoCliente, { foreignKey: "formaPagoId", as: "pagosCreditoCliente" });

  PagoCuotaCreditoCliente.belongsTo(ComprobantePago, { foreignKey: { name:"comprobantePagoId", allowNull:true }, as: "comprobantePago" });
  ComprobantePago.hasMany(PagoCuotaCreditoCliente, { foreignKey: { name:"comprobantePagoId", allowNull:true }, as: "pagosCreditoCliente" });

  //--------------- CuotaCreditoCliente -----------------
  CuotaCreditoCliente.belongsTo(CreditoCliente, { foreignKey: "creditoClienteId", as: "creditoCliente" });
  CreditoCliente.hasMany(CuotaCreditoCliente, { foreignKey: "creditoClienteId", as: "cuotasCreditoCliente" });

  CuotaCreditoCliente.belongsTo(PagoCuotaCreditoCliente, { foreignKey: { name:"pagoCuotaCreditoClienteId", allowNull:true }, as: "pagoCuotaCreditoCliente" });
  PagoCuotaCreditoCliente.hasMany(CuotaCreditoCliente, { foreignKey: { name:"pagoCuotaCreditoClienteId", allowNull:true }, as: "cuotas" });

  //--------------- DetalleCompra -----------------
  DetalleCompra.belongsTo(Compra, { foreignKey: "compraId", as: "compraDetalle" });
  Compra.hasMany(DetalleCompra, { foreignKey: "compraId", as: "detalleCompra" });

  DetalleCompra.belongsTo(Producto, { foreignKey: "productoId", as: "producto" });
  Producto.hasMany(DetalleCompra, { foreignKey: "productoId", as: "detalleCompras" });


  //--------------- Rol -----------------
  Rol.belongsTo(Estado, { foreignKey: "estadoId", as: "estado" });
  Estado.hasMany(Rol, { foreignKey: "estadoId", as: "roles" });

  //--------------- Usuario -----------------
  Usuario.belongsTo(Rol, { foreignKey: "rolId", as: "rol" });
  Rol.hasMany(Usuario, { foreignKey: "rolId", as: "usuarios" });

  Usuario.belongsTo(Entidad, { foreignKey: "entidadId", as: "entidad" });
  Entidad.hasMany(Usuario, { foreignKey: "entidadId", as: "usuarios" });

  //--------------- Venta_has_Estado relaciones ---------------
  VentaHasEstado.belongsTo(Venta, { foreignKey: "ventaId", as: "venta" });
  Venta.hasMany(VentaHasEstado, { foreignKey: "ventaId", as: "ventaEstados" });

  VentaHasEstado.belongsTo(Estado, { foreignKey: "estadoId", as: "estado" });
  Estado.hasMany(VentaHasEstado, { foreignKey: "estadoId", as: "ventaEstados" });

  VentaHasEstado.belongsTo(Usuario, { foreignKey: "usuarioId", as: "usuario" });
  Usuario.hasMany(VentaHasEstado, { foreignKey: "usuarioId", as: "ventaEstados" });

  //--------------- DetalleVenta ---------------------
  DetalleVenta.belongsTo(Venta, { foreignKey: "ventaId", as: "venta" });
  Venta.hasMany(DetalleVenta, { foreignKey: "ventaId", as: "detallesVenta" });

  DetalleVenta.belongsTo(Producto, { foreignKey: "productoId", as: "producto" });
  Producto.hasMany(DetalleVenta, { foreignKey: "productoId", as: "detalleVentas" });

  //--------------- CreditoProveedor ---------------------
  CreditoProveedor.belongsTo(Compra, { foreignKey: "compraId", as: "compra" });
  Compra.hasMany(CreditoProveedor, { foreignKey: "compraId", as: "creditosProveedor" });

  CreditoProveedor.belongsTo(Proveedor, { foreignKey: "proveedorId", as: "proveedor" });
  Proveedor.hasMany(CreditoProveedor, { foreignKey: "proveedorId", as: "creditosProveedor" });

  CreditoProveedor.belongsTo(Estado, { foreignKey: "estadoId", as: "estado" });
  Estado.hasMany(CreditoProveedor, { foreignKey: "estadoId", as: "creditosProveedor" });

  //-------------- PagoCuotaCreditoProveedor --------------
  PagoCuotaCreditoProveedor.belongsTo(FormaPago, { foreignKey: "formaPagoId", as: "formaPago" });
  FormaPago.hasMany(PagoCuotaCreditoProveedor, { foreignKey: "formaPagoId", as: "pagosCreditoProveedor" });

  PagoCuotaCreditoProveedor.belongsTo(ComprobantePago, { foreignKey: { name:"comprobantePagoId", allowNull:true }, as: "comprobantePago" });
  ComprobantePago.hasMany(PagoCuotaCreditoProveedor, { foreignKey: { name:"comprobantePagoId", allowNull:true }, as: "pagosCreditoProveedor" });

  //-------------- CuotaCreditoProveedor -----------------
  CuotaCreditoProveedor.belongsTo(CreditoProveedor, { foreignKey: "creditoProveedorId", as: "creditoProveedor" });
  CreditoProveedor.hasMany(CuotaCreditoProveedor, { foreignKey: "creditoProveedorId", as: "cuotasCreditoProveedor" });

  CuotaCreditoProveedor.belongsTo(PagoCuotaCreditoProveedor, { foreignKey: { name:"pagoCuotaCreditoProveedorId", allowNull:true }, as: "pagoCuota" });
  PagoCuotaCreditoProveedor.hasMany(CuotaCreditoProveedor, { foreignKey: { name:"pagoCuotaCreditoProveedorId", allowNull:true }, as: "cuotas" });

  //-------------- Compra_has_FormaPago  -------------------
  CompraHasFormaPago.belongsTo(Compra, { foreignKey: "compraId", as: "compra" });
  Compra.hasMany(CompraHasFormaPago, { foreignKey: "compraId", as: "formasPago" });

  CompraHasFormaPago.belongsTo(FormaPago, { foreignKey: "formaPagoId", as: "formaPago" });
  FormaPago.hasMany(CompraHasFormaPago, { foreignKey: "formaPagoId", as: "compraFormasPago" });

  CompraHasFormaPago.belongsTo(ComprobantePago, { foreignKey: { name: "comprobantePagoId", allowNull: true }, as: "comprobantePago" });
  ComprobantePago.hasMany(CompraHasFormaPago, { foreignKey: { name: "comprobantePagoId", allowNull: true }, as: "compraComprobantesPago" });

  //-------------- Venta_has_FormaPago -------------------
  VentaHasFormaPago.belongsTo(Venta, { foreignKey: "ventaId", as: "venta" });
  Venta.hasMany(VentaHasFormaPago, { foreignKey: "ventaId", as: "formasPagoVenta" });

  VentaHasFormaPago.belongsTo(FormaPago, { foreignKey: "formaPagoId", as: "formaPago" });
  FormaPago.hasMany(VentaHasFormaPago, { foreignKey: "formaPagoId", as: "ventasConFormaPago" });

  VentaHasFormaPago.belongsTo(ComprobantePago, { foreignKey: { name: "comprobantePagoId", allowNull: true }, as: "comprobantePago" });
  ComprobantePago.hasMany(VentaHasFormaPago, { foreignKey: { name: "comprobantePagoId", allowNull: true }, as: "ventasConComprobantePago" });

  //-------------- TrasladoProductoBodega -------------------
  TrasladoProductoBodega.belongsTo(Usuario, { foreignKey: "usuarioAutoriza", as: "usuarioAutorizaTraslado" });
  Usuario.hasMany(TrasladoProductoBodega, { foreignKey: "usuarioAutoriza", as: "trasladosAutorizados" });

  TrasladoProductoBodega.belongsTo(Usuario, { foreignKey: "usuarioEncargado", as: "usuarioEncargadoTraslado" });
  Usuario.hasMany(TrasladoProductoBodega, { foreignKey: "usuarioEncargado", as: "trasladosEncargados" });

  //-------------- DetalleTrasladoProducto -------------------

  DetalleTrasladoProductoBodega.belongsTo(TrasladoProductoBodega, { foreignKey: "trasladoProductoId", as: "trasladoProducto" });
  TrasladoProductoBodega.hasMany(DetalleTrasladoProductoBodega, { foreignKey: "trasladoProductoId", as: "detallesTrasladoTraslado" });

  DetalleTrasladoProductoBodega.belongsTo(Bodega, { foreignKey: "bodegaOrigen", as: "bodegaOrigenTraslado" });
  Bodega.hasMany(DetalleTrasladoProductoBodega, { foreignKey: "bodegaOrigen", as: "detallesTrasladoOrigen" });

  DetalleTrasladoProductoBodega.belongsTo(Bodega, { foreignKey: "bodegaDestino", as: "bodegaDestinoTraslado" });
  Bodega.hasMany(DetalleTrasladoProductoBodega, { foreignKey: "bodegaDestino", as: "detallesTrasladoDestino" });

  DetalleTrasladoProductoBodega.belongsTo(Producto, { foreignKey: "productoId", as: "producto" });
  Producto.hasMany(DetalleTrasladoProductoBodega, { foreignKey: "productoId", as: "detallesTrasladoProductos" });

  //-------------- Promocion -------------------
  Promocion.belongsTo(Estado, { foreignKey: "estadoId", as: "estado" });
  Estado.hasMany(Promocion, { foreignKey: "estadoId", as: "promociones" });

  //-------------- Producto_has_Promocion -------------------
  ProductoHasPromocion.belongsTo(Producto, { foreignKey: "productoId", as: "producto" });
  Producto.hasMany(ProductoHasPromocion, { foreignKey: "productoId", as: "productoPromociones" });

  ProductoHasPromocion.belongsTo(Promocion, { foreignKey: "promocionId", as: "promocion" });
  Promocion.hasMany(ProductoHasPromocion, { foreignKey: "promocionId", as: "productoPromociones" });

  //-------------- Permiso -------------------
  Permiso.belongsTo(Estado, { foreignKey: "estadoId", as: "estado" });
  Estado.hasMany(Permiso, { foreignKey: "estadoId", as: "permisos" });

  //-------------- Rol_has_Permiso -------------------
  RolHasPermiso.belongsTo(Rol, { foreignKey: "rolId", as: "rol" });
  Rol.hasMany(RolHasPermiso, { foreignKey: "rolId", as: "rolesPermisos" });

  RolHasPermiso.belongsTo(Permiso, { foreignKey: "permisoId", as: "permiso" });
  Permiso.hasMany(RolHasPermiso, { foreignKey: "permisoId", as: "rolesPermisos" });

  //-------------- Producto_has_PrecioProducto -------------------
  ProductoHasPrecioProducto.belongsTo(Producto, { foreignKey: "productoId", as: "producto" });
  Producto.hasMany(ProductoHasPrecioProducto, { foreignKey: "productoId", as: "preciosProducto" });

  ProductoHasPrecioProducto.belongsTo(PrecioProducto, { foreignKey: "precioProductoId", as: "precioProducto" });
  PrecioProducto.hasMany(ProductoHasPrecioProducto, { foreignKey: "precioProductoId", as: "productosPrecio" });

  ProductoHasPrecioProducto.belongsTo(Estado, { foreignKey: "estadoId", as: "estado" });
  Estado.hasMany(ProductoHasPrecioProducto, { foreignKey: "estadoId", as: "productosPreciosEstado" });

  //-------------- Compra_has_Estado -------------------
  CompraHasEstado.belongsTo(Compra, { foreignKey: "compraId", as: "compra" });
  Compra.hasMany(CompraHasEstado, { foreignKey: "compraId", as: "estadosCompra" });

  CompraHasEstado.belongsTo(Estado, { foreignKey: "estadoId", as: "estado" });
  Estado.hasMany(CompraHasEstado, { foreignKey: "estadoId", as: "comprasEstado" });

  CompraHasEstado.belongsTo(Usuario, { foreignKey: "usuarioId", as: "usuario" });
  Usuario.hasMany(CompraHasEstado, { foreignKey: "usuarioId", as: "comprasEstadoUsuario" });
  //---------------------- Bodega_has_Producto ----------------------------
  // Bodega_has_Producto → Bodega (NOT NULL)
  BodegaHasProducto.belongsTo(Bodega, { foreignKey: { name: "bodegaId", allowNull: false }, as: "bodega" });
  Bodega.hasMany(BodegaHasProducto, { foreignKey: { name: "bodegaId", allowNull: false }, as: "productosEnBodega" });

  // Bodega_has_Producto → Producto (NOT NULL)
  BodegaHasProducto.belongsTo(Producto, { foreignKey: { name: "productoId", allowNull: false }, as: "producto" });
  Producto.hasMany(BodegaHasProducto, { foreignKey: { name: "productoId", allowNull: false }, as: "bodegasConProducto" });

  //---------------------- Bodega ----------------------------
  // Bodega → Estado (NOT NULL)
  Bodega.belongsTo(Estado, { foreignKey: { name: "estadoId", allowNull: false }, as: "estado" });
  Estado.hasMany(Bodega, { foreignKey: { name: "estadoId", allowNull: false }, as: "bodegas" });

  //---------------------- PrecioProducto ----------------------------
  // PrecioProducto → Estado (NOT NULL)
  PrecioProducto.belongsTo(Estado, { foreignKey: { name: "estadoId", allowNull: false }, as: "estado" });
  Estado.hasMany(PrecioProducto, { foreignKey: { name: "estadoId", allowNull: false }, as: "preciosProducto" });

  //---------------------- LineaProducto ----------------------------
  // LineaProducto → Estado (NOT NULL)
  LineaProducto.belongsTo(Estado, { foreignKey: { name: "estadoId", allowNull: false }, as: "estado" });
  Estado.hasMany(LineaProducto, { foreignKey: { name: "estadoId", allowNull: false }, as: "lineasProducto" });

  //---------------------- Marca ----------------------------
  // Marca → Estado (NOT NULL)
  Marca.belongsTo(Estado, { foreignKey: { name: "estadoId", allowNull: false }, as: "estado" });
  Estado.hasMany(Marca, { foreignKey: { name: "estadoId", allowNull: false }, as: "marcas" });

  //---------------------- Venta ----------------------------
  // Venta → Cliente (NOT NULL)
  Venta.belongsTo(Cliente, { foreignKey: { name: "clienteId", allowNull: false }, as: "cliente" });
  Cliente.hasMany(Venta, { foreignKey: { name: "clienteId", allowNull: false }, as: "ventas" });

  // Venta → Estado (NOT NULL)
  Venta.belongsTo(Estado, { foreignKey: { name: "estadoId", allowNull: false }, as: "estado" });
  Estado.hasMany(Venta, { foreignKey: { name: "estadoId", allowNull: false }, as: "ventas" });

  //---------------------- Proveedor ----------------------------
  // Proveedor → Entidad (NOT NULL)
  Proveedor.belongsTo(Entidad, { foreignKey: { name: "entidadId", allowNull: false }, as: "entidad" });
  Entidad.hasMany(Proveedor, { foreignKey: { name: "entidadId", allowNull: false }, as: "proveedores" });

  //---------------------- TipoProducto ----------------------------
  // TipoProducto → Estado (NOT NULL)
  TipoProducto.belongsTo(Estado, { foreignKey: { name: "estadoId", allowNull: false }, as: "estado" });
  Estado.hasMany(TipoProducto, { foreignKey: { name: "estadoId", allowNull: false }, as: "tiposProducto" });


  export {
    Bodega,
    BodegaHasProducto,
    Cliente,
    Compra,
    CompraHasEstado,
    CompraHasFormaPago,
    ComprobantePago,
    CreditoCliente,
    CreditoProveedor,
    CuotaCreditoCliente,
    CuotaCreditoProveedor,
    DetalleCompra,
    DetalleTrasladoProductoBodega,
    DetalleVenta,
    EntidadBancaria,
    Entidad,
    Estado,
    FormaPago,
    LineaProducto,
    Marca,
    PagoCuotaCreditoCliente,
    PagoCuotaCreditoProveedor,
    Permiso,
    PrecioProducto,
    Producto,
    ProductoHasPrecioProducto,
    ProductoHasPromocion,
    Proveedor,
    Promocion,
    Rol,
    RolHasPermiso,
    TipoCliente,
    TipoProducto,
    TrasladoProductoBodega,
    Usuario,
    Venta,
    VentaHasEstado,
    VentaHasFormaPago,
  };

