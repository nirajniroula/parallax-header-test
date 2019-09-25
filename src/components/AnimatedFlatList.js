import React from "react";
import { Animated } from "react-native";
import { FlatList } from "react-navigation";
import PropTypes from "prop-types";
import { ifIphoneX, isAndroid } from "../../utils/DeviceUtils";
import HeaderContext from "../HeaderContext";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class FlatListHelper extends React.PureComponent {
  componentDidMount() {
    const { tabRoute, animation, addHandlerScroll } = this.props;

    addHandlerScroll(tabRoute, this.scrollToOffset);

    setTimeout(() => {
      this.scrollToOffset(animation.initialScroll, false);
    }, 250);
  }

  scrollToOffset = (offset, animated = true) => {
    this.flatList.getNode().scrollToOffset({ offset, animated });
  };

  _onMomentumScrollBegin = () => this.props._canJumpToTab(false);

  _onMomentumScrollEnd = () => this.props._canJumpToTab(true);

  _onScrollEndDrag = e => {
    const velocity = e.nativeEvent.velocity.y;
    if (
      velocity === 0 ||
      (isAndroid() && Math.abs(Math.round(velocity)) <= 2)
    ) {
      this.props.animation.handleIntermediateState(this.scrollToOffset);
    }
  };

  render() {
    const { scrollY, fullHeight } = this.props.animation;
    const { contentContainerStyle, headerHeight } = this.props;

    return (
      <AnimatedFlatList
        {...this.props}
        scrollEventThrottle={1}
        onScrollEndDrag={this._onScrollEndDrag}
        onMomentumScrollBegin={this._onMomentumScrollBegin}
        onMomentumScrollEnd={this._onMomentumScrollEnd}
        contentContainerStyle={[
          { paddingTop: headerHeight + ifIphoneX(15, 0) },
          contentContainerStyle
        ]}
        ref={component => {
          this.flatList = component;
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      />
    );
  }
}

FlatListHelper.propTypes = {
  tabRoute: PropTypes.string.isRequired,
  animation: PropTypes.object.isRequired,
  addHandlerScroll: PropTypes.func.isRequired,
  _canJumpToTab: PropTypes.func.isRequired
};

// HOC
const withHeaderContext = Comp => props => (
  <HeaderContext.Consumer>
    {context => <Comp {...context} {...props} />}
  </HeaderContext.Consumer>
);

export default withHeaderContext(FlatListHelper);
