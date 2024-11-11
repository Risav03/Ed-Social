import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

describe('Example Test', () => {
  it('should pass', () => {
    expect(true).toBe(true)
  })

  it('should render a component', () => {
    render(<div data-testid="test">Hello Test</div>)
    expect(screen.getByTestId('test')).toHaveTextContent('Hello Test')
  })
})