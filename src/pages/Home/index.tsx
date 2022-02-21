import React, {useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  Image,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';
// import {SvgProps} from 'react-native-svg';
// import { logoSvg } from 'src/svg';
import MyText from '@/components/MyText';
import WalletButton from '@/components/WalletButton';

const Home: React.FC<any> = ({ navigation }) => {
  const showAnimated = useRef(new Animated.Value(0)).current;
  const animationShow = Animated.timing(showAnimated, {
    toValue: 1,
    useNativeDriver: true,
  });

  useEffect(() => {
    animationShow.start();
  }, [animationShow]);

  return (
    <SafeAreaView style={styles.home}>
      {/* <Animated.View style={{opacity: value.current, ...styles.start}}>
        <SvgXml xml={logoSvg} />
      </Animated.View> */}
      <View style={styles.homeContent}>
        <View>
          <MyText title={'Welcome'} />
          <View style={styles.graph}>
            <Text style={styles.textFirst}>
              This is a CyberConnect starter app. You can freely use it as a
              base for your application.
            </Text>
            <Text style={styles.textSecond}>
              This app displays the current user's followings and followers. It
              also allows the user to follow/unfollow a wallet address.
            </Text>
            <Text>Try it yourself!</Text>
          </View>
        </View>
        <WalletButton navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  start: {
    // position: 'absolute',
    // left: 0,
    // top: 0,
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  home: {
    width: Dimensions.get('window').width,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  homeContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingTop: 45,
    paddingBottom: 20,
    paddingHorizontal: 25,
  },
  graph: {
    marginTop: 30,
    color: '#000',
    opacity: 0.5,
    fontWeight: '500',
  },
  textFirst: {
    marginBottom: 25,
  },
  textSecond: {
    marginBottom: 25,
  },
});

export default Home;
