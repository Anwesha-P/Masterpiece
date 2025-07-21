// src/components/AuditHistory.tsx

import React, { useEffect, useState } from "react";
import type { Store } from "../types/store";
import type { AuditRecord } from "../types/audit";
import { SearchBar } from "./SearchBar";
import { SearchResultsList } from "./searchResultsList";
import "./AuditHistory.css";

export const AuditHistory: React.FC = () => {
  const [storeResults, setStoreResults] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [records, setRecords] = useState<AuditRecord[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch audit history when a store is selected
  useEffect(() => {
    if (!selectedStore) return;

    setLoading(true);
    fetch(`http://localhost:3009/audit/${selectedStore.id}`)
      .then((res) => res.json())
      .then((data: AuditRecord[]) => setRecords(data))
      .catch((err) => {
        console.error("Failed to fetch audit history", err);
        setRecords([]);
      })
      .finally(() => setLoading(false));
  }, [selectedStore]);

  return (
    <div>
      <h3>Audit History</h3>

      {/* Store Search Section */}
      <SearchBar setResults={setStoreResults} />
      {storeResults.length > 0 && (
        <SearchResultsList
          results={storeResults}
          onSelect={(store) => {
            setSelectedStore(store);
            setStoreResults([]);
          }}
        />
      )}

      {/* Show results */}
      {selectedStore && (
        <>
          <h4>Audit History for {selectedStore.storename}</h4>
          {loading ? (
            <p>Loading audit history...</p>
          ) : records.length === 0 ? (
            <p>No audit history for this store.</p>
          ) : (
            <table className="audit-table">
              <thead>
                <tr>
                  <th >SKU</th>
                  <th >Quantity</th>
                  <th >Condition</th>
                  <th >Date</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id}>
                    <td>{record.sku}</td>
                    <td>{record.quantity}</td>
                    <td>{record.condition}</td>
                    <td>
                      {new Date(record.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          )}
        </>
      )}
    </div>
  );
};
