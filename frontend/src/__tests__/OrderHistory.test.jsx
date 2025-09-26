const React = require('react')
const { render, screen, within } = require('@testing-library/react')
const rawUserEvent = require('@testing-library/user-event')
const userEvent = rawUserEvent.default || rawUserEvent

jest.mock('axios')
const axios = require('axios')
const OrderHistoryMod = require('../features/cart/OrderHistory.jsx')
const OrderHistory = OrderHistoryMod.default || OrderHistoryMod

const AuthCtxMod = require('../features/auth/AuthContext.jsx')
const { AuthContext } = AuthCtxMod

beforeAll(() => {
  // Silence toutes les sorties console pendant les tests
  jest.spyOn(console, 'error').mockImplementation(() => {})
  jest.spyOn(console, 'warn').mockImplementation(() => {})
  jest.spyOn(console, 'log').mockImplementation(() => {})
  // Silence des alert()
  jest.spyOn(window, 'alert').mockImplementation(() => {})
})

afterAll(() => {
  console.error.mockRestore()
  console.warn.mockRestore()
  console.log.mockRestore()
  window.alert.mockRestore()
})

beforeEach(() => {
  axios.get.mockReset()
  axios.post.mockReset()
})

function renderWithAuth(ui, { token = 'fake.jwt' } = {}) {
  return render(
    <AuthContext.Provider value={{ token }}>
      {ui}
    </AuthContext.Provider>
  )
}

test('affiche l’historique', async () => {
  axios.get.mockResolvedValueOnce({
    data: [{
      id: 101,
      status: 'CONFIRMED',
      createdAt: '2025-01-10T09:00:00Z',
      items: [{ plantName: 'Aloe', unite_price: 12.9, quantity: 2, plantId: 1 }]
    }]
  })

  renderWithAuth(<OrderHistory />)

  expect(await screen.findByText(/Commande n°101/i)).toBeInTheDocument()
  expect(screen.getByText(/Aloe/i)).toBeInTheDocument()
  // 2 * 12.9 = 25.80 €
  expect(screen.getByText('25.80 €')).toBeInTheDocument()
})

test('affiche une erreur si API KO', async () => {
  axios.get.mockRejectedValueOnce(new Error('boom'))

  renderWithAuth(<OrderHistory />)

  expect(await screen.findByText(/Erreur lors du chargement/i)).toBeInTheDocument()
})

test('“Racheter” poste les bons items', async () => {
  axios.get.mockResolvedValueOnce({
    data: [{
      id: 102,
      status: 'DELIVERED',
      createdAt: '2025-01-11T09:00:00Z',
      items: [
        { plantName: 'Aloe', plantId: 1, quantity: 1, unite_price: 12.9 },
        { plantName: 'Cactus', plantId: 2, quantity: 3, unite_price: 5.0 },
      ]
    }]
  })
  axios.post.mockResolvedValueOnce({ data: { ok: true } })

  renderWithAuth(<OrderHistory />)

  // Compat: v14 -> setup(); v13 -> objet directement
  const user = typeof userEvent.setup === 'function' ? userEvent.setup() : userEvent

  const el = await screen.findByText(/Commande n°102/)
  const row = el.closest('tr')
  expect(row).not.toBeNull()

  await user.click(within(row).getByRole('button', { name: /Racheter/i }))

  expect(axios.post).toHaveBeenCalledWith(
    '/api/orders/from-cart',
    [
      { plantId: 1, quantity: 1, unite_price: 12.9 },
      { plantId: 2, quantity: 3, unite_price: 5.0 },
    ],
    expect.objectContaining({
      headers: expect.objectContaining({ Authorization: expect.stringContaining('Bearer ') })
    })
  )
})
