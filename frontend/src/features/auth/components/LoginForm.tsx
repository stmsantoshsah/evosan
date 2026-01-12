'use client';

import React, { useState } from 'react';
import { useLoginMutation } from '../slices/authApiSlice';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../slices/authSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [login, { isLoading, error }] = useLoginMutation();
    const dispatch = useDispatch();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const userData = await login({ email, password }).unwrap();
            dispatch(setCredentials(userData));
            router.push('/dashboard');
        } catch (err) {
            console.error('Failed to login:', err);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card glass">
                <div className="auth-header">
                    <h1>Welcome Back</h1>
                    <p>Enter your credentials to access your account</p>
                </div>
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <div className="error-message">Invalid email or password</div>}
                    <button type="submit" className="btn-primary" disabled={isLoading}>
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>
                <div className="auth-footer">
                    <p>
                        Don't have an account? <Link href="/signup">Sign Up</Link>
                    </p>
                </div>
            </div>

            <style jsx>{`
                .auth-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    background: radial-gradient(circle at top left, #1a1a2e, #16213e);
                    padding: 20px;
                }
                .auth-card {
                    width: 100%;
                    max-width: 400px;
                    padding: 40px;
                    border-radius: 20px;
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
                }
                .auth-header {
                    text-align: center;
                    margin-bottom: 30px;
                }
                .auth-header h1 {
                    font-size: 2rem;
                    color: #fff;
                    margin-bottom: 8px;
                }
                .auth-header p {
                    color: rgba(255, 255, 255, 0.6);
                    font-size: 0.9rem;
                }
                .auth-form {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .form-group label {
                    color: rgba(255, 255, 255, 0.8);
                    font-size: 0.85rem;
                }
                input {
                    padding: 12px;
                    border-radius: 10px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: #fff;
                    outline: none;
                    transition: border-color 0.3s;
                }
                input:focus {
                    border-color: #4e44e7;
                }
                .btn-primary {
                    padding: 14px;
                    border-radius: 10px;
                    background: linear-gradient(135deg, #6366f1, #4f46e5);
                    color: #fff;
                    border: none;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.2s, opacity 0.2s;
                }
                .btn-primary:hover {
                    transform: translateY(-2px);
                    opacity: 0.9;
                }
                .btn-primary:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                .error-message {
                    color: #ff4d4d;
                    font-size: 0.85rem;
                    text-align: center;
                }
                .auth-footer {
                    margin-top: 25px;
                    text-align: center;
                    font-size: 0.9rem;
                    color: rgba(255, 255, 255, 0.6);
                }
                .auth-footer a {
                    color: #6366f1;
                    text-decoration: none;
                    font-weight: 500;
                }
                .auth-footer a:hover {
                    text-decoration: underline;
                }
            `}</style>
        </div>
    );
};

export default LoginForm;
