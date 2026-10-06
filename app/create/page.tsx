"use client";

import { supabase } from "../../lib/supabase";
import { useState } from "react";
import {
  ArrowLeft,
  Gift,
  Repeat2,
  HandHeart,
  ImagePlus,
} from "lucide-react";
import Link from "next/link";

export default function CreatePage() {
  const [type, setType] = useState("Give");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Books");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handlePublish = async () => {
    if (!title.trim()) {
      setMessage("Please enter an item name.");
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await supabase.from("listings").insert({
      title: title.trim(),
      description: description.trim(),
      type,
      category,
      available: true,
    });

    if (error) {
      console.error(error);
      setMessage("Something went wrong. Please try again.");
    } else {
      setMessage("🎉 Listing published successfully!");
      setTitle("");
      setDescription("");
      setCategory("Books");
      setType("Give");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-black">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black"
        >
          <ArrowLeft size={18} />
          Back to Explore
        </Link>

        <div className="mb-8">
          <p className="text-sm font-medium text-gray-500">Campus Loop</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">
            Create a listing
          </h1>
          <p className="mt-2 text-gray-500">
            Share something with someone on campus.
          </p>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
          <label className="mb-3 block text-sm font-medium">
            What do you want to do?
          </label>

          <div className="grid grid-cols-3 gap-3">
            {[
              { name: "Give", icon: Gift },
              { name: "Exchange", icon: Repeat2 },
              { name: "Borrow", icon: HandHeart },
            ].map((item) => {
              const Icon = item.icon;
              const active = type === item.name;

              return (
                <button
                  type="button"
                  key={item.name}
                  onClick={() => setType(item.name)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    active
                      ? "border-black bg-black text-white"
                      : "border-black/10 bg-white hover:bg-gray-50"
                  }`}
                >
                  <Icon size={20} />
                  <p className="mt-3 font-medium">{item.name}</p>
                </button>
              );
            })}
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Item name
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Casio Scientific Calculator"
                className="w-full rounded-2xl border border-black/10 bg-gray-50 px-4 py-3 outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-2xl border border-black/10 bg-gray-50 px-4 py-3 outline-none focus:border-black"
              >
                <option>Books</option>
                <option>Electronics</option>
                <option>Stationery</option>
                <option>Lab Equipment</option>
                <option>Furniture</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Tell students about the item..."
                className="w-full resize-none rounded-2xl border border-black/10 bg-gray-50 px-4 py-3 outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Add photos
              </label>

              <button
                type="button"
                className="flex h-32 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-black/20 bg-gray-50 text-gray-500 hover:bg-gray-100"
              >
                <ImagePlus size={28} />
                <span className="mt-2 text-sm">Add an image</span>
              </button>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Availability
              </label>

              <div className="flex items-center gap-3 rounded-2xl border border-black/10 bg-gray-50 p-4">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <div>
                  <p className="text-sm font-medium">Available</p>
                  <p className="text-xs text-gray-500">
                    Students can request this item
                  </p>
                </div>
              </div>
            </div>

            {message && (
              <div className="rounded-2xl bg-gray-100 px-4 py-3 text-sm">
                {message}
              </div>
            )}

            <button
              type="button"
              onClick={handlePublish}
              disabled={loading}
              className="w-full rounded-2xl bg-black py-4 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Publishing..." : "Publish listing"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}