document.addEventListener('DOMContentLoaded', function() {
    // 全局变量
    let menuData = [];
    let filteredData = [];
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // DOM元素
    const menuTableBody = document.getElementById('menuTableBody');
    const noResults = document.getElementById('noResults');
    const categoryFilter = document.getElementById('categoryFilter');
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    const applyPriceFilter = document.getElementById('applyPriceFilter');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const cartCount = document.getElementById('cartCount');

    // 购物车相关元素
    const cartSidebar = document.getElementById('cartSidebar');
    const cartBtn = document.getElementById('cartBtn');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const cartItems = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    const cartItemList = document.getElementById('cartItemList');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');

    // 用户菜单相关元素
    const userBtn = document.getElementById('userBtn');
    const userMenu = document.getElementById('userMenu');

    // 初始化页面
    fetchMenuData();
    updateCartCount();

    // 事件监听器
    categoryFilter.addEventListener('change', filterMenu);
    applyPriceFilter.addEventListener('click', filterMenu);
    searchBtn.addEventListener('click', filterMenu);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') filterMenu();
    });

    // 获取清空按钮元素
    const resetFilterBtn = document.getElementById('resetFilterBtn');
    // 清空筛选条件
    resetFilterBtn.addEventListener('click', function() {
        // 重置分类选择
        categoryFilter.value = 'all';
        // 清空价格区间
        minPriceInput.value = '';
        maxPriceInput.value = '';
        // 清空搜索框
        searchInput.value = '';
        // 重新加载全部数据
        filteredData = [...menuData];
        renderMenu(filteredData);
    });

    // 购物车相关事件
    cartBtn.addEventListener('click', toggleCart);
    closeCartBtn.addEventListener('click', toggleCart);

    // 用户菜单事件
    userBtn.addEventListener('click', toggleUserMenu);
    document.addEventListener('click', function(e) {
        if (!userMenu.contains(e.target) && e.target !== userBtn) {
            hideUserMenu();
        }
    });

    // 获取菜单数据
    function fetchMenuData() {
        fetch('/static/database/menu.json')
            .then(response => response.json())
            .then(data => {
                menuData = data;
                filteredData = [...data];
                renderMenu(data);
            })
            .catch(error => {
                console.error('Error loading menu data:', error);
                menuTableBody.innerHTML = `
                    <tr>
                        <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                            加载菜单数据失败，请刷新页面重试
                        </td>
                    </tr>
                `;
            });
    }

    // 渲染菜单表格
    function renderMenu(data) {
        if (data.length === 0) {
            menuTableBody.innerHTML = '';
            noResults.classList.remove('hidden');
            return;
        }

        noResults.classList.add('hidden');
        menuTableBody.innerHTML = '';

        data.forEach(item => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50';

            // 获取分类标签的类和文本
            const { tagClass, tagText } = getCategoryTag(item.category);

            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="font-medium text-gray-900">${item.product}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="${tagClass}">${tagText}</span>
                </td>
                <td class="px-6 py-4">
                    <div class="text-gray-500 max-w-xs truncate">${item.introduction || '暂无简介'}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <i class="fa fa-star text-yellow-400"></i>
                        <span class="ml-1 text-gray-700">${item.score}</span>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-orange-600 font-medium">¥${item.price}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                    <button class="add-to-cart px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors" data-id="${item.product}">
                        <i class="fa fa-plus mr-1"></i>加入购物车
                    </button>
                </td>
            `;

            menuTableBody.appendChild(row);
        });

        // 添加加入购物车事件
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                addToCart(productId);
            });
        });
    }

    // 筛选菜单
    function filterMenu() {
        const category = categoryFilter.value;
        const minPrice = parseFloat(minPriceInput.value) || 0;
        const maxPrice = parseFloat(maxPriceInput.value) || Infinity;
        const searchTerm = searchInput.value.toLowerCase();

        filteredData = menuData.filter(item => {
            // 分类筛选
            const categoryMatch = category === 'all' || item.category === category;

            // 价格筛选
            const priceMatch = item.price >= minPrice && item.price <= maxPrice;

            // 搜索筛选
            const searchMatch = item.product.toLowerCase().includes(searchTerm);

            return categoryMatch && priceMatch && searchMatch;
        });

        renderMenu(filteredData);
    }

    // 购物车功能
    function addToCart(productId) {
        const product = menuData.find(item => item.product === productId);
        if (!product) return;

        const existingItem = cart.find(item => item.product === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }

        updateCart();
        showCartNotification(product.product);
    }

    function updateCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCartItems();
    }

    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }

    function renderCartItems() {
        if (cart.length === 0) {
            emptyCart.classList.remove('hidden');
            cartItemList.classList.add('hidden');
            checkoutBtn.disabled = true;
            cartTotal.textContent = '¥0';
            return;
        }

        emptyCart.classList.add('hidden');
        cartItemList.classList.remove('hidden');
        checkoutBtn.disabled = false;

        cartItemList.innerHTML = '';

        let total = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item flex items-center space-x-4 pb-4 border-b border-gray-100';
            cartItem.innerHTML = `
                <div class="flex-1">
                    <h4 class="font-medium text-gray-800">${item.product}</h4>
                    <p class="text-orange-600 font-medium">¥${item.price}</p>
                </div>
                <div class="flex items-center">
                    <button class="decrease-quantity p-1 text-gray-500 hover:text-gray-700" data-id="${item.product}">
                        <i class="fa fa-minus-circle"></i>
                    </button>
                    <span class="mx-2 text-gray-800">${item.quantity}</span>
                    <button class="increase-quantity p-1 text-gray-500 hover:text-gray-700" data-id="${item.product}">
                        <i class="fa fa-plus-circle"></i>
                    </button>
                </div>
                <button class="remove-item ml-2 text-gray-400 hover:text-red-500" data-id="${item.product}">
                    <i class="fa fa-trash"></i>
                </button>
            `;

            cartItemList.appendChild(cartItem);
        });

        cartTotal.textContent = `¥${total.toFixed(2)}`;

        // 添加购物车项目事件
        document.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                updateCartItemQuantity(productId, -1);
            });
        });

        document.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                updateCartItemQuantity(productId, 1);
            });
        });

        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                removeCartItem(productId);
            });
        });
    }

    function updateCartItemQuantity(productId, change) {
        const itemIndex = cart.findIndex(item => item.product === productId);
        if (itemIndex === -1) return;

        cart[itemIndex].quantity += change;

        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }

        updateCart();
    }

    function removeCartItem(productId) {
        cart = cart.filter(item => item.product !== productId);
        updateCart();
    }

    function toggleCart() {
        renderCartItems();
        cartSidebar.classList.toggle('translate-x-0');
        cartSidebar.classList.toggle('translate-x-full');
    }

    function showCartNotification(productName) {
        const notification = document.createElement('div');
        notification.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center animate-fade-in-up';
        notification.innerHTML = `
            <i class="fa fa-check-circle mr-2"></i>
            <span>已添加 "${productName}" 到购物车</span>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('animate-fade-out');
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }

    // 用户菜单功能
    function toggleUserMenu() {
        if (userMenu.classList.contains('opacity-0')) {
            showUserMenu();
        } else {
            hideUserMenu();
        }
    }

    function showUserMenu() {
        userMenu.classList.remove('opacity-0');
        userMenu.classList.remove('pointer-events-none');
        userMenu.classList.add('opacity-100');
    }

    function hideUserMenu() {
        userMenu.classList.add('opacity-0');
        userMenu.classList.add('pointer-events-none');
        userMenu.classList.remove('opacity-100');
    }

    // 辅助函数
    function getCategoryTag(category) {
        switch(category) {
            case '荤菜':
                return { tagClass: 'category-tag tag-meat', tagText: category };
            case '素菜':
                return { tagClass: 'category-tag tag-vegetable', tagText: category };
            case '烧烤':
                return { tagClass: 'category-tag tag-bbq', tagText: category };
            case '主食':
                return { tagClass: 'category-tag tag-staple', tagText: category };
            case '汤品':
                return { tagClass: 'category-tag tag-soup', tagText: category };
            case '饮品':
                return { tagClass: 'category-tag tag-drink', tagText: category };
            default:
                return { tagClass: 'category-tag', tagText: category };
        }
    }
});