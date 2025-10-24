import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api', // Your backend URL
});

// Interceptor to add the JWT token to every request
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                // Check if the token is expired
                if (decodedToken.exp * 1000 < Date.now()) {
                    console.log("Token expired, removing token.");
                    localStorage.removeItem('token');
                    window.location.href = '/login'; // Redirect on expiry
                } else {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (error) {
                 console.error("Error decoding token:", error);
                 localStorage.removeItem('token'); // Remove invalid token
                 window.location.href = '/login'; // Redirect if token invalid
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// --- Authentication Service ---
export const loginUser = (username, password) => {
    return apiClient.post('/auth/login', { username, password });
};

// --- Product Service (Public part) ---
export const getAllProducts = () => {
    return apiClient.get('/products/all');
};

export const getProductById = (productId) => {
    return apiClient.get(`/products/${productId}`);
};

// --- Cart Service ---
export const addItemToCart = (productId, quantity) => {
    return apiClient.post('/student/cart/items', { productId, quantity });
};
export const getCart = () => {
    return apiClient.get('/student/cart');
};
export const removeItemFromCart = (productId) => {
    return apiClient.delete(`/student/cart/items/${productId}`);
};

// --- Order Service ---
export const checkout = () => {
    return apiClient.post('/student/checkout');
};
export const getOrderHistory = () => {
    return apiClient.get('/student/orders');
};

// --- Profile Service ---
export const getStudentProfile = () => {
    return apiClient.get('/student/profile');
};

// --- Feedback Service ---
export const submitFeedback = (productId, comment) => {
    return apiClient.post(`/student/products/${productId}/feedback`, { comment });
};

// --- Public Service ---
export const submitQuery = (name, email, message) => {
    return apiClient.post('/public/contact', { name, email, message });
};

// ===================================
// --- ADMIN API FUNCTIONS ---
// ===================================

// --- Admin Student Management ---
export const addStudent = (studentData) => {
    return apiClient.post('/admin/students', studentData);
};
export const getAllStudentsAdmin = () => {
    return apiClient.get('/admin/students');
};
export const updateStudentAdmin = (studentId, studentData) => {
    return apiClient.put(`/admin/students/${studentId}`, studentData);
};

// --- Admin Product Management ---
export const addProductAdmin = (productData) => {
    return apiClient.post('/admin/products', productData);
};
export const updateProductAdmin = (productId, productData) => {
    return apiClient.put(`/admin/products/${productId}`, productData);
};
// We already have getAllProducts for public viewing, admin can use it too.

// --- Admin Order Management ---
export const getAllOrdersAdmin = () => {
    return apiClient.get('/admin/orders');
};
export const updateOrderStatusAdmin = (orderId, status) => {
    return apiClient.put(`/admin/orders/${orderId}/status`, null, { params: { status } });
};

// --- Admin Feedback Management ---
export const getAllFeedbackAdmin = () => {
    return apiClient.get('/admin/feedback');
};

// --- Admin Query Management ---
export const getAllQueriesAdmin = () => {
    return apiClient.get('/admin/queries');
};