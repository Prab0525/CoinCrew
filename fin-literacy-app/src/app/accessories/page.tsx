"use client";

import { useEffect, useState } from "react";

export default function AccessoriesPage() {
  const [inventory, setInventory] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/user/me")
      .then(res => res.json())
      .then(data => {
        // fallback if data.inventory is undefined
        setInventory(data.inventory ?? []);
      });
  }, []);

  return (
    <main style={{ padding: 24 }}>
      <h1>Your Accessories</h1>

      <div style={{ marginTop: 16 }}>
        {inventory.length === 0 ? (
          <p>No items yet.</p>
        ) : (
          inventory.map(item => (
            <div
              key={item.id}
              style={{
                border: "1px solid #ddd",
                padding: 12,
                borderRadius: "12px",
                marginBottom: 8,
              }}
            >
              {item.name}
            </div>
          ))
        )}
      </div>
    </main>
  );
}
