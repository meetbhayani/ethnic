/**
 * Real fabric photography used across the home page (files in /public/fabrics).
 * Names describe what is visible in each photo; edit freely to match catalogue codes.
 */
export interface HomeFabric {
  id: string;
  src: string;
  name: string;
  technique: string;
  tone: string;
  /** Dominant colour, used for ambient glows behind the photo. */
  hex: string;
  /** Photo is large enough (≥ 360px wide) for hero / magnifier use. */
  large: boolean;
  /** Seamless, evenly lit repeat cut from a flat area of the photo — use for garment fills. */
  tile: string;
}

export const HOME_FABRICS: HomeFabric[] = [
  {
    id: 'ivory-multicolour-sequin',
    src: '/fabrics/ivory-multicolour-sequin.jpg',
    tile: '/fabrics/tiles/ivory-multicolour-sequin.jpg',
    name: 'Mughal Garden Jaal',
    technique: 'Multi-colour resham with sequins',
    tone: 'Sand beige',
    hex: '#B9A27E',
    large: true,
  },
  {
    id: 'purple-zari-vine',
    src: '/fabrics/purple-zari-vine.jpg',
    tile: '/fabrics/tiles/purple-zari-vine.jpg',
    name: 'Royal Amethyst Vine',
    technique: 'Antique zari thread embroidery',
    tone: 'Royal purple',
    hex: '#6A2C8E',
    large: true,
  },
  {
    id: 'red-sequin-lattice',
    src: '/fabrics/red-sequin-lattice.jpg',
    tile: '/fabrics/tiles/red-sequin-lattice.jpg',
    name: 'Rajwada Lattice',
    technique: 'Sequin & zari trellis',
    tone: 'Sindoor red',
    hex: '#A3302B',
    large: true,
  },
  {
    id: 'teal-floral-applique',
    src: '/fabrics/teal-floral-applique.jpg',
    tile: '/fabrics/tiles/teal-floral-applique.jpg',
    name: 'Peacock Bloom',
    technique: 'Organza appliqué with sequin cores',
    tone: 'Peacock teal',
    hex: '#3F8A86',
    large: true,
  },
  {
    id: 'ivory-pearl-floral',
    src: '/fabrics/ivory-pearl-floral.jpg',
    tile: '/fabrics/tiles/ivory-pearl-floral.jpg',
    name: 'Moti Mahal Floral',
    technique: 'Pearl, cutdana & sequin handwork look',
    tone: 'Pearl ivory',
    hex: '#CFC8B6',
    large: true,
  },
  {
    id: 'gold-pearl-net',
    src: '/fabrics/gold-pearl-net.jpg',
    tile: '/fabrics/tiles/gold-pearl-net.jpg',
    name: 'Sona Sitara Net',
    technique: 'Scattered sequin & pearl on net',
    tone: 'Champagne gold',
    hex: '#C9A86B',
    large: true,
  },
  {
    id: 'gold-pearl-geometric',
    src: '/fabrics/gold-pearl-geometric.jpg',
    tile: '/fabrics/tiles/gold-pearl-geometric.jpg',
    name: 'Darbar Panel',
    technique: 'Pearl outline with resham fill',
    tone: 'Gold tissue',
    hex: '#C4A36A',
    large: true,
  },
  {
    id: 'beige-leaf-pearl',
    src: '/fabrics/beige-leaf-pearl.jpg',
    tile: '/fabrics/tiles/beige-leaf-pearl.jpg',
    name: 'Peepal Leaf Stripe',
    technique: 'Pearl-edged leaf appliqué',
    tone: 'Stone beige',
    hex: '#B8A88E',
    large: true,
  },
  {
    id: 'navy-star-sequin',
    src: '/fabrics/navy-star-sequin.jpg',
    tile: '/fabrics/tiles/navy-star-sequin.jpg',
    name: 'Midnight Sitara',
    technique: 'Star sequin trails',
    tone: 'Midnight navy',
    hex: '#1E2440',
    large: false,
  },
  {
    id: 'lotus-resham-border',
    src: '/fabrics/lotus-resham-border.jpg',
    tile: '/fabrics/tiles/lotus-resham-border.jpg',
    name: 'Kamal Border',
    technique: 'Resham lotus border',
    tone: 'Dune gold',
    hex: '#C2A67F',
    large: false,
  },
  {
    id: 'pastel-motif-thread',
    src: '/fabrics/pastel-motif-thread.jpg',
    tile: '/fabrics/tiles/pastel-motif-thread.jpg',
    name: 'Pastel Buti',
    technique: 'Fine thread buti',
    tone: 'Blush ivory',
    hex: '#E2D6CB',
    large: false,
  },
];

export const fabricById = (id: string) => HOME_FABRICS.find((f) => f.id === id) ?? HOME_FABRICS[0];

export const LARGE_FABRICS = HOME_FABRICS.filter((f) => f.large);
