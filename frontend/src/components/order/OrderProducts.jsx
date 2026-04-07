export default function OrderProducts({ items }) {
  return (
    <div className="mt-6">
      <h2 className="font-bold text-lg mb-4">Products</h2>

      {items.map((item, index) => (
        <div key={index} className="flex justify-between border-b py-3">
          <div className="flex gap-4">
            <img src={item.image} className="w-16 h-16 object-cover rounded" />

            <div>
              <p className="font-semibold">{item.name}</p>

              <p className="text-sm text-gray-500">Size: {item.size}</p>

              <p className="text-sm text-gray-500">Color: {item.color}</p>
            </div>
          </div>
          <div >
            <p>
              {item.quantity} × ${item.price }
            </p>
            <p className="font-bold ">{ item.quantity * item.price}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
