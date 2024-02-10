import React from 'react';
import { useSpring, animated } from 'react-spring';

const FadeInFadeOut = ({ children }) => {
    const props = useSpring({
      opacity: 1,
      from: { opacity: 0 },
      reset: true,
    });
  
    return <animated.div style={props}>{children}</animated.div>;
};

export default FadeInFadeOut;