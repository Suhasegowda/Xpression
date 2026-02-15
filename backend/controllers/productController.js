const Product = require('../models/Product');
const Review = require('../models/Review');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    const pageSize = 10; // Simple pagination default
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
        ? {
            name: {
                $regex: req.query.keyword,
                $options: 'i',
            },
        }
        : {};

    const category = req.query.category ? { category: req.query.category } : {};

    const count = await Product.countDocuments({ ...keyword, ...category });

    let query = Product.find({ ...keyword, ...category });

    // Sorting
    if (req.query.sort) {
        const sortOrder = req.query.sort === 'price_asc' ? { price: 1 } :
            req.query.sort === 'price_desc' ? { price: -1 } :
                req.query.sort === 'rating' ? { rating: -1 } :
                    { createdAt: -1 }; // Default newest
        query = query.sort(sortOrder);
    } else {
        query = query.sort({ createdAt: -1 });
    }

    const products = await query
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize) });
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    const product = await Product.findById(req.params.id).populate('reviews');

    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    let { name, price, description, category, brand, sizes, images, discountPrice } = req.body;

    // Ensure images is an array
    if (typeof images === 'string') {
        images = [images];
    } else if (!Array.isArray(images)) {
        images = [];
    }

    const product = new Product({
        name,
        price,
        description,
        category,
        brand,
        sizes, // Expecting array of {size, stock}
        images,
        discountPrice
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    let { name, price, description, category, brand, sizes, images, discountPrice } = req.body;

    // Ensure images is an array if provided
    if (images && typeof images === 'string') {
        images = [images];
    }

    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name || product.name;
        product.price = price || product.price;
        product.description = description || product.description;
        product.category = category || product.category;
        product.brand = brand || product.brand;
        product.sizes = sizes || product.sizes;
        product.images = images || product.images;
        product.discountPrice = discountPrice || product.discountPrice;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await product.deleteOne();
        res.json({ message: 'Product removed' });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res) => {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            // For simplicity, allowed multiple reviews or just return info
            // return res.status(400).json({ message: 'Product already reviewed' });
        }

        const review = new Review({
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
            product: product._id
        });

        await review.save();

        product.reviews.push(review._id);

        // Update total rating logic would depend on aggregating Review models
        // For simplicity, strictly following Schema structure provided earlier

        await product.save();
        res.status(201).json({ message: 'Review added' });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

// @desc    Delete review (Admin)
// @route   DELETE /api/products/:id/reviews/:reviewId
// @access  Private/Admin
const deleteReview = async (req, res) => {
    const review = await Review.findById(req.params.reviewId);
    if (review) {
        await review.deleteOne();
        // Also remove from product array
        const product = await Product.findById(req.params.id);
        if (product) {
            product.reviews = product.reviews.filter(rId => rId.toString() !== req.params.reviewId);
            await product.save();
        }
        res.json({ message: 'Review removed' });
    } else {
        res.status(404).json({ message: 'Review not found' });
    }
}

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
    deleteReview
};
