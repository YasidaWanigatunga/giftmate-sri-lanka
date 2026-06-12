export type Product = {
  id: string;
  name: string;
  category: "cake" | "flowers" | "electronics" | "fashion" | "toys" | "jewelry" | "food";
  price: number;
  image: string;
  description: string;
  occasions: string[];
  recipients: string[];
  cities: string[];
  sameDayAvailable: boolean;
};

export const mockProducts: Product[] = [
  {
    id: "p1",
    name: "Chocolate Truffle Cake (1kg)",
    category: "cake",
    price: 3500,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400",
    description: "Rich chocolate truffle cake, perfect for birthdays.",
    occasions: ["Birthday", "Anniversary"],
    recipients: ["Mother", "Father", "Friend", "Girlfriend", "Boyfriend"],
    cities: ["Colombo", "Kandy", "Galle", "Negombo"],
    sameDayAvailable: true,
  },
  {
    id: "p2",
    name: "Red Rose Bouquet (12 roses)",
    category: "flowers",
    price: 4200,
    image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400",
    description: "Fresh red roses, hand-tied with greenery.",
    occasions: ["Anniversary", "Valentine's Day", "Birthday"],
    recipients: ["Girlfriend", "Boyfriend", "Mother", "Wife"],
    cities: ["Colombo", "Kandy", "Negombo"],
    sameDayAvailable: true,
  },
  {
    id: "p3",
    name: "Wireless Bluetooth Earbuds",
    category: "electronics",
    price: 6800,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400",
    description: "Compact earbuds with charging case, great for tech-lovers.",
    occasions: ["Birthday", "Graduation", "Anniversary"],
    recipients: ["Friend", "Brother", "Sister", "Boyfriend", "Girlfriend"],
    cities: ["Colombo", "Kandy", "Galle", "Jaffna", "Negombo"],
    sameDayAvailable: false,
  },
  {
    id: "p4",
    name: "Handmade Greeting Card + Chocolate Box",
    category: "food",
    price: 1800,
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400",
    description: "A heartfelt card paired with assorted chocolates.",
    occasions: ["Birthday", "Get Well Soon", "Thank You"],
    recipients: ["Mother", "Father", "Friend", "Teacher", "Boss"],
    cities: ["Colombo", "Kandy", "Galle", "Jaffna", "Negombo", "Matara"],
    sameDayAvailable: true,
  },
  {
    id: "p5",
    name: "Silver Pendant Necklace",
    category: "jewelry",
    price: 6500,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400",
    description: "Elegant sterling silver pendant with chain.",
    occasions: ["Anniversary", "Birthday", "Valentine's Day"],
    recipients: ["Mother", "Girlfriend", "Wife", "Sister"],
    cities: ["Colombo", "Kandy"],
    sameDayAvailable: false,
  },
  {
    id: "p6",
    name: "Vanilla Cupcake Box (6 pcs)",
    category: "cake",
    price: 2200,
    image: "https://images.unsplash.com/photo-1607478900766-efe13248b125?w=400",
    description: "Soft vanilla cupcakes with buttercream frosting.",
    occasions: ["Birthday", "Congratulations"],
    recipients: ["Friend", "Sister", "Brother", "Boss", "Mother"],
    cities: ["Colombo", "Negombo", "Galle"],
    sameDayAvailable: true,
  },
  {
    id: "p7",
    name: "Remote Control Toy Car",
    category: "toys",
    price: 3200,
    image: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=400",
    description: "Fun RC car for kids, rechargeable battery.",
    occasions: ["Birthday", "Children's Day"],
    recipients: ["Son", "Daughter", "Nephew", "Niece"],
    cities: ["Colombo", "Kandy", "Galle", "Negombo"],
    sameDayAvailable: false,
  },
  {
    id: "p8",
    name: "Premium Leather Wallet",
    category: "fashion",
    price: 4500,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400",
    description: "Genuine leather wallet with multiple card slots.",
    occasions: ["Birthday", "Father's Day", "Anniversary"],
    recipients: ["Father", "Boyfriend", "Brother", "Boss"],
    cities: ["Colombo", "Kandy", "Galle", "Jaffna"],
    sameDayAvailable: false,
  },
];