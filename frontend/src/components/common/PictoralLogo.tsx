import React from 'react';

type PictoralLogoProps = {
  className?: string;
  showWordmark?: boolean;
  size?: number;
};

/** Brand mark: picture frame with orange edit accent — matches --editor-* tokens */
const PictoralLogo: React.FC<PictoralLogoProps> = ({
  className = '',
  showWordmark = true,
  size = 28,
}) => (
  <span className={`editor-logo ${className}`.trim()} aria-hidden={!showWordmark}>
    <svg
      className="editor-logo__mark"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="4" y="6" width="24" height="20" rx="3" stroke="currentColor" strokeWidth="2" />
      <path
        d="M8 22 L13 16 L17 19 L24 12"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.55"
      />
      <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.55" />
      <path
        d="M22 6 L28 6 L28 12"
        stroke="var(--editor-accent)"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    {showWordmark && (
      <span className="editor-logo__wordmark">
        Pict<span className="editor-logo__accent">oral</span>
      </span>
    )}
  </span>
);

export default PictoralLogo;
