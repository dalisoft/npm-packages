import * as TWEEN from 'es6-tween';
import React from 'react';

TWEEN.autoPlay(true);

const changeableProps = ['isPlaying', 'isStopped', 'isReversed'];
export default class ES6Tween extends React.Component {
  constructor(props) {
    super(props);

    this.node = React.createRef();
  }
  shouldComponentUpdate(nextProps) {
    return changeableProps.some((key) => this.props[key] !== nextProps[key]);
  }
  componentDidMount() {
    const {
      from,
      to,
      duration,
      repeat,
      easing,
      interpolation,
      yoyo = false,
      delay = 0,
      autoPlay,
      onStart,
      onUpdate,
      onComplete
    } = this.props;

    this.tween = new TWEEN.Tween(this.node.current, from)
      .to(to, duration)
      .repeat(repeat)
      .yoyo(yoyo)
      .easing(easing)
      .interpolation(interpolation)
      .delay(delay);

    if (!to && from) {
      this.tween.render().update(this.tween._startTime);
      this.tween._rendered = false;
      this.tween._onStartCallbackFired = false;
    }
    if (autoPlay) {
      this.tween.start();
    }
    if (onStart) {
      this.tween.on('start', onStart);
    }
    if (onUpdate) {
      this.tween.on('update', onUpdate);
    }
    if (onComplete) {
      this.tween.on('complete', onEnd);
    }
  }
  componentDidUpdate() {
    const { props, tween } = this;
    const { isPlaying, isStopped, isReversed } = props;

    if (isPlaying === true) {
      tween.play();
    } else if (isPlaying === false) {
      tween.pause();
    }

    if (isStopped === true) {
      tween.stop();
    }

    if (isReversed === true || isReversed === false) {
      tween.reverse(isReversed);
    }
  }
  componentWillUnmount() {
    this.tween.stop();
    this.tween = null;
  }
  render() {
    const { children } = this.props;

    return React.cloneElement(children, { ref: this.node });
  }
}
