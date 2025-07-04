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

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/auth/signup", { email, password });
      alert("Signup successful. Please login.");
      navigate("/");
    } catch (err) {
      alert("Signup failed: " + err.response?.data || "Server error");
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
