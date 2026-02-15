const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');
const Order = require('./models/Order');
const Category = require('./models/Category');

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const products = [
    {
        name: "Classic Oxford Shirt",
        description: "A timeless classic for formal occasions.",
        category: "formal shirts",
        brand: "Xpression",
        price: 1499,
        discountPrice: 1299,
        rating: 4.8,
        images: ["https://images.unsplash.com/photo-1593030761757-71bd90d9d53c?q=80&w=1779&auto=format&fit=crop"],
        sizes: [{ size: 'M', stock: 10 }, { size: 'L', stock: 10 }, { size: 'XL', stock: 5 }]
    },
    {
        name: "Oversized Street Tee",
        description: "Comfortable and stylish oversized t-shirt.",
        category: "oversized tshirts",
        brand: "UrbanX",
        price: 899,
        discountPrice: 0,
        rating: 4.5,
        images: ["https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1887&auto=format&fit=crop"],
        sizes: [{ size: 'S', stock: 15 }, { size: 'M', stock: 15 }, { size: 'L', stock: 10 }]
    },
    {
        name: "Slim Fit Chinos",
        description: "Perfect fit chinos for office and casual wear.",
        category: "formal pants",
        brand: "Xpression",
        price: 1999,
        rating: 4.6,
        images: ["https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=1887&auto=format&fit=crop"],
        sizes: [{ size: '30', stock: 10 }, { size: '32', stock: 10 }, { size: '34', stock: 10 }]
    },
    {
        name: "Distressed Denim Jeans",
        description: "Rugged and trendy denim jeans.",
        category: "jeans pants",
        brand: "DenimCo",
        price: 2499,
        rating: 4.7,
        images: ["https://images.unsplash.com/photo-1542272617-08f083157f5d?q=80&w=1784&auto=format&fit=crop"],
        sizes: [{ size: '30', stock: 5 }, { size: '32', stock: 8 }, { size: '34', stock: 8 }]
    },
    {
        name: "Baggy Cargo Pants",
        description: "Functional and stylish cargo pants.",
        category: "baggy pants",
        brand: "StreetWear",
        price: 1899,
        rating: 4.3,
        images: ["https://images.unsplash.com/photo-1517445312882-6e2a22bc3948?q=80&w=1833&auto=format&fit=crop"],
        sizes: [{ size: 'M', stock: 12 }, { size: 'L', stock: 12 }]
    },
    {
        name: "Premium Cotton Colored Tee",
        description: "Soft premium cotton t-shirt in vibrant colors.",
        category: "coloured tshirts",
        brand: "Xpression Basic",
        price: 699,
        rating: 4.9,
        images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1780&auto=format&fit=crop"],
        sizes: [{ size: 'S', stock: 20 }, { size: 'M', stock: 20 }, { size: 'L', stock: 20 }]
    }
];

const categories = [
    { name: "shirts", description: "Formal and Casual Shirts" },
    { name: "coloured tshirts", description: "Vibrant Cotton Tees" },
    { name: "oversized tshirts", description: "Trendy Oversized Fits" },
    { name: "jeans pants", description: "Denim Jeans" },
    { name: "baggy pants", description: "Relaxed Fit Cargos" },
    { name: "formal shirts", description: "Office Wear" },
    { name: "formal pants", description: "Trousers and Chinos" }
];

const importData = async () => {
    try {
        await Product.deleteMany();
        await Category.deleteMany();

        // We won't delete users to avoid locking you out if you already created one, 
        // but for fresh start you might want to: await User.deleteMany();

        await Category.insertMany(categories);
        await Product.insertMany(products);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
