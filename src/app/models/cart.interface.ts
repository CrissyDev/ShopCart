export interface Cart {
  id: number
  products: CartProduct[]
  total: number
  discountedTotal: number
  userId: number
  totalProducts: number
  totalQuantity: number
}

export interface CartProduct {
  id: number
  title: string
  price: number
  quantity: number
  total: number
  discountedPercentage: number
  discountedTotal: number
  thumbnail: string
}

export interface CartResponse {
  carts: Cart[]
  total: number
  skip: number
  limit: number
}


