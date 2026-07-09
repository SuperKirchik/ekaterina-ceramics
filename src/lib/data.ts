export type ProductStatus = "available" | "sold" | "preorder";

export type Product = {
  id: string;
  title: string;
  slug: string;
  price: number;
  oldPrice?: number;
  category: string;
  collection: string;
  status: ProductStatus;
  shortDescription: string;
  description: string;
  material: string;
  dimensions: string;
  color: string;
  texture: string;
  care: string;
  featured: boolean;
  image: string;
  gallery: string[];
};

export const collections = [
  {
    title: "Камень",
    slug: "stone",
    description:
      "Фактурные объекты, напоминающие природный камень, землю и минеральные поверхности.",
    image:
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1400&q=85",
  },
  {
    title: "Форма",
    slug: "form",
    description:
      "Биоморфные скульптурные объекты с мягкими линиями и живой пластикой.",
    image:
      "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=1400&q=85",
  },
  {
    title: "Земля",
    slug: "earth",
    description:
      "Теплые природные оттенки, шероховатые поверхности и ощущение ручной работы.",
    image:
      "https://images.unsplash.com/photo-1603204077779-bed963ea7d0e?auto=format&fit=crop&w=1400&q=85",
  },
  {
    title: "Свет",
    slug: "light",
    description:
      "Светильники и объекты, работающие с мягким светом, тенью и атмосферой дома.",
    image:
      "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1400&q=85",
  },
];

export const products: Product[] = [
  {
    id: "p-01",
    title: "Ваза Тихий камень",
    slug: "quiet-stone-vase",
    price: 12400,
    category: "вазы",
    collection: "Камень",
    status: "available",
    shortDescription: "Минеральная форма для сухих ветвей и спокойных интерьеров.",
    description:
      "Ассиметричная ваза с матовой поверхностью и мягким песочным подтоном. Создана вручную малой серией.",
    material: "Шамотная глина, матовая глазурь",
    dimensions: "28 x 16 x 13 см",
    color: "песочный, серо-бежевый",
    texture: "шероховатая, каменная",
    care: "Протирать сухой мягкой тканью. Не использовать абразивы.",
    featured: true,
    image:
      "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1200&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1200&q=85",
    ],
  },
  {
    id: "p-02",
    title: "Настольный светильник Сумерки",
    slug: "sumireki-lamp",
    price: 28600,
    category: "светильники",
    collection: "Свет",
    status: "preorder",
    shortDescription: "Керамический светильник с теплым рассеянным светом.",
    description:
      "Скульптурное основание с ручной фактурой и льняным абажуром для спальни, кабинета или гостиной.",
    material: "Керамика, лен, латунная фурнитура",
    dimensions: "42 x 24 x 24 см",
    color: "молочный, теплый серый",
    texture: "матовая, слегка пористая",
    care: "Керамическую часть протирать сухой тканью, абажур очищать мягкой щеткой.",
    featured: true,
    image:
      "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1200&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=85",
    ],
  },
  {
    id: "p-03",
    title: "Аромадиффузор Земля после дождя",
    slug: "earth-after-rain",
    price: 7900,
    category: "диффузоры",
    collection: "Земля",
    status: "available",
    shortDescription: "Керамический сосуд для аромата с древесными и минеральными нотами.",
    description:
      "Тактильный сосуд с узким горлом и набором палочек. Аромат подбирается индивидуально перед отправкой.",
    material: "Керамика, ротанговые палочки, ароматическая композиция",
    dimensions: "14 x 9 x 9 см",
    color: "глина, табачный, теплый серый",
    texture: "ручная лепка, живая неровность",
    care: "Не переворачивать наполненный сосуд. Беречь от открытого огня.",
    featured: true,
    image:
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1603204077779-bed963ea7d0e?auto=format&fit=crop&w=1200&q=85",
    ],
  },
  {
    id: "p-04",
    title: "Скульптурная форма Линия",
    slug: "line-sculptural-form",
    price: 16800,
    category: "арт-объекты",
    collection: "Форма",
    status: "sold",
    shortDescription: "Единственный объект с мягкой биоморфной пластикой.",
    description:
      "Эта работа уже нашла свой дом, но похожую форму можно выполнить на заказ с небольшими отличиями.",
    material: "Каменная масса, ангоб",
    dimensions: "31 x 21 x 11 см",
    color: "слоновая кость, графитовая тень",
    texture: "бархатистая матовая поверхность",
    care: "Только сухая чистка.",
    featured: true,
    image:
      "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=1200&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1597696929736-6d13bed8e6a8?auto=format&fit=crop&w=1200&q=85",
    ],
  },
  {
    id: "p-05",
    title: "Чаша Минеральный берег",
    slug: "mineral-shore-bowl",
    price: 9200,
    category: "блюда",
    collection: "Камень",
    status: "available",
    shortDescription: "Низкая декоративная чаша для ключей, украшений или пустого пространства.",
    description:
      "Широкая форма с неровным краем и спокойной минеральной глазурью. Каждый экземпляр немного отличается.",
    material: "Шамот, глазурь ручного нанесения",
    dimensions: "7 x 25 x 22 см",
    color: "каменный, молочный, серо-оливковый",
    texture: "зернистая, с мягкими переливами",
    care: "Можно протирать слегка влажной тканью.",
    featured: true,
    image:
      "https://images.unsplash.com/photo-1603204077779-bed963ea7d0e?auto=format&fit=crop&w=1200&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1603204077779-bed963ea7d0e?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1200&q=85",
    ],
  },
  {
    id: "p-06",
    title: "Ваза Воздух",
    slug: "air-vase",
    price: 14200,
    category: "вазы",
    collection: "Форма",
    status: "preorder",
    shortDescription: "Высокая ваза с вытянутым силуэтом и легкой ручной асимметрией.",
    description:
      "Подходит для одной ветви, сухоцветов или как самостоятельный объект на консоли.",
    material: "Белая глина, матовая глазурь",
    dimensions: "35 x 12 x 12 см",
    color: "молочный, теплый белый",
    texture: "гладкая с ручными следами",
    care: "Для сухих композиций. Воду использовать только после проверки герметичности.",
    featured: false,
    image:
      "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1200&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1597696929736-6d13bed8e6a8?auto=format&fit=crop&w=1200&q=85",
    ],
  },
  {
    id: "p-07",
    title: "Подсвечник Мягкая тень",
    slug: "soft-shadow-candleholder",
    price: 6800,
    category: "арт-объекты",
    collection: "Свет",
    status: "available",
    shortDescription: "Небольшой объект для свечи и вечернего света.",
    description:
      "Низкая фактурная форма, которая красиво собирает тень на столе или полке.",
    material: "Керамика, минеральный пигмент",
    dimensions: "9 x 11 x 11 см",
    color: "оливково-серый",
    texture: "шероховатая матовая",
    care: "Удалять воск после полного остывания.",
    featured: true,
    image:
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1200&q=85",
    ],
  },
  {
    id: "p-08",
    title: "Панно След воды",
    slug: "water-trace-panel",
    price: 21800,
    category: "арт-объекты",
    collection: "Земля",
    status: "available",
    shortDescription: "Настенное панно с ритмом природной поверхности.",
    description:
      "Рельефный объект для тихого акцента в интерьере. Крепление подбирается под стену.",
    material: "Каменная масса, оксиды",
    dimensions: "44 x 31 x 4 см",
    color: "глина, песок, графит",
    texture: "рельефная, минеральная",
    care: "Сухая чистка мягкой щеткой.",
    featured: false,
    image:
      "https://images.unsplash.com/photo-1597696929736-6d13bed8e6a8?auto=format&fit=crop&w=1200&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1597696929736-6d13bed8e6a8?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1200&q=85",
    ],
  },
];

export const categories = [
  "Все",
  "светильники",
  "вазы",
  "блюда",
  "арт-объекты",
  "диффузоры",
  "ароматы",
];

export const statuses: Record<ProductStatus, string> = {
  available: "В наличии",
  sold: "Продано",
  preorder: "Под заказ",
};

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("ru-RU").format(price) + " ₽";

export const getProduct = (slug: string) =>
  products.find((product) => product.slug === slug);
