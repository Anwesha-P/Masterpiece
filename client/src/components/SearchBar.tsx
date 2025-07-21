import React, { useState } from 'react'
import {FaSearch} from "react-icons/fa"
import type { Store } from "../types/store";
import './SearchBar.css'
interface SearchBarProps {
  setResults: React.Dispatch<React.SetStateAction<Store[]>>;
}
export const SearchBar: React.FC<SearchBarProps>  = ({setResults}) => {
    const [store, setStore] = useState<string>("");
    
    const fetchData = (value: string): void => {
        console.log(store)
        fetch("http://localhost:3009/stores")
            .then((response)=> response.json()) 
            .then((json: Store[])=>{
                const results = json.filter((store) => {
                    return(
                        store &&
                        store.storename && 
                        store.storename.toLowerCase().includes(value)
                    );
                });
                setResults(results);
            })
            .catch((err)=>{
            console.error("Failed to fetch stores:", err);
            });
    }
    const handleChange = (value: string): void => {
    setStore(value);
    if (value.length !== 0){
      fetchData(value);
    }
    else {
      setResults([]);
    }
    };

    return (
        <div className='input-wrapper'>
          <FaSearch id="search-icon"/>
          <input
            className='input'
            value={store}
            onChange={(e) => handleChange(e.target.value)}
            placeholder='Search by Store Name or ID'
          />
          </div>
    )
}