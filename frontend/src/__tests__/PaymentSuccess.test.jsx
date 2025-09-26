import { render, screen } from '@testing-library/react'
import PaymentSuccess from '../features/cart/PaymentSuccess'

test('affiche le message de succès', () => {
  render(<PaymentSuccess />)
  expect(screen.getByText(/Paiement réussi/i)).toBeInTheDocument()
})
