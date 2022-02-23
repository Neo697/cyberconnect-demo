import { Blockchain } from './types';
export type Query = 'connect' | 'disconnect';

type RegisterSigningKeyInput = {
  address: string;
  message: string;
  signature: string;
  network: string;
};

type UpdateConnectionInput = {
  fromAddr: string;
  toAddr: string;
  namespace: string;
  signature: string;
  operation: string;
  signingKey: string;
  alias: string;
  network: string;
};

export const registerSigningKeySchema = (input: RegisterSigningKeyInput) => {
  return {
    operationName: 'registerKey',
    query: `mutation registerKey($input: RegisterKeyInput!) {
      registerKey(input: $input) {
        result
      }
    }`,
    variables: { input },
  };
};
export const connectQuerySchema = (input: UpdateConnectionInput) => {
  return {
    operationName: 'connect',
    query: `mutation connect($input: UpdateConnectionInput!) {connect(input: $input) {result}}`,
    variables: {
      input,
    },
  };
};

export const disconnectQuerySchema = (input: UpdateConnectionInput) => {
  return {
    operationName: 'disconnect',
    query: `mutation disconnect($input: UpdateConnectionInput!) {disconnect(input: $input) {result}}`,
    variables: {
      input,
    },
  };
};
export const setAliasQuerySchema = (input: UpdateConnectionInput) => {
  return {
    operationName: 'alias',
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
    operationName: 'auth',
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

export const request = async (url = '', data = {}) => {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
    },
    referrerPolicy: 'no-referrer',
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
  url: string,
) => {
  return request(url, data);
};

export const registerSigningKey = ({
  address,
  message,
  signature,
  network = Blockchain.ETH,
  url,
}: RegisterSigningKeyInput & { url: string }) => {
  const result = querySchemas['registerSigningKey']({
    address,
    message,
    signature,
    network,
  });
  return handleQuery(result, url);
};

export const auth = ({
  address,
  signature,
  network = Blockchain.ETH,
  url,
}: {
  address: string;
  signature: string;
  network: Blockchain;
  url: string;
}) => {
  const result = querySchemas['auth']({
    address,
    signature,
    network,
  });
  return handleQuery(result, url);
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
  const schema = querySchemas['disconnect']({
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

export const setAlias = ({
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
  const schema = querySchemas['setAlias']({
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
