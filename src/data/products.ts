import { Product } from '@/types/product';

export const products: Product[] = [
  {
    id: '1',
    name: { fr: 'Laptop HP ProBook 450 G10', en: 'HP ProBook 450 G10 Laptop', ar: 'حاسوب HP ProBook 450 G10' },
    description: {
      fr: 'Ordinateur portable professionnel avec processeur Intel Core i7, 16Go RAM, 512Go SSD. Idéal pour les professionnels exigeants.',
      en: 'Professional laptop with Intel Core i7 processor, 16GB RAM, 512GB SSD. Ideal for demanding professionals.',
      ar: 'حاسوب محمول احترافي بمعالج Intel Core i7، ذاكرة 16 جيجا، قرص SSD 512 جيجا.'
    },
    price: 145000,
    originalPrice: 165000,
    category_id: 1, // Laptops & Computers
    brand: 'HP',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop',
    stock: 'in_stock',
    rating: 4.7,
    reviewCount: 124,
    specs: { 'Processeur': 'Intel Core i7-1355U', 'RAM': '16 Go DDR4', 'Stockage': '512 Go SSD NVMe', 'Écran': '15.6" Full HD IPS', 'OS': 'Windows 11 Pro' },
    compatibility: [],
    featured: true,
  },
  {
    id: '2',
    name: { fr: 'Lenovo ThinkPad T14s Gen 4', en: 'Lenovo ThinkPad T14s Gen 4', ar: 'Lenovo ThinkPad T14s الجيل الرابع' },
    description: {
      fr: 'Le compagnon idéal des professionnels en déplacement. Ultra-léger, performant et sécurisé.',
      en: 'The ideal companion for professionals on the go. Ultra-light, powerful and secure.',
      ar: 'الرفيق المثالي للمهنيين أثناء التنقل. خفيف الوزن وقوي وآمن.'
    },
    price: 198000,
    category_id: 1, // Laptops & Computers
    brand: 'Lenovo',
    image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&h=400&fit=crop',
    stock: 'in_stock',
    rating: 4.8,
    reviewCount: 89,
    specs: { 'Processeur': 'Intel Core i7-1365U', 'RAM': '16 Go LPDDR5', 'Stockage': '512 Go SSD', 'Écran': '14" 2.8K OLED', 'OS': 'Windows 11 Pro' },
    featured: true,
  },
  {
    id: '3',
    name: { fr: 'Écran LCD 15.6" Full HD', en: '15.6" Full HD LCD Screen', ar: 'شاشة LCD 15.6 بوصة Full HD' },
    description: {
      fr: 'Écran de remplacement compatible avec la plupart des laptops 15.6 pouces. Résolution Full HD 1920x1080.',
      en: 'Replacement screen compatible with most 15.6-inch laptops. Full HD 1920x1080 resolution.',
      ar: 'شاشة بديلة متوافقة مع معظم الحواسيب المحمولة 15.6 بوصة.'
    },
    price: 12500,
    originalPrice: 15000,
    category_id: 17, // Screens (Spare Parts)
    brand: 'Generic',
    image: 'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=600&h=400&fit=crop',
    stock: 'in_stock',
    rating: 4.5,
    reviewCount: 234,
    compatibility: ['HP', 'Dell', 'Lenovo', 'Acer', 'ASUS'],
    featured: true,
  },
  {
    id: '4',
    name: { fr: 'Batterie Laptop Universelle 4400mAh', en: 'Universal Laptop Battery 4400mAh', ar: 'بطارية حاسوب محمول عالمية 4400mAh' },
    description: {
      fr: 'Batterie haute capacité compatible avec une large gamme de laptops. Longue durée et fiabilité.',
      en: 'High-capacity battery compatible with a wide range of laptops. Long-lasting and reliable.',
      ar: 'بطارية عالية السعة متوافقة مع مجموعة واسعة من الحواسيب المحمولة.'
    },
    price: 8500,
    category_id: 15, // Batteries (Spare Parts)
    brand: 'Generic',
    image: 'https://images.unsplash.com/photo-1619953942547-233eab5a70d6?w=600&h=400&fit=crop',
    stock: 'low_stock',
    rating: 4.3,
    reviewCount: 167,
    compatibility: ['HP Pavilion', 'HP ProBook', 'Dell Inspiron'],
    featured: true,
  },
  {
    id: '5',
    name: { fr: 'SSD NVMe 1To Samsung 980 Pro', en: 'Samsung 980 Pro 1TB NVMe SSD', ar: 'قرص SSD NVMe 1 تيرا Samsung 980 Pro' },
    description: {
      fr: 'Le SSD NVMe le plus rapide pour booster les performances de votre laptop. Vitesse de lecture jusqu\'à 7000 Mo/s.',
      en: 'The fastest NVMe SSD to boost your laptop performance. Read speed up to 7000 MB/s.',
      ar: 'أسرع قرص SSD NVMe لتعزيز أداء حاسوبك المحمول.'
    },
    price: 18500,
    originalPrice: 22000,
    category_id: 10, // Storage
    brand: 'Samsung',
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&h=400&fit=crop',
    stock: 'in_stock',
    rating: 4.9,
    reviewCount: 312,
    specs: { 'Capacité': '1 To', 'Interface': 'PCIe Gen 4 NVMe', 'Lecture': '7000 Mo/s', 'Écriture': '5100 Mo/s' },
    featured: true,
  },
  {
    id: '6',
    name: { fr: 'RAM DDR4 16Go (2x8Go) 3200MHz', en: '16GB (2x8GB) DDR4 3200MHz RAM', ar: 'ذاكرة RAM DDR4 16 جيجا (2x8)' },
    description: {
      fr: 'Kit mémoire DDR4 haute performance pour upgrader votre laptop. Compatible avec la plupart des modèles récents.',
      en: 'High-performance DDR4 memory kit to upgrade your laptop. Compatible with most recent models.',
      ar: 'طقم ذاكرة DDR4 عالي الأداء لترقية حاسوبك المحمول.'
    },
    price: 7200,
    category_id: 8, // RAM
    brand: 'Kingston',
    image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=600&h=400&fit=crop',
    stock: 'in_stock',
    rating: 4.6,
    reviewCount: 198,
    featured: true,
  },
  {
    id: '7',
    name: { fr: 'Chargeur Universel 65W USB-C', en: '65W USB-C Universal Charger', ar: 'شاحن عالمي 65 واط USB-C' },
    description: {
      fr: 'Chargeur USB-C universel compatible avec la majorité des laptops modernes. Charge rapide et sûre.',
      en: 'Universal USB-C charger compatible with most modern laptops. Fast and safe charging.',
      ar: 'شاحن USB-C عالمي متوافق مع معظم الحواسيب المحمولة الحديثة.'
    },
    price: 4500,
    category_id: 18, // Chargers
    brand: 'Generic',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&h=400&fit=crop',
    stock: 'in_stock',
    rating: 4.4,
    reviewCount: 276,
    compatibility: ['HP', 'Lenovo', 'Dell', 'ASUS'],
  },
  {
    id: '8',
    name: { fr: 'Clavier de remplacement HP', en: 'HP Replacement Keyboard', ar: 'لوحة مفاتيح بديلة HP' },
    description: {
      fr: 'Clavier de remplacement pour HP ProBook et EliteBook. Rétroéclairé, disposition AZERTY.',
      en: 'Replacement keyboard for HP ProBook and EliteBook. Backlit, AZERTY layout.',
      ar: 'لوحة مفاتيح بديلة لـ HP ProBook و EliteBook.'
    },
    price: 5800,
    category_id: 12, // Keyboards
    brand: 'HP',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=400&fit=crop',
    stock: 'in_stock',
    rating: 4.5,
    reviewCount: 143,
    compatibility: ['HP ProBook 450', 'HP ProBook 440', 'HP EliteBook 840'],
  },
  {
    id: '9',
    name: { fr: 'Ventilateur de refroidissement Dell', en: 'Dell Cooling Fan', ar: 'مروحة تبريد Dell' },
    description: {
      fr: 'Ventilateur de remplacement pour Dell Latitude et Inspiron. Silencieux et efficace.',
      en: 'Replacement fan for Dell Latitude and Inspiron. Silent and efficient.',
      ar: 'مروحة بديلة لـ Dell Latitude و Inspiron. هادئة وفعالة.'
    },
    price: 3200,
    category_id: 5, // PC Components
    brand: 'Dell',
    image: 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=600&h=400&fit=crop',
    stock: 'in_stock',
    rating: 4.2,
    reviewCount: 87,
    compatibility: ['Dell Latitude 5520', 'Dell Inspiron 15'],
  },
  {
    id: '10',
    name: { fr: 'Support Laptop Ergonomique', en: 'Ergonomic Laptop Stand', ar: 'حامل حاسوب محمول مريح' },
    description: {
      fr: 'Support en aluminium ajustable pour laptop. Améliore la posture et le refroidissement.',
      en: 'Adjustable aluminum laptop stand. Improves posture and cooling.',
      ar: 'حامل ألمنيوم قابل للتعديل للحاسوب المحمول.'
    },
    price: 3500,
    category_id: 11, // Peripherals
    brand: 'Generic',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=400&fit=crop',
    stock: 'in_stock',
    rating: 4.6,
    reviewCount: 203,
  },
];

