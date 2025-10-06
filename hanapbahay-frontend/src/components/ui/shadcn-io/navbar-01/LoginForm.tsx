// components/navbar/LoginForm.tsx
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/providers/AuthProvider";
import { useNavigate } from "react-router";
import type { LoginPayload, LoginResponse } from "@/types/auth";

export const LoginForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<LoginPayload>({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response: LoginResponse = await login(form);
      toast.success(response.message ?? "Logged in successfully");

      // landlord redirect
      const role = response.role?.toLowerCase();
      if (role === "landlord") {
        navigate("/properties");
      }

      onSuccess();
    } catch (e) {
      setError("Invalid credentials!");
      toast.error("Invalid credentials!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div>
        <label>Email</label>
        <Input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
      </div>
      <div>
        <label>Password</label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="text-muted-foreground absolute inset-y-0 right-0 flex items-center px-3 text-sm"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="size-4 animate-spin" /> Signing in
          </span>
        ) : (
          "Continue"
        )}
      </Button>
    </form>
  );
};
