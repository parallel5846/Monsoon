import './Icon.css';

export default function Icon({ component: Component, size = 20, className = '', title, ...props }) {
  if (!Component) return null;

  return <Component className={`icon ${className}`} size={size} aria-label={title} title={title} {...props} />;
}
