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
    <Card className="w-full min-w-2xl mt-4">
      <form onSubmit={handleSignup}>
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>Enter your email and password to sign up</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">Sign Up</Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export default Signup;
