const viz = new Spacekit.Simulation(document.getElementById("main-container"), {
  basePath: "https://typpo.github.io/spacekit/src",
  unitsPerAu: 0.745,
  maxNumParticles: 2 ** 16,
  camera: {
    initialPosition: [3, 2, 1],
    enableDrift: false,
  },
});

// Create a skybox using NASA TYCHO artwork.
viz.createSkybox(Spacekit.SkyboxPresets.NASA_TYCHO);

async function configureAfricanSatellites() {
  // Créer la Terre
  const earth = viz.createSphere("Earth", {
    textureUrl: "./earth.jpg",
    debug: { showAxes: false },
    rotation: { enable: true, speed: 0.5 },
  });

  // Charger les données satellites depuis le fichier JSON
  const satEphemData = await fetch("./africanSatEphem.json").then((response) =>
    response.json()
  );

  const satellites = []; // Satellites actifs
  const satsInactive = []; // Satellites inactifs

  // Fonction pour créer un satellite
  function createSatellite(satData) {
    const [epoch, a, e, i, om, w, ma] = satData.data;

    const ephemeris = new Spacekit.Ephem(
      {
        epoch: epoch,
        a: a,
        e: e,
        i: i,
        om: om,
        w: w,
        ma: ma,
      },
      "deg"
    );

    return viz.createObject(satData.name, {
      ephem: ephemeris,
      textureUrl: "./satellite01.jpg",
      scale: [0.5, 0.5, 0.5],
      orbitPathSettings: {
        leadDurationYears: 0.2,
        trailDurationYears: 0.2,
        numberSamplePoints: 120,
      },
      hideOrbit: false,
      theme: {
        orbitColor: "#ffffff",
        color: "#ffffff",
      },
      labelText: satData.name,
    });
  }

  // Initialiser les satellites
  satEphemData.satellites.forEach((sat) => {
    const satellite = createSatellite(sat);
    satellite.orbitAround(earth);

    if (sat.status === "Inactive") {
      satsInactive.push({ object: satellite, status: sat.status });
    } else {
      satellites.push({ object: satellite, status: sat.status, isVisible: true });
    }
  });

  // Conteneur des boutons
  const controlsContainer = document.createElement("div");
  controlsContainer.style.position = "absolute";
  controlsContainer.style.top = "40px";
  controlsContainer.style.left = "10px";
  controlsContainer.style.zIndex = "10";
  document.body.appendChild(controlsContainer);

  // Fonction pour créer un bouton
  function createButton(label, onClick) {
    const button = document.createElement("button");
    button.innerText = label;
    button.style.margin = "2px";
    button.style.padding = "5px";
    button.style.fontSize = "12px";
    button.style.cursor = "pointer";
    button.onclick = onClick;
    controlsContainer.appendChild(button);
  }

  // Désactiver les satellites inactifs
  function deactivateSatellites() {
    satsInactive.forEach((sat) => {
      viz.removeObject(sat.object); // Retire l'objet de la visualisation
    });
  }

  // Activer ou réinitialiser les satellites inactifs
  function activateSatellites() {
    satsInactive.forEach((sat) => {
      if (!sat.object.isVisible) {
        viz.addObject(sat.object, false); // Ajoute à la simulation
        if (sat.object.getOrbit()) {
          sat.object.getOrbit().setVisibility(true); // Affiche l'orbite
        }
        sat.object.setLabelVisibility(true); // Affiche le label
        sat.isVisible = true;
      }
    });
  }

  // Boutons de contrôle
  createButton("Pause", () => viz.stop());
  createButton("Restart", () => viz.start());
  createButton("Speed Up", () => viz.setJdPerSecond(viz.getJdPerSecond() * 2));
  createButton("Slow", () => viz.setJdPerSecond(viz.getJdPerSecond() / 2));
  createButton("Remove inactive", deactivateSatellites);
  createButton("Reset", () => {
    viz.setJd(Date.now() / 86400000.0 + 2440587.5); // Date actuelle
    viz.start(); // Reprendre la simulation
    viz.setJdPerSecond(100); // Réinitialise la vitesse
    activateSatellites(); // Réactive les satellites inactifs
  });
}

configureAfricanSatellites();