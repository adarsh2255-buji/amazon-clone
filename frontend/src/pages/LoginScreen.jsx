import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import api from '../utils/api';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const LoginScreen = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirect = searchParams.get("redirect") || "/";
    const { state, dispatch } = useStore();
    const { userInfo } = state;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    useEffect(() => { if (userInfo) navigate(redirect); }, [userInfo, redirect, navigate]);
    
    const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login", { email, password });
      // Backend returns { success, token, user }
      const payload = { token: data.token, ...data.user };
      dispatch({ type: "USER_LOGIN", payload });
      localStorage.setItem("userInfo", JSON.stringify(payload));
      navigate(redirect);
    } catch (err) { setError(err.response?.data?.message || err.message); }
  };

   // Google Success Handler (Logic is ready)
  const googleLoginHandler = async (credentialResponse) => {
    try {
      const { data } = await api.post("/auth/google", {
        idToken: credentialResponse.credential,
      });
      const payload = { token: data.token, ...data.user };
      dispatch({ type: "USER_LOGIN", payload });
      localStorage.setItem("userInfo", JSON.stringify(payload));
      navigate(redirect);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <>
    
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-md border border-gray-200">
      
      <h1 className="text-2xl font-bold mb-6">Sign In</h1>
      {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}
      
      <form onSubmit={submitHandler}>
        <div className="mb-4">
           <label className="block font-bold mb-2">Email</label>
           <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border p-2 rounded" required />
        </div>
        <div className="mb-6">
           <label className="block font-bold mb-2">Password</label>
           <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border p-2 rounded" required />
        </div>
        <button type="submit" className="w-full bg-yellow-400 font-bold py-2 rounded-full hover:bg-yellow-500">Continue</button>
      </form>

      {/* --- GOOGLE LOGIN SECTION --- */}
      <div className="my-6 flex items-center justify-center">
        <div className="border-t border-gray-300 grow mr-3"></div>
        <span className="text-gray-500 text-sm font-bold">OR</span>
        <div className="border-t border-gray-300 grow ml-3"></div>
      </div>
      <div className="flex justify-center w-full">
  
         <GoogleLogin
            onSuccess={googleLoginHandler}
            onError={() => setError("Google Login Failed")}
            width="100%"
         /> 
   
      </div>
      <div className="text-center mt-4 text-sm">
        New customer? <Link to="/register" className="text-blue-600 hover:underline">Click here</Link>
      </div>
    </div>
    </>
  )
}

export default LoginScreen