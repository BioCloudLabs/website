import { expect } from 'chai';
import { render, screen, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import LoginPage from '../../../components/auth/LoginPage';
import * as userService from '../../../services/userService';
import { MemoryRouter } from 'react-router-dom';

describe('LoginPage', () => {
    let stubLoginUser: sinon.SinonStub;
    let mockOnLoginSuccess: sinon.SinonSpy;
    let mockSetIsAuthenticated: sinon.SinonSpy;

    beforeEach(() => {
        mockOnLoginSuccess = sinon.spy();
        mockSetIsAuthenticated = sinon.spy();
        stubLoginUser = sinon.stub(userService, 'loginUser');
        render(
            <MemoryRouter>
                <LoginPage
                    onLoginSuccess={mockOnLoginSuccess}
                    setIsAuthenticated={mockSetIsAuthenticated}
                />
            </MemoryRouter>
        );
    });

    afterEach(() => {
        sinon.restore();  // Restore all mocks, spies, and stubs
    });

    it('renders the login form', () => {
        expect(screen.getByLabelText('Email')).to.exist;
        expect(screen.getByLabelText('Password')).to.exist;
    });

    it('updates email state on input change', () => {
        const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        expect(emailInput.value).to.equal('test@example.com');
    });

    it('updates password state on input change', () => {
        const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        expect(passwordInput.value).to.equal('password123');
    });

    it('calls loginUser and navigates to dashboard on successful login', async () => {
        const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
        const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
        const loginButton = screen.getByRole('button', { name: 'Log In' });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        stubLoginUser.resolves(true);

        await fireEvent.click(loginButton);

        expect(stubLoginUser.calledWith('test@example.com', 'password123')).to.be.true;
        expect(mockSetIsAuthenticated.calledWith(true)).to.be.true;
        expect(mockOnLoginSuccess.calledOnce).to.be.true;
    });

    it('displays error message on failed login', async () => {
        const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
        const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
        const loginButton = screen.getByRole('button', { name: 'Log In' });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        stubLoginUser.resolves(false);

        await fireEvent.click(loginButton);

        expect(stubLoginUser.calledWith('test@example.com', 'password123')).to.be.true;
        expect(mockSetIsAuthenticated.called).to.be.false;
        expect(mockOnLoginSuccess.called).to.be.false;
        expect(screen.getByText('Failed to log in. Please check your credentials and try again.')).to.exist;
    });

    it('displays error message on unexpected login error', async () => {
        const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
        const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
        const loginButton = screen.getByRole('button', { name: 'Log In' });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        stubLoginUser.rejects(new Error('Unexpected error'));

        await fireEvent.click(loginButton);

        expect(stubLoginUser.calledWith('test@example.com', 'password123')).to.be.true;
        expect(mockSetIsAuthenticated.called).to.be.false;
        expect(mockOnLoginSuccess.called).to.be.false;
        expect(screen.getByText('Login failed due to an unexpected error.')).to.exist;
    });
});
