"use client";

import { Auth } from "../../components/auth/Auth";
import { SignInForm } from "../../components/auth/form/Signin";
import { SignUpForm } from "../../components/auth/form/SignUp";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Login = () => {
  return (
    <div className="flex items-center justify-center flex-col relative h-screen">
      <Auth />
    </div>
  );
};

export default Login;
