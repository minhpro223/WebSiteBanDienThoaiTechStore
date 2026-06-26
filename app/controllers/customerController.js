import { getProductsAPI } from "../services/api.js";
import { CartItem } from "../models/CartItem.js";

let products = [];
let cart = JSON.parse(localStorage.getItem("CART_STORAGE")) || [];
let activeBrandFilter = "all";

const productGrid = document.getElementById("productGrid");
const loadingSpinner = document.getElementById("loadingSpinner");
const productSearch = document.getElementById("productSearch");
const brandLogosGrid = document.getElementById("brandLogosGrid");
const subNavbar = document.querySelector(".sub-navbar");

const cartBtn = document.getElementById("cartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartDrawer = document.getElementById("cartDrawer");
const cartDrawerOverlay = document.getElementById("cartDrawerOverlay");
const cartItemsList = document.getElementById("cartItemsList");
const cartTotalPrice = document.getElementById("cartTotalPrice");
const cartCountBadge = document.getElementById("cartCountBadge");
const checkoutBtn = document.getElementById("checkoutBtn");

const detailsModalOverlay = document.getElementById("detailsModalOverlay");
const closeDetailsBtn = document.getElementById("closeDetailsBtn");
const detailsName = document.getElementById("detailsName");
const detailsImg = document.getElementById("detailsImg");
const detailsBrandBadge = document.getElementById("detailsBrandBadge");
const detailsDesc = document.getElementById("detailsDesc");
const detailsScreen = document.getElementById("detailsScreen");
const detailsBackCamera = document.getElementById("detailsBackCamera");
const detailsFrontCamera = document.getElementById("detailsFrontCamera");
const detailsPrice = document.getElementById("detailsPrice");
const detailsAddToCartBtn = document.getElementById("detailsAddToCartBtn");

const fetchAndRender = async () => {
    try {
        if (loadingSpinner) loadingSpinner.style.display = "block";
        if (productGrid) productGrid.style.opacity = "0.5";
        
        const response = await getProductsAPI();
        products = response.data;
        
        if (loadingSpinner) loadingSpinner.style.display = "none";
        if (productGrid) productGrid.style.opacity = "1";
        
        applyFilters();
    } catch (error) {
        console.error(error);
        if (loadingSpinner) loadingSpinner.style.display = "none";
        if (productGrid) {
            productGrid.style.opacity = "1";
            productGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #ef4444;">
                    <i class="fa-solid fa-circle-exclamation fa-2x"></i>
                    <p style="margin-top: 10px; font-weight: 600;">Không thể tải danh sách sản phẩm.</p>
                </div>
            `;
        }
    }
};

const getOriginalPrice = (price) => {
    return Math.round((price * 1.15) / 10) * 10;
};

const getDiscountPercent = (original, sale) => {
    return Math.round(((original - sale) / original) * 100);
};

const getReviewCount = (id) => {
    return (Number(id) * 31) % 180 + 12;
};

const renderProducts = (productsList) => {
    if (!productGrid) return;
    
    if (productsList.length === 0) {
        productGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 0; color: #64748b;">
                <i class="fa-solid fa-mobile-button fa-3x" style="margin-bottom: 16px; color: #cbd5e1;"></i>
                <h3 style="font-weight: 700;">Không tìm thấy sản phẩm nào</h3>
            </div>
        `;
        return;
    }
    
    productGrid.innerHTML = productsList.map(prod => {
        const cleanPrice = Number(prod.price) || 0;
        const originalPrice = getOriginalPrice(cleanPrice);
        const discount = getDiscountPercent(originalPrice, cleanPrice);
        const reviews = getReviewCount(prod.id);
        const vndPrice = cleanPrice * 25000;
        const vndOriginal = originalPrice * 25000;
        
        return `
            <div class="product-card" data-id="${prod.id}">
                <div class="discount-badge">-${discount}%</div>
                <div class="card-img-wrapper">
                    <img src="${prod.img}" alt="${prod.name}" onerror="this.src='https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500'">
                </div>
                <div class="card-info">
                    <h3 class="card-name">${prod.name}</h3>
                    <div class="storage-indicator">256GB</div>
                    <div class="rating-stars">
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <span>(${reviews})</span>
                    </div>
                    <div class="price-section">
                        <span class="price-sale">${vndPrice.toLocaleString("vi-VN")}đ</span>
                        <span class="price-original">${vndOriginal.toLocaleString("vi-VN")}đ</span>
                    </div>
                    <div class="card-actions">
                        <span class="btn-view-details">Xem chi tiết</span>
                        <button class="btn-add-cart" data-id="${prod.id}" aria-label="Thêm vào giỏ">
                            <i class="fa-solid fa-cart-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join("");

    const cards = productGrid.querySelectorAll(".product-card");
    cards.forEach(card => {
        card.addEventListener("click", (e) => {
            if (e.target.closest(".btn-add-cart")) {
                const id = e.target.closest(".btn-add-cart").getAttribute("data-id");
                addToCart(id);
                return;
            }
            const id = card.getAttribute("data-id");
            openDetailsModal(id);
        });
    });
};

const applyFilters = () => {
    let filtered = [...products];
    
    if (activeBrandFilter !== "all") {
        filtered = filtered.filter(item => item.type && item.type.toLowerCase() === activeBrandFilter.toLowerCase());
    }
    
    const searchValue = productSearch ? productSearch.value.trim().toLowerCase() : "";
    if (searchValue !== "") {
        filtered = filtered.filter(item => item.name && item.name.toLowerCase().includes(searchValue));
    }
    
    renderProducts(filtered);
};

const syncBrandSelectors = (brand) => {
    activeBrandFilter = brand;
    
    if (brandLogosGrid) {
        const logoCards = brandLogosGrid.querySelectorAll(".brand-logo-card");
        logoCards.forEach(card => {
            if (card.getAttribute("data-brand") === brand) {
                card.classList.add("active");
            } else {
                card.classList.remove("active");
            }
        });
    }
    
    if (subNavbar) {
        const navLinks = subNavbar.querySelectorAll(".sub-nav-link");
        navLinks.forEach(link => {
            if (link.getAttribute("data-brand") === brand) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });
    }

    const brandSelect = document.getElementById("brandSelect");
    if (brandSelect) {
        brandSelect.value = brand;
    }
};

const handleBrandSelect = (brand) => {
    syncBrandSelectors(brand);
    applyFilters();
};

window.handleBrandSelect = handleBrandSelect;

const openDetailsModal = (id) => {
    const product = products.find(item => String(item.id) === String(id));
    if (!product) return;
    
    if (detailsName) detailsName.textContent = product.name;
    if (detailsImg) {
        detailsImg.src = product.img;
        detailsImg.onerror = () => { detailsImg.src = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500"; };
    }
    if (detailsBrandBadge) {
        detailsBrandBadge.textContent = product.type || "Flagship";
        detailsBrandBadge.className = `details-brand-badge ${product.type ? product.type.toLowerCase() : "other"}`;
    }
    if (detailsDesc) detailsDesc.textContent = product.desc || "Trải nghiệm cấu hình vượt trội cùng thiết kế đẳng cấp.";
    if (detailsScreen) detailsScreen.textContent = product.screen || "N/A";
    if (detailsBackCamera) detailsBackCamera.textContent = product.backCamera || "N/A";
    if (detailsFrontCamera) detailsFrontCamera.textContent = product.frontCamera || "N/A";
    
    const priceVal = (Number(product.price) || 0) * 25000;
    if (detailsPrice) detailsPrice.textContent = `${priceVal.toLocaleString("vi-VN")}đ`;
    
    if (detailsAddToCartBtn) detailsAddToCartBtn.setAttribute("data-id", product.id);
    
    if (detailsModalOverlay) detailsModalOverlay.classList.add("open");
};

const closeDetailsModal = () => {
    if (detailsModalOverlay) detailsModalOverlay.classList.remove("open");
};

const addToCart = (id) => {
    const product = products.find(item => String(item.id) === String(id));
    if (!product) return;
    
    const existingItem = cart.find(item => String(item.product.id) === String(id));
    
    if (!existingItem) {
        const newCartItem = new CartItem(product, 1);
        cart.push(newCartItem);
    } else {
        existingItem.quantity += 1;
    }
    
    saveCart();
    renderCart();
    openCartDrawer();
};

const saveCart = () => {
    localStorage.setItem("CART_STORAGE", JSON.stringify(cart));
};

const renderCart = () => {
    if (!cartItemsList) return;
    
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCountBadge) {
        cartCountBadge.textContent = totalCount;
        cartCountBadge.style.display = totalCount > 0 ? "flex" : "none";
    }
    
    if (cart.length === 0) {
        cartItemsList.innerHTML = `
            <div class="empty-cart-message">
                <i class="fa-solid fa-basket-shopping"></i>
                <p style="font-weight: 700;">Giỏ hàng trống</p>
                <p style="font-size: 13px; color: #94a3b8; max-width: 210px;">Không có sản phẩm nào trong giỏ hàng của bạn.</p>
            </div>
        `;
        if (cartTotalPrice) cartTotalPrice.textContent = "0đ";
        return;
    }
    
    cartItemsList.innerHTML = cart.map(item => {
        const prod = item.product;
        const subtotal = (Number(prod.price) * Number(item.quantity)) * 25000;
        const itemVndPrice = Number(prod.price) * 25000;
        return `
            <div class="cart-item">
                <div class="item-img-wrapper">
                    <img src="${prod.img}" alt="${prod.name}" onerror="this.src='https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500'">
                </div>
                <div class="item-details">
                    <h4>${prod.name}</h4>
                    <div class="item-price">${itemVndPrice.toLocaleString("vi-VN")}đ</div>
                </div>
                <div class="quantity-controller">
                    <button class="btn-qty-minus" data-id="${prod.id}"><i class="fa-solid fa-minus"></i></button>
                    <span>${item.quantity}</span>
                    <button class="btn-qty-plus" data-id="${prod.id}"><i class="fa-solid fa-plus"></i></button>
                </div>
                <div class="item-subtotal">${subtotal.toLocaleString("vi-VN")}đ</div>
                <button class="remove-item" data-id="${prod.id}"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        `;
    }).join("");
    
    const totalPrice = cart.reduce((sum, item) => sum + (Number(item.product.price) * Number(item.quantity)), 0) * 25000;
    if (cartTotalPrice) {
        cartTotalPrice.textContent = `${totalPrice.toLocaleString("vi-VN")}đ`;
    }
    
    cartItemsList.querySelectorAll(".btn-qty-minus").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            changeQuantity(id, false);
        });
    });
    
    cartItemsList.querySelectorAll(".btn-qty-plus").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            changeQuantity(id, true);
        });
    });
    
    cartItemsList.querySelectorAll(".remove-item").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            removeFromCart(id);
        });
    });
};

const changeQuantity = (id, isIncrease) => {
    const idx = cart.findIndex(item => String(item.product.id) === String(id));
    if (idx === -1) return;
    
    if (isIncrease) {
        cart[idx].quantity += 1;
    } else {
        cart[idx].quantity -= 1;
        if (cart[idx].quantity < 1) {
            cart.splice(idx, 1);
        }
    }
    
    saveCart();
    renderCart();
};

const removeFromCart = (id) => {
    cart = cart.filter(item => String(item.product.id) !== String(id));
    saveCart();
    renderCart();
};

const checkout = () => {
    if (cart.length === 0) {
        alert("Giỏ hàng của bạn đang trống!");
        return;
    }
    
    const totalPrice = cart.reduce((sum, item) => sum + (Number(item.product.price) * Number(item.quantity)), 0) * 25000;
    alert(`🎉 Đặt hàng thành công!\n\nTổng số tiền: ${totalPrice.toLocaleString("vi-VN")}đ\nCảm ơn bạn đã lựa chọn mua sắm tại TechStore!`);
    
    cart = [];
    saveCart();
    renderCart();
    closeCartDrawer();
};

const openCartDrawer = () => {
    if (cartDrawer) cartDrawer.classList.add("open");
    if (cartDrawerOverlay) cartDrawerOverlay.classList.add("open");
};

const closeCartDrawer = () => {
    if (cartDrawer) cartDrawer.classList.remove("open");
    if (cartDrawerOverlay) cartDrawerOverlay.classList.remove("open");
};

const initEvents = () => {
    if (brandLogosGrid) {
        brandLogosGrid.addEventListener("click", (e) => {
            const card = e.target.closest(".brand-logo-card");
            if (card) {
                const brand = card.getAttribute("data-brand");
                handleBrandSelect(brand);
            }
        });
    }

    if (subNavbar) {
        subNavbar.addEventListener("click", (e) => {
            const link = e.target.closest(".sub-nav-link");
            if (link) {
                e.preventDefault();
                const brand = link.getAttribute("data-brand");
                handleBrandSelect(brand);
            }
        });
    }

    const brandSelect = document.getElementById("brandSelect");
    if (brandSelect) {
        brandSelect.addEventListener("change", (e) => {
            handleBrandSelect(e.target.value);
        });
    }

    if (productSearch) {
        productSearch.addEventListener("input", applyFilters);
    }
    if (cartBtn) {
        cartBtn.addEventListener("click", openCartDrawer);
    }
    if (closeCartBtn) {
        closeCartBtn.addEventListener("click", closeCartDrawer);
    }
    if (cartDrawerOverlay) {
        cartDrawerOverlay.addEventListener("click", closeCartDrawer);
    }
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", checkout);
    }
    
    if (closeDetailsBtn) {
        closeDetailsBtn.addEventListener("click", closeDetailsModal);
    }
    if (detailsModalOverlay) {
        detailsModalOverlay.addEventListener("click", (e) => {
            if (e.target === detailsModalOverlay) closeDetailsModal();
        });
    }
    if (detailsAddToCartBtn) {
        detailsAddToCartBtn.addEventListener("click", () => {
            const id = detailsAddToCartBtn.getAttribute("data-id");
            if (id) {
                addToCart(id);
                closeDetailsModal();
            }
        });
    }
};

document.addEventListener("DOMContentLoaded", () => {
    initEvents();
    fetchAndRender();
    renderCart();
});
