import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import axios from "axios";

const TopReted = () => {
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/admin/getproducts?limit=8`,
        );
        setProducts(response.data.products);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProducts();
  }, []);

   return (
     <>
       <div>
         <div className="p-14">
           <h1 className="text-3xl font-bold text-center mb-10">
             Top Reted Product
           </h1>

           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
             {products.map((item) => (
               <div
                 key={item._id}
                 className="bg-white rounded-2xl shadow-xl p-4 hover:scale-105 duration-300 cursor-pointer "
               >
                 <img
                   src={item.image}
                   alt={item.name}
                   className="h-45 mx-auto mb-4 object-contain cursor-pointer"
                 />
                 <h2 className="font-semibold text-sm">{item.category}</h2>
                 <p className="text-gray-700 text-sm line-clamp-2">
                   {item.name}
                 </p>
                 <p className="text-gray-600 text-xs mt-2">
                   {item.description.substring(0, 50)}
                 </p>

                 <p className="font-bold mt-2">₹{item.price}</p>

                 <button
                   onClick={() =>
                     addToCart({
                       _id: item._id,
                       name: item.name,
                       price: item.price,
                       image: item.image,
                       size: null,
                       color: null,
                     })
                   }
                   className="mt-2 bg-orange-500 text-white px-3 py-2 rounded-2xl w-full hover:bg-orange-600 transition"
                 >
                   Add to cart
                 </button>
               </div>
             ))}
           </div>
         </div>
       </div>

       
     </>
   );
};

export default TopReted;
