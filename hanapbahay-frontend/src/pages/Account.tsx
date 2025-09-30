import { useAuth } from "@/providers/AuthProvider";

const Account = () => {
  const { user } = useAuth();

  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Account</h1>
        <p className="text-muted-foreground text-sm">
          Manage your profile and settings.
        </p>
      </header>
      <div className="rounded-lg border p-6 shadow-sm">
        <dl className="space-y-4">
          <div>
            <dt className="text-muted-foreground text-xs uppercase tracking-wide">
              Email
            </dt>
            <dd className="text-foreground text-sm font-medium">
              {user?.email}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-xs uppercase tracking-wide">
              Roles
            </dt>
            <dd className="text-foreground text-sm font-medium">
              {user?.roles.join(", ") || "Renter"}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
};

export default Account;
