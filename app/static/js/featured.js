document.addEventListener('DOMContentLoaded', function() {
    // 套餐数据
    const packages = {
        personal: {
            id: 'personal-1',
            title: '个人经典套餐',
            description: '适合一人享用的经典搭配，工作午餐最佳选择',
            originalPrice: 68,
            discount: 0.85,
            finalPrice: 58,
            items: [
                { name: '主菜任选1份 (红烧牛肉/宫保鸡丁/鱼香肉丝)', price: 38 },
                { name: '配菜任选1份 (清炒时蔬/凉拌黄瓜)', price: 15 },
                { name: '主食任选1份 (白米饭/蛋炒饭)', price: 10 }
            ]
        },
        family: {
            id: 'family-1',
            title: '家庭欢乐套餐',
            description: '3-4人份家庭套餐，共享温馨用餐时光',
            originalPrice: 168,
            discount: 0.8,
            finalPrice: 134,
            items: [
                { name: '主菜任选2份 (水煮鱼/糖醋排骨/红烧狮子头/清蒸鲈鱼)', price: 78 },
                { name: '配菜任选2份 (干煸四季豆/麻婆豆腐/蒜蓉空心菜)', price: 22 },
                { name: '汤品任选1份 (紫菜蛋花汤/排骨玉米汤)', price: 28 },
                { name: '主食任选1份 (白米饭(大)/扬州炒饭)', price: 15 }
            ]
        },
        group: {
            id: 'group-1',
            title: '多人聚会套餐',
            description: '6-8人份豪华套餐，朋友聚会最佳选择',
            originalPrice: 328,
            discount: 0.75,
            finalPrice: 246,
            items: [
                { name: '主菜任选4份 (北京烤鸭/清蒸大闸蟹/红烧肉/辣子鸡/回锅肉)', price: 128 },
                { name: '配菜任选3份 (凉拌木耳/拍黄瓜/皮蛋豆腐)', price: 22 },
                { name: '汤品任选1份 (酸辣汤/老鸭汤)', price: 38 },
                { name: '主食任选1份 (白米饭(特大)/葱油饼)', price: 20 }
            ]
        },
        business: {
            id: 'business-1',
            title: '商务工作套餐',
            description: '精致商务套餐，会议用餐专业之选',
            originalPrice: 98,
            discount: 0.9,
            finalPrice: 88,
            items: [
                { name: '主菜任选1份 (黑椒牛柳/清蒸鲈鱼/宫保虾球)', price: 48 },
                { name: '配菜任选2份 (清炒芦笋/香菇菜心/凉拌海蜇)', price: 28 },
                { name: '汤品任选1份 (西湖牛肉羹/虫草花鸡汤)', price: 28 },
                { name: '主食任选1份 (杂粮饭/海鲜炒饭)', price: 15 }
            ]
        }
    };

    // 添加购物车事件
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const packageType = this.dataset.package;
            addPackageToCart(packageType);
        });
    });

    // 添加套餐到购物车
    function addPackageToCart(packageType) {
        const packageData = packages[packageType];

        // 创建套餐对象
        const packageOrder = {
            id: packageData.id,
            name: packageData.title,
            items: packageData.items,
            originalPrice: packageData.originalPrice,
            discount: `${(packageData.discount * 10)}折`,
            discountValue: packageData.discount,
            finalPrice: packageData.finalPrice,
            isPackage: true
        };

        // 获取现有购物车或创建新购物车
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        // 添加套餐到购物车
        cart.push(packageOrder);

        // 保存购物车
        localStorage.setItem('cart', JSON.stringify(cart));

        // 显示通知
        showNotification(`"${packageData.title}" 已添加到购物车`);

        // 更新购物车数量显示
        updateCartCount();
    }

    // 显示通知
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center animate-fade-in-up';
        notification.innerHTML = `
            <i class="fa fa-check-circle mr-2"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // 更新购物车数量
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + (item.isPackage ? 1 : item.quantity), 0);

        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            cartCount.textContent = totalItems;
        }
    }
});