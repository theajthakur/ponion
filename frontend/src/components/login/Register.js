"use client";
import { useEffect, useState } from "react";
import { Mail, Lock, User, Loader } from "lucide-react";
import Input from "../ui/Input";
import { toast } from "sonner";
import { Button } from "../ui/button";

export default function RegisterForm() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [gender, setGender] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Basic validation
            if (!email || !name || !gender || !password) {
                setError("Please fill in all fields");
                return;
            }

            setError("");

            const payload = {
                email,
                name,
                gender,
                password,
            };

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/signup`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );
            const data = await res.json();
            toast[data.status == "success" ? "success" : "error"](data.message);
        } catch (err) {
            toast.error(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!loading) {
            setError("");
        }
    }, [loading]);

    return (
        <div className="flex items-center justify-center min-h-[70vh] bg-background p-4">
            <div className="w-full lg:w-md bg-surface p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
                    Register on PONION
                </h2>

                {loading ? (
                    <div className="flex w-full justify-center">
                        <Loader className="animate-spin" />
                    </div>
                ) : (
                    <form className="space-y-4" onSubmit={handleRegister}>
                        <Input
                            label="Name"
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            icon={User}
                            error={error && !name ? "Name is required" : ""}
                        />

                        <Input
                            label="Email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            icon={Mail}
                            error={error && !email ? "Email is required" : ""}
                        />
                        <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="w-full p-2 border rounded-md"
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>

                        <Input
                            label="Password"
                            type="password"
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            icon={Lock}
                            error={error && !password ? "Password is required" : ""}
                        />

                        <Button type="submit" className="w-full">
                            Register
                        </Button>
                    </form>
                )}

                {error && (
                    <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
                )}
            </div>
        </div>
    );
}
