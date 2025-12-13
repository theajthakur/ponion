"use client";
import LoginForm from "@/components/login/Login";
import RegisterForm from "@/components/login/Register";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function page() {
  const [curPage, setCurPage] = useState("login");
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="flex items-center gap-2 border-2 rounded-lg border-primary p-1">
        <Button variant={curPage === "login" ? "default" : "ghost"} onClick={() => setCurPage("login")}>
          Login
        </Button>
        <Button variant={curPage === "register" ? "default" : "ghost"} onClick={() => setCurPage("register")}>
          Register
        </Button>
      </div>
      {curPage === "login" ? <LoginForm /> : <RegisterForm />}
    </div>
  );
}
