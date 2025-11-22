export default function EmptyState({ title, subtitle }) {
  return (
    <div className="empty-state fade-in">
      <div className="mb-4" style={{ fontSize: "5rem", opacity: 0.6 }}>
        📭
      </div>
      <h4 className="fw-bold mb-3" style={{ 
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text"
      }}>
        {title}
      </h4>
      {subtitle && (
        <p className="text-muted fs-5" style={{ maxWidth: "500px", margin: "0 auto" }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
