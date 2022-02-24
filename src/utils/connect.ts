import { hexlify } from "@ethersproject/bytes";
import { toUtf8Bytes } from "@ethersproject/strings";
import { set, get, clear } from "../cyberconnect/DB";
import encoding from 'text-encoding'
import { IDX } from "@ceramicstudio/idx";
import { CeramicClient } from "@ceramicnetwork/http-client";


export const endpoints: { [key in Env]: Endpoint } = {
  STAGING: {
    ceramicUrl: "https://ceramic.stg.cybertino.io",
    cyberConnectSchema:
      "kjzl6cwe1jw149mvqedik2h3j26y4bmcvucjbbhezwcr7dgdyyg9v0x8xfvlp1j",
    cyberConnectApi: "https://api.stg.cybertino.io/connect/",
  },
  PRODUCTION: {
    ceramicUrl: "https://ceramic.cybertino.io",
    cyberConnectSchema:
      "kjzl6cwe1jw14b3g6d22ze4jaatoikiq62qrmnbzo8hkg68ic7w0smq9ymzsxta",
    cyberConnectApi: "https://api.cybertino.io/connect/",
  },
};

// @ts-ignore
const endpoint = endpoints["STAGING"];

const ceramicClient = new CeramicClient(endpoint.ceramicUrl);

export const DFLAG = false;

export enum Blockchain {
  ETH = "ETH",
  SOLANA = "SOLANA",
}

export enum CLIENT_TYPE {
  WEB = "WEB",
  RN = "RN",
}

export enum ErrorCode {
  EmptyNamespace = "EmptyNamespace",
  EmptyEthProvider = "EmptyEthProvider",
  EmptyAuthProvider = "EmptyAuthProvider",
  NetworkError = "NetworkError",
  GraphqlError = "GraphqlError",
  CeramicError = "CeramicError",
  AuthProviderError = "AuthProviderError",
  SignJwtError = "SignJwtError",
}

export enum Env {
  STAGING = "STAGING",
  PRODUCTION = "PRODUCTION",
}

export interface Endpoint {
  ceramicUrl: string;
  cyberConnectSchema: string;
  cyberConnectApi: string;
}

export function arrayBuffer2Hex(buffer: ArrayBuffer) {
  return (
    "0x" +
    Array.prototype.map
      .call(new Uint8Array(buffer), (x) => ("00" + x.toString(16)).slice(-2))
      .join("")
  );
}

// registerKey request
export const registerSigningKey = (input: any) => {
  return {
    operationName: "registerKey",
    query: `mutation registerKey($input: RegisterKeyInput!) {
      registerKey(input: $input) {
        result
      }
    }`,
    variables: { input },
  };
};

export const registerSigningKeySchema = (input: any) => {
  return {
    operationName: "registerKey",
    query: `mutation registerKey($input: RegisterKeyInput!) {
      registerKey(input: $input) {
        result
      }
    }`,
    variables: { input },
  };
};
export const connectQuerySchema = (input: any) => {
  return {
    operationName: "connect",
    query: `mutation connect($input: UpdateConnectionInput!) {connect(input: $input) {result}}`,
    variables: {
      input,
    },
  };
};

export const disconnectQuerySchema = (input: any) => {
  return {
    operationName: "disconnect",
    query: `mutation disconnect($input: UpdateConnectionInput!) {disconnect(input: $input) {result}}`,
    variables: {
      input,
    },
  };
};
export const setAliasQuerySchema = (input: any) => {
  return {
    operationName: "alias",
    query: `mutation alias($input: UpdateConnectionInput!) {alias(input: $input) {result}}`,
    variables: {
      input,
    },
  };
};

export const authSchema = ({
  address,
  signature,
  network = Blockchain.ETH,
}: {
  address: string;
  signature: string;
  network: Blockchain;
}) => {
  return {
    operationName: "auth",
    query: `mutation auth($address: String!, $signature: String!, $network: String) {
      auth(address: $address, signature: $signature, network: $network) {
        result
        authToken
      }
    }`,
    variables: { address, signature, network },
  };
};

