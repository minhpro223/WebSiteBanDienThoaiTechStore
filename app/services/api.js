const MOCKAPI_ID = "6a2f991fc9776ca6c0c5eae3";
const BASE_URL = `https://${MOCKAPI_ID}.mockapi.io/Product`;

const DEFAULT_PRODUCTS = [
    {
        id: "1",
        name: "iphoneX",
        price: 1000,
        screen: "screen 68",
        backCamera: "2 camera 12 MP",
        frontCamera: "7 MP",
        img: "https://cdn.tgdd.vn/Products/Images/42/114115/iphone-x-64gb-hh-600x600.jpg",
        desc: "Thiết kế mang tính đột phá",
        type: "iphone"
    },
    {
        id: "2",
        name: "Samsung Galaxy M51 ",
        price: 3500,
        screen: "screen 69",
        backCamera: " Chính 64 MP & Phụ 12 MP, 5 MP, 5 MP",
        frontCamera: " 32 MP",
        img: "https://cdn.tgdd.vn/Products/Images/42/217536/samsung-galaxy-m51-trang-new-600x600-600x600.jpg",
        desc: "Thiết kế đột phá, màn hình tuyệt đỉnh",
        type: "Samsung"
    },
    {
        id: "3",
        name: "Samsung Galaxy M22",
        price: 45000,
        screen: "screen 70",
        backCamera: "Chính 12 MP & Phụ 64 MP, 12 MP",
        frontCamera: " 32 MP",
        img: "https://cdn.tgdd.vn/Products/Images/42/217536/samsung-galaxy-m51-trang-new-600x600-600x600.jpg",
        desc: "Thiết kế mang tính đột phá",
        type: "Samsung"
    },
    {
        id: "4",
        name: "Iphone 11",
        price: 1000,
        screen: "screen 54",
        backCamera: "Camera: Chính 12 MP & Phụ 64 MP, 12 MP",
        frontCamera: "32 MP",
        img: "https://didongviet.vn/pub/media/catalog/product//i/p/iphone-11-pro-max-256gb-didongviet_23.jpg",
        desc: "Thiết kế đột phá, màn hình tuyệt đỉnh",
        type: "Iphone"
    }
];

const LOCAL_DB_KEY = "MOCK_PRODUCTS_DB";

const getLocalDB = () => {
    let db = localStorage.getItem(LOCAL_DB_KEY);
    if (!db || JSON.parse(db).length === 0) {
        localStorage.setItem(LOCAL_DB_KEY, JSON.stringify(DEFAULT_PRODUCTS));
        return DEFAULT_PRODUCTS;
    }
    return JSON.parse(db);
};

const saveLocalDB = (data) => {
    localStorage.setItem(LOCAL_DB_KEY, JSON.stringify(data));
};

export const getProductsAPI = async () => {
    try {
        const response = await axios.get(BASE_URL, {
            headers: {
                "Cache-Control": "no-cache",
                "Pragma": "no-cache",
                "Expires": "0"
            }
        });
        if (response.data && response.data.length > 0) {
            saveLocalDB(response.data);
            return response;
        }
        return { data: getLocalDB() };
    } catch (error) {
        return { data: getLocalDB() };
    }
};

export const getProductByIdAPI = async (id) => {
    try {
        return await axios.get(`${BASE_URL}/${id}`);
    } catch (error) {
        const db = getLocalDB();
        const product = db.find(item => String(item.id) === String(id));
        if (product) {
            return { data: product };
        }
        throw new Error("Product not found");
    }
};

export const createProductAPI = async (product) => {
    try {
        const response = await axios.post(BASE_URL, product);
        const db = getLocalDB();
        db.push(response.data);
        saveLocalDB(db);
        return response;
    } catch (error) {
        const db = getLocalDB();
        const newProduct = { ...product, id: String(Date.now()) };
        db.push(newProduct);
        saveLocalDB(db);
        return { data: newProduct };
    }
};

export const deleteProductAPI = async (id) => {
    try {
        const response = await axios.delete(`${BASE_URL}/${id}`);
        const db = getLocalDB();
        const updated = db.filter(item => String(item.id) !== String(id));
        saveLocalDB(updated);
        return response;
    } catch (error) {
        const db = getLocalDB();
        const deletedItem = db.find(item => String(item.id) === String(id));
        const updated = db.filter(item => String(item.id) !== String(id));
        saveLocalDB(updated);
        return { data: deletedItem };
    }
};

export const updateProductAPI = async (id, product) => {
    try {
        const response = await axios.put(`${BASE_URL}/${id}`, product);
        const db = getLocalDB();
        const idx = db.findIndex(item => String(item.id) === String(id));
        if (idx !== -1) {
            db[idx] = { ...db[idx], ...product };
            saveLocalDB(db);
        }
        return response;
    } catch (error) {
        const db = getLocalDB();
        const idx = db.findIndex(item => String(item.id) === String(id));
        if (idx !== -1) {
            db[idx] = { ...db[idx], ...product, id: String(id) };
            saveLocalDB(db);
            return { data: db[idx] };
        }
        throw new Error("Product not found in LocalStorage database");
    }
};
