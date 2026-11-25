import { useActionState, useEffect, useId } from "react";
import { useNavigate } from "react-router";
import { login } from "../services/auth";

/*
 * מתי מתבצעת בדיקת התקינות בטופס לא מבוקר עם form action?
 * הערכים אינם נשמרים ב-state בכל הקלדה אלא נקראים מ-FormData בעת שליחת הטופס.
 * לכן בדיקת התקינות והקריאה ל-login מתבצעות בעת שליחת הטופס בלבד (בתוך פונקציית ה-action),
 * ולא בעת הקלדה תוך כדי שינוי תווים.
 */

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

function validateCredentials({ email, password }) {
  const fieldErrors = {};
  const trimmedEmail = (email || "").trim();
  const rawPassword = password || "";

  if (!trimmedEmail) {
    fieldErrors.email = "אימייל הוא שדה חובה";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    fieldErrors.email = "כתובת האימייל אינה תקינה";
  }

  if (!rawPassword) {
    fieldErrors.password = "סיסמא היא שדה חובה";
  } else if (rawPassword.length < 6) {
    fieldErrors.password = "סיסמא חייבת להכיל לפחות 6 תווים";
  }

  return fieldErrors;
}

export default function LoginUncontrolled() {
  const navigate = useNavigate();
  const emailId = useId();
  const passwordId = useId();

  const [state, formAction] = useActionState(
    async (_prevState, formData) => {
      const values = Object.fromEntries(formData.entries());
      const email = typeof values.email === "string" ? values.email : "";
      const password = typeof values.password === "string" ? values.password : "";

      const fieldErrors = validateCredentials({ email, password });
      if (Object.keys(fieldErrors).length > 0) {
        return {
          errors: fieldErrors,
          authError: "",
          values: { email, password },
          success: false,
        };
      }

      const matchedUser = login({ email: email.trim(), password });
      if (!matchedUser) {
        return {
          errors: {},
          authError: "אימייל או סיסמא שגויים",
          values: { email, password },
          success: false,
        };
      }

      return {
        errors: {},
        authError: "",
        values: { email, password },
        success: true,
      };
    },
    {
      errors: {},
      authError: "",
      values: { email: "chef@recipes.com", password: "" },
      success: false,
    }
  );

  useEffect(() => {
    if (state.success) {
      navigate("/recipes");
    }
  }, [state.success, navigate]);

  return (
    <div style={cardStyle}>
      <h1 style={{ marginTop: 0, marginBottom: "22px", fontSize: "1.6rem", color: "#3b1c1c" }}>
        התחברות — לא מבוקר
      </h1>

      <form key={`${state.values.email}-${state.values.password}`} action={formAction} noValidate>
        <div style={fieldGroupStyle}>
          <label htmlFor={emailId} style={labelStyle}>אימייל</label>
          <input
            id={emailId}
            aria-describedby={`${emailId}-error`}
            type="email"
            name="email"
            defaultValue={state.values.email}
            style={inputStyle}
          />
          {state.errors.email && (
            <p id={`${emailId}-error`} style={errorTextStyle}>
              {state.errors.email}
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
            defaultValue={state.values.password}
            style={inputStyle}
          />
          {state.errors.password && (
            <p id={`${passwordId}-error`} style={errorTextStyle}>
              {state.errors.password}
            </p>
          )}
        </div>

        {state.authError && (
          <p style={{ ...errorTextStyle, fontWeight: "700", marginBottom: "12px" }}>
            {state.authError}
          </p>
        )}

        <button type="submit" style={buttonStyle}>התחברות</button>
      </form>
    </div>
  );
}