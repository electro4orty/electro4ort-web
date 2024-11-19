import { render, screen } from '@testing-library/react';
import LoginScreen from './login-screen';
import MockProvider from '@/utils/mock-provider';

describe('LoginScreen', () => {
  test('renders login button', () => {
    render(
      <MockProvider>
        <LoginScreen />
      </MockProvider>
    );
    expect(screen.getByTestId('login-btn')).toBeInTheDocument();
  });
});