export const querySchemas = {
  connect: connectQuerySchema,
  disconnect: disconnectQuerySchema,
  auth: authSchema,
  setAlias: setAliasQuerySchema,
  registerSigningKey: registerSigningKeySchema,
};

const errors: { [key in ErrorCode]: string } = {
  EmptyNamespace: "Namespace can not be empty",
  EmptyEthProvider: "Eth provider can not be empty",
  EmptyAuthProvider: "Could not find authProvider",
  NetworkError: "",
  GraphqlError: "",
  CeramicError: "",
  AuthProviderError: "",
  SignJwtError: "",
};

export async function clearSigningKey() {
  await clear();
}

export const request = async (url = "", data = {}) => {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST",
    mode: "cors",
    // @ts-ignore
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    referrerPolicy: "no-referrer",
    body: JSON.stringify(data),
  });

  return response.json();
};

export const handleQuery = (
  data: {
    query: string;
    variables: object;
    operationName: string;
  },
  url: string
) => {
  return request(url, data);
};

export const follow = ({
  fromAddr,
  toAddr,
  alias,
  namespace,
  url,
  signature,
  operation,
  signingKey,
  network = Blockchain.ETH,
}: {
  fromAddr: string;
  toAddr: string;
  alias: string;
  namespace: string;
  signature: string;
  url: string;
  operation: string;
  signingKey: string;
  network: Blockchain;
}) => {
  const schema = querySchemas["connect"]({
    fromAddr,
    toAddr,
    alias,
    namespace,
    signature,
    operation,
    signingKey,
    network,
  });
  console.log(schema)
  return handleQuery(schema, url);
};

export const unfollow = ({
  fromAddr,
  toAddr,
  alias,
  namespace,
  url,
  signature,
  operation,
  signingKey,
  network = Blockchain.ETH,
}: {
  fromAddr: string;
  toAddr: string;
  alias: string;
  namespace: string;
  signature: string;
  url: string;
  operation: string;
  signingKey: string;
  network: Blockchain;
}) => {
  const schema = querySchemas["disconnect"]({
    fromAddr,
    toAddr,
    alias,
    namespace,
    signature,
    operation,
    signingKey,
    network,
  });
  return handleQuery(schema, url);
};

export class ConnectError {
  code: ErrorCode | undefined;
  message: string | undefined;

  constructor(code: ErrorCode, message?: string) {
    code = code;
    message = message || errors[code];
  }

  printError() {
    console.error(this.message);
  }
}

function arrayBuffer2String(buffer: ArrayBuffer) {
  return String.fromCharCode.apply(null, new Uint8Array(buffer) as any);
}

export const getSigningKeySignature = async (
  provider: any,
  message: string,
  address: string
) => {
  // rn connector
  return await provider.signPersonalMessage([
    hexlify(toUtf8Bytes(message)),
    address,
  ]);
};

export async function generateSigningKey() {
  const algorithm = {
    name: "ECDSA",
    namedCurve: "P-256",
  };
  const extractable = true;
  const keyUsages: KeyUsage[] = ["sign", "verify"];

  const signingKey = await window.crypto.subtle.generateKey(
    algorithm,
    extractable,
    keyUsages
  );

  set("signingKey", signingKey).then();

  return signingKey;
}

export async function getSigningKey() {
  let signingKey = await get("signingKey");

  if (!signingKey) {
    signingKey = generateSigningKey();
  }

  return signingKey;
}

export async function hasSigningKey() {
  return await get("signingKey");
}

export async function getPublicKey() {
  const signingKey = await getSigningKey();
  const exported = await window.crypto.subtle.exportKey(
    "spki",
    signingKey.publicKey
  );

  return window.btoa(arrayBuffer2String(exported));
}

