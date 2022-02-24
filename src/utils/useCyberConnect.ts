import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { useEffect, useMemo, useState } from "react";
const CCLoader = import("@cyberlab/cyberconnect");

const useCyberConnect = () => {
  const conncetor = useWalletConnect();

  const CyberConnect = useMemo(
    () => CCLoader.then((module) => module.default),
    []
  );

  const [cc, setCC] = useState<any>(null);

  useEffect(() => {
    if (conncetor.connected) {
      CyberConnect.then((CC) => {
        const ccInstance = new CC({
          provider: conncetor,
          env: "STAGING",
          clientType: "RN",
          namespace: "CyberConnect",
        });

        setCC(ccInstance);
      });
    }
  }, [conncetor]);

  return { cc, conncetor };
};

export default useCyberConnect;
