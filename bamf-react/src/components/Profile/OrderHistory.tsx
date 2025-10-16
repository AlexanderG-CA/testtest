import { Package, ChevronRight } from "lucide-react";

const OrderHistory = ({ orders }: { orders: any[] }) => (
  <div className="rounded-xl p-10 bg-[#2B2B2B] border border-[#3a3a3a]">
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <Package className="w-7 h-7 text-gray-300" strokeWidth={2.5} />
        <h2 className="text-3xl font-bold text-white tracking-tight">
          Order History
        </h2>
      </div>
      <button className="text-gray-400 hover:text-white transition-all flex items-center gap-2 font-semibold hover:scale-105 active:scale-95">
        View All
        <ChevronRight size={20} strokeWidth={2.5} />
      </button>
    </div>
    <div className="overflow-x-auto -mx-10 px-10">
      <div className="flex gap-5 pb-4 min-w-max">
        {orders.map((order) => (
          <div
            key={order.id}
            className="rounded-xl p-5 cursor-pointer bg-[#362222] hover:scale-105 hover:shadow-xl transition-all min-w-[280px] max-w-[280px] border border-[#4a3535]"
          >
            <img
              src={order.image}
              alt={order.id}
              className="w-full h-40 object-cover rounded-lg mb-4"
            />
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white font-bold text-lg">{order.id}</p>
                  <p className="text-gray-400 text-sm font-medium">
                    {order.date}
                  </p>
                </div>
                <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#2d4a2a] text-[#a0d995] uppercase tracking-wide">
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t-2 border-[#423F3E]">
                <span className="text-gray-400 text-sm font-medium">
                  {order.items} items
                </span>
                <span className="text-white font-bold text-lg">
                  ${order.total}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default OrderHistory;
