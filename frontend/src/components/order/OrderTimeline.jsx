import dayjs from "dayjs";

export default function OrderTimeline({ timeline }) {
  return (
    <div className="mt-6">
      <h2 className="font-bold text-lg mb-3">Order Timeline</h2>

      {timeline.map((item, index) => (
        <div key={index} className="flex justify-between border-b py-2">
          <span>{item.status}</span>

          <span className="text-gray-500 text-sm">
            {dayjs(item.date).format("DD/MMM/YYYY")}
          </span>
        </div>
      ))}
    </div>
  );
}
