import React from "react";
import { View, Text, StyleSheet } from 'react-native'
// @ts-ignore
import Avatar from 'react-native-boring-avatars';
import {useWalletConnect} from '@walletconnect/react-native-dapp';
import { formatAddress } from '@/utils/helpers'

interface AvatarProps {
  size: number;
  name: string;
  address?: string;
  nameStyle?: any;
  navigation?: any;
}

const AvatarGroup: React.FC<AvatarProps> = ({size, name, address, nameStyle = {}, navigation}) => {

  const connector = useWalletConnect();

  return (
    <View
      style={styles.left}
      onTouchEnd={async () => {
        if (connector.connected) {
          await connector.killSession();
          await navigation.goBack("Home", {
            address: connector.accounts[0],
          });
        }
      }}
    >
      <View style={styles.avatarBg}>
        <Avatar size={size} style={styles.avatar} />
      </View>
      <Text style={{ ...styles.name, ...nameStyle }}>
        {name || formatAddress(address)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    color: '#fff',
    marginLeft: 15,
  },
  avatarBg: {
    borderRadius: 100,
    borderWidth: 4,
    borderColor: '#fff'
  },
  avatar: {
    backgroundColor: '#fff',
    borderColor: '#fff',
    borderWidth: 1,
  },
});

export default AvatarGroup;