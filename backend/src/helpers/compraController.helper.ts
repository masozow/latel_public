// =============================================================================
// FUNCIÓN PARA COMPARAR DECIMALES (reutilizar del helper de venta)

import { DetalleCompra, IncrementCallback } from "../types/compraController.type.js";
import { ESTADOS_COMPRA } from "../types/estadosDictionary.type.js";

// =============================================================================
export const compararDecimales = (
  valor1: number, 
  valor2: number, 
  precision: number = 0.01
): boolean => {
  return Math.abs(valor1 - valor2) <= precision;
};

// =============================================================================
// FUNCIÓN PARA INCREMENTAR INVENTARIO (DESACOPLADA)
// =============================================================================
export const incrementarInventario = async (
  detalles: DetalleCompra[],
  bodegaId: number,
  transaction: any,
  incrementBodegaCallback: IncrementCallback,
  incrementProductoCallback: IncrementCallback
): Promise<void> => {
  for (const detalle of detalles) {
    // Incrementar en BodegaHasProducto
    await incrementBodegaCallback('existencia', {
      by: detalle.cantidadCompra,
      where: { 
        productoId: detalle.productoId,
        bodegaId 
      },
      transaction
    });

    // Incrementar existencia total en Producto
    await incrementProductoCallback('totalExistenciaProducto', {
      by: detalle.cantidadCompra,
      where: { id: detalle.productoId },
      transaction
    });
  }
};

// =============================================================================
// FUNCIÓN PARA REDUCIR INVENTARIO COMPRA (DESACOPLADA)
// =============================================================================
export const reducirInventarioCompra = async (
  detalles: DetalleCompra[],
  bodegaId: number,
  transaction: any,
  decrementBodegaCallback: IncrementCallback,
  decrementProductoCallback: IncrementCallback
): Promise<void> => {
  for (const detalle of detalles) {
    // Reducir en BodegaHasProducto
    await decrementBodegaCallback('existencia', {
      by: detalle.cantidadCompra,
      where: { 
        productoId: detalle.productoId,
        bodegaId 
      },
      transaction
    });

    // Reducir existencia total en Producto
    await decrementProductoCallback('totalExistenciaProducto', {
      by: detalle.cantidadCompra,
      where: { id: detalle.productoId },
      transaction
    });
  }
};

// =============================================================================
// FUNCIÓN PARA VALIDAR TOTALES COMPRA
// =============================================================================
export const validarTotalesCompra = (
  totalFormasPago: number,
  totalDetalles: number,
  totalCompra: number
): { esValido: boolean; errores: string[] } => {
  const errores: string[] = [];

  if (!compararDecimales(totalFormasPago, totalCompra)) {
    errores.push(
      `El total de formas de pago (${totalFormasPago}) no coincide con el total de la compra (${totalCompra})`
    );
  }

  if (!compararDecimales(totalDetalles, totalCompra)) {
    errores.push(
      `El total de detalles (${totalDetalles}) no coincide con el total de la compra (${totalCompra})`
    );
  }

  return {
    esValido: errores.length === 0,
    errores
  };
};

// =============================================================================
// FUNCIÓN PARA CALCULAR TOTAL DE FORMAS DE PAGO COMPRA
// =============================================================================
export const calcularTotalFormasPagoCompra = (formasPago: any[]): number => {
  return formasPago.reduce((sum: number, forma: any) => 
    sum + (parseFloat(forma.montoPagoCompra) || 0), 0
  );
};

// =============================================================================
// FUNCIÓN PARA CALCULAR TOTAL DE DETALLES COMPRA
// =============================================================================
export const calcularTotalDetallesCompra = (detalles: any[]): number => {
  return detalles.reduce((sum: number, detalle: any) => 
    sum + (parseFloat(detalle.subTotalCompra) || 0), 0
  );
};

// =============================================================================
// FUNCIÓN PARA VALIDAR ESTADO DE COMPRA MODIFICABLE
// =============================================================================
export const esCompraModificable = (estadoId: number): boolean => {
  const estadosNoModificables = [ESTADOS_COMPRA.CANCELADA];
  return !estadosNoModificables.includes(estadoId as any);
};

// =============================================================================
// FUNCIÓN PARA VERIFICAR EXISTENCIA EN BODEGA
// =============================================================================
export const verificarProductoEnBodega = async (
  productoId: number,
  bodegaId: number,
  findBodegaProductoCallback: (where: any, transaction: any) => Promise<any>,
  transaction: any
): Promise<{ existe: boolean; producto?: any }> => {
  const bodegaProducto = await findBodegaProductoCallback({
    where: { 
      productoId, 
      bodegaId 
    },
    transaction
  });

  return {
    existe: !!bodegaProducto,
    producto: bodegaProducto
  };
};

// =============================================================================
// FUNCIÓN PARA CREAR ENTRADA EN BODEGA SI NO EXISTE
// =============================================================================
export const crearEntradaBodegaSiNoExiste = async (
  productoId: number,
  bodegaId: number,
  cantidadInicial: number,
  createBodegaProductoCallback: (data: any, options: any) => Promise<any>,
  transaction: any
): Promise<void> => {
  await createBodegaProductoCallback({
    productoId,
    bodegaId,
    existencia: cantidadInicial
  }, { transaction });
};

// =============================================================================
// QUERY MEJORADA PARA ESTADÍSTICAS COMPRA (MÁS PORTABLE)
// =============================================================================
export const generarQueryEstadisticasCompra = (diasAtras: number = 30) => {
  const fechaLimite = new Date(Date.now() - diasAtras * 24 * 60 * 60 * 1000);
  
  return {
    query: `
      SELECT 
        COUNT(*) as totalCompras,
        SUM(totalCompra) as montoTotal,
        AVG(totalCompra) as montoPromedio,
        MAX(totalCompra) as montoMaximo,
        MIN(totalCompra) as montoMinimo,
        DATE(fechaCompra) as fecha
      FROM Compra 
      WHERE fechaCompra >= :fechaLimite
      GROUP BY DATE(fechaCompra)
      ORDER BY fecha DESC
    `,
    replacements: { fechaLimite }
  };
};