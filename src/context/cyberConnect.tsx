import { useWalletConnect } from "@walletconnect/react-native-dapp";
const connector = useWalletConnect();

const address = connector.accounts[0];
const signingKey = connector.key;
const namespace = 'CyberConnect';

export const follow = ({
  fromAddr,
  toAddr,
  alias,
  namespace,
  url,
  signature,
  operation,
  signingKey,
  network = 'ETH',
}: {
  fromAddr: string;
  toAddr: string;
  alias: string;
  namespace: string;
  signature: string;
  url: string;
  operation: string;
  signingKey: string;
  network: string;
}) => {
  const schema = querySchemas['connect']({
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

const handleQuery = (
  data: {
    query: string;
    variables: object;
    operationName: string;
  },
  url: string,
) => {
  return request(url, data);
};

const request = async (url = '', data = {}) => {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    // @ts-ignore
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
    },
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data),
  });

  return response.json();
};

const getAddress = () => {
  if (address) {
    return address;
  }
  return (address = await getAddressByProvider(
    provider,
    chain,
  ));
}

const connect = async (targetAddr: string, alias: string = '') => {
  try {
    address = await getAddress();
    await authWithSigningKey();

    const operation: Operation = {
      name: 'follow',
      from: address,
      to: targetAddr,
      namespace: namespace,
      network: chain,
      alias,
      timestamp: Date.now(),
    };

    const signature = await signWithSigningKey(
      JSON.stringify(operation),
      address,
    );
    const publicKey = await getPublicKey(address);

    const params = {
      fromAddr: address,
      toAddr: targetAddr,
      alias,
      namespace: namespace,
      url: endpoint.cyberConnectApi,
      signature,
      signingKey: publicKey,
      operation: JSON.stringify(operation),
      network: chain,
    };

    // const sign = await signWithJwt();

    const resp = await follow(params);

    if (resp?.data?.connect.result === 'INVALID_SIGNATURE') {
      await clearSigningKey();

      throw new ConnectError(
        ErrorCode.GraphqlError,
        resp?.data?.connect.result,
      );
    }

    if (resp?.data?.connect.result !== 'SUCCESS') {
      throw new ConnectError(
        ErrorCode.GraphqlError,
        resp?.data?.connect.result,
      );
    }
  } catch (e: any) {
    throw new ConnectError(ErrorCode.GraphqlError, e.message || e);
  }
  if (DFLAG) {
    ceramicConnect(targetAddr, alias);
  }
}

export default connect