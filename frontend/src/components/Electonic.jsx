import ProductGrid from "./ProductGrid";

import axios from "axios";

import { useState, useEffect } from "react";

const Menwear = () => {
  const [product, setProduct] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/api/admin/getproducts`)

      .then((res) => {
        const ElectronicProduct = res.data.products.filter(
          (product) => product.category === "Electronics",
        );

        setProduct(ElectronicProduct);
      })

      .catch((error) => console.log(error));
  }, []);

  return (
    <ProductGrid
      title="Electronic Collection"
      products={product}
      currency="₹"
    />
  );
};

export default Menwear;
