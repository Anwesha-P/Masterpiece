import React, { useState } from "react";
import { QuantityPicker } from "react-qty-picker";
import { SearchBar } from "./SearchBar";
import { SearchResultsList } from "./searchResultsList";
import type { Store } from "../types/store";
import "./AuditForm.css";

interface AuditPayload {
  storeid: string;
  sku: string;
  condition: string;
  quantity: number;
}
export const AuditForm: React.FC = () => {
  const [storeResults, setStoreResults] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [sku, setSku] = useState("");
  const [condition, setCondition] = useState("");
  const [quantity, setQuantity] = useState(0);

  const handleStoreSelect = (store: Store) => {
    setSelectedStore(store);
    setStoreResults([]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submit triggered");
    if (!selectedStore || !sku || !condition || quantity <= 0) {
      alert("Fill all fields before submitting.");
      return;
    }
    const payload: AuditPayload = {
      storeid: selectedStore.id,
      sku,
      condition,
      quantity,
    };


    try {
        // 1. Submit the audit
        const auditRes = await fetch("http://localhost:3009/audit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!auditRes.ok) throw new Error("Failed to submit audit");

        alert("Audit submitted!");

        // 2. Fetch threshold for SKU
        const thresholdRes = await fetch(`http://localhost:3009/thresholds/${sku}`);
        if (!thresholdRes.ok) throw new Error("Failed to fetch threshold");

        const thresholdDataArray = await thresholdRes.json();
        const thresholdData = thresholdDataArray[0]
        if (!thresholdData) {
            alert("No threshold data found for this SKU.");
            return;
        }

        if (quantity < thresholdData.threshold) {
            // 3. Create replenishment order
            const replenishmentPayload = {
                storeid: selectedStore.id,
                sku,
                quantityNeeded: thresholdData.threshold - quantity
            };
            console.log(replenishmentPayload)

            const reorderRes = await fetch("http://localhost:3009/replenishment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(replenishmentPayload),
            });

            if (!reorderRes.ok) throw new Error("Replenishment failed");

            alert("Replenishment order created!");
        }
      // Reset if needed
    } catch (error) {
      console.error("Submit failed:", error);
    }
  };

  return (
    <div className="std-container">
      <h3>Masterpiece Merchandising Audit & Replenishment</h3>
      <div>
        <SearchBar setResults={setStoreResults} />
        {storeResults.length > 0 && (
          <SearchResultsList results={storeResults} onSelect={handleStoreSelect} />
        )}
        <div className="inputBox">
          <label>Store:  </label>
          <input
            type="text"
            placeholder="Selected store"
            value={selectedStore?.storename || ""}
            className="valBox"
            readOnly
          />
        </div>
        <div className="inputBox">
          <label>SKU: </label>
          <input
            type="text"
            placeholder="SKU"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            className="valBox"
          />
        </div>
        <div className="inputBox">
          <label>Condition: </label>
          <select  className="valBox" value={condition} onChange={(e) => setCondition(e.target.value)}>
            <option value="">Select condition</option>
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="poor">Poor</option>
          </select>
        </div>
        <div className="inputBox">
        <label>
          Quantity:
        </label>
        <QuantityPicker  className="valBox quantityPicker" min = {0} value={quantity} onChange={(val: number) => setQuantity(val)} />

        </div>
        <div className="inputBox">
          <button className= "submit" onClick={handleSubmit}>Submit Audit</button>
        </div>
      </div>
    </div>
  );
}