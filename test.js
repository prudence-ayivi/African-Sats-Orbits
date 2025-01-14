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
  // Terre
  const earth = viz.createSphere("Earth", {
    textureUrl: "./earth.jpg",
    debug: {
      showAxes: false,
    },
    rotation: {
      enable: true,
      speed: 0.5,
    },
  });

  // Charger les données depuis le fichier JSON
  const satEphemData = await fetch("./africanSatEphem.json").then((response) =>
    response.json()
  );

  const satellites = [];
  const satsInactive = [];

  // Parcourir les satellites et les ajouter à la visualisation
  satEphemData.satellites.forEach((sat) => {
    const [epoch, a, e, i, om, w, ma] = sat.data; // a divisé par 4000 pour faciliter la vue

    // Créer l'épheméride à partir des données JSON
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

    // Créer l'objet satellite
    const satellite = viz.createObject(sat.name, {
      ephem: ephemeris,
      textureUrl: "./satellite01.jpg",
      scale: [0.5, 0.5, 0.5], // Échelle du satellite
      orbitPathSettings: {
        leadDurationYears: 0.2,
        trailDurationYears: 0.2,
        numberSamplePoints: 120,
      },
      hideOrbit: false,
      theme: {
        orbitColor: "#ffffff", // Couleur de l'orbite
        color: "#ffffff",
      },
      labelText: sat.name, // Nom du satellite
    });

    satellites.push({ object: satellite, status: sat.status, isVisible: true });
    satsInactive.push({sat})
    satellite.orbitAround(earth);

    // Ajouter un conteneur pour les boutons
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

    // Bouton Pause
    createButton("Pause", () => {
      viz.stop();
    });

    // Bouton Reprendre
    createButton("Restart", () => {
      viz.start();
    });

    // Bouton Accélérer
    createButton("Speed Up", () => {
      const currentSpeed = viz.getJdPerSecond();
      viz.setJdPerSecond(currentSpeed * 2); // Double la vitesse
    });

    // Bouton Ralentir
    createButton("Slow", () => {
      const currentSpeed = viz.getJdPerSecond();
      viz.setJdPerSecond(currentSpeed / 2); // Divise la vitesse par 2
    });

    // Bouton Enlever inactive
    createButton("Remove inactive", () => {
      satellites.forEach((sat) => {
        if (sat.status === "Inactive") {
          viz.removeObject(sat.object); // Supprime le satellite de la simulation
          sat.isVisible = false; // Met à jour l'état de visibilité
        }
      });
    });

    // Bouton Réinitialiser la Simulation
    createButton("Reset", () => {
      viz.setJd(Date.now() / 86400000.0 + 2440587.5); // Remet à la date actuelle
      viz.start(); // Reprendre la simulation
      viz.setJdPerSecond(100); // réinitialise la vitesse
      satellites.forEach((sat) => {
        // if (sat.status === "Inactive") {          // Réafficher les satellites inactifs
        //   viz.addObject(sat.object, true); // Réajoute les satellites supprimés
        // }

        if (!sat.isVisible) {
          console.log("Before addObject:", sat);
          viz.addObject(sat.object, false); // Réajoute l'objet
          console.log("Object re-added:", sat.object);
          if (sat.object.getOrbit()) {
            sat.object.getOrbit().setVisibility(true); // Affiche l'orbite
          }
          sat.object.setLabelVisibility(true); // Affiche le label
          console.log("Label visibility set to true");

        }

      });
    });
  });
}

// Appeler la fonction pour configurer les satellites
configureAfricanSatellites();

// // Champ pour définir une date locale
// const dateInput = document.createElement('input');
// dateInput.type = 'datetime-local';
// dateInput.style.margin = '5px';
// dateInput.style.padding = '5px';
// dateInput.style.fontSize = '12px';
// dateInput.onchange = () => {
//   const date = new Date(dateInput.value);
//   const jd = (date.getTime() / 86400000.0) + 2440587.5; // Convertir en Julian Date
//   viz.setJd(jd);
// };
// controlsContainer.appendChild(dateInput);
