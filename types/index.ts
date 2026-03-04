/**
 * Follicia — Global TypeScript Interfaces
 * Shared types used across the entire application.
 */

// ─── User ─────────────────────────────────────────────────
export interface User {
    id: string;
    clerkId: string;
    email: string;
    name?: string | null;
    imageUrl?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

// ─── Product ──────────────────────────────────────────────
export interface Product {
    id: string;
    name: string;
    description?: string | null;
    price: number;
    imageUrl?: string | null;
    category?: string | null;
    stock: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// ─── Order ────────────────────────────────────────────────
export type OrderStatus =
    | "PENDING"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";

export interface OrderItem {
    id: string;
    orderId: string;
    productId: string;
    product: Product;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    userId: string;
    user: User;
    status: OrderStatus;
    totalAmount: number;
    stripePaymentIntentId?: string | null;
    items: OrderItem[];
    createdAt: Date;
    updatedAt: Date;
}

// ─── API Responses ────────────────────────────────────────
export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

// ─── Cart ─────────────────────────────────────────────────
export interface CartItem {
    product: Product;
    quantity: number;
}
