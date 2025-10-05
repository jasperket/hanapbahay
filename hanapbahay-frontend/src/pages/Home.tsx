import { Link } from "react-router";
import { Navbar01 } from "@/components/ui/shadcn-io/navbar-01";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";

const Home = () => {
  const { user } = useAuth();

  return (
    <>
      <Navbar01 />
      <main>
        <section className="container mx-auto flex min-h-[60vh] max-w-screen-lg flex-col items-start justify-center gap-6 px-4 py-16">
          <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            Find your next rental property the easy way.
          </h1>
          <p className="text-muted-foreground max-w-2xl text-lg">
            Browse verified listings, connect with trusted landlords, and stay
            on top of your rental journey with tailored alerts and saved
            searches.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {user ? (
              <Button asChild size="lg">
                <Link to="/account">Go to dashboard</Link>
              </Button>
            ) : (
              <Button size="lg">Get started</Button>
            )}
            <Button variant="ghost" size="lg">
              Explore listings
            </Button>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
