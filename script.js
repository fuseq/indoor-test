    // Yön bilgilerini yazdıran işlev
    function deviceOrientationHandler(tiltLR, tiltFB, dir, absolute) {
        const instructionsDiv = document.querySelector('.instructions');
        instructionsDiv.innerHTML = `
          <p>Tilt Left/Right (Gamma): ${Math.ceil(tiltLR)}°</p>
          <p>Tilt Front/Back (Beta): ${Math.ceil(tiltFB)}°</p>
          <p>Direction (Alpha - ${absolute ? 'Absolute' : 'Relative'}): ${Math.ceil(dir)}°</p>
        `;
    }

    // Cihazın yön bilgisini alma işlevi
    document.addEventListener('DOMContentLoaded', function(event) {
        if ('ondeviceorientationabsolute' in window) {
            // Mutlak yön destekleniyor
            window.addEventListener('deviceorientationabsolute', (eventData) => {
                const tiltLR = eventData.gamma;
                const tiltFB = eventData.beta;
                const dir = eventData.alpha; 
                deviceOrientationHandler(tiltLR, tiltFB, dir, true);
            }, false);
        } else if ('ondeviceorientation' in window) {
            // Mutlak yön desteklenmiyor, normal yön bilgisi
            window.addEventListener('deviceorientation', (eventData) => {
                const tiltLR = eventData.gamma;
                const tiltFB = eventData.beta;
                const dir = eventData.alpha;
                const absolute = eventData.absolute;
                deviceOrientationHandler(tiltLR, tiltFB, dir, absolute);
            }, false);
        } else {
            document.querySelector('.instructions').innerHTML = 'Device Orientation API not supported.';
        }
    });

    window.onload = () => {
        const button = document.querySelector('button[data-action="change"]');
        button.innerText = '﹖';

        let places = staticLoadPlaces();
        renderPlaces(places);
    };

    function staticLoadPlaces() {
        return [
            {
                name: 'Pokèmon',
                location: {
                    lat: 37.42555,
                    lng: 31.85118,
                },
            },
        ];
    }

    var models = [
        {
            url: './assets/pin/scene.gltf',
            scale: '5 5 5',
            info: 'Pin, Lv. 5, HP 10/10',
            rotation: '0 0 0',
        },
    ];

    var modelIndex = 0;
    var setModel = function (model, entity) {
        if (model.scale) {
            entity.setAttribute('scale', model.scale);
        }

        if (model.rotation) {
            entity.setAttribute('rotation', model.rotation);
        }

        if (model.position) {
            entity.setAttribute('position', model.position);
        }

        entity.setAttribute('gltf-model', model.url);

        const div = document.querySelector('.instructions');
        div.innerText = model.info;
    };

    function renderPlaces(places) {
        let scene = document.querySelector('a-scene');

        places.forEach((place) => {
            let latitude = place.location.lat;
            let longitude = place.location.lng;

            let model = document.createElement('a-entity');
            model.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);

            setModel(models[modelIndex], model);

            model.setAttribute('animation-mixer', '');

            document.querySelector('button[data-action="change"]').addEventListener('click', function () {
                var entity = document.querySelector('[gps-entity-place]');
                modelIndex++;
                var newIndex = modelIndex % models.length;
                setModel(models[newIndex], entity);
            });

            scene.appendChild(model);
        });
    }