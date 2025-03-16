import React from 'react';
import { motion } from 'framer-motion';

// 페이지 에니매이션 효과 (우->좌)
const MotionPage = ({ children }) => {

  return (
    <motion.div
      initial={{ x: "100%" }}  // 처음에 화면 오른쪽에 위치
      animate={{ x: 0 }}       // 왼쪽으로 이동하여 화면에 표시
      transition={{ duration: 0.2 }} //지속시간
      className='z-1 position-absolute top-0 start-0 w-100 h-100 bg-white'
    >
      {children}
    </motion.div>
  );
};

export default MotionPage;
