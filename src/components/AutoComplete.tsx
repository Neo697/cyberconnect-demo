import React, { useEffect, useState } from 'react';
import { TextInput, StyleSheet, View, Text, Dimensions, Button } from 'react-native';
import { followListInfoQuery, follow } from '@/utils/query';
import { isValidAddr, formatAddress } from '@/utils/helpers';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
// @ts-ignore
import crypto from 'react-native-ecc'
import Buffer from 'buffer'
// import './shim.js';
// import Crypto from 'crypto'
// import { SigningKey } from 'ethers/lib/utils';
// @ts-ignore
// import { useWeb3 } from '@/context/web3Context';

const AutoComplete: React.FC<{address: string}> = ({address}) => {
  const [focus, setFocus] = useState<boolean>(false);
  const [iptAddress, setIptAddress] = useState<string>('');
  const [isSelf, setIsSelf] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [signKey, setSignKey] = useState<string>('');

  // const {cyberConnect} = useWeb3();

  const msg = Buffer.Buffer.from('hey ho');
  const connector = useWalletConnect();
  useEffect(() => {
    if (crypto.getServiceID()) {
      crypto.keyPair('p256', (err: any, key: any) => {
        key.sign(
          {
            data: msg,
            algorithm: 'sha256',
          },
          function (err: any, sig: any) {
            // signatures tested for compatibility with npm library "elliptic"
            // console.log('sig', sig.toString('hex'));
            setSignKey(sig.toString('hex'));
            key.verify(
              {
                algorithm: 'sha256',
                data: msg,
                sig: sig,
              },
              function (err: any, verified: any) {
                // console.log('verified:', verified);
              },
            );
          },
        );
      });
    } else {
      crypto.setServiceID('be.excellent.to.each.other');
    }
  }, [crypto?.getServiceID()]);

  const autoCompleteUser = (value: any) => {
    setIptAddress(value.nativeEvent.text);
    if (value.nativeEvent.text === address) {
      setIsSelf(true);
    }
  };

  const handleFollow = () => {
    follow({
      fromAddr: address,
      toAddr: iptAddress,
      namespace: 'CyberConnect',
      // url,
      // signature,
      // operation,
      signingKey: signKey,
      network: 'ETH',
    } as any).then(res => {
      console.log(res);
    }).catch((err) => {
      console.log(err)
    });
  };

  return (
    <View style={styles.autoComplete}>
      <TextInput
        style={{
          ...styles.selectAddress,
          borderBottomColor:
            (iptAddress && !isValidAddr(iptAddress)) || (iptAddress && isSelf)
              ? '#f00'
              : '#000',
        }}
        placeholder="INPUT ADDRESS TO FOLLOW"
        selectionColor={'#000'}
        placeholderTextColor={focus ? '#ccc' : 'rgba(0, 0, 0, 0.1)'}
        autoFocus={focus}
        onFocus={() => setFocus(true)}
        onChange={autoCompleteUser}
      />
      <Text
        style={{
          ...styles.warn,
          color:
            (iptAddress && !isValidAddr(iptAddress)) || (iptAddress && isSelf)
              ? '#f00'
              : '#000',
        }}>
        {iptAddress && !isValidAddr(iptAddress)
          ? 'Please enter a valid address.'
          : iptAddress && isSelf
          ? 'You can’t follow yourself'
          : ''}
      </Text>
      <View
        style={{
          ...styles.selectView,
          display:
            iptAddress && isValidAddr(iptAddress) && !isSelf
              ? 'flex'
              : 'none',
        }}>
        <Text style={styles.address}>{formatAddress(iptAddress)}</Text>
        <Text style={styles.followBtn} onPress={handleFollow}>
          +FOLLOW
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