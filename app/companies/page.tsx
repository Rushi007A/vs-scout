"use client";

import { useState, useMemo } from "react";
import companiesData from "../data/companies.json";
import Link from "next/link";

type Company = {
  id: string;
  name: string;
  sector: string;
  stage: string;
  location: string;
  website: string;
};

const PAGE_SIZE = 5;

export default function CompaniesPage() {
  const companies = companiesData as Company[];

  const [search, setSearch] = useState("");
  const [sectorFilter, setSectorFilter] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [sortKey, setSortKey] = useState<keyof Company>("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchName, setSearchName] = useState("");

  const sectors = [...new Set(companies.map((c) => c.sector))];
  const stages = [...new Set(companies.map((c) => c.stage))];

  const filtered = useMemo(() => {
    let result = companies.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) &&
        (sectorFilter ? c.sector === sectorFilter : true) &&
        (stageFilter ? c.stage === stageFilter : true)
    );

    result.sort((a, b) =>
      a[sortKey].toString().localeCompare(b[sortKey].toString())
    );

    return result;
  }, [search, sectorFilter, stageFilter, sortKey]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // ✅ Save Search Function
  const saveSearch = () => {
    if (!searchName.trim()) return;

    const newSearch = {
      id: Date.now().toString(),
      name: searchName,
      search,
      sector: sectorFilter,
      stage: stageFilter,
      sort: sortKey,
    };

    const existing = localStorage.getItem("vc-saved-searches");
    const parsed = existing ? JSON.parse(existing) : [];

    const updated = [...parsed, newSearch];

    localStorage.setItem("vc-saved-searches", JSON.stringify(updated));

    setSearchName("");
    alert("Search saved!");
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Companies</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search..."
          className="p-3 border rounded"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />

        <select
          className="p-3 border rounded"
          value={sectorFilter}
          onChange={(e) => {
            setSectorFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All Sectors</option>
          {sectors.map((sector) => (
            <option key={sector}>{sector}</option>
          ))}
        </select>

        <select
          className="p-3 border rounded"
          value={stageFilter}
          onChange={(e) => {
            setStageFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All Stages</option>
          {stages.map((stage) => (
            <option key={stage}>{stage}</option>
          ))}
        </select>

        <select
          className="p-3 border rounded"
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as keyof Company)}
        >
          <option value="name">Sort by Name</option>
          <option value="sector">Sort by Sector</option>
          <option value="stage">Sort by Stage</option>
          <option value="location">Sort by Location</option>
        </select>
      </div>

      {/* ✅ Save Search Section */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Save search name..."
          className="p-2 border rounded"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
       <button
  onClick={saveSearch}
  style={{ backgroundColor: "#16a34a", color: "white" }}
  className="px-4 py-2 rounded"
>
  Save Search
</button>
      </div>

      {/* Table */}
      <table className="w-full border-collapse bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3">Name</th>
            <th className="p-3">Sector</th>
            <th className="p-3">Stage</th>
            <th className="p-3">Location</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((company) => (
            <tr key={company.id} className="border-t hover:bg-gray-50">
              <td className="p-3 text-blue-600 hover:underline">
                <Link href={`/companies/${company.id}`}>
                  {company.name}
                </Link>
              </td>
              <td className="p-3">{company.sector}</td>
              <td className="p-3">{company.stage}</td>
              <td className="p-3">{company.location}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded border ${
              currentPage === i + 1
                ? "bg-blue-600 text-white"
                : "bg-white"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}