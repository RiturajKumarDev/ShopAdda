// AuthPage.jsx
import React, { useState, useEffect } from 'react';
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiZap, FiTruck, FiLock, FiRefreshCw, FiUnlock, FiEdit3, FiEye, FiEyeOff, FiCheck, FiGift, FiDollarSign, FiMail, FiUser, FiPhone, FiCalendar } from 'react-icons/fi';
import './AuthPage.css';
import { loginUserToServer, registerUserToServer } from '../services/authService';

const AuthPage = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
        const user = JSON.parse(Cookies.get("userData") || null);
        if (user) {
            if (user.access_token)
                navigate("/");
        }
    }, []);

    // Login Form State
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    // Register Form State
    const [registerData, setRegisterData] = useState({
        fullName: '',
        email: '',
        mobile: '',
        dob: '',
        gender: '',
        role: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});
    const [passwordStrength, setPasswordStrength] = useState(0);

    // Password strength checker
    useEffect(() => {
        if (registerData.password) {
            let strength = 0;
            if (registerData.password.length >= 6) strength++;
            if (registerData.password.match(/[a-z]+/)) strength++;
            if (registerData.password.match(/[A-Z]+/)) strength++;
            if (registerData.password.match(/[0-9]+/)) strength++;
            if (registerData.password.match(/[$@#&!]+/)) strength++;
            setPasswordStrength(strength);
        } else {
            setPasswordStrength(0);
        }
    }, [registerData.password]);

    const handleLoginChange = (e) => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        });
    };

    const handleRegisterChange = (e) => {
        setRegisterData({
            ...registerData,
            [e.target.name]: e.target.value
        });
    };

    const validateLogin = () => {
        const newErrors = {};
        if (!loginData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(loginData.email)) newErrors.email = 'Email is invalid';
        if (!loginData.password) newErrors.password = 'Password is required';
        return newErrors;
    };

    const validateRegister = () => {
        const newErrors = {};
        if (!registerData.fullName) newErrors.fullName = 'Full name is required';
        if (!registerData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(registerData.email)) newErrors.email = 'Email is invalid';
        if (!registerData.mobile) newErrors.mobile = 'Mobile number is required';
        else if (!/^[0-9]{10}$/.test(registerData.mobile)) newErrors.mobile = 'Mobile number must be 10 digits';
        if (!registerData.dob) newErrors.dob = 'Date of birth is required';
        if (!registerData.gender) newErrors.gender = 'Gender is required';
        if (!registerData.role) newErrors.role = 'Please select a role type';
        else if (!["Admin", "Vendor", "User"].includes(registerData.role)) newErrors.role = 'Invalid role type';
        if (!registerData.password) newErrors.password = 'Password is required';
        else if (registerData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (registerData.password !== registerData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        return newErrors;
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateLogin();
        if (Object.keys(newErrors).length === 0) {
            setIsLoading(true);
            const response = await loginUserToServer(loginData.email, loginData.password);
            const data = await response.json();
            setIsLoading(false);
            if (response.ok) {
                alert('Login Successful! Welcome back to ShopAdda! 🎉');
                Cookies.set("userData", JSON.stringify(data), { expires: 7 });
                navigate("/");
            }
            else {
                alert(Array.isArray(data.errors) ? data.errors.join(", ") : data.errors || 'Login failed');
            }
        } else {
            setErrors(newErrors);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateRegister();
        if (Object.keys(newErrors).length === 0) {
            setIsLoading(true);
            const response = await registerUserToServer(registerData);
            const data = await response.json();
            if (response.ok) {
                setIsLoading(false);
                alert('Registration Successful! Welcome to ShopAdda family! 🎉');
                setIsLogin(true);
                setRegisterData({
                    fullName: '',
                    email: '',
                    mobile: '',
                    dob: '',
                    gender: '',
                    role: '',
                    password: '',
                    confirmPassword: '',
                    joinDate: new Date().toISOString().split('T')[0]
                });
            }
            else {
                setIsLoading(false);
                alert(Array.isArray(data.errors) ? data.errors.join(", ") : data.errors || 'Registration failed');
            }
        } else {
            setErrors(newErrors);
        }
    };

    const getPasswordStrengthText = () => {
        if (passwordStrength === 0) return 'No Password';
        if (passwordStrength <= 2) return 'Weak';
        if (passwordStrength <= 3) return 'Fair';
        if (passwordStrength <= 4) return 'Good';
        return 'Strong';
    };

    const getPasswordStrengthColor = () => {
        if (passwordStrength <= 2) return '#f44336';
        if (passwordStrength <= 3) return '#ff9800';
        if (passwordStrength <= 4) return '#2196f3';
        return '#4caf50';
    };

    return (
        <div className="auth-container">
            <div className="auth-wrapper">
                {/* Left Side - Brand Section */}
                <div className="auth-brand">
                    <div className="brand-content">
                        <div className="brand-logo">
                            <span className="logo-icon"><FiShoppingBag /></span>
                            <h1>Shop<span className="brand-accent">Adda</span></h1>
                        </div>
                        <p className="brand-tagline">HARDEALKAA<span className="accent">EDDA</span></p>

                        <div className="brand-features">
                            <div className="feature-item">
                                <span className="feature-icon"><FiZap /></span>
                                <div>
                                    <h4>Exclusive Deals</h4>
                                    <p>Get the best discounts daily</p>
                                </div>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon"><FiTruck /></span>
                                <div>
                                    <h4>Free Shipping</h4>
                                    <p>On orders above ₹999</p>
                                </div>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon"><FiLock /></span>
                                <div>
                                    <h4>Secure Payment</h4>
                                    <p>100% safe transactions</p>
                                </div>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon"><FiRefreshCw /></span>
                                <div>
                                    <h4>Easy Returns</h4>
                                    <p>7 days return policy</p>
                                </div>
                            </div>
                        </div>

                        <div className="brand-stats">
                            <div className="stat">
                                <span className="stat-number">1M+</span>
                                <span className="stat-label">Happy Customers</span>
                            </div>
                            <div className="stat">
                                <span className="stat-number">10K+</span>
                                <span className="stat-label">Products</span>
                            </div>
                            <div className="stat">
                                <span className="stat-number">50+</span>
                                <span className="stat-label">Brands</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form Section */}
                <div className="auth-form-container">
                    <div className="form-toggle">
                        <button
                            className={`toggle-btn ${isLogin ? 'active' : ''}`}
                            onClick={() => {
                                setIsLogin(true);
                                setErrors({});
                            }}
                        >
                            <span className="toggle-icon"><FiUnlock /></span>
                            Login
                        </button>
                        <button
                            className={`toggle-btn ${!isLogin ? 'active' : ''}`}
                            onClick={() => {
                                setIsLogin(false);
                                setErrors({});
                            }}
                        >
                            <span className="toggle-icon"><FiEdit3 /></span>
                            Register
                        </button>
                    </div>

                    {isLogin ? (
                        // Login Form
                        <form onSubmit={handleLoginSubmit} className="auth-form">
                            <h2 className="form-title">Welcome Back! 👋</h2>
                            <p className="form-subtitle">Login to continue your shopping journey</p>

                            <div className="input-group">
                                <div className="input-icon"><FiMail /></div>
                                <input
                                    type="email"
                                    name="email"
                                    value={loginData.email}
                                    onChange={handleLoginChange}
                                    className={`form-input ${errors.email ? 'error' : ''}`}
                                    placeholder="Email Address"
                                />
                                <label className="input-label">Email Address</label>
                                <div className="input-border"></div>
                                {errors.email && <span className="error-message">{errors.email}</span>}
                            </div>

                            <div className="input-group">
                                <div className="input-icon"><FiLock /></div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={loginData.password}
                                    onChange={handleLoginChange}
                                    className={`form-input ${errors.password ? 'error' : ''}`}
                                    placeholder="Password"
                                />
                                <label className="input-label">Password</label>
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                <div className="input-border"></div>
                                {errors.password && <span className="error-message">{errors.password}</span>}
                            </div>

                            <div className="form-options">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    <span className="checkbox-custom"></span>
                                    Remember me
                                </label>
                                <a href="#" className="forgot-link">Forgot Password?</a>
                            </div>

                            <button type="submit" className="submit-btn" disabled={isLoading}>
                                {isLoading ? (
                                    <div className="spinner"></div>
                                ) : (
                                    'Login to ShopAdda →'
                                )}
                            </button>

                            {/* <div className="auth-divider">
                                <span className="divider-line"></span>
                                <span className="divider-text">or login with</span>
                                <span className="divider-line"></span>
                            </div>

                            <div className="social-login">
                                <button type="button" className="social-btn google">
                                    <span>G</span> Google
                                </button>
                                <button type="button" className="social-btn facebook">
                                    <span>f</span> Facebook
                                </button>
                                <button type="button" className="social-btn apple">
                                    <span>🍎</span> Apple
                                </button>
                            </div> */}

                            <p className="auth-footer">
                                New to ShopAdda?{' '}
                                <button type="button" onClick={() => setIsLogin(false)} className="link-btn">
                                    Create an account
                                </button>
                            </p>
                        </form>
                    ) : (
                        // Register Form
                        <form onSubmit={handleRegisterSubmit} className="auth-form">
                            <h2 className="form-title">Create Account ✨</h2>
                            <p className="form-subtitle">Join ShopAdda for amazing deals</p>

                            <div className="form-grid">
                                <div className="input-group full-width">
                                    <div className="input-icon"><FiUser /></div>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={registerData.fullName}
                                        onChange={handleRegisterChange}
                                        className={`form-input ${errors.fullName ? 'error' : ''}`}
                                        placeholder="Full Name"
                                    />
                                    <label className="input-label">Full Name</label>
                                    <div className="input-border"></div>
                                    {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                                </div>

                                <div className="input-group">
                                    <div className="input-icon"><FiMail /></div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={registerData.email}
                                        onChange={handleRegisterChange}
                                        className={`form-input ${errors.email ? 'error' : ''}`}
                                        placeholder="Email Address"
                                    />
                                    <label className="input-label">Email Address</label>
                                    <div className="input-border"></div>
                                    {errors.email && <span className="error-message">{errors.email}</span>}
                                </div>

                                <div className="input-group">
                                    <div className="input-icon"><FiPhone /></div>
                                    <input
                                        type="tel"
                                        name="mobile"
                                        value={registerData.mobile}
                                        onChange={handleRegisterChange}
                                        className={`form-input ${errors.mobile ? 'error' : ''}`}
                                        placeholder="Mobile Number"
                                        maxLength="10"
                                    />
                                    <label className="input-label">Mobile Number</label>
                                    <div className="input-border"></div>
                                    {errors.mobile && <span className="error-message">{errors.mobile}</span>}
                                </div>

                                <div className="input-group">
                                    <div className="input-icon"><FiCalendar /></div>
                                    <input
                                        type="date"
                                        name="dob"
                                        value={registerData.dob}
                                        onChange={handleRegisterChange}
                                        className={`form-input ${errors.dob ? 'error' : ''}`}
                                        placeholder="Date of Birth"
                                    />
                                    <label className="input-label">Date of Birth</label>
                                    <div className="input-border"></div>
                                    {errors.dob && <span className="error-message">{errors.dob}</span>}
                                </div>

                                <div className="input-group">
                                    <div className="input-icon"><FiUser /></div>
                                    <select
                                        name="gender"
                                        value={registerData.gender}
                                        onChange={handleRegisterChange}
                                        className={`form-input ${errors.gender ? 'error' : ''}`}
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <label className="input-label">Gender</label>
                                    <div className="input-border"></div>
                                    {errors.gender && <span className="error-message">{errors.gender}</span>}
                                </div>

                                <div className="input-group">
                                    <div className="input-icon"><FiUser /></div>
                                    <select
                                        name="role"
                                        value={registerData.role}
                                        onChange={handleRegisterChange}
                                        className={`form-input ${errors.role ? 'error' : ''}`}
                                    >
                                        <option value="">Select Role</option>
                                        <option value="Admin">Admin</option>
                                        <option value="Vendor">Vendor</option>
                                        <option value="User">User</option>
                                    </select>
                                    <label className="input-label">Role</label>
                                    <div className="input-border"></div>
                                    {errors.role && <span className="error-message">{errors.role}</span>}
                                </div>

                                <div className="input-group">
                                    <div className="input-icon"><FiCalendar /></div>
                                    <input
                                        type="text"
                                        value={registerData.joinDate}
                                        disabled
                                        className="form-input readonly"
                                        placeholder="Join Date"
                                    />
                                    <label className="input-label">Join Date</label>
                                    <div className="input-border"></div>
                                </div>

                                <div className="input-group">
                                    <div className="input-icon"><FiLock /></div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={registerData.password}
                                        onChange={handleRegisterChange}
                                        className={`form-input ${errors.password ? 'error' : ''}`}
                                        placeholder="Password"
                                    />
                                    <label className="input-label">Password</label>
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                    <div className="input-border"></div>
                                    {errors.password && <span className="error-message">{errors.password}</span>}
                                </div>

                                <div className="input-group">
                                    <div className="input-icon"><FiCheck /></div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={registerData.confirmPassword}
                                        onChange={handleRegisterChange}
                                        className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                                        placeholder="Confirm Password"
                                    />
                                    <label className="input-label">Confirm Password</label>
                                    <div className="input-border"></div>
                                    {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                                </div>
                            </div>

                            {registerData.password && (
                                <div className="password-strength">
                                    <div className="strength-bar">
                                        <div
                                            className="strength-fill"
                                            style={{
                                                width: `${(passwordStrength / 5) * 100}%`,
                                                background: getPasswordStrengthColor()
                                            }}
                                        ></div>
                                    </div>
                                    <span className="strength-text" style={{ color: getPasswordStrengthColor() }}>
                                        Password Strength: {getPasswordStrengthText()}
                                    </span>
                                </div>
                            )}

                            <button type="submit" className="submit-btn" disabled={isLoading}>
                                {isLoading ? (
                                    <div className="spinner"></div>
                                ) : (
                                    'Create Account →'
                                )}
                            </button>

                            {/* <div className="auth-divider">
                                <span className="divider-line"></span>
                                <span className="divider-text">or sign up with</span>
                                <span className="divider-line"></span>
                            </div>

                            <div className="social-login">
                                <button type="button" className="social-btn google">
                                    <span>G</span> Google
                                </button>
                                <button type="button" className="social-btn facebook">
                                    <span>f</span> Facebook
                                </button>
                                <button type="button" className="social-btn apple">
                                    <span>🍎</span> Apple
                                </button>
                            </div> */}

                            <p className="auth-footer">
                                Already have an account?{' '}
                                <button type="button" onClick={() => setIsLogin(true)} className="link-btn">
                                    Login here
                                </button>
                            </p>
                        </form>
                    )}
                </div>
            </div>

            {/* Floating Elements */}
            <div className="floating-elements">
                <div className="float-float float-1"><FiShoppingBag /></div>
                <div className="float-float float-2"><FiZap /></div>
                <div className="float-float float-3"><FiGift /></div>
                <div className="float-float float-4"><FiDollarSign /></div>
            </div>
        </div>
    );
};

export default AuthPage;
