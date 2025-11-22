import Navbar from "../components/Navbar.jsx";

export default function DashboardLayout({ children }) {
  return (
    <>
      <Navbar />
      <div className="container mt-4 fade-in">{children}</div>
    </>
  );
}
