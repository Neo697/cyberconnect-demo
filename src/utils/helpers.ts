// @ts-ignore
import crypto from "react-native-ecc";
import Buffer from "buffer";
// import * as TextEncoder from 'text-encoding'
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { hexlify } from "@ethersproject/bytes";
import { toUtf8Bytes } from "@ethersproject/strings";

const globalSign: any = {};

export const formatAddress = (address: string) => {
  const len = address.length;
  return address.substr(0, 5) + "..." + address.substring(len - 4, len);
};

export const isValidAddr = (address: string) => {
  const re = /^0x[a-fA-F0-9]{40}$/;
  return address.match(re);
};
