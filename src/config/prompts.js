export const promptConfig = [
  {
    category: "Structure Type",
    key: "structureType",
    options: [
      { label: "DEFAULT", value: "DEFAULT", prompt: "" },
      { label: "INTERIOR", value: "INTERIOR", prompt: "interior view, architectural interior" },
      { label: "EXTERIOR", value: "EXTERIOR", prompt: "exterior view, architectural facade, outdoor" },
    ],
    default: "DEFAULT",
    type: "radio"
  },
  {
    category: "Furniture Density",
    key: "furniture",
    options: [
      { label: "DEFAULT", value: "DEFAULT", prompt: "" },
      { label: "ADD FURNITURE", value: "ADD FURNITURE", prompt: "fully furnished, stylish furniture, interior design" },
      { label: "MINIMAL", value: "MINIMAL", prompt: "minimalist furniture, sparse layout, uncluttered" },
      { label: "REMOVE FURNITURE", value: "REMOVE FURNITURE", prompt: "empty room, unfurnished, bare walls and floor, architectural space" },
    ],
    default: "DEFAULT",
    type: "radio"
  },
  {
    category: "Flooring",
    key: "flooring",
    options: [
      { label: "Oak Wood", value: "Oak Wood", prompt: "preserve exact architecture, preserve exact geometry, preserve room layout, preserve camera angle, preserve perspective, preserve furniture placement, preserve openings and proportions, change only the floor material, highly realistic architectural rendering, natural European oak wood flooring, warm light honey oak tone, subtle grain variation, matte finish, premium timber planks, accurate plank scale, clean contemporary interior materialization, natural lighting, high detail", image: "/materials/floor.png" },
      { label: "Wenge Wood", value: "Wenge Wood", prompt: "preserve exact architecture, preserve exact geometry, preserve room layout, preserve camera angle, preserve perspective, preserve furniture placement, preserve openings and proportions, change only the floor material, highly realistic architectural rendering, dark wenge wood flooring, deep espresso brown tone, elegant linear wood grain, matte low sheen finish, premium hardwood planks, accurate plank scale, sophisticated luxury interior materialization, natural lighting, high detail", image: "/materials/floor wenge.png" },
      { label: "Teak Wood", value: "Teak Wood", prompt: "preserve exact architecture, preserve exact geometry, preserve room layout, preserve camera angle, preserve perspective, preserve furniture placement, preserve openings and proportions, change only the floor material, highly realistic architectural rendering, natural teak wood flooring, rich golden brown tone, warm tropical timber grain, refined matte finish, premium wood planks, accurate plank scale, balanced natural variation, high detail, realistic material response", image: "/materials/floor teak.png" },
      { label: "Whitewash Wood", value: "Whitewash Wood", prompt: "preserve exact architecture, preserve exact geometry, preserve room layout, preserve camera angle, preserve perspective, preserve furniture placement, preserve openings and proportions, change only the floor material, highly realistic architectural rendering, whitewashed wood flooring, soft pale oak tone, desaturated washed timber, subtle grain visibility, matte finish, Scandinavian contemporary style, accurate plank scale, airy elegant interior materialization, natural lighting, high detail", image: "/materials/floor whitewash.png" },
      { label: "Ceramic Terracotta", value: "Ceramic Terracotta", prompt: "preserve exact architecture, preserve exact geometry, preserve room layout, preserve camera angle, preserve perspective, preserve furniture placement, preserve openings and proportions, change only the floor material, highly realistic architectural rendering, terracotta ceramic tile flooring, warm earthy burnt clay color, handcrafted natural variation, matte porous finish, square tile layout, subtle grout joints, Mediterranean character, realistic clay texture, high detail", image: "/materials/floor terracotta.png" },
      { label: "Ceramic White", value: "Ceramic White", prompt: "preserve exact architecture, preserve exact geometry, preserve room layout, preserve camera angle, preserve perspective, preserve furniture placement, preserve openings and proportions, change only the floor material, highly realistic architectural rendering, white ceramic tile flooring, clean matte white surface, minimal contemporary tile finish, subtle grout lines, uniform square tile layout, refined modern interior materialization, soft natural reflections, high detail", image: "/materials/floor white ceramic.png" },
      { label: "Motif Spanish", value: "Motif Spanish", prompt: "preserve exact architecture, preserve exact geometry, preserve room layout, preserve camera angle, preserve perspective, preserve furniture placement, preserve openings and proportions, change only the floor material, highly realistic architectural rendering, Spanish motif ceramic tile flooring, decorative patterned artisan tiles, Mediterranean blue yellow terracotta accents, authentic glazed ceramic look, accurate repeated tile layout, visible grout joints, handcrafted character, elegant traditional pattern, high detail", image: "/materials/floor spanish.png" },
      { label: "Marble Carrara", value: "Marble Carrara", prompt: "preserve exact architecture, preserve exact geometry, preserve room layout, preserve camera angle, preserve perspective, preserve furniture placement, preserve openings and proportions, change only the floor material, highly realistic architectural rendering, Carrara marble flooring, white marble with soft grey veining, refined polished stone surface, luxurious Italian marble, realistic large slab appearance, subtle reflectivity, elegant premium interior finish, high detail", image: "/materials/floor marble carrara.png" },
      { label: "Marble Marquinha", value: "Marble Marquinha", prompt: "preserve exact architecture, preserve exact geometry, preserve room layout, preserve camera angle, preserve perspective, preserve furniture placement, preserve openings and proportions, change only the floor material, highly realistic architectural rendering, Marquina marble flooring, deep black marble with bold white veining, luxurious polished stone finish, dramatic contrast, premium large slab appearance, subtle mirror reflection, high-end contemporary interior materialization, high detail", image: "/materials/floor marble marquinha.png" },
      { label: "Marble Diana Green", value: "Marble Diana Green", prompt: "preserve exact architecture, preserve exact geometry, preserve room layout, preserve camera angle, preserve perspective, preserve furniture placement, preserve openings and proportions, change only the floor material, highly realistic architectural rendering, Diana green marble flooring, rich green marble with natural beige and light veining, polished stone finish, luxurious statement surface, realistic slab scale, elegant premium architectural materialization, natural reflections, high detail", image: "/materials/floor marble diana.png" },
    ],
    default: "Oak Wood",
    type: "grid"
  },
  {
    category: "Material Presets",
    key: "material",
    options: [
      { label: "Concrete", value: "Concrete", prompt: "preserve exact architecture, preserve exact geometry, preserve room layout, preserve camera angle, preserve perspective, preserve furniture placement, preserve openings and proportions, change only the target surface material, highly realistic architectural rendering, raw cast concrete finish, soft grey cement tone, subtle pores and mineral variation, matte surface, refined architectural concrete, minimal contemporary material expression, natural lighting, realistic texture scale, high detail", image: "/materials/mat-concrete.jpg" },
      { label: "White Plaster", value: "White Plaster", prompt: "preserve exact architecture, preserve exact geometry, preserve room layout, preserve camera angle, preserve perspective, preserve furniture placement, preserve openings and proportions, change only the target surface material, highly realistic architectural rendering, smooth white plaster finish, soft mineral texture, matte white wall surface, refined handcrafted plastering, clean elegant minimal interior finish, subtle trowel variation, natural lighting, high detail", image: "/materials/mat-plaster-white.jpg" },
      { label: "Oak Wood", value: "Oak Wood", prompt: "preserve exact architecture, preserve exact geometry, preserve room layout, preserve camera angle, preserve perspective, preserve furniture placement, preserve openings and proportions, change only the target surface material, highly realistic architectural rendering, natural oak wood finish, warm light oak tone, refined visible grain, matte timber surface, premium architectural wood cladding or joinery finish, accurate wood scale, elegant contemporary detailing, high detail", image: "/materials/mat-oak.jpg" },
      { label: "Venetian Pink", value: "Venetian Pink", prompt: "preserve exact architecture, preserve exact geometry, preserve room layout, preserve camera angle, preserve perspective, preserve furniture placement, preserve openings and proportions, change only the target surface material, highly realistic architectural rendering, pink Venetian plaster finish, soft dusty blush tone, polished mineral plaster, subtle cloud-like movement, elegant handcrafted wall texture, refined satin sheen, luxurious contemporary interior surface, high detail", image: "/materials/mat-venetian-pink.jpg" },
      { label: "Venetian Orange", value: "Venetian Orange", prompt: "preserve exact architecture, preserve exact geometry, preserve room layout, preserve camera angle, preserve perspective, preserve furniture placement, preserve openings and proportions, change only the target surface material, highly realistic architectural rendering, orange Venetian plaster finish, warm peach terracotta tone, polished mineral plaster, nuanced tonal movement, handcrafted luxurious wall surface, subtle satin sheen, Mediterranean contemporary aesthetic, high detail", image: "/materials/mat-venetian-orange.jpg" },
      { label: "Polished Marble", value: "Polished Marble", prompt: "preserve exact architecture, preserve exact geometry, preserve room layout, preserve camera angle, preserve perspective, preserve furniture placement, preserve openings and proportions, change only the target surface material, highly realistic architectural rendering, polished white marble finish, fine grey veining, premium stone surface, glossy reflective marble, luxurious architectural cladding or countertop finish, realistic slab scale, elegant high-end materialization, high detail", image: "/materials/mat-marble-polished.jpg" },
      { label: "Matt Marble", value: "Matt Marble", prompt: "preserve exact architecture, preserve exact geometry, preserve room layout, preserve camera angle, preserve perspective, preserve furniture placement, preserve openings and proportions, change only the target surface material, highly realistic architectural rendering, matte white marble finish, soft grey veining, honed stone surface, low sheen premium marble, elegant refined architectural cladding, realistic slab scale, understated luxury, high detail", image: "/materials/mat-marble-matt.jpg" },
      { label: "Raw Brick", value: "Raw Brick", prompt: "preserve exact architecture, preserve exact geometry, preserve room layout, preserve camera angle, preserve perspective, preserve furniture placement, preserve openings and proportions, change only the target surface material, highly realistic architectural rendering, raw exposed brick finish, warm red clay brick, natural irregularity, slightly rough porous surface, visible mortar joints, authentic handcrafted masonry, industrial yet refined architectural character, high detail", image: "/materials/mat-brick.jpg" },
      { label: "Brushed Metal", value: "Brushed Metal", prompt: "preserve exact architecture, preserve exact geometry, preserve room layout, preserve camera angle, preserve perspective, preserve furniture placement, preserve openings and proportions, change only the target surface material, highly realistic architectural rendering, brushed metal finish, cool silver tone, fine horizontal brushed texture, satin metallic reflectivity, clean premium architectural metal cladding or panel finish, minimalist contemporary expression, high detail", image: "/materials/mat-metal.jpg" },
      { label: "Clear Glass", value: "Clear Glass", prompt: "preserve exact architecture, preserve exact geometry, preserve room layout, preserve camera angle, preserve perspective, preserve furniture placement, preserve openings and proportions, change only the target surface material, highly realistic architectural rendering, clear glass surface, transparent polished glass, clean subtle reflections, realistic light transmission, minimal premium architectural glazing, crisp edges, elegant contemporary material response, high detail", image: "/materials/mat-glass.jpg" },
    ],
    default: "Concrete",
    type: "grid"
  },
  {
    category: "Lighting",
    key: "lighting",
    options: [
      { label: "NATURAL", value: "NATURAL", prompt: "natural lighting, daylight" },
      { label: "DRAMATIC", value: "DRAMATIC", prompt: "dramatic lighting, high contrast" },
      { label: "CINEMATIC", value: "CINEMATIC", prompt: "cinematic lighting, elegant" },
      { label: "STUDIO", value: "STUDIO", prompt: "studio lighting, soft box, beautifully lit" },
      { label: "GOLDEN HOUR", value: "GOLDEN HOUR", prompt: "golden hour lighting, warm sunlight" },
    ],
    default: "DRAMATIC",
    type: "select"
  },
  {
    category: "Environment / Setting",
    key: "setting",
    options: [
      { label: "URBAN", value: "URBAN", prompt: "urban setting" },
      { label: "COASTAL", value: "COASTAL", prompt: "coastal setting, near water" },
      { label: "FOREST", value: "FOREST", prompt: "forest setting, surrounded by nature" },
      { label: "MOUNTAINS", value: "MOUNTAINS", prompt: "mountain setting, scenic" },
      { label: "DESERT", value: "DESERT", prompt: "desert setting, arid" },
    ],
    default: "URBAN",
    type: "select"
  }
];
