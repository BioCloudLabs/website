import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import LoginPage from '../../../components/auth/LoginPage';
import { loginUser } from '../../../services/userService';
import '@testing-library/jest-dom';

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    useNavigate: () => mockedNavigate,
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
        loginUser.mockClear();
        mockedNavigate.mockClear();
        mockOnLoginSuccess.mockClear();
        mockSetIsAuthenticated.mockClear();
    });

    it('renders the login form', () => {
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    it('updates email state on input change', () => {
        const emailInput = screen.getByLabelText('Email');
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        expect(emailInput.value).toBe('test@example.com');
    });

    it('updates password state on input change', () => {
        const passwordInput = screen.getByLabelText('Password');
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        expect(passwordInput.value).toBe('password123');
    });

    it('calls loginUser and navigates to dashboard on successful login', async () => {
        const emailInput = screen.getByLabelText('Email');
        const passwordInput = screen.getByLabelText('Password');
        const loginButton = screen.getByRole('button', { name: 'Log In' });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        loginUser.mockResolvedValueOnce(true);

        await waitFor(async () => {
            fireEvent.click(loginButton);
        });

        expect(loginUser).toHaveBeenCalledWith('test@example.com', 'password123');
        expect(mockSetIsAuthenticated).toHaveBeenCalledWith(true);
        expect(mockOnLoginSuccess).toHaveBeenCalled();
        expect(mockedNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
    });

    it('displays error message on failed login', async () => {
        const emailInput = screen.getByLabelText('Email');
        const passwordInput = screen.getByLabelText('Password');
        const loginButton = screen.getByRole('button', { name: 'Log In' });

        loginUser.mockResolvedValueOnce(false);

        await waitFor(() => {
            fireEvent.click(loginButton);
        });

        expect(loginUser).toHaveBeenCalledWith('test@example.com', 'password123');
        expect(mockSetIsAuthenticated).not.toHaveBeenCalled();
        expect(mockOnLoginSuccess).not.toHaveBeenCalled();
        expect(mockedNavigate).not.toHaveBeenCalled();
        expect(screen.getByText('Failed to log in. Please check your credentials and try again.')).toBeInTheDocument();
    });

    it('displays error message on unexpected login error', async () => {
        const emailInput = screen.getByLabelText('Email');
        const passwordInput = screen.getByLabelText('Password');
        const loginButton = screen.getByRole('button', { name: 'Log In' });

        loginUser.mockRejectedValueOnce(new Error('Unexpected error'));

        await waitFor(() => {
            fireEvent.click(loginButton);
        });

        expect(loginUser).toHaveBeenCalledWith('test@example.com', 'password123');
        expect(mockSetIsAuthenticated).not.toHaveBeenCalled();
        expect(mockOnLoginSuccess).not.toHaveBeenCalled();
        expect(mockedNavigate).not.toHaveBeenCalled();
        expect(screen.getByText('Login failed due to an unexpected error.')).toBeInTheDocument();
    });
});
