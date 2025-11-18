const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export interface Product {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  category?: string;
  brand?: string;
  price?: number;
  weight_kg?: number;
  dimensions_cm?: string;
  barcode?: string;
  main_image_url?: string;
  image_urls?: string[];
  shelf_id?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Shelf {
  id: string;
  warehouse_id: string;
  x_coord: number;
  y_coord: number;
  level: number;
  available: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Robot {
  id: string;
  name: string;
  available: boolean;
  status: string;
  current_shelf_id?: string;
  cpu_usage?: number;
  ram_usage?: number;
  battery_level?: number;
  temperature?: number;
  x?: number;
  y?: number;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  shelf_id: string;
  priority: number;
  description?: string;
  assigned_robot_name: string;
  assigned_robot_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface WarehouseMap {
  id: string;
  name: string;
  [key: string]: any;
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem("auth_token");
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem("auth_token", token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem("auth_token");
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth
  async register(username: string, password: string) {
    return this.request("/api/auth/register-admin", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  }

  async login(username: string, password: string) {
    const data = await this.request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    this.setToken(data.access_token);
    return data;
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return this.request("/api/products");
  }

  async getProduct(id: string): Promise<Product> {
    return this.request(`/api/products/${id}`);
  }

  async searchProducts(query: string): Promise<Product[]> {
    return this.request(`/api/products/search?q=${encodeURIComponent(query)}`);
  }

  async getProductLocation(id: string) {
    return this.request(`/api/products/${id}/location`);
  }

  // Shelves
  async getShelves(): Promise<Shelf[]> {
    return this.request("/api/shelves");
  }

  async getShelf(id: string): Promise<Shelf> {
    return this.request(`/api/shelves/${id}`);
  }

  async getShelfContents(id: string) {
    return this.request(`/api/shelves/${id}/contents`);
  }

  // Robots
  async getRobots(): Promise<Robot[]> {
    return this.request("/api/robots");
  }

  async getRobot(id: string): Promise<Robot> {
    return this.request(`/api/robots/${id}`);
  }

  // Tasks
  async getTasks(): Promise<Task[]> {
    return this.request("/api/tasks");
  }

  // Map
  async getWarehouseMap(): Promise<WarehouseMap> {
    return this.request("/api/maps/merged");
  }
}

export const api = new ApiClient();
