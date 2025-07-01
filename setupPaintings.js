async function setupPaintings(Painting) {
    let template = new Painting({
        name: "Example",
        image: "Example.jpg",
        dimensions: "Length x Width x Depth x (Optional) Number- ex- 24x24x2",
        date: "2025",
        paint: "Acrylic",
        canvas: "Wood",
        finish: "Glossy",
        desc: "This is some example text",
        mult: false,
        framed: true,
        sold: true
    });

    let blankTemplate = new Painting({
        name: "",
        image: "",
        dimensions: "",
        date: "",
        paint: "",
        canvas: "",
        finish: "",
        desc: "",
        framed: true,
        sold: true
    });

    let painting1 = new Painting({
        name: "Beyond The Limit",
        image: "BeyondTheLimit.jpg",
        dimensions: "24x24x1",
        date: "",
        paint: "Oil",
        canvas: "Wood Canvas",
        finish: "Epoxy Coating",
        desc: "",
    });

    await painting1.save();

    let painting2 = new Painting({
        name: "Blue Pallete",
        image: "BluePallete.jpg",
        dimensions: "36x36x1",
        date: "",
        paint: "Oil",
        canvas: "Fabric Canvas",
        finish: "Textured Finish",
        desc: "",
    });

    await painting2.save();

    let painting3 = new Painting({
        name: "Chasing Blues",
        image: "ChasingBlues.jpg",
        dimensions: "16x24x1",
        date: "2021",
        paint: "Oil",
        canvas: "Wood Canvas",
        finish: "",
        desc: "",
    });

    await painting3.save();

    let painting4 = new Painting({
        name: "Circular Echo",
        image: "CircularEcho.jpg",
        dimensions: "24x24x1",
        date: "",
        paint: "",
        canvas: "",
        finish: "",
        desc: "",
    });

    await painting4.save();

    let painting5 = new Painting({
        name: "Colors In Motion",
        image: "ColorsInMotion.jpg",
        dimensions: "30x36x1",
        date: "",
        paint: "Acrylic",
        canvas: "",
        finish: "",
        desc: "",
    });

    await painting5.save();

    let painting6 = new Painting({
        name: "Colors Of Liberty",
        image: "ColorsOfLiberty.jpg",
        dimensions: "24x30x1",
        date: "",
        paint: "",
        canvas: "",
        finish: "",
        desc: "",
    });

    await painting6.save();

    let painting7 = new Painting({
        name: "Color Spectrum",
        image: "ColorSpectrum.jpg",
        dimensions: "36x48x1",
        date: "",
        paint: "Acrylic",
        canvas: "Wood Canvas",
        finish: "Epopxy Coating",
        desc: "",
    });

    await painting7.save();

    let painting8 = new Painting({
        name: "Cosmic Tides",
        image: "CosmicTides.jpg",
        dimensions: "12x18x1",
        date: "",
        paint: "Acrylic",
        canvas: "",
        finish: "",
        desc: "",
        sold: true
    });

    await painting8.save();

    let painting9 = new Painting({
        name: "Dot Fusion",
        image: "DotFusion.jpg",
        dimensions: "48x48x1",
        date: "",
        paint: "",
        canvas: "",
        finish: "",
        desc: "",
    });

    await painting9.save();

    let painting10 = new Painting({
        name: "Dot Symphony",
        image: "DotSymphony.jpg",
        dimensions: "",
        date: "",
        paint: "",
        canvas: "",
        finish: "",
        desc: "",
        sold: true
    });

    await painting10.save();

    let painting11 = new Painting({
        name: "Eternal Light",
        image: "EternalLight.jpg",
        dimensions: "36x48x1",
        date: "",
        paint: "Oil",
        canvas: "",
        finish: "",
        desc: "",
        framed: true,
        sold: true
    });

    await painting11.save();

    let painting12 = new Painting({
        name: "Eternal Sunshine",
        image: "EternalSunshine.jpg",
        dimensions: "36x48x1",
        date: "",
        paint: "Acrylic",
        canvas: "",
        finish: "",
        desc: "",
        sold: true
    });

    await painting12.save();

    let painting13 = new Painting({
        name: "Flowing Essence",
        image: "FlowingEssence.jpg",
        dimensions: "6x6x1",
        date: "",
        paint: "Acrylic",
        canvas: "Wood Canvas",
        finish: "Epoxy Coating",
        desc: "",
        mult: true,
        sold: true
    });

    await painting13.save();

    let painting14 = new Painting({
        name: "Hazy Drift",
        image: "HazyDrift.jpg",
        dimensions: "36x60x1",
        date: "",
        paint: "Acrylic",
        canvas: "",
        finish: "",
        desc: "",
    });

    await painting14.save();

    let painting15 = new Painting({
        name: "Liquid Dreamscapes",
        image: "LiquidDreamscapes.jpg",
        dimensions: "",
        date: "",
        paint: "",
        canvas: "",
        finish: "",
        desc: "",
        sold: true
    });

    await painting15.save();

    let painting16 = new Painting({
        name: "Liquid Horizons",
        image: "LiquidHorizons.jpg",
        dimensions: "48x60x1",
        date: "",
        paint: "",
        canvas: "",
        finish: "",
        desc: ""
    });

    await painting16.save();

    let painting17 = new Painting({
        name: "Oribits In Motion",
        image: "OribitsInMotion.jpg",
        dimensions: "8x8x1",
        date: "",
        paint: "",
        canvas: "Wood Canvas",
        finish: "",
        desc: "",
        mult: true
    });

    await painting17.save();

    let painting18 = new Painting({
        name: "Pinwheel",
        image: "Pinwheel.jpg",
        dimensions: "36x48x1",
        date: "",
        paint: "Acrylic",
        canvas: "",
        finish: "",
        desc: "",
        sold: true
    });

    await painting18.save();

    let painting19 = new Painting({
        name: "Retro Vibe",
        image: "RetroVibe.jpg",
        dimensions: "36x48x1",
        date: "",
        paint: "Acrylic",
        canvas: "Wood Canvas",
        finish: "Epoxy Coatings",
        desc: "",
        sold: true
    });

    await painting19.save();

    let painting20 = new Painting({
        name: "Spectrum Of The Sea",
        image: "SpectrumOfTheSea.jpg",
        dimensions: "18x24x1",
        date: "",
        paint: "Acrylic",
        canvas: "",
        finish: "",
        desc: "Floating Frame",
        framed: true,
        sold: true
    });

    await painting20.save();

    let painting21 = new Painting({
        name: "Strokes Of Light",
        image: "StrokesOfLight.jpg",
        dimensions: "18x24x1",
        date: "",
        paint: "Oil",
        canvas: "",
        finish: "",
        desc: "",
        framed: true,
        sold: true
    });

    await painting21.save();

    let painting22 = new Painting({
        name: "Sun's Awakening",
        image: "SunsAwakening.jpg",
        dimensions: "18x24",
        date: "",
        paint: "Acrylic",
        canvas: "Wood Canvas",
        finish: "Epoxy Coating",
        desc: "",
        framed: true
    });

    await painting22.save();


    /*

    let painting23 = new Painting({
        name: "",
        image: "P23.jpg",
        dimensions: "",
        date: "2025",
        paint: "",
        canvas: "",
        finish: "",
        desc: "",
    });

    await painting23.save();

    let painting24 = new Painting({
        name: "",
        image: "P24.jpg",
        dimensions: "",
        date: "2025",
        paint: "",
        canvas: "",
        finish: "",
        desc: "",
    });

    await painting24.save();

    let painting25 = new Painting({
        name: "",
        image: "P25.jpg",
        dimensions: "",
        date: "2025",
        paint: "",
        canvas: "",
        finish: "",
        desc: "",
    });

    await painting25.save();

    let painting26 = new Painting({
        name: "",
        image: "P26.jpg",
        dimensions: "",
        date: "2025",
        paint: "",
        canvas: "",
        finish: "",
        desc: "",
    });

    await painting26.save();

    let painting27 = new Painting({
        name: "",
        image: "P27.jpg",
        dimensions: "",
        date: "2025",
        paint: "",
        canvas: "",
        finish: "",
        desc: "",
        sold: true
    });

    await painting27.save();

    let painting28 = new Painting({
        name: "",
        image: "P28.jpg",
        dimensions: "",
        date: "2025",
        paint: "",
        canvas: "",
        finish: "",
        desc: "",
    });

    await painting28.save();

    let painting29 = new Painting({
        name: "",
        image: "P29.jpg",
        dimensions: "",
        date: "2025",
        paint: "",
        canvas: "",
        finish: "",
        desc: "",
    });

    await painting29.save();

    let painting30 = new Painting({
        name: "",
        image: "P30.jpg",
        dimensions: "",
        date: "2025",
        paint: "",
        canvas: "",
        finish: "",
        desc: "",
    });

    await painting30.save();

    let painting31 = new Painting({
        name: "",
        image: "P31.jpg",
        dimensions: "",
        date: "2025",
        paint: "",
        canvas: "",
        finish: "",
        desc: "",
    });

    await painting31.save();

    let painting32 = new Painting({
        name: "",
        image: "P32.jpg",
        dimensions: "",
        date: "2025",
        paint: "",
        canvas: "",
        finish: "",
        desc: "",
    });

    await painting32.save();

    let painting33 = new Painting({
        name: "",
        image: "P33.jpg",
        dimensions: "",
        date: "2025",
        paint: "",
        canvas: "",
        finish: "",
        desc: "",
    });

    await painting33.save();

    let painting34 = new Painting({
        name: "",
        image: "P34.jpg",
        dimensions: "",
        date: "2025",
        paint: "",
        canvas: "",
        finish: "",
        desc: "",
    });

    await painting34.save();

    let painting35 = new Painting({
        name: "",
        image: "P35.jpg",
        dimensions: "",
        date: "2025",
        paint: "",
        canvas: "",
        finish: "",
        desc: "",
    });

    await painting35.save();

    let painting36 = new Painting({
        name: "",
        image: "P36.jpg",
        dimensions: "",
        date: "2025",
        paint: "",
        canvas: "",
        finish: "",
        desc: "",
    });

    await painting36.save();

    let painting37 = new Painting({
        name: "",
        image: "P37.jpg",
        dimensions: "",
        date: "2025",
        paint: "",
        canvas: "",
        finish: "",
        desc: "",
    });

    await painting37.save();
    */
}

module.exports = setupPaintings;