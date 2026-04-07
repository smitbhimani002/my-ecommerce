import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductGrid from "../components/ProductGrid";


export default function SearchPage() {
  const { query } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchSearch = async () => {
      const res = await axios.get(
        `http://localhost:3000/api/products/search?query=${query}`,
            
      );

      
      setProducts(res.data.products);
  
    };

    fetchSearch();
  }, [query]);

  return (
    <ProductGrid
      title={`Search Results for "${query}"`}
      products={products}
      showSize={true}
      showcolor={true}
    />
  );
}
