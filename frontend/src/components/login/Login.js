"use client";
import { useEffect, useState } from "react";
import { Mail, Lock, Loader } from "lucide-react";
import Input from "../ui/Input";
import { toast } from "sonner";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      if (!email || !password) {
        setError("Please fill in all fields");
        return;
      }
      setError("");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password, remember }),
        }
      );
      const data = await res.json();
      if (data.status != "success") return toast.error(data.message);
      localStorage.setItem("ponion_token", data?.data.token);
      toast.success(data.message);
      window.location.href = "/";
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setEmail("");
    setPassword("");
    setRemember(false);
  }, [loading]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center min-h-[70vh] bg-background p-4">
      <div className="w-full lg:w-md bg-surface p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
          Login to PONION
        </h2>

        {loading ? (
          <div className="loader-section flex w-full justify-center">
            <Loader className="animate-spin" />
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleLogin}>
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              error={error && !email ? "Email is required" : ""}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
              error={error && !password ? "Password is required" : ""}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                <Checkbox checked={remember} onCheckedChange={setRemember} />
                Remember me
              </label>
              <a href="#" className="text-sm text-primary hover:underline">
                Forgot password?
              </a>
            </div>

            <Button type="submit" className={"w-full"}>Login</Button>
          </form>
        )}

        {error && (
          <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
        )}
      </div>
    </motion.div>
  );
}
