/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {View, Animated, Image} from 'react-native';
import {connect} from 'react-redux';
import {Easing} from 'react-native-reanimated';
import {Icon, Button} from 'native-base';
import {colors} from './style';
import {NavigationEvents} from 'react-navigation';

class LiveLike extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    let thumb = [];
    let randomInter = [];
    let imageList = [
      require('../images/red.png'),
      require('../images/blue.png'),
      require('../images/red3.png'),
      require('../images/red4.png'),
      require('../images/red7.png'),
      require('../images/red8.png'),
      require('../images/red9.png'),
      require('../images/red11.png'),
      require('../images/red13.png'),
      require('../images/star.png'),
      require('../images/thumb10.png'),
      require('../images/star4.png'),
      require('../images/gift1.png'),
      require('../images/hert5.png'),
      require('../images/hert6.png'),
      require('../images/star6.png'),
      require('../images/gift6.png'),
      require('../images/fruit1.png'),
      require('../images/hat1.png'),
      require('../images/apple1.png'),
    ];
    for (let i = 0; i < 22; i++) {
      thumb.push({
        y: new Animated.Value(600), // 心动画初始位置
        x: new Animated.Value(290), // 心动画初始位置
        startOpacity: new Animated.Value(0), // 心动画初始透明度
        img: imageList[Math.floor(Math.random() * 20)],
        Ascale: new Animated.Value(0),
      });
      randomInter.push({
        interX1: null, // 左右飘动轨迹
        interX2: null,
        interX3: null,
      });
    }

    this.state = {
      RotatoNumber: '-10deg',
      thumb: thumb,
      randomInter: randomInter,
      bubbleIndex: 0,
    };
    this.RotateValueHolder = new Animated.Value(0);
    this.popUpBubbles = new Array(22);
    this.bubbleStatus = new Array(22).fill(0); //0空闲，1占用
    this.testAnimation = this.testAnimation.bind(this);
    // this.onActionDidFocus = this.onActionDidFocus.bind(this);
    // this.onActionDidBlur = this.onActionDidBlur.bind(this);
  }

  // onActionDidFocus(payload) {
  //   console.log('设置定时器');
  //   this.timer = setInterval(() => this.testAnimation(), 1500);
  //   console.log(this.timer);
  // }

  // onActionDidBlur(payload) {
  //   console.log('清除定时器');
  //   this.timer && clearInterval(this.timer);
  //   console.log(this.timer);
  // }

  testAnimation() {
    var RotatoNumber = Math.round(Math.random() * 20 - 10) + 'deg';
    this.setState({
      RotatoNumber: RotatoNumber,
    });

    //查找空闲的bubble，如果全部占用则丢弃
    let bubbleIndex = this.bubbleStatus.indexOf(0);
    if (bubbleIndex < 0) {
      return;
    }
    this.bubbleStatus[bubbleIndex] = 1; //占用空闲bubble

    //取两个分别位于中心位置左右两侧的随机点，以让运动轨迹呈现左右飘动效果
    const center = 290;
    const range = 80;
    let rnd1 = Math.floor(center - range * Math.random() + range / 2);
    let rnd2 = Math.floor(center + range * Math.random() - range / 2);
    let rnd3 = Math.floor(center + range * Math.random() - range / 2);

    let randomInterDataNew = [...this.state.randomInter];
    randomInterDataNew[bubbleIndex] = {
      interX1: rnd1,
      interX2: rnd2,
      interX3: rnd3,
    };
    this.setState({randomInter: randomInterDataNew});
    this.setState({bubbleIndex: bubbleIndex});

    //创建动画
    this.popUpBubbles[bubbleIndex] = Animated.sequence([
      Animated.parallel([
        Animated.timing(this.state.thumb[bubbleIndex].startOpacity, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
        }),
        Animated.timing(this.state.thumb[bubbleIndex].y, {
          toValue: 280,
          duration: 5000,
          easing: Easing.easeInOutSine,
        }),
        Animated.timing(this.state.thumb[bubbleIndex].x, {
          toValue: 300,
          duration: 5000,
          easing: Easing.easeInOutSine,
        }),
        Animated.timing(this.state.thumb[bubbleIndex].Ascale, {
          toValue: 1,
          duration: 1000,
          easing: Easing.easeInOutSine,
        }),
      ]),
      Animated.parallel([
        Animated.timing(this.state.thumb[bubbleIndex].startOpacity, {
          toValue: 0,
          duration: 500,
          easing: Easing.linear,
        }),
        Animated.timing(this.state.thumb[bubbleIndex].y, {
          toValue: 270,
          duration: 500,
          easing: Easing.linear,
        }),
      ]),
    ]);

    this.popUpBubbles[bubbleIndex].reset();
    this.popUpBubbles[bubbleIndex].start(() => {
      this.bubbleStatus[bubbleIndex] = 0; //释放已结束动画的bubble
      this.popUpBubbles[bubbleIndex] = null; //释放动画元素
    });
  }

  render() {
    return (
      <View
        pointerEvents="box-none"
        style={{
          position: 'relative',
          backgroundColor: colors.backgroundDark1,
          borderRadius: 10,
        }}>
        <NavigationEvents
          onWillFocus={this.onActionWillFocus}
          onDidFocus={this.onActionDidFocus}
          onDidBlur={this.onActionDidBlur}
        />
        <Button
          style={{
            width: 50,
            height: 50,
          }}
          transparent
          onPress={() => {
            this.testAnimation();
          }}>
          <Icon
            name="ios-heart"
            style={{color: 'red', fontSize: 35, marginLeft: 12, marginRight: 0}}
          />
        </Button>

        {this.state.thumb.map(({y, x, startOpacity, img, Ascale}, key) => {
          return (
            <Animated.View // 可选的基本组件类型: Image, Text, View(可以包裹任意子View)
              style={{
                transform: [
                  {
                    translateX: x.interpolate({
                      inputRange: [290, 293, 296, 300],
                      outputRange: [
                        290,
                        this.state.randomInter[key].interX1,
                        this.state.randomInter[key].interX2,
                        this.state.randomInter[key].interX3,
                      ],
                    }),
                  },
                  {translateY: y},
                  {
                    scale: Ascale.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 0.8],
                    }),
                  },
                ],
                opacity: startOpacity,
                position: 'absolute',
                bottom: 610,
                right: 300,
              }}
              pointerEvents="box-none">
              <Image source={img} />
            </Animated.View>
          );
        })}
      </View>
    );
  }
}

const mapStateToProps = state => {
  const {cabin} = state;
  return {cabin};
};

export default connect(mapStateToProps)(LiveLike);
