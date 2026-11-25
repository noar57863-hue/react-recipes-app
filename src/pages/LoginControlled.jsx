import { useState, useId } from "react";
import { useNavigate } from "react-router";
import { login } from "../services/auth";

const cardStyle = {
  maxWidth: "430px",
  margin: "36px auto",
  padding: "32px 28px",
  borderRadius: "20px",
  background: "linear-gradient(145deg, rgba(255, 245, 242, 0.92), rgba(255, 232, 229, 0.85))",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(244, 187, 178, 0.7)",
  boxShadow: "0 12px 30px rgba(190, 95, 95, 0.08)",
  fontFamily: "system-ui, sans-serif",
};

const fieldGroupStyle = {
  marginBottom: "18px",
};

const labelStyle = {
  display: "block",
  marginBottom: "6px",
  fontWeight: "600",
  color: "#4a2525",
  fontSize: "0.95rem",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "11px 14px",
  borderRadius: "12px",
  border: "1px solid #f0c2ba",
  backgroundColor: "rgba(255, 255, 255, 0.85)",
  color: "#2d1616",
  fontSize: "1rem",
  outline: "none",
};

const buttonStyle = {
  width: "100%",
  marginTop: "8px",
  padding: "12px 18px",
  borderRadius: "12px",
  border: "none",
  backgroundColor: "#e07a7a",
  color: "#ffffff",
  fontWeight: "700",
  fontSize: "1rem",
  cursor: "pointer",
  boxShadow: "0 6px 14px rgba(224, 122, 122, 0.28)",
};

const errorTextStyle = {
  color: "#b91c1c",
  fontSize: "0.88rem",
  marginTop: "6px",
  marginBottom: 0,
};

export default function LoginControlled() {
  const navigate = useNavigate();
  const emailId = useId();
  const passwordId = useId();

  const [values, setValues] = useState({
    email: "chef@recipes.com",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState("");

  function validate(currentValues) {
    const nextErrors = {};
    const trimmedEmail = currentValues.email.trim();

    if (!trimmedEmail) {
      nextErrors.email = "אימייל הוא שדה חובה";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      nextErrors.email = "כתובת האימייל אינה תקינה";
    }

    if (!currentValues.password) {
      nextErrors.password = "סיסמא היא שדה חובה";
    } else if (currentValues.password.length < 6) {
      nextErrors.password = "סיסמא חייבת להכיל לפחות 6 תווים";
    }

    return nextErrors;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    const updatedValues = { ...values, [name]: value };
    setValues(updatedValues);
    setAuthError("");

    if (errors[name]) {
      const updatedErrors = validate(updatedValues);
      setErrors((prev) => ({
        ...prev,
        [name]: updatedErrors[name] || "",
      }));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    setAuthError("");

    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const matchedUser = login({
      email: values.email.trim(),
      password: values.password,
    });

    if (!matchedUser) {
      setAuthError("אימייל או סיסמא שגויים");
      return;
    }

    navigate("/recipes");
  }

  return (
    <div style={cardStyle}>
      <h1 style={{ marginTop: 0, marginBottom: "22px", fontSize: "1.6rem", color: "#3b1c1c" }}>
        התחברות — מבוקר
      </h1>

      <form onSubmit={handleSubmit} noValidate>
        <div style={fieldGroupStyle}>
          <label htmlFor={emailId} style={labelStyle}>אימייל</label>
          <input
            id={emailId}
            aria-describedby={`${emailId}-error`}
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            style={inputStyle}
          />
          {errors.email && (
            <p id={`${emailId}-error`} style={errorTextStyle}>
              {errors.email}
            </p>
          )}
        </div>

        <div style={fieldGroupStyle}>
          <label htmlFor={passwordId} style={labelStyle}>סיסמא</label>
          <input
            id={passwordId}
            aria-describedby={`${passwordId}-error`}
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            style={inputStyle}
          />
          {errors.password && (
            <p id={`${passwordId}-error`} style={errorTextStyle}>
              {errors.password}
            </p>
          )}
        </div>

        {authError && (
          <p style={{ ...errorTextStyle, fontWeight: "700", marginBottom: "12px" }}>
            {authError}
          </p>
        )}

        <button type="submit" style={buttonStyle}>התחברות</button>
      </form>
    </div>
  );
}