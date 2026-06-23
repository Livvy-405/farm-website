require('dotenv').config();
const connectDB = require('./config/db');
const Product = require('./models/Product');
const Order = require('./models/Order');

const products = [
  { name: 'Organic Tomatoes', description: 'Vine-ripened heirloom tomatoes grown without pesticides. Bursting with flavor, perfect for salads and sauces.', price: 4.99, image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600', category: 'Produce', inStock: true },
  { name: 'Free Range Eggs', description: 'Farm-fresh eggs from happy, pasture-raised hens. Rich golden yolks with incredible taste.', price: 6.50, image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600', category: 'Dairy & Eggs', inStock: true },
  { name: 'Wildflower Honey', description: 'Raw, unfiltered honey harvested from our own beehives. Complex floral notes with a smooth finish.', price: 12.99, image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600', category: 'Pantry', inStock: true },
  { name: 'Sweet Corn', description: 'Freshly picked sweet corn, harvested at peak sweetness. Nothing beats farm-fresh corn on the cob.', price: 3.49, image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600', category: 'Produce', inStock: true },
  { name: 'Heirloom Lettuce Mix', description: 'A vibrant mix of butterhead, oak leaf, and romaine lettuces. Tender leaves perfect for any salad.', price: 3.99, image: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=600', category: 'Produce', inStock: true },
  { name: 'Sunflower Seeds', description: 'Organic sunflower seeds ready for planting or snacking. Grown and dried naturally on our farm.', price: 5.99, image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600', category: 'Seeds', inStock: false },
  { name: 'Fresh Basil Bundle', description: 'Aromatic Genovese basil, hand-picked and bundled. The essential herb for Italian cooking.', price: 2.99, image: 'https://images.unsplash.com/photo-1618164435735-413d3b066c9a?w=600', category: 'Herbs', inStock: true },
  { name: 'Strawberry Jam', description: 'Small-batch strawberry preserves made with our own berries. Just fruit, sugar, and a touch of lemon.', price: 8.99, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600', category: 'Pantry', inStock: true },
];

const seed = async () => {
  await connectDB();

  await Product.deleteMany({});
  await Order.deleteMany({});

  const inserted = await Product.insertMany(products);
  console.log(`✅  Seeded ${inserted.length} products`);

  // Sample orders referencing seeded products
  const sampleOrders = [
    {
      customerName: 'Sarah Mitchell',
      email: 'sarah@email.com',
      phone: '555-0101',
      address: '123 Oak Lane',
      items: [
        { product: { id: inserted[0]._id, name: inserted[0].name, price: inserted[0].price, image: inserted[0].image, category: inserted[0].category }, quantity: 2 },
        { product: { id: inserted[2]._id, name: inserted[2].name, price: inserted[2].price, image: inserted[2].image, category: inserted[2].category }, quantity: 1 },
      ],
      total: 22.97,
      status: 'Fulfilled',
    },
    {
      customerName: 'James Cooper',
      email: 'james@email.com',
      phone: '555-0102',
      address: '456 Elm Street',
      items: [
        { product: { id: inserted[1]._id, name: inserted[1].name, price: inserted[1].price, image: inserted[1].image, category: inserted[1].category }, quantity: 3 },
      ],
      total: 19.50,
      status: 'Pending',
    },
  ];

  const orders = await Order.insertMany(sampleOrders);
  console.log(`✅  Seeded ${orders.length} orders`);

  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
