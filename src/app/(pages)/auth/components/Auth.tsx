import { useEffect, useState } from "react";
import { listen } from "@tauri-apps/api/event";
import { open } from "tauri-plugin-shellx-api";
import { invoke } from "@tauri-apps/api/core";
import { useSupabaseContextProvider } from "@/contexts/SupabaseContext";
import HttpClient from "@/client/HttpClient";
import { useAuth } from "../hooks/useAuth";

export default function Auth() {
  const { onProviderLogin, getSession, signOut } = useAuth();

  return (
    <div className="row flex flex-center">
      <div className="flex flex-col">
        <button onClick={onProviderLogin("google")}>Google</button>
        <button onClick={signOut}>Sign out</button>
        <button onClick={getSession}>Get session</button>
      </div>
    </div>
  );
}
