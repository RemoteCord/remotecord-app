import { useStoreTauri } from "@/hooks/common/useStore";
import { useEffect, useState } from "react";

export const useConnection = () => {
  const { insertRecord, getRecord } = useStoreTauri();
  const [autoaccept, setAutoaccept] = useState<boolean>(false);
  const handleAutoacceptConnection = (status: boolean) => {
    console.log("autoaccept", status);

    insertRecord("autoaccept", status);
    setAutoaccept(status);
  };

  useEffect(() => {
    console.log("autoaccept", autoaccept);
  }, [autoaccept]);

  useEffect(() => {
    const getAutoaccept = async () => {
      const autoaccept = await getRecord("autoaccept");
      console.log("autoaccept", autoaccept);
      if (!autoaccept) {
        insertRecord("autoaccept", true);
        setAutoaccept(true);
        return;
      }
      setAutoaccept(autoaccept as boolean);
    };

    void getAutoaccept();
  }, []);

  return { handleAutoacceptConnection, autoaccept };
};
