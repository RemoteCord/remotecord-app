import { useEffect, useState } from "react";
import { StoreService } from "@/services/store";
import { useStoreTauri } from "@/hooks/common/useStore";

export const useConnection = () => {
  const { insertRecord, getRecord } = useStoreTauri();
  const [autoaccept, setAutoaccept] = useState<boolean>(false);
  const handleAutoacceptConnection = (status: boolean) => {
    console.log("autoaccept", status);

    insertRecord("autoaccept", status);
    setAutoaccept(status);
  };

  useEffect(() => {
    const getAutoaccept = async () => {
      const autoaccept = await getRecord("autoaccept");
      console.log(autoaccept);
      if (!autoaccept) return;
      setAutoaccept(autoaccept as boolean);
    };

    void getAutoaccept();
  }, []);

  return { handleAutoacceptConnection, autoaccept };
};
