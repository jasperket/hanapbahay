// components/navbar/LoginForm.tsx
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/providers/AuthProvider";
import type { LoginPayload, LoginResponse } from "@/types/auth";

export const LoginForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { login } = useAuth();
  const [form, setForm] = useState<LoginPayload>({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response: LoginResponse = await login(form);
      toast.success(response.message ?? "Logged in successfully");
      onSuccess();
    } catch (err) {
      setError("Login failed");
      toast.error("Login failed" + err);
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
        <Input
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
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
