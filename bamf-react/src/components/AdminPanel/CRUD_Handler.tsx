// ============================================
// File: components/admin/CRUDComponent.tsx
// ============================================
"use client";
import { useEffect, useState } from 'react';
import { Trash2, Edit, Plus, Search, X } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import FullScreenPopup from '../Popups/FullScreenPopup';

// Type for any data item
type DataItem = Record<string, any> & { id: number };

const changeUrlBasedOnInput = (input: string): string => {
    switch (input) {
        case 'Admins':
            return '/api/admins';
        case 'Users':
            return '/api/users';
        case 'Reviews':
            return '/api/reviews';
        case 'Orders':
            return '/api/orders';
        case 'Products':
            return '/api/products';
        case 'ProductCategories':
            return '/api/product-categories';
        case 'Categories':
            return '/api/categories';
        case 'Inventory':
            return '/api/inventory';
        case 'Variants':
            return '/api/variants';
        default:
            return '/api/unknown';
    }
};

const tryRealData = async (type: string): Promise<DataItem[]> => {
    try {
        const url = changeUrlBasedOnInput(type);
        const response = await apiClient.get<DataItem[]>(url);
        console.log(`Fetched real data for ${type}:`, response);
        return response?.data ?? [];
    } catch (err) {
        console.error(`Error fetching ${type}:`, err);
        return [];
    }
};


// Dummy data generators (temporarily here, move to API later)
const generateDummyData = (type: string): DataItem[] => {
    switch (type) {
        case 'Admins':
            return [
                { id: 1, name: 'John Doe', email: 'john@admin.com', role: 'Super Admin', createdAt: '2024-01-15' },
                { id: 2, name: 'Jane Smith', email: 'jane@admin.com', role: 'Admin', createdAt: '2024-02-20' },
                { id: 3, name: 'Mike Johnson', email: 'mike@admin.com', role: 'Admin', createdAt: '2024-03-10' },
            ];
        case 'Users':
            return [
                { id: 1, name: 'Alice Brown', email: 'alice@user.com', status: 'Active', joinedAt: '2024-01-05' },
                { id: 2, name: 'Bob Wilson', email: 'bob@user.com', status: 'Active', joinedAt: '2024-02-15' },
                { id: 3, name: 'Charlie Davis', email: 'charlie@user.com', status: 'Inactive', joinedAt: '2024-03-20' },
                { id: 4, name: 'Diana Moore', email: 'diana@user.com', status: 'Active', joinedAt: '2024-04-01' },
            ];
        case 'Reviews':
            return [
                { id: 1, product: 'Wireless Headphones', user: 'Alice Brown', rating: 5, comment: 'Excellent product!', date: '2024-05-10' },
                { id: 2, product: 'Smart Watch', user: 'Bob Wilson', rating: 4, comment: 'Good quality', date: '2024-05-15' },
                { id: 3, product: 'Laptop Stand', user: 'Charlie Davis', rating: 3, comment: 'Average', date: '2024-05-20' },
            ];
        case 'Orders':
            return [
                { id: 1001, customer: 'Alice Brown', total: '$299.99', status: 'Delivered', date: '2024-05-01' },
                { id: 1002, customer: 'Bob Wilson', total: '$149.50', status: 'Shipped', date: '2024-05-15' },
                { id: 1003, customer: 'Charlie Davis', total: '$89.99', status: 'Processing', date: '2024-05-20' },
                { id: 1004, customer: 'Diana Moore', total: '$199.99', status: 'Pending', date: '2024-05-22' },
            ];
        case 'Products':
            return [
                { id: 1, name: 'Wireless Headphones', category: 'Electronics', price: '$149.99', stock: 45 },
                { id: 2, name: 'Smart Watch', category: 'Electronics', price: '$299.99', stock: 23 },
                { id: 3, name: 'Laptop Stand', category: 'Accessories', price: '$49.99', stock: 78 },
                { id: 4, name: 'USB-C Cable', category: 'Accessories', price: '$19.99', stock: 120 },
            ];
        case 'ProductCategories':
            return [
                { id: 1, name: 'Electronics', productCount: 45, description: 'Electronic devices and gadgets' },
                { id: 2, name: 'Accessories', productCount: 78, description: 'Product accessories and add-ons' },
                { id: 3, name: 'Clothing', productCount: 23, description: 'Apparel and fashion items' },
            ];
        case 'Categories':
            return [
                { id: 1, name: 'Main Category', slug: 'main-category', isActive: true },
                { id: 2, name: 'Secondary Category', slug: 'secondary-category', isActive: true },
                { id: 3, name: 'Archive Category', slug: 'archive-category', isActive: false },
            ];
        case 'Inventory':
            return [
                { id: 1, product: 'Wireless Headphones', warehouse: 'Warehouse A', quantity: 150, lastUpdated: '2024-05-20' },
                { id: 2, product: 'Smart Watch', warehouse: 'Warehouse B', quantity: 85, lastUpdated: '2024-05-18' },
                { id: 3, product: 'Laptop Stand', warehouse: 'Warehouse A', quantity: 200, lastUpdated: '2024-05-15' },
            ];
        case 'Variants':
            return [
                { id: 1, product: 'Wireless Headphones', variant: 'Black', sku: 'WH-BLK-001', price: '$149.99' },
                { id: 2, product: 'Wireless Headphones', variant: 'White', sku: 'WH-WHT-001', price: '$149.99' },
                { id: 3, product: 'Smart Watch', variant: 'Silver 42mm', sku: 'SW-SLV-42', price: '$299.99' },
                { id: 4, product: 'Smart Watch', variant: 'Gold 46mm', sku: 'SW-GLD-46', price: '$349.99' },
            ];
        default:
            return [];
    }
};

interface CRUDComponentProps {
    section: string;
}

function CRUDComponent({ section }: CRUDComponentProps) {
    const [data, setData] = useState<DataItem[]>(generateDummyData(section));
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<DataItem | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        tryRealData(section).then(fetchedData => {
            if (fetchedData.length > 0) {
                setData(fetchedData);
            }
        });
    }, [section]);

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setData(generateDummyData(section));
            setIsLoading(false);
        }, 1200); // simulate ~1.2s loading time
        return () => clearTimeout(timer);
    }, [section]);

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this item?')) {
            setData(data.filter(item => item.id !== id));
        }
    };

    const handleEdit = (item: any) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleSave = () => {
        setIsModalOpen(false);
        setEditingItem(null);
        // In a real app, you'd save to backend here
    };

    const filteredData = data.filter(item =>
        Object.values(item).some(val =>
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const getColumns = () => {
        if (data.length === 0) return [];
        return Object.keys(data[0]).filter(key => key !== 'id');
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-white">
                <div className="h-12 w-12 border-4 border-[#4a3a3a] border-t-transparent rounded-full animate-spin mb-4"></div>
                <p>Loading {section}...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="relative flex-1 max-w-md w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5a4a4a] focus:border-transparent transition"
                    />
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#4a3a3a] hover:bg-[#5a4a4a] text-white rounded-lg transition font-medium shadow-lg"
                >
                    <Plus className="w-5 h-5" />
                    Add New
                </button>
            </div>

            {/* Table */}
            <div className="bg-[#2a2a2a] rounded-xl shadow-2xl overflow-hidden border border-[#3a3a3a]">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-[#3a3a3a] border-b border-[#4a4a4a]">
                                {getColumns().map(column => (
                                    <th key={column} className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                        {column.replace(/([A-Z])/g, ' $1').trim()}
                                    </th>
                                ))}
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#3a3a3a]">
                            {filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan={getColumns().length + 1} className="px-6 py-12 text-center text-gray-400">
                                        No data found
                                    </td>
                                </tr>
                            ) : (
                                filteredData.map((item) => (
                                    <tr key={item.id} className="hover:bg-[#333333] transition">
                                        {getColumns().map(column => (
                                            <td key={column} className="px-6 py-4 text-sm text-gray-300">
                                                {typeof item[column] === 'boolean'
                                                    ? (item[column] ? 'Yes' : 'No')
                                                    : item[column]}
                                            </td>
                                        ))}
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex gap-2 justify-end">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Stats */}
            <div className="flex gap-4 text-sm text-gray-400">
                <span>Total: {data.length} items</span>
                <span>Showing: {filteredData.length} items</span>
            </div>

            {/* Modal */}
            <FullScreenPopup
                onClose={() => setIsModalOpen(false)}
                open={isModalOpen}
                childSize={{
                    width: "w-[90vw] sm:w-[35rem]",
                    height: "h-fit",
                }}
            >
                <div className="bg-[#2a2a2a] rounded-xl shadow-2xl border border-[#3a3a3a] w-full h-full flex flex-col">
                    <div className="flex justify-between items-center p-6 border-b border-[#3a3a3a]">
                        <h3 className="text-xl font-bold text-white">
                            {editingItem ? "Edit Item" : "Add New Item"}
                        </h3>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="text-gray-400 hover:text-white transition"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="p-6 space-y-4">
                        {getColumns().map((column) => (
                            <div key={column}>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    {column.replace(/([A-Z])/g, " $1").trim()}
                                </label>
                                <input
                                    type="text"
                                    defaultValue={editingItem ? editingItem[column] : ""}
                                    className="w-full px-4 py-2 bg-[#1f1f1f] border border-[#3a3a3a] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#5a4a4a] transition"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-3 p-6 border-t border-[#3a3a3a]">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1 px-4 py-2 bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white rounded-lg transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex-1 px-4 py-2 bg-[#4a3a3a] hover:bg-[#5a4a4a] text-white rounded-lg transition font-medium"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </FullScreenPopup>
        </div>
    );
}

export default CRUDComponent;