// Tipos base del sistema
export interface User {
  id: number
  username: string
  email: string
  password_hash: string
  role_id: number
  created_at: Date
  updated_at: Date
  active: boolean
}

export interface Role {
  id: number
  name: string
  description: string
  permissions: string[]
}

export interface Product {
  id: number
  code: string
  name: string
  description: string
  category_id: number
  brand_id: number
  unit_price: number
  cost_price: number
  stock_quantity: number
  min_stock: number
  max_stock: number
  barcode: string
  active: boolean
  created_at: Date
  updated_at: Date
}

export interface Category {
  id: number
  name: string
  description: string
  parent_id?: number
}

export interface Customer {
  id: number
  code: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  credit_limit: number
  current_debt: number
  active: boolean
  created_at: Date
}

export interface Supplier {
  id: number
  code: string
  name: string
  contact_name: string
  email: string
  phone: string
  address: string
  city: string
  current_debt: number
  active: boolean
}

export interface Sale {
  id: number
  invoice_number: string
  customer_id: number
  user_id: number
  sale_date: Date
  subtotal: number
  tax_amount: number
  discount_amount: number
  total_amount: number
  payment_method: string
  status: "pending" | "completed" | "cancelled"
  notes: string
}

export interface SaleDetail {
  id: number
  sale_id: number
  product_id: number
  quantity: number
  unit_price: number
  discount_percentage: number
  subtotal: number
}

export interface Purchase {
  id: number
  invoice_number: string
  supplier_id: number
  user_id: number
  purchase_date: Date
  subtotal: number
  tax_amount: number
  total_amount: number
  status: "pending" | "received" | "cancelled"
  notes: string
}

export interface Warehouse {
  id: number
  code: string
  name: string
  address: string
  manager_id: number
  active: boolean
}

export interface InventoryMovement {
  id: number
  product_id: number
  warehouse_id: number
  movement_type: "in" | "out" | "transfer"
  quantity: number
  reference_type: string
  reference_id: number
  notes: string
  created_at: Date
  user_id: number
}

// Tipos para el POS
export interface POSItem {
  product: Product
  quantity: number
  unit_price: number
  discount: number
  subtotal: number
}

export interface POSTransaction {
  items: POSItem[]
  customer?: Customer | null
  subtotal: number
  tax: number
  discount: number
  total: number
  payment_method: string
  received_amount: number
  change_amount: number
}
