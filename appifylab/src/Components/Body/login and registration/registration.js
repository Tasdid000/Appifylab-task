import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Label, FormGroup, Row, Col } from 'reactstrap';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import './styles.css';
import Googlelogin from './googleligin';

const Register = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [password2, setPassword2] = useState('');

    const [errors, setErrors] = useState({});
    const [emailExistsError, setEmailExistsError] = useState('');
    const [registrationError, setRegistrationError] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    const validate = () => {
        let newErrors = {};

        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

        if (!first_name) newErrors.first_name = "Please enter your first name.";
        if (!last_name) newErrors.last_name = "Please enter your last name.";
        if (!email) newErrors.email = "Please enter your email.";
        else if (!emailRegex.test(email)) newErrors.email = "Please enter a valid email address.";

        if (!password) newErrors.password = "Please enter a password.";
        if (!password2) newErrors.password2 = "Please confirm your password.";
        else if (password !== password2) newErrors.password2 = "Passwords do not match";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setEmailExistsError('');
        setRegistrationError('');

        if (!validate()) return;

        try {
            const response = await fetch('http://127.0.0.1:8000/apiv1/user/register/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, first_name, last_name, password, password2 }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 409 && data.errors?.email) {
                    setEmailExistsError("Email already exists");
                } else {
                    setRegistrationError("Registration failed. Please try again.");
                }
                return;
            }

            navigate('/');
        } catch (error) {
            setRegistrationError("An unexpected error occurred: " + error.message);
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-500'>
            <Row className="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
                <Col md="5" className='hidden md:flex'>
                    <img
                        src='/assets/undraw_secure_login_pdn4.svg'
                        className='w-full h-full'
                        alt="Registration Visual"
                    />
                </Col>

                <Col md="7" className='p-8'>
                    <h2 className='text-3xl font-bold text-center mb-6'>Register</h2>

                    {registrationError && <div className="text-red-600 text-center mb-4">{registrationError}</div>}
                    {emailExistsError && <div className="text-red-600 text-center mb-4">{emailExistsError}</div>}

                    <Form className='space-y-4' onSubmit={handleRegister}>

                        {/* First & Last Name */}
                        <div className="flex flex-col md:flex-row md:space-x-4">
                            <FormGroup className="flex-1">
                                <Label>Your First Name *</Label>
                                <Input
                                    type='text'
                                    value={first_name}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                                {errors.first_name && <p className="text-red-600">{errors.first_name}</p>}
                            </FormGroup>

                            <FormGroup className="flex-1">
                                <Label>Your Last Name *</Label>
                                <Input
                                    type='text'
                                    value={last_name}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                                {errors.last_name && <p className="text-red-600">{errors.last_name}</p>}
                            </FormGroup>
                        </div>

                        {/* Email */}
                        <FormGroup>
                            <Label>Your Email *</Label>
                            <Input
                                type='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {errors.email && <p className="text-red-600">{errors.email}</p>}
                        </FormGroup>

                        {/* Password */}
                        <FormGroup>
                            <Label>Password *</Label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <span
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                                >
                                    {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                                </span>
                            </div>
                            {errors.password && <p className="text-red-600">{errors.password}</p>}
                        </FormGroup>

                        {/* Confirm Password */}
                        <FormGroup>
                            <Label>Confirm Password *</Label>
                            <div className="relative">
                                <Input
                                    type={showPassword2 ? "text" : "password"}
                                    value={password2}
                                    onChange={(e) => setPassword2(e.target.value)}
                                />
                                <span
                                    onClick={() => setShowPassword2(!showPassword2)}
                                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                                >
                                    {showPassword2 ? <AiFillEyeInvisible /> : <AiFillEye />}
                                </span>
                            </div>
                            {errors.password2 && <p className="text-red-600">{errors.password2}</p>}
                        </FormGroup>

                        <button
                            type="submit"
                            className='w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600'
                        >
                            Register
                        </button>
                    </Form>

                    <div className="mt-6 px-16 text-center">
                        <p className="mb-2">OR</p>
                        <Googlelogin />
                    </div>

                    <p className='text-center mt-4'>
                        Have an account? <Link to='/login' className='text-blue-500 underline'>Sign In</Link>
                    </p>
                </Col>
            </Row>
        </div>
    );
};

export default Register;
