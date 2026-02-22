"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewCompanyPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    sector: "",
    stage: "",
    location: "",
    website: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/companies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (response.ok) {
      alert("Company Added Successfully!");
      router.push("/companies");
    } else {
      alert("Error adding company");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add New Company</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input
          name="name"
          placeholder="Company Name"
          className="w-full p-3 border rounded"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="sector"
          placeholder="Sector"
          className="w-full p-3 border rounded"
          value={form.sector}
          onChange={handleChange}
          required
        />

        <input
          name="stage"
          placeholder="Stage"
          className="w-full p-3 border rounded"
          value={form.stage}
          onChange={handleChange}
          required
        />

        <input
          name="location"
          placeholder="Location"
          className="w-full p-3 border rounded"
          value={form.location}
          onChange={handleChange}
          required
        />

        <input
          name="location"
          placeholder="Location"
          className="w-full p-3 border rounded"
          value={form.location}
          onChange={handleChange}
          required
        />

        <input
          name="website"
          placeholder="Website"
          className="w-full p-3 border rounded"
          value={form.website}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Add Company
        </button>
      </form>
    </div>
  );
}