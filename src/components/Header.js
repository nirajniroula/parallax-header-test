import React from "react";
import { View, StyleSheet, Animated } from "react-native";
import PropTypes from "prop-types";

export default class Header extends React.PureComponent {
  render() {
    const { animation, renderTabBar, childTop, childBottom } = this.props;

    const transformWrapper = animation.getTransformWrapper();
    const transformHeader = animation.getTransformHeader();
    const opacityHeader = animation.getOpacityHeader();
    const opacityHeaderBottom = animation.getOpacityHeaderBottom();

    return (
      <Animated.View style={[styles.wrapper, transformWrapper]}>
        <Animated.View style={opacityHeader}>
          <View style={styles.headerContainer}>
            <Animated.View style={[transformHeader]}>
              <View style={styles.headerSectionWrapper}>{childTop}</View>
              <Animated.View
                style={[
                  styles.headerSectionWrapper,
                  styles.headerBottom,
                  opacityHeaderBottom
                ]}
              >
                {childBottom}
              </Animated.View>
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
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: "white"
  },
  headerContainer: {
    zIndex: 99,
    width: "100%",
    overflow: "hidden"
  },
  headerSectionWrapper: {
    display: "flex",
    marginTop: 3,
    justifyContent: "center"
  },
  headerBottom: {
    marginTop: 10
  }
});
