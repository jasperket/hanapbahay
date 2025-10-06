// components/navbar/RegisterForm.tsx
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/providers/AuthProvider";
import type {
  RegisterPayload,
  RegisterResponse,
  UserRoleValue,
} from "@/types/auth";

const roles: { label: string; value: UserRoleValue }[] = [
  { label: "Renter", value: 0 },
  { label: "Landlord", value: 1 },
];

export const RegisterForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { register } = useAuth();
  const [form, setForm] = useState<RegisterPayload>({
    displayName: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: 0,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response: RegisterResponse = await register(form);
      toast.success(
        response.message ?? "Registration successful. You may log in now.",
      );
      onSuccess();
    } catch (e) {
      setError("Registration failed");
      toast.error("Registration failed" + e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <p className="text-muted-foreground text-sm">All fields are required</p>
      <Input
        placeholder="Full name"
        value={form.displayName}
        onChange={(e) => setForm({ ...form, displayName: e.target.value })}
        required
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          type="tel"
          placeholder="Phone"
          value={form.phoneNumber}
          onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
          required
        />
        <select
          value={form.role}
          onChange={(e) =>
            setForm({ ...form, role: Number(e.target.value) as UserRoleValue })
          }
          className="w-full rounded-md border px-3 py-2 text-sm"
        >
          {roles.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="size-4 animate-spin" /> Creating account
          </span>
        ) : (
          "Create account"
        )}
      </Button>
    </form>
  );
};