const authWithSigningKey = async (provider: any, address: string) => {
  if (await hasSigningKey()) {
    return;
  }

  const publicKey = await getPublicKey();
  const acknowledgement =
    "I authorize CyberConnect from this device using signing key:\n";
  const message = `${acknowledgement}${publicKey}`;

  const newaddress = await getAddress(provider, address);
  const signingKeySignature = await getSigningKeySignature(
    provider,
    message,
    newaddress
  );

  if (signingKeySignature) {
    const resp = await registerSigningKey({
      address: newaddress,
      signature: signingKeySignature,
      message,
      network: "ETH",
      url: endpoint.cyberConnectApi,
    });

    // if (resp?.data?.registerKey.result !== "SUCCESS") {
    //   throw new ConnectError(ErrorCode.GraphqlError, resp?.data?.alias.result);
    // }
  } else {
    throw new Error("signingKeySignature is empty");
  }
};

const getAddress = async (provider: any, address?: string) => {
  if (address) {
    return address;
  }
  return (address = await getAddressByProvider(provider, Blockchain.ETH));
};

export let CURRENT_CLIENT_TYPE: CLIENT_TYPE.WEB | CLIENT_TYPE.RN;

const isRN = () => CURRENT_CLIENT_TYPE === CLIENT_TYPE.RN;

export const getAddressByProvider = async (
  provider: any,
  chain: Blockchain
) => {
  switch (chain) {
    case Blockchain.ETH: {
      console.log("asdasdsadasd", Boolean(isRN()), provider.accounts[0]);

      // rn connector
      if (isRN()) {
        return provider.accounts[0];
      }

      // ethers Web3Provider
      if (typeof provider.getSigner === "function") {
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        return address;
      }

      // ETH Provider
      const addresses = await safeSend(provider, "eth_accounts");
      if (addresses && addresses[0]) {
        return addresses[0];
      } else {
        return "";
      }
    }
    case Blockchain.SOLANA: {
      return provider.publicKey.toString();
    }
    default: {
      return "";
    }
  }
};

export async function signWithSigningKey(input: string) {
  const signingKey = await getSigningKey();
  const algorithm = {
    name: "ECDSA",
    hash: {
      name: "SHA-256",
    },
  };
  // const enc = new TextEncoder();
  const encodedMessage = new encoding.TextEncoder().encode(input);

  const signature = await window.crypto.subtle.sign(
    algorithm,
    signingKey.privateKey,
    encodedMessage
  );

  return arrayBuffer2Hex(signature);
}

const getOutboundLink = async () => {
    // if (!idxInstance) {
    //   throw new ConnectError(
    //     ErrorCode.CeramicError,
    //     "Could not find idx instance"
    //   );
    // }

    try {
      const result = (await idxInstance.get(
        "cyberConnect"
      )) as any;

      return result?.outboundLink || [];
    } catch (e) {
      console.log('getOutboundLink is Error');
      // throw new ConnectError(ErrorCode.CeramicError, e as string);
    }
  }

const idxInstance = new IDX({
  ceramic: ceramicClient,
  aliases: {
    cyberConnect: endpoint.cyberConnectSchema,
  },
  autopin: true,
});

const ceramicConnect = async (targetAddr: string, alias: string = "") => {
  try {
    const outboundLink = await getOutboundLink();

    // if (!idxInstance) {
    //   throw new ConnectError(
    //     ErrorCode.CeramicError,
    //     "Could not find idx instance"
    //   );
    // }

    const index = outboundLink.findIndex((link: any) => {
      return link.target === targetAddr && link.namespace === 'CyberConnect';
    });

    const curTimeStr = String(Date.now());

    if (index === -1) {
      outboundLink.push({
        target: targetAddr,
        connectionType: "follow",
        namespace: 'CyberConnect',
        alias,
        createdAt: curTimeStr,
      });
    } else {
      outboundLink[index].createdAt = curTimeStr;
    }

    idxInstance.set("cyberConnect", { outboundLink });
  } catch (e) {
    console.error(e);
  }
}

