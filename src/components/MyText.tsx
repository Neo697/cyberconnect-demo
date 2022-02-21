import React from "react";
import { Text, StyleSheet } from "react-native";

const MyText: React.FC<{title: string}> = props => {
  return (
    <Text style={styles.title}>{props.title}</Text>
  )
}

const styles = StyleSheet.create({
  title: {
    textTransform: "uppercase",
    fontSize: 31,
    fontWeight: '800',
  },
});
export default MyText