import type { StoreProduct } from "./types";

export const demoProducts: StoreProduct[] = [
  {
    id: "demo-1",
    slug: "un-abrazo-en-una-caja",
    name: "Un abrazo en una caja",
    category: "para-mimar",
    price: 18900,
    image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=900&q=85",
    alt: "Caja de regalo preparada con dedicación",
    tag: "Más elegido",
    description: "Una selección de pequeños mimos para alegrar cualquier día.",
    featured: true
  },
  {
    id: "demo-2",
    slug: "pausa-bonita",
    name: "Pausa bonita",
    category: "para-mimar",
    price: 22500,
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=85",
    alt: "Productos de cuidado personal para regalar",
    description: "Una invitación a bajar un cambio y regalarte un ratito.",
    featured: false
  },
  {
    id: "demo-3",
    slug: "te-quiero-cerquita",
    name: "Te quiero cerquita",
    category: "para-decir-te-quiero",
    price: 16800,
    image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=900&q=85",
    alt: "Ramo de flores para una persona especial",
    tag: "Hecho con amor",
    description: "Un detalle lleno de ternura para alguien muy especial.",
    featured: true
  },
  {
    id: "demo-4",
    slug: "un-dia-para-recordar",
    name: "Un día para recordar",
    category: "para-celebrar",
    price: 27900,
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=900&q=85",
    alt: "Mesa de celebración con torta y flores",
    description: "Para celebrar eso lindo que merece un brindis y una sonrisa.",
    featured: false
  },
  {
    id: "demo-5",
    slug: "pequenas-cosas-lindas",
    name: "Pequeñas cosas lindas",
    category: "para-sorprender",
    price: 14500,
    image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=85",
    alt: "Flores frescas en tonos rosados",
    description: "Porque sí. Porque te acordaste. Porque siempre hace bien.",
    featured: false
  },
  {
    id: "demo-6",
    slug: "un-mimo-para-vos",
    name: "Un mimo para vos",
    category: "para-mimar",
    price: 19900,
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=900&q=85",
    alt: "Vela artesanal para un momento de calma",
    tag: "Nuevo",
    description: "Una pausa especial para reconectar con las cosas simples.",
    featured: true
  },
  {
    id: "demo-7",
    slug: "motivos-para-sonreir",
    name: "Motivos para sonreír",
    category: "para-sorprender",
    price: 17200,
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=85",
    alt: "Un regalo especial envuelto con cuidado",
    description: "Un regalo original para convertir un día común en uno distinto.",
    featured: false
  },
  {
    id: "demo-8",
    slug: "festejarte-siempre",
    name: "Festejarte siempre",
    category: "para-celebrar",
    price: 24900,
    image: "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=900&q=85",
    alt: "Preparativos para una celebración especial",
    description: "Un detalle pensado para que ese momento dure un poquito más.",
    featured: false
  }
];

export const categoryLabels: Record<string, string> = {
  "para-mimar": "Para mimar",
  "para-decir-te-quiero": "Para decir te quiero",
  "para-celebrar": "Para celebrar",
  "para-sorprender": "Para sorprender"
};
