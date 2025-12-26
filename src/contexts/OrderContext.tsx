import { createContext, useContext, useState, ReactNode } from 'react';
import { orderAPI } from '../services/api';
import { smartContract } from '../services/blockchain';

interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: any[];
  total: number;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: any;
  paymentMethod: string;
  createdAt: string;
  sdcCode?: string;
}

interface OrderContextType {
  orders: Order[];
  currentOrder: Order | null;
  createOrder: (orderData: any) => Promise<Order>;
  getOrder: (orderId: string) => Promise<Order>;
  getUserOrders: (userId: string) => Promise<Order[]>;
  updateOrderStatus: (orderId: string, status: string) => Promise<void>;
  generateSDC: (orderId: string) => Promise<string>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const createOrder = async (orderData: any) => {
    const response = await orderAPI.create(orderData);
    const newOrder = response.data;
    setOrders(prev => [...prev, newOrder]);
    setCurrentOrder(newOrder);
    return newOrder;
  };

  const getOrder = async (orderId: string) => {
    const response = await orderAPI.getById(orderId);
    return response.data;
  };

  const getUserOrders = async (userId: string) => {
    const response = await orderAPI.getUserOrders(userId);
    setOrders(response.data);
    return response.data;
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    const response = await orderAPI.updateStatus(orderId, status);
    const updatedOrder = response.data;
    
    setOrders(prev => prev.map(order => 
      order.id === orderId ? updatedOrder : order
    ));

    if (currentOrder?.id === orderId) {
      setCurrentOrder(updatedOrder);
    }
  };

  const generateSDC = async (orderId: string) => {
    const order = await getOrder(orderId);
    
    if (order.status !== 'delivered') {
      throw new Error('Order must be delivered before SDC generation');
    }

    // Register SDC on blockchain
    const sdcCode = order.sdcCode || `SDC-BUY-2024-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`;
    
    await smartContract.registerSDC(sdcCode, {
      orderId: order.id,
      userId: order.userId,
      productId: order.items[0]?.productId // Simplified for demo
    });

    // Update order with SDC
    await updateOrderStatus(orderId, 'delivered');
    
    return sdcCode;
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        currentOrder,
        createOrder,
        getOrder,
        getUserOrders,
        updateOrderStatus,
        generateSDC
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}
