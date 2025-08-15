export type IncrementCallback = (field: string, options: {
  by: number;
  where: any;
  transaction: any;
}) => Promise<any>;

export type DetalleVenta = {
  productoId: number;
  cantidadVenta: number;
};