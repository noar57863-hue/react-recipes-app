import { useState, useId } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { login } from "../services/auth";

const loginSchema = Joi.object({
  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "אימייל הוא שדה חובה",
      "string.email": "כתובת האימייל אינה תקינה",
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      "string.empty": "סיסמא היא שדה חובה",
      "string.min": "סיסמא חייבת להכיל לפחות 6 תווים",
    }),
});

export default function LoginRhf() {
  const navigate = useNavigate();
  const emailId = useId();
  const passwordId = useId();
  const [authError, setAuthError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isSubmitted },
  } = useForm({
    resolver: joiResolver(loginSchema),
    mode: "onTouched",
    defaultValues: {
      email: "chef@recipes.com",
      password: "",
    },
  });

  function onSubmit(data) {
    setAuthError("");
    const matchedUser = login({
      email: data.email.trim(),
      password: data.password,
    });

    if (!matchedUser) {
      setAuthError("אימייל או סיסמא שגויים");
      return;
    }

    navigate("/recipes");
  }

  const showEmailError =
    Boolean(errors.email) && (Boolean(touchedFields.email) || isSubmitted);
  const showPasswordError =
    Boolean(errors.password) && (Boolean(touchedFields.password) || isSubmitted);

  return (
    <div style={{ maxWidth: "420px", margin: "24px auto" }}>
      <h1>התחברות (React Hook Form + Joi)</h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <label htmlFor={emailId}>אימייל</label>
          <br />
          <input
            id={emailId}
            aria-describedby={`${emailId}-error`}
            type="email"
            {...register("email")}
          />
          {showEmailError && (
            <p id={`${emailId}-error`} style={{ color: "#dc2626", marginTop: 4 }}>
              {errors.email.message}
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
            {...register("password")}
          />
          {showPasswordError && (
            <p id={`${passwordId}-error`} style={{ color: "#dc2626", marginTop: 4 }}>
              {errors.password.message}
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