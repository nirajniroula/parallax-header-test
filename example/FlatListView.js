import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { AnimatedFlatList } from 'react-native-parallax-header';

const numsArr = Array(50)
  .fill()
  .map((_, index) => ({ id: index }));

const FlatListView = props => {
  const [dataSource] = useState(numsArr);

  return (
    <AnimatedFlatList
      style={styles.wrapper}
      headerHeight={props.headerHeight}
      data={dataSource}
      keyExtractor={item => item.id.toString()}
      tabRoute={props.route.key}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => alert('Clicked')}>
          <View style={styles.item}>
            <Text>{item.id}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 15
  },
  item: {
    height: 150,
    backgroundColor: '#fff8',
    marginBottom: 20,
    shadowColor: 'rgb(75, 89, 101)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  }
});

export default FlatListView;
