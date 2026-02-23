"use client";

import companiesData from "../../data/companies.json";
import Link from "next/link";
import { useState, useEffect, use } from "react";

type Company = {
  id: string;
  name: string;
  website: string;
  sector: string;
  stage: string;
  location: string;
};

export default function CompanyDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const company = (companiesData as Company[]).find(
    (c) => String(c.id) === id
  );

  const [lists, setLists] = useState<any[]>([]);
  const [selectedList, setSelectedList] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [enriched, setEnriched] = useState<any>(null);

  // ✅ Load lists from localStorage
  useEffect(() => {
    const savedLists = localStorage.getItem("vc-lists");
    if (savedLists) {
      setLists(JSON.parse(savedLists));
    }
  }, []);

  // ✅ Load cached enrichment
  useEffect(() => {
    if (!company) return;

    const cached = localStorage.getItem(`enrich-${company.id}`);
    if (cached) {
      setEnriched(JSON.parse(cached));
    }
  }, [company]);

  // ✅ Add company to selected list
  const addToList = () => {
    if (!selectedList || !company) return;

    const updatedLists = lists.map((list) => {
      if (list.id === selectedList) {
        if (!list.companies.includes(company.id)) {
          return {
            ...list,
            companies: [...list.companies, company.id],
          };
        }
      }
      return list;
    });

    setLists(updatedLists);
    localStorage.setItem("vc-lists", JSON.stringify(updatedLists));

    alert("Company added to list!");
  };

  // ✅ Enrich logic
  const handleEnrich = async () => {
    if (!company) return;

    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: company.website }),
      });

      if (!res.ok) throw new Error("Failed");

      const data = await res.json();
      setEnriched(data);

      localStorage.setItem(
        `enrich-${company.id}`,
        JSON.stringify(data)
      );
    } catch (err) {
      setError("Enrichment failed");
    } finally {
      setLoading(false);
    }
  };

  if (!company) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Company Not Found</h1>
        <Link href="/companies" className="text-blue-600 underline">
          Back to Companies
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">{company.name}</h1>

      <div className="bg-white shadow rounded p-6 space-y-4">
        <p><strong>Sector:</strong> {company.sector}</p>
        <p><strong>Stage:</strong> {company.stage}</p>
        <p><strong>Location:</strong> {company.location}</p>
        <p>
          <strong>Website:</strong>{" "}
          <a
            href={company.website}
            target="_blank"
            className="text-blue-600 underline"
          >
            Visit Website
          </a>
        </p>
      </div>

      {/* ✅ Save to List Section */}
      <div className="mt-6 p-4 border rounded bg-white shadow">
        <h3 className="font-semibold mb-2">Save to List</h3>

        <select
          className="p-2 border rounded mr-2"
          value={selectedList}
          onChange={(e) => setSelectedList(e.target.value)}
        >
          <option value="">Select List</option>
          {lists.map((list) => (
            <option key={list.id} value={list.id}>
              {list.name}
            </option>
          ))}
        </select>

        <button
          onClick={addToList}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      {/* Enrich Button */}
      <div className="mt-6">
        <button
          onClick={handleEnrich}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Enriching..." : "Enrich with AI"}
        </button>

        {error && (
          <p className="text-red-500 mt-2">{error}</p>
        )}
      </div>

      {/* Enrichment Result */}
      {enriched && (
        <div className="mt-8 bg-white shadow rounded p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold">Summary</h2>
            <p>{enriched.summary}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">What They Do</h2>
            <ul className="list-disc ml-6">
              {enriched.whatTheyDo?.map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold">Keywords</h2>
            <div className="flex gap-2 flex-wrap mt-2">
              {enriched.keywords?.map((k: string, i: number) => (
                <span key={i} className="bg-gray-200 px-2 py-1 rounded text-sm">
                  {k}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold">Signals</h2>
            <ul className="list-disc ml-6">
              {enriched.signals?.map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold">Sources</h2>
            <ul className="list-disc ml-6 text-blue-600">
              {enriched.sources?.map((s: string, i: number) => (
                <li key={i}>
                  <a href={s} target="_blank">{s}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="mt-6">
        <Link href="/companies" className="text-blue-600 underline">
          ← Back to Companies
        </Link>
      </div>
    </div>
  );
}