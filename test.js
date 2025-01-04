const viz = new Spacekit.Simulation(document.getElementById('main-container'), {
    basePath: 'https://typpo.github.io/spacekit/src',
    // startDate: Date.now(),
//  jd: 0.0,
//  jdDelta: 10.0,
//  jdPerSecond: 100.0,  // overrides jdDelta
//  startPaused: false,
 unitsPerAu: 0.74,
 maxNumParticles: 2**16,
    camera: {
      initialPosition: [3, 2, 1],
      enableDrift: false,
    },
  });
  
  // Create a skybox using NASA TYCHO artwork.
  viz.createSkybox(Spacekit.SkyboxPresets.NASA_TYCHO);
  
async function configureAfricanSatellites() {
    // Terre
    const earth = viz.createSphere('Earth', {
      textureUrl: './earth.jpg',
      debug: {
        showAxes: false,
      },
      rotation: {
        enable: true,
        speed: 0.2,
      },
    });
  
    // Charger les données depuis le fichier JSON
    const satEphemData = await fetch('./africanSatEphem.json').then((response) =>
      response.json()
    );
  
    // Parcourir les satellites et les ajouter à la visualisation
    satEphemData.satellites.forEach((sat) => {
      const [epoch, a, e, i, om, w, ma] = sat.data; // a divisé par 4000 pour faciliter la vue
  
      // Créer une épheméride à partir des données JSON
      const ephemeris = new Spacekit.Ephem({
        epoch: epoch,
        a: a,
        e: e,
        i: i,
        om: om,
        w: w,
        ma: ma,
      }, 'deg');
  
      // Créer l'objet satellite
      const satellite = viz.createObject('Satellite', {
        ephem: ephemeris,
        textureUrl: './satellite01.jpg',
        scale: [0.1, 0.1, 0.1], // Échelle du satellite
        orbitPathSettings: {
          leadDurationYears: 0.2,
          trailDurationYears: 0.2,
          numberSamplePoints: 120,
        },
        theme: {
          orbitColor: 0x174b7a, // Couleur de l'orbite
          color: 0x174b7a,
        },
        labelText: sat.name, // Nom du satellite
      });
  
      // Faire orbiter le satellite autour de la Terre
      satellite.orbitAround(earth);
    });
  }
  
  // Appeler la fonction pour configurer les satellites
  configureAfricanSatellites();
  