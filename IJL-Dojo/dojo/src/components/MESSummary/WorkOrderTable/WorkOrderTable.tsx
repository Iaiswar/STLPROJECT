import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface WorkOrder {
  id: string;
  product: string;
  workOrderQuantity: number;
  scheduledQuantity: number;
  actualQuantity: number;
  remainingQuantity: number;
  dueDate: string;
  closed: boolean;
  closedDate?: string;
}

export default function WorkOrderTableDemo() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([
    {
      id: 'WO-061',
      product: 'FG001',
      workOrderQuantity: 150000,
      scheduledQuantity: 258250,
      actualQuantity: 1357,
      remainingQuantity: 148643,
      dueDate: 'May 7, 2021 20:00',
      closed: false,
    },
    {
      id: 'WO-062',
      product: 'FG001',
      workOrderQuantity: 150000,
      scheduledQuantity: 213256.96,
      actualQuantity: 687,
      remainingQuantity: 149313,
      dueDate: 'May 31, 2021 20:00',
      closed: false,
    },
    {
      id: 'WO-063',
      product: 'FG001',
      workOrderQuantity: 150000,
      scheduledQuantity: 68150,
      actualQuantity: 323,
      remainingQuantity: 149677,
      dueDate: 'Dec 23, 2021 8:00',
      closed: false,
    },
    {
      id: 'WO-064',
      product: 'HF001',
      workOrderQuantity: 25000,
      scheduledQuantity: 1000,
      actualQuantity: 0,
      remainingQuantity: 25000,
      dueDate: 'Jul 11, 2021 9:00',
      closed: false,
    },
    {
      id: 'WO-065',
      product: 'FG001',
      workOrderQuantity: 25000,
      scheduledQuantity: 6250,
      actualQuantity: 21,
      remainingQuantity: 24979,
      dueDate: 'Aug 12, 2021 14:00',
      closed: true,
    },
    {
      id: 'WO-066',
      product: 'FG001',
      workOrderQuantity: 25000,
      scheduledQuantity: 2500,
      actualQuantity: 2,
      remainingQuantity: 24998,
      dueDate: 'Jun 25, 2021 9:00',
      closed: false,
    },
    {
      id: 'WO-068',
      product: 'FG001',
      workOrderQuantity: 222000,
      scheduledQuantity: 0,
      actualQuantity: 0,
      remainingQuantity: 222000,
      dueDate: 'Jul 4, 2021 2:00',
      closed: false,
    },
  ]);

  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});

  const handleRowClick = (workOrder: WorkOrder) => {
    // Toggle selection
    setSelectedRows(prev => ({
      ...prev,
      [workOrder.id]: !prev[workOrder.id]
    }));
  };

  const formatNumber = (num: number) => {
    return num % 1 !== 0 
      ? num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : num.toLocaleString();
  };

  const navigate = useNavigate();
  const handleViewMore = () => navigate('/more-details');

  

  return (
    <div className="w-full h-72 bg-white border border-gray-200 shadow rounded p-3 flex flex-col">
     <div className="flex justify-between items-center mb-2">
        <h2 className="text-sm font-bold">Work Orders</h2>
        <button
          onClick={handleViewMore}
          className="text-blue-600 hover:underline text-sm"
        >
          View More →
        </button>
      </div>
      <div className="overflow-auto border border-gray-200 rounded-md shadow-sm">
        <table className="w-full bg-white text-xs">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="py-1 px-2 text-left">Work Order</th>
              <th className="py-1 px-2 text-left">Product</th>
              <th className="py-1 px-2 text-right">WO Qty</th>
              <th className="py-1 px-2 text-right">Schd Qty</th>
              <th className="py-1 px-2 text-right">Act Qty</th>
              <th className="py-1 px-2 text-right">Rem Qty</th>
              <th className="py-1 px-2 text-left">Due Date</th>
              <th className="py-1 px-1 text-center">Closed</th>
            </tr>
          </thead>
          <tbody className="text-xs">
            {workOrders.map((order, index) => (
              <tr 
                key={order.id}
                className={`
                  ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} 
                  ${selectedRows[order.id] ? 'bg-blue-100' : ''} 
                  ${order.id === 'WO-065' ? 'bg-blue-900 text-white' : ''}
                 
                `}
                onClick={() => handleRowClick(order)}
              >
                <td className="py-1 px-2 whitespace-nowrap">{order.id}</td>
                <td className="py-1 px-2 whitespace-nowrap">{order.product}</td>
                <td className="py-1 px-2 text-right whitespace-nowrap">{formatNumber(order.workOrderQuantity)}</td>
                <td className="py-1 px-2 text-right whitespace-nowrap">{formatNumber(order.scheduledQuantity)}</td>
                <td className="py-1 px-2 text-right whitespace-nowrap">{formatNumber(order.actualQuantity)}</td>
                <td className="py-1 px-2 text-right whitespace-nowrap">{formatNumber(order.remainingQuantity)}</td>
                <td className="py-1 px-2 whitespace-nowrap">{order.dueDate}</td>
                <td className="py-1 px-1 text-center">
                  <input
                    type="checkbox"
                    checked={order.closed}
                    onChange={(e) => {
                      e.stopPropagation();
                      const updatedOrders = workOrders.map(wo => 
                        wo.id === order.id ? { ...wo, closed: e.target.checked } : wo
                      );
                      setWorkOrders(updatedOrders);
                    }}
                    className="form-checkbox h-3 w-3"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}