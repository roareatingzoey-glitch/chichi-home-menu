export type Ingredient = {
  cn: string;
  fr: string;
};

export type Meal = {
  categoryCn: string;
  categoryFr: string;
  nameCn: string;
  nameFr: string;
  ingredients: Ingredient[];
  icon?: string;
  seasons?: string[];
};

export const menuData: Meal[] = [
  { categoryCn: '汤', categoryFr: 'Soupes', nameCn: '韩式参鸡汤', nameFr: 'Soupe au ginseng coréenne', ingredients: [{ cn: '鸡', fr: 'poulet' }], icon: 'bowl' },
  { categoryCn: '汤', categoryFr: 'Soupes', nameCn: '白芸豆猪蹄汤', nameFr: 'Soupe haricots blancs et porc', ingredients: [{ cn: '猪蹄', fr: 'porc' }], icon: 'bowl' },
  { categoryCn: '汤', categoryFr: 'Soupes', nameCn: '冬瓜猪骨祛湿汤', nameFr: 'Soupe courge et os de porc', ingredients: [
  { cn: '猪骨', fr: 'os de porc' },
  { cn: '薏米', fr: 'grains de coix (job’s tears)' },
  { cn: '芡实', fr: 'graines de lotus séchées' },
  { cn: '姜片', fr: 'gingembre (en tranches)' },
  { cn: '陈皮', fr: 'écorce de mandarine séchée' },
  { cn: '无花果', fr: 'figues séchées' }
], icon: 'bowl' },

  {
    categoryCn: '炖菜',
    categoryFr: 'Mijotés',
    nameCn: '法式炖羊肉',
    nameFr: 'Ragoût d’agneau à la française',
    ingredients: [
      { cn: '羊肉', fr: 'agneau' },
      { cn: '胡萝卜', fr: 'carottes' },
      { cn: '土豆', fr: 'pommes de terre' },
      { cn: '洋葱', fr: 'oignons' },
    ],
    icon: 'pot',
  },
  {
    categoryCn: '炖菜',
    categoryFr: 'Mijotés',
    nameCn: '勃垦第炖牛肉',
    nameFr: 'Bœuf bourguignon',
    ingredients: [
      { cn: '牛肉', fr: 'bœuf' },
      { cn: '红酒', fr: 'vin rouge' },
      { cn: '胡萝卜', fr: 'carottes' },
      { cn: '蘑菇', fr: 'champignons' },
    ],
    icon: 'plate',
  },
  {
    categoryCn: '炖菜',
    categoryFr: 'Mijotés',
    nameCn: '红烧肉',
    nameFr: 'Porc braisé à la chinoise',
    ingredients: [
      { cn: '五花肉', fr: 'poitrine de porc' },
      { cn: '酱油', fr: 'sauce soja' },
      { cn: '糖', fr: 'sucre' },
      { cn: '姜', fr: 'gingembre' },
    ],
    icon: 'bowl',
  },

  {
    categoryCn: '家常菜',
    categoryFr: 'Plats du quotidien',
    nameCn: '番茄炒鸡蛋',
    nameFr: 'Œufs brouillés à la tomate',
    ingredients: [
      { cn: '鸡蛋', fr: 'œufs' },
      { cn: '番茄', fr: 'tomates' },
      { cn: '盐', fr: 'sel' },
      { cn: '油', fr: 'huile' },
    ],
    icon: 'pan',
  },
  {
    categoryCn: '家常菜',
    categoryFr: 'Plats du quotidien',
    nameCn: '水蛋蒸西兰花',
    nameFr: 'Œufs vapeur au brocoli',
    ingredients: [
      { cn: '鸡蛋', fr: 'œufs' },
      { cn: '西兰花', fr: 'brocoli' },
      { cn: '水', fr: 'eau' },
    ],
    icon: 'broccoli',
  },
  {
    categoryCn: '家常菜',
    categoryFr: 'Plats du quotidien',
    nameCn: '斋水蛋',
    nameFr: 'Œufs vapeur nature',
    ingredients: [
      { cn: '鸡蛋', fr: 'œufs' },
      { cn: '水', fr: 'eau' },
    ],
    icon: 'egg',
  },
  {
    categoryCn: '家常菜',
    categoryFr: 'Plats du quotidien',
    nameCn: '香煎五花肉',
    nameFr: 'Poitrine de porc grillée à la poêle',
    ingredients: [
      { cn: '五花肉', fr: 'poitrine de porc' },
      { cn: '盐', fr: 'sel' },
      { cn: '黑胡椒', fr: 'poivre' },
    ],
    icon: 'pan',
  },
  {
    categoryCn: '家常菜',
    categoryFr: 'Plats du quotidien',
    nameCn: '肉末豆腐',
    nameFr: 'Tofu au porc haché',
    ingredients: [
      { cn: '豆腐', fr: 'tofu' },
      { cn: '猪肉末', fr: 'porc haché' },
      { cn: '酱油', fr: 'sauce soja' },
    ],
    icon: 'bowl',
  },
  {
    categoryCn: '家常菜',
    categoryFr: 'Plats du quotidien',
    nameCn: '黄瓜炒鸡蛋',
    nameFr: 'Œufs sautés au concombre',
    ingredients: [
      { cn: '鸡蛋', fr: 'œufs' },
      { cn: '黄瓜', fr: 'concombre' },
    ],
    icon: 'pan',
  },
  {
    categoryCn: '家常菜',
    categoryFr: 'Plats du quotidien',
    nameCn: '牛肉末炒西葫芦',
    nameFr: 'Bœuf haché sauté à la courgette',
    ingredients: [
      { cn: '牛肉末', fr: 'bœuf haché' },
      { cn: '西葫芦', fr: 'courgette' },
    ],
    icon: 'pan',
  },
  {
    categoryCn: '家常菜',
    categoryFr: 'Plats du quotidien',
    nameCn: '韭菜煎鸡蛋',
    nameFr: 'Omelette à la ciboulette chinoise',
    ingredients: [
      { cn: '鸡蛋', fr: 'œufs' },
      { cn: '韭菜', fr: 'ciboulette chinoise' },
    ],
    icon: 'egg',
  },
  {
    categoryCn: '家常菜',
    categoryFr: 'Plats du quotidien',
    nameCn: '蒜苔炒肉',
    nameFr: 'Porc sauté aux tiges d’ail',
    ingredients: [
      { cn: '猪肉', fr: 'porc' },
      { cn: '蒜苔', fr: 'tiges d’ail' },
    ],
    icon: 'pan',
  },
  {
  categoryCn: '家常菜',
  categoryFr: 'Plats du quotidien',
  nameCn: '口蘑炒牛肉（可加韭菜）',
  nameFr: 'Bœuf sauté aux champignons de Paris (option ciboulette)',
  ingredients: [
    { cn: '口蘑', fr: 'champignons de Paris' },
    { cn: '牛肉', fr: 'bœuf' },
    { cn: '韭菜（可选）', fr: 'ciboulette chinoise (optionnel)' },
  ],
  icon: 'pan',
},
{
  categoryCn: '家常菜',
  categoryFr: 'Plats du quotidien',
  nameCn: '广式腊肠炒荷兰豆',
  nameFr: 'Pois gourmands sautés à la saucisse chinoise',
  ingredients: [
    { cn: '广式腊肠', fr: 'saucisse chinoise (lap cheong)' },
    { cn: '荷兰豆', fr: 'pois gourmands' },
  ],
  icon: 'pan',
},
{
  categoryCn: '家常菜',
  categoryFr: 'Plats du quotidien',
  nameCn: '午餐肉炒黄牙白',
  nameFr: 'Chou chinois sauté au spam',
  ingredients: [
    { cn: '午餐肉', fr: 'spam (jambon en boîte)' },
    { cn: '黄牙白', fr: 'chou chinois' },
  ],
  icon: 'pan',
},
{
  categoryCn: '家常菜',
  categoryFr: 'Plats du quotidien',
  nameCn: '滑蛋午餐肉',
  nameFr: 'Œufs brouillés crémeux au spam',
  ingredients: [
    { cn: '鸡蛋', fr: 'œufs' },
    { cn: '午餐肉', fr: 'spam (jambon en boîte)' },
  ],
  icon: 'egg',
},
  {
    categoryCn: '家常菜',
    categoryFr: 'Plats du quotidien',
    nameCn: '可乐鸡腿',
    nameFr: 'Pilons de poulet au Coca-Cola',
    ingredients: [
      { cn: '鸡腿', fr: 'pilons de poulet' },
      { cn: '可乐', fr: 'Coca-Cola' },
      { cn: '酱油', fr: 'sauce soja' },
    ],
    icon: 'plate',
  },

  {
    categoryCn: '蔬菜',
    categoryFr: 'Légumes',
    nameCn: '普罗旺斯炖菜',
    nameFr: 'Ratatouille',
    ingredients: [
      { cn: '西葫芦', fr: 'courgette' },
      { cn: '茄子', fr: 'aubergine' },
      { cn: '番茄', fr: 'tomates' },
    ],
    icon: 'veg-mix',
  },
  {
    categoryCn: '蔬菜',
    categoryFr: 'Légumes',
    nameCn: '清炒西兰花',
    nameFr: 'Brocoli sauté nature',
    ingredients: [
      { cn: '西兰花', fr: 'brocoli' },
      { cn: '盐', fr: 'sel' },
    ],
    icon: 'broccoli',
  },
  {
    categoryCn: '蔬菜',
    categoryFr: 'Légumes',
    nameCn: '蒜蓉炒菜心/上海青/小白菜/大白菜',
    nameFr: 'Légumes sautés à l’ail',
    ingredients: [
      { cn: '青菜', fr: 'légumes verts' },
      { cn: '蒜', fr: 'ail' },
    ],
    icon: 'leaf',
  },
  {
    categoryCn: '蔬菜',
    categoryFr: 'Légumes',
    nameCn: '姜末芥蓝',
    nameFr: 'Gaï-lan sauté au gingembre',
    ingredients: [
      { cn: '芥蓝', fr: 'gaï-lan' },
      { cn: '姜', fr: 'gingembre' },
    ],
    icon: 'leaf',
  },

  {
    categoryCn: '氛围料理',
    categoryFr: 'Moments',
    nameCn: '粥底火锅',
    nameFr: 'Hotpot au porridge',
    ingredients: [{ cn: '粥底', fr: 'bouillie' }],
  },
  {
    categoryCn: '氛围料理',
    categoryFr: 'Moments',
    nameCn: '韩式烤肉',
    nameFr: 'BBQ coréen',
    ingredients: [{ cn: '肉', fr: 'viande' }],
  },
  {
    categoryCn: '氛围料理',
    categoryFr: 'Moments',
    nameCn: '麻辣烫',
    nameFr: 'Mala tang',
    ingredients: [{ cn: '食材', fr: 'ingrédients' }],
  },
  {
    categoryCn: '氛围料理',
    categoryFr: 'Moments',
    nameCn: '麻辣香锅',
    nameFr: 'Mala xiang guo',
    ingredients: [{ cn: '食材', fr: 'ingrédients' }],
  },
  {
    categoryCn: '氛围料理',
    categoryFr: 'Moments',
    nameCn: '团团圆圆包饺子',
    nameFr: 'Raviolis maison',
    ingredients: [{ cn: '面皮', fr: 'pâte' }],
  },

  {
    categoryCn: '甜品',
    categoryFr: 'Desserts',
    nameCn: 'Yaomade 华夫饼',
    nameFr: 'Gaufre',
    ingredients: [{ cn: '面粉', fr: 'farine' }],
  },
  {
    categoryCn: '甜品',
    categoryFr: 'Desserts',
    nameCn: 'Yaomade 可丽饼',
    nameFr: 'Crêpe',
    ingredients: [{ cn: '面粉', fr: 'farine' }],
  },
  {
    categoryCn: '甜品',
    categoryFr: 'Desserts',
    nameCn: '椰子奶冻（制作需至少6小时）',
    nameFr: 'Gelée coco',
    ingredients: [{ cn: '椰奶', fr: 'coco' }],
  },
  {
    categoryCn: '甜品',
    categoryFr: 'Desserts',
    nameCn: '麦芬蛋糕',
    nameFr: 'Muffin',
    ingredients: [{ cn: '面粉', fr: 'farine' }],
  },
  {
    categoryCn: '甜品',
    categoryFr: 'Desserts',
    nameCn: '铜锣烧',
    nameFr: 'Dorayaki',
    ingredients: [{ cn: '红豆', fr: 'haricot rouge' }],
  },
  {
    categoryCn: '甜品',
    categoryFr: 'Desserts',
    nameCn: '汤圆（酒酿）',
    nameFr: 'Tangyuan',
    ingredients: [{ cn: '糯米', fr: 'riz gluant' }],
  },
  {
    categoryCn: '甜品',
    categoryFr: 'Desserts',
    nameCn: '金小馒头',
    nameFr: 'Petits pains dorés',
    ingredients: [{ cn: '面粉', fr: 'farine' }],
  },

  {
    categoryCn: '饮品',
    categoryFr: 'Boissons',
    nameCn: '伯牙绝弦',
    nameFr: 'Thé spécial',
    ingredients: [{ cn: '茶', fr: 'thé' }],
  },
  {
    categoryCn: '饮品',
    categoryFr: 'Boissons',
    nameCn: '万里木兰（锡兰奶茶）',
    nameFr: 'Thé au lait de Ceylan',
    ingredients: [{ cn: '锡兰红茶', fr: 'thé de Ceylan' }],
  },
  {
    categoryCn: '饮品',
    categoryFr: 'Boissons',
    nameCn: '茉莉pomme奶绿',
    nameFr: 'Thé jasmin pomme',
    ingredients: [{ cn: '茉莉茶', fr: 'thé au jasmin' }],
  },
  {
    categoryCn: '饮品',
    categoryFr: 'Boissons',
    nameCn: '国宴豆浆',
    nameFr: 'Lait de soja',
    ingredients: [{ cn: '豆浆', fr: 'soja' }],
  },
  {
    categoryCn: '饮品',
    categoryFr: 'Boissons',
    nameCn: 'yaomade拿铁',
    nameFr: 'Latte',
    ingredients: [{ cn: '咖啡', fr: 'café' }],
  },
];