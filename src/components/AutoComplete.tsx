import React, { useEffect, useState } from 'react';
import { TextInput, StyleSheet, View, Text, Dimensions, Button } from 'react-native';
import { searchUserInfoQuery, followListInfoQuery } from "@/utils/query";
import {
  isValidAddr,
  formatAddress,
  // cyberconnect
} from "@/utils/helpers";
import { useWalletConnect } from '@walletconnect/react-native-dapp';
const cyberconnect = import("../cyberconnect");

const AutoComplete: React.FC<{address: string}> = ({address}) => {
  const [focus, setFocus] = useState<boolean>(false);
  const [iptAddress, setIptAddress] = useState<string>('');
  const [isSelf, setIsSelf] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [cyberNative, setCyberNative] = useState<any>(null);
  const [followings, setFollowings] = useState<any[]>([]);

  const connector = useWalletConnect();
  console.log(followings, isFollowing);

  useEffect(() => {
    followListInfoQuery({
      address,
      namespace: "CyberConnect",
      network: "ETH",
      followingFirst: 10,
      followerFirst: 10,
    }).then((res) => {
      console.log(res);
      setFollowings(res.followings.list);
    });
    cyberconnect.then(res => {
      const CyberConnect = res.default
      const CyberRN = new CyberConnect({
        provider: connector,
        namespace: 'CyberConnect',
        clientType: 'RN' as any,
      })
      setCyberNative(CyberRN);
    }) 
  }, [])

  const autoCompleteUser = (value: any) => {
    setIptAddress(value.nativeEvent.text);
    if (followings?.length) {
      followings.forEach((item) => {
        if (item.address === value.nativeEvent.text) {
          setIsFollowing(true);
        } else {
          setIsFollowing(false);
        }
      });
    }
    // console.log(address)
    if (value.nativeEvent.text === address) {
      setIsSelf(true);
    } else {
      setIsSelf(false);
    }
  };

  const handleFollow = () => {
    if (isFollowing) {
      cyberNative?.disconnect(iptAddress).then(() => {
        setIsFollowing(false)
      })
      // disconnect(connector, address, iptAddress).then((res) => {
      //   setIsFollowing(false);
      // });
    } else {
      cyberNative?.connect(iptAddress).then(() => {
        setIsFollowing(true);
      });
      // connect(connector, address, iptAddress).then((res) => {
      //   setIsFollowing(true);
      // })
    }
  };

  return (
    <View style={styles.autoComplete}>
      <TextInput
        style={{
          ...styles.selectAddress,
          borderBottomColor:
            (iptAddress && !isValidAddr(iptAddress)) || (iptAddress && isSelf)
              ? "#f00"
              : "#000",
        }}
        placeholder="INPUT ADDRESS TO FOLLOW"
        selectionColor={"#000"}
        placeholderTextColor={focus ? "#ccc" : "rgba(0, 0, 0, 0.1)"}
        autoFocus={focus}
        onFocus={() => setFocus(true)}
        onChange={autoCompleteUser}
      />
      <Text
        style={{
          ...styles.warn,
          color:
            (iptAddress && !isValidAddr(iptAddress)) || (iptAddress && isSelf)
              ? "#f00"
              : "#000",
        }}
      >
        {iptAddress && !isValidAddr(iptAddress)
          ? "Please enter a valid address."
          : iptAddress && isSelf
          ? "You can’t follow yourself"
          : ""}
      </Text>
      <View
        style={{
          ...styles.selectView,
          display:
            iptAddress && isValidAddr(iptAddress) && !isSelf ? "flex" : "none",
        }}
      >
        <Text style={styles.address}>{formatAddress(iptAddress)}</Text>
        <Text style={styles.followBtn} onPress={handleFollow}>
          {isFollowing ? "-UNFOLLOW" : "+FOLLOW"}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  autoComplete: {
    flexDirection: 'column',
  },
  warn: {
    height: 20,
    marginTop: 10,
  },
  selectAddress: {
    borderColor: '#000',
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 4,
    paddingBottom: 15,
    fontSize: 22,
    fontWeight: '800',
  },
  selectView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#000',
    width: '100%',
    position: 'absolute',
    top: 60,
    padding: 15,
  },
  address: {
    color: '#fff',
    flex: 1,
    fontWeight: '800',
  },
  followBtn: {
    color: '#fff',
    fontWeight: '800',
  },
});

export default AutoComplete