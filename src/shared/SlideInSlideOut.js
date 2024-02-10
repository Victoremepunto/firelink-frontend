import React from 'react';
import { useSpring, animated } from 'react-spring';

const SlideInSlideOut = ({ children }) => {
  const props = useSpring({
    from: { transform: 'translateY(-100%)' },
    to: { transform: 'translateY(0%)' },
    reset: true,
  });

  return <animated.div style={props}>{children}</animated.div>;
};

export default SlideInSlideOut;