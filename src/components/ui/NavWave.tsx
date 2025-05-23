import React from 'react';

const NavWave: React.FC = () => (
  <div className="w-full overflow-hidden">
    <svg
      className="w-full h-6"
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#ffffff"
        d="M0,256L80,250.7C160,245,320,235,480,229.3C640,224,800,224,960,218.7C1120,213,1280,203,1360,197.3L1440,192L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
      />
    </svg>
  </div>
);

export default NavWave;