export const categories = [
  { id: 'laptops-portables', icon: '💻', name: { en: 'Laptops & Portables', fr: 'Ordinateurs Portables & Laptop', ar: 'الحواسيب المحمولة' } },
  { id: 'pc-components', icon: '⚙️', name: { en: 'PC Components', fr: 'Composants PC', ar: 'مكونات الحاسوب' } },
  { id: 'spare-parts', icon: '🔧', name: { en: 'Spare Parts', fr: 'Pièces de rechange', ar: 'قطع غيار' } },
  { id: 'screens-monitors', icon: '🖥️', name: { en: 'Screens & Monitors', fr: 'Écrans & Moniteur pc', ar: 'شاشات وحواسب' } },
  { id: 'pc-peripherals', icon: '⌨️', name: { en: 'PC PERIPHERALS', fr: 'PÉRIPHÉRIQUE PC', ar: 'ملحقات الحاسوب' } },
  { id: 'chairs', icon: '💺', name: { en: 'Chairs', fr: 'CHAISES', ar: 'كراسي' } },
  { id: 'bags-cases', icon: '🎒', name: { en: 'Bags & Cases', fr: 'Cartables', ar: 'حقائب' } },
  { id: 'storage', icon: '💾', name: { en: 'STORAGE', fr: 'STOCKAGE', ar: 'تخزين' } },
  { id: 'cables', icon: '🔌', name: { en: 'CABLES', fr: 'CÂBLES', ar: 'كابلات' } },
  { id: 'printers-scanners', icon: '🖨️', name: { en: 'PRINTERS & SCANNERS', fr: 'IMPRIMANTE & SCANNER', ar: 'طابعات وماسحات' } },
  { id: 'consoles-gaming', icon: '🎮', name: { en: 'CONSOLES & GAMING', fr: 'CONSOLES & JEUX', ar: 'كنسول وألعاب' } },
  { id: 'camera-universe', icon: '📷', name: { en: 'CAMERA UNIVERSE', fr: 'UNIVERS CAMÉRA', ar: 'عالم الكاميرات' } },
];

export const brands = ['HP', 'Lenovo', 'Dell', 'Samsung', 'Kingston', 'ASUS', 'Acer', 'Generic'];
