import { useState, useId } from "react";
import { useNavigate } from "react-router";
import { login } from "../services/auth";

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
    <div style={{ maxWidth: "420px", margin: "24px auto" }}>
      <h1>התחברות (טופס מבוקר)</h1>

      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor={emailId}>אימייל</label>
          <br />
          <input
            id={emailId}
            aria-describedby={`${emailId}-error`}
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
          />
          {errors.email && (
            <p id={`${emailId}-error`} style={{ color: "#dc2626", marginTop: 4 }}>
              {errors.email}
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
            value={values.password}
            onChange={handleChange}
          />
          {errors.password && (
            <p id={`${passwordId}-error`} style={{ color: "#dc2626", marginTop: 4 }}>
              {errors.password}
            </p>
          )}
        </div>

        {authError && (
          <p style={{ color: "#dc2626", fontWeight: "bold" }}>{authError}</p>
        )}

        <button type="submit">התחברות</button>
      </form>
    </div>
  );
}