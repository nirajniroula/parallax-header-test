import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import PropTypes from 'prop-types';

export default class Header extends React.PureComponent {
  render() {
    const { animation, renderTabBar, renderHeader, onLayout } = this.props;

    const transformWrapper = animation.getTransformWrapper();
    const transformHeader = animation.getTransformHeader();
    const opacityHeader = animation.getOpacityHeader();

    return (
      <Animated.View
        style={[styles.wrapper, transformWrapper]}
        onLayout={onLayout}
      >
        <Animated.View style={opacityHeader}>
          <View style={styles.headerContainer}>
            <Animated.View style={[transformHeader]}>
              {renderHeader()}
            </Animated.View>
          </View>
        </Animated.View>
        {renderTabBar()}
      </Animated.View>
    );
  }
}

Header.propTypes = {
  animation: PropTypes.object.isRequired,
  renderTabBar: PropTypes.func.isRequired,
  onLayout: PropTypes.func.isRequired,
  renderHeader: PropTypes.func.isRequired,
  onLayout: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: 'white'
  },
  headerContainer: {
    zIndex: 99,
    width: '100%',
    overflow: 'hidden'
  }
});
