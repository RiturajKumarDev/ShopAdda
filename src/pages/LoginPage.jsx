import React, { useState } from 'react';
import './LoginPage.css';

const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            alert(isLogin ? 'Login Successful!' : 'Account Created!');
        }, 1500);
    };

    return (
        <div className="app-container">
            {/* Animated Background */}
            <div className="animated-bg">
                <div className="gradient-sphere sphere-1"></div>
                <div className="gradient-sphere sphere-2"></div>
                <div className="gradient-sphere sphere-3"></div>
            </div>

            {/* Main Container */}
            <div className="login-container">
                <div className="brand-section">
                    <div className="brand-icon">
                        <span className="shop-icon">🛍️</span>
                    </div>
                    <h1 className="brand-name">Shop<span className="highlight">Adda</span></h1>
                    <p className="tagline">HARDEALKAA<span className="accent">EDDA</span></p>
                    <div className="deal-badge">
                        <span className="lightning">⚡</span>
                        <span>Flat 50% Off on First Deal</span>
                    </div>
                </div>

                <div className="form-section">
                    <div className="form-toggle">
                        <button
                            className={`toggle-btn ${isLogin ? 'active' : ''}`}
                            onClick={() => setIsLogin(true)}
                        >
                            Login
                        </button>
                        <button
                            className={`toggle-btn ${!isLogin ? 'active' : ''}`}
                            onClick={() => setIsLogin(false)}
                        >
                            Sign Up
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        {!isLogin && (
                            <div className="input-group slide-down">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="form-input"
                                />
                                <label className="form-label">Full Name</label>
                                <div className="input-border"></div>
                            </div>
                        )}

                        <div className="input-group slide-down">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="form-input"
                            />
                            <label className="form-label">Email Address</label>
                            <div className="input-border"></div>
                        </div>

                        <div className="input-group slide-down">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="form-input"
                            />
                            <label className="form-label">Password</label>
                            <div className="input-border"></div>
                        </div>

                        {isLogin && (
                            <div className="forgot-password">
                                <a href="#" className="forgot-link">Forgot Password?</a>
                            </div>
                        )}

                        <button type="submit" className="submit-btn" disabled={isLoading}>
                            {isLoading ? (
                                <div className="spinner"></div>
                            ) : (
                                isLogin ? 'Login to ShopAdda' : 'Create Account'
                            )}
                        </button>

                        <div className="or-divider">
                            <span className="or-line"></span>
                            <span className="or-text">OR</span>
                            <span className="or-line"></span>
                        </div>

                        <div className="social-login">
                            <button type="button" className="social-btn google">
                                <span className="social-icon">G</span>
                                Google
                            </button>
                            <button type="button" className="social-btn facebook">
                                <span className="social-icon">f</span>
                                Facebook
                            </button>
                        </div>
                    </form>

                    <div className="terms">
                        By continuing, you agree to ShopAdda's
                        <a href="#"> Terms of Service</a> & <a href="#">Privacy Policy</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;