export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const base = `btn btn-${variant} rounded-4 px-4 py-2 shadow-sm ${className}`;

  return (
    <button className={base} {...props}>
      {children}
    </button>
  );
}
