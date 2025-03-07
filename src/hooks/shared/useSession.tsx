"use client";
import { useSessionContextProvider } from "@/contexts/SessionContext";
import type { Session } from "next-auth";
import { useState } from "react";

export const useSession = () => {
  const { session } = useSessionContextProvider();

  return { session };
};
