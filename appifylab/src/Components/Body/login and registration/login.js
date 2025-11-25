import React, { useState } from 'react';
import axios from 'axios';
import Googlelogin from './googleligin';
import { Link } from 'react-router-dom';


const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    const user = { email, password };
    try {
      const { data } = await axios.post("http://127.0.0.1:8000/token/", user);
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      window.location.href = "/";
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError("Invalid email or password");
      } else {
        setError("Error in token fetch");
      }
    }
  };

  return (
    <section className="_social_login_wrapper _layout_main_wrapper">
      {/* Background Shapes */}
      <div className="_shape_one">
        <img src="assets/shape1.svg" alt="" className="_shape_img" />
        <img src="assets/dark_shape.svg" alt="" className="_dark_shape" />
      </div>
      <div className="_shape_two">
        <img src="assets/shape2.svg" alt="" className="_shape_img" />
        <img src="assets/dark_shape1.svg" alt="" className="_dark_shape _dark_shape_opacity" />
      </div>
      <div className="_shape_three">
        <img src="assets/shape3.svg" alt="" className="_shape_img" />
        <img src="assets/dark_shape2.svg" alt="" className="_dark_shape _dark_shape_opacity" />
      </div>

      <div className="_social_login_wrap">
        <div className="container">
          <div className="row align-items-center">
            {/* Left Side - Image */}
            <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
              <div className="_social_login_left">
                <div className="_social_login_left_image">
                  <img src="assets/login.png" alt="Login" className="_left_img" />
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
              <div className="_social_login_content">
                {/* Logo */}
                <div className="_social_login_left_logo _mar_b28">
                  <img src="assets/logo.svg" alt="Logo" className="_left_logo" />
                </div>

                <p className="_social_login_content_para _mar_b8">Welcome back</p>
                <h4 className="_social_login_content_title _titl4 _mar_b50">Login to your account</h4>

                {/* Google Login */}
                <div className="_mar_b40 text-center">
                  <Googlelogin />
                </div>

                {/* OR Line */}
                <div className="_social_login_content_bottom_txt _mar_b40">
                  <span>Or</span>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="alert alert-danger text-center mb-4 py-2 rounded">
                    {error}
                  </div>
                )}

                {/* Login Form */}
                <form className="_social_login_form" onSubmit={submit}>
                  <div className="row">
                    {/* Email */}
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_login_form_input _mar_b14">
                        <label className="_social_login_label _mar_b8">Email</label>
                        <input
                          type="email"
                          className="form-control _social_login_input"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_login_form_input _mar_b14">
                        <label className="_social_login_label _mar_b8">Password</label>
                        <input
                          type="password"
                          className="form-control _social_login_input"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Remember me + Forgot password */}
                  <div className="row">
                    <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12">
                      <div className="form-check _social_login_form_check">
                        <input
                          className="form-check-input _social_login_form_check_input"
                          type="checkbox"
                          id="rememberMe"
                        />
                        <label className="form-check-label _social_login_form_check_label" htmlFor="rememberMe">
                          Remember me
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12">
                      <div className="_social_login_form_left">
                        <p className="_social_login_form_left_para">Forgot password?</p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="row">
                    <div className="col-lg-12 col-md-12 col-xl-12 col-sm-12">
                      <div className="_social_login_form_btn _mar_t40 _mar_b60">
                        <button type="submit" className="_social_login_form_btn_link _btn1">
                          Login now
                        </button>
                      </div>
                    </div>
                  </div>
                </form>

                {/* Sign Up Link */}
                <div className="row">
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                    <div className="_social_login_bottom_txt">
                      <p className="_social_login_bottom_txt_para">
                        Don't have an account? <Link to="/register">Create New Account</Link>
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

export default LoginPage;