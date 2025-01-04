const viz = new Spacekit.Simulation(document.getElementById('main-container'), {
    basePath: 'https://typpo.github.io/spacekit/src',
    camera: {
    initialPosition: [3, 2, 1],
    enableDrift: false, },    
  });
  
// Create a skybox using NASA TYCHO artwork.
viz.createSkybox(Spacekit.SkyboxPresets.NASA_TYCHO);


  // Create a background using Yale Bright Star Catalog data.
//   viz.createStars();

viz.createSphere('earth', {
    textureUrl: './earth.jpg',
    debug: {
      showAxes: false,
    },
    rotation: {
      enable: true,
      speed: 0.5,
    },
});

  // Create our first object - the sun - using a preset space object.
//   viz.createObject('sun', Spacekit.SpaceObjectPresets.SUN);
  
  const roadster = viz.createObject('spaceman', {
    labelText: 'Tesla Roadster',
    theme: {
    orbitColor: 0xff00ff,
  },
    ephem: new Spacekit.Ephem({
      // These parameters define orbit shape.
      a: 1.324870564730606E+00,
      e: 2.557785995665682E-01,
      i: 1.077550722804860E+00,
      
      // These parameters define the orientation of the orbit.
      om: 3.170946964325638E+02,
      w: 1.774865822248395E+02,
      ma: 1.764302192487955E+02,
      
      // Where the object is in its orbit.
      epoch: 2458426.500000000,
    }, 'deg'),
  });

  const egyptsat1 = viz.createObject('satellite', {
    labelText: 'EGYPTSAT 1',
    theme: {
      orbitColor: 0x00ff00, // Couleur de l'orbite
    },
    scale: [0.1, 0.1, 0.1],
    ephem: new Spacekit.Ephem({
      // Paramètres définissant la forme de l'orbite
      a: (6378 + 643.9), // Demi-grand axe en km (rayon de la Terre + altitude moyenne)
      e: 0.00058, // Excentricité
      
      // Paramètres définissant l'orientation de l'orbite
      i: 97.992, // Inclinaison en degrés
      om: 20.965 * 15, // Ascension droite du nœud ascendant en degrés (convertie depuis heures)
      w: 32.796, // Argument du périgée en degrés
      ma: 327.361, // Anomalie moyenne en degrés
      
      // Position de l'objet dans son orbite
      epoch: 2460601.414583333, // Converti depuis l'heure et la date (01 Jan 2025, 21:56) vers le format Julian
    }, 'deg'),  

  });

  const gaindesat1a = viz.createObject('satellite', {
    labelText: 'GAINDESAT-1A',
    theme: {
      orbitColor: 0x0000ff, // Couleur de l'orbite
    },
    ephem: new Spacekit.Ephem({
      // Paramètres définissant la forme de l'orbite
      a: (6378 + 484.8), // Demi-grand axe en km (rayon de la Terre + altitude moyenne)
      e: 0.00079, // Excentricité
      
      // Paramètres définissant l'orientation de l'orbite
      i: 97.430, // Inclinaison en degrés
      om: 5.492 * 15, // Ascension droite du nœud ascendant en degrés (convertie depuis heures)
      w: 25.291, // Argument du périgée en degrés
      ma: 334.871, // Anomalie moyenne en degrés
      
      // Position de l'objet dans son orbite
      epoch: 2460601.419444444, // Converti depuis l'heure et la date (01 Jan 2025, 22:04) vers le format Julian
    }, 'deg'),
  });
  
  