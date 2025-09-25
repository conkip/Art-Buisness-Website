/*
    Author: Connor Kippes

    Adds all paintings to the database.
    All paintings have unique name so no need for an id as pk.
*/

async function setupPaintings(Painting) {
    let template = new Painting({
        name: "Example",
        image: "Example.webp",
        dimensions: "Length x Width x Depth - ex- 24x24x2",
        date: "2025",
        paint: "Acrylic",
        canvas: "Wood Panel",
        finish: "Epoxy Coating",
        desc: "This is some example text.",
        mult: false,
        framed: true,
        sold: true,
    });

    let painting48 = new Painting({
        name: "3D Dot Fusion",
        image: "3DDotFusion.webp",
        dimensions: "12x12x7/8",
        date: "",
        paint: "Oil",
        canvas: "Wood Panel",
        finish: "Epoxy Coating",
        desc: "",
        mult: true,
    });

    await painting48.save();

    let painting1 = new Painting({
        name: "Beyond the Limit",
        image: "BeyondTheLimit.webp",
        dimensions: "24x24x1 1/2",
        date: "",
        paint: "Oil",
        canvas: "Wood Panel",
        finish: "Epoxy Coating",
        desc: "",
        mult: true,
    });

    await painting1.save();

    let painting2 = new Painting({
        name: "Blue Pallete",
        image: "BluePallete.webp",
        dimensions: "36x36x1",
        date: "",
        paint: "Oil",
        canvas: "Fabric Canvas",
        finish: "Textured Finish",
        desc: "",
        sold: true,
    });

    await painting2.save();

    let painting35 = new Painting({
        name: "Butterflies",
        image: "Butterflies.webp",
        dimensions: "10x10x1/2",
        date: "2025",
        paint: "Acrylic",
        canvas: "Wood Panel",
        finish: "Epoxy Coating",
        desc: "3 panel butterflies.",
        mult: true,
    });

    await painting35.save();

    let painting3 = new Painting({
        name: "Butterflies in Flight",
        image: "ButterfliesInFlight.webp",
        dimensions: "16x24x1",
        date: "2025",
        paint: "Oil",
        canvas: "Wood Canvas",
        finish: "",
        desc: "",
    });

    await painting3.save();

    let painting4 = new Painting({
        name: "Circular Echo",
        image: "CircularEcho.webp",
        dimensions: "30x30x1 1/2",
        date: "",
        paint: "Oil",
        canvas: "Canvas",
        finish: "",
        desc: "",
    });

    await painting4.save();

    let painting5 = new Painting({
        name: "Colors in Motion",
        image: "ColorsInMotion.webp",
        dimensions: "30x36x1",
        date: "",
        paint: "Acrylic",
        canvas: "Stretched Canvas",
        finish: "",
        desc: "",
    });

    await painting5.save();

    let painting6 = new Painting({
        name: "Colors of Liberty",
        image: "ColorsOfLiberty.webp",
        dimensions: "24x30x1",
        date: "",
        paint: "",
        canvas: "",
        finish: "",
        desc: "",
        sold: true,
    });

    await painting6.save();

    let painting7 = new Painting({
        name: "Color Spectrum",
        image: "ColorSpectrum.webp",
        dimensions: "36x48x1 1/2",
        date: "",
        paint: "Acrylic",
        canvas: "Wood Panel",
        finish: "Epoxy Coating",
        desc: "",
    });

    await painting7.save();

    let painting49 = new Painting({
        name: "Cosmic Dust",
        image: "CosmicDust.webp",
        dimensions: "20x20x7/8",
        date: "2025",
        paint: "Acrylic",
        canvas: "Wood Panel",
        finish: "Epoxy Coating",
        desc: "",
        sold: true,
    });

    await painting49.save();

    let painting8 = new Painting({
        name: "Cosmic Tides",
        image: "CosmicTides.webp",
        dimensions: "16x20x1",
        date: "",
        paint: "Acrylic",
        canvas: "",
        finish: "",
        desc: "",
        sold: true,
    });

    await painting8.save();

    let painting30 = new Painting({
        name: "Discovery",
        image: "Discovery.webp",
        dimensions: "24x24x1 1/2",
        date: "2025",
        paint: "Acrylic",
        canvas: "Wood Panel",
        finish: "Epoxy Coating",
        desc: "Mixed media art of a green butterfly.",
    });

    await painting30.save();

    let painting9 = new Painting({
        name: "Dot Fusion",
        image: "DotFusion.webp",
        dimensions: "48x48x1",
        date: "",
        paint: "",
        canvas: "",
        finish: "",
        desc: "",
        sold: true,
    });

    await painting9.save();

    let painting10 = new Painting({
        name: "Dot Symphony",
        image: "DotSymphony.webp",
        dimensions: "",
        date: "",
        paint: "",
        canvas: "",
        finish: "",
        desc: "",
        sold: true,
    });

    await painting10.save();

    let painting29 = new Painting({
        name: "Dream",
        image: "Dream.webp",
        dimensions: "24x24x1 1/2",
        date: "2025",
        paint: "Acrylic",
        canvas: "Wood Panel",
        finish: "Epoxy Coating",
        desc: "Mixed media art of a monarch butterfly.",
    });

    await painting29.save();

    let painting11 = new Painting({
        name: "Eternal Light",
        image: "EternalLight.webp",
        dimensions: "36x48x1",
        date: "",
        paint: "Oil",
        canvas: "",
        finish: "",
        desc: "",
        framed: true,
        sold: true,
    });

    await painting11.save();

    let painting39 = new Painting({
        name: "Electric Waves",
        image: "ElectricWaves.webp",
        dimensions: "48x24x1",
        date: "",
        paint: "",
        canvas: "Canvas",
        finish: "",
        desc: "",
        mult: true,
        sold: true,
    });

    await painting39.save();

    let painting12 = new Painting({
        name: "Eternal Sunshine",
        image: "EternalSunshine.webp",
        dimensions: "36x48x1",
        date: "",
        paint: "Acrylic",
        canvas: "",
        finish: "",
        desc: "",
        sold: true,
    });

    await painting12.save();

    let painting13 = new Painting({
        name: "Flowing Essence",
        image: "FlowingEssence.webp",
        dimensions: "6x6x1",
        date: "",
        paint: "Acrylic",
        canvas: "Wood Canvas",
        finish: "Epoxy Coating",
        desc: "",
        mult: true,
        sold: true,
    });

    await painting13.save();

    let painting38 = new Painting({
        name: "Golden Giants",
        image: "GoldenGiants.webp",
        dimensions: "30x18x1 1/4",
        date: "2025",
        paint: "Acrylic",
        canvas: "Wood Panel",
        finish: "Decorative High Gloss Coating",
        desc: "A sunflower painting made with pattette knife.",
    });

    await painting38.save();

    let painting14 = new Painting({
        name: "Hazy Drift",
        image: "HazyDrift.webp",
        dimensions: "60x36x1 1/4",
        date: "2015",
        paint: "Acrylic",
        canvas: "Canvas",
        finish: "Varnish",
        desc: "",
    });

    await painting14.save();

    let painting28 = new Painting({
        name: "Inspire",
        image: "Inspire.webp",
        dimensions: "20x20x7/8",
        date: "2025",
        paint: "Acrylic",
        canvas: "Wood Panel",
        finish: "Epoxy Coating",
        desc: "Mixed media art.",
    });

    await painting28.save();

    let painting15 = new Painting({
        name: "Liquid Dreamscapes",
        image: "LiquidDreamscapes.webp",
        dimensions: "",
        date: "",
        paint: "",
        canvas: "",
        finish: "",
        desc: "",
        sold: true,
    });

    await painting15.save();

    let painting16 = new Painting({
        name: "Liquid Horizons",
        image: "LiquidHorizons.webp",
        dimensions: "48x60x1",
        date: "2025",
        paint: "Acrylic",
        canvas: "Canvas",
        finish: "Varnish",
        desc: "",
    });

    await painting16.save();

    let painting26 = new Painting({
        name: "Lines of Sight",
        image: "LinesOfSight.webp",
        dimensions: "40x16x1/2",
        date: "2025",
        paint: "Acrylic",
        canvas: "Wood Panel",
        finish: "Epoxy Coating",
        desc: "Geometric design painting.",
    });

    await painting26.save();

    let painting40 = new Painting({
        name: "Meeples",
        image: "Meeples.webp",
        dimensions: "12x12x1",
        date: "",
        paint: "",
        canvas: "",
        finish: "",
        desc: "",
        sold: true,
    });

    await painting40.save();

    let painting37 = new Painting({
        name: "Mid Century Sputnik",
        image: "MidCenturySputnik.webp",
        dimensions: "24x24x7/8",
        date: "2025",
        paint: "Acrylic",
        canvas: "Wood Panel",
        finish: "Epoxy Coating",
        desc: "",
    });

    await painting37.save();

    let painting43 = new Painting({
        name: "Mini Motion",
        image: "MiniMotion.webp",
        dimensions: "11x14x1 1/2",
        date: "",
        paint: "",
        canvas: "Canvas",
        finish: "",
        desc: "",
        sold: true
    });

    await painting43.save();

    let painting24 = new Painting({
        name: "Monarchs Journey",
        image: "MonarchsJourney.webp",
        dimensions: "24x24x7/8",
        date: "2025",
        paint: "Acrylic",
        canvas: "Wood Panel",
        finish: "Epoxy Coating",
        desc: "Mixed media art.",
    });

    await painting24.save();

    let painting44 = new Painting({
        name: "Ocean Clearing",
        image: "OceanClearing.webp",
        dimensions: "11x14x1 1/2",
        date: "",
        paint: "",
        canvas: "Wood Panel",
        finish: "",
        desc: "",
        sold: true,
        framed: true
    });

    await painting44.save();

    let painting17 = new Painting({
        name: "Orbits in Motion",
        image: "OrbitsInMotion.webp",
        dimensions: "8x8x1",
        date: "",
        paint: "",
        canvas: "Wood Canvas",
        finish: "",
        desc: "",
        sold: true,
        mult: true,
    });

    await painting17.save();

    let painting27 = new Painting({
        name: "Painted Ladies",
        image: "PaintedLadies.webp",
        dimensions: "36x36x1 1/2",
        date: "2025",
        paint: "Acrylic",
        canvas: "Deep Wood Panel",
        finish: "Epoxy Coating",
        desc: "Mixed media art of butterflies on a journey.",
    });

    await painting27.save();

    let painting18 = new Painting({
        name: "Pinwheel",
        image: "Pinwheel.webp",
        dimensions: "36x48x1",
        date: "",
        paint: "Acrylic",
        canvas: "",
        finish: "",
        desc: "",
        sold: true,
    });

    await painting18.save();

    let painting19 = new Painting({
        name: "Retro Vibe",
        image: "RetroVibe.webp",
        dimensions: "36x48x1",
        date: "",
        paint: "Acrylic",
        canvas: "Wood Canvas",
        finish: "Epoxy Coatings",
        desc: "",
        sold: true,
    });

    await painting19.save();

    let painting42 = new Painting({
        name: "Setting Sun",
        image: "SettingSun.webp",
        dimensions: "26x32x1 1/2",
        date: "",
        paint: "",
        canvas: "Canvas",
        finish: "",
        desc: "",
        framed: true,
        sold: true,
    });

    await painting42.save();

    let painting20 = new Painting({
        name: "Spectrum of the Sea",
        image: "SpectrumOfTheSea.webp",
        dimensions: "18x24x1",
        date: "",
        paint: "Acrylic",
        canvas: "",
        finish: "",
        desc: "Floating Frame",
        framed: true,
        sold: true,
    });

    await painting20.save();

    let painting41 = new Painting({
        name: "Spiral",
        image: "Spiral.webp",
        dimensions: "12x6x1",
        date: "",
        paint: "",
        canvas: "Canvas",
        finish: "",
        desc: "",
        mult: true,
        sold: true,
    });

    await painting41.save();

    let painting25 = new Painting({
        name: "Starburst Sphere (blue)",
        image: "StarburstSphereBlue.webp",
        dimensions: "16x16x7/8",
        date: "2025",
        paint: "Acrylic",
        canvas: "Wood Panel",
        finish: "Epoxy Coating",
        desc: "",
    });

    await painting25.save();

    let painting31 = new Painting({
        name: "Starburst Sphere (green)",
        image: "StarburstSphereGreen.webp",
        dimensions: "16x16x7/8",
        date: "2025",
        paint: "Acrylic",
        canvas: "Wood Panel",
        finish: "Epoxy Coating",
        desc: "",
    });

    await painting31.save();

    let painting21 = new Painting({
        name: "Strokes of Light",
        image: "StrokesOfLight.webp",
        dimensions: "18x24x1",
        date: "",
        paint: "Oil",
        canvas: "",
        finish: "",
        desc: "",
        framed: true,
        sold: true,
    });

    await painting21.save();

    let painting22 = new Painting({
        name: "Sun's Awakening",
        image: "SunsAwakening.webp",
        dimensions: "18x24x1",
        date: "",
        paint: "Acrylic",
        canvas: "Wood Canvas",
        finish: "Epoxy Coating",
        desc: "",
        framed: true,
    });

    await painting22.save();

    let painting32 = new Painting({
        name: "Swallowtail in flight",
        image: "SwallowtailInflight.webp",
        dimensions: "24x24x7/8",
        date: "2025",
        paint: "Acrylic",
        canvas: "Wood Panel",
        finish: "Epoxy Coating",
        desc: "Mixed media art of a yellow swallowtail butterfly.",
    });

    await painting32.save();

    let painting34 = new Painting({
        name: "The Longest Journey",
        image: "TheLongestJourney.webp",
        dimensions: "39 1/18x31 1/2x1 3/8",
        date: "2025",
        paint: "Acrylic",
        canvas: "Canvas",
        finish: "Decorative High Gloss Coating",
        desc: "Mixed media art of birds migrating.",
    });

    await painting34.save();

    let painting36 = new Painting({
        name: "Tigers Forever",
        image: "TigersForever.webp",
        dimensions: "39 1/18x31 1/2x1 3/8",
        date: "2025",
        paint: "Acrylic",
        canvas: "Canvas",
        finish: "Decorative High Gloss Coating",
        desc: "Mixed media art of a stoic tiger with emerald eyes.",
    });

    await painting36.save();

    let painting23 = new Painting({
        name: "Transformation",
        image: "Transformation.webp",
        dimensions: "49x25x1 3/4",
        date: "2025",
        paint: "Oil",
        canvas: "Canvas",
        finish: "Varnish",
        desc: "",
        framed: true,
    });

    await painting23.save();

    let painting50 = new Painting({
        name: "Twilights Glow",
        image: "TwilightsGlow.webp",
        dimensions: "18x24x1 1/2",
        date: "2025",
        paint: "Acrylic",
        canvas: "Wood Panel",
        finish: "Epoxy Coating",
        desc: "",
        framed: true,
    });

    await painting50.save();

    let painting33 = new Painting({
        name: "Untitled",
        image: "Untitled1.webp",
        dimensions: "",
        date: "2025",
        paint: "",
        canvas: "",
        finish: "",
        desc: "",
        sold:true,
    });

    await painting33.save();

    let painting45 = new Painting({
        name: "Untitled",
        image: "Untitled2.webp",
        dimensions: "",
        date: "2025",
        paint: "",
        canvas: "",
        finish: "",
        desc: "",
        sold: true,
    });

    await painting45.save();

    let painting46 = new Painting({
        name: "Untitled",
        image: "Untitled3.webp",
        dimensions: "",
        date: "2025",
        paint: "",
        canvas: "",
        finish: "",
        desc: "",
        sold: true,
    });

    await painting46.save();

    let painting47 = new Painting({
        name: "Untitled",
        image: "Untitled4.webp",
        dimensions: "",
        date: "2025",
        paint: "",
        canvas: "",
        finish: "",
        desc: "",
        sold: true,
    });

    await painting47.save();
}

module.exports = setupPaintings;
