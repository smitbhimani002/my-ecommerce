import ProductGrid from "./ProductGrid";

import axios from "axios";

import { useState, useEffect } from "react";

const Menwear = () => {
  const [product, setProduct] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/admin/getproducts")

      .then((res) => {
        const kidsProduct = res.data.products.filter(
          (product) => product.category === "Kids Wear",
        );

        setProduct(kidsProduct);
      })

      .catch((error) => console.log(error));
    
  }, []);

  return (
    <ProductGrid
      title="kidws Wear Collection"
      products={product}
      showSize={true}
      showcolor={true}
      currency="₹"
    />
  );
};

export default Menwear;
