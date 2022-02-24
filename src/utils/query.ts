import {
  FollowListInfoArgs,
  SearchUserInfoArgs,
  FollowListInfoResp,
  SearchUserInfoResp,
  UpdateConnectionInput,
} from "./types";

const endPoint = "https://api.stg.cybertino.io/connect/";

export const followListInfoSchema = ({
  address,
  namespace,
  network,
  followingFirst,
  followingAfter,
  followerFirst,
  followerAfter,
}: FollowListInfoArgs) => {
  return {
    operationName: "followListInfo",
    query: `query followListInfo($address: String!, $namespace: String, $network: Network, $followingFirst: Int, $followingAfter: String, $followerFirst: Int, $followerAfter: String) {
      identity(address: $address, network: $network) {
        followingCount(namespace: $namespace)
        followerCount(namespace: $namespace)
        followings(namespace: $namespace, first: $followingFirst, after: $followingAfter) {
          pageInfo {
            endCursor
            hasNextPage
          }
          list {
            address
            ens
            avatar
          }
        }
        followers(namespace: $namespace, first: $followerFirst, after: $followerAfter) {
          pageInfo {
            endCursor
            hasNextPage
          }
          list {
            address
            ens
            avatar
          }
        }
      }
    }`,
    variables: {
      address,
      namespace,
      network,
      followingFirst,
      followingAfter,
      followerFirst,
      followerAfter,
    },
  };
};

export const searchUserInfoSchema = ({
  fromAddr,
  toAddr,
  namespace,
  network,
}: SearchUserInfoArgs) => {
  return {
    operationName: "searchUserInfo",
    query: `query searchUserInfo($fromAddr: String!, $toAddr: String!, $namespace: String, $network: Network) {
      identity(address: $toAddr, network: $network) {
        address
        ens
        avatar
      }
      followStatus(fromAddr: $fromAddr, toAddr: $toAddr, namespace: $namespace, network: $network) {
        isFollowed
        isFollowing
      }
    }`,
    variables: {
      fromAddr,
      toAddr,
      namespace,
      network,
    },
  };
};

export const connectQuerySchema = (input: UpdateConnectionInput) => {
  return {
    operationName: "connect",
    query: `mutation connect($input: UpdateConnectionInput!) {connect(input: $input) {result}}`,
    variables: {
      input,
    },
  };
};

export const querySchemas = {
  followListInfo: followListInfoSchema,
  searchUserInfo: searchUserInfoSchema,
  connect: connectQuerySchema,
};

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
  network,
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
  return handleQuery(schema, url);
};

export const followListInfoQuery = async ({
  address,
  namespace,
  network,
  followingFirst,
  followingAfter,
  followerFirst,
  followerAfter,
}: FollowListInfoArgs) => {
  const schema = querySchemas["followListInfo"]({
    address,
    namespace,
    network,
    followingFirst,
    followingAfter,
    followerFirst,
    followerAfter,
  });
  const resp = await handleQuery(schema, endPoint);

  return (resp?.data?.identity as FollowListInfoResp) || null;
};

export const searchUserInfoQuery = async ({
  fromAddr,
  toAddr,
  namespace,
  network,
}: SearchUserInfoArgs) => {
  const schema = querySchemas["searchUserInfo"]({
    fromAddr,
    toAddr,
    namespace,
    network,
  });
  const resp = await handleQuery(schema, endPoint);

  return (resp?.data as SearchUserInfoResp) || null;
};
