/* =========================================================
   ARCHIVO GENERADO — no lo edites a mano.
   Fuente: data/cars.json · Regenerar: node tools/build-data.mjs
   Sólo se usa al abrir el museo sin servidor (file://).
   ========================================================= */
window.MUSEO = {
  "$schema": "./cars.schema.md",
  "museum": {
    "name": "Museo digital del automóvil",
    "hall": "index.html",
    "legal": "Este sitio web es un proyecto interactivo sin ánimo de lucro de divulgación técnica, diseño frontend y homenaje al automovilismo. Los nombres, emblemas y marcas comerciales (Ferrari, Nissan, McLaren, BMW, Porsche, Bilstein, Brembo y asociadas) son propiedad exclusiva de sus respectivos fabricantes y se exhiben bajo fines exclusivamente educativos e ilustrativos.",
    "privacy": [
      "Sin cookies de rastreo, analítica ni publicidad.",
      "No se recogen ni almacenan datos personales: no hay formularios, cuentas ni un servidor propio que los reciba.",
      "Sólo si aceptas el aviso de almacenamiento, tu navegador guarda en tu propio dispositivo (localStorage) las preferencias de la visita: modo de lectura, pieza consultada, reglajes, color y audio. Puedes borrarlas cuando quieras.",
      "Las tipografías se descargan de Google Fonts: como en cualquier petición web, tu navegador comunica su dirección IP a esos servidores.",
      "El alojamiento web puede registrar datos técnicos de acceso (como la IP) igual que cualquier servidor; este sitio no los consulta ni los cruza.",
      "La web no carga scripts de terceros: una política de seguridad de contenidos (CSP) estricta sólo permite su propio código."
    ],
    "trademarks": "Ferrari, Nissan, McLaren, BMW, Porsche y proveedores asociados (Brembo, Michelin, Bilstein, etc.) son marcas registradas de sus respectivos propietarios. Este sitio web es un proyecto educativo de diseño e ingeniería frontend sin fines comerciales ni afiliación oficial con las marcas mencionadas."
  },
  "cars": [
    {
      "id": "ferrari-f40",
      "slug": "f40",
      "name": "Ferrari F40",
      "brand": "Ferrari",
      "make": "Ferrari",
      "model": "F40",
      "year": 1987,
      "years": "1987 — 1992",
      "theme": "maranello",
      "palette": {
        "accent": "#d40000",
        "body": "#d40000",
        "note": "Rosso Corsa; el tema maranello define el resto de la paleta",
        "hallAccent": "212, 0, 0"
      },
      "marks": [
        "Ferrari",
        "F40"
      ],
      "exitLine": "El último superdeportivo aprobado por Enzo Ferrari",
      "meta": {
        "title": "Ferrari F40 · 1987–1992",
        "description": "Sala 01 del museo digital del automóvil: historia, anatomía interactiva y la ingeniería pieza a pieza del Ferrari F40."
      },
      "specs": {
        "engine": {
          "label": "Motor",
          "value": "V8 biturbo F120A",
          "note": "2.936 cc · central trasero"
        },
        "power": {
          "label": "Potencia",
          "value": 478,
          "unit": "CV",
          "note": "a 7.000 rpm"
        },
        "torque": {
          "label": "Par motor",
          "value": 577,
          "unit": "Nm",
          "note": "a 4.000 rpm"
        },
        "topSpeed": {
          "label": "Velocidad máxima",
          "value": 324,
          "unit": "km/h"
        },
        "acceleration": {
          "label": "0 – 100 km/h",
          "value": 4.1,
          "unit": "s",
          "decimals": 1
        },
        "weight": {
          "label": "Peso en seco",
          "value": 1100,
          "unit": "kg"
        },
        "drivetrain": {
          "label": "Tracción",
          "value": "Trasera",
          "note": "autoblocante"
        },
        "production": {
          "label": "Unidades",
          "value": 1315
        }
      },
      "images": {
        "f40-perfil": {
          "role": "hero",
          "src": "f40/img/f40-perfil.webp",
          "w": 1536,
          "h": 1024,
          "alt": "Ferrari F40 rojo de perfil sobre suelo de estudio reflectante",
          "formats": [
            "avif",
            "webp"
          ]
        },
        "pieza-motor": {
          "role": "exploded",
          "src": "f40/img/pieza-motor.webp",
          "w": 1536,
          "h": 1024,
          "alt": "Motor V8 biturbo desmontado con turbos, colectores y cajas de admisión",
          "formats": [
            "avif",
            "webp"
          ]
        },
        "pieza-cockpit": {
          "role": "exploded",
          "src": "f40/img/pieza-cockpit.webp",
          "w": 1536,
          "h": 1024,
          "alt": "Habitáculo del F40 sobre el chasis tubular, con asientos baquet rojos",
          "formats": [
            "avif",
            "webp"
          ]
        },
        "pieza-aero": {
          "role": "exploded",
          "src": "f40/img/pieza-aero.webp",
          "w": 1536,
          "h": 1024,
          "alt": "Zaga del F40 con alerón integrado y paneles de fibra de carbono",
          "formats": [
            "avif",
            "webp"
          ]
        },
        "pieza-chasis": {
          "role": "exploded",
          "src": "f40/img/pieza-chasis.webp",
          "w": 1536,
          "h": 1024,
          "alt": "Chasis tubular completo del F40 visto de perfil",
          "formats": [
            "avif",
            "webp"
          ]
        },
        "pieza-suspension": {
          "role": "exploded",
          "src": "f40/img/pieza-suspension.webp",
          "w": 1536,
          "h": 1024,
          "alt": "Eje trasero completo con suspensión de doble horquilla, diferencial, semiejes y frenos",
          "formats": [
            "avif",
            "webp"
          ]
        },
        "pieza-frenos": {
          "role": "exploded",
          "src": "f40/img/pieza-frenos.webp",
          "w": 1536,
          "h": 1024,
          "alt": "Disco de freno perforado con pinza roja",
          "formats": [
            "avif",
            "webp"
          ]
        },
        "pieza-llanta": {
          "role": "exploded",
          "src": "f40/img/pieza-llanta.webp",
          "w": 1024,
          "h": 1536,
          "alt": "Llanta Speedline de cinco radios con neumático Pirelli P Zero",
          "formats": [
            "avif",
            "webp"
          ]
        },
        "pieza-capo": {
          "role": "exploded",
          "src": "f40/img/pieza-capo.webp",
          "w": 1536,
          "h": 1024,
          "alt": "Tapa del motor de composite con lamas de ventilación",
          "formats": [
            "avif",
            "webp"
          ]
        }
      },
      "hall": {
        "text": "El último superdeportivo aprobado por Enzo Ferrari, creado para celebrar el 40 aniversario de la marca. Historia, anatomía interactiva y la ingeniería de cada pieza.",
        "specs": [
          [
            "478 CV",
            "V8 biturbo"
          ],
          [
            "324 km/h",
            "Vel. máxima"
          ],
          [
            "1.100 kg",
            "En seco"
          ]
        ],
        "image": {
          "ref": "f40-perfil",
          "fit": "contain"
        }
      },
      "colors": {
        "base": "f40/img/f40-perfil.webp",
        "default": "rosso",
        "list": [
          {
            "key": "rosso",
            "name": "Rosso Corsa",
            "swatch": "#D40000",
            "glow": [
              212,
              0,
              0
            ],
            "gk": 1
          },
          {
            "key": "nero",
            "name": "Nero Daytona",
            "swatch": "#111111",
            "glow": [
              150,
              175,
              210
            ],
            "gk": 0.85,
            "tint": "0 1 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"
          },
          {
            "key": "giallo",
            "name": "Giallo Modena",
            "swatch": "#FFCC00",
            "glow": [
              255,
              186,
              48
            ],
            "gk": 0.7,
            "tint": "1 0 0 0 0  0.8 0.2 0 0 0  0 0 1 0 0  0 0 0 1 0"
          }
        ]
      },
      "audio": {
        "src": "f40/f40-engine.mp3",
        "label": "Escuchar el V8",
        "subject": "el sonido del V8"
      },
      "sections": [
        {
          "type": "hero-cinematic",
          "id": "inicio",
          "nav": "Historia",
          "kicker": [
            "Maranello",
            "40 aniversario"
          ],
          "title": "F40",
          "image": "f40-perfil",
          "lead": {
            "historia": "El último superdeportivo aprobado por <em>Enzo Ferrari</em>, creado para celebrar el 40 aniversario de la marca. Sin asistencias, sin concesiones: una máquina de carreras con matrícula.",
            "tecnico": "V8 biturbo de <em>2.936 cc</em> a 1,1 bar, chasis tubular de acero y carrocería de composite. <em>1.100 kg</em> en seco y ni una sola asistencia electrónica."
          },
          "facts": {
            "historia": [
              [
                "1987",
                "Presentación"
              ],
              [
                "40 años",
                "Aniversario"
              ],
              [
                "1.315",
                "Unidades"
              ]
            ],
            "tecnico": [
              [
                "478 CV",
                "A 7.000 rpm"
              ],
              [
                "1,1 bar",
                "2 × IHI"
              ],
              [
                "7,7:1",
                "Compresión"
              ]
            ]
          },
          "cue": {
            "label": "Descubrir",
            "target": "anatomia",
            "aria": "Ir a la anatomía"
          }
        },
        {
          "type": "anatomy-tabs",
          "id": "anatomia",
          "nav": "Anatomía",
          "kicker": [
            "Anatomía",
            "vista lateral"
          ],
          "title": "Cada línea tiene un propósito.",
          "intro": "Pulsa un punto sobre el coche o una pestaña para ver su ficha completa. El contenido cambia con el modo Historia o Técnico, y el coche con el color que elijas arriba.",
          "image": {
            "ref": "f40-perfil",
            "alt": "Ferrari F40 de perfil sobre suelo de estudio reflectante"
          },
          "points": [
            {
              "x": 7.8,
              "y": 54.7,
              "side": "t",
              "label": "Frontal",
              "aria": "Frontal y aerodinámica delantera",
              "num": "01 · Aerodinámica delantera",
              "title": "Frontal y morro",
              "historia": {
                "text": [
                  "El morro del F40 es bajo, afilado y casi plano, una declaración de intenciones dibujada por Pininfarina. Detrás de sus cubiertas transparentes se esconden las luces fijas, y los faros escamoteables sólo asoman cuando hacen falta.",
                  "Visto de frente transmite agresividad pura: una boca ancha y baja que parece pegada al asfalto, heredera directa de los prototipos de Le Mans."
                ],
                "specs": [
                  [
                    "Diseño",
                    "Pininfarina"
                  ],
                  [
                    "Faros",
                    "Escamoteables + luces fijas"
                  ],
                  [
                    "Inspiración",
                    "Prototipos de resistencia"
                  ]
                ]
              },
              "tecnico": {
                "text": [
                  "El paragolpes integra un splitter que reduce la sustentación del eje delantero y canaliza el flujo hacia el fondo, parcialmente plano. Las tomas del frontal y del capó alimentan los radiadores y los conductos de refrigeración de los frenos delanteros.",
                  "Toda la pieza es de materiales compuestos, desmontable, y se fija al subchasis tubular delantero."
                ],
                "specs": [
                  [
                    "Elemento",
                    "Splitter + fondo parcialmente plano"
                  ],
                  [
                    "Refrigeración",
                    "Radiadores · conductos de freno"
                  ],
                  [
                    "Material",
                    "Composite (Kevlar · carbono)"
                  ],
                  [
                    "Coeficiente Cx global",
                    "0,34"
                  ]
                ]
              }
            },
            {
              "x": 24.7,
              "y": 56.2,
              "side": "b",
              "label": "Llantas y frenos",
              "aria": "Llantas y frenos",
              "num": "02 · Contacto con el suelo",
              "title": "Llantas y frenos",
              "historia": {
                "text": [
                  "Las llantas de cinco radios con tuerca central son tan icónicas como el propio coche. Tras ellas trabajan unos frenos sin ninguna asistencia: detener el F40 exige técnica y fuerza en la pierna.",
                  "Los neumáticos traseros, enormes para la época, recuerdan que había que transmitir casi 480 CV al asfalto sin ayudas electrónicas."
                ],
                "specs": [
                  [
                    "Llantas",
                    "17\" · cinco radios"
                  ],
                  [
                    "Frenos",
                    "Brembo · sin ABS"
                  ]
                ]
              },
              "tecnico": {
                "text": [
                  "Llantas Speedline de 17\" en tres piezas con fijación central. Frenos Brembo con discos de acero ventilados y perforados de 330 mm y pinzas de cuatro pistones, sin servofreno ni ABS."
                ],
                "specs": [
                  [
                    "Llantas",
                    "Speedline 8J / 13J × 17\""
                  ],
                  [
                    "Neumáticos",
                    "245/40 · 335/35 ZR17"
                  ],
                  [
                    "Discos",
                    "330 mm · ventilados y perforados"
                  ],
                  [
                    "Pinzas",
                    "Brembo · 4 pistones"
                  ]
                ]
              }
            },
            {
              "x": 49.5,
              "y": 38.1,
              "side": "t",
              "label": "Habitáculo",
              "aria": "Habitáculo",
              "num": "03 · Puesto de conducción",
              "title": "Habitáculo",
              "historia": {
                "text": [
                  "Dentro no hay lujos: ni moqueta, ni radio, ni paneles de puerta tapizados. Las puertas se abren tirando de un cable y el composite queda a la vista. Es el habitáculo de un coche de carreras al que se le añadió una matrícula.",
                  "La posición de conducción es baja y centrada, con los baquets rojos sujetando el cuerpo como en un monoplaza."
                ],
                "specs": [
                  [
                    "Filosofía",
                    "Coche de carreras con matrícula"
                  ],
                  [
                    "Asientos",
                    "Baquets en tela roja"
                  ],
                  [
                    "Plazas",
                    "2"
                  ]
                ]
              },
              "tecnico": {
                "text": [
                  "Célula central formada por el chasis tubular y paneles de composite pegados que trabajan como elementos resistentes. Los asientos son carcasas fijas de composite, regulables sólo longitudinalmente.",
                  "Dirección de cremallera sin asistencia y ausencia total de ayudas electrónicas; las primeras series montaban ventanillas deslizantes de policarbonato."
                ],
                "specs": [
                  [
                    "Estructura",
                    "Tubos de acero + composite pegado"
                  ],
                  [
                    "Asientos",
                    "Carcasa de composite · regulación longitudinal"
                  ],
                  [
                    "Dirección",
                    "Cremallera sin asistencia"
                  ],
                  [
                    "Ayudas",
                    "Sin ABS · sin servo · sin control de tracción"
                  ]
                ]
              }
            },
            {
              "x": 60.9,
              "y": 44.9,
              "side": "b",
              "label": "Toma lateral",
              "aria": "Toma de aire lateral",
              "num": "04 · Refrigeración",
              "title": "Toma de aire lateral",
              "historia": {
                "text": [
                  "Justo detrás de la puerta, una gran toma esculpida en el costado rompe la superficie de la carrocería. No es decoración: es la boca por la que respira el motor.",
                  "Junto a las pequeñas tomas NACA repartidas por la carrocería, es uno de los detalles que delatan que cada forma del F40 nació en el túnel de viento."
                ],
                "specs": [
                  [
                    "Ubicación",
                    "Tras la puerta"
                  ],
                  [
                    "Función",
                    "Hacer respirar al motor"
                  ]
                ]
              },
              "tecnico": {
                "text": [
                  "La toma lateral capta aire de la capa de flujo limpio del costado y lo dirige hacia el compartimento del motor, donde se alojan los intercoolers aire-aire Behr y los turbocompresores IHI.",
                  "El aire caliente se evacua por las lamas de la luneta y de la zaga, manteniendo estable la temperatura de admisión, crítica en un motor sobrealimentado a 1,1 bar."
                ],
                "specs": [
                  [
                    "Destino",
                    "Compartimento motor · intercoolers"
                  ],
                  [
                    "Intercoolers",
                    "2 × Behr aire-aire"
                  ],
                  [
                    "Extracción",
                    "Lamas de luneta y zaga"
                  ]
                ]
              }
            },
            {
              "x": 72.3,
              "y": 37.6,
              "side": "t",
              "label": "Motor V8",
              "aria": "Motor V8 biturbo",
              "num": "05 · Propulsión",
              "title": "Motor V8 biturbo",
              "audio": true,
              "historia": {
                "text": [
                  "Bajo la luneta con lamas late el corazón del F40: un V8 biturbo heredado del 288 GTO Evoluzione, el prototipo de carreras de Ferrari. En 1987 era el motor más potente que la marca había montado en un coche de calle.",
                  "Su entrega es legendaria: tranquila hasta las 3.000 rpm y explosiva cuando los turbos entran en carga. Fue el primer coche de producción en anunciar más de 320 km/h."
                ],
                "specs": [
                  [
                    "Potencia",
                    "478 CV"
                  ],
                  [
                    "Velocidad máxima",
                    "324 km/h"
                  ],
                  [
                    "0 – 100 km/h",
                    "4,1 s"
                  ]
                ]
              },
              "tecnico": {
                "text": [
                  "Tipo F120A: V8 a 90° central longitudinal, 2.936 cc, doble árbol de levas por bancada y 32 válvulas. Dos turbos IHI refrigerados por agua a 1,1 bar con intercoolers Behr, compresión 7,7:1 e inyección Weber-Marelli IAW."
                ],
                "specs": [
                  [
                    "Cilindrada",
                    "2.936 cc · 82 × 69,5 mm"
                  ],
                  [
                    "Sobrealimentación",
                    "2 × IHI · 1,1 bar"
                  ],
                  [
                    "Compresión",
                    "7,7:1"
                  ],
                  [
                    "Potencia / par",
                    "478 CV a 7.000 · 577 Nm a 4.000 rpm"
                  ]
                ]
              }
            },
            {
              "x": 89.2,
              "y": 33.2,
              "side": "l",
              "label": "Alerón",
              "aria": "Alerón trasero",
              "num": "06 · Carga aerodinámica",
              "title": "Alerón trasero",
              "historia": {
                "text": [
                  "El gran alerón trasero es la firma del F40: nace de la propia carrocería, se apoya en dos derivas laterales y lleva grabado el nombre del coche. Es la imagen que cualquiera asocia a la palabra «superdeportivo».",
                  "Pero su función es muy seria: mantener el eje trasero pegado al asfalto cuando el coche supera los 300 km/h."
                ],
                "specs": [
                  [
                    "Seña de identidad",
                    "Alerón integrado"
                  ],
                  [
                    "Función",
                    "Estabilidad a alta velocidad"
                  ]
                ]
              },
              "tecnico": {
                "text": [
                  "Perfil fijo integrado en la zaga basculante de composite, con derivas laterales de fibra de carbono. Genera carga en el eje trasero que equilibra la del splitter delantero, manteniendo un Cx global de 0,34."
                ],
                "specs": [
                  [
                    "Tipo",
                    "Perfil fijo integrado"
                  ],
                  [
                    "Derivas",
                    "Fibra de carbono"
                  ],
                  [
                    "Zaga",
                    "Composite · una pieza basculante"
                  ],
                  [
                    "Cx global",
                    "0,34"
                  ]
                ]
              }
            }
          ]
        },
        {
          "type": "parts-gallery",
          "id": "piezas",
          "nav": "Ingeniería",
          "kicker": [
            "Ingeniería",
            "pieza a pieza"
          ],
          "title": "Seis sistemas, una sola obsesión.",
          "intro": "Cada componente aislado, con sus puntos clave señalados sobre la propia pieza. Activa el <b>Modo Técnico</b> en la cabecera para ver los datos de ingeniería.",
          "items": [
            {
              "id": "p-motor",
              "index": "Motor V8 biturbo",
              "num": "01 · Propulsión",
              "title": "Motor V8 biturbo",
              "audio": true,
              "views": [
                {
                  "image": "pieza-motor",
                  "points": [
                    {
                      "x": 42.3,
                      "y": 32.2,
                      "side": "t",
                      "label": "Tapas de culata",
                      "title": "Tapas de culata",
                      "desc": "Cubren los dos árboles de levas de cada bancada y las cuatro válvulas por cilindro. En el F40 van pintadas en rojo con el logotipo Ferrari en relieve, una tradición de Maranello."
                    },
                    {
                      "x": 86.6,
                      "y": 39.1,
                      "side": "l",
                      "label": "Turbo IHI",
                      "title": "Turbocompresor IHI",
                      "desc": "Un turbo IHI por bancada, refrigerado por agua, que sopla a 1,1 bar. Una válvula de descarga (wastegate) limita la presión para proteger el motor; su silbido es parte del sonido del F40."
                    },
                    {
                      "x": 17.6,
                      "y": 21.5,
                      "side": "r",
                      "label": "Caja de admisión",
                      "title": "Caja de admisión",
                      "desc": "Recoge el aire de las tomas laterales y lo conduce, ya comprimido por el turbo, a través del intercooler aire-aire Behr hasta el colector de admisión."
                    },
                    {
                      "x": 21.5,
                      "y": 67.4,
                      "side": "t",
                      "label": "Colectores de escape",
                      "title": "Colectores de escape",
                      "desc": "Reúnen los gases de cada bancada y los envían a la turbina de su turbo. Trabajan a temperaturas muy altas: su calor es el que evacuan las lamas de la luneta trasera."
                    },
                    {
                      "x": 52.7,
                      "y": 74.2,
                      "side": "b",
                      "label": "Cárter seco",
                      "title": "Cárter seco",
                      "desc": "El aceite se almacena en un depósito separado y se recupera con bombas propias: no se desplaza en curva y permite montar el motor más bajo, bajando el centro de gravedad."
                    }
                  ],
                  "historia": {
                    "text": [
                      "El corazón del F40 nació en la competición. Su V8 biturbo es la evolución directa del motor del 288 GTO Evoluzione, el prototipo que Ferrari preparó para el Grupo B, y en 1987 era el motor más potente que la marca había montado nunca en un coche de calle.",
                      "Su carácter es legendario: por debajo de 3.000 rpm se comporta con docilidad, pero cuando los dos turbos entran en carga el empuje llega de golpe, con un silbido inconfundible. Fue el primer coche de producción en anunciar más de 320 km/h."
                    ],
                    "specs": [
                      [
                        "Potencia",
                        "478 CV"
                      ],
                      [
                        "Velocidad máxima",
                        "324 km/h"
                      ],
                      [
                        "0 – 100 km/h",
                        "4,1 s"
                      ],
                      [
                        "Posición",
                        "Central trasera"
                      ],
                      [
                        "Herencia",
                        "288 GTO Evoluzione"
                      ]
                    ]
                  },
                  "tecnico": {
                    "text": [
                      "Tipo F120A: V8 a 90° en posición central trasera longitudinal, con bloque y culatas de aleación ligera, doble árbol de levas en cabeza por bancada accionado por correa y cuatro válvulas por cilindro. Lubricación por cárter seco para garantizar el suministro de aceite con fuertes aceleraciones laterales.",
                      "Cada bancada tiene su propio turbocompresor IHI refrigerado por agua, con un intercooler aire-aire Behr por turbo y una presión de soplado de 1,1 bar. La baja relación de compresión (7,7:1) permite esa presión sin detonación. La inyección y el encendido los gestiona un sistema electrónico Weber-Marelli IAW."
                    ],
                    "specs": [
                      [
                        "Arquitectura",
                        "V8 a 90° · central longitudinal"
                      ],
                      [
                        "Distribución",
                        "DOHC por bancada · 32 válvulas"
                      ],
                      [
                        "Cilindrada",
                        "2.936 cc"
                      ],
                      [
                        "Diámetro × carrera",
                        "82 × 69,5 mm"
                      ],
                      [
                        "Relación de compresión",
                        "7,7:1"
                      ],
                      [
                        "Sobrealimentación",
                        "2 × IHI · 1,1 bar · 2 intercoolers Behr"
                      ],
                      [
                        "Gestión",
                        "Weber-Marelli IAW"
                      ],
                      [
                        "Lubricación",
                        "Cárter seco"
                      ],
                      [
                        "Potencia",
                        "478 CV a 7.000 rpm"
                      ],
                      [
                        "Par máximo",
                        "577 Nm a 4.000 rpm"
                      ],
                      [
                        "Potencia específica",
                        "163 CV/l"
                      ],
                      [
                        "Relación peso/potencia",
                        "2,3 kg/CV · 435 CV/t (1.100 kg)"
                      ],
                      [
                        "Transmisión",
                        "Manual 5 vel. · rejilla metálica · embrague bidisco · autoblocante"
                      ]
                    ],
                    "note": "La fotografía es una referencia visual de un V8 biturbo moderno; los datos corresponden al F120A original."
                  }
                }
              ]
            },
            {
              "id": "p-cockpit",
              "index": "Puesto de conducción",
              "num": "02 · Habitáculo",
              "title": "Puesto de conducción",
              "views": [
                {
                  "image": "pieza-cockpit",
                  "points": [
                    {
                      "x": 55,
                      "y": 45.9,
                      "side": "r",
                      "label": "Baquets",
                      "title": "Baquets",
                      "desc": "Carcasas de composite tapizadas en tela roja que sujetan el cuerpo como en un coche de competición. Sólo se regulan hacia delante y hacia atrás."
                    },
                    {
                      "x": 40.7,
                      "y": 37.6,
                      "side": "t",
                      "label": "Volante",
                      "title": "Volante",
                      "desc": "Volante de tres radios sobre una dirección de cremallera sin asistencia: cada maniobra transmite directamente al piloto el agarre de las ruedas delanteras."
                    },
                    {
                      "x": 44.9,
                      "y": 46.9,
                      "side": "l",
                      "label": "Palanca de cambios",
                      "title": "Palanca de cambios",
                      "desc": "Cambio manual de cinco velocidades con rejilla metálica abierta, al estilo de competición. Cada cambio se nota con un «clac» metálico característico."
                    },
                    {
                      "x": 46.9,
                      "y": 65.4,
                      "side": "b",
                      "label": "Paneles de composite",
                      "title": "Paneles de composite",
                      "desc": "El suelo y los laterales de Kevlar y fibra de carbono están pegados al chasis y trabajan como parte de la estructura. Se dejaron a la vista para no añadir peso."
                    },
                    {
                      "x": 81.4,
                      "y": 41,
                      "side": "t",
                      "label": "Estructura tubular",
                      "title": "Estructura tubular",
                      "desc": "La celosía trasera de la célula sostiene el motor y protege el habitáculo. Sus tubos de acero se unen a los paneles de composite mediante pegado estructural."
                    }
                  ],
                  "historia": {
                    "text": [
                      "Enzo Ferrari pidió un coche que transmitiera las sensaciones de un coche de carreras, y el habitáculo es la prueba más clara. No hay moqueta, ni paneles de puerta tapizados, ni radio, ni guantera: el suelo y los laterales muestran el composite tal cual sale del molde.",
                      "Las puertas se abren tirando de un simple cable y las primeras unidades montaban ventanillas deslizantes de policarbonato, como un coche de competición. Sentarse en sus baquets rojos es entender, en un segundo, qué significa el F40."
                    ],
                    "specs": [
                      [
                        "Filosofía",
                        "Coche de carreras con matrícula"
                      ],
                      [
                        "Asientos",
                        "Baquets en tela roja"
                      ],
                      [
                        "Acabado",
                        "Composite a la vista"
                      ],
                      [
                        "Confort",
                        "Sólo lo imprescindible"
                      ]
                    ]
                  },
                  "tecnico": {
                    "text": [
                      "El habitáculo forma parte de la estructura: los paneles de composite pegados al chasis tubular trabajan como elementos resistentes y aportan rigidez a la célula central. El acabado interior se limita a un tapizado de fieltro en el salpicadero para evitar reflejos en el parabrisas.",
                      "La dirección es de cremallera sin asistencia y no existe ninguna ayuda electrónica a la conducción. Los asientos son carcasas fijas de composite que sólo se regulan longitudinalmente; el cambio manual de cinco velocidades usa una rejilla metálica abierta."
                    ],
                    "specs": [
                      [
                        "Asientos",
                        "Carcasas de composite · tela ignífuga"
                      ],
                      [
                        "Regulación",
                        "Sólo longitudinal"
                      ],
                      [
                        "Puertas",
                        "Apertura interior por cable"
                      ],
                      [
                        "Ventanillas",
                        "Policarbonato deslizante (primeras series)"
                      ],
                      [
                        "Cambio",
                        "Manual 5 vel. · rejilla abierta"
                      ],
                      [
                        "Dirección",
                        "Cremallera sin asistencia"
                      ],
                      [
                        "Ayudas",
                        "Sin ABS · sin servo · sin control de tracción"
                      ]
                    ]
                  }
                }
              ]
            },
            {
              "id": "p-aero",
              "index": "Aerodinámica",
              "num": "03 · Flujo de aire",
              "title": "Aerodinámica y alerón",
              "views": [
                {
                  "image": "pieza-aero",
                  "points": [
                    {
                      "x": 63.8,
                      "y": 21,
                      "side": "t",
                      "label": "Alerón",
                      "title": "Alerón",
                      "desc": "Perfil fijo que genera carga sobre el eje trasero a alta velocidad. Forma parte de la propia zaga, por lo que no necesita soportes añadidos."
                    },
                    {
                      "x": 44.9,
                      "y": 29.3,
                      "side": "l",
                      "label": "Deriva de carbono",
                      "title": "Deriva de carbono",
                      "desc": "Placa lateral de fibra de carbono que sostiene el alerón y reduce los torbellinos de sus extremos, haciéndolo más eficaz."
                    },
                    {
                      "x": 49.5,
                      "y": 46.9,
                      "side": "b",
                      "label": "Tapa con lamas",
                      "title": "Tapa con lamas",
                      "desc": "Las lamas extraen el aire caliente del compartimento del motor y reducen la presión bajo la tapa, algo clave con dos turbos trabajando a pleno rendimiento."
                    },
                    {
                      "x": 86.6,
                      "y": 34.2,
                      "side": "l",
                      "label": "Zaga",
                      "title": "Zaga",
                      "desc": "Pieza de composite con el emblema F40 en relieve. Bascula entera hacia atrás para dar acceso total al motor y a la transmisión."
                    },
                    {
                      "x": 86.6,
                      "y": 50.8,
                      "side": "l",
                      "label": "Lamas de extracción",
                      "title": "Lamas de extracción",
                      "desc": "Ranuras verticales que evacuan por detrás el calor de los escapes y de los intercoolers, manteniendo estable la temperatura del compartimento."
                    },
                    {
                      "x": 12.4,
                      "y": 54.7,
                      "side": "r",
                      "label": "Panel lateral",
                      "title": "Panel lateral",
                      "desc": "Panel de fibra de carbono que cierra el costado trasero y ayuda a canalizar el aire hacia la toma del motor."
                    }
                  ],
                  "historia": {
                    "text": [
                      "El estudio Pininfarina firmó una de las siluetas más reconocibles de la historia del automóvil: un morro bajo y afilado, una cintura musculosa y, sobre todo, ese gran alerón trasero que nace de la propia carrocería.",
                      "No es un adorno. Cada entrada de aire, cada lama y cada arista tienen una función, y el resultado es una forma que, casi cuarenta años después, sigue siendo la imagen que cualquiera asocia a la palabra «superdeportivo»."
                    ],
                    "specs": [
                      [
                        "Diseño",
                        "Pininfarina"
                      ],
                      [
                        "Seña de identidad",
                        "Alerón integrado"
                      ],
                      [
                        "Principio",
                        "La forma sigue a la función"
                      ]
                    ]
                  },
                  "tecnico": {
                    "text": [
                      "Carrocería desarrollada en túnel de viento. El morro incorpora un splitter que reduce la sustentación del eje delantero; el fondo es parcialmente plano y el alerón trasero, integrado en la zaga, equilibra la carga entre ejes a alta velocidad sin penalizar la resistencia: Cx de 0,34.",
                      "Las tomas NACA del capó delantero y de los laterales alimentan los frenos, los intercoolers y el compartimento del motor, mientras las lamas traseras extraen el aire caliente. Los paneles son de Kevlar, fibra de carbono y Nomex, pegados y remachados sobre el chasis."
                    ],
                    "specs": [
                      [
                        "Coeficiente Cx",
                        "0,34"
                      ],
                      [
                        "Materiales",
                        "Kevlar · fibra de carbono · Nomex"
                      ],
                      [
                        "Eje delantero",
                        "Splitter · fondo parcialmente plano"
                      ],
                      [
                        "Eje trasero",
                        "Alerón integrado en la zaga"
                      ],
                      [
                        "Zaga",
                        "Una pieza basculante"
                      ],
                      [
                        "Refrigeración",
                        "Tomas NACA · lamas de extracción"
                      ]
                    ]
                  }
                }
              ]
            },
            {
              "id": "p-chasis",
              "index": "Chasis tubular",
              "num": "04 · Estructura",
              "title": "Chasis tubular",
              "views": [
                {
                  "image": "pieza-chasis",
                  "points": [
                    {
                      "x": 8.5,
                      "y": 54.7,
                      "side": "t",
                      "label": "Subchasis delantero",
                      "title": "Subchasis delantero",
                      "desc": "Estructura tubular que soporta la suspensión delantera, los radiadores y la carrocería frontal de composite."
                    },
                    {
                      "x": 23.1,
                      "y": 48.3,
                      "side": "t",
                      "label": "Amortiguador del.",
                      "title": "Amortiguador delantero",
                      "desc": "Conjunto muelle-amortiguador coaxial Koni, anclado directamente a los nodos de la celosía para transmitir las cargas sin elementos intermedios."
                    },
                    {
                      "x": 50.8,
                      "y": 29.8,
                      "side": "t",
                      "label": "Arco del habitáculo",
                      "title": "Arco del habitáculo",
                      "desc": "Arco superior que rigidiza la célula central y protege a los ocupantes en caso de vuelco."
                    },
                    {
                      "x": 44.9,
                      "y": 46.9,
                      "side": "b",
                      "label": "Triangulación",
                      "title": "Triangulación",
                      "desc": "Las diagonales convierten los rectángulos de la celosía en triángulos, que no se deforman: es la clave de la rigidez del chasis."
                    },
                    {
                      "x": 75.8,
                      "y": 49.3,
                      "side": "b",
                      "label": "Amortiguador tras.",
                      "title": "Amortiguador trasero",
                      "desc": "Mismo esquema coaxial que el delantero, adaptado al mayor peso del eje trasero, donde se aloja el motor."
                    },
                    {
                      "x": 90.8,
                      "y": 33.7,
                      "side": "t",
                      "label": "Soporte del alerón",
                      "title": "Soporte del alerón",
                      "desc": "Estructura tubular ligera que sostiene la zaga y transmite al chasis la carga aerodinámica que genera el alerón."
                    }
                  ],
                  "historia": {
                    "text": [
                      "Para celebrar sus 40 años, Ferrari quiso demostrar todo lo que había aprendido en los circuitos. El resultado fue un esqueleto ligerísimo que combinaba tubos de acero con los materiales compuestos de la Fórmula 1, algo inédito en un coche de calle de la época.",
                      "Esa estructura es la razón de que el F40 se sienta tan directo y tan vivo: no hay capas de aislamiento ni refuerzos superfluos, sólo lo necesario para unir el motor, las suspensiones y al piloto."
                    ],
                    "specs": [
                      [
                        "Inspiración",
                        "Competición · Fórmula 1"
                      ],
                      [
                        "Peso en seco",
                        "1.100 kg"
                      ],
                      [
                        "Objetivo",
                        "Ligereza absoluta"
                      ]
                    ]
                  },
                  "tecnico": {
                    "text": [
                      "Celosía de tubos de acero con subchasis delantero y trasero, a la que se pegan estructuralmente paneles de materiales compuestos (Kevlar y fibra de carbono). Esta construcción mixta da mucha más rigidez torsional que un chasis tubular convencional sin apenas añadir peso.",
                      "El motor y la transmisión se anclan al subchasis trasero; las suspensiones atacan directamente a los nodos de la celosía. El combustible se aloja en dos depósitos de seguridad flexibles de tipo competición."
                    ],
                    "specs": [
                      [
                        "Estructura",
                        "Tubos de acero"
                      ],
                      [
                        "Paneles",
                        "Kevlar · carbono · pegado estructural"
                      ],
                      [
                        "Peso en seco",
                        "1.100 kg"
                      ],
                      [
                        "Batalla",
                        "2.450 mm"
                      ],
                      [
                        "Vías del. / tras.",
                        "1.594 / 1.606 mm"
                      ],
                      [
                        "Largo · ancho · alto",
                        "4.358 · 1.970 · 1.124 mm"
                      ],
                      [
                        "Depósitos",
                        "2 celdas de seguridad · 120 l"
                      ]
                    ]
                  }
                }
              ]
            },
            {
              "id": "p-suspension",
              "index": "Suspensión y frenos",
              "num": "05 · Dinámica",
              "title": "Suspensión y frenos",
              "views": [
                {
                  "key": "suspension",
                  "label": "Suspensión",
                  "image": "pieza-suspension",
                  "points": [
                    {
                      "x": 13.3,
                      "y": 50.8,
                      "side": "b",
                      "label": "Disco de freno",
                      "title": "Disco de freno",
                      "desc": "Disco ventilado y perforado: los canales internos y los taladros evacuan el calor y los gases que generan las pastillas al frenar."
                    },
                    {
                      "x": 24.1,
                      "y": 29.3,
                      "side": "l",
                      "label": "Muelle-amortiguador",
                      "title": "Muelle-amortiguador",
                      "desc": "Muelle helicoidal montado sobre un amortiguador coaxial: controla el movimiento vertical de la rueda y el balanceo de la carrocería."
                    },
                    {
                      "x": 31.3,
                      "y": 22.9,
                      "side": "t",
                      "label": "Horquilla superior",
                      "title": "Horquilla superior",
                      "desc": "Brazo superior, más corto que el inferior, que controla la caída de la rueda en los apoyos para mantener el neumático plano sobre el asfalto. Sobre él se apoya el conjunto muelle-amortiguador."
                    },
                    {
                      "x": 38.4,
                      "y": 45.9,
                      "side": "t",
                      "label": "Semieje",
                      "title": "Semieje",
                      "desc": "Transmite el par desde el diferencial a cada rueda trasera. Las juntas homocinéticas de sus extremos, protegidas por los fuelles negros, le permiten girar mientras la suspensión sube y baja."
                    },
                    {
                      "x": 45.6,
                      "y": 46.9,
                      "side": "b",
                      "label": "Diferencial",
                      "title": "Diferencial",
                      "desc": "Reparte el par entre las dos ruedas traseras y deja que giren a distinta velocidad en las curvas. En el F40 es autoblocante e integrado en la transmisión, para no perder tracción al acelerar a la salida de las curvas."
                    },
                    {
                      "x": 68.4,
                      "y": 66.4,
                      "side": "b",
                      "label": "Brazo inferior",
                      "title": "Brazo inferior",
                      "desc": "Brazo inferior de la doble horquilla: soporta la mayor parte de la carga vertical y fija la geometría de la rueda respecto al chasis."
                    },
                    {
                      "x": 97,
                      "y": 57.6,
                      "side": "l",
                      "label": "Pinza de freno",
                      "title": "Pinza de freno",
                      "desc": "Pinza de cuatro pistones que aprieta las pastillas contra el disco. En el F40 no hay servofreno: toda la fuerza sale del pie del piloto."
                    }
                  ],
                  "historia": {
                    "text": [
                      "Una puesta a punto de carreras pensada para el piloto experto: firme, precisa y comunicativa. Cada irregularidad del asfalto llega al volante, y eso es exactamente lo que buscaba Maranello.",
                      "Para hacerlo un poco más usable en la calle, algunas unidades montaban un sistema que permitía elevar la carrocería y salvar badenes o rampas de garaje sin rozar el morro."
                    ],
                    "specs": [
                      [
                        "Carácter",
                        "Firme y directo"
                      ],
                      [
                        "Origen",
                        "Competición"
                      ],
                      [
                        "Opción",
                        "Altura regulable"
                      ]
                    ]
                  },
                  "tecnico": {
                    "text": [
                      "Suspensión independiente en las cuatro ruedas por paralelogramo deformable de doble horquilla, con brazos tubulares y rótulas de tipo competición. Conjuntos muelle-amortiguador coaxiales Koni y barras estabilizadoras en ambos ejes.",
                      "La geometría prioriza la estabilidad a alta velocidad y el control del balanceo frente al confort. El sistema opcional de altura regulable modificaba la cota al suelo para el uso urbano."
                    ],
                    "specs": [
                      [
                        "Esquema",
                        "Doble horquilla · 4 ruedas"
                      ],
                      [
                        "Amortiguadores",
                        "Koni · muelles helicoidales coaxiales"
                      ],
                      [
                        "Estabilizadoras",
                        "Delantera y trasera"
                      ],
                      [
                        "Dirección",
                        "Cremallera sin asistencia"
                      ],
                      [
                        "Opción",
                        "Altura regulable"
                      ]
                    ]
                  }
                },
                {
                  "key": "frenos",
                  "label": "Frenos",
                  "image": "pieza-frenos",
                  "points": [
                    {
                      "x": 33.9,
                      "y": 58.6,
                      "side": "l",
                      "label": "Disco perforado",
                      "title": "Disco perforado",
                      "desc": "Los taladros mejoran la refrigeración y evacuan el agua y el polvo de la superficie de frenada. En el F40, disco de acero de 330 mm."
                    },
                    {
                      "x": 44.3,
                      "y": 45.9,
                      "side": "t",
                      "label": "Buje",
                      "title": "Buje",
                      "desc": "Pieza central que gira con la rueda y sobre la que se monta el disco. En el F40 la rueda se fija con una única tuerca central."
                    },
                    {
                      "x": 61.8,
                      "y": 50.8,
                      "side": "b",
                      "label": "Pinza",
                      "title": "Pinza",
                      "desc": "Pinza Brembo de cuatro pistones. Sin ABS ni servofreno, su respuesta depende por completo de la presión que ejerce el piloto."
                    },
                    {
                      "x": 71,
                      "y": 41,
                      "side": "r",
                      "label": "Pastillas",
                      "title": "Pastillas",
                      "desc": "Material de fricción que se aprieta contra el disco. En conducción rápida trabajan a temperaturas muy altas."
                    }
                  ],
                  "historia": {
                    "text": [
                      "Sin ABS ni servofreno. Detener el F40 desde más de 300 km/h exige técnica y fuerza en la pierna: la frenada es una conversación directa entre el pie del piloto y el asfalto.",
                      "Para muchos propietarios es precisamente esa ausencia de filtros lo que convierte cada trayecto en una experiencia única."
                    ],
                    "specs": [
                      [
                        "Proveedor",
                        "Brembo"
                      ],
                      [
                        "Asistencias",
                        "Ninguna"
                      ]
                    ]
                  },
                  "tecnico": {
                    "text": [
                      "Sistema de frenos Brembo sin ninguna asistencia hidráulica ni electrónica. Discos de acero ventilados y perforados de 330 mm en ambos ejes, con pinzas de cuatro pistones y conductos de refrigeración alimentados por las tomas NACA."
                    ],
                    "specs": [
                      [
                        "Discos",
                        "Acero · 330 mm · ventilados y perforados"
                      ],
                      [
                        "Pinzas",
                        "Brembo · 4 pistones"
                      ],
                      [
                        "Refrigeración",
                        "Conductos desde tomas NACA"
                      ],
                      [
                        "Asistencias",
                        "Sin ABS · sin servofreno"
                      ]
                    ],
                    "note": "La fotografía muestra un disco carbonocerámico moderno de referencia; el F40 original montaba discos de acero."
                  }
                }
              ]
            },
            {
              "id": "p-llantas",
              "index": "Llantas y capó",
              "num": "06 · Detalle",
              "title": "Llantas y capó trasero",
              "views": [
                {
                  "key": "llanta",
                  "label": "Llantas",
                  "image": "pieza-llanta",
                  "points": [
                    {
                      "x": 58.6,
                      "y": 17.6,
                      "side": "t",
                      "label": "Pirelli P Zero",
                      "title": "Pirelli P Zero",
                      "desc": "Neumático de altas prestaciones que Pirelli desarrolló para el F40: 245/40 ZR17 delante y 335/35 ZR17 detrás."
                    },
                    {
                      "x": 54.7,
                      "y": 30.6,
                      "side": "r",
                      "label": "Radio",
                      "title": "Radio",
                      "desc": "Uno de los cinco radios del centro Speedline. La forma de estrella es ligera, resistente y deja ver el sistema de frenos."
                    },
                    {
                      "x": 57.6,
                      "y": 44.9,
                      "side": "l",
                      "label": "Tuerca central",
                      "title": "Tuerca central",
                      "desc": "Fijación única de competición: la rueda se monta y se desmonta con una sola tuerca, como en los coches de carreras."
                    },
                    {
                      "x": 90.8,
                      "y": 40.4,
                      "side": "r",
                      "label": "Medida ZR17",
                      "title": "Medida ZR17",
                      "desc": "El flanco indica la medida del neumático y su código de velocidad ZR, homologado para más de 240 km/h."
                    }
                  ],
                  "historia": {
                    "text": [
                      "Las llantas de cinco radios con tuerca central son tan icónicas como el propio coche. Su diseño, sencillo y robusto, procede directamente de las carreras.",
                      "Detrás, unos neumáticos traseros enormes para la época recuerdan que había que transmitir al asfalto casi 480 CV sin ninguna ayuda electrónica."
                    ],
                    "specs": [
                      [
                        "Diseño",
                        "Cinco radios · tuerca central"
                      ],
                      [
                        "Diámetro",
                        "17\""
                      ]
                    ]
                  },
                  "tecnico": {
                    "text": [
                      "Llantas Speedline de 17\" en tres piezas (centro, aro interior y aro exterior unidos por tornillos), con fijación central de competición. La diferencia de anchura entre ejes compensa el reparto de pesos y la tracción trasera."
                    ],
                    "specs": [
                      [
                        "Llantas",
                        "Speedline 17\" · 3 piezas"
                      ],
                      [
                        "Anchura",
                        "8J delante · 13J detrás"
                      ],
                      [
                        "Neumáticos",
                        "Pirelli P Zero 245/40 · 335/35 ZR17"
                      ],
                      [
                        "Fijación",
                        "Tuerca central"
                      ]
                    ]
                  }
                },
                {
                  "key": "capo",
                  "label": "Capó trasero",
                  "image": "pieza-capo",
                  "points": [
                    {
                      "x": 31.3,
                      "y": 39.1,
                      "side": "t",
                      "label": "Lamas de extracción",
                      "title": "Lamas de extracción",
                      "desc": "Ranuras que dejan salir el calor que generan los turbos y los colectores de escape, situados justo debajo."
                    },
                    {
                      "x": 53.4,
                      "y": 37.1,
                      "side": "t",
                      "label": "Luneta central",
                      "title": "Luneta central",
                      "desc": "Sección central de la luneta trasera, a través de la cual el V8 queda a la vista desde el exterior."
                    },
                    {
                      "x": 68.4,
                      "y": 59.1,
                      "side": "b",
                      "label": "Emblema F40",
                      "title": "Emblema F40",
                      "desc": "El logotipo Ferrari y la denominación F40 en relieve, en el borde trasero de la tapa."
                    },
                    {
                      "x": 33.9,
                      "y": 71.3,
                      "side": "r",
                      "label": "Anclaje",
                      "title": "Anclaje",
                      "desc": "Punto de fijación lateral de la tapa a la estructura de la zaga."
                    }
                  ],
                  "historia": {
                    "text": [
                      "A través de la luneta trasera con lamas, el V8 queda a la vista como una joya mecánica: el F40 no esconde su corazón, lo exhibe.",
                      "Cuando se abre, toda la parte trasera bascula en una sola pieza y deja al descubierto motor, turbos y suspensión trasera, una imagen que se ha convertido en icono de los salones del automóvil."
                    ],
                    "specs": [
                      [
                        "Gesto",
                        "Motor a la vista"
                      ],
                      [
                        "Apertura",
                        "Zaga completa en una pieza"
                      ]
                    ]
                  },
                  "tecnico": {
                    "text": [
                      "La luneta trasera es de policarbonato (Lexan) con lamas de extracción: deja ver el motor y evacua el calor que generan los turbos y los colectores de escape. La tapa y la zaga son de composite y forman un único conjunto basculante.",
                      "Esta solución, propia de la competición, ahorra peso frente a varias tapas independientes y da acceso total al motor, la transmisión y la suspensión trasera."
                    ],
                    "specs": [
                      [
                        "Luneta",
                        "Policarbonato (Lexan) con lamas"
                      ],
                      [
                        "Tapa / zaga",
                        "Composite · conjunto basculante"
                      ],
                      [
                        "Función",
                        "Extracción de calor de turbos y escapes"
                      ],
                      [
                        "Acceso",
                        "Motor · transmisión · suspensión trasera"
                      ]
                    ]
                  }
                }
              ]
            }
          ]
        },
        {
          "type": "facts-counters",
          "id": "cifras",
          "kicker": "Ficha técnica",
          "title": "Cifras de una leyenda",
          "specs": [
            "power",
            "torque",
            "topSpeed",
            "acceleration",
            "weight",
            "production"
          ]
        }
      ]
    },
    {
      "id": "nissan-skyline-r34",
      "slug": "r34",
      "name": "Nissan Skyline GT-R R34",
      "brand": "Nissan",
      "make": "Nissan",
      "model": "Skyline GT-R",
      "badge": "R34",
      "year": 1999,
      "years": "1999 — 2002",
      "theme": "wangan",
      "palette": {
        "accent": "#4096ff",
        "body": "#1c3fa8",
        "note": "Bayside Blue (aprox.); el tema wangan define el resto de la paleta",
        "hallAccent": "64, 150, 255"
      },
      "marks": [
        "Nissan",
        "Skyline",
        "GT-R",
        "Brembo"
      ],
      "exitLine": "Una noche en la Wangan de Tokio",
      "meta": {
        "title": "Nissan Skyline GT-R R34 · Sala 02 · Museo digital del automóvil",
        "description": "Sala 02 del museo digital del automóvil: el Nissan Skyline GT-R R34 de noche en la Wangan. Historia, motor RB26DETT, tracción ATTESA E-TS Pro, Super HICAS y frenos Brembo en despiece interactivo."
      },
      "specs": {
        "engine": {
          "label": "Motor",
          "value": "RB26DETT",
          "note": "6 en línea biturbo en paralelo · 2.568 cc"
        },
        "power": {
          "label": "Potencia",
          "value": 280,
          "unit": "PS",
          "note": "homologada"
        },
        "torque": {
          "label": "Par máximo",
          "value": 392,
          "unit": "N·m",
          "note": "a 4.400 rpm"
        },
        "topSpeed": {
          "label": "Velocidad máxima",
          "value": 180,
          "unit": "km/h",
          "note": "limitada electrónicamente, norma japonesa"
        },
        "displacement": {
          "label": "Cilindrada",
          "value": 2568,
          "unit": "cc",
          "note": "6 en línea biturbo"
        },
        "weight": {
          "label": "Peso",
          "value": 1540,
          "unit": "kg",
          "note": "GT-R estándar"
        },
        "drivetrain": {
          "label": "Tracción",
          "value": "ATTESA",
          "note": "total, reparto variable"
        }
      },
      "images": {
        "r34-hero": {
          "role": "hero",
          "src": "r34/img/r34-hero.jpg",
          "w": 1672,
          "h": 941,
          "alt": "Nissan Skyline GT-R R34 azul Bayside de perfil, de noche, sobre suelo mojado",
          "formats": [
            "avif",
            "webp"
          ]
        },
        "r34-opticas-despiece": {
          "role": "exploded",
          "src": "r34/img/r34-opticas-despiece.jpg",
          "w": 1536,
          "h": 1024,
          "alt": "Despiece simétrico de los pilotos traseros del GT-R: dos grupos ópticos circulares por lado, anillos de luz, carcasas y cableado",
          "formats": [
            "avif",
            "webp"
          ]
        },
        "r34-rueda-despiece": {
          "role": "exploded",
          "src": "r34/img/r34-rueda-despiece.jpg",
          "w": 1536,
          "h": 1024,
          "alt": "Despiece en línea de la rueda: neumático, llanta de cinco radios, disco perforado, pinza Brembo dorada y pastillas",
          "formats": [
            "avif",
            "webp"
          ]
        },
        "r34-trasera": {
          "role": "detail",
          "src": "r34/img/r34-trasera.jpg",
          "w": 1672,
          "h": 941,
          "alt": "Tres cuartos trasero del R34: aleta ensanchada, pilotos redondos y alerón",
          "formats": [
            "avif",
            "webp"
          ]
        },
        "despiece-aleron": {
          "role": "exploded",
          "src": "r34/img/despiece-aleron.jpg",
          "w": 1536,
          "h": 1024,
          "alt": "Despiece del alerón trasero de carbono con sus soportes de aluminio",
          "formats": [
            "avif",
            "webp"
          ]
        },
        "r34-motor-despiece": {
          "role": "exploded",
          "src": "r34/img/r34-motor-despiece.jpg",
          "w": 1536,
          "h": 1024,
          "alt": "Despiece del RB26DETT: bloque de seis cilindros en línea, culata y árboles de levas, pistones y cigüeñal, colector de admisión, colectores de escape con dos turbos e intercooler",
          "formats": [
            "avif",
            "webp"
          ]
        },
        "despiece-chasis": {
          "role": "exploded",
          "src": "r34/img/despiece-chasis.jpg",
          "w": 1536,
          "h": 1024,
          "alt": "Despiece del chasis: monocasco, subchasis, caja de cambios, transferencia y semiejes",
          "formats": [
            "avif",
            "webp"
          ]
        },
        "despiece-suspension": {
          "role": "exploded",
          "src": "r34/img/despiece-suspension.jpg",
          "w": 1536,
          "h": 1024,
          "alt": "Despiece de la suspensión y la dirección: amortiguadores, brazos, cremallera y actuador trasero",
          "formats": [
            "avif",
            "webp"
          ]
        },
        "despiece-frenos": {
          "role": "exploded",
          "src": "r34/img/despiece-frenos.jpg",
          "w": 1536,
          "h": 1024,
          "alt": "Despiece del freno Brembo: pinza dorada, pastillas, disco, buje y latiguillo",
          "formats": [
            "avif",
            "webp"
          ]
        },
        "r34-cabina": {
          "role": "detail",
          "src": "r34/img/r34-cabina.jpg",
          "w": 1672,
          "h": 941,
          "alt": "Puesto de conducción del R34 de noche: pantalla multifunción, cuadro de instrumentos, volante y palanca de seis marchas",
          "formats": [
            "avif",
            "webp"
          ]
        },
        "r34-hall": {
          "role": "hero",
          "src": "r34/img/r34-hall.jpg",
          "w": 1672,
          "h": 941,
          "alt": "Nissan Skyline GT-R R34 azul Bayside de perfil sobre fondo negro y suelo mojado",
          "formats": [
            "avif",
            "webp"
          ]
        }
      },
      "hall": {
        "text": "Una vuelta de noche por la Wangan de Tokio: el pacto de los 280 PS, el motor RB26DETT, la tracción ATTESA y cinco sistemas en despiece interactivo.",
        "specs": [
          [
            "280 PS",
            "Homologados"
          ],
          [
            "RB26DETT",
            "6 en línea biturbo"
          ],
          [
            "ATTESA",
            "Tracción total"
          ]
        ],
        "image": {
          "ref": "r34-hall",
          "fit": "contain"
        }
      },
      "sections": [
        {
          "type": "hero-plate",
          "id": "exterior",
          "nav": "Exterior",
          "image": {
            "ref": "r34-hero",
            "alt": "Nissan Skyline GT-R R34 en azul Bayside, de perfil, sobre un suelo mojado entre dos tiras de luz azul"
          },
          "sign": {
            "shield": "B",
            "route": "首都高速湾岸線",
            "title": "Skyline GT-R",
            "kana": "スカイライン",
            "foot": "R34 · BNR34 · 1999–2002"
          },
          "spots": [
            {
              "key": "pilotos",
              "label": "Pilotos",
              "x": 90.6,
              "y": 43.5,
              "pop": {
                "opens": "sw",
                "at": {
                  "right": "11%",
                  "top": "49%"
                },
                "image": "r34-opticas-despiece",
                "title": "Cuatro pilotos circulares",
                "text": "Dos pilotos redondos a cada lado: la firma del Skyline desde los años setenta. Aquí, los grupos traseros desmontados: carcasas, anillos de luz, reflectores y cableado."
              }
            },
            {
              "key": "llanta",
              "label": "Llanta",
              "x": 24.2,
              "y": 49.5,
              "pop": {
                "opens": "se",
                "at": {
                  "left": "26.5%",
                  "top": "54%"
                },
                "image": "r34-rueda-despiece",
                "title": "Rueda de 18 pulgadas",
                "text": "Neumático, llanta, disco y pinza Brembo en orden de montaje. De serie, 245/40 ZR18; la llanta y el neumático del despiece son de competición."
              }
            },
            {
              "key": "aleta",
              "label": "Aleta trasera",
              "x": 73,
              "y": 44,
              "pop": {
                "opens": "sw",
                "at": {
                  "right": "29%",
                  "top": "53%"
                },
                "image": "r34-trasera",
                "title": "Aletas ensanchadas",
                "text": "El GT-R ensancha las aletas para cubrir una vía más ancha que la del Skyline de calle del que deriva."
              }
            },
            {
              "key": "aleron",
              "label": "Alerón",
              "x": 86.5,
              "y": 31,
              "pop": {
                "opens": "sw",
                "at": {
                  "right": "15.5%",
                  "top": "35%"
                },
                "image": "despiece-aleron",
                "title": "Alerón regulable",
                "text": "El ángulo del ala trasera se puede ajustar. El V-Spec añadía además un difusor trasero de carbono."
              }
            }
          ],
          "strip": {
            "historia": [
              [
                "280 PS",
                "Homologados"
              ],
              [
                "RB26DETT",
                "6 en línea biturbo"
              ],
              [
                "ATTESA",
                "Tracción total"
              ],
              [
                "1999–2002",
                "Años de producción"
              ]
            ],
            "tecnico": [
              [
                "2.568 cc",
                "86 × 73,7 mm"
              ],
              [
                "392 N·m",
                "A 4.400 rpm"
              ],
              [
                "6 vel.",
                "Getrag manual"
              ],
              [
                "1.540 kg",
                "GT-R estándar"
              ]
            ]
          },
          "note": "Pulsa los puntos de la foto para ver cada detalle del exterior."
        },
        {
          "type": "story-road",
          "id": "historia",
          "nav": "Historia",
          "shield": "B",
          "kana": "歴史",
          "title": "La leyenda",
          "intro": "Tres kilómetros de autopista para entender por qué un coche de 1999 sigue siendo el póster de una generación.",
          "posts": [
            {
              "post": "1",
              "title": "280 PS, según el papel",
              "historia": "Entre 1989 y 2004 los fabricantes japoneses mantuvieron un <b>pacto de caballeros</b>: ningún coche de calle declararía más de 280 caballos. El R34 cumplió en el catálogo. En los bancos de potencia, los números contaban otra historia.",
              "tecnico": [
                [
                  "Potencia oficial",
                  "280 PS",
                  "a 6.800 rpm"
                ],
                [
                  "Par máximo",
                  "392 N·m",
                  "a 4.400 rpm"
                ],
                [
                  "Medido en banco",
                  "≈ 330 PS",
                  "estimación habitual, no oficial"
                ]
              ]
            },
            {
              "post": "2",
              "title": "Azul Bayside",
              "historia": "El R34 se presentó en un azul que parece encenderse bajo las farolas. Desde entonces <b>Bayside Blue</b> es casi un sinónimo del coche: basta ese color en una foto nocturna para reconocerlo sin ver el emblema.",
              "tecnico": [
                [
                  "Color de lanzamiento",
                  "Bayside Blue"
                ],
                [
                  "Código de pintura",
                  "TV2"
                ],
                [
                  "Producción",
                  "01/1999 – 08/2002"
                ]
              ]
            },
            {
              "post": "3",
              "title": "Godzilla, de Tokio al mundo",
              "historia": "La prensa australiana bautizó al GT-R como <b>Godzilla</b> cuando el R32 arrasó en las carreras de turismos, y el R34 heredó el apodo. Nissan nunca lo vendió oficialmente en Estados Unidos: para millones de personas, la primera vez que lo condujeron fue en <b>Gran Turismo</b>.",
              "tecnico": [
                [
                  "Generación",
                  "5.ª del GT-R"
                ],
                [
                  "Código de chasis",
                  "BNR34"
                ],
                [
                  "Mercado oficial",
                  "Japón",
                  "más una serie corta para Reino Unido"
                ]
              ]
            }
          ],
          "photo": {
            "image": {
              "ref": "r34-trasera",
              "alt": "Nissan Skyline GT-R R34 azul visto desde atrás, con los pilotos redondos encendidos y el alerón trasero"
            },
            "caption": "Pilotos redondos, alerón regulable y el emblema GT-R: la trasera que todos dibujaban en el cuaderno."
          }
        },
        {
          "type": "systems-lanes",
          "id": "despieces",
          "nav": "Despieces",
          "shield": "B",
          "kana": "本線",
          "title": "Cinco sistemas",
          "intro": "Elige un carril. Cada sistema aparece desmontado: pasa el ratón o pulsa un número para enfocar la pieza.",
          "hint": "Pulsa un número o una fila para fijar el enfoque; vuelve a pulsar para soltarlo. Las imágenes son despieces ilustrativos.",
          "lanes": [
            {
              "key": "motor",
              "kana": "エンジン",
              "name": "Motor",
              "code": "RB26DETT",
              "image": "r34-motor-despiece",
              "caption": "Despiece ilustrativo del RB26DETT.",
              "title": "Motor",
              "line": "RB26DETT · 2,6 L · 6 en línea · biturbo en paralelo",
              "historia": "Seis cilindros en línea en un bloque de hierro y dos turbos que trabajan en paralelo: cada uno sopla para un grupo de tres cilindros. Ese bloque aguanta mucho más de lo que Nissan declaraba, y por eso sigue siendo la base favorita de los preparadores veinticinco años después.",
              "tecnico": [
                [
                  "Configuración",
                  "6 en línea · DOHC 24v"
                ],
                [
                  "Sobrealimentación",
                  "2 turbos en paralelo",
                  "uno por cada 3 cilindros, no secuenciales · turbinas cerámicas en el GT-R estándar"
                ],
                [
                  "Diámetro × carrera",
                  "86,0 × 73,7 mm"
                ],
                [
                  "Compresión",
                  "8,5 : 1"
                ],
                [
                  "Potencia",
                  "280 PS · 6.800 rpm"
                ]
              ],
              "parts": [
                {
                  "x": 49.5,
                  "y": 51,
                  "name": "Bloque de seis cilindros en línea",
                  "short": "Bloque",
                  "desc": "Hierro fundido, con los seis cilindros alineados: la base robusta que tolera presiones de turbo muy altas.",
                  "value": "Fundición · 6 cilindros · 2.568 cc"
                },
                {
                  "x": 48,
                  "y": 17,
                  "name": "Culata y árboles de levas",
                  "short": "Culata y levas",
                  "desc": "Dos árboles de levas y cuatro válvulas por cilindro.",
                  "value": "DOHC · 24 válvulas"
                },
                {
                  "x": 86.6,
                  "y": 29.5,
                  "name": "Turbos gemelos en paralelo",
                  "short": "Turbos",
                  "desc": "Dos turbos iguales, cada uno alimentado por los gases de tres cilindros; soplan a la vez, no uno después del otro.",
                  "value": "2 × turbo en paralelo"
                },
                {
                  "x": 19.5,
                  "y": 31,
                  "name": "Colector de admisión",
                  "short": "Admisión",
                  "desc": "Seis conductos, uno por cilindro, cada uno con su propia mariposa: respuesta inmediata al acelerador.",
                  "value": "6 cuerpos de mariposa"
                },
                {
                  "x": 48,
                  "y": 78,
                  "name": "Pistones y cigüeñal",
                  "short": "Cigüeñal",
                  "desc": "El cigüeñal convierte el empuje de los seis pistones en giro.",
                  "value": "Cigüeñal de acero forjado"
                }
              ]
            },
            {
              "key": "traccion",
              "kana": "駆動系",
              "name": "Tracción y chasis",
              "code": "ATTESA E-TS Pro",
              "image": "despiece-chasis",
              "caption": "Despiece ilustrativo de la estructura y la transmisión.",
              "title": "Tracción y chasis",
              "line": "ATTESA E-TS · Pro en el V-Spec",
              "historia": "En línea recta se comporta como un tracción trasera. Cuando las ruedas de atrás empiezan a patinar, el sistema manda par al eje delantero al instante. Así sale de las curvas un coche de más de 1.500 kg.",
              "tecnico": [
                [
                  "Reparto base",
                  "0 : 100"
                ],
                [
                  "Reparto máximo",
                  "hasta 50 : 50"
                ],
                [
                  "Diferencial trasero",
                  "activo (Pro)",
                  "autoblocante mecánico en el GT-R estándar"
                ],
                [
                  "Batalla",
                  "2.665 mm"
                ]
              ],
              "parts": [
                {
                  "x": 50,
                  "y": 46,
                  "name": "Monocasco",
                  "short": "Monocasco",
                  "desc": "La estructura de acero que une todo y fija la suspensión.",
                  "value": "Batalla 2.665 mm"
                },
                {
                  "x": 81,
                  "y": 48,
                  "name": "Caja de cambios Getrag",
                  "short": "Caja de cambios",
                  "desc": "Primera caja de seis marchas del GT-R.",
                  "value": "6 vel. · manual"
                },
                {
                  "x": 10,
                  "y": 47,
                  "name": "Transferencia ATTESA",
                  "short": "Transferencia",
                  "desc": "Decide cuánto par llega a las ruedas delanteras.",
                  "value": "0–50 % al eje delantero"
                },
                {
                  "x": 19.5,
                  "y": 37,
                  "name": "Semiejes",
                  "short": "Semiejes",
                  "desc": "Llevan el par desde los diferenciales hasta cada rueda.",
                  "value": "4 × semieje homocinético"
                }
              ]
            },
            {
              "key": "suspension",
              "kana": "サスペンション",
              "name": "Suspensión",
              "code": "Super HICAS",
              "image": "despiece-suspension",
              "caption": "Despiece ilustrativo de suspensión y dirección.",
              "title": "Suspensión",
              "line": "Multibrazo · Super HICAS",
              "historia": "Multibrazo en las cuatro ruedas y, además, unas ruedas traseras que también giran. Super HICAS las orienta apenas un poco según la velocidad y el volante, para entrar en las curvas con más precisión y cambiar de carril sin que la trasera dude.",
              "tecnico": [
                [
                  "Delantera",
                  "Multibrazo"
                ],
                [
                  "Trasera",
                  "Multibrazo"
                ],
                [
                  "Dirección trasera",
                  "Super HICAS",
                  "actuador eléctrico"
                ],
                [
                  "Neumáticos",
                  "245/40 ZR18"
                ]
              ],
              "parts": [
                {
                  "x": 18,
                  "y": 13,
                  "name": "Muelle y amortiguador",
                  "short": "Amortiguador",
                  "desc": "Sujetan la carrocería y filtran el asfalto.",
                  "value": "Conjunto coaxial"
                },
                {
                  "x": 21,
                  "y": 39,
                  "name": "Brazos multibrazo",
                  "short": "Brazos multibrazo",
                  "desc": "Controlan el ángulo de la rueda al comprimirse.",
                  "value": "Multibrazo en ambos ejes"
                },
                {
                  "x": 50,
                  "y": 33,
                  "name": "Cremallera de dirección",
                  "short": "Cremallera",
                  "desc": "Convierte el giro del volante en giro de las ruedas.",
                  "value": "Cremallera asistida"
                },
                {
                  "x": 50,
                  "y": 57,
                  "name": "Actuador Super HICAS",
                  "short": "Super HICAS",
                  "desc": "Gira las ruedas traseras unos pocos grados.",
                  "value": "Dirección trasera activa"
                }
              ]
            },
            {
              "key": "frenos",
              "kana": "ブレーキ",
              "name": "Frenos",
              "code": "Brembo",
              "image": "despiece-frenos",
              "caption": "Despiece ilustrativo de un freno delantero.",
              "title": "Frenos",
              "line": "Brembo · 4 pistones delante, 2 detrás",
              "historia": "Pinzas Brembo de serie, algo poco habitual en un coche japonés de la época. Están pensadas para frenar una y otra vez sin que el pedal pierda tacto: lo que pide una noche larga en la Wangan.",
              "tecnico": [
                [
                  "Delanteros",
                  "4 pistones · Ø 324 mm"
                ],
                [
                  "Traseros",
                  "2 pistones · Ø 300 mm"
                ],
                [
                  "Discos",
                  "Ventilados"
                ],
                [
                  "Asistencia",
                  "ABS"
                ]
              ],
              "parts": [
                {
                  "x": 19.5,
                  "y": 47,
                  "name": "Pinza Brembo",
                  "short": "Pinza Brembo",
                  "desc": "Abraza el disco con varios pistones a la vez.",
                  "value": "Fija · 4 pistones"
                },
                {
                  "x": 30,
                  "y": 48,
                  "name": "Pastillas",
                  "short": "Pastillas",
                  "desc": "El material de fricción que se gasta en cada frenada.",
                  "value": "2 por pinza"
                },
                {
                  "x": 51,
                  "y": 47,
                  "name": "Disco ventilado",
                  "short": "Disco",
                  "desc": "Canales interiores para disipar el calor.",
                  "value": "Ø 324 mm delante"
                },
                {
                  "x": 78,
                  "y": 18,
                  "name": "Latiguillo",
                  "short": "Latiguillo",
                  "desc": "Lleva el líquido de frenos hasta la pinza.",
                  "value": "Conducto hidráulico"
                }
              ]
            },
            {
              "key": "cabina",
              "kana": "コクピット",
              "name": "Cabina",
              "code": "MFD",
              "image": "r34-cabina",
              "caption": "Cabina con volante a la derecha, como en Japón.",
              "title": "Cabina",
              "line": "MFD · pantalla multifunción",
              "historia": "En el centro del salpicadero, una pantalla multifunción muestra lo que normalmente solo se ve con instrumentos de carreras: la presión del turbo y las temperaturas, a la vista del conductor.",
              "tecnico": [
                [
                  "Pantalla MFD",
                  "Turbo · temperaturas",
                  "aceite, agua, admisión y más"
                ],
                [
                  "Volante",
                  "A la derecha"
                ],
                [
                  "Cambio",
                  "Manual · 6 vel."
                ],
                [
                  "Plazas",
                  "4"
                ]
              ],
              "parts": [
                {
                  "x": 35,
                  "y": 23,
                  "name": "Pantalla multifunción",
                  "short": "Pantalla multifunción",
                  "desc": "Turbo, temperaturas y más, en tiempo real.",
                  "value": "MFD central"
                },
                {
                  "x": 57,
                  "y": 29,
                  "name": "Cuadro de instrumentos",
                  "short": "Cuadro de instrumentos",
                  "desc": "Cuentavueltas en el centro, como en un coche de carreras.",
                  "value": "Cuentavueltas central"
                },
                {
                  "x": 64,
                  "y": 46,
                  "name": "Volante",
                  "short": "Volante",
                  "desc": "Tres radios y el emblema GT-R en el centro.",
                  "value": "3 radios · cuero"
                },
                {
                  "x": 30,
                  "y": 71,
                  "name": "Palanca de cambios",
                  "short": "Palanca de cambios",
                  "desc": "Cambio manual Getrag de seis marchas.",
                  "value": "Getrag · 6 vel."
                }
              ]
            }
          ]
        },
        {
          "type": "specs-board",
          "id": "cifras",
          "nav": "Cifras",
          "shield": "B",
          "title": "Cifras de serie",
          "kana": "大黒 · 諸元",
          "note": "Cifras oficiales de serie del GT-R estándar. Los ~330 PS medidos en banco son una estimación habitual, no un dato del fabricante.",
          "specs": [
            "power",
            "torque",
            "displacement",
            "weight",
            "drivetrain"
          ]
        }
      ]
    },
    {
      "id": "mclaren-p1",
      "slug": "p1",
      "name": "McLaren P1",
      "brand": "McLaren",
      "make": "McLaren",
      "model": "P1",
      "year": 2013,
      "years": "2013 — 2015",
      "theme": "woking",
      "palette": {
        "accent": "#FF8C00",
        "body": "#FF8C00",
        "note": "Naranja papaya/ámbar; el tema woking define el resto de la paleta",
        "hallAccent": "255, 140, 0"
      },
      "marks": [
        "McLaren",
        "P1",
        "MonoCage",
        "Akebono"
      ],
      "exitLine": "Aerodinámica activa e híbrido nacido en la Fórmula 1",
      "meta": {
        "title": "McLaren P1 · Sala 03 · Museo digital del automóvil",
        "description": "Sala 03 del museo digital del automóvil: el McLaren P1, pionero de la Santísima Trinidad. Aerodinámica activa, V8 biturbo M838TQ con propulsión híbrida, MonoCage de carbono y frenos Akebono en despiece interactivo."
      },
      "specs": {
        "engine": {
          "label": "Motor",
          "value": "3.8L V8 biturbo M838TQ híbrido",
          "note": "3.799 cc + motor eléctrico síncrono"
        },
        "power": {
          "label": "Potencia combinada",
          "value": 916,
          "unit": "CV",
          "note": "V8 biturbo + motor eléctrico síncrono (KERS)"
        },
        "torque": {
          "label": "Par combinado",
          "value": 900,
          "unit": "Nm"
        },
        "topSpeed": {
          "label": "Velocidad máxima",
          "value": 350,
          "unit": "km/h",
          "note": "limitada electrónicamente"
        },
        "acceleration": {
          "label": "0 – 100 km/h",
          "value": 2.8,
          "unit": "s",
          "decimals": 1
        },
        "weight": {
          "label": "Peso en seco",
          "value": 1395,
          "unit": "kg"
        },
        "drivetrain": {
          "label": "Tracción",
          "value": "Trasera (RWD)",
          "note": "doble embrague de 7 velocidades"
        },
        "production": {
          "label": "Unidades",
          "value": 375
        }
      },
      "images": {
        "p1-perfil": {
          "role": "hero",
          "src": "p1/img/p1-perfil.jpg",
          "w": 1600,
          "h": 800,
          "alt": "McLaren P1 naranja de perfil, mirando a la izquierda, sobre suelo negro reflectante",
          "formats": [
            "avif",
            "webp"
          ]
        },
        "despiece-aleron": {
          "role": "exploded",
          "src": "p1/img/despiece-aleron.jpg",
          "w": 1536,
          "h": 1024,
          "alt": "Despiece del alerón trasero activo: ala de fibra de carbono sobre sus actuadores hidráulicos",
          "formats": [
            "avif",
            "webp"
          ]
        },
        "despiece-motor": {
          "role": "exploded",
          "src": "p1/img/despiece-motor.jpg",
          "w": 1536,
          "h": 1024,
          "alt": "Motor V8 biturbo M838TQ con el cableado naranja de alta tensión del sistema híbrido",
          "formats": [
            "avif",
            "webp"
          ]
        },
        "despiece-chasis": {
          "role": "exploded",
          "src": "p1/img/despiece-chasis.jpg",
          "w": 1536,
          "h": 1024,
          "alt": "Monocasco MonoCage de fibra de carbono desnudo, con el techo y la toma de aire integrados",
          "formats": [
            "avif",
            "webp"
          ]
        },
        "despiece-bateria": {
          "role": "exploded",
          "src": "p1/img/despiece-bateria.jpg",
          "w": 1536,
          "h": 1024,
          "alt": "Módulo de baterías de iones de litio con su radiador y circuito de refrigeración líquida",
          "formats": [
            "avif",
            "webp"
          ]
        },
        "despiece-suspension": {
          "role": "exploded",
          "src": "p1/img/despiece-suspension.jpg",
          "w": 1536,
          "h": 1024,
          "alt": "Conjunto de suspensión: brazo, amortiguador y acumuladores hidráulicos en negro",
          "formats": [
            "avif",
            "webp"
          ]
        },
        "despiece-frenos": {
          "role": "exploded",
          "src": "p1/img/despiece-frenos.jpg",
          "w": 1536,
          "h": 1024,
          "alt": "Disco de freno carbocerámico perforado con pinza Akebono naranja",
          "formats": [
            "avif",
            "webp"
          ]
        }
      },
      "hall": {
        "text": "El pionero de la «Santísima Trinidad». Aerodinámica activa extrema y propulsión híbrida nacida directamente del desarrollo de la Fórmula 1.",
        "specs": [
          [
            "916 CV",
            "V8 biturbo + KERS"
          ],
          [
            "350 km/h",
            "Limitada"
          ],
          [
            "1.395 kg",
            "Peso en seco"
          ]
        ],
        "image": {
          "ref": "p1-perfil",
          "fit": "contain"
        }
      },
      "sections": [
        {
          "type": "hero-cinematic",
          "id": "inicio",
          "nav": "Historia",
          "kicker": [
            "Woking",
            "Santísima Trinidad"
          ],
          "title": "P1",
          "image": "p1-perfil",
          "lead": {
            "historia": "El pionero de la <em>«Santísima Trinidad»</em>. Aerodinámica activa extrema y propulsión híbrida nacida directamente del desarrollo de la <em>Fórmula 1</em>.",
            "tecnico": "V8 biturbo <em>M838TQ</em> de 3.8 L y un motor eléctrico: <em>916 CV</em> combinados, 900 Nm y 350 km/h limitados, sobre un monocasco de carbono de <em>1.395 kg</em> en seco."
          },
          "facts": {
            "historia": [
              [
                "2013",
                "Presentación"
              ],
              [
                "375",
                "Unidades"
              ],
              [
                "Trinidad",
                "LaFerrari · 918"
              ]
            ],
            "tecnico": [
              [
                "916 CV",
                "Combinados"
              ],
              [
                "2,8 s",
                "0 – 100 km/h"
              ],
              [
                "350 km/h",
                "Limitada"
              ]
            ]
          },
          "cue": {
            "label": "Laboratorio",
            "target": "laboratorio",
            "aria": "Ir al laboratorio"
          }
        },
        {
          "type": "telemetry-lab",
          "id": "laboratorio",
          "nav": "Laboratorio",
          "kicker": [
            "MTC · Woking",
            "túnel de viento"
          ],
          "title": "Banco de telemetría.",
          "intro": "Alterna el chasis entre <b>Road</b> y <b>Race</b>: el coche baja 50 mm y despliega el alerón. Activa el flujo de aire y pulsa un sensor para abrir la telemetría de cada sistema.",
          "image": "p1-perfil",
          "rig": {
            "ground": 74.75,
            "drop": 1.3,
            "wheels": [
              [
                23.06,
                59.75,
                7.6,
                15.2
              ],
              [
                81.56,
                59.63,
                7.85,
                15.7
              ]
            ],
            "wing": [
              84.5,
              29.75,
              96.75,
              36
            ],
            "lift": 3.4,
            "tilt": -4,
            "struts": [
              90.9,
              93.75
            ],
            "sill": [
              33,
              70.6
            ],
            "profile": [
              [
                -40,
                455
              ],
              [
                45,
                445
              ],
              [
                120,
                410
              ],
              [
                230,
                372
              ],
              [
                330,
                336
              ],
              [
                440,
                326
              ],
              [
                530,
                300
              ],
              [
                620,
                252
              ],
              [
                700,
                212
              ],
              [
                780,
                192
              ],
              [
                900,
                186
              ],
              [
                1000,
                214
              ],
              [
                1100,
                250
              ],
              [
                1200,
                283
              ],
              [
                1330,
                283
              ],
              [
                1365,
                248
              ],
              [
                1450,
                238
              ],
              [
                1548,
                243
              ],
              [
                1600,
                262
              ],
              [
                1640,
                268
              ]
            ]
          },
          "chassis": {
            "default": "road",
            "modes": [
              {
                "key": "road",
                "label": "Road",
                "ride": "Ref.",
                "readouts": [
                  [
                    "Altura libre",
                    "Ref.",
                    ""
                  ],
                  [
                    "Alerón",
                    "120",
                    "mm"
                  ],
                  [
                    "Muelles",
                    "Base",
                    ""
                  ],
                  [
                    "Carga aero",
                    "Variable",
                    ""
                  ]
                ]
              },
              {
                "key": "race",
                "label": "Race",
                "ride": "−50 mm",
                "readouts": [
                  [
                    "Altura libre",
                    "−50",
                    "mm"
                  ],
                  [
                    "Alerón",
                    "300",
                    "mm"
                  ],
                  [
                    "Muelles",
                    "+300",
                    "%"
                  ],
                  [
                    "Carga aero",
                    "600",
                    "kg"
                  ]
                ]
              }
            ]
          },
          "flow": {
            "label": "Flujo aerodinámico",
            "default": true
          },
          "charts": {
            "power": {
              "title": "Entrega · eléctrico frente a V8",
              "aria": "Gráfica: el par eléctrico está disponible al 100 % desde 0 rpm; el par del V8 llega a su máximo a 4.000 rpm y su potencia a 7.500 rpm.",
              "xMax": 8000,
              "xLabel": "rpm × 1000",
              "series": [
                {
                  "key": "e",
                  "label": "Par eléctrico",
                  "peak": "260 Nm · 0 rpm",
                  "fill": true,
                  "points": [
                    [
                      0,
                      1
                    ],
                    [
                      2400,
                      1
                    ],
                    [
                      4800,
                      1
                    ],
                    [
                      6000,
                      0.8
                    ],
                    [
                      7000,
                      0.69
                    ],
                    [
                      8000,
                      0.6
                    ]
                  ]
                },
                {
                  "key": "t",
                  "label": "Par V8 biturbo",
                  "peak": "720 Nm · 4.000 rpm",
                  "points": [
                    [
                      1000,
                      0.3
                    ],
                    [
                      2000,
                      0.55
                    ],
                    [
                      3000,
                      0.84
                    ],
                    [
                      4000,
                      1
                    ],
                    [
                      5500,
                      1
                    ],
                    [
                      7000,
                      0.95
                    ],
                    [
                      8000,
                      0.86
                    ]
                  ]
                },
                {
                  "key": "p",
                  "label": "Potencia V8",
                  "peak": "737 CV · 7.500 rpm",
                  "points": [
                    [
                      1000,
                      0.04
                    ],
                    [
                      2000,
                      0.15
                    ],
                    [
                      3000,
                      0.35
                    ],
                    [
                      4000,
                      0.56
                    ],
                    [
                      5500,
                      0.77
                    ],
                    [
                      7000,
                      0.92
                    ],
                    [
                      7500,
                      1
                    ],
                    [
                      8000,
                      0.96
                    ]
                  ]
                }
              ],
              "notes": [
                {
                  "at": [
                    0,
                    1
                  ],
                  "text": "260 Nm al instante",
                  "dx": 8,
                  "dy": -7
                },
                {
                  "at": [
                    7500,
                    1
                  ],
                  "text": "737 CV",
                  "anchor": "end",
                  "dx": -8,
                  "dy": -7,
                  "delay": 0.3
                }
              ],
              "note": "Curvas ilustrativas, cada una en % de su máximo, trazadas a partir de los valores homologados; no son datos de banco."
            }
          },
          "points": [
            {
              "x": 90,
              "y": 33,
              "side": "t",
              "anchor": "wing",
              "label": "Alerón activo · DRS",
              "short": "Alerón",
              "num": "01 · Aerodinámica activa",
              "title": "Alerón trasero activo / DRS",
              "image": "despiece-aleron",
              "historia": {
                "text": [
                  "El alerón trasero del P1 no está nunca quieto: sube, baja y cambia de ángulo según la velocidad y el modo de conducción. Junto a los flaps del fondo delantero genera una carga aerodinámica que ningún coche de calle había alcanzado.",
                  "Un botón en el volante activa el DRS, el mismo sistema de reducción de resistencia que usaban los monoplazas de Fórmula 1: el alerón se aplana en recta y recupera su ángulo al frenar."
                ],
                "specs": [
                  [
                    "Carga máxima",
                    "600 kg"
                  ],
                  [
                    "Inspiración",
                    "DRS de la Fórmula 1"
                  ],
                  [
                    "Mando",
                    "Botón en el volante"
                  ]
                ]
              },
              "tecnico": {
                "text": [
                  "Alerón de carbono accionado hidráulicamente que se extiende hasta 300 mm en modo Race (120 mm en carretera) y varía su incidencia de forma continua. Trabaja coordinado con los flaps activos situados delante de las ruedas delanteras para equilibrar la carga entre ejes.",
                  "Con el DRS activado, el ala se aplana y la resistencia aerodinámica cae en torno a un 23 %. En frenada fuerte el alerón actúa además como aerofreno."
                ],
                "specs": [
                  [
                    "Carga aerodinámica",
                    "600 kg a unos 257 km/h"
                  ],
                  [
                    "Extensión",
                    "300 mm (Race) · 120 mm (carretera)"
                  ],
                  [
                    "DRS",
                    "≈ −23 % de resistencia"
                  ],
                  [
                    "Elementos activos",
                    "Alerón + flaps delanteros"
                  ]
                ]
              }
            },
            {
              "x": 67,
              "y": 41,
              "side": "t",
              "anchor": "body",
              "label": "Motor M838TQ + KERS",
              "short": "Motor",
              "num": "02 · Propulsión híbrida",
              "title": "Motor M838TQ V8 3.8L biturbo + KERS",
              "image": "despiece-motor",
              "chart": "power",
              "historia": {
                "text": [
                  "Detrás de los asientos trabaja un V8 biturbo de 3.8 litros acoplado a un motor eléctrico. El sistema híbrido, heredero del KERS de la Fórmula 1, rellena el hueco de los turbos: la respuesta al acelerador es instantánea a cualquier régimen.",
                  "Juntos entregan 916 CV, y el P1 puede incluso circular unos kilómetros en modo totalmente eléctrico, en silencio."
                ],
                "specs": [
                  [
                    "Potencia",
                    "916 CV combinados"
                  ],
                  [
                    "Motor",
                    "V8 biturbo 3.8 L"
                  ],
                  [
                    "Herencia",
                    "KERS de la Fórmula 1"
                  ]
                ]
              },
              "tecnico": {
                "text": [
                  "M838TQ: V8 a 90° de 3.799 cc con dos turbocompresores, cárter seco y colocación central trasera longitudinal; 737 CV a 7.500 rpm y 720 Nm. El motor eléctrico, de 179 CV y 260 Nm, va acoplado a la transmisión de doble embrague de siete velocidades.",
                  "McLaren llama IPAS (Instant Power Assist System) a la entrega eléctrica: un botón en el volante la descarga de golpe, como el KERS de los monoplazas. El modo E permite recorrer en torno a 10 km sin quemar gasolina."
                ],
                "specs": [
                  [
                    "Arquitectura",
                    "V8 a 90° · central longitudinal"
                  ],
                  [
                    "Cilindrada",
                    "3.799 cc"
                  ],
                  [
                    "Potencia V8",
                    "737 CV a 7.500 rpm"
                  ],
                  [
                    "Par V8",
                    "720 Nm"
                  ],
                  [
                    "Motor eléctrico",
                    "179 CV · 260 Nm"
                  ],
                  [
                    "Total",
                    "916 CV · 900 Nm"
                  ],
                  [
                    "Transmisión",
                    "Doble embrague · 7 velocidades"
                  ],
                  [
                    "Asistencia",
                    "IPAS (derivado del KERS)"
                  ]
                ]
              }
            },
            {
              "x": 50,
              "y": 32,
              "side": "t",
              "anchor": "body",
              "label": "MonoCage",
              "short": "MonoCage",
              "num": "03 · Estructura",
              "title": "Monocasco MonoCage de fibra de carbono",
              "image": "despiece-chasis",
              "historia": {
                "text": [
                  "Todo el P1 se apoya en una sola pieza de fibra de carbono que incluye el techo y la toma de aire del motor. Es una célula de supervivencia como la de un monoplaza: rígida, ligera y extremadamente resistente.",
                  "Es la evolución del MonoCell del MP4-12C, con el que McLaren llevó el chasis de carbono a la producción en serie."
                ],
                "specs": [
                  [
                    "Material",
                    "Fibra de carbono"
                  ],
                  [
                    "Incluye",
                    "Techo y toma de aire"
                  ],
                  [
                    "Origen",
                    "MonoCell del MP4-12C"
                  ]
                ]
              },
              "tecnico": {
                "text": [
                  "El MonoCage integra en una única estructura el habitáculo, el arco del techo y el snorkel de admisión, lo que elimina refuerzos y uniones. Pesa unos 90 kg y sirve de anclaje directo a los subchasis de aluminio delantero y trasero.",
                  "Su rigidez torsional permite reglajes de suspensión muy precisos, y la carrocería exterior, también de carbono, apenas aporta peso."
                ],
                "specs": [
                  [
                    "Tipo",
                    "Monocasco de carbono"
                  ],
                  [
                    "Peso",
                    "≈ 90 kg"
                  ],
                  [
                    "Integra",
                    "Techo + snorkel de admisión"
                  ],
                  [
                    "Subchasis",
                    "Aluminio delante y detrás"
                  ]
                ]
              }
            },
            {
              "x": 56,
              "y": 61,
              "side": "b",
              "anchor": "body",
              "label": "Batería",
              "short": "Batería",
              "num": "04 · Energía",
              "title": "Batería de alta densidad (KERS)",
              "image": "despiece-bateria",
              "chart": "power",
              "historia": {
                "text": [
                  "La energía eléctrica del P1 se guarda en una batería compacta situada en la parte baja del coche, tras el habitáculo, para mantener el centro de gravedad lo más bajo posible.",
                  "Se recarga mientras conduces, con el propio motor V8 y en las frenadas, o enchufándola a la red."
                ],
                "specs": [
                  [
                    "Tipo",
                    "Iones de litio"
                  ],
                  [
                    "Posición",
                    "Baja, tras el habitáculo"
                  ],
                  [
                    "Recarga",
                    "En marcha o enchufada"
                  ]
                ]
              },
              "tecnico": {
                "text": [
                  "Paquete de 324 celdas de iones de litio y 4,7 kWh con una densidad de potencia muy alta para su peso (unos 96 kg). Está refrigerado por líquido y fijado al MonoCage para proteger las celdas y mantener las masas centradas.",
                  "La batería alimenta tanto el empuje IPAS como el modo E, y se recarga por regeneración, con el excedente del V8 o con cargador externo."
                ],
                "specs": [
                  [
                    "Química",
                    "Iones de litio"
                  ],
                  [
                    "Celdas",
                    "324"
                  ],
                  [
                    "Capacidad",
                    "4,7 kWh"
                  ],
                  [
                    "Peso",
                    "≈ 96 kg"
                  ],
                  [
                    "Refrigeración",
                    "Líquida"
                  ]
                ]
              }
            },
            {
              "x": 22,
              "y": 47,
              "side": "t",
              "anchor": "body",
              "label": "Suspensión RCC",
              "short": "RCC",
              "num": "05 · Chasis activo",
              "title": "Suspensión RaceActive Chassis Control (RCC)",
              "image": "despiece-suspension",
              "historia": {
                "text": [
                  "La suspensión del P1 cambia de carácter con un botón: cómoda para la carretera y, en modo Race, baja el coche y lo endurece como un coche de carreras.",
                  "Lo consigue con un sistema hidráulico que conecta los amortiguadores entre sí, en lugar de las clásicas barras estabilizadoras."
                ],
                "specs": [
                  [
                    "Nombre",
                    "RaceActive Chassis Control"
                  ],
                  [
                    "Modo Race",
                    "Más bajo y más firme"
                  ],
                  [
                    "Barras estabilizadoras",
                    "Ninguna"
                  ]
                ]
              },
              "tecnico": {
                "text": [
                  "RCC es un sistema hidroneumático: amortiguadores interconectados hidráulicamente controlan balanceo y cabeceo sin barras estabilizadoras, y un circuito de muelles adicional permite variar la rigidez y la altura.",
                  "En modo Race el coche baja 50 mm y la rigidez de los muelles aumenta alrededor de un 300 %, mientras el alerón y los flaps se ajustan al nuevo apoyo."
                ],
                "specs": [
                  [
                    "Tipo",
                    "Hidroneumática interconectada"
                  ],
                  [
                    "Modo Race",
                    "−50 mm de altura"
                  ],
                  [
                    "Rigidez",
                    "≈ +300 % en modo Race"
                  ],
                  [
                    "Estabilizadoras",
                    "Sustituidas por el circuito hidráulico"
                  ]
                ]
              }
            },
            {
              "x": 26.5,
              "y": 59,
              "side": "b",
              "anchor": "wheel",
              "label": "Frenos Akebono",
              "short": "Frenos",
              "num": "06 · Frenada",
              "title": "Frenos carbocerámicos Akebono con recubrimiento de carburo de silicio",
              "image": "despiece-frenos",
              "historia": {
                "text": [
                  "Para detener 916 CV, McLaren recurrió a Akebono, su proveedor de frenos en la Fórmula 1. El resultado fueron unos discos carbocerámicos con un tratamiento nunca visto en un coche de calle.",
                  "La frenada es tan fuerte y constante vuelta tras vuelta como la de un coche de competición."
                ],
                "specs": [
                  [
                    "Fabricante",
                    "Akebono"
                  ],
                  [
                    "Discos",
                    "Carbocerámicos"
                  ],
                  [
                    "Herencia",
                    "Proveedor de McLaren en F1"
                  ]
                ]
              },
              "tecnico": {
                "text": [
                  "Discos de carbono-cerámica con un recubrimiento de carburo de silicio que endurece la superficie de fricción, mejora la disipación del calor y reduce el desgaste. Pinzas monobloque desarrolladas específicamente con Akebono.",
                  "El sistema trabaja junto a la regeneración del motor eléctrico y al alerón activo, que en frenada fuerte actúa como aerofreno."
                ],
                "specs": [
                  [
                    "Discos",
                    "Carbocerámicos con SiC"
                  ],
                  [
                    "Diámetro",
                    "390 mm delante · 380 mm detrás"
                  ],
                  [
                    "Pinzas",
                    "Monobloque Akebono"
                  ],
                  [
                    "Apoyo",
                    "Regeneración + aerofreno"
                  ]
                ]
              }
            }
          ]
        },
        {
          "type": "facts-counters",
          "id": "cifras",
          "kicker": "Ficha técnica",
          "title": "Cifras de un pionero",
          "specs": [
            "power",
            "torque",
            "topSpeed",
            "acceleration",
            "weight",
            "production"
          ]
        }
      ]
    },
    {
      "id": "bmw-m3-e30",
      "slug": "m3",
      "name": "BMW M3 E30 Sport Evolution",
      "brand": "BMW",
      "make": "BMW",
      "model": "M3 E30",
      "badge": "Sport Evolution",
      "year": 1990,
      "years": "1986 — 1991",
      "country": "Alemania",
      "category": "Turismo de Homologación Grupo A / DTM",
      "theme": "motorsport",
      "palette": {
        "accent": "#E2231A",
        "theme": "#0066B1",
        "body": "#E2231A",
        "note": "Rojo M Competición como acento y Azul M Motorsport como color de la sala; el tema motorsport define el resto",
        "hallAccent": "0, 102, 177"
      },
      "marks": [
        "BMW",
        "M3",
        "M Power",
        "Motorsport",
        "Getrag",
        "Bilstein",
        "Brembo"
      ],
      "exitLine": "Homologación Grupo A nacida para el DTM",
      "meta": {
        "title": "BMW M3 E30 Sport Evolution · Sala 04 · Museo digital del automóvil",
        "description": "Sala 04 del museo digital del automóvil: el BMW M3 E30 Sport Evolution, turismo de homologación Grupo A / DTM. Motor S14, caja Getrag 265 dog-leg, autoblocante al 25 %, suspensión, frenos y aerodinámica en despiece interactivo."
      },
      "specs": {
        "engine": {
          "label": "Motor",
          "value": "S14B25 2.5L 4 cilindros",
          "note": "atmosférico · DOHC 16V"
        },
        "power": {
          "label": "Potencia",
          "value": 238,
          "unit": "CV",
          "note": "a 7.000 rpm (calle) · 300 CV a 8.500 rpm (DTM)"
        },
        "torque": {
          "label": "Par motor",
          "value": 240,
          "unit": "Nm",
          "note": "a 4.750 rpm"
        },
        "topSpeed": {
          "label": "Velocidad máxima",
          "value": 248,
          "unit": "km/h"
        },
        "acceleration": {
          "label": "0 – 100 km/h",
          "value": 6.5,
          "unit": "s",
          "decimals": 1
        },
        "weight": {
          "label": "Peso",
          "value": 1200,
          "unit": "kg",
          "note": "calle · 980 kg en especificación DTM"
        },
        "transmission": {
          "label": "Caja de cambios",
          "value": "Getrag 265",
          "note": "manual de 5 velocidades · dog-leg"
        },
        "drivetrain": {
          "label": "Tracción",
          "value": "Trasera",
          "note": "autoblocante LSD 25 %"
        }
      },
      "images": {
        "m3-perfil": {
          "role": "hero",
          "src": "m3/img/m3-perfil.jpg",
          "w": 1536,
          "h": 1024,
          "alt": "BMW M3 E30 rojo de perfil, mirando a la izquierda, sobre suelo negro mojado",
          "formats": [
            "avif",
            "webp"
          ]
        },
        "despiece-motor": {
          "role": "exploded",
          "src": "m3/img/despiece-motor.jpg",
          "w": 1536,
          "h": 1024,
          "alt": "Motor S14 de cuatro cilindros con mariposas independientes y colector de escape tubular",
          "formats": [
            "avif",
            "webp"
          ]
        },
        "despiece-caja": {
          "role": "exploded",
          "src": "m3/img/despiece-caja.jpg",
          "w": 1536,
          "h": 1024,
          "alt": "Caja de cambios manual Getrag 265 con su radiador auxiliar de aceite",
          "formats": [
            "avif",
            "webp"
          ]
        },
        "despiece-diferencial": {
          "role": "exploded",
          "src": "m3/img/despiece-diferencial.jpg",
          "w": 1536,
          "h": 1024,
          "alt": "Diferencial autoblocante trasero con carcasa de aletas de refrigeración",
          "formats": [
            "avif",
            "webp"
          ]
        },
        "despiece-suspension": {
          "role": "exploded",
          "src": "m3/img/despiece-suspension.jpg",
          "w": 1536,
          "h": 1024,
          "alt": "Conjunto de suspensión delantera con amortiguador Bilstein, brazo de aluminio y freno",
          "formats": [
            "avif",
            "webp"
          ]
        },
        "despiece-frenos": {
          "role": "exploded",
          "src": "m3/img/despiece-frenos.jpg",
          "w": 1536,
          "h": 1536,
          "alt": "Disco de freno perforado con pinza Brembo negra",
          "formats": [
            "avif",
            "webp"
          ]
        },
        "despiece-aero": {
          "role": "exploded",
          "src": "m3/img/despiece-aero.jpg",
          "w": 1536,
          "h": 1024,
          "alt": "Alerón trasero y splitter delantero del kit aerodinámico con su tornillería",
          "formats": [
            "avif",
            "webp"
          ]
        }
      },
      "hall": {
        "text": "La homologación del Grupo A hecha coche de calle: el S14 de altas vueltas, la caja Getrag dog-leg y la aerodinámica regulable que dominó el DTM.",
        "specs": [
          [
            "238 CV",
            "S14 atmosférico"
          ],
          [
            "248 km/h",
            "Vel. máxima"
          ],
          [
            "1.200 kg",
            "Calle"
          ]
        ],
        "image": {
          "ref": "m3-perfil",
          "fit": "contain"
        }
      },
      "sections": [
        {
          "type": "hero-cinematic",
          "id": "inicio",
          "nav": "Historia",
          "kicker": [
            "Alemania",
            "Grupo A / DTM"
          ],
          "title": "M3",
          "image": "m3-perfil",
          "lead": {
            "historia": "Un <em>turismo de homologación</em> del Grupo A: BMW lo fabricó para poder correr con él en el <em>DTM</em>, y la versión Sport Evolution llevó al asfalto lo que pedía la competición.",
            "tecnico": "Motor <em>S14B25</em> de 2.5 L, cuatro cilindros atmosférico DOHC 16V: <em>238 CV a 7.000 rpm</em> y 240 Nm, caja Getrag 265 dog-leg y autoblocante al 25 % para <em>1.200 kg</em>."
          },
          "facts": {
            "historia": [
              [
                "1990",
                "Sport Evolution"
              ],
              [
                "600",
                "Unidades"
              ],
              [
                "DTM",
                "Competición"
              ]
            ],
            "tecnico": [
              [
                "238 CV",
                "A 7.000 rpm"
              ],
              [
                "240 Nm",
                "A 4.750 rpm"
              ],
              [
                "248 km/h",
                "Vel. máxima"
              ]
            ]
          },
          "cue": {
            "label": "Homologación",
            "target": "homologacion",
            "aria": "Ir al box de homologación"
          }
        },
        {
          "type": "homologation-bay",
          "id": "homologacion",
          "nav": "Homologación",
          "kicker": [
            "DTM Paddock",
            "Bavarian Homologation"
          ],
          "title": "Homologado para correr.",
          "intro": "Pulsa una pieza para acercarte y abrir su despiece: en modo <b>Historia</b>, su relato de competición y homologación; en modo <b>Técnico</b>, su ficha de ingeniería. En la barra lateral, cambia el reglaje entre <b>Strassenversion</b> (calle) y <b>DTM Spec</b> (competición).",
          "stamp": [
            "FIA Homologation",
            "Group A // 1990"
          ],
          "image": "m3-perfil",
          "rig": {
            "wing": [
              85.29,
              25.98,
              97.33,
              32.62
            ],
            "tilt": -3,
            "gurney": [
              96.7,
              26,
              0.45,
              1
            ],
            "strut": [
              96.2,
              0.35
            ]
          },
          "dims": [
            {
              "from": [
                1.6,
                14
              ],
              "to": [
                97.8,
                14
              ],
              "label": "Longitud",
              "value": "4.345 mm"
            },
            {
              "from": [
                17.25,
                67
              ],
              "to": [
                75.45,
                67
              ],
              "label": "Batalla",
              "value": "2.565 mm"
            },
            {
              "from": [
                99.3,
                19
              ],
              "to": [
                99.3,
                64
              ],
              "label": "Altura",
              "value": "1.370 mm",
              "vertical": true
            }
          ],
          "setups": {
            "default": "strasse",
            "note": "Esquema exagerado para que se aprecie",
            "modes": [
              {
                "key": "strasse",
                "label": "Strassenversion",
                "sub": "Calle",
                "camber": -1,
                "readouts": [
                  [
                    "Potencia",
                    "238",
                    "CV"
                  ],
                  [
                    "Régimen de potencia",
                    "7.000",
                    "rpm"
                  ],
                  [
                    "Peso",
                    "1.200",
                    "kg"
                  ],
                  [
                    "Alerón",
                    "Serie",
                    ""
                  ],
                  [
                    "Cámber delantero",
                    "Calle",
                    ""
                  ]
                ]
              },
              {
                "key": "dtm",
                "label": "DTM Spec",
                "sub": "Competición",
                "camber": -4,
                "readouts": [
                  [
                    "Potencia",
                    "300",
                    "CV"
                  ],
                  [
                    "Régimen de potencia",
                    "8.500",
                    "rpm"
                  ],
                  [
                    "Peso",
                    "980",
                    "kg"
                  ],
                  [
                    "Alerón",
                    "+ Gurney",
                    ""
                  ],
                  [
                    "Cámber delantero",
                    "Negativo",
                    ""
                  ]
                ]
              }
            ]
          },
          "points": [
            {
              "id": "part-engine",
              "x": 19,
              "y": 40,
              "side": "t",
              "label": "Motor S14",
              "num": "01 · Propulsión",
              "title": "Motor S14B23 / S14B25 4L DOHC",
              "image": "despiece-motor",
              "story": "Diseñado por el equipo de Paul Rosche, jefe de motores de BMW Motorsport y responsable del motor turbo con el que Brabham-BMW ganó el Mundial de F1 de 1983. La FIA exigía fabricar 5.000 unidades de calle para homologar un turismo en el Grupo A. El seis cilindros en línea era demasiado largo y pesado para el reparto de masas buscado, así que BMW recurrió a un cuatro cilindros: la culata de cuatro válvulas por cilindro deriva del seis en línea M88 del BMW M1, montada sobre un bloque de la familia M10. El resultado fue el corazón del turismo más laureado de su época.",
              "technical": [
                [
                  "Cilindrada",
                  "2.302 cc (S14B23, M3 de calle) · 2.467 cc (S14B25, Sport Evolution)"
                ],
                [
                  "Distribución",
                  "DOHC · 16 válvulas · taqués de cubeta"
                ],
                [
                  "Admisión",
                  "Cuatro mariposas individuales, una por cilindro"
                ],
                [
                  "Relación de compresión",
                  "10,5:1 (S14B23 de calle)"
                ],
                [
                  "Potencia y par",
                  "238 CV a 7.000 rpm · 240 Nm a 4.750 rpm (Sport Evolution)"
                ],
                [
                  "Potencia específica",
                  "96,5 CV/l (238 CV con 2,467 l)"
                ]
              ]
            },
            {
              "id": "part-gearbox",
              "x": 37,
              "y": 49,
              "side": "b",
              "label": "Caja Getrag",
              "num": "02 · Transmisión",
              "title": "Caja Getrag 265/5 'Dog-leg'",
              "image": "despiece-caja",
              "story": "Configurada con patrón de competición 'dog-leg': la primera marcha se sitúa hacia atrás a la izquierda, dejando la 2ª y 3ª, así como la 4ª y 5ª, alineadas en el mismo eje vertical directo. Esto permitía a los pilotos del DTM como Roberto Ravaglia o Johnny Cecotto enlazar las transiciones más críticas en curva de forma rectilínea e instantánea sin riesgo de errar el cambio.",
              "technical": [
                [
                  "Tipo",
                  "Getrag 265 · manual de 5 marchas"
                ],
                [
                  "Patrón",
                  "Dog-leg: la 1.ª, hacia atrás a la izquierda; 2.ª-3.ª y 4.ª-5.ª en línea recta"
                ],
                [
                  "Relaciones de cambio",
                  "1ª: 3.72 | 2ª: 2.40 | 3ª: 1.77 | 4ª: 1.26 | 5ª: 1.00 (Directa)"
                ]
              ]
            },
            {
              "id": "part-diff",
              "x": 74,
              "y": 46,
              "side": "t",
              "label": "Diferencial",
              "num": "03 · Tracción",
              "title": "Diferencial Autoblocante Trasero Typ 188",
              "image": "despiece-diferencial",
              "story": "El arma secreta que permitía al M3 salir catapultado de las chicanes de Nürburgring y Hockenheim traccionando allí donde un diferencial abierto haría patinar la rueda interior. Su tarado mecánico garantizaba que, al levantar rueda interior en los pianos agresivos, la rueda exterior siguiera transmitiendo toda la potencia al asfalto sin vacilación.",
              "technical": [
                [
                  "Tipo",
                  "Diferencial trasero Typ 188 (corona de 188 mm)"
                ],
                [
                  "Tarado de bloqueo",
                  "Autoblocante al 25 %"
                ],
                [
                  "Grupo final",
                  "3,25:1 (versión de calle europea)"
                ],
                [
                  "Carcasa",
                  "Tapa con aletas de refrigeración"
                ]
              ]
            },
            {
              "id": "part-suspension",
              "x": 16,
              "y": 43,
              "side": "l",
              "label": "Suspensión",
              "num": "04 · Chasis",
              "title": "Suspensión MacPherson de homologación",
              "image": "despiece-suspension",
              "story": "Aunque compartía el esquema general con un Serie 3 convencional, el M3 E30 modificó la suspensión para la homologación: geometría delantera propia con más avance de la dirección (caster), que da una dirección más comunicativa y un autocentrado inmediato, y bujes y rodamientos más robustos tomados de la Serie 5. Las versiones de competición partían de esa base para soportar los neumáticos slick del Grupo A.",
              "technical": [
                [
                  "Delantera",
                  "MacPherson, geometría específica del M3 con más avance"
                ],
                [
                  "Trasera",
                  "Brazos semiarrastrados"
                ],
                [
                  "Barra estabilizadora",
                  "Delantera unida a la pata de suspensión (no al trapecio)"
                ],
                [
                  "Bujes y rodamientos",
                  "Derivados de la Serie 5 (E28), con fijación de cinco tornillos"
                ]
              ]
            },
            {
              "id": "part-brakes",
              "x": 18.5,
              "y": 55,
              "side": "b",
              "label": "Frenos",
              "num": "05 · Frenada",
              "title": "Frenos ventilados y refrigeración de competición",
              "image": "despiece-frenos",
              "story": "En las carreras de turismos de finales de los ochenta, los duelos se decidían en las frenadas al final de las rectas. El Sport Evolution sustituyó los antinieblas delanteros por conductos que llevan aire fresco a los frenos, para que soporten tandas largas al límite sin perder eficacia. El despiece de esta pieza es ilustrativo: muestra una pinza de competición, no el freno de serie.",
              "technical": [
                [
                  "Delanteros (calle)",
                  "Discos ventilados de 280 mm"
                ],
                [
                  "Traseros (calle)",
                  "Discos macizos de 282 mm"
                ],
                [
                  "Refrigeración",
                  "Conductos en lugar de los antinieblas delanteros (Sport Evolution)"
                ],
                [
                  "Asistencias",
                  "ABS de serie"
                ]
              ]
            },
            {
              "id": "part-aero",
              "x": 91,
              "y": 29,
              "side": "t",
              "label": "Aerodinámica",
              "num": "06 · Aerodinámica",
              "title": "Paquete Aerodinámico Sport Evolution",
              "image": "despiece-aero",
              "story": "El E30 de serie tenía un coeficiente aerodinámico mediocre por su frontal vertical. Para el M3, BMW rediseñó la luneta trasera y elevó la tapa del maletero, de modo que el aire llegara limpio al alerón, y bajó el Cx de 0,38 a 0,33. El Sport Evolution final añadió un splitter delantero y un alerón trasero regulables para adaptar la carga a cada circuito.",
              "technical": [
                [
                  "Splitter delantero",
                  "Regulable en tres posiciones"
                ],
                [
                  "Alerón trasero",
                  "Regulable"
                ],
                [
                  "Coeficiente aerodinámico (Cx)",
                  "0,33 en el M3 frente a 0,38 del E30 estándar"
                ],
                [
                  "Luneta y maletero",
                  "Luneta rediseñada y tapa del maletero elevada para guiar el aire hacia el alerón"
                ]
              ]
            }
          ]
        },
        {
          "type": "facts-counters",
          "id": "cifras",
          "kicker": "Ficha técnica",
          "title": "Cifras de una leyenda del DTM",
          "specs": [
            "power",
            "torque",
            "topSpeed",
            "acceleration",
            "weight"
          ]
        }
      ]
    },
    {
      "id": "porsche-gt3-rs",
      "slug": "gt3rs",
      "name": "Porsche 911 GT3 RS (992)",
      "brand": "Porsche",
      "make": "Porsche",
      "model": "911 GT3 RS",
      "badge": "(992)",
      "year": 2023,
      "years": "2023",
      "country": "Alemania",
      "category": "Weissach Package // Nordschleife Track Weapon",
      "theme": "weissach",
      "palette": {
        "accent": "#C5A059",
        "theme": "#4B0082",
        "secondary": "#00E676",
        "body": "#4B0082",
        "note": "Púrpura Viola Metallic, acento Oro Neodyme Magnesio y verde de telemetría para el DRS",
        "hallAccent": "197, 160, 89"
      },
      "marks": [
        "Porsche",
        "911",
        "GT3 RS",
        "PDK",
        "PTV Plus",
        "PASM",
        "PCCB",
        "Michelin"
      ],
      "images": {
        "gt3rs-perfil": {
          "role": "hero",
          "src": "gt3rs/img/gt3rs-perfil.jpg",
          "w": 1536,
          "h": 1024,
          "alt": "Porsche 911 GT3 RS púrpura de perfil, mirando a la izquierda, sobre suelo negro mojado",
          "formats": [
            "avif",
            "webp"
          ],
          "hires": {
            "src": "gt3rs/img/gt3rs-perfil-hd.jpg",
            "w": 2000,
            "h": 1334,
            "formats": [
              "avif",
              "webp"
            ]
          }
        },
        "despiece-motor": {
          "role": "exploded",
          "src": "gt3rs/img/despiece-motor.jpg",
          "w": 1536,
          "h": 1024,
          "alt": "Render ilustrativo de un motor de competición de alto régimen con trompetas de admisión individuales",
          "formats": [
            "avif",
            "webp"
          ]
        },
        "despiece-caja": {
          "role": "exploded",
          "src": "gt3rs/img/despiece-caja.jpg",
          "w": 1536,
          "h": 1024,
          "alt": "Caja de cambios de doble embrague de siete velocidades con su electrónica y radiador de aceite",
          "formats": [
            "avif",
            "webp"
          ]
        },
        "despiece-diferencial": {
          "role": "exploded",
          "src": "gt3rs/img/despiece-diferencial.jpg",
          "w": 1536,
          "h": 1024,
          "alt": "Diferencial trasero autoblocante electrónico con actuador y carcasa nervada",
          "formats": [
            "avif",
            "webp"
          ]
        },
        "despiece-suspension": {
          "role": "exploded",
          "src": "gt3rs/img/despiece-suspension.jpg",
          "w": 1312,
          "h": 1199,
          "alt": "Suspensión de dobles trapecios con brazos de aluminio mecanizado, amortiguador y manguetas",
          "formats": [
            "avif",
            "webp"
          ]
        },
        "despiece-frenos": {
          "role": "exploded",
          "src": "gt3rs/img/despiece-frenos.jpg",
          "w": 1312,
          "h": 1199,
          "alt": "Disco carbocerámico perforado con pinza Porsche amarilla de seis pistones y buje de tuerca central",
          "formats": [
            "avif",
            "webp"
          ]
        },
        "despiece-aero": {
          "role": "exploded",
          "src": "gt3rs/img/despiece-aleron.jpg",
          "w": 1536,
          "h": 1024,
          "alt": "Despiece del alerón trasero de doble plano en fibra de carbono con su actuador central, placas laterales y soportes de aluminio mecanizado",
          "formats": [
            "avif",
            "webp"
          ]
        }
      },
      "hall": {
        "text": "Weissach Package y aerodinámica afinada en la Nordschleife: el 911 atmosférico más radical, con 860 kg de carga y un DRS de serie.",
        "specs": [
          [
            "525 CV",
            "Bóxer 4.0 · 9.000 rpm"
          ],
          [
            "860 kg",
            "Carga a 285 km/h"
          ],
          [
            "6:49.328",
            "Nordschleife"
          ]
        ],
        "image": {
          "ref": "gt3rs-perfil",
          "fit": "contain"
        }
      },
      "sections": [
        {
          "type": "hero-cinematic",
          "id": "inicio",
          "nav": "Historia",
          "kicker": [
            "Flacht",
            "Nordschleife Aero Dev"
          ],
          "title": "GT3 RS",
          "image": "gt3rs-perfil",
          "lead": {
            "historia": "Desarrollado por <em>Porsche Motorsport en Flacht</em> y afinado en la <em>Nordschleife</em>: el 911 de calle más cercano a un coche de carreras, con un motor atmosférico de 9.000 rpm y el primer DRS de un Porsche homologado.",
            "tecnico": "Bóxer atmosférico de <em>4.0 L y 525 CV a 8.500 rpm</em>, PDK de 7 relaciones, PTV Plus y <em>860 kg de carga a 285 km/h</em> para 1.450 kg (DIN) con Weissach Package."
          },
          "facts": {
            "historia": [
              [
                "2023",
                "Lanzamiento"
              ],
              [
                "Weissach",
                "Package"
              ],
              [
                "6:49.328",
                "Nordschleife"
              ]
            ],
            "tecnico": [
              [
                "525 CV",
                "A 8.500 rpm"
              ],
              [
                "860 kg",
                "A 285 km/h"
              ],
              [
                "9.000",
                "rpm máx."
              ]
            ]
          },
          "cue": {
            "label": "Laboratorio",
            "target": "laboratorio",
            "aria": "Ir al laboratorio"
          }
        },
        {
          "type": "homologation-bay",
          "id": "laboratorio",
          "nav": "Laboratorio",
          "kicker": [
            "Flacht Motorsport Lab",
            "Nordschleife Aero Dev"
          ],
          "title": "Seis sistemas, una vuelta de 6:49.",
          "intro": "Pulsa una pieza para acercarte y abrir su despiece: en modo <b>Historia</b>, la filosofía de Weissach y la Nordschleife; en modo <b>Técnico</b>, su ficha de ingeniería. En la barra lateral, alterna el alerón entre <b>High Downforce</b> y <b>DRS</b>.",
          "stamp": [
            "Nordschleife · 20,8 km",
            "6:49.328 // GT3 RS"
          ],
          "image": "gt3rs-perfil",
          "labels": {
            "story": "Historia · Weissach y la Nordschleife",
            "technical": "Telemetría y ficha de ingeniería"
          },
          "dims": [
            {
              "from": [
                1.2,
                17
              ],
              "to": [
                96.2,
                17
              ],
              "label": "Longitud",
              "value": "4.572 mm"
            },
            {
              "from": [
                20.7,
                70
              ],
              "to": [
                75.3,
                70
              ],
              "label": "Batalla",
              "value": "2.457 mm"
            },
            {
              "from": [
                98.6,
                25.2
              ],
              "to": [
                98.6,
                66.8
              ],
              "label": "Altura",
              "value": "1.322 mm",
              "vertical": true
            }
          ],
          "setups": {
            "default": "hd",
            "diagram": "wing",
            "diagramLabel": "Flap superior del alerón",
            "note": "Esquema en sección; el flujo va de izquierda a derecha",
            "modes": [
              {
                "key": "hd",
                "label": "High Downforce",
                "sub": "Curvas de la Nordschleife",
                "flap": 16,
                "readouts": [
                  [
                    "Carga a 285 km/h",
                    "860",
                    "kg"
                  ],
                  [
                    "Carga a 200 km/h",
                    "409",
                    "kg"
                  ],
                  [
                    "Flap superior",
                    "Carga máxima",
                    ""
                  ],
                  [
                    "DRS",
                    "Cerrado",
                    ""
                  ]
                ]
              },
              {
                "key": "drs",
                "label": "DRS",
                "sub": "Rectas · baja resistencia",
                "flap": 0,
                "readouts": [
                  [
                    "Carga a 285 km/h",
                    "Reducida",
                    ""
                  ],
                  [
                    "Carga a 200 km/h",
                    "Reducida",
                    ""
                  ],
                  [
                    "Flap superior",
                    "Plano",
                    ""
                  ],
                  [
                    "DRS",
                    "Abierto",
                    ""
                  ]
                ]
              }
            ]
          },
          "points": [
            {
              "id": "part-engine",
              "x": 83,
              "y": 47,
              "side": "t",
              "label": "Motor bóxer",
              "num": "01 · Propulsión",
              "title": "Motor Bóxer 4.0L Atmosférico (9.000 rpm)",
              "image": "despiece-motor",
              "story": "En una era dominada por la sobrealimentación y la hibridación, el departamento de Flacht mantuvo el purismo: un motor bóxer de seis cilindros atmosférico capaz de girar a 9.000 rpm. Derivado directamente del 911 GT3 R de competición, prescinde de taqués hidráulicos y recurre a balancines rígidos con reglaje por pastillas calibradas que no requieren ajuste en toda la vida del motor.",
              "technical": [
                [
                  "Cilindrada",
                  "3.996 cc (diámetro 102,0 mm × carrera 81,5 mm)"
                ],
                [
                  "Distribución",
                  "DOHC · 24 válvulas · balancines rígidos sin ajuste de holgura"
                ],
                [
                  "Admisión",
                  "Seis mariposas individuales (ITB)"
                ],
                [
                  "Lubricación",
                  "Cárter seco con depósito de aceite separado"
                ],
                [
                  "Relación de compresión",
                  "13,3:1"
                ],
                [
                  "Potencia y par",
                  "525 CV a 8.500 rpm · 465 Nm a 6.300 rpm"
                ],
                [
                  "Régimen máximo",
                  "9.000 rpm"
                ]
              ]
            },
            {
              "id": "part-gearbox",
              "x": 66,
              "y": 52,
              "side": "t",
              "label": "PDK 7",
              "num": "02 · Transmisión",
              "title": "Caja PDK de 7 Velocidades de Relación Corta",
              "image": "despiece-caja",
              "story": "A diferencia de los 911 estándar con 8 velocidades, el GT3 RS recurre a la caja PDK de 7 marchas para reducir peso y permitir un transeje más compacto. La relación del grupo cónico final se ha acortado deliberadamente respecto al GT3 estándar, priorizando aceleraciones brutales y recuperaciones inmediatas a la salida de cada curva de Nürburgring.",
              "technical": [
                [
                  "Tipo",
                  "PDK de doble embrague y 7 velocidades"
                ],
                [
                  "Desarrollos",
                  "Grupo final acortado respecto al GT3 para acelerar más en 2.ª, 3.ª y 4.ª"
                ],
                [
                  "Diferencia con el Carrera",
                  "Los 911 Carrera (992) usan una PDK de 8 velocidades"
                ],
                [
                  "Mando",
                  "Levas en el volante"
                ]
              ]
            },
            {
              "id": "part-diff",
              "x": 75.3,
              "y": 55,
              "side": "b",
              "label": "PTV Plus",
              "num": "03 · Tracción",
              "title": "Diferencial Trasero Electrónico PTV Plus",
              "image": "despiece-diferencial",
              "story": "El sistema Porsche Torque Vectoring Plus trabaja en simbiosis con el eje trasero direccional. En frenada y entrada en curva aplica una sutil presión de freno en la rueda interior generando un momento de guiñada instantáneo. En aceleración saliendo del vértice, el bloqueo electrónico distribuye el par motor milimétricamente para clavar la zaga en el asfalto.",
              "technical": [
                [
                  "Sistema",
                  "Porsche Torque Vectoring Plus (PTV Plus)"
                ],
                [
                  "Tarado de bloqueo",
                  "Bloqueo del diferencial trasero totalmente variable, controlado electrónicamente"
                ],
                [
                  "Apoyo",
                  "Intervenciones selectivas del freno en la rueda interior, junto al eje trasero direccional"
                ],
                [
                  "Mando en el volante",
                  "Ajuste del bloqueo desde un mando giratorio del volante"
                ]
              ]
            },
            {
              "id": "part-suspension",
              "x": 21,
              "y": 46,
              "side": "t",
              "label": "Dobles trapecios",
              "num": "04 · Chasis",
              "title": "Suspensión Delantera de Dobles Trapecios Aerodinámicos",
              "image": "despiece-suspension",
              "story": "Por primera vez en un GT3 RS de calle, los brazos de la suspensión delantera tienen perfil de gota de agua aerodinámico heredado de Le Mans, generando hasta 40 kg de carga aerodinámica a velocidad máxima por sí mismos. Además, la rótula delantera inferior se ha rebajado para mitigar el hundimiento del morro en frenadas extremas (efecto anti-dive).",
              "technical": [
                [
                  "Geometría",
                  "Dobles trapecios en el eje delantero"
                ],
                [
                  "Aerodinámica",
                  "Brazos con perfil de ala que añaden carga aerodinámica"
                ],
                [
                  "Amortiguación",
                  "PASM con ajuste por separado de rebote y compresión en cada eje"
                ],
                [
                  "Ajuste desde el volante",
                  "Diales giratorios en el volante para la amortiguación (PASM), el diferencial (PTV Plus) y el control de tracción"
                ],
                [
                  "Articulaciones",
                  "Rótulas en lugar de silentblocks elásticos"
                ]
              ]
            },
            {
              "id": "part-brakes",
              "x": 24.3,
              "y": 54,
              "side": "b",
              "label": "PCCB",
              "num": "05 · Frenada",
              "title": "Frenos Carbocerámicos Porsche Ceramic Composite Brake (PCCB)",
              "image": "despiece-frenos",
              "story": "Para detener un coche capaz de generar 860 kg de carga, Porsche ofrece como opción los frenos carbocerámicos PCCB: discos de fibra de carbono con matriz de carburo de silicio, tratados a unos 1.700 °C. Pesan alrededor de un 50 % menos que unos discos de fundición equivalentes, lo que reduce las masas no suspendidas.",
              "technical": [
                [
                  "Discos PCCB (opción)",
                  "410 mm delante · 390 mm detrás, perforados"
                ],
                [
                  "De serie",
                  "Discos de acero de 408 mm delante"
                ],
                [
                  "Pinzas",
                  "Monobloque de aluminio, 6 pistones delante (amarillas con PCCB)"
                ],
                [
                  "Resistencia térmica",
                  "Trabajan por encima de 1.000 °C sin pérdida de eficacia"
                ]
              ]
            },
            {
              "id": "part-aero",
              "x": 93,
              "y": 28,
              "side": "t",
              "label": "Alerón DRS",
              "num": "06 · Aerodinámica",
              "title": "Alerón Trasero Swan-Neck con Sistema DRS Hidráulico",
              "image": "despiece-aero",
              "story": "El alerón más grande jamás montado en un 911 homologado de calle supera en altura al propio techo del coche. Sus soportes superiores de cuello de cisne dejan libre la cara inferior del ala, donde se crea la zona de baja presión que genera la sustentación negativa. Incluye el primer sistema DRS (Drag Reduction System) de Porsche: con solo pulsar un botón en el volante, el plano superior se aplana para reducir la resistencia al avance en rectas.",
              "technical": [
                [
                  "Construcción",
                  "Plano principal y flap superior de fibra de carbono, con soportes de cuello de cisne"
                ],
                [
                  "Mecanismo DRS",
                  "Accionamiento hidráulico: el flap superior se aplana con un botón del volante"
                ],
                [
                  "Aerofreno",
                  "En frenadas fuertes, alerón y flaps delanteros pasan a máxima incidencia y frenan con el aire"
                ],
                [
                  "Carga aerodinámica total",
                  "860 kg a 285 km/h (409 kg a 200 km/h): el doble que el 991.2 GT3 RS y el triple que el 992 GT3"
                ]
              ]
            }
          ]
        },
        {
          "type": "facts-counters",
          "id": "cifras",
          "kicker": "Ficha técnica",
          "title": "Cifras de Weissach",
          "specs": [
            "power",
            "torque",
            "acceleration",
            "downforce",
            "weight",
            "nurburgring"
          ]
        }
      ],
      "exitLine": "Weissach Package y aerodinámica de la Nordschleife",
      "meta": {
        "title": "Porsche 911 GT3 RS (992) · Sala 05 · Museo digital del automóvil",
        "description": "Sala 05 del museo digital del automóvil: el Porsche 911 GT3 RS (992) con Weissach Package. Motor bóxer atmosférico de 9.000 rpm, PDK, PTV Plus, suspensión de dobles trapecios, frenos PCCB y alerón con DRS en despiece interactivo."
      },
      "specs": {
        "engine": {
          "label": "Motor",
          "value": "Bóxer 6 cil. atmosférico 4.0L",
          "note": "MA275 · 3.996 cc"
        },
        "power": {
          "label": "Potencia",
          "value": 525,
          "unit": "CV",
          "note": "a 8.500 rpm"
        },
        "torque": {
          "label": "Par motor",
          "value": 465,
          "unit": "Nm",
          "note": "a 6.300 rpm"
        },
        "weight": {
          "label": "Peso",
          "value": 1450,
          "unit": "kg",
          "note": "DIN · Paquete Weissach"
        },
        "downforce": {
          "label": "Carga aerodinámica",
          "value": 860,
          "unit": "kg",
          "note": "a 285 km/h (409 kg a 200 km/h)"
        },
        "transmission": {
          "label": "Caja de cambios",
          "value": "PDK 7 velocidades",
          "note": "grupo final acortado"
        },
        "drivetrain": {
          "label": "Tracción",
          "value": "Trasera",
          "note": "diferencial electrónico PTV Plus"
        },
        "nurburgring": {
          "label": "Nordschleife",
          "value": "6:49,3",
          "unit": "min",
          "note": "6:49.328 en 20,8 km"
        },
        "acceleration": {
          "label": "0 – 100 km/h",
          "value": 3.2,
          "unit": "s",
          "decimals": 1
        }
      }
    }
  ]
};
