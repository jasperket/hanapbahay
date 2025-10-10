import { Navbar01 } from "@/components/ui/shadcn-io/navbar-01";
import HomeListing from "@/components/home/HomeListing";

const Home = () => {
  return (
    <>
      <Navbar01 />
      <main>
        <section
          id="listings"
          className="container mx-auto max-w-6xl px-4 pt-8 pb-20"
        >
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold">For Rent</h2>
          </div>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <HomeListing />
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
