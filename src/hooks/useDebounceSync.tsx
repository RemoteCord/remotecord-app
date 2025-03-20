"use client";

import { useEffect, useRef } from "react";

export const useDebouncedSync = (
  dataToSync: unknown,
  handler: () => void,
  debounceTime = 300
) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const previousDataRef = useRef<unknown | null>(null); // Para guardar el estado anterior

  const syncData = async () => {
    if (
      !dataToSync ||
      JSON.stringify(dataToSync) === JSON.stringify(previousDataRef.current)
    ) {
      console.log("Sin cambios, no se sincroniza");
      return;
    }

    try {
      handler();

      // Actualiza el estado previo después de sincronizar
      previousDataRef.current = dataToSync;
      console.log("Datos sincronizados con debounce");
    } catch (error) {
      console.error("Error al sincronizar datos", error);
    }
  };

  useEffect(() => {
    if (!dataToSync) return;

    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      syncData();
    }, debounceTime);

    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [dataToSync, debounceTime]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (
        dataToSync &&
        JSON.stringify(dataToSync) !== JSON.stringify(previousDataRef.current)
      ) {
        handler();
        event.preventDefault();
        event.returnValue = "";
      }
    };

    const handleUnload = () => {
      if (
        dataToSync &&
        JSON.stringify(dataToSync) !== JSON.stringify(previousDataRef.current)
      ) {
        handler();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
    };
  }, [dataToSync, handler]);
};
