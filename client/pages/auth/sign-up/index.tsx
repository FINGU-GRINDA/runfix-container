import { authClient } from "@/services/auth-client";
import { useState } from "react";
import Link from "next/link";

// Types for form state and validation
interface FormState {
  email: string;
  password: string;
  passwordConfirmation: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  passwordConfirmation?: string;
  general?: string;
}

/**
 * Sign-up page component
 */
export default function Page() {
  // Form state
  const [formState, setFormState] = useState<FormState>({
    email: "",
    password: "",
    passwordConfirmation: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  /**
   * Handles input changes and updates form state
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));

    // Clear errors when user starts typing
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  /**
   * Validates form input and returns any errors
   */
  const validateForm = (): FormErrors => {
    const errors: FormErrors = {};

    // Email validation
    if (!formState.email) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formState.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formState.password) {
      errors.password = "Password is required";
    } else if (formState.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    // Password confirmation validation
    if (!formState.passwordConfirmation) {
      errors.passwordConfirmation = "Please confirm your password";
    } else if (formState.password !== formState.passwordConfirmation) {
      errors.passwordConfirmation = "Passwords do not match";
    }

    return errors;
  };

  /**
   * Submits the form data to the authentication service
   */
  const submitSignupForm = async (formData: FormState): Promise<void> => {
    try {
      const { error } = await authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.email,
        callbackURL: "/auth/sign-in",
      });

      if (error) {
        throw new Error(error.message || "Failed to sign up");
      }

      setIsSuccess(true);
    } catch (error) {
      console.error(error);
      setFormErrors((prev) => ({
        ...prev,
        general: error instanceof Error ? error.message : "Failed to sign up",
      }));
      throw error;
    }
  };

  /**
   * Handles form submission
   */
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // Reset states
    setIsLoading(true);
    setFormErrors({});
    setIsSuccess(false);

    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsLoading(false);
      return;
    }

    // Submit form
    try {
      await submitSignupForm(formState);
    } catch {
      // Error handling is done in submitSignupForm
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Create an Account
          </h1>
          <p className="text-gray-600">
            Sign up to get started with our service
          </p>
        </div>

        {isSuccess ? (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-md p-4 mb-6">
            <p>Success! Please check your email to verify your account.</p>
          </div>
        ) : (
          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                value={formState.email}
                onChange={handleInputChange}
                aria-invalid={!!formErrors.email}
                aria-describedby={formErrors.email ? "email-error" : undefined}
                autoComplete="email"
                required
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:outline-none ${
                  formErrors.email
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-blue-200"
                }`}
              />
              {formErrors.email && (
                <p id="email-error" className="text-red-500 text-sm mt-1">
                  {formErrors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                value={formState.password}
                onChange={handleInputChange}
                aria-invalid={!!formErrors.password}
                aria-describedby={
                  formErrors.password ? "password-error" : undefined
                }
                autoComplete="new-password"
                minLength={8}
                required
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:outline-none ${
                  formErrors.password
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-blue-200"
                }`}
              />
              {formErrors.password && (
                <p id="password-error" className="text-red-500 text-sm mt-1">
                  {formErrors.password}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="passwordConfirmation"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="passwordConfirmation"
                name="passwordConfirmation"
                placeholder="••••••••"
                value={formState.passwordConfirmation}
                onChange={handleInputChange}
                aria-invalid={!!formErrors.passwordConfirmation}
                aria-describedby={
                  formErrors.passwordConfirmation
                    ? "password-confirmation-error"
                    : undefined
                }
                autoComplete="new-password"
                required
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:outline-none ${
                  formErrors.passwordConfirmation
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-blue-200"
                }`}
              />
              {formErrors.passwordConfirmation && (
                <p
                  id="password-confirmation-error"
                  className="text-red-500 text-sm mt-1"
                >
                  {formErrors.passwordConfirmation}
                </p>
              )}
            </div>

            {formErrors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-md p-4">
                <p>{formErrors.general}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              href="/auth/sign-in"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
