import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  createMemoryRouter,
  RouterProvider,
} from 'react-router-dom'

import ProductCard from '../features/plants/ProductCard'

// Mocks
const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

const mockDispatch = jest.fn()
jest.mock('../features/cart/CartContext', () => ({
  useCart: () => ({ dispatch: mockDispatch }),
}))

describe('ProductCard', () => {
  beforeEach(() => {
    mockDispatch.mockClear()
    mockNavigate.mockClear()
  })

  test('Ajoute au panier et redirige vers /cart quand on clique "Acheter"', async () => {
    const router = createMemoryRouter(
      [
        { path: '/', element: (
          <ProductCard
            name="Aloe"
            price={12.9}
            image="/aloe.jpg"
            description="Une belle plante d’intérieur"
          />
        ) },
        // route cible de navigate('/cart') si jamais le routeur veut la connaître
        { path: '/cart', element: <div>Panier</div> },
      ],
      { initialEntries: ['/'] }
    )

    render(
      <RouterProvider
        router={router}
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      />
    )

    await userEvent.click(screen.getByRole('button', { name: /acheter/i }))

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'ADD_ITEM',
      payload: {
        name: 'Aloe',
        price: 12.9,
        image: '/aloe.jpg',
        description: 'Une belle plante d’intérieur',
        shipping: 7.24,
        tax: 2.24,
      },
    })

    expect(mockNavigate).toHaveBeenCalledWith('/cart')
  })
})
