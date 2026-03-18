import { supabase } from './supabase';
import type { Client, Product, Order, OrderItem, HeroBanner, FeaturedPanel } from '../types';

export const api = {
  async signUpClient(email: string, password: string, name: string, phone: string) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    if (data.user) {
        await supabase.from('clients').insert([{ auth_id: data.user.id, name, email, phone }]);
    }
    return data;
  },
  async signInClient(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },
  async signOutClient() {
    await supabase.auth.signOut();
  },
  async getClientByAuthId(authId: string): Promise<Client | null> {
    const { data, error } = await supabase.from('clients').select('*').eq('auth_id', authId).maybeSingle();
    if (error) throw error;
    return data ? { ...data, authId: data.auth_id, createdAt: data.created_at } : null;
  },
  async getClients(): Promise<Client[]> {
    const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data.map(c => ({ ...c, createdAt: c.created_at }));
  },
  async addClient(client: { name: string; phone: string; email: string }): Promise<Client> {
    const { data, error } = await supabase.from('clients').insert([client]).select().single();
    if (error) throw error;
    return { ...data, createdAt: data.created_at };
  },
  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data.map(p => ({
      ...p,
      purchasePrice: p.purchase_price,
      salePrice: p.sale_price,
      initialStock: p.initial_stock,
      sourceUrl: p.source_url,
      createdAt: p.created_at
    }));
  },
  async addProduct(product: Partial<Product>): Promise<Product> {
    const { data, error } = await supabase.from('products').insert([{
      name: product.name,
      category: product.category,
      purchase_price: product.purchasePrice,
      sale_price: product.salePrice,
      stock: product.stock,
      initial_stock: product.initialStock,
      enabled: product.enabled,
      image: product.image,
      source_url: product.sourceUrl
    }]).select().single();
    if (error) throw error;
    return {
      ...data,
      purchasePrice: data.purchase_price,
      salePrice: data.sale_price,
      initialStock: data.initial_stock,
      sourceUrl: data.source_url,
      createdAt: data.created_at
    };
  },
  async updateProduct(id: number, updates: Partial<Product>): Promise<void> {
    const payload: any = {};
    if (updates.stock !== undefined) payload.stock = updates.stock;
    if (updates.enabled !== undefined) payload.enabled = updates.enabled;
    if (updates.image !== undefined) payload.image = updates.image;
    const { error } = await supabase.from('products').update(payload).eq('id', id);
    if (error) throw error;
  },
  async updateStock(id: number, stock: number) {
    const { error } = await supabase.from('products').update({ stock }).eq('id', id);
    if (error) throw error;
  },
  async getOrders(): Promise<Order[]> {
    const { data, error } = await supabase.from('orders').select('*, order_items(*)').order('date', { ascending: false });
    if (error) throw error;
    return data.map(o => ({
      ...o,
      clientId: o.client_id,
      guestName: o.guest_name,
      guestEmail: o.guest_email,
      guestPhone: o.guest_phone,
      items: o.order_items.map((i: any) => ({
        productId: i.product_id,
        quantity: i.quantity,
        unitSalePrice: i.unit_sale_price,
        unitPurchasePrice: i.unit_purchase_price
      }))
    }));
  },
  async addOrder(order: { clientId?: number; guestName?: string; guestEmail?: string; guestPhone?: string; date: string; status: string; items: OrderItem[] }): Promise<Order> {
    const { data: oData, error: oError } = await supabase.from('orders').insert([{
      client_id: order.clientId || null,
      guest_name: order.guestName,
      guest_email: order.guestEmail,
      guest_phone: order.guestPhone,
      date: order.date,
      status: order.status
    }]).select().single();
    if (oError) throw oError;

    const itemsPayload = order.items.map(i => ({
      order_id: oData.id,
      product_id: i.productId,
      quantity: i.quantity,
      unit_sale_price: i.unitSalePrice,
      unit_purchase_price: i.unitPurchasePrice
    }));
    const { error: iError } = await supabase.from('order_items').insert(itemsPayload);
    if (iError) throw iError;
    
    return { ...oData, clientId: oData.client_id, items: order.items };
  },
  async updateOrderStatus(id: number, status: string): Promise<void> {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    if (error) throw error;
  },
  async getHeroBanner(): Promise<HeroBanner | null> {
    const { data, error } = await supabase.from('hero_banner').select('*').eq('id', 1).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  },
  async getFeaturedPanels(): Promise<FeaturedPanel[]> {
    const { data, error } = await supabase.from('featured_panels').select('*');
    if (error) throw error;
    return data.map(p => ({ ...p, className: p.class_name }));
  }
};
