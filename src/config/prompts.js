export const promptConfig = [
  {
    category: "Structure Type",
    key: "structureType",
    options: ["DEFAULT", "EXTERIOR", "INTERIOR"],
    default: "DEFAULT"
  },
  {
    category: "Furniture Density",
    key: "furniture",
    options: ["DEFAULT", "ADD FURNITURE", "MINIMAL", "REMOVE FURNITURE"],
    default: "DEFAULT"
  },
  {
    category: "Flooring",
    key: "flooring",
    options: ["DEFAULT", "OAK WOOD", "WALNUT WOOD", "CERAMIC TILES", "MARBLE TILES", "POLISHED CONCRETE"],
    default: "DEFAULT"
  },
  {
    category: "Material Presets",
    key: "material",
    options: ["BRUTALIST CONCRETE", "TEMPERED GLASS", "OXIDIZED STEEL", "NATURAL WOOD", "POLISHED MARBLE"],
    default: "BRUTALIST CONCRETE"
  },
  {
    category: "Lighting",
    key: "lighting",
    options: ["NATURAL", "DRAMATIC", "CINEMATIC", "STUDIO", "GOLDEN HOUR"],
    default: "DRAMATIC"
  },
  {
    category: "Environment / Setting",
    key: "setting",
    options: ["URBAN", "COASTAL", "FOREST", "MOUNTAINS", "DESERT"],
    default: "URBAN"
  }
];
