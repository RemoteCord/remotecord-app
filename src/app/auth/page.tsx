"use client";

import { SignInForm } from "./components/form/Signin";
import { SignUpForm } from "./components/form/SignUp";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Login = () => {
  return (
    <div className="flex items-center justify-center flex-col h-full relative">
      <a href="/" className="">
        go home
      </a>
      <Tabs
        defaultValue="signin"
        className="w-[60%] flex flex-col justify-between"
      >
        <TabsList className="absolute top-4 w-[60%]">
          <TabsTrigger value="signin">Iniciar Sesion</TabsTrigger>
          <TabsTrigger value="signup">Registrarse</TabsTrigger>
        </TabsList>

        <TabsContent value="signin">
          <SignInForm />
        </TabsContent>
        <TabsContent value="signup">
          <SignUpForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Login;
