import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  Dimensions,
  Animated
} from 'react-native';
// import {Avatar} from 'react-native-paper';
// @ts-ignore
import Avatar from 'react-native-boring-avatars';
import {SvgXml} from 'react-native-svg';
import {arrowDown} from '/Users/domingo/AwesomeTSProject/src/svg/icon';
import MyText from '@/components/MyText';
import AvatarGroup from "@/components/AvatarGroup";
import AutoComplete from '@/components/AutoComplete';
import { followListInfoQuery } from '@/utils/query';
import { formatAddress } from '@/utils/helpers'
import useColorTheme from '@/utils/useColorTheme';

const Follow: React.FC<any> = ({route, navigation}) => {

  const { address } = route.params
  const showAnimated = useRef(new Animated.Value(0)).current;
  const [visible, setVisible] = useState<boolean>(false);
  const [followers, setFollowers] = useState<any[]>([]);
  const [followings, setFollowings] = useState<any[]>([]);
  const [flag, setFlag] = useState<boolean>(false);

  useEffect(() => {
    if (visible) {
      followListInfoQuery({
        address,
        namespace: 'CyberConnect',
        network: 'ETH',
        followingFirst: 10,
        followerFirst: 10,
      }).then((res) => {
        console.log(res)
        setFollowers(res.followers.list)
        setFollowings(res.followings.list)
      })
    }
  }, [visible])

  const onShow = () => {
    Animated.timing(showAnimated, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    setVisible(true)
  };

  const onClose = () => {
    Animated.timing(showAnimated, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
    setVisible(false)
  }

  const leftOrRight = () => {
    if (flag) {
      return {right: 0}
    } else {
      return {left: 0};
    }
  }

  return (
    <>
      <SafeAreaView style={{flex: 0, backgroundColor: '#fff'}} />
      <SafeAreaView style={styles.followPage}>
        <ScrollView
          style={styles.followContent}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={!visible}>
          <View style={{height: Dimensions.get('window').height * 0.91}}>
            <View style={styles.searchContent}>
              <View>
                <MyText title={'Follow'} />
              </View>
              <AutoComplete address={address} />
            </View>
            <Animated.View
              style={{
                ...styles.modal,
                opacity: showAnimated,
                display: visible ? 'flex' : 'none',
              }}
              onTouchEnd={onClose}
            />
            <View style={styles.followData}>
              <View style={styles.followHeader}>
                <AvatarGroup
                  size={50}
                  name={formatAddress(address)}
                  nameStyle={{fontSize: 20, fontWeight: '800'}}
                  navigation={navigation}
                />
                <View
                  style={{
                    width: 40,
                    height: 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onTouchEnd={onShow}>
                  <SvgXml xml={arrowDown} />
                </View>
              </View>
              <View
                style={{
                  ...styles.navData,
                  height: visible ? Dimensions.get('window').height * 0.65 : 0,
                }}>
                <View style={styles.allNumber}>
                  <View
                    style={styles.followers}
                    onTouchEnd={() => setFlag(false)}>
                    <Text style={styles.number}>120K</Text>
                    <Text style={styles.label}>Followers</Text>
                  </View>
                  <View
                    style={styles.following}
                    onTouchEnd={() => setFlag(true)}>
                    <Text style={styles.number}>{'8,900'}</Text>
                    <Text style={styles.label}>Following</Text>
                  </View>
                </View>
                <View style={{...styles.slideBorder, height: visible ? 4 : 0}}>
                  <View
                    style={{
                      ...styles.slideWhite,
                      height: visible ? 4 : 0,
                      ...leftOrRight(),
                    }}
                  />
                </View>
                <ScrollView
                  style={{...styles.list, display: !flag ? 'flex' : 'none'}}>
                  <Text style={{color: '#fff'}}>followers</Text>
                  {followers?.length
                    ? followers.map(user => (
                        <View style={styles.avatarGroup}>
                          <AvatarGroup
                            size={35}
                            name={user.ens || formatAddress(user.address)}
                            nameStyle={{fontSize: 13, fontWeight: '500'}}
                          />
                        </View>
                      ))
                    : null}
                </ScrollView>
                <ScrollView
                  style={{...styles.list, display: flag ? 'flex' : 'none'}}>
                  <Text style={{color: '#fff'}}>following</Text>
                  {followings?.length
                    ? followings.map((user, i) => (
                        <View style={styles.avatarGroup} key={i}>
                          <AvatarGroup
                            size={35}
                            name={user.ens}
                            nameStyle={{fontSize: 13, fontWeight: '500'}}
                          />
                        </View>
                      ))
                    : null}
                </ScrollView>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  followPage: {
    width: Dimensions.get('window').width,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#000',
  },
  searchContent: {
    flex: 0.5,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingTop: 45,
    paddingBottom: 20,
    paddingHorizontal: 25,
  },
  followContent: {
    height: Dimensions.get('window').height,
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  modal: {
    backgroundColor: 'rgba(0, 0, 0, .6)',
    position: 'absolute',
    top: -50,
    zIndex: 1,
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  followData: {
    backgroundColor: '#000',
    paddingHorizontal: 25,
    paddingVertical: 25,
    position: 'absolute',
    width: Dimensions.get('window').width,
    bottom: 0,
    zIndex: 2,
  },
  followHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navData: {
    backgroundColor: '#000',
    paddingTop: 30,
    flexDirection: 'column',
  },
  allNumber: {
    flexDirection: 'row',
  },
  followers: {
    width: '50%',
    flexDirection: 'column',
  },
  following: {
    width: '50%',
    flexDirection: 'column',
  },
  number: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 10,
  },
  label: {
    color: '#fff',
    opacity: 0.5,
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  slideBorder: {
    position: 'relative',
    width: '100%',
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, .2)',
    marginTop: 30,
  },
  slideWhite: {
    position: 'absolute',
    width: '50%',
    height: 4,
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  list: {
    paddingTop: 20,
  },
  avatarGroup: {
    marginBottom: 15
  }
});

export default Follow