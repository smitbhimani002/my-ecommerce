import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductGrid from "../components/ProductGrid";

export default function CategoryPage() {
  const { name } = useParams();
  const encodedname = encodeURIComponent(name);

  const [products, setProducts] = useState([]);
  const [lastId, setLastId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchInitial = async () => {
      setProducts([]);
      setLastId(null);
      setHasMore(true);
      setLoading(true);

      const res = await axios.get(
        `process.env.BASE_URL/api/products/category/${encodedname}`,
      );

      const data = res.data.products;

      setProducts(data);

      if (data.length > 0) {
        setLastId(data[data.length - 1]._id);
      } else {
        setHasMore(false);
      }

      setLoading(false);
    };

    fetchInitial();
  }, [name]);

  //  Scroll
  const fetchProduct = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    const res = await axios.get(
      `process.env.BASE_URL/api/products/category/${encodedname}?lastId=${lastId || ""}`,
    );

    const newProducts = res.data.products;

    if (newProducts.length === 0) {
      setHasMore(false);
    } else {
      setProducts((prev) => [...prev, ...newProducts]);

      setLastId(newProducts[newProducts.length - 1]._id);
    }

    setLoading(false);
  };

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      const bottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 100;

      if (bottom && !loading && hasMore) {
        fetchProduct();
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastId, loading, hasMore]);

  return (
    <div>
      <ProductGrid
        title={`${name} Collection`}
        products={products}
        showSize={name === "Mens Wear" || name === "Kids Wear"}
        showcolor={name === "Mens Wear" || name === "Kids Wear"}
      />

      {loading && hasMore && (
        <p className="text-center mt-4">Loading more products...</p>
      )}

      {!hasMore && (
        <p className="text-center mt-4 text-gray-500">No more products</p>
      )}
    </div>
  );
}
