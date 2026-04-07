export default function OrderTracking({ status }) {
  const steps = ["Processing", "Shipped", "Delivered"];

  const currentIndex = steps.indexOf(status);

  return (
    <div className="flex items-center justify-between w-full mt-6">
      {steps.map((step, index) => (
        <div key={index} className="flex-1 flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white
${index <= currentIndex ? "bg-green-500" : "bg-gray-300"}`}
          >
            {index +1 }
          </div>

          {index !== steps.length - 1 && (
            <div
              className={`flex-1 h-1
${index < currentIndex ? "bg-green-500" : "bg-gray-300"}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}





