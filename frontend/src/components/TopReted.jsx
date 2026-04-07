import  { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { useCart } from "../context/CartContext"; 

const TopReted = () => {

  const { addToCart } = useCart();
  
  const [products, setProducts] = useState([]);
 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://fakestoreapi.com/products");
        const data = await response.json();
        setProducts(data);
      } catch (err) {
console.log(err) ;
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
                 key={item.id}
                 className="bg-white rounded-2xl shadow-xl p-4 hover:scale-105 duration-300 cursor-pointer "
               >
                 <img
                   src={item.image}
                   alt={item.title}
                   className="h-45 mx-auto mb-4 object-contain cursor-pointer"
                 />
                 <h2 className="font-semibold text-sm">{item.category}</h2>
                 <p className="text-gray-700 text-sm line-clamp-2">
                   {item.title}
                 </p>
                 <p className="text-gray-600 text-xs mt-2">
                   {item.description.substring(0, 50)}
                 </p>

                 <p className="font-bold mt-2">${item.price}</p>
                 <p className="text-yellow-300 text-sm">
                   <FaStar /> {item.rating.rate}
                 </p>

                 <button
                   onClick={() => addToCart(item)}
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
