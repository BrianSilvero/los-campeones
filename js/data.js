// =====================================================================
//  DATOS DE LOS CAMPEONES — el único archivo que hay que editar.
//  Precios: carta delivery vigente (PDF). Descripciones marcadas con
//  "revisar" las escribió Claude: el dueño debe confirmarlas.
//  Más adelante todo esto vendrá del panel admin (Convex).
// =====================================================================

// Modo salón: el QR/NFC de los acrílicos abre la web con este parámetro
// (ej: pizzerialoscampeones.com/?salon). Muestra solo la carta, sin pedidos.
const SALON_PARAM = "salon";

const BUSINESS = {
  founded: 1954,
  address: "Av. Montes de Oca 856, Barracas, CABA",
  maps: "https://maps.google.com/?q=Av.+Montes+de+Oca+856,+Barracas,+CABA",
  email: "pizzerialoscampeones@gmail.com",
  whatsapp: "5491124795495",
  whatsappLabel: "11-2479-5495",
  phones: ["11-4301-7813", "11-4301-0572", "11-4303-8456", "11-2110-8888"],
  mainPhone: "+541143017813",
  instagram: "", // pegá acá el link cuando lo tengan
  facebook: "",
  // 0 = domingo … 6 = sábado. Lunes cerrado.
  openDays: [0, 2, 3, 4, 5, 6],
  openFrom: 8, // 08:00
  openTo: 24,  // 00:00
};

// Menú del mediodía: martes a viernes de 12 a 16
const LUNCH = { days: [2, 3, 4, 5], from: 12, to: 16 };

// Promo del día (vacío = no se muestra)
const PROMO = { es: "", en: "", pt: "" };

// ---------------------------------------------------------------------
//  CATEGORÍAS  (type "pizza" = tarjeta con 4 tamaños · "list" = lista)
// ---------------------------------------------------------------------
const CATEGORIES = [
  { id: "mediodia",   icon: "cutlery", type: "list",  name: { es: "Menú del mediodía", en: "Lunch menu", pt: "Menu do almoço" }, short: { es: "Mediodía", en: "Lunch", pt: "Almoço" } },
  { id: "clasicas",   icon: "pizza",   type: "pizza", name: { es: "Pizzas clásicas", en: "Classic pizzas", pt: "Pizzas clássicas" }, short: { es: "Clásicas", en: "Classic", pt: "Clássicas" } },
  { id: "especiales", icon: "cup",     type: "pizza", name: { es: "Pizzas especiales", en: "Special pizzas", pt: "Pizzas especiais" }, short: { es: "Especiales", en: "Specials", pt: "Especiais" } },
  { id: "porciones",  icon: "slice",   type: "list",  name: { es: "Porciones y fainá", en: "Slices & fainá", pt: "Fatias e fainá" }, short: { es: "Porciones", en: "Slices", pt: "Fatias" } },
  { id: "calzones",   icon: "calzone", type: "list",  name: { es: "Calzones", en: "Calzones", pt: "Calzones" } },
  { id: "empanadas",  icon: "empanada",type: "list",  name: { es: "Empanadas", en: "Empanadas", pt: "Empanadas" } },
  { id: "bebidas",    icon: "bottle",  type: "list",  name: { es: "Bebidas", en: "Drinks", pt: "Bebidas" } },
  { id: "ninos",      icon: "kid",     type: "list",  name: { es: "Menú infantil", en: "Kids menu", pt: "Menu infantil" }, short: { es: "Niños", en: "Kids", pt: "Crianças" } },
  { id: "postres",    icon: "flan",    type: "list",  name: { es: "Postres", en: "Desserts", pt: "Sobremesas" } },
];

// Grupos (pestañas principales). Cada grupo junta una o más categorías.
const GROUPS = [
  { id: "pizzas",   icon: "pizza",    cats: ["clasicas", "especiales"],
    name: { es: "Pizzas", en: "Pizzas", pt: "Pizzas" } },
  { id: "picar",    icon: "empanada", cats: ["empanadas", "porciones", "calzones"],
    name: { es: "Para picar", en: "Snacks", pt: "Petiscos" } },
  { id: "mediodia", icon: "cutlery",  cats: ["mediodia"],
    name: { es: "Mediodía", en: "Lunch", pt: "Almoço" } },
  { id: "dulce",    icon: "flan",     cats: ["bebidas", "postres"],
    name: { es: "Bebidas y postres", en: "Drinks & desserts", pt: "Bebidas e doces" } },
  { id: "ninos",    icon: "kid",      cats: ["ninos"],
    name: { es: "Niños", en: "Kids", pt: "Crianças" } },
];

// ---------------------------------------------------------------------
//  PIZZAS  ·  p: [Súper, Mediana] a la piedra  ·  m: [Grande, Chica] al molde
//  null = no se hace en ese tamaño.  tags: star | veggie | spicy | gf (sin TACC)
//  img: poné la foto con ese nombre en img/productos/
// ---------------------------------------------------------------------
const PIZZAS = [
  // ----- Clásicas -----
  { id: "mozzarella", name: "Mozzarella", cat: "clasicas", p: [32000, 26500], m: [26500, 22000], tags: ["veggie"],
    desc: { es: "Salsa de tomate, mozzarella, aceitunas y orégano.", en: "Tomato sauce, mozzarella, olives and oregano.", pt: "Molho de tomate, muçarela, azeitonas e orégano." } }, // revisar
  { id: "anchoas", name: "Anchoas", cat: "clasicas", p: [32000, 26500], m: [26500, 22000], tags: [],
    desc: { es: "Salsa de tomate, tomate natural, anchoas, ajo, aceitunas y especias.", en: "Tomato sauce, fresh tomato, anchovies, garlic, olives and spices.", pt: "Molho de tomate, tomate fresco, anchovas, alho, azeitonas e especiarias." } },
  { id: "mozzarella-tomate", name: "Mozzarella con Tomate Natural", cat: "clasicas", p: [38500, 32000], m: [32000, 26500], tags: ["veggie"],
    desc: { es: "Mozzarella con rodajas de tomate natural y aceitunas.", en: "Mozzarella with fresh tomato slices and olives.", pt: "Muçarela com rodelas de tomate fresco e azeitonas." } }, // revisar
  { id: "napolitana", name: "Napolitana", cat: "clasicas", p: [38500, 32000], m: [32000, 26500], tags: ["veggie"],
    desc: { es: "Mozzarella, rodajas de tomate, ajo y perejil.", en: "Mozzarella, sliced tomato, garlic and parsley.", pt: "Muçarela, tomate fatiado, alho e salsinha." } }, // revisar
  { id: "mozzarella-jamon", name: "Mozzarella con Jamón", cat: "clasicas", p: [38500, 32000], m: [32000, 26500], tags: [],
    desc: { es: "Mozzarella y jamón cocido.", en: "Mozzarella and cooked ham.", pt: "Muçarela e presunto cozido." } }, // revisar
  { id: "jamon-morrones", name: "Jamón y Morrones", cat: "clasicas", p: [43500, 36500], m: [36500, 31000], tags: [],
    desc: { es: "Mozzarella, jamón cocido y morrones.", en: "Mozzarella, cooked ham and red peppers.", pt: "Muçarela, presunto cozido e pimentões." } }, // revisar
  { id: "mozzarella-huevo", name: "Mozzarella con Huevo", cat: "clasicas", p: [38500, 32000], m: [32000, 26500], tags: ["veggie"],
    desc: { es: "Mozzarella y huevo duro.", en: "Mozzarella and hard-boiled egg.", pt: "Muçarela e ovo cozido." } }, // revisar
  { id: "jamon-huevo", name: "Jamón y Huevo", cat: "clasicas", p: [43500, 36500], m: [36500, 31000], tags: [],
    desc: { es: "Mozzarella, jamón cocido y huevo duro.", en: "Mozzarella, cooked ham and hard-boiled egg.", pt: "Muçarela, presunto cozido e ovo cozido." } }, // revisar
  { id: "calabresa", name: "Calabresa", cat: "clasicas", p: [43500, 36500], m: [36500, 31000], tags: ["spicy"],
    desc: { es: "Mozzarella y longaniza calabresa.", en: "Mozzarella and spicy Calabrese sausage.", pt: "Muçarela e linguiça calabresa." } }, // revisar
  { id: "ajo-oleo", name: "Ajo al Óleo", cat: "clasicas", p: [27000, 23500], m: [23500, 20000], tags: ["veggie"],
    desc: { es: "Salsa de tomate, ajo, perejil y aceite de oliva.", en: "Tomato sauce, garlic, parsley and olive oil.", pt: "Molho de tomate, alho, salsinha e azeite." } }, // revisar
  { id: "fugazza", name: "Fugazza", cat: "clasicas", p: [27000, 23500], m: [23500, null], tags: ["veggie"],
    desc: { es: "Cebolla, aceitunas y orégano. Sin queso.", en: "Onion, olives and oregano. No cheese.", pt: "Cebola, azeitonas e orégano. Sem queijo." } }, // revisar
  { id: "fugazzetta", name: "Fugazzetta", cat: "clasicas", p: [43500, 36500], m: [null, null], tags: ["veggie"],
    desc: { es: "Doble masa, mozzarella, cebolla, aceitunas y especias.", en: "Double crust stuffed with mozzarella, topped with onion, olives and spices.", pt: "Massa dupla com muçarela, cebola, azeitonas e especiarias." } },
  { id: "fugazzetta-jamon", name: "Fugazzetta con Jamón", cat: "clasicas", p: [48000, 40000], m: [null, null], tags: [],
    desc: { es: "Doble masa, mozzarella, jamón, cebolla, aceitunas y especias.", en: "Double crust with mozzarella and ham, topped with onion, olives and spices.", pt: "Massa dupla com muçarela e presunto, cebola, azeitonas e especiarias." } }, // revisar
  { id: "americana", name: "Americana", cat: "clasicas", p: [38500, 32000], m: [null, null], tags: ["veggie"],
    desc: { es: "Mozzarella, cebolla y aceitunas verdes.", en: "Mozzarella, onion and green olives.", pt: "Muçarela, cebola e azeitonas verdes." } },
  { id: "americana-jamon", name: "Americana con Jamón", cat: "clasicas", p: [43500, 36500], m: [null, null], tags: [],
    desc: { es: "Mozzarella, jamón, cebolla y aceitunas verdes.", en: "Mozzarella, ham, onion and green olives.", pt: "Muçarela, presunto, cebola e azeitonas verdes." } }, // revisar

  // ----- Especiales -----
  { id: "napolitana-campeones", name: "Napolitana “Los Campeones”", cat: "especiales", p: [48000, 40000], m: [40000, 35000], tags: [],
    desc: { es: "Salsa de tomate, mozzarella, tomate natural, jamón, huevo, ajo picado y aceitunas.", en: "Tomato sauce, mozzarella, fresh tomato, ham, egg, chopped garlic and olives.", pt: "Molho de tomate, muçarela, tomate fresco, presunto, ovo, alho picado e azeitonas." } },
  { id: "caprese", name: "Caprese", cat: "especiales", p: [43500, 36500], m: [36500, 31000], tags: ["veggie"],
    desc: { es: "Mozzarella, tomate natural, albahaca fresca y aceitunas.", en: "Mozzarella, fresh tomato, fresh basil and olives.", pt: "Muçarela, tomate fresco, manjericão e azeitonas." } }, // revisar
  { id: "provolone", name: "Provolone", cat: "especiales", p: [48000, 40000], m: [40000, 35000], tags: ["veggie"],
    desc: { es: "Mozzarella y provolone gratinado con orégano.", en: "Mozzarella and melted provolone with oregano.", pt: "Muçarela e provolone gratinado com orégano." } }, // revisar
  { id: "provolone-jamon", name: "Provolone con Jamón", cat: "especiales", p: [51000, 43500], m: [43500, 39000], tags: [],
    desc: { es: "Mozzarella, provolone gratinado y jamón cocido.", en: "Mozzarella, melted provolone and cooked ham.", pt: "Muçarela, provolone gratinado e presunto cozido." } }, // revisar
  { id: "roquefort", name: "Roquefort", cat: "especiales", p: [43500, 36500], m: [36500, 31000], tags: ["veggie"],
    desc: { es: "Mozzarella y queso roquefort.", en: "Mozzarella and blue cheese.", pt: "Muçarela e queijo roquefort." } }, // revisar
  { id: "roquefort-jamon", name: "Roquefort con Jamón", cat: "especiales", p: [48000, 40000], m: [40000, 35000], tags: [],
    desc: { es: "Mozzarella, roquefort y jamón cocido.", en: "Mozzarella, blue cheese and cooked ham.", pt: "Muçarela, roquefort e presunto cozido." } }, // revisar
  { id: "cuatro-quesos", name: "Cuatro Quesos", cat: "especiales", p: [53500, 46500], m: [46500, 41000], tags: ["veggie"],
    desc: { es: "Mozzarella, provolone, roquefort y parmesano.", en: "Mozzarella, provolone, blue cheese and parmesan.", pt: "Muçarela, provolone, roquefort e parmesão." } }, // revisar
  { id: "palmitos", name: "Palmitos", cat: "especiales", p: [48000, 40000], m: [40000, 35000], tags: [],
    desc: { es: "Salsa de tomate, mozzarella, jamón, palmitos, salsa golf, aceitunas y especias.", en: "Tomato sauce, mozzarella, ham, hearts of palm, pink sauce, olives and spices.", pt: "Molho de tomate, muçarela, presunto, palmito, molho rosé, azeitonas e especiarias." } },
  { id: "carioca", name: "Carioca", cat: "especiales", p: [48000, 40000], m: [40000, 35000], tags: [],
    desc: { es: "Salsa de tomate, mozzarella, jamón, ananá, caramelo, aceitunas y especias.", en: "Tomato sauce, mozzarella, ham, pineapple, caramel, olives and spices.", pt: "Molho de tomate, muçarela, presunto, abacaxi, caramelo, azeitonas e especiarias." } },
  { id: "verdura", name: "Verdura", cat: "especiales", p: [43500, 36500], m: [36500, null], tags: ["veggie"],
    desc: { es: "Verdura picada cubierta con salsa blanca, provolone rallado, morrón y aceitunas.", en: "Chopped greens topped with white sauce, grated provolone, red pepper and olives.", pt: "Verduras picadas com molho branco, provolone ralado, pimentão e azeitonas." } },
];

// Simulación del podio (reemplazar por las 3 más vendidas reales)
const PODIUM = ["mozzarella", "napolitana-campeones", "fugazzetta"];

// ---------------------------------------------------------------------
//  LISTAS (nombre original + aclaración opcional para turistas)
// ---------------------------------------------------------------------
const LIST_ITEMS = {
  mediodia: {
    note: { es: "Martes a viernes de 12 a 16 h. Todos los platos salen con una guarnición a elección y pan.",
            en: "Tuesday to Friday, 12–4 pm. Every dish comes with a side of your choice and bread.",
            pt: "Terça a sexta, 12h às 16h. Todos os pratos acompanham guarnição à escolha e pão." },
    items: [
      { name: "Cuarto de Pollo", price: 16000, hint: { en: "Roast chicken quarter", pt: "Quarto de frango" } },
      { name: "Mini Bife de Chorizo a la Parrilla", price: 20000, hint: { en: "Grilled sirloin steak", pt: "Contrafilé grelhado" } },
      { name: "Tortilla de Papa con Cebolla", price: 13500, hint: { en: "Spanish potato omelette", pt: "Tortilha de batata" } },
      { name: "Omelette Mixto", price: 11500, hint: { en: "Ham & cheese omelette", pt: "Omelete de presunto e queijo" } },
      { name: "Milanesa de Ternera", price: 16000, hint: { en: "Breaded beef cutlet", pt: "Bife à milanesa" } },
      { name: "Milanesa Napolitana", price: 18500, hint: { en: "Breaded beef with ham, sauce & cheese", pt: "Milanesa com presunto, molho e queijo" } },
      { name: "Suprema Napolitana", price: 18500, hint: { en: "Breaded chicken with ham, sauce & cheese", pt: "Frango à milanesa napolitana" } },
      { name: "Ensalada Completa con Atún o Pollo", price: 17500, hint: { en: "Mixed salad with tuna or chicken", pt: "Salada completa com atum ou frango" } },
    ],
  },
  // Menú infantil armado con platos que ya están en la carta (precios de la carta).
  // Revisar con el dueño si quiere un combo con precio especial.
  ninos: {
    note: { es: "Opciones de la carta ideales para los más chicos. Consultá por combos.",
            en: "Menu picks that kids love. Ask us about combos.",
            pt: "Opções do cardápio ideais para os pequenos. Pergunte pelos combos." },
    items: [
      { name: "Porción de Mozzarella", price: 4500, hint: { en: "Mozzarella slice", pt: "Fatia de muçarela" } },
      { name: "Pizza Chica al Molde · Mozzarella", price: 22000, hint: { en: "Small pan pizza, 6 slices", pt: "Pizza pequena na forma, 6 fatias" } },
      { name: "Empanada de Jamón y Queso", price: 3300, hint: { en: "Ham & cheese empanada", pt: "Empanada de presunto e queijo" } },
      { name: "Fainá", price: 2500, hint: { en: "Chickpea flatbread", pt: "Pão de grão-de-bico" } },
      { name: "Gaseosa 500 cc", price: 3500, hint: { en: "Soft drink", pt: "Refrigerante" } },
      { name: "Flan Casero", price: 6000, hint: { en: "Homemade caramel custard", pt: "Pudim caseiro" } },
      { name: "Ensalada de Frutas", price: 5500, hint: { en: "Fruit salad", pt: "Salada de frutas" } },
    ],
  },
  porciones: {
    items: [
      { name: "Mozzarella", price: 4500 },
      { name: "Anchoas", price: 4500 },
      { name: "Mozzarella con Jamón", price: 5000 },
      { name: "Jamón y Morrones", price: 5500 },
      { name: "Napolitana", price: 5000 },
      { name: "Calabresa", price: 5500 },
      { name: "Verdura", price: 5500 },
      { name: "Provolone", price: 6000 },
      { name: "Roquefort", price: 5500 },
      { name: "Fugazza", price: 3500 },
      { name: "Fugazzetta", price: 5500 },
      { name: "Fugazzetta Completa", price: 6500 },
      { name: "Fainá", price: 2500, hint: { en: "Chickpea flatbread", pt: "Pão de grão-de-bico" } },
    ],
  },
  calzones: {
    note: { es: "Pizza cerrada y rellena, al horno de leña.", en: "Folded, stuffed pizza from the wood-fired oven.", pt: "Pizza fechada e recheada, no forno a lenha." },
    items: [
      { name: "Napolitano", price: 35000 },
      { name: "Jamón y Morrón", price: 39000 },
      { name: "Calabresa", price: 39000 },
      { name: "Provolone", price: 44000 },
      { name: "Roquefort", price: 39000 },
      { name: "Cuatro Quesos", price: 48000 },
      { name: "Caprese", price: 39000 },
    ],
  },
  empanadas: {
    items: [
      { name: "Carne", price: 3300, hint: { en: "Beef", pt: "Carne" } },
      { name: "Carne Cortada a Cuchillo", price: 3700, hint: { en: "Hand-cut beef", pt: "Carne cortada à faca" } },
      { name: "Pollo", price: 3300, hint: { en: "Chicken", pt: "Frango" } },
      { name: "Jamón y Queso", price: 3300, hint: { en: "Ham & cheese", pt: "Presunto e queijo" } },
      { name: "Queso y Cebolla", price: 3300, hint: { en: "Cheese & onion", pt: "Queijo e cebola" } },
      { name: "Humita", price: 3300, hint: { en: "Sweet corn", pt: "Milho cremoso" } },
      { name: "Verdura", price: 3300, hint: { en: "Greens", pt: "Verduras" } },
      { name: "Docena", price: 36500, hint: { en: "A dozen", pt: "Dúzia" }, featured: true },
    ],
  },
  bebidas: {
    items: [
      { name: "Gaseosa 500 cc", price: 3500, hint: { en: "Soft drink", pt: "Refrigerante" } },
      { name: "Gaseosa 2 L", price: 7500, hint: { en: "Soft drink", pt: "Refrigerante" } },
      { name: "Patagonia 750 ml", price: 8500, hint: { en: "Craft beer", pt: "Cerveja" } },
      { name: "Lata Imperial", price: 5500, hint: { en: "Beer can", pt: "Cerveja em lata" } },
      { name: "Porrón Corona / Heineken", price: 6500, hint: { en: "Beer bottle", pt: "Long neck" } },
    ],
  },
  postres: {
    items: [
      { name: "Flan Casero", price: 6000, hint: { en: "Homemade caramel custard", pt: "Pudim caseiro" } },
      { name: "Budín de Pan", price: 6000, hint: { en: "Bread pudding", pt: "Pudim de pão" } },
      { name: "Queso y Dulce", price: 8000, hint: { en: "Cheese with quince paste", pt: "Queijo com goiabada" } },
      { name: "Ensalada de Frutas", price: 5500, hint: { en: "Fruit salad", pt: "Salada de frutas" } },
      { name: "Postre “Balcarce”", price: 9000, hint: { en: "Classic Argentine layered dessert", pt: "Sobremesa argentina em camadas" } },
      { name: "Tiramisú", price: 9000 },
      { name: "Porción de Crema o Dulce de Leche", price: 2000, hint: { en: "Side of cream or dulce de leche", pt: "Porção de creme ou doce de leite" } },
    ],
  },
};

// ---------------------------------------------------------------------
//  RESERVAS (datos de muestra — se definen con el dueño)
// ---------------------------------------------------------------------
const RESERVATIONS = {
  maxPeople: 12,        // más que esto → "escribinos"
  slotMinutes: 30,
  lastSlot: "23:00",
  shifts: [
    { id: "manana",   from: "08:00", to: "11:30", name: { es: "Mañana", en: "Morning", pt: "Manhã" } },
    { id: "mediodia", from: "12:00", to: "15:30", name: { es: "Mediodía", en: "Lunch", pt: "Almoço" } },
    { id: "tarde",    from: "16:00", to: "19:30", name: { es: "Tarde", en: "Afternoon", pt: "Tarde" } },
    { id: "noche",    from: "20:00", to: "23:00", name: { es: "Noche", en: "Evening", pt: "Noite" } },
  ],
  reasons: {
    es: ["Cena", "Cumpleaños", "Aniversario", "Reunión de amigos", "Trabajo", "Otro"],
    en: ["Dinner", "Birthday", "Anniversary", "Friends", "Business", "Other"],
    pt: ["Jantar", "Aniversário", "Bodas", "Amigos", "Trabalho", "Outro"],
  },
};

// ---------------------------------------------------------------------
//  GALERÍA y PREGUNTAS FRECUENTES
// ---------------------------------------------------------------------
const GALLERY = [
  { img: "img/galeria/horno.webp",   caption: { es: "El horno a leña de quebracho", en: "The quebracho wood-fired oven", pt: "O forno a lenha de quebracho" } },
  { img: "img/galeria/salon.webp",   caption: { es: "El salón", en: "The dining room", pt: "O salão" } },
  { img: "img/galeria/pizza.webp",   caption: { es: "Recién salida", en: "Fresh out of the oven", pt: "Saindo do forno" } },
  { img: "img/galeria/equipo.webp",  caption: { es: "El equipo", en: "The team", pt: "A equipe" } },
  { img: "img/galeria/antigua.webp", caption: { es: "Desde 1954", en: "Since 1954", pt: "Desde 1954" } },
];

const FAQ = [
  { q: { es: "¿Hacen reservas?", en: "Do you take reservations?", pt: "Vocês fazem reservas?" },
    a: { es: "Sí. Podés reservar desde la sección Reservar de esta página, eligiendo día, horario y cantidad de personas.", en: "Yes. Use the Book a table section on this site to choose day, time and party size.", pt: "Sim. Use a seção Reservar deste site para escolher dia, horário e número de pessoas." } },
  { q: { es: "¿Tienen delivery?", en: "Do you deliver?", pt: "Vocês fazem entrega?" },
    a: { es: "Sí. Pedí por WhatsApp al 11-2479-5495 o por teléfono, y te confirmamos si llegamos a tu zona.", en: "Yes. Order on WhatsApp (11-2479-5495) or by phone and we'll confirm if we deliver to your area.", pt: "Sim. Peça pelo WhatsApp (11-2479-5495) ou por telefone e confirmamos se entregamos na sua região." } },
  { q: { es: "¿Cuánto tarda la pizza?", en: "How long does a pizza take?", pt: "Quanto tempo demora a pizza?" },
    a: { es: "Nuestras pizzas se elaboran en el momento, en horno a leña. Por favor, considerá el tiempo de espera: vale la pena.", en: "Every pizza is made to order in our wood-fired oven, so please allow some waiting time. It's worth it.", pt: "Cada pizza é feita na hora, no forno a lenha. Considere o tempo de espera: vale a pena." } },
  { q: { es: "¿Cómo la recaliento si pido delivery?", en: "How should I reheat a delivery pizza?", pt: "Como esquento a pizza do delivery?" },
    a: { es: "Esperá la pizza con el horno caliente. Cuando llegue, quitale la tapa a la caja y ponela unos minutos en el horno apagado.", en: "Pre-heat your oven. When the pizza arrives, remove the box lid and place it in the switched-off oven for a few minutes.", pt: "Pré-aqueça o forno. Quando a pizza chegar, tire a tampa da caixa e deixe-a alguns minutos no forno desligado." } },
  { q: { es: "¿Tienen sucursales?", en: "Do you have other branches?", pt: "Vocês têm filiais?" },
    a: { es: "¡No tenemos sucursales! Estamos únicamente en Av. Montes de Oca 856, Barracas.", en: "No branches! We're only at Av. Montes de Oca 856, Barracas.", pt: "Não temos filiais! Estamos apenas na Av. Montes de Oca 856, Barracas." } },
  { q: { es: "¿Hay menú del mediodía?", en: "Is there a lunch menu?", pt: "Há menu de almoço?" },
    a: { es: "Sí, de martes a viernes de 12 a 16 h. Todos los platos salen con guarnición a elección y pan.", en: "Yes, Tuesday to Friday from 12 to 4 pm. Every dish comes with a side and bread.", pt: "Sim, de terça a sexta, das 12h às 16h. Todos os pratos com guarnição e pão." } },
  { q: { es: "¿Qué medios de pago aceptan?", en: "What payment methods do you accept?", pt: "Quais formas de pagamento aceitam?" },
    a: { es: "Efectivo en delivery. Débito y crédito en el local.", en: "Cash for delivery. Debit and credit cards in store.", pt: "Dinheiro na entrega. Débito e crédito no local." } },
  { q: { es: "¿Tienen opciones para alergias o dietas especiales?", en: "Do you have options for allergies or special diets?", pt: "Há opções para alergias ou dietas especiais?" },
    a: { es: "Marcamos las opciones vegetarianas en la carta. Si tenés alguna alergia o sos celíaco, consultanos por WhatsApp antes de pedir.", en: "Vegetarian options are marked on the menu. If you have an allergy or celiac disease, please ask us on WhatsApp first.", pt: "As opções vegetarianas estão marcadas. Se tiver alergia ou doença celíaca, consulte-nos pelo WhatsApp antes." } },
];
