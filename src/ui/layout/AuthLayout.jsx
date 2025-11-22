export default function AuthLayout({ children }) {
  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div style={{ width: "400px" }} className="fade-in">
        {children}
      </div>
    </div>
  );
}
