import axios, { Axios } from "axios";
import ProductGrid from "./ProductGrid";
import { useState,useEffect } from "react";


const Menwear=()=>{
const [product,setProduct] = useState([]);

useEffect(()=>{

axios
  .get("http://localhost:3000/api/admin/getproducts")

  .then((res) => {
    const mensProduct = res.data.products.filter(
      (product) => product.category === "Mens Wear",
    );

    setProduct(mensProduct);
  })

  .catch((error) => console.log(error));


},[]);

 return (
    <ProductGrid
      title="Mens Wear Collection"
      products={product}
      showSize={true}
      showcolor={true}
      currency="₹"
    />
 );
};

export default Menwear;