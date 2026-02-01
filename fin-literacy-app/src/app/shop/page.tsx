'use client';

import { useState, useEffect } from "react";
import Head from "next/head"; // import Head for <link>
import { useCoins } from "../../context/CoinsContext";

export default function LifeShopPage() {
  const [hydrated, setHydrated] = useState(false);
  const [message, setMessage] = useState("");
  const { coins, setCoins } = useCoins();
  const [purchasedItems, setPurchasedItems] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<"all" | "games" | "toys" | "clothes" | "food" | "bills" | "rent">("all");

  useEffect(() => {
    setHydrated(true);
  }, []);

  const categories = [
    { id: "all", label: "All Items"},
    { id: "games", label: "Games" },
    { id: "toys", label: "Toys" },
    { id: "clothes", label: "Clothes"},
    { id: "food", label: "Food"},
    { id: "bills", label: "Bills"},
    { id: "rent", label: "Rent" },
  ];

  const items = [
    // Games
    { id: "game1", name: "Video Game", category: "games", price: 60, icon: "🎮", color: "#ffffff" },
    { id: "game2", name: "Board Game", category: "games", price: 20, icon: "🎲", color: "#ffffff" },
    { id: "game3", name: "Puzzle", category: "games", price: 15, icon: "🧩", color: "#ffffff" },

    // Toys
    { id: "toy1", name: "Teddy Bear", category: "toys", price: 20, icon: "🧸", color: "#ffffff" },
    { id: "toy2", name: "Action Figure", category: "toys", price: 45, icon: "🤖", color: "#ffffff" },
    { id: "toy3", name: "Toy Car", category: "toys", price: 50, icon: "🚘", color: "#ffffff" },
    { id: "toy4", name: "Basketball", category: "toys", price: 35, icon: "🏀", color: "#ffffff" },

    // Clothes
    { id: "clothes1", name: "T-Shirt", category: "clothes", price: 20, icon: "👕", color: "#ffffff" },
    { id: "clothes2", name: "Jeans", category: "clothes", price: 40, icon: "👖", color: "#ffffff" },
    { id: "clothes3", name: "Sneakers", category: "clothes", price: 100, icon: "👟", color: "#ffffff" },

    // Food
    { id: "food1", name: "Apple", category: "food", price: 2, icon: "🍎", color: "#ffffff" },
    { id: "food2", name: "Pizza", category: "food", price: 30, icon: "🍕", color: "#ffffff" },
    { id: "food3", name: "Burger", category: "food", price: 20, icon: "🍔", color: "#ffffff" },
    { id: "food4", name: "Ice Cream", category: "food", price: 10, icon: "🍨", color: "#ffffff" },

    // Bills
    { id: "bills1", name: "Electricity Bill", category: "bills", price: 100, icon: "💡", color: "#ffffff" },
    { id: "bills2", name: "Water Bill", category: "bills", price: 50, icon: "🚰", color: "#ffffff" },
    { id: "bills3", name: "Internet Bill", category: "bills", price: 80, icon: "📶", color: "#ffffff" },

    // Rent
    { id: "rent1", name: "Monthly Rent", category: "rent", price: 300, icon: "🏠", color: "#ffffff" },
    { id: "rent2", name: "Storage Unit", category: "rent", price: 150, icon: "📦", color: "#ffffff" },
    { id: "rent3", name: "Parking Spot", category: "rent", price: 60, icon: "🅿️", color: "#ffffff" },
  ];

  const filteredItems = selectedCategory === "all"
    ? items
    : items.filter(item => item.category === selectedCategory);

const buyItem = (itemId: string, price: number) => {
  if (coins >= price) {
    setCoins(prev => prev - price);
    setPurchasedItems(prev => {
      const newSet = new Set(prev);
      newSet.add(itemId);
      return newSet;
    });
    setMessage(""); // clear any previous message
  } else {
    setMessage("Not enough coins to buy this item!");//delete
  }
};

  return (
    <>
     <Head>
  <link
    href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap"
    rel="stylesheet"/>
    </Head>

<main
  style={{
    backgroundImage: "url('image1.png')",
    //backgroundColor: "#fbe1f0", 
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
  }}
>
  <div
    style={{
      //backgroundColor: "rgba(255, 240, 245, 0.7)", // semi-transparent overlay
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: 16,
    }}
  >
        {/* NAVBAR */}
        <nav
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "right",
            gap: 20,
            padding: 12,
            marginBottom: 16,
          }}
        >
          {["Dashboard", "Doc", "Quiz", "Shop"].map(page => (
            <a
              key={page}
              href={`/${page.toLowerCase()}`}
              style={{
                color: page === "Shop" ? "#000000" : "#5c5858",
                fontWeight: 700,
                fontSize: 16,
                textDecoration: "none",
                padding: "6px 12px",
                borderRadius: 8,
                //backgroundColor: page === "Shop" ? "#f6b6d6" : "transparent",
                transition: "all 0.2s",
              }}
            >
              {page}
            </a>
          ))}
        </nav>

        {/* HEADER */}
        <header
          style={{
            width: "100%",
            //backgroundColor: "#fbd5f2",
            textAlign: "center",
            borderRadius: 16,
            fontSize: 50,
            fontWeight: 700,
            color: "#000000",
            //boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            marginBottom: 16,
          }}
        >
          Life Shop
        </header>

        {/* Coin Progress Bar */}
        {hydrated && (
        <div style={{ width: "100%", maxWidth: 700, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontWeight: 600, fontSize: 14, color: "#000000" }}>💰 Coins Progress</span>
            <span style={{ fontWeight: 600, fontSize: 14, color: "#000000" }}>{coins} / 1000</span>
          </div>
          <div
            style={{
              width: "100%",
              height: 24,
              backgroundColor: "rgba(163, 204, 218, 0.3)",
              borderRadius: 12,
              overflow: "hidden",
              border: "2px solid #8bacd5",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${Math.min((coins / 1000) * 100, 100)}%`,
                backgroundColor: "#8bacd5",
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>
        )}

{/* Coins display + message */}
{hydrated && (
<div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
  <p style={{ fontWeight: 600, fontSize: 18, color: "#000000", margin: 0 }}>
    💰 Coins: {coins}
  </p>

  {message && (
    <p style={{ fontWeight: 600, fontSize: 18, color: "#000000", margin: 0 }}>
      {message}
    </p>
  )}
</div>
)}

        {/* Category Filter */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16, marginBottom: 16 }}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              style={{
                padding: "6px 12px",
                borderRadius: 12,
                //border: selectedCategory === cat.id ? "2px solid #FFB6C1" : "2px solid #ffffff",
                backgroundColor: selectedCategory === cat.id ? "#f8d8dc" : "#FFB6C1",
                color: "#ffffff",
                cursor: "pointer",
                fontWeight: 600,
                transition: "all 0.2s",
              }}
            >
              <span style={{ marginRight: 6 }}></span>
              {cat.label}
            </button>
          ))}
        </div>


      

        {/* Items Grid */}
        {hydrated && (
        <section style={{ width: "100%", maxWidth: 700 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 16 }}>
            {filteredItems.map(item => {
              const purchased = purchasedItems.has(item.id);
              const affordable = coins >= item.price;

              return (
                <div
                  key={item.id}
                  style={{
                    //border: "2px solid #ffd1dc",
                    //border: "2px solid #fff",
                    borderRadius: 16,
                    padding: 12,
                    textAlign: "center",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    transition: "transform 0.2s",
                    cursor: "pointer",
                    backgroundColor: "rgba(255, 255, 255, 0.3)",                    //backgroundImage: "url('/ombre_background3.avif')", IMPORTANT 
                    //backgroundColor: "#fff5f5",
                    position: "relative",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                >
                  {purchased && (
                    <div
                      style={{
                        position: "absolute",
                        top: -8,
                        right: -8,
                        backgroundColor: "#cfe3bd",
                        color: "#fff",
                        padding: "2px 6px",
                        borderRadius: 12,
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      Purchased 
                    </div>
                  )}

                  <div
                    style={{
                      height: 80,
                      width: 80,
                      margin: "0 auto",
                      backgroundColor: item.color,
                      borderRadius: "50%",
                      marginBottom: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 40,
                    }}
                  >
                    {item.icon}
                  </div>

                  <p style={{ fontWeight: 600, marginBottom: 4 }}>{item.name}</p>
                  <p style={{ fontSize: 14, color: "#555", marginBottom: 8 }}>{item.price} coins</p>

                  {!purchased && (
                    <button
                      onClick={() => buyItem(item.id, item.price)}
                      disabled={!affordable}
                      style={{
                        borderRadius: 20,
                        padding: "3px 18px",
                        border: "none",
                        backgroundColor: "rgba(139, 172, 141, 0.2)",                        //backgroundColor: affordable ? "#f9d3e1" : "#ccc",
                        opacity: "0.3px",
                        color: "white",
                        fontWeight: 600,
                        cursor: affordable ? "pointer" : "not-allowed",
                      }}
                    >
                      {affordable ? "Buy" : "Locked"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>
        )}

        {/* FOOTER */}
        {/* <footer
          style={{
            marginTop: 40,
            padding: 16,
            textAlign: "center",
            width: "100%",
            borderRadius: 16,
            backgroundColor: "#ffb6c1",
            color: "#4b0082",
            fontWeight: 600,
          }}
        >
          © 2026 My Cute Finance App 💖
        </footer> */}
      </div>
</main>
    </>
  );
}
