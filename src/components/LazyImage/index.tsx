import React from 'react';
import {View} from 'react-native';

import {Small, Original} from './styles';
import {useState, useEffect} from 'react';
import {Animated} from 'react-native';
const OriginalAnimated = Animated.createAnimatedComponent(Original);
export default function LazyImage({
  smallSource,
  source,
  aspectRatio,
  shoudLoad,
}) {
  const opacity = new Animated.Value(0);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (shoudLoad) {
      setTimeout(() => {
        setLoaded(true);
      }, 1000);
    }
  }, [shoudLoad]);
  function handleAnimate() {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }
  return (
    <Small
      source={smallSource}
      ratio={aspectRatio}
      resizeMode="contain"
      blurRadius={2}>
      <OriginalAnimated
        style={{opacity}}
        source={source}
        ratio={aspectRatio}
        resizeMode="contain"
        onLoadEnd={handleAnimate}
      />
    </Small>
  );
}
