# parallax-header-test
Example

  
  
    import React, { Component } from "react";
    ...
    
    import { Header, ScrollableComponent } from "react-native-parallax-header";
    export default class Profile extends Component {
    ...
    ...
  
      renderHeader = (animation, canJumpToTab) => props => (
      <Header
        animation={animation}
        childTop={<View style={{ backgroundColor: "red", height: 140 }} />}
        childBottom={<View style={{ backgroundColor: "green", height: 100 }} />}
        renderTabBar={() => (
          <TabBar
            onTabPress={({ route }) => {
              if (route.key !== this.state.currentTab && canJumpToTab) {
                animation.onTabPress(route);
              }
            }}
            indicatorStyle={{ backgroundColor: Colors.WHITE }}
            renderLabel={this.renderLabel}
            style={styles.tabBarStyle}
            labelStyle={styles.label}
            {...props}
          />
        )}
      />
    );
  
    render() {
    return (
        <ScrollableComponent currentTab={this.state.currentTab}>
          {(animation, { canJumpToTab }) => (
            <View style={initialLayout}>
              <TabView
                navigationState={this.state}
                renderScene={this.renderScene}
                renderTabBar={this.renderHeader(
                  animation,
                  canJumpToTab,
                  coverPicture
                )}
                />
              </View>
            )}
          </ScrollableComponent>
        );
      }
    }

    const styles = StyleSheet.create({
    ...
    ...
    });
