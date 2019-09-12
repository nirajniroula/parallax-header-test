import { Animated } from "react-native";

export default class HeaderAnimation {
  /**
   *  Header Size
   *
   * Header height consists of nested components
   * See /components/Header.js
   *
   * coverImageHeight = 140 (TopPartHeight)
   * headerBottomHeight = 120 (approx.)
   *
   * Calculate
   *
   * coverImageHeight + headerBottomHeight = 260 (Wrapper Height)
   *
   * 140 + headerBottomHeight = 260 (Full height)
   *
   * TODO: Add/Remove Settings Button's height(from headerBottomHeight) according to user's role.
   *
   */
  statusBarHeight = 21;

  wrapperHeight = 280;

  topPartHeight = 140;

  fullHeight = this.topPartHeight + 140;

  distanceRange = this.fullHeight - this.topPartHeight;

  maxClamp = this.fullHeight + this.statusBarHeight;

  minClamp = this.topPartHeight;

  diffClamp = this.maxClamp - this.minClamp;

  initialScroll = 0;

  maxActionAnimated = 88;

  actionAnimated = new Animated.Value(0);

  scrollY = new Animated.Value(this.initialScroll);

  _clampedScrollValue = 0;

  _scrollValue = 0;

  initialState = null;

  _statusBarStyle = null;

  stateBarTypes = { CLAMPED: 1, NORMAL: 2, EXPANDED: 3 };

  stateBar = this.stateBarTypes.NORMAL;

  constructor(initialState) {
    this.initialState = initialState;

    this._createClampedScroll();
    this.scrollY.addListener(this._updateScroll);
  }

  destroy() {
    this.scrollY.removeAllListeners();
  }

  _updateScroll = ({ value, manually }) => {
    if (value && manually) {
      this._clampedScrollValue = value;
    } else {
      const diff = value - this._scrollValue;
      this._scrollValue = Math.max(value, this.topPartHeight);
      this._clampedScrollValue = Math.min(
        Math.max(this._clampedScrollValue + diff, this.minClamp),
        this.maxClamp
      );
    }
  };

  _createClampedScroll() {
    this.clampedScroll = Animated.diffClamp(
      this.scrollY
        .interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
          extrapolateLeft: "clamp"
        })
        .interpolate({
          inputRange: [0, this.topPartHeight],
          outputRange: [this.topPartHeight, this.topPartHeight],
          extrapolate: "identity"
        }),
      this.minClamp,
      this.maxClamp
    );
  }

  _handleIntermediateState = scrollToOffset => {
    const scrollY = this.scrollY._value;
    if (scrollY < this.topPartHeight) {
      // Full
      scrollToOffset(scrollY > this.topPartHeight / 2 ? this.topPartHeight : 0);
    } else if (
      this._clampedScrollValue < this.maxClamp &&
      this._clampedScrollValue > this.minClamp
    ) {
      // Clamped
      let scrollTo;
      if (this._clampedScrollValue > (this.maxClamp + this.minClamp) / 2) {
        scrollTo =
          scrollY +
          this._interpolate(
            this._clampedScrollValue,
            [this.maxClamp, this.minClamp],
            [0, this.diffClamp]
          );
      } else {
        scrollTo =
          scrollY -
          this._interpolate(
            this._clampedScrollValue,
            [this.minClamp, this.maxClamp],
            [0, this.diffClamp]
          );
      }
      scrollToOffset(scrollTo);
    }
  };

  _interpolate = (x, inputRange, outputRange) => {
    const minX = inputRange[0];
    const maxX = inputRange[1];
    const minY = outputRange[0];
    const maxY = outputRange[1];

    return (x - minX) * ((maxY - minY) / (maxX - minX) + minY);
  };

  onTabPress = route => {
    const type = this.stateBarTypes;
    const offsetClamped = this.stateBar === type.CLAMPED ? this.maxClamp : 0;

    const offset =
      this.stateBar === type.NORMAL ? this.topPartHeight : offsetClamped;

    this.initialState.scrollToOffset({
      offset,
      animated: false,
      tab: route.key
    });

    this.scrollY.setValue(offset);
    this._createClampedScroll();
    this._updateScroll({ value: offset, manually: true });
  };

  scrollToOffset(offset, animated) {
    if (offset !== this.scrollY._value) {
      this.initialState.scrollToOffset({ offset, animated });
    }
  }

  animationProps = {
    initialScroll: this.initialScroll,
    scrollY: this.scrollY,
    fullHeight: this.fullHeight,
    handleIntermediateState: this._handleIntermediateState
  };

  getTransformWrapper() {
    const byScroll = Animated.add(
      Animated.multiply(this.clampedScroll, -1),
      this.scrollY
        .interpolate({
          // To negative
          inputRange: [0, 1],
          outputRange: [0, -1]
        })
        .interpolate({
          // Add bottom height part
          inputRange: [-this.topPartHeight, 0],
          outputRange: [0, this.minClamp],
          extrapolate: "clamp"
        })
    );

    return {
      transform: [
        {
          translateY: Animated.add(byScroll, this.actionAnimated)
        }
      ]
    };
  }

  getTransformHeader() {
    return {
      transform: [
        {
          translateY: Animated.add(
            this.actionAnimated.interpolate({
              inputRange: [0, this.maxActionAnimated],
              outputRange: [0, -this.topPartHeight],
              extrapolate: "clamp"
            }),
            this.scrollY.interpolate({
              inputRange: [0, this.topPartHeight],
              outputRange: [0, this.topPartHeight],
              extrapolate: "clamp"
            })
          )
        }
      ]
    };
  }

  getOpacityHeader() {
    return {
      opacity: this.clampedScroll.interpolate({
        inputRange: [this.topPartHeight, this.maxClamp],
        outputRange: [1, 0],
        extrapolate: "clamp"
      })
    };
  }

  getOpacityHeaderBottom() {
    return {
      opacity: Animated.add(
        this.actionAnimated.interpolate({
          inputRange: [0, this.maxActionAnimated],
          outputRange: [0, 1],
          extrapolate: "clamp"
        }),
        this.scrollY.interpolate({
          inputRange: [0, this.topPartHeight],
          outputRange: [1, 0],
          extrapolate: "clamp"
        })
      )
    };
  }
}
