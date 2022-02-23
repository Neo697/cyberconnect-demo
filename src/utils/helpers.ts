// @ts-ignore
import crypto from "react-native-ecc";
import Buffer from "buffer";
// import * as TextEncoder from 'text-encoding'
import { useWalletConnect } from "@walletconnect/react-native-dapp";

const globalSign: any = {}

export const formatAddress = (address: string) => {
  const len = address.length;
  return address.substr(0, 5) + '...' + address.substring(len - 4, len);
};

export const isValidAddr = (address: string) => {
  const re = /^0x[a-fA-F0-9]{40}$/;
  return address.match(re);
};

// export async function generateSigningKey(address: string) {

//   const msg = Buffer.Buffer.from("hey ho");

//   if (crypto.getServiceID()) {
//     crypto.keyPair("p256", (err: any, key: any) => {
//       key.sign(
//         {
//           data: msg,
//           algorithm: "sha256",
//         },
//         (err: any, sig: any) => {
//           // signatures tested for compatibility with npm library "elliptic"
//           global.Object.assign(globalSign, {'signKey': sig.toString("hex")})
//           key.verify(
//             {
//               algorithm: "sha256",
//               data: msg,
//               sig: sig,
//             },
//             (err: any, verified: any) => {
//               // console.log('verified:', verified);
//             }
//           );
//         }
//       );
//     });
//   } else {
//     crypto.setServiceID("be.excellent.to.each.other");
//   }
// }

// export async function getSigningKey(address: string) {
//   let signingKey = await globalSign.signKey
//   if (!signingKey) {
//     signingKey = generateSigningKey(address);
//   }

//   return signingKey;
// }

// export async function signWithSigningKey(input: string, address: string) {
//   const signingKey = await getSigningKey(address);
//   const algorithm = {
//     name: "ECDSA",
//     hash: {
//       name: "SHA-256",
//     },
//   };
//   TextEncoder.TextEncoder.encoding = input
//   const encodedMessage = TextEncoder.TextEncoder.encoding;
//   console.log(encodedMessage)
//   // const encodedMessage = enc.encode(input);

//   const signature = await crypto.subtle.sign(
//     algorithm,
//     signingKey.privateKey,
//     // encodedMessage
//   );

//   // return arrayBuffer2Hex(signature);
// }

// const getAddress = () => {
//     if (address) {
//       return address;
//     }
//     return (address = await getAddressByProvider(
//       provider,
//       chain,
//     ));
//   }

// export const connect = async (targetAddr: string, alias: string = '') => {
//     try {
//       address = await getAddress();
//       await authWithSigningKey();

//       const operation: Operation = {
//         name: 'follow',
//         from: address,
//         to: targetAddr,
//         namespace: namespace,
//         network: chain,
//         alias,
//         timestamp: Date.now(),
//       };

//       const signature = await signWithSigningKey(
//         JSON.stringify(operation),
//         address,
//       );
//       const publicKey = await getPublicKey(address);

//       const params = {
//         fromAddr: address,
//         toAddr: targetAddr,
//         alias,
//         namespace: namespace,
//         url: endpoint.cyberConnectApi,
//         signature,
//         signingKey: publicKey,
//         operation: JSON.stringify(operation),
//         network: chain,
//       };

//       // const sign = await signWithJwt();

//       const resp = await follow(params);

//       if (resp?.data?.connect.result === 'INVALID_SIGNATURE') {
//         await clearSigningKey();

//         throw new ConnectError(
//           ErrorCode.GraphqlError,
//           resp?.data?.connect.result,
//         );
//       }

//       if (resp?.data?.connect.result !== 'SUCCESS') {
//         throw new ConnectError(
//           ErrorCode.GraphqlError,
//           resp?.data?.connect.result,
//         );
//       }
//     } catch (e: any) {
//       throw new ConnectError(ErrorCode.GraphqlError, e.message || e);
//     }
//     if (DFLAG) {
//       ceramicConnect(targetAddr, alias);
//     }
//   }