// 导航栏滚动效果
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// 轮播图功能
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-item');
const indicators = document.querySelectorAll('.carousel-indicator');
const totalSlides = slides.length;

function showSlide(index) {
    // 隐藏所有幻灯片
    slides.forEach(slide => {
        slide.classList.remove('active');
    });

    // 移除所有指示器的活动状态
    indicators.forEach(indicator => {
        indicator.classList.remove('active');
    });

    // 显示当前幻灯片和设置活动指示器
    slides[index].classList.add('active');
    indicators[index].classList.add('active');

    currentSlide = index;
}

// 自动轮播
let slideInterval = setInterval(() => {
    let nextSlide = (currentSlide + 1) % totalSlides;
    showSlide(nextSlide);
}, 5000);

// 点击指示器切换幻灯片
indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        clearInterval(slideInterval);
        showSlide(index);
        slideInterval = setInterval(() => {
            let nextSlide = (currentSlide + 1) % totalSlides;
            showSlide(nextSlide);
        }, 5000);
    });
});

// 上一张/下一张按钮
document.getElementById('prevBtn').addEventListener('click', () => {
    clearInterval(slideInterval);
    let prevSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(prevSlide);
    slideInterval = setInterval(() => {
        let nextSlide = (currentSlide + 1) % totalSlides;
        showSlide(nextSlide);
    }, 5000);
});

document.getElementById('nextBtn').addEventListener('click', () => {
    clearInterval(slideInterval);
    let nextSlide = (currentSlide + 1) % totalSlides;
    showSlide(nextSlide);
    slideInterval = setInterval(() => {
        let nextSlide = (currentSlide + 1) % totalSlides;
        showSlide(nextSlide);
    }, 5000);
});

////////////////////////////////////////////////////////////
// 购物车功能 //
const cartSidebar = document.getElementById('cartSidebar');
const cartBtn = document.getElementById('cartBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const emptyCart = document.getElementById('emptyCart');
const cartItemList = document.getElementById('cartItemList');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const addToCartButtons = document.querySelectorAll('.add-to-cart');

let cartItems = [];

// 打开购物车
cartBtn.addEventListener('click', () => {
    cartSidebar.classList.add('active');
});

// 关闭购物车
closeCartBtn.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
});

// 添加商品到购物车
addToCartButtons.forEach(button => {
    button.addEventListener('click', function() {
        const productCard = this.closest('.group');
        const productName = productCard.querySelector('h3').textContent;
        const productPrice = parseFloat(productCard.querySelector('.text-orange-600').textContent.replace('¥', ''));
        const productImage = productCard.querySelector('img').src;

        // 检查商品是否已在购物车中
        const existingItem = cartItems.find(item => item.name === productName);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cartItems.push({
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            });
        }

        updateCart();
        showNotification(`已添加 ${productName} 到购物车`);
    });
});

// 更新购物车显示
function updateCart() {
    // 更新购物车计数
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;

    // 更新购物车列表
    if (cartItems.length === 0) {
        emptyCart.classList.remove('hidden');
        cartItemList.classList.add('hidden');
        checkoutBtn.disabled = true;
    } else {
        emptyCart.classList.add('hidden');
        cartItemList.classList.remove('hidden');
        checkoutBtn.disabled = false;

        // 清空现有购物车项
        cartItemList.innerHTML = '';

        // 添加购物车项
        cartItems.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item flex items-center space-x-4 pb-4 border-b border-gray-100';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="w-16 h-16 rounded-lg object-cover">
                <div class="flex-1">
                    <h4 class="font-medium text-gray-800">${item.name}</h4>
                    <p class="text-orange-600 font-medium">¥${item.price}</p>
                </div>
                <div class="flex items-center">
                    <button class="decrease-quantity p-1 text-gray-500 hover:text-gray-700">
                        <i class="fa fa-minus-circle"></i>
                    </button>
                    <span class="mx-2 text-gray-800">${item.quantity}</span>
                    <button class="increase-quantity p-1 text-gray-500 hover:text-gray-700">
                        <i class="fa fa-plus-circle"></i>
                    </button>
                </div>
                <button class="remove-item ml-2 text-gray-400 hover:text-red-500">
                    <i class="fa fa-trash"></i>
                </button>
            `;

            cartItemList.appendChild(cartItem);

            // 添加数量增减和删除事件
            cartItem.querySelector('.decrease-quantity').addEventListener('click', () => {
                if (item.quantity > 1) {
                    item.quantity -= 1;
                } else {
                    cartItems.splice(index, 1);
                }
                updateCart();
            });

            cartItem.querySelector('.increase-quantity').addEventListener('click', () => {
                item.quantity += 1;
                updateCart();
            });

            cartItem.querySelector('.remove-item').addEventListener('click', () => {
                cartItems.splice(index, 1);
                updateCart();
            });
        });
    }

    // 计算并更新总价
    const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    cartTotal.textContent = `¥${totalPrice.toFixed(2)}`;
}

// 显示通知
function showNotification(message) {
    // 检查是否已存在通知元素
    let notification = document.querySelector('.notification');

    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 z-50';
        document.body.appendChild(notification);
    }

    notification.textContent = message;
    notification.classList.remove('translate-x-full');

    setTimeout(() => {
        notification.classList.add('translate-x-full');
    }, 3000);
}

// 用户菜单下拉框
const userBtn = document.getElementById('userBtn');
const userMenu = document.getElementById('userMenu');

userBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    userMenu.classList.toggle('active');
});

// 点击其他地方关闭用户菜单
document.addEventListener('click', (e) => {
    if (!userBtn.contains(e.target) && !userMenu.contains(e.target)) {
        userMenu.classList.remove('active');
    }
});

// 登录模态框
const loginBtn = document.querySelector('.fa-user').parentElement;
const loginModal = document.getElementById('loginModal');
const closeLoginBtn = document.getElementById('closeLoginBtn');

loginBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    loginModal.classList.add('active');
});

closeLoginBtn.addEventListener('click', () => {
    loginModal.classList.remove('active');
});

// 点击模态框外部关闭
loginModal.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.classList.remove('active');
    }
});

// 移动端菜单
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
});

// 分类切换
const categoryItems = document.querySelectorAll('.category-item');

categoryItems.forEach(item => {
    item.addEventListener('click', () => {
        // 移除所有分类的活动状态
        categoryItems.forEach(i => {
            i.classList.remove('active');
        });

        // 添加当前分类的活动状态
        item.classList.add('active');

        // 在移动端点击分类后关闭菜单
        if (window.innerWidth < 768) {
            mobileMenu.classList.remove('active');
        }
    });
});

// 结算按钮
checkoutBtn.addEventListener('click', () => {
    alert('结算功能将在后续版本中实现');
});

// 初始化
showSlide(0);
updateCart();
