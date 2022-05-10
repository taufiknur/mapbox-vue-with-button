<template>
  <div>
    <div id="map"></div>
    <div id="inputs">
      <div class="tooltip">
        <input type="button" value="Show Menu" @click="isShow = true" />
        <span class="tooltiptext tooltip-bottom">Show Menu</span>
      </div>
      <input type="button" id="goldenHourEnd" value="Hide Menu" @click="isShow = false"/>
      <input type="button" value="Fokus ID" id="fit" />
    </div>
    <div id="menu" v-if="isShow">
      <div>
        Hallow Test Menu
        <img
          width="100%"
          src="https://docs.mapbox.com/mapbox-gl-js/assets/cat.png"
          alt=""
        />
      </div>
      <!-- The worldview options will be built dynamically using JavaScript (below). -->
      <div id="worldview-options"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      markers: {},
      markersOnScreen: {},
      isShow: false
    };
  },
  mounted() {
    this.loader();
  },
  methods: {
    loader() {
      mapboxgl.accessToken =
        "pk.eyJ1IjoidGF1ZmlrbnVyIiwiYSI6ImNrN3N0bXBoYTBzdTEzbHJ2b2dxaHQ2bDMifQ.XnNZtDnItwYc8B4h9BL-TQ";
      const map = new mapboxgl.Map({
        container: "map",
        zoom: 4,
        center: [118.0148634, -2.548926],
        style: "mapbox://styles/mapbox/light-v10"
      });

      map.addControl(new mapboxgl.NavigationControl());

      // filters for classifying earthquakes into five categories based on magnitude
      const mag1 = ["<", ["get", "mag"], 2];
      const mag2 = ["all", [">=", ["get", "mag"], 2], ["<", ["get", "mag"], 3]];
      const mag3 = ["all", [">=", ["get", "mag"], 3], ["<", ["get", "mag"], 4]];
      const mag4 = ["all", [">=", ["get", "mag"], 4], ["<", ["get", "mag"], 5]];
      const mag5 = [">=", ["get", "mag"], 5];

      // colors to use for the categories
      const colors = ["#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c"];

      map.on("load", () => {
        // Load an image from an external URL.
        map.loadImage("https://flagcdn.com/256x192/id.png", (error, image) => {
          if (error) throw error;

          // Add the image to the map style.
          map.addImage("cat", image);

          // Add a data source containing one point feature.
          map.addSource("point", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: [118.0148634, -2.548926]
                  }
                }
              ]
            }
          });

          // Add a layer to use the image to represent the data.
          map.addLayer({
            id: "points",
            type: "symbol",
            source: "point", // reference the data source
            layout: {
              "icon-image": "cat", // reference the image
              "icon-size": 0.25
            }
          });
        });
        // add a clustered GeoJSON source for a sample set of earthquakes
        map.addSource("earthquakes", {
          type: "geojson",
          data:
            "https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson",
          cluster: true,
          clusterRadius: 80,
          clusterProperties: {
            // keep separate counts for each magnitude category in a cluster
            mag1: ["+", ["case", mag1, 1, 0]],
            mag2: ["+", ["case", mag2, 1, 0]],
            mag3: ["+", ["case", mag3, 1, 0]],
            mag4: ["+", ["case", mag4, 1, 0]],
            mag5: ["+", ["case", mag5, 1, 0]]
          }
        });
        // circle and symbol layers for rendering individual earthquakes (unclustered points)
        map.addLayer({
          id: "earthquake_circle",
          type: "circle",
          source: "earthquakes",
          filter: ["!=", "cluster", true],
          paint: {
            "circle-color": [
              "case",
              mag1,
              colors[0],
              mag2,
              colors[1],
              mag3,
              colors[2],
              mag4,
              colors[3],
              colors[4]
            ],
            "circle-opacity": 0.6,
            "circle-radius": 12
          }
        });
        map.addLayer({
          id: "earthquake_label",
          type: "symbol",
          source: "earthquakes",
          filter: ["!=", "cluster", true],
          layout: {
            "text-field": [
              "number-format",
              ["get", "mag"],
              { "min-fraction-digits": 1, "max-fraction-digits": 1 }
            ],
            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
            "text-size": 10
          },
          paint: {
            "text-color": ["case", ["<", ["get", "mag"], 3], "black", "white"]
          }
        });

        // objects for caching and keeping track of HTML marker objects (for performance)
        const markers = {};
        let markersOnScreen = {};

        function updateMarkers() {
          const newMarkers = {};
          const features = map.querySourceFeatures("earthquakes");

          // for every cluster on the screen, create an HTML marker for it (if we didn't yet),
          // and add it to the map if it's not there already
          for (const feature of features) {
            const coords = feature.geometry.coordinates;
            const props = feature.properties;
            if (!props.cluster) continue;
            const id = props.cluster_id;

            let marker = markers[id];
            if (!marker) {
              const el = createDonutChart(props);
              marker = markers[id] = new mapboxgl.Marker({
                element: el
              }).setLngLat(coords);
            }
            newMarkers[id] = marker;

            if (!markersOnScreen[id]) marker.addTo(map);
          }
          // for every marker we've added previously, remove those that are no longer visible
          for (const id in markersOnScreen) {
            if (!newMarkers[id]) markersOnScreen[id].remove();
          }
          markersOnScreen = newMarkers;
        }
        function createDonutChart(props) {
          const offsets = [];
          const counts = [
            props.mag1,
            props.mag2,
            props.mag3,
            props.mag4,
            props.mag5
          ];
          let total = 0;
          for (const count of counts) {
            offsets.push(total);
            total += count;
          }
          const fontSize =
            total >= 1000 ? 22 : total >= 100 ? 20 : total >= 10 ? 18 : 16;
          const r =
            total >= 1000 ? 50 : total >= 100 ? 32 : total >= 10 ? 24 : 18;
          const r0 = Math.round(r * 0.6);
          const w = r * 2;

          let html = `<div>
<svg width="${w}" height="${w}" viewbox="0 0 ${w} ${w}" text-anchor="middle" style="font: ${fontSize}px sans-serif; display: block">`;

          for (let i = 0; i < counts.length; i++) {
            html += donutSegment(
              offsets[i] / total,
              (offsets[i] + counts[i]) / total,
              r,
              r0,
              colors[i]
            );
          }
          html += `<circle cx="${r}" cy="${r}" r="${r0}" fill="white" />
<text dominant-baseline="central" transform="translate(${r}, ${r})">
${total.toLocaleString()}
</text>
</svg>
</div>`;

          const el = document.createElement("div");
          el.innerHTML = html;
          return el.firstChild;
        }

        function donutSegment(start, end, r, r0, color) {
          if (end - start === 1) end -= 0.00001;
          const a0 = 2 * Math.PI * (start - 0.25);
          const a1 = 2 * Math.PI * (end - 0.25);
          const x0 = Math.cos(a0),
            y0 = Math.sin(a0);
          const x1 = Math.cos(a1),
            y1 = Math.sin(a1);
          const largeArc = end - start > 0.5 ? 1 : 0;

          // draw an SVG path
          return `<path d="M ${r + r0 * x0} ${r + r0 * y0} L ${r + r * x0} ${r +
            r * y0} A ${r} ${r} 0 ${largeArc} 1 ${r + r * x1} ${r +
            r * y1} L ${r + r0 * x1} ${r +
            r0 * y1} A ${r0} ${r0} 0 ${largeArc} 0 ${r + r0 * x0} ${r +
            r0 * y0}" fill="${color}" />`;
        }

        // fit

        document.getElementById("fit").addEventListener("click", () => {
          map.fitBounds([
            // [97.318123,5.051701], //ACEH
            // [140.71813,-2.53371], //JAYAPURA
            // [123.597603,-10.178757] //KUPANG
            [112.28900566392672,-9.64919305281563], 
            [124.53196999645662, 4.567331522854541]
          ]);
        });

        // after the GeoJSON data is loaded, update markers on the screen on every frame

        map.on("render", () => {
          if (!map.isSourceLoaded("earthquakes")) return;
          updateMarkers();
        });
      });
    }
  }
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
}
#map {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}
#inputs {
  position: absolute;
  top: 0;
  left: 0;
  padding: 10px;
}
#menu {
  position: absolute;
  background: #fff;
  padding: 20px;
  margin: 20px;
  font-family: "Open Sans", sans-serif;
  max-width: 180px;
  top: 20px;
  left: -9px;
}
#worldview-options {
  margin-top: 10px;
}
.tooltip {
  position: relative;
  display: inline-block;
  border-bottom: 1px dotted #ccc;
  color: #006080;
}
.tooltip .tooltiptext {
  visibility: hidden;
  position: absolute;
  width: 120px;
  background-color: #555;
  color: #fff;
  text-align: center;
  padding: 5px 0;
  border-radius: 6px;
  z-index: 1;
  opacity: 0;
  transition: opacity 0.6s;
}
.tooltip:hover .tooltiptext {
  visibility: visible;
}
.tooltip-bottom {
  top: 135%;
  left: 50%;
  margin-left: -60px;
}
</style>
