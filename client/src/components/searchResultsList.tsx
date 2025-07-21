import React from "react";
import "./SearchResultsList.css";
import type { Store } from "../types/store";
import { SearchResult } from "./SearchResult";

interface Props {
  results: Store[];
  onSelect: (store: Store) => void;
}

export const SearchResultsList: React.FC<Props> = ({ results, onSelect }) => {
  return (
    <div className="results-list">
      {results.map((store) => (
        <SearchResult 
          key={store.id} 
          result={store} 
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};
