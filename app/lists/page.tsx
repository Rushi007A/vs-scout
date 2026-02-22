"use client";

import { useState, useEffect } from "react";
import companiesData from "../data/companies.json";

type List = {
  id: string;
  name: string;
  companies: number[];
};

export default function ListsPage() {
  const [lists, setLists] = useState<List[]>([]);
  const [newListName, setNewListName] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("vc-lists");
    if (saved) setLists(JSON.parse(saved));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) localStorage.setItem("vc-lists", JSON.stringify(lists));
  }, [lists, isLoaded]);

  const createList = () => {
    if (!newListName.trim()) return;

    const newList: List = {
      id: Date.now().toString(),
      name: newListName,
      companies: [],
    };

    setLists((prev) => [...prev, newList]);
    setNewListName("");
  };

  const deleteList = (id: string) => {
    setLists((prev) => prev.filter((l) => l.id !== id));
  };

  // ✅ CSV Export
  const exportCSV = (list: List) => {
    if (!list.companies.length) {
      alert("No companies in this list to export!");
      return;
    }

    const header = "Name,Sector,Stage,Location\n";
    const rows = list.companies
      .map((id) => {
        const company = companiesData.find((c) => String(c.id) === String(id));
        if (!company) return "";
        return `${company.name},${company.sector},${company.stage},${company.location}`;
      })
      .filter(Boolean)
      .join("\n");

    const csvContent = header + rows;
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${list.name}.csv`;
    a.click();
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Lists</h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="New list name..."
          className="p-3 border rounded flex-1"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
        />
        <button
          onClick={createList}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create
        </button>
      </div>

      {lists.length === 0 ? (
        <p className="text-gray-500">No lists created yet.</p>
      ) : (
        <div className="space-y-4">
          {lists.map((list) => (
            <div
              key={list.id}
              className="p-4 bg-white shadow rounded flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold">{list.name}</h2>
                <p className="text-sm text-gray-500">
                  {list.companies.length} companies
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => exportCSV(list)}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                  disabled={list.companies.length === 0}
                >
                  Export CSV
                </button>
                <button
                  onClick={() => deleteList(list.id)}
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