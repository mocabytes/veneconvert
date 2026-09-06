import { useEffect, useRef, useState } from "react";
import { Animated } from "react-native";

export function useCountUp(target: number, duration = 700): string {
  const anim = useRef(new Animated.Value(target)).current;
  const previous = useRef(target);
  const [text, setText] = useState(target.toFixed(2));

  useEffect(() => {
    const from = previous.current;
    previous.current = target;
    if (from === target) {
      setText(target.toFixed(2));
      return;
    }
    anim.setValue(from);
    const listenerId = anim.addListener(({ value }) =>
      setText(value.toFixed(2))
    );
    Animated.timing(anim, {
      toValue: target,
      duration,
      useNativeDriver: false,
    }).start(() => {
      anim.removeListener(listenerId);
    });
    return () => {
      anim.removeListener(listenerId);
    };
  }, [target, duration, anim]);

  return text;
}
