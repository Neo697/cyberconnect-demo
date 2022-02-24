import React, { useState, useCallback, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
const WalletButton: React.FC<any> = ({ navigation }) => {
  const connector = useWalletConnect();

  const handleConnect = () => {
    connector.connect().then((res) => {
      connector.off("connect");
      if (res?.accounts?.length && res?.accounts[0]) {
        navigation.navigate("Follow", {
          address: res.accounts[0],
        });
      }
    });
  };

  return (
    <Text style={styles.walletButton} onPress={handleConnect}>
      connect wallet
    </Text>
  );
};

const styles = StyleSheet.create({
  walletButton: {
    textTransform: "uppercase",
    width: "100%",
    borderWidth: 5,
    paddingVertical: 20,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "800",
    textShadowColor: "#fff",
  },
});

export default WalletButton;
