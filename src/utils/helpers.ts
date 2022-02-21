// @ts-ignore
import {createSign} from 'react-native-crypto';

export const formatAddress = (address: string) => {
  const len = address.length;
  return address.substr(0, 5) + '...' + address.substring(len - 4, len);
};

export const isValidAddr = (address: string) => {
  const re = /^0x[a-fA-F0-9]{40}$/;
  return address.match(re);
};

export async function createSigningKey(address: string) {
  const algorithm = {
    name: 'ECDSA',
    namedCurve: 'P-256',
  };
  const extractable = false;
  const keyUsages: string[] = ['sign', 'verify'];

  const signingKey = await createSign(
    algorithm,
    extractable,
    keyUsages,
  );

  return signingKey;
}