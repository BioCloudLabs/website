import { render, screen, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import LoginPage from '../../../components/auth/LoginPage';
import { loginUser } from '../../../services/userService';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom';


jest.mock('react-router-dom', () => ({
    useNavigate: () => jest.fn(),
}));

jest.mock('../../../services/userService', () => ({
    loginUser: jest.fn(),
}));

describe('LoginPage', () => {
    const mockOnLoginSuccess = jest.fn();
    const mockSetIsAuthenticated = jest.fn();

    beforeEach(() => {
        render(
            <LoginPage
                onLoginSuccess={mockOnLoginSuccess}
                setIsAuthenticated={mockSetIsAuthenticated}
            />
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders the login form', () => {
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    it('updates email state on input change', () => {
        const emailInput: HTMLInputElement = screen.getByLabelText('Email');
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        expect(emailInput.value).toBe('test@example.com');
    });

    it('updates password state on input change', () => {
        const passwordInput: HTMLInputElement = screen.getByLabelText('Password');
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        expect(passwordInput.value).toBe('password123');
    });

it('calls loginUser and navigates to dashboard on successful login', async () => {
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const loginButton = screen.getByRole('button', { name: 'Log In' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    (loginUser as jest.Mock).mockResolvedValueOnce(true);

    await act(async () => {
        fireEvent.click(loginButton);
    });

    expect(loginUser).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(mockSetIsAuthenticated).toHaveBeenCalledWith(true);
    expect(mockOnLoginSuccess).toHaveBeenCalled();
    expect(useNavigate()).toHaveBeenCalledWith('/dashboard', { replace: true });
});

    it('displays error message on failed login', async () => {
        const emailInput = screen.getByLabelText('Email');
        const passwordInput = screen.getByLabelText('Password');
        const loginButton = screen.getByRole('button', { name: 'Log In' });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        (loginUser as jest.Mock).mockReturnValueOnce(Promise.resolve(false));

        fireEvent.click(loginButton);

        expect(loginUser).toHaveBeenCalledWith('test@example.com', 'password123');
        expect(mockSetIsAuthenticated).not.toHaveBeenCalled();
        expect(mockOnLoginSuccess).not.toHaveBeenCalled();
        expect(useNavigate).not.toHaveBeenCalled();
        expect(screen.getByText('Failed to log in. Please check your credentials and try again.')).toBeInTheDocument();
    });

    it('displays error message on unexpected login error', async () => {
        const emailInput = screen.getByLabelText('Email');
        const passwordInput = screen.getByLabelText('Password');
        const loginButton = screen.getByRole('button', { name: 'Log In' });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        (loginUser as jest.Mock).mockRejectedValueOnce(new Error('Unexpected error'));

        fireEvent.click(loginButton);

        expect(loginUser).toHaveBeenCalledWith('test@example.com', 'password123');
        expect(mockSetIsAuthenticated).not.toHaveBeenCalled();
        expect(mockOnLoginSuccess).not.toHaveBeenCalled();
        expect(useNavigate).not.toHaveBeenCalled();
        expect(screen.getByText('Login failed due to an unexpected error.')).toBeInTheDocument();
    });
});