import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CartPage from '../features/cart/CartPage'
import { CartProvider } from '../features/cart/CartContext'

beforeEach(() => {
  localStorage.removeItem('token')
  localStorage.setItem('cart', JSON.stringify([{ id: 1, name: 'Aloe', price: 12.9, quantity: 1 }]))
  jest.useFakeTimers()

  const { location } = window
  delete window.location
  window.location = { ...location, href: '' }
})

afterEach(() => {
  jest.useRealTimers()
})

test('demande login si pas de token et programme la redirection', async () => {
  render(<CartProvider><CartPage /></CartProvider>)
  await userEvent.click(screen.getByRole('button', { name: /payer avec stripe/i }))

  expect(await screen.findByText(/vous devez être connecté/i)).toBeInTheDocument()
  expect(localStorage.getItem('redirectAfterLogin')).toBe('/cart')

  jest.advanceTimersByTime(2000)
  expect(window.location.href).toBe('/login')
})
