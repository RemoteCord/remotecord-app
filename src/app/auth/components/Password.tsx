"use client";
import { Button } from "@/components/ui/button";
import { Input, InputAnimated } from "@/components/ui/input";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
export function Password() {
  const [password, setPassword] = useState<string>("a");
  const [password2, setPassword2] = useState<string>("a");

  const [fields, setFields] = useState({
    length8: {
      value: false,
      message: "Password must be at least 8 characters",
    },
    uppercase: {
      value: false,
      message: "Password must contain at least one uppercase letter",
    },
    lowercase: {
      value: false,
      message: "Password must contain at least one lowercase letter",
    },
    number: {
      value: false,
      message: "Password must contain at least one number",
    },
    special: {
      value: false,
      message: "Password must contain at least one special character",
    },
    passwordMatch: {
      value: false,
      message: "Passwords must match",
    },
  });

  const validatePassword = (password: string, password2: string) => {
    setFields({
      length8: {
        value: password.length >= 8,
        message: "At least 8 characters",
      },
      uppercase: {
        value: /[A-Z]/.test(password),
        message: "One uppercase letter",
      },
      lowercase: {
        value: /[a-z]/.test(password),
        message: "One lowercase letter",
      },
      number: { value: /\d/.test(password), message: "One number" },
      special: {
        value: /[^A-Za-z0-9]/.test(password),
        message: "One special character",
      },
      passwordMatch: {
        value: password === password2,
        message: "Passwords must match",
      },
    });
  };

  return (
    <div className="relative border h-full flex items-end justify-center">
      <div className="   flex items-center justify-center flex-col gap-4 w-[60vw]">
        <InputAnimated
          type="password"
          onChange={(e) => {
            validatePassword(e.target.value, password2);
            setPassword(e.target.value);
          }}
          style={{}}
          className="border-white border-opacity-40 focus:border-white focus:border-opacity-100 h-10 transition-all "
        />
        <Input
          type="password"
          onChange={(e) => {
            validatePassword(password, e.target.value);
            setPassword2(e.target.value);
          }}
          style={{}}
          className="border-white border-opacity-40 focus:border-white focus:border-opacity-100 h-10"
        />

        <div className="flex flex-col gap-8 w-full bg-zinc-900/50 p-4 rounded-lg">
          {Object.values(fields).map((field, index) => {
            return (
              <div
                key={index}
                className={`flex gap-4 transition-all duration-150 ${
                  field.value ? "text-green-500" : "text-red-500"
                }`}
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={field.value.toString()}
                    initial={{ scale: 0, x: 10, opacity: 0 }}
                    animate={{ scale: 1, x: 0, opacity: 1 }}
                    exit={{ scale: 0, x: -10, opacity: 0 }}
                  >
                    {field.value ? <Check /> : <X />}
                  </motion.span>
                </AnimatePresence>
                <p>{field.message}</p>
              </div>
            );
          })}
        </div>
        <p>{password}</p>
      </div>
    </div>
  );
}

const Check = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const X = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="3"
    stroke-linecap="round"
    stroke-linejoin="round"
    className={className}
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);
