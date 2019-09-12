import React from 'react';
import PropTypes from 'prop-types';
import HeaderAnimation from './HeaderAnimation';
import HeaderContext from './HeaderContext';

export default class ScrollableComponent extends React.Component {
  _handlersScroll = {};

  constructor(props) {
    super(props);

    this.HeaderAnimation = new HeaderAnimation({
      scrollToOffset: configScroll => {
        const tab = configScroll.tab ? configScroll.tab : this.props.currentTab;
        const scrollToOffset = this._handlersScroll[tab];
        if (scrollToOffset) {
          scrollToOffset(configScroll.offset, configScroll.animated);
        }
      },
    });

    this.state = {
      canJumpToTab: true,
      contextProvider: {
        animation: this.HeaderAnimation.animationProps,
        addHandlerScroll: this._addHandlerScroll,
        _canJumpToTab: this._canJumpToTab,
      },
    };
  }

  componentWillUnmount() {
    this.HeaderAnimation.destroy();
  }

  _addHandlerScroll = (tab, handler) => {
    this._handlersScroll[tab] = handler;
  };

  _canJumpToTab = canJumpToTab => this.setState({ canJumpToTab });

  render() {
    return (
      <HeaderContext.Provider value={this.state.contextProvider}>
        {this.props.children(this.HeaderAnimation, {
          canJumpToTab: this.state.canJumpToTab,
        })}
      </HeaderContext.Provider>
    );
  }
}

ScrollableComponent.propTypes = {
  currentTab: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
};
