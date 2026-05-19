import React from 'react';

/**
 * 애니메이션을 미리보기할 수 있는 컴포넌트
 * 생성된 컴포넌트의 애니메이션을 실시간으로 표시합니다.
 */
const AnimationPreview: React.FC<{ code: string }> = ({ code }) => {
  const [isAnimating, setIsAnimating] = React.useState(true);

  const handleRefresh = () => {
    setIsAnimating(false);
    setTimeout(() => setIsAnimating(true), 100);
  };

  if (!isAnimating) return null;

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <button onClick={handleRefresh}>애니메이션 다시 보기</button>
      <div dangerouslySetInnerHTML={{ __html: code }} />
    </div>
  );
};

export default AnimationPreview;
