import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import Dialog from 'react-native-dialog';

const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

export default function MainScreen() {
  const KEY = '67a45a29603e4aeba2e111424231406';
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState('Da Nang');
  const [data, setData] = useState([]);
  const [dataHour, setDataHour] = useState();
  const [dataDay, setDataDay] = useState();
  const [selected, setSelected] = useState();
  const [isShow, setIsShow] = useState(false)
  const [visible,setVisible] = useState(false)
  const [location1, setLocation1] = useState()
  const getData = async () => {
    setVisible(false)
    try {
      const reponse = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${KEY}&q=${location}&aqi=no`,
      );
      await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${KEY}&q=${location}&days=5&aqi=no&alerts=no`,
      )
        .then(reponse => reponse.json())
        .then(data => data.forecast.forecastday)
        .then(data => {
          setDataHour(
            data[0].hour.filter(
              item => item.time.substring(11, 13) >= new Date().getHours(),
            ),
          );
          setDataDay(data);
        });

      const json = await reponse.json();
      setData(json);
    } catch (error) {
      console.log('error', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancle = () => {
    setVisible(false)
    
  }

  const handleShow = () => {
    setVisible(true)
  }
 

   useEffect(() => {
    getData();
  }, []);

  const RenderItemHour = ({item}) => (
    <View style={styles.viewItem}>
      <Text style={{color: '#fff', fontSize: 15}}>
        {item.temp_c.toFixed()}°
      </Text>
      <Image
        source={{uri: `https:${item.condition.icon}`}}
        style={{width: 75, height: 75}}
      />
      <Text style={{color: '#fff', fontSize: 15}}>
        {item.time.substring(11, 16)}
      </Text>
    </View>
  );

  const RenderItemDay = ({item, display, onPress}) => (
    <View>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.viewItem1}>
          <Text style={{color: '#fff', fontSize: 15}}>{item.date}</Text>
          <Image
            source={{uri: `https:${item.day.condition.icon}`}}
            style={{width: 50, height: 50}}
          />
          <Text style={{color: '#fff', fontSize: 15}}>
            {item.day.mintemp_c.toFixed()}°C / {item.day.maxtemp_c.toFixed()}°C
          </Text>
        </View>
      </TouchableOpacity>
      <View style={[styles.viewItem2, {display}]}>
        <View style={{width: ScreenWidth / 2 - 30}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={require('../Image/wind1.png')}
              style={{tintColor: '#fff'}}
            />
            <Text style={{color: '#fff', marginHorizontal: 5}}>
              {item.day.maxwind_mph}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 10,
            }}>
            <Image
              source={require('../Image/uvicon.png')}
              style={{tintColor: '#fff'}}
            />
            <Text style={{color: '#fff', marginHorizontal: 5}}>
              {item.day.uv}/10
            </Text>
          </View>
        </View>
        <View style={{width: ScreenWidth / 2 - 30}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={require('../Image/sunrise.png')}
              style={{tintColor: '#fff'}}
            />
            <Text style={{color: '#fff', marginHorizontal: 5}}>
              {item.astro.sunrise}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 10,
            }}>
            <Image
              source={require('../Image/sunset.png')}
              style={{tintColor: '#fff'}}
            />
            <Text style={{color: '#fff', marginHorizontal: 5}}>
              {item.astro.sunset}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            width: ScreenWidth,
            height: ScreenHeight,
          }}
          size={'large'}
          color={'#fff'}
        />
      ) : (
        <SafeAreaView>
          <ScrollView>
            <View style={styles.view0Style}>
              <View style={styles.view1Style}>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    marginStart: 18,
                    alignItems: 'center',
                  }}
                  onPress={() => handleShow()}>
                  <Image
                    source={require('../Image/pin.png')}
                    style={{tintColor: '#fff'}}
                  />
                  <Text style={styles.locationStyle}>{location}</Text>
                </TouchableOpacity>
              </View>
              <View style={{flexDirection: 'row', marginTop: 20}}>
                <View style={{width: ScreenWidth / 2}}>
                  <View style={{marginBottom: 30}}>
                    <View style={styles.view2Style}>
                      <Image
                        source={require('../Image/wind.png')}
                        style={{marginHorizontal: 5, tintColor: '#fff'}}
                      />
                      <Text
                        style={{color: '#fff', marginStart: 10, fontSize: 15}}>
                        {data.current.wind_mph} mph
                      </Text>
                    </View>
                    <View style={styles.view2Style}>
                      <Image
                        source={require('../Image/drop.png')}
                        style={{marginHorizontal: 5, tintColor: '#fff'}}
                      />
                      <Text
                        style={{color: '#fff', marginStart: 10, fontSize: 15}}>
                        {data.current.humidity} %
                      </Text>
                    </View>
                    <View style={styles.view2Style}>
                      <Image
                        source={require('../Image/protect.png')}
                        style={{marginHorizontal: 5, tintColor: '#fff'}}
                      />
                      <Text
                        style={{color: '#fff', marginStart: 10, fontSize: 15}}>
                        {data.current.uv}/10
                      </Text>
                    </View>
                  </View>
                  <View style={styles.view2Style}>
                    <Image
                      source={require('../Image/thermodynamics.png')}
                      style={{marginHorizontal: 5}}
                    />
                    <Text style={styles.temperatureStyle}>
                      {data.current.temp_c.toFixed()}°
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: ScreenWidth / 2,
                    paddingEnd: 10,
                  }}>
                  <Image
                    source={{
                      uri: `https:${data.current.condition.icon}`,
                    }}
                    style={{width: 150, height: 150}}
                  />

                  <Text style={{color: '#fff'}}>
                    {data.current.condition.text}
                  </Text>
                </View>
              </View>
            </View>
            <FlatList
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              data={dataHour}
              renderItem={({item}) => <RenderItemHour item={item} />}
              style={styles.flStyle}
            />
            <Dialog.Container visible={visible}>
              <Dialog.Title>Change location</Dialog.Title>
              <Dialog.Input
                value={location1}
                onChangeText={text => setLocation(text)}
              />
              <Dialog.Button label="Cancel" onPress={() => handleCancle()} />
              <Dialog.Button label="OK" onPress={() => getData()} />
            </Dialog.Container>

            <ScrollView horizontal={true}>
              <FlatList
                data={dataDay}
                renderItem={({item}) => (
                  <RenderItemDay
                    item={item}
                    onPress={() => {
                      setSelected(item.date_epoch);
                    }}
                    display={item.date_epoch === selected ? 'flex' : 'none'}
                  />
                )}
                style={styles.flStyle1}
              />
            </ScrollView>
          </ScrollView>
        </SafeAreaView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: ScreenWidth,
    height: ScreenHeight,
    backgroundColor: '#2952F8',
  },
  view0Style: {
    margin: 10,
    borderRadius: 20,
    paddingBottom: 10,
    backgroundColor: '#0D2DAC',
  },
  view1Style: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  locationStyle: {
    fontSize: 30,
    fontWeight: 500,
    marginHorizontal: 10,
    color: '#fff',
  },
  view2Style: {
    flexDirection: 'row',
    marginStart: 18,
    marginTop: 10,
    alignItems: 'center',
  },
  temperatureStyle: {
    fontSize: 70,
    fontWeight: 600,
    color: '#fff',
  },
  viewItem: {
    width: 85,
    height: 120,
    // borderWidth: 1,
    // marginHorizontal: 5,
    // borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#A6ABBF',
    backgroundColor: '455EC2',
  },
  flStyle: {
    marginHorizontal: 10,
    borderRadius: 20,
    backgroundColor: '#0D2DAC',
    paddingVertical: 10,
  },
  viewItem1: {
    paddingHorizontal: 20,
    width: ScreenWidth - 20,
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 50,
    alignItems: 'center',
    backgroundColor: '#0D2DAC',
    marginVertical: 5,
    borderRadius: 20,
  },
  flStyle1: {
    marginTop: 10,
    // borderRadius: 20,
    // backgroundColor: '#0D2DAC',
    marginHorizontal: 10,
    paddingVertical: 10,
  },
  viewItem2: {
    marginHorizontal: 10,
    padding: 10,
    flexDirection: 'row',
    backgroundColor: '#0D2DAC',
    borderRadius: 10
  },
});
