interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  fullscreen?: boolean;
}

export function Loader({ size = 'md', label, fullscreen }: LoaderProps) {
  const spinner = (
    <div className="loader-wrap">
      <span className={`loader-spinner loader-${size}`} aria-hidden="true" />
      {label && <span>{label}</span>}
    </div>
  );

  if (fullscreen) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        {spinner}
      </div>
    );
  }

  return spinner;
}

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  radius?: number | string;
  className?: string;
}

export function Skeleton({ width = '100%', height = 16, radius = 6, className = '' }: SkeletonProps) {
  return (
    <span
      className={`skeleton ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        borderRadius: typeof radius === 'number' ? `${radius}px` : radius,
      }}
      aria-hidden="true"
    />
  );
}