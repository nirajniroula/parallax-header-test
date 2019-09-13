import React, { Component } from 'react';
import { TabBar, TabView } from 'react-native-tab-view';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import { Header, ScrollableComponent } from 'react-native-parallax-header';

import FlatListView from './FlatListView';

const initialLayout = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height
};

export default class ParallaxHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      offsetIndex: 0,
      currentTab: 'first',
      index: 0,
      routes: [
        { key: 'first', title: 'Grid' },
        { key: 'second', title: 'List' }
      ],
      imageSource: '',
      isLoading: false,
      admin: false,
      headerHeight: 0
    };
  }
  _handleIndexChange = index => {
    this.setState(prevState => {
      return { currentTab: prevState.routes[index].key, index };
    });
  };

  _handleHeaderLayoutChange = event => {
    const { height } = event.nativeEvent.layout;
    this.setState({ headerHeight: height });
  };

  renderLabel = scene => {
    const { route } = scene;
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <Animated.Text numberOfLines={1} style={styles.labelTextStyle}>
          {route.title}
        </Animated.Text>
      </View>
    );
  };

  renderHeader = animation => props => (
    <Header
      onLayout={this._handleHeaderLayoutChange}
      animation={animation}
      renderHeader={() => (
        <View style={{ flex: 1 }}>
          <View style={{ backgroundColor: 'red', height: 100 }} />
          <View style={{ backgroundColor: 'blue', height: 100 }} />
          <View style={{ backgroundColor: 'green', height: 100 }} />
        </View>
      )}
      renderTabBar={() => (
        <TabBar
          getLabelText={({ route }) => route.title}
          indicatorStyle={styles.indicator}
          style={styles.tabbar}
          labelStyle={styles.label}
          {...props}
        />
      )}
    />
  );

  render() {
    return (
      <ScrollableComponent
        currentTab={this.state.currentTab}
        headerHeight={this.state.headerHeight}
      >
        {(animation, { canJumpToTab }) => (
          <TabView
            navigationState={this.state}
            renderScene={({ route }) => {
              switch (route.key) {
                case 'first':
                  return (
                    <FlatListView
                      route={route}
                      headerHeight={this.state.headerHeight}
                    />
                  );
                case 'second':
                  return (
                    <FlatListView
                      route={route}
                      headerHeight={this.state.headerHeight}
                    />
                  );
                default:
                  return null;
              }
            }}
            renderTabBar={this.renderHeader(animation)}
            onIndexChange={this._handleIndexChange}
            initialLayout={initialLayout}
            swipeEnabled={false} // TODO : works but content's position to be handled on swipe
            canJumpToTab={() => canJumpToTab}
            useNativeDriver
          />
        )}
      </ScrollableComponent>
    );
  }
}

const styles = StyleSheet.create({
  labelTextStyle: {
    fontSize: 12,
    color: 'grey',
    paddingLeft: 15
  },
  label: {
    color: '#45688e',
    margin: 0,
    marginTop: 6,
    marginBottom: 6,
    fontWeight: '400'
  },
  indicator: {
    backgroundColor: '#45688e'
  },
  tabbar: {
    backgroundColor: '#fff',
    elevation: 2
  }
});
