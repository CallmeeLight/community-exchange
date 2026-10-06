"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  ChevronDown,
  Laptop,
  Plus,
  Search,
  SlidersHorizontal,
  Shirt,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { supabase } from "../lib/supabase";

type Listing = {
  id: string;
  title: string;
  description: string | null;
  type: "Give" | "Exchange" | "Borrow";
  category: string;
  available: boolean;
  created_at: string;
};

const getIcon = (category: string, title: string) => {
  const text = `${category} ${title}`.toLowerCase();

  if (text.includes("book")) return BookOpen;
  if (text.includes("calculator")) return Calculator;
  if (text.includes("laptop") || text.includes("computer"))
    return Laptop;
  if (text.includes("shirt") || text.includes("clothes")) return Shirt;
  if (
    text.includes("arduino") ||
    text.includes("equipment") ||
    text.includes("tool")
  )
    return Wrench;

  return Wrench;
};

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    fetchListings();
  }, []);

  async function fetchListings() {
    setLoading(true);

    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("available", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching listings:", error);
    } else {
      setListings(data || []);
    }

    setLoading(false);
  }

  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      const matchesFilter =
        activeFilter === "All" || item.type === activeFilter;

      const query = search.toLowerCase().trim();

      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [listings, search, activeFilter]);

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-[#151515]">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-black/5 bg-[#f7f7f5]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-white">
              <ArrowRight size={18} />
            </div>

            <span className="text-lg font-semibold tracking-tight">
              Campus Loop
            </span>
          </div>

          <div className="hidden items-center gap-8 text-sm text-black/60 md:flex">
            <Link className="font-medium text-black" href="/">
              Explore
            </Link>

            <Link href="/requests">My Requests</Link>

            <a href="#">Profile</a>
          </div>

          <Link
            href="/create"
            className="flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-black/80"
          >
            <Plus size={17} />
            List an item
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pb-14 pt-20">
        <div className="max-w-3xl">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-black/40">
            Campus Exchange
          </p>

          <h1 className="text-5xl font-semibold tracking-[-0.045em] md:text-7xl">
            Things you need.
            <br />
            Things you can share.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-black/55">
            Give, exchange, or borrow useful things from people around your
            campus. Keep good stuff in circulation.
          </p>
        </div>

        {/* Search */}
        <div className="mt-12 flex max-w-3xl items-center gap-3 rounded-2xl border border-black/10 bg-white p-2 shadow-sm">
          <Search className="ml-3 text-black/40" size={21} />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-black/35"
            placeholder="Search books, calculators, equipment..."
          />

          <button className="hidden items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-medium text-white sm:flex">
            Search
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Filters */}
      <section className="border-y border-black/5 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-3 overflow-x-auto px-6 py-4">
          {["All", "Give", "Exchange", "Borrow"].map((item) => (
            <button
              key={item}
              onClick={() => setActiveFilter(item)}
              className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition ${
                activeFilter === item
                  ? "bg-black text-white"
                  : "border border-black/10 bg-white text-black/65 hover:border-black/30"
              }`}
            >
              {item}
            </button>
          ))}

          <div className="mx-2 hidden h-7 w-px bg-black/10 sm:block" />

          <button className="flex shrink-0 items-center gap-2 rounded-full border border-black/10 px-4 py-2.5 text-sm text-black/65">
            Category
            <ChevronDown size={15} />
          </button>

          <button className="flex shrink-0 items-center gap-2 rounded-full border border-black/10 px-4 py-2.5 text-sm text-black/65">
            <SlidersHorizontal size={15} />
            Filters
          </button>
        </div>
      </section>

      {/* Listings */}
      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-sm text-black/40">
              {listings.length} available around campus
            </p>

            <h2 className="mt-1 text-2xl font-semibold tracking-tight">
              Explore listings
            </h2>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-96 animate-pulse rounded-3xl bg-black/5"
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredListings.length === 0 && (
          <div className="rounded-3xl border border-black/10 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-black/5">
              <Search size={24} className="text-black/40" />
            </div>

            <h3 className="mt-5 text-lg font-semibold">
              No listings found
            </h3>

            <p className="mt-2 text-sm text-black/45">
              Try another search or list something yourself.
            </p>

            <Link
              href="/create"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-medium text-white"
            >
              List an item
              <ArrowRight size={16} />
            </Link>
          </div>
        )}

        {/* Actual listings */}
        {!loading && filteredListings.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filteredListings.map((item) => {
              const Icon = getIcon(item.category, item.title);

              return (
                <article
                  key={item.id}
                  className="group overflow-hidden rounded-3xl border border-black/8 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Image placeholder */}
                  <div className="flex h-52 items-center justify-center bg-[#eeeeeb]">
                    <Icon
                      size={64}
                      strokeWidth={1.2}
                      className="text-black/20 transition duration-300 group-hover:scale-110 group-hover:text-black/30"
                    />
                  </div>

                  <div className="p-5">
                    <div className="mb-4 flex items-center justify-between gap-2">
                      <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-medium">
                        {item.type}
                      </span>

                      <span className="text-xs text-black/40">
                        {item.category}
                      </span>
                    </div>

                    <h3 className="font-semibold tracking-tight">
                      {item.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-black/45">
                      {item.description || "No description provided."}
                    </p>

                    <div className="mt-6 flex items-center justify-between border-t border-black/5 pt-4">
                      <span className="text-sm text-green-600">
                        Available
                      </span>

                      <button className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white transition group-hover:scale-105">
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Bottom CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="rounded-[2rem] bg-black px-8 py-14 text-white md:px-14">
          <p className="text-sm uppercase tracking-[0.18em] text-white/40">
            Have something unused?
          </p>

          <div className="mt-4 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <h2 className="max-w-2xl text-4xl font-semibold tracking-[-0.035em] md:text-5xl">
              Someone on campus might need it.
            </h2>

            <Link
              href="/create"
              className="flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black"
            >
              Give something
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}