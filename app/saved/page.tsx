"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type SavedSearch = {
  id: string;
  name: string;
  search: string;
  sector: string;
  stage: string;
  sort: string;
};

export default function SavedPage() {
  const [saved, setSaved] = useState<SavedSearch[]>([]);
  const router = useRouter();

  useEffect(() => {
    const data = localStorage.getItem("vc-saved-searches");
    if (data) {
      setSaved(JSON.parse(data));
    }
  }, []);

  const deleteSearch = (id: string) => {
    const updated = saved.filter((s) => s.id !== id);
    setSaved(updated);
    localStorage.setItem("vc-saved-searches", JSON.stringify(updated));
  };

  const runSearch = (search: SavedSearch) => {
    const query = new URLSearchParams({
      search: search.search,
      sector: search.sector,
      stage: search.stage,
      sort: search.sort,
    }).toString();

    router.push(`/companies?${query}`);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Saved Searches</h1>

      {saved.length === 0 ? (
        <p className="text-gray-500">No saved searches yet.</p>
      ) : (
        <div className="space-y-4">
          {saved.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-white shadow rounded flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold">{item.name}</h2>
                <p className="text-sm text-gray-500">
                  {item.sector || "All"} | {item.stage || "All"}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => runSearch(item)}
                  className="px-3 py-1 border rounded"
                >
                  Run
                </button>
                <button
                  onClick={() => deleteSearch(item.id)}
                  className="px-3 py-1 border text-red-600 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}