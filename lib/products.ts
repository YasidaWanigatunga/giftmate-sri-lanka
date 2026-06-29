export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  emoji: string
  tags: string[]
  deliveryDays: number
  inStock: boolean
}

export const PRODUCTS: Product[] = [
  {
    id: 'tea-001',
    name: 'Premium Ceylon Black Tea Gift Set',
    description: 'Finest Ceylon black tea from Nuwara Eliya highlands. A luxurious collection for true tea connoisseurs.',
    price: 3500,
    category: 'Tea & Beverages',
    emoji: '🍵',
    tags: ['tea', 'beverage', 'gourmet', 'traditional', 'highlands', 'gift'],
    deliveryDays: 2,
    inStock: true,
  },
  {
    id: 'tea-002',
    name: 'Dilmah Special Reserve Tea Box',
    description: 'An assortment of 5 premium Dilmah tea varieties in an elegant keepsake gift box.',
    price: 2800,
    category: 'Tea & Beverages',
    emoji: '🫖',
    tags: ['tea', 'dilmah', 'gift box', 'premium', 'beverage'],
    deliveryDays: 2,
    inStock: true,
  },
  {
    id: 'gem-001',
    name: 'Blue Sapphire Pendant (Certified)',
    description: 'Authentic Ceylon blue sapphire pendant with certification. A timeless piece of Sri Lankan heritage.',
    price: 45000,
    category: 'Gems & Jewelry',
    emoji: '💎',
    tags: ['sapphire', 'jewelry', 'gems', 'premium', 'luxury', 'anniversary', 'her'],
    deliveryDays: 3,
    inStock: true,
  },
  {
    id: 'gem-002',
    name: 'Moonstone Silver Ring',
    description: 'Handcrafted silver ring with authentic Sri Lankan moonstone. Elegant and mystical.',
    price: 8500,
    category: 'Gems & Jewelry',
    emoji: '💍',
    tags: ['moonstone', 'ring', 'silver', 'handcrafted', 'jewelry', 'her', 'wedding'],
    deliveryDays: 3,
    inStock: true,
  },
  {
    id: 'batik-001',
    name: 'Handmade Batik Saree',
    description: 'Exquisite hand-painted batik saree with traditional Sri Lankan motifs. A wearable work of art.',
    price: 12000,
    category: 'Clothing & Textiles',
    emoji: '👘',
    tags: ['batik', 'saree', 'traditional', 'clothing', 'handmade', 'cultural', 'her', 'wedding'],
    deliveryDays: 4,
    inStock: true,
  },
  {
    id: 'batik-002',
    name: 'Batik Cushion Cover Set (4 pieces)',
    description: 'Set of 4 vibrant batik cushion covers featuring elephant and lotus motifs.',
    price: 4500,
    category: 'Home Decor',
    emoji: '🎨',
    tags: ['batik', 'home decor', 'cushion', 'handmade', 'colorful', 'housewarming'],
    deliveryDays: 3,
    inStock: true,
  },
  {
    id: 'spice-001',
    name: 'Ceylon Spice Collection Gift Box',
    description: 'A curated box of 8 premium Sri Lankan spices: cinnamon, cardamom, cloves, pepper, and more.',
    price: 2200,
    category: 'Spices & Food',
    emoji: '🌶️',
    tags: ['spices', 'cinnamon', 'food', 'gourmet', 'cooking', 'kitchen', 'him', 'her'],
    deliveryDays: 2,
    inStock: true,
  },
  {
    id: 'spice-002',
    name: 'Organic Ceylon Cinnamon (Premium)',
    description: "Pure Ceylon true cinnamon sticks, organically grown. The world's finest cinnamon.",
    price: 1800,
    category: 'Spices & Food',
    emoji: '🪵',
    tags: ['cinnamon', 'organic', 'spices', 'gourmet', 'healthy', 'food'],
    deliveryDays: 2,
    inStock: true,
  },
  {
    id: 'craft-001',
    name: 'Ebony Wood Elephant Figurine',
    description: 'Hand-carved ebony wood elephant, a symbol of Sri Lankan culture. Each piece is unique.',
    price: 6500,
    category: 'Handicrafts',
    emoji: '🐘',
    tags: ['elephant', 'wood', 'handicraft', 'carving', 'decor', 'souvenir', 'traditional'],
    deliveryDays: 3,
    inStock: true,
  },
  {
    id: 'craft-002',
    name: 'Traditional Dumbara Woven Mat',
    description: 'Handwoven Dumbara mat from Kandy, made using traditional techniques passed down for generations.',
    price: 3200,
    category: 'Handicrafts',
    emoji: '🎋',
    tags: ['mat', 'woven', 'traditional', 'kandy', 'handmade', 'dumbara', 'home'],
    deliveryDays: 4,
    inStock: true,
  },
  {
    id: 'craft-003',
    name: 'Kolam Mask Wall Art',
    description: 'Authentic hand-painted Kolam mask from Ambalangoda — an iconic piece of Sri Lankan folk art.',
    price: 5800,
    category: 'Handicrafts',
    emoji: '🎭',
    tags: ['mask', 'folk art', 'ambalangoda', 'wall art', 'traditional', 'cultural', 'him'],
    deliveryDays: 4,
    inStock: true,
  },
  {
    id: 'coconut-001',
    name: 'Coconut Shell Craft Gift Set',
    description: 'Beautiful set of bowls, cups, and decor items made from polished coconut shells. Eco-friendly.',
    price: 2800,
    category: 'Handicrafts',
    emoji: '🥥',
    tags: ['coconut', 'eco-friendly', 'craft', 'bowls', 'sustainable', 'kitchen'],
    deliveryDays: 3,
    inStock: true,
  },
  {
    id: 'ayur-001',
    name: 'Ayurvedic Herbal Beauty Kit',
    description: 'Traditional Sri Lankan ayurvedic beauty set with herbal oils, face pack, and natural scrubs.',
    price: 4200,
    category: 'Wellness & Beauty',
    emoji: '🌿',
    tags: ['ayurvedic', 'beauty', 'wellness', 'herbal', 'natural', 'skincare', 'her', 'birthday'],
    deliveryDays: 3,
    inStock: true,
  },
  {
    id: 'ayur-002',
    name: 'King Coconut Wellness Hamper',
    description: 'Premium hamper with king coconut oil, herbal soaps, and wellness products from Sri Lanka.',
    price: 5500,
    category: 'Wellness & Beauty',
    emoji: '🌴',
    tags: ['coconut oil', 'wellness', 'hamper', 'natural', 'premium', 'her', 'birthday'],
    deliveryDays: 3,
    inStock: true,
  },
  {
    id: 'art-001',
    name: 'Sri Lanka Watercolor Painting',
    description: 'Original watercolor painting of iconic Sri Lankan landscape by a celebrated local artist.',
    price: 15000,
    category: 'Art & Culture',
    emoji: '🖼️',
    tags: ['art', 'painting', 'landscape', 'original', 'artist', 'wall art', 'luxury'],
    deliveryDays: 5,
    inStock: true,
  },
  {
    id: 'food-001',
    name: 'Kithul Treacle & Jaggery Box',
    description: 'Premium kithul palm treacle and jaggery — a beloved and unique Sri Lankan sweetener.',
    price: 1600,
    category: 'Spices & Food',
    emoji: '🍯',
    tags: ['kithul', 'treacle', 'jaggery', 'traditional', 'food', 'sweet', 'gourmet'],
    deliveryDays: 2,
    inStock: true,
  },
  {
    id: 'tea-003',
    name: 'White Tea Luxury Collection',
    description: 'Rare hand-plucked Ceylon white tea, the most delicate and prized variety. Perfect luxury gift.',
    price: 8900,
    category: 'Tea & Beverages',
    emoji: '🌸',
    tags: ['white tea', 'luxury', 'rare', 'premium', 'tea', 'gourmet', 'him', 'her'],
    deliveryDays: 2,
    inStock: true,
  },
  {
    id: 'gem-003',
    name: 'Cat\'s Eye Gemstone Bracelet',
    description: 'Elegant bracelet featuring authentic Sri Lankan cat\'s eye gemstones set in gold-plated silver.',
    price: 18500,
    category: 'Gems & Jewelry',
    emoji: '✨',
    tags: ["cat's eye", 'bracelet', 'gemstone', 'luxury', 'jewelry', 'her', 'anniversary'],
    deliveryDays: 3,
    inStock: true,
  },
]

export const CATEGORIES = [...new Set(PRODUCTS.map((p) => p.category))]

export const SRI_LANKA_CITIES = [
  'Colombo', 'Kandy', 'Galle', 'Jaffna', 'Negombo', 'Trincomalee',
  'Anuradhapura', 'Polonnaruwa', 'Matara', 'Kurunegala', 'Ratnapura',
  'Badulla', 'Batticaloa', 'Nuwara Eliya', 'Hambantota', 'Kalutara',
  'Gampaha', 'Puttalam', 'Mannar', 'Vavuniya', 'Chilaw', 'Kegalle',
  'Ampara', 'Monaragala', 'Mullaitivu',
]

export function searchProducts(
  query: string,
  maxBudget?: number,
  category?: string,
  occasion?: string
): Product[] {
  const q = query.toLowerCase()
  const occ = occasion?.toLowerCase() ?? ''

  return PRODUCTS.filter((p) => {
    if (!p.inStock) return false
    if (maxBudget && p.price > maxBudget) return false
    if (category && p.category !== category) return false

    const matchesQuery =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some((t) => q.split(' ').some((word) => t.includes(word))) ||
      p.category.toLowerCase().includes(q)

    const matchesOccasion =
      !occ ||
      p.tags.some((t) => occ.split(' ').some((word) => t.includes(word)))

    return matchesQuery || matchesOccasion
  }).slice(0, 6)
}
