import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon, TrashIcon, SaveIcon } from "lucide-react";

// ✅ Custom Edit Icon (Your SVG)
const EditSquareIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path>
  </svg>
);

type FundingType = "grants" | "corporateSponsorship" | "governmentFunding";

interface FundingItem {
  id: string;
  title: string;
  description: string;
  value?: string;
  year?: string;
  status?: string;
}

export function ResearchFunding() {
  const navigate = useNavigate();

  const TABS: Record<FundingType, string> = {
    grants: "Research Grants",
    corporateSponsorship: "Corporate Sponsorships",
    governmentFunding: "Government Funding",
  };

  const [activeTab, setActiveTab] = useState<FundingType>("grants");
  const [funding, setFunding] = useState<Record<FundingType, FundingItem[]>>({
    grants: [],
    corporateSponsorship: [],
    governmentFunding: [],
  });

  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    value: "",
    year: new Date().getFullYear().toString(),
  });

  const [editItem, setEditItem] = useState<FundingItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchItems();
  }, [activeTab]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://180.235.121.250:8006/api/research/${activeTab}`
      );
      const data = await res.json();
      setFunding((prev) => ({ ...prev, [activeTab]: data }));
    } catch {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newFundingItem = {
      ...newItem,
      id: Date.now().toString(),
      status: "active",
    };

    await fetch(`http://180.235.121.250:8006/api/research/${activeTab}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newFundingItem),
    });

    fetchItems();

    setNewItem({
      title: "",
      description: "",
      value: "",
      year: new Date().getFullYear().toString(),
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete?")) return;

    await fetch(
      `http://180.235.121.250:8006/api/research/${activeTab}/${id}`,
      { method: "DELETE" }
    );

    fetchItems();
  };

  const handleUpdate = async () => {
    if (!editItem) return;

    await fetch(
      `http://180.235.121.250:8006/api/research/${activeTab}/${editItem.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editItem),
      }
    );

    setEditItem(null);
    fetchItems();
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <header className="bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <button
            onClick={() => navigate("/research")}
            className="flex items-center gap-2 text-white hover:text-green-100 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Research Data
          </button>
          <h1 className="text-3xl font-bold text-white mt-6">
            Research Funding Data
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          {Object.entries(TABS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as FundingType)}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === key
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-green-500"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Add New */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Add New {TABS[activeTab]}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              className="w-full p-2 border rounded"
              placeholder="Title"
              value={newItem.title}
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
              required
            />

            <textarea
              className="w-full p-2 border rounded"
              placeholder="Description"
              value={newItem.description}
              onChange={(e) =>
                setNewItem({ ...newItem, description: e.target.value })
              }
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                className="w-full p-2 border rounded"
                placeholder="Value"
                value={newItem.value}
                onChange={(e) =>
                  setNewItem({ ...newItem, value: e.target.value })
                }
              />
              <input
                className="w-full p-2 border rounded"
                placeholder="Year"
                value={newItem.year}
                onChange={(e) =>
                  setNewItem({ ...newItem, year: e.target.value })
                }
              />
            </div>

            <button className="px-4 py-2 bg-green-600 text-white rounded">
              Add Item
            </button>
          </form>
        </section>

        {/* View Items */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {TABS[activeTab]}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {funding[activeTab].map((item) => (
              <div key={item.id} className="bg-white rounded shadow">
                <div className="bg-green-600 px-4 py-3 flex justify-between gap-4">
                  {editItem?.id === item.id ? (
                    <input
                      className="w-full p-1 rounded"
                      value={editItem.title}
                      onChange={(e) =>
                        setEditItem({ ...editItem, title: e.target.value })
                      }
                    />
                  ) : (
                    <h3 className="text-lg text-white">{item.title}</h3>
                  )}

                  {editItem?.id === item.id ? (
                    <button onClick={handleUpdate}>
                      <SaveIcon className="w-5 h-5 text-white" />
                    </button>
                  ) : (
                    <button onClick={() => setEditItem(item)}>
                      <EditSquareIcon />
                    </button>
                  )}
                </div>

                <div className="p-4">
                  {editItem?.id === item.id ? (
                    <textarea
                      className="w-full p-2 border rounded"
                      value={editItem.description}
                      onChange={(e) =>
                        setEditItem({
                          ...editItem,
                          description: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <p className="text-gray-700">{item.description}</p>
                  )}

                  <div className="flex justify-between pt-3 text-sm">
                    {item.value && <span>₹{item.value}</span>}

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