const ceramicDisconnect = async (targetAddr: string) => {
    try {
      const outboundLink = await getOutboundLink();

      // if (!idxInstance) {
      //   throw new ConnectError(
      //     ErrorCode.CeramicError,
      //     "Could not find idx instance"
      //   );
      // }

      const newOutboundLink = outboundLink.filter((link: any) => {
        return link.target !== targetAddr || link.namespace !== 'CyberConnect';
      });

      idxInstance.set("cyberConnect", {
        outboundLink: newOutboundLink,
      });
    } catch (e) {
      console.error(e);
    }
  }

export const connect = async (provider: any, address: string, targetAddr: string, alias: string = "") => {
  try {
    const newaddress = await getAddress(provider, address);

    // console.log("get address", newaddress);

    await authWithSigningKey(provider, address);

    // console.log("sign success!");

    const operation: any = {
      name: "follow",
      from: newaddress,
      to: targetAddr,
      namespace: 'CyberConnect',
      network: Blockchain.ETH,
      alias,
      timestamp: Date.now(),
    };

    // console.log(operation)

    const signature = await signWithSigningKey(JSON.stringify(operation));
    const publicKey = await getPublicKey();

    const params = {
      fromAddr: newaddress,
      toAddr: targetAddr,
      alias,
      namespace: 'CyberConnect',
      url: endpoint.cyberConnectApi,
      // signature,
      signingKey: publicKey,
      operation: JSON.stringify(operation),
      network: 'ETH',
    };

    console.log(endpoint.cyberConnectApi);

    // const sign = await signWithJwt();

    const resp = await follow(params as any);
    console.log(resp)

    if (resp?.data?.connect.result === "INVALID_SIGNATURE") {
      await clearSigningKey();
      console.log("INVALID_SIGNATURE");

      // throw new ConnectError(
      //   ErrorCode.GraphqlError,
      //   resp?.data?.connect.result
      // );
    }

    if (resp?.data?.connect.result !== "SUCCESS") {
      console.log("follow is unsuccessed");
      // throw new ConnectError(
      //   ErrorCode.GraphqlError,
      //   resp?.data?.connect.result
      // );
    }
  } catch (e: any) {
    console.log('connect of Error')
    // throw new ConnectError(ErrorCode.GraphqlError, e.message || e);
  }
  if (DFLAG) {
    ceramicConnect(targetAddr, alias);
  }
}

export const disconnect = async (provider: any, address: string, targetAddr: string, alias: string = "") => {
    try {
      const newaddress = await getAddress(provider, address);
      await authWithSigningKey(provider, address);

      const operation: any = {
        name: "unfollow",
        from: address,
        to: targetAddr,
        namespace: 'CyberConnect',
        network: Blockchain.ETH,
        alias,
        timestamp: Date.now(),
      };

      const signature = await signWithSigningKey(JSON.stringify(operation));
      const publicKey = await getPublicKey();

      const params = {
        fromAddr: address,
        toAddr: targetAddr,
        alias,
        namespace: 'CyberConnect',
        url: endpoint.cyberConnectApi,
        // signature,
        signingKey: publicKey,
        operation: JSON.stringify(operation),
        network: Blockchain.ETH,
      };

      // const sign = await signWithJwt();

      const resp = await unfollow(params as any);

      if (resp?.data?.disconnect.result === "INVALID_SIGNATURE") {
        await clearSigningKey();
        console.log("INVALID_SIGNATURE");

        // throw new ConnectError(
        //   ErrorCode.GraphqlError,
        //   resp?.data?.disconnect.result
        // );
      }

      if (resp?.data?.disconnect.result !== "SUCCESS") {
        console.log('unfollow is unsuccessed')
        // throw new ConnectError(
        //   ErrorCode.GraphqlError,
        //   resp?.data?.disconnect.result
        // );
      }
    } catch (e: any) {
      console.log("disconnect of Error");
      // throw new ConnectError(ErrorCode.GraphqlError, e.message || e);
    }
    if (DFLAG) {
      ceramicDisconnect(targetAddr);
    }
  }
