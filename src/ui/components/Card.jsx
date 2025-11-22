export default function Card({ children, className = "" }) {
  return (
    <div className={`card p-4 shadow-sm rounded-4 fade-in ${className}`}>
      {children}
    </div>
  );
}
