import React, { useState } from 'react';
import Googlelogin from './googleligin';
import { Link, useNavigate } from 'react-router-dom';


const Register = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [errors, setErrors] = useState({});
  const [emailExistsError, setEmailExistsError] = useState('');
  const [registrationError, setRegistrationError] = useState('');

  const validate = () => {
    let newErrors = {};
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    if (!firstName.trim()) newErrors.firstName = "Please enter your first name.";
    if (!lastName.trim()) newErrors.lastName = "Please enter your last name.";
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
    setErrors({});

    if (!validate()) return;

    try {
      const response = await fetch('http://127.0.0.1:8000/apiv1/user/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.toLowerCase(),
          password,
          password2
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409 && data.errors?.email) {
          setEmailExistsError("This email is already registered");
        } else {
          setRegistrationError("Registration failed. Please try again.");
        }
        return;
      }

      navigate('/login');
    } catch (error) {
      setRegistrationError("Network error. Please check your connection.");
    }
  };

  return (
    <section className="_social_registration_wrapper _layout_main_wrapper">
      {/* Background Shapes */}
      <div className="_shape_one">
        <img src="/assets/shape1.svg" alt="" className="_shape_img" />
        <img src="/assets/dark_shape.svg" alt="" className="_dark_shape" />
      </div>
      <div className="_shape_two">
        <img src="/assets/shape2.svg" alt="" className="_shape_img" />
        <img src="/assets/dark_shape1.svg" alt="" className="_dark_shape _dark_shape_opacity" />
      </div>
      <div className="_shape_three">
        <img src="/assets/shape3.svg" alt="" className="_shape_img" />
        <img src="/assets/dark_shape2.svg" alt="" className="_dark_shape _dark_shape_opacity" />
      </div>

      <div className="_social_registration_wrap">
        <div className="container">
          <div className="row align-items-center">
            {/* Left Side - Image */}
            <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
              <div className="_social_registration_right">
                <div className="_social_registration_right_image">
                  <img src="/assets/registration.png" alt="Registration" />
                </div>
                <div className="_social_registration_right_image_dark">
                  <img src="/assets/registration1.png" alt="Registration Dark" />
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
              <div className="_social_registration_content">
                {/* Logo */}
                <div className="_social_registration_right_logo _mar_b28">
                  <img src="/assets/logo.svg" alt="Logo" className="_right_logo" />
                </div>

                <p className="_social_registration_content_para _mar_b8">Get Started Now</p>
                <h4 className="_social_registration_content_title _titl4 _mar_b50">Registration</h4>

                {/* Google Registration */}
                <div className="_mar_b40 text-center">
                  <Googlelogin />
                </div>

                <div className="_social_registration_content_bottom_txt _mar_b40">
                  <span>Or</span>
                </div>

                {/* Server Errors */}
                {emailExistsError && (
                  <div className="alert alert-danger text-center mb-3 py-2 rounded">
                    {emailExistsError}
                  </div>
                )}
                {registrationError && (
                  <div className="alert alert-danger text-center mb-3 py-2 rounded">
                    {registrationError}
                  </div>
                )}

                {/* Registration Form */}
                <form className="_social_registration_form" onSubmit={handleRegister}>
                  <div className="row">
                    {/* First Name */}
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8">First Name</label>
                        <input
                          type="text"
                          className={`form-control _social_registration_input ${errors.firstName ? 'border-danger' : ''}`}
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                        />
                        {errors.firstName && <div className="text-danger small mt-1">{errors.firstName}</div>}
                      </div>
                    </div>

                    {/* Last Name */}
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8">Last Name</label>
                        <input
                          type="text"
                          className={`form-control _social_registration_input ${errors.lastName ? 'border-danger' : ''}`}
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                        />
                        {errors.lastName && <div className="text-danger small mt-1">{errors.lastName}</div>}
                      </div>
                    </div>

                    {/* Email */}
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8">Email</label>
                        <input
                          type="email"
                          className={`form-control _social_registration_input ${errors.email ? 'border-danger' : ''}`}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                        {errors.email && <div className="text-danger small mt-1">{errors.email}</div>}
                      </div>
                    </div>

                    {/* Password */}
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8">Password</label>
                        <input
                          type="password"
                          className={`form-control _social_registration_input ${errors.password ? 'border-danger' : ''}`}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        {errors.password && <div className="text-danger small mt-1">{errors.password}</div>}
                      </div>
                    </div>

                    {/* Repeat Password */}
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8">Repeat Password</label>
                        <input
                          type="password"
                          className={`form-control _social_registration_input ${errors.password2 ? 'border-danger' : ''}`}
                          value={password2}
                          onChange={(e) => setPassword2(e.target.value)}
                          required
                        />
                        {errors.password2 && <div className="text-danger small mt-1">{errors.password2}</div>}
                      </div>
                    </div>
                  </div>

                  {/* Terms & Conditions */}
                  <div className="row">
                    <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
                      <div className="form-check _social_registration_form_check">
                        <input
                          className="form-check-input _social_registration_form_check_input"
                          type="checkbox"
                          id="termsCheck"
                          required
                        />
                        <label className="form-check-label _social_registration_form_check_label" htmlFor="termsCheck">
                          I agree to terms & conditions
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="row">
                    <div className="col-lg-12 col-md-12 col-xl-12 col-sm-12">
                      <div className="_social_registration_form_btn _mar_t40 _mar_b60">
                        <button type="submit" className="_social_registration_form_btn_link _btn1">
                          Register Now
                        </button>
                      </div>
                    </div>
                  </div>
                </form>

                {/* Already have account? */}
                <div className="row">
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                    <div className="_social_registration_bottom_txt">
                      <p className="_social_registration_bottom_txt_para">
                        Already have an account? <Link to="/login">Sign In</Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;