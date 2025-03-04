"use client";

import Auth from "./components/Auth";
import { SignInForm } from "./components/form/Signin";
import { SignUpForm } from "./components/form/SignUp";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Login = () => {
  return (
    <div className="flex items-center justify-center flex-col h-full relative">
      <Auth />
    </div>
  );
};

export default Login;
