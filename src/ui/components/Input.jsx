export default function Input({
  label,
  as = "input",
  className = "",
  ...props
}) {
  const Component = as;

  return (
    <div className="mb-3">
      {label && <label className="fw-medium mb-1">{label}</label>}
      <Component className={`form-control shadow-sm ${className}`} {...props} />
    </div>
  );
}
