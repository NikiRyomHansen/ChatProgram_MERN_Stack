import React from 'react';
import { render } from '@testing-library/react';
import InitialApp from './InitialApp';

test('renders learn react link', () => {
  const { getByText } = render(<InitialApp />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
