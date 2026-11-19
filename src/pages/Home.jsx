import { Link } from "react-router";

export default function Home() {
  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "48px auto",
        padding: "48px 28px",
        textAlign: "center",
        backgroundColor: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: "16px",
        boxShadow: "0 4px 16px rgba(15, 23, 42, 0.06)",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: "2.2rem",
          marginTop: 0,
          marginBottom: "12px",
          color: "#0f172a",
        }}
      >
        ברוכות הבאות למתכונים
      </h1>

      <p
        style={{
          fontSize: "1.05rem",
          color: "#475569",
          marginTop: 0,
          marginBottom: "28px",
        }}
      >
        כל המתכונים מחכים לכן במקום אחד — חפשו, גלו והכינו בקלות.
      </p>

      <Link
        to="/recipes"
        style={{
          display: "inline-block",
          padding: "12px 24px",
          backgroundColor: "#0f766e",
          color: "#ffffff",
          textDecoration: "none",
          borderRadius: "10px",
          fontWeight: "600",
          fontSize: "1.05rem",
        }}
      >
        למתכונים
      </Link>
    </div>
  );
}