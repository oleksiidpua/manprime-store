export interface CartItem {
  id: string
  slug: string
  name: string
  price: number
  quantity: number
  imageUrl?: string | null
}

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem('cart') || '[]')
  } catch {
    return []
  }
}

export function saveCart(items: CartItem[]) {
  localStorage.setItem('cart', JSON.stringify(items))
}

export function addToCart(item: Omit<CartItem, 'quantity'>) {
  const cart = getCart()
  const existing = cart.find((i) => i.id === item.id)
  if (existing) {
    existing.quantity += 1
  } else {
    cart.push({ ...item, quantity: 1 })
  }
  saveCart(cart)
  return cart
}

export function removeFromCart(id: string) {
  const cart = getCart().filter((i) => i.id !== id)
  saveCart(cart)
  return cart
}

export function updateQuantity(id: string, quantity: number) {
  const cart = getCart().map((i) => (i.id === id ? { ...i, quantity } : i)).filter((i) => i.quantity > 0)
  saveCart(cart)
  return cart
}

export function getCartTotal(cart: CartItem[]) {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
}
