import React, {useState, useEffect, useContext, useCallback} from 'react';
import Web3Modal from 'web3modal';
import WalletConnectProvider, { useWalletConnect } from '@walletconnect/react-native-dapp';
import {ethers} from 'ethers';
import CyberConnect from '@cyberlab/cyberconnect';

interface Web3ContextInterface {
  connectWallet: () => Promise<void>;
  address: string;
  ens: string | null;
  cyberConnect: CyberConnect | null;
}

export const Web3Context = React.createContext<Web3ContextInterface>({
  connectWallet: async () => undefined,
  address: '',
  ens: '',
  cyberConnect: null,
});

export const Web3ContextProvider: React.FC = ({children}) => {
  const [address, setAddress] = useState<string>('');
  const [ens, setEns] = useState<string | null>('');
  const [cyberConnect, setCyberConnect] = useState<CyberConnect | null>(null);

  async function getEnsByAddress(
    provider: any,
    address: string,
  ) {
    const ens = await provider.lookupAddress(address);
    return ens;
  }

  const initCyberConnect = useCallback((provider: any) => {
    const cyberConnect = new CyberConnect({
      provider: WalletConnectProvider,
      namespace: 'CyberConnect',
    });

    setCyberConnect(cyberConnect);
  }, []);

  const connectWallet = React.useCallback(async () => {
    // const web3Modal = new Web3Modal({
    //   network: 'mainnet',
    //   cacheProvider: true,
    //   providerOptions: {},
    // });

    const instance = await useWalletConnect().connect();

    const provider = WalletConnectProvider;
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const ens = await getEnsByAddress(provider, address);

    setAddress(address);
    setEns(ens);
    initCyberConnect(provider);
  }, [initCyberConnect]);

  return (
    <Web3Context.Provider
      value={{
        connectWallet,
        address,
        ens,
        cyberConnect,
      }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const web3 = useContext(Web3Context);
  return web3;
};
