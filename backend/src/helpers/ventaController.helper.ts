// =============================================================================
// FUNCIÓN PARA COMPARAR DECIMALES


import { ESTADOS_VENTA } from "../types/estadosDictionary.type.js";
import { DetalleVenta, IncrementCallback } from "../types/ventaController.type.js";

// =============================================================================
export const compararDecimales = (
  valor1: number, 
  valor2: number, 
  precision: number = 0.01
): boolean => {
  return Math.abs(valor1 - valor2) <= precision;
};

// =============================================================================
// FUNCIÓN PARA RESTAURAR INVENTARIO (DESACOPLADA)
// =============================================================================
export const restaurarInventario = async (
  detalles: DetalleVenta[],
  bodegaId: number,
  transaction: any,
  incrementBodegaCallback: IncrementCallback,
  incrementProductoCallback: IncrementCallback
): Promise<void> => {
  for (const detalle of detalles) {
    // Restaurar en BodegaHasProducto
    await incrementBodegaCallback('existencia', {
      by: detalle.cantidadVenta,
      where: { 
        productoId: detalle.productoId,
        bodegaId 
      },
      transaction
    });

    // Restaurar existencia total en Producto
    await incrementProductoCallback('totalExistenciaProducto', {
      by: detalle.cantidadVenta,
      where: { id: detalle.productoId },
      transaction
    });
  }
};

// =============================================================================
// FUNCIÓN PARA REDUCIR INVENTARIO (DESACOPLADA)
// =============================================================================
export const reducirInventario = async (
  detalles: DetalleVenta[],
  bodegaId: number,
  transaction: any,
  decrementBodegaCallback: IncrementCallback,
  decrementProductoCallback: IncrementCallback
): Promise<void> => {
  for (const detalle of detalles) {
    // Reducir en BodegaHasProducto
    await decrementBodegaCallback('existencia', {
      by: detalle.cantidadVenta,
      where: { 
        productoId: detalle.productoId,
        bodegaId 
      },
      transaction
    });

    // Reducir existencia total en Producto
    await decrementProductoCallback('totalExistenciaProducto', {
      by: detalle.cantidadVenta,
      where: { id: detalle.productoId },
      transaction
    });
  }
};

// =============================================================================
// FUNCIÓN PARA VALIDAR TOTALES
// =============================================================================
export const validarTotalesVenta = (
  totalFormasPago: number,
  totalDetalles: number,
  totalVenta: number
): { esValido: boolean; errores: string[] } => {
  const errores: string[] = [];

  if (!compararDecimales(totalFormasPago, totalVenta)) {
    errores.push(
      `El total de formas de pago (${totalFormasPago}) no coincide con el total de la venta (${totalVenta})`
    );
  }

  if (!compararDecimales(totalDetalles, totalVenta)) {
    errores.push(
      `El total de detalles (${totalDetalles}) no coincide con el total de la venta (${totalVenta})`
    );
  }

  return {
    esValido: errores.length === 0,
    errores
  };
};

// =============================================================================
// FUNCIÓN PARA CALCULAR TOTAL DE FORMAS DE PAGO
// =============================================================================
export const calcularTotalFormasPago = (formasPago: any[]): number => {
  return formasPago.reduce((sum: number, forma: any) => 
    sum + (parseFloat(forma.montoFormaPagoVenta) || 0), 0
  );
};

// =============================================================================
// FUNCIÓN PARA CALCULAR TOTAL DE DETALLES
// =============================================================================
export const calcularTotalDetalles = (detalles: any[]): number => {
  return detalles.reduce((sum: number, detalle: any) => 
    sum + (parseFloat(detalle.subTotalVenta) || 0), 0
  );
};

// =============================================================================
// FUNCIÓN PARA VALIDAR ESTADO DE VENTA MODIFICABLE
// =============================================================================
export const esVentaModificable = (estadoId: number): boolean => {
  const estadosNoModificables = [ESTADOS_VENTA.CANCELADA];
  return !estadosNoModificables.includes(estadoId as any);
};

// =============================================================================
// QUERY MEJORADA PARA ESTADÍSTICAS (MÁS PORTABLE)
// =============================================================================
export const generarQueryEstadisticas = (diasAtras: number = 30) => {
  const fechaLimite = new Date(Date.now() - diasAtras * 24 * 60 * 60 * 1000);
  
  return {
    query: `
      SELECT 
        COUNT(*) as totalVentas,
        SUM(totalVenta) as montoTotal,
        AVG(totalVenta) as montoPromedio,
        MAX(totalVenta) as montoMaximo,
        MIN(totalVenta) as montoMinimo,
        DATE(fechaVenta) as fecha
      FROM Venta 
      WHERE fechaVenta >= :fechaLimite
      GROUP BY DATE(fechaVenta)
      ORDER BY fecha DESC
    `,
    replacements: { fechaLimite }
  };
};