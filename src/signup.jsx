import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";


function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/signup`, { email, password });
      alert("Signup successful. Please login.");
      navigate("/");
    } catch (err) {
  const msg = err.response?.data?.message || "Server error";
  alert("Signup failed: " + msg);
}

  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 dark:bg-slate-900">
      <Card className="w-full max-w-md p-4 z-10 dark:bg-slate-800 dark:border-gray-700">
        <form onSubmit={handleSignup}>
          <CardHeader>
            <CardTitle className="text-2xl dark:text-white">Create Account</CardTitle>
            <CardDescription className="text-sm dark:text-slate-300">Enter your email and password to sign up</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <Input 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="dark:bg-slate-700 dark:border-gray-600 dark:text-white"
              required
            />
            <Input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="dark:bg-slate-700 dark:border-gray-600 dark:text-white"
              required
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full">Sign Up</Button>
            <p className="text-sm text-center text-gray-600 dark:text-slate-400">
              Already have an account? <a href="/login" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">Login</a>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default Signup;
