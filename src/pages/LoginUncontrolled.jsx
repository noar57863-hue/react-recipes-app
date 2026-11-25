import { useActionState, useEffect, useId } from "react";
import { useNavigate } from "react-router";
import { login } from "../services/auth";

/*
 * מתי מתבצעת בדיקת התקינות בטופס לא מבוקר עם form action?
 * הערכים אינם נשמרים ב-state בכל הקלדה אלא נקראים מ-FormData בעת שליחת הטופס.
 * לכן בדיקת התקינות והקריאה ל-login מתבצעות בעת שליחת הטופס בלבד (בתוך פונקציית ה-action),
 * ולא בעת הקלדה תוך כדי שינוי תווים.
 */

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
    <div style={{ maxWidth: "420px", margin: "24px auto" }}>
      <h1>התחברות (טופס לא מבוקר)</h1>

      <form key={`${state.values.email}-${state.values.password}`} action={formAction} noValidate>
        <div>
          <label htmlFor={emailId}>אימייל</label>
          <br />
          <input
            id={emailId}
            aria-describedby={`${emailId}-error`}
            type="email"
            name="email"
            defaultValue={state.values.email}
          />
          {state.errors.email && (
            <p id={`${emailId}-error`} style={{ color: "#dc2626", marginTop: 4 }}>
              {state.errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={passwordId}>סיסמא</label>
          <br />
          <input
            id={passwordId}
            aria-describedby={`${passwordId}-error`}
            type="password"
            name="password"
            defaultValue={state.values.password}
          />
          {state.errors.password && (
            <p id={`${passwordId}-error`} style={{ color: "#dc2626", marginTop: 4 }}>
              {state.errors.password}
            </p>
          )}
        </div>

        {state.authError && (
          <p style={{ color: "#dc2626", fontWeight: "bold" }}>{state.authError}</p>
        )}

        <button type="submit">התחברות</button>
      </form>
    </div>
  );
}