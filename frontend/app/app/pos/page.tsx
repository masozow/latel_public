"use client";

import { useEffect, useState } from "react";
import { SidebarInset, useSidebar } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  ChevronUp,
  ChevronDown,
  Trash2,
  CreditCard,
} from "lucide-react";
import type { POSItem, Product, Customer } from "@/types/database";
import { ProductSearchDialog } from "@/components/pos/product-search-dialog";
import { CustomerSelectDialog } from "@/components/pos/customer-select-dialog";
import { PaymentDialog } from "@/components/pos/payment-dialog";
import { PaymentMethodDialog } from "@/components/pos/payment-method-dialog";

// Datos de ejemplo
const sampleProducts: Product[] = [
  {
    id: 1,
    code: "LAP001",
    name: "Laptop Dell XPS 13",
    description: "Laptop ultrabook 13 pulgadas",
    category_id: 1,
    brand_id: 1,
    unit_price: 1299.99,
    cost_price: 999.99,
    stock_quantity: 15,
    min_stock: 5,
    max_stock: 50,
    barcode: "1234567890123",
    active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 2,
    code: "MOU001",
    name: "Mouse Logitech MX Master 3",
    description: "Mouse inalámbrico ergonómico",
    category_id: 2,
    brand_id: 2,
    unit_price: 99.99,
    cost_price: 69.99,
    stock_quantity: 25,
    min_stock: 10,
    max_stock: 100,
    barcode: "1234567890124",
    active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
];

const sampleCustomers: Customer[] = [
  {
    id: 1,
    code: "CLI001",
    name: "Juan Pérez",
    email: "juan@email.com",
    phone: "555-0123",
    address: "Calle 123, Ciudad",
    city: "Ciudad",
    credit_limit: 5000,
    current_debt: 1200,
    active: true,
    created_at: new Date(),
  },
];

const POSPage = () => {
  const [cartItems, setCartItems] = useState<POSItem[]>([]);
  const [searchCode, setSearchCode] = useState("");
  const [customerNIT, setCustomerNIT] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [saleType, setSaleType] = useState("completed");
  const [discount, setDiscount] = useState(0);
  const [paymentMethods, setPaymentMethods] = useState<
    Array<{ method: string; amount: number }>
  >([]);
  const [searchQuantity, setSearchQuantity] = useState(1);

  // Dialogs
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [showCustomerSelect, setShowCustomerSelect] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showPaymentMethod, setShowPaymentMethod] = useState(false);

  const addToCart = (product: Product, quantity = 1) => {
    const existingItem = cartItems.find(
      (item) => item.product.id === product.id
    );

    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
                subtotal: (item.quantity + quantity) * item.unit_price,
              }
            : item
        )
      );
    } else {
      const newItem: POSItem = {
        product,
        quantity,
        unit_price: product.unit_price,
        discount: 0,
        subtotal: quantity * product.unit_price,
      };
      setCartItems([...cartItems, newItem]);
    }
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(
      cartItems.map((item) =>
        item.product.id === productId
          ? {
              ...item,
              quantity: newQuantity,
              subtotal: newQuantity * item.unit_price,
            }
          : item
      )
    );
  };

  const removeFromCart = (productId: number) => {
    setCartItems(cartItems.filter((item) => item.product.id !== productId));
  };

  const handleBarcodeSearch = () => {
    const product = sampleProducts.find(
      (p) => p.barcode === searchCode || p.code === searchCode
    );
    if (product) {
      addToCart(product, searchQuantity);
      setSearchCode("");
      setSearchQuantity(1);
    } else {
      setShowProductSearch(true);
    }
  };

  const handleCustomerSearch = () => {
    if (customerNIT === "CF" || customerNIT === "") {
      setSelectedCustomer(null);
      return;
    }

    const customer = sampleCustomers.find((c) => c.code === customerNIT);
    if (customer) {
      setSelectedCustomer(customer);
    } else {
      setShowCustomerSelect(true);
    }
  };

  const calculateTotals = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
    const discountAmount = (subtotal * discount) / 100;
    const taxableAmount = subtotal - discountAmount;
    const tax = taxableAmount * 0.12; // 12% IVA Guatemala
    const total = taxableAmount + tax;

    return { subtotal, discountAmount, tax, total };
  };

  const { subtotal, discountAmount, tax, total } = calculateTotals();

  const clearCart = () => {
    setCartItems([]);
    setSelectedCustomer(null);
    setCustomerNIT("");
    setDiscount(0);
    setPaymentMethods([]);
  };

  const addPaymentMethod = (method: string, amount: number) => {
    setPaymentMethods([...paymentMethods, { method, amount }]);
  };

  const totalPaid = paymentMethods.reduce((sum, pm) => sum + pm.amount, 0);
  const remainingAmount = total - totalPaid;
  const { setTitle } = useSidebar();
  useEffect(() => {
    setTitle("Punto de Venta (POS)");
    return () => {
      setTitle("");
    };
  }, [setTitle]);
  return (
    <SidebarInset>
      <div className="flex-1 p-2 min-h-[calc(100vh-4rem)] flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 flex-1">
          <div className="lg:col-span-2 space-y-2 flex flex-col flex-1">
            {/* Client data */}
            <Card className="flex-shrink-0">
              <CardContent>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex gap-1">
                    <Input
                      placeholder="NIT / Identificación"
                      value={customerNIT}
                      onChange={(e) => setCustomerNIT(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleCustomerSearch()
                      }
                      className="h-7 flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCustomerSearch}
                      className="h-7 px-2 bg-transparent"
                    >
                      <Search className="h-3 w-3" />
                    </Button>
                  </div>

                  {selectedCustomer ? (
                    <>
                      <Label className="text-xs block">
                        {selectedCustomer.name}
                      </Label>
                    </>
                  ) : (
                    <>
                      <Label className="text-xs block">
                        {customerNIT === "CF" || customerNIT === ""
                          ? "Consumidor Final"
                          : "Cliente no encontrado"}
                      </Label>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Fila 2: Búsqueda de productos */}
            <Card className="flex-shrink-0">
              <CardContent>
                <div className="space-y-1">
                  <div className="flex gap-2 text-xs">
                    <Label className="w-16">Cant.</Label>
                    <Label className="flex-1">Producto</Label>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min="1"
                      value={searchQuantity}
                      onChange={(e) =>
                        setSearchQuantity(Number(e.target.value) || 1)
                      }
                      className="w-16 h-7 text-center text-xs"
                    />
                    <Input
                      placeholder="Escanear código de barras o código de producto..."
                      value={searchCode}
                      onChange={(e) => setSearchCode(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleBarcodeSearch()
                      }
                      className="flex-1 h-7"
                    />
                    <Button
                      size="sm"
                      onClick={() => setShowProductSearch(true)}
                      className="h-7 px-2"
                    >
                      <Search className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fila 3: Tabla de detalle - con scroll */}
            <Card className="flex-1 min-h-0">
              <CardContent className="py-1 p-2 h-full">
                <div className="h-full overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16 text-xs p-1">
                          Cant.
                        </TableHead>
                        <TableHead className="text-xs p-1">Prod.</TableHead>
                        <TableHead className="w-20 text-right text-xs p-1">
                          Precio
                        </TableHead>
                        <TableHead className="w-20 text-right text-xs p-1">
                          Subtotal
                        </TableHead>
                        <TableHead className="w-16 text-xs p-1">ID</TableHead>
                        <TableHead className="w-8 p-1"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cartItems.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-8 text-muted-foreground text-xs"
                          >
                            No hay productos en el carrito
                          </TableCell>
                        </TableRow>
                      ) : (
                        cartItems.map((item) => (
                          <TableRow key={item.product.id}>
                            <TableCell className="p-1">
                              <div className="flex items-center gap-1">
                                <span className="text-xs font-medium">
                                  {item.quantity}
                                </span>
                                <div className="flex flex-col">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-3 w-6 p-0"
                                    onClick={() =>
                                      updateQuantity(
                                        item.product.id,
                                        item.quantity + 1
                                      )
                                    }
                                  >
                                    <ChevronUp className="h-2 w-2" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-3 w-6 p-0"
                                    onClick={() =>
                                      updateQuantity(
                                        item.product.id,
                                        item.quantity - 1
                                      )
                                    }
                                  >
                                    <ChevronDown className="h-2 w-2" />
                                  </Button>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="p-1">
                              <div>
                                <p className="text-xs font-medium break-words">
                                  {item.product.name}
                                </p>
                                <p className="text-xs text-muted-foreground break-words">
                                  {item.product.description}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="text-right p-1">
                              <span className="text-xs">
                                Q{item.unit_price.toFixed(2)}
                              </span>
                            </TableCell>
                            <TableCell className="text-right p-1">
                              <span className="text-xs font-bold">
                                Q{item.subtotal.toFixed(2)}
                              </span>
                            </TableCell>
                            <TableCell className="p-1">
                              <Badge
                                variant="outline"
                                className="text-xs px-1 py-0"
                              >
                                {item.product.code}
                              </Badge>
                            </TableCell>
                            <TableCell className="p-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => removeFromCart(item.product.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Columna derecha - Totales y procesamiento */}

          <Card className="h-1/2">
            <CardContent className="py-1 h-full flex flex-col">
              {/* Tipo de venta */}
              <div className="flex-shrink-0 mb-3">
                <Select value={saleType} onValueChange={setSaleType}>
                  <SelectTrigger className="h-7 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completed">Venta Realizada</SelectItem>
                    <SelectItem value="quote">Cotización</SelectItem>
                    <SelectItem value="pending">Venta Pendiente</SelectItem>
                    <SelectItem value="credit">Venta a Crédito</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Totales */}
              <div className="flex-1 space-y-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Subtotal:</span>
                    <span>Q{subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span>Descuento:</span>
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        value={discount}
                        onChange={(e) => setDiscount(Number(e.target.value))}
                        className="w-12 h-5 text-xs p-1"
                        min="0"
                        max="100"
                      />
                      <span className="text-xs">%</span>
                      <span>Q{discountAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between text-xs">
                    <span>IVA (12%):</span>
                    <span>Q{tax.toFixed(2)}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-sm font-bold">
                    <span>Total:</span>
                    <span>Q{total.toFixed(2)}</span>
                  </div>

                  {paymentMethods.length > 0 && (
                    <>
                      <Separator />
                      <div className="space-y-1">
                        <div className="text-xs font-medium">
                          Métodos de Pago:
                        </div>
                        {paymentMethods.map((pm, index) => (
                          <div
                            key={index}
                            className="flex justify-between text-xs"
                          >
                            <span>{pm.method}:</span>
                            <span>Q{pm.amount.toFixed(2)}</span>
                          </div>
                        ))}
                        <div className="flex justify-between text-xs font-medium pt-1 border-t">
                          <span>Pendiente:</span>
                          <span
                            className={
                              remainingAmount > 0
                                ? "text-red-600"
                                : "text-green-600"
                            }
                          >
                            Q{remainingAmount.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Botones */}
              <div className="flex-shrink-0 space-y-2 mt-3">
                <Button
                  variant="outline"
                  className="w-full bg-transparent text-xs py-6 xl:py-2"
                  onClick={() => setShowPaymentMethod(true)}
                  disabled={cartItems.length === 0}
                >
                  <CreditCard className="h-3 w-3 mr-1" />
                  <span className="text-wrap text-left">
                    Agregar Método de Pago
                  </span>
                </Button>

                <Button
                  className="w-full text-xs"
                  disabled={cartItems.length === 0 || remainingAmount > 0}
                  onClick={() => setShowPayment(true)}
                >
                  <CreditCard className="h-3 w-3 mr-1" />
                  <span className="text-left">Procesar Pago</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialogs */}
      <ProductSearchDialog
        open={showProductSearch}
        onOpenChange={setShowProductSearch}
        onSelectProduct={(product) => {
          addToCart(product, searchQuantity);
          setShowProductSearch(false);
          setSearchQuantity(1);
        }}
        products={sampleProducts}
      />

      <CustomerSelectDialog
        open={showCustomerSelect}
        onOpenChange={setShowCustomerSelect}
        onSelectCustomer={(customer) => {
          setSelectedCustomer(customer);
          setCustomerNIT(customer?.code || "CF");
          setShowCustomerSelect(false);
        }}
      />

      <PaymentMethodDialog
        open={showPaymentMethod}
        onOpenChange={setShowPaymentMethod}
        onAddPayment={addPaymentMethod}
        remainingAmount={remainingAmount}
      />

      <PaymentDialog
        open={showPayment}
        onOpenChange={setShowPayment}
        transaction={{
          items: cartItems,
          customer: selectedCustomer,
          subtotal,
          tax,
          discount: discountAmount,
          total,
          payment_method: "",
          received_amount: 0,
          change_amount: 0,
        }}
        onComplete={() => {
          clearCart();
          setShowPayment(false);
        }}
      />
    </SidebarInset>
  );
};
export default POSPage;
