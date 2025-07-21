import type { Store } from '../types/store';
import './SearchResult.css'

interface SearchResultProps {
  result: Store;
  onSelect: (store: Store) => void;

}

export const SearchResult: React.FC<SearchResultProps> = ({ result, onSelect }) => {
  const handleClick = () => {
    onSelect(result);
  };

  return (
    <div 
      className='search-result' 
      onClick={handleClick}
    >
      {result.storename} - {result.address}
    </div>
  );
};
