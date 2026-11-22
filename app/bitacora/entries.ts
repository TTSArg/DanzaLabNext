export type BitacoraMedia =
	| { type: "image"; src: string; alt: string; caption?: string }
	| { type: "video"; src: string; alt: string; caption?: string };

export type BitacoraMediaList =
	| []
	| [BitacoraMedia]
	| [BitacoraMedia, BitacoraMedia]
	| [BitacoraMedia, BitacoraMedia, BitacoraMedia];

export type BitacoraContentBlock =
	| { type: "paragraph"; text: string }
	| { type: "heading"; text: string }
	| { type: "list"; items: string[] }
	| { type: "signature"; text: string };

export type BitacoraEntry = {
	slug: string;
	category: string;
	title: string;
	intro: string;
	content: BitacoraContentBlock[];
	media: BitacoraMediaList;
};

export const bitacoraEntries: BitacoraEntry[] = [
	{
		slug: "tomarse-el-tiempo",
		category: "Notas de clase",
		title: "Tomarse el tiempo",
		intro: "Hoy experimentamos la oportunidad de preguntarnos “¿cómo se siente mi cuerpo físico?”: tomamos tiempo, o mejor, entramos en una actitud de calma, de silencio, de escucha.",
		content: [
			{ type: "paragraph", text: "De allí emergieron sentires, emociones, proyecciones, deseos, por ejemplo, de bailar, disfrutar, relajar." },
			{ type: "paragraph", text: "Al lector: ¿cómo se siente estar acá? ¿Cómo se siente tu cuerpo físico, donde sea que estés ahora? Tomate el tiempo, el respiro... Si te permitiste esa pausa en calma, lo que aflore es bienvenido, como venga, como aparezca." },
			{ type: "paragraph", text: "¿Quién más que la escucha puede guiarnos al descubrimiento de quienes estamos siendo? El gran desafío, pienso, es no apresurarte al análisis, a la interpretación ni a querer darle un sentido. Quedate fielmente en eso que aparece, cualquiera que sea la manera de estar, recibila. Para improvisar, me resulta necesario, prioritario, quedarme en los tonos, las posturas, las respiraciones, las apneas que naturalmente están ocurriendo. Creo que solo allí, en esa demora, empieza el camino de aquello que genuinamente puedas expresar a través de la danza, a través del tango, que es quien nos convoca." },
			{ type: "heading", text: "Acá estoy" },
			{ type: "paragraph", text: "De manera concatenada, por consecuencia de la escucha, aparecés, aparecés en este espacio. Fijate en las texturas, temperaturas, durezas, blanduras, tensiones, nerviosismos y todas aquellas \"sensualidades\"* que te componen hoy, acá, ahora mismo." },
			{ type: "paragraph", text: "Tomar tiempo y espacio, para luego poner en palabras esta experiencia, fue la puerta a través de la cual entramos en la experiencia de danza: este cuerpo, mi cuerpo, siente y está." },
			{ type: "paragraph", text: "* Los Maestros Rodolfo y Gloria Dinzel se refieren a la capacidad perceptiva que se despierta en la práctica del tango danza a través de los sentidos; la sensualidad tiene que ver con los sentidos." },
			{ type: "heading", text: "El Cuerpo" },
			{ type: "paragraph", text: "Recuerdo algunas de las palabras que aparecían: rígido, flexible, disponible, pesada, neutro, blando, relajado, enojado, emocionada, presente. Acá hay una capa más de esta exploración: si te das cuenta, se entremezclan estados físicos, estados anímicos y percepciones más subjetivas como \"estar presente\". Esto me lleva a preguntar: ¿con qué capa de tu cuerpo estás más conectadx hoy? Podés acercarte a una característica de lo físico, a un estado emocional, a un estado mental o a una interpretación de lo que percibís." },
			{ type: "paragraph", text: "Lo anterior deja en evidencia la diversidad de capas en las que se puede explorar el cuerpo. Mi recomendación para bailar tango: buscá siempre tu cuerpo físico, observá los estados de rigidez, blandura, flexibilidad, dureza, pesadez, y localizalos; no todo tu cuerpo tiene las mismas características. Luego permití que tu cuerpo físico entre en diálogo-danza con otro cuerpo a través del abrazo, tal cual estás y con lo que percibís. Presentarte de este modo abre la oportunidad para la transformación de las otras capitas que te componen." },
			{ type: "heading", text: "La sinceridad" },
			{ type: "paragraph", text: "Darte el permiso de tomar tiempo y espacio para estar en constante percepción de tu cuerpo físico es el punto de partida que proponemos. Cuando sientas que estás haciendo siempre lo mismo, cuando sientas que cometiste un \"error\", cuando sientas que no te sale, cuando te abrume lo externo... tomá tiempo y espacio para percibir tu cuerpo físico, respirá y volvé a comenzar." },
			{ type: "paragraph", text: "Sin prisa, la aventura creativa aparece por sí sola y te va a pedir estar completo y completa en todos tus cuerpos, jugando al unísono, sin dejar de sorprenderte. En este estadio del entrenamiento, la improvisación te va abriendo de a poco, a medida que lo permitas, el vacío y el silencio para lo creativo, para lo genuino que hay naturalmente en un cuerpo escuchado." },
			{ type: "signature", text: "Atto" },
		],
		media: [
			{
				type: "image",
				src: "/bitacora/tomarse-el-tiempo-01.jpeg",
				alt: "Participantes y docentes de la clase Me Di Te Tango reunidos para una fotografía.",
				caption: "Clase grupal Me Di Te Tango (Mecánicas, Dinámicas y Técnicas para disfrutar tu tango), en el @estudiodinzel.arg. Docentes @AdrianaBa y @Atto_numpaque.",
			},
		],
	},
	{
		slug: "tango-necesita-ternura",
		category: "Reflexión",
		title: "¿Por qué el tango necesita más ternura?",
		intro: "Con este título pareciera ser que el tango necesita, que al tango le falta algo. Creo, sin embargo, que ocurre al contrario: una vez que logra inspirarnos, nace una necesidad imperiosa de sentirlo cerca, aunque de vez en cuando parece alejarse, silenciarse… un susurro lo trae de vuelta al senti-pensamiento: *“Crecé, crecé, pibe, el tango te espera”*, en palabras del Polaco Goyeneche, también vociferadas entre colegas y danzantes: palabras sentidas, vivas y por siempre vibrantes.",
		content: [
			{ type: "paragraph", text: "Necesitar del tango, sabiendo que me espera de diferentes maneras: ese lugar donde afloran emociones, vivencias, anonimatos, rivalidades, exaltaciones, audacias; todo tan perfectamente humano y vivo." },
			{ type: "paragraph", text: "¿Y la ternura? Qué estado más extraño, ¿acercarme a la milonga con ternura? Me pregunto qué es lo primero que siente este cuerpecito lector. ¿Qué le pasa a esas articulaciones, a esas musculaturas danzantes?" },
			{ type: "paragraph", text: "Terneza, que también significa ternura, me remite más a la carne tierna usada, por ejemplo, en gastronomía. Me resulta palpable, “acuerpizable” en la danza: ¿cómo es ablandar las carnes de nuestros cuerpos? ¿Cómo es enternecerlas?" },
			{ type: "paragraph", text: "Ternura, para mí, da un paso más: me gusta pensar que el sufijo “-ura” la familiariza con dulzura y me transporta al terreno de lo sensible, donde la ternura ablanda la carne, el sentir y el pensamiento." },
			{ type: "paragraph", text: "Abracémonos con ternura, con un ablandamiento íntegro." },
			{ type: "paragraph", text: "El tango nos espera también desde acá, desde aquello que se va ablandando, no como un objetivo, más bien como una exploración constante: dejarnos sumergir tiernamente, con curiosidad." },
			{ type: "paragraph", text: "Ternura y curiosidad pueden ser, a mi consideración, un motor para el disfrute. Los límites emergen naturalmente en la exploración de lo genuino. Por eso, explorar en la blandura puede ser un camino alternativo frente a las empinadas luchas de la dureza, de lo hermético que puede significarnos el “deber ser”." },
			{ type: "paragraph", text: "*“Quizás el tango no necesite más ternura, sino que quienes danzamos incluyamos la blandura para escucharlo en sus capas más sentidas.”*" },
			{ type: "signature", text: "**Atto 2026**" },
		],
		media: [
			{
				type: "image",
				src: "/bitacora/contacto-01.jpeg",
				alt: "Dos personas abrazadas en una exploración de contacto cercano.",
				caption: "@lucasmarquesdepaiva y @carolinaotharan",
			},
			{
				type: "image",
				src: "/bitacora/contacto-02.jpeg",
				alt: "Detalle de un abrazo y el contacto de las manos.",
				caption: "@lucasmarquesdepaiva y @carolinaotharan",
			},
			{
				type: "image",
				src: "/bitacora/abrazo-01.jpeg",
				alt: "Dos personas compartiendo un abrazo de pie.",
				caption: "@lucasmarquesdepaiva y @carolinaotharan",
			},
		],
	},
	{
		slug: "la-anticipacion",
		category: "Notas de clase",
		title: "La anticipación",
		intro: "La anticipación es un tema recurrente en nuestras clases: “siempre me acelero”, “hice un movimiento de más”, “debí escuchar más”, “me equivoqué”. Es muy cotidiano en los estudiantes: la preocupación por no poder seguir de la manera “correcta”, o por que suceda lo que quiero que suceda y, si no sale, entonces “me equivoqué”.",
		content: [
			{ type: "paragraph", text: "Mi pregunta es: si estoy pre-ocupadx, ¿quién se está ocupando de la danza?" },
			{ type: "heading", text: "Dónde está mi cuerpo" },
			{ type: "paragraph", text: "Lo primero que abordamos en estos casos es explorar dónde está mi cuerpo. No solo traerlo a este espacio físico, donde estás leyendo esto o donde estás danzando, sino explorarlo para reconocerlo y permitirle estar cómodo, disfrutando de simplemente estar. Quizás me digan que eso no es tango, y puede ser que no. Pero ¿quién más que un cuerpo cómodo podría ofrecerme la oportunidad de disfrutar una buena tanda? El pensamiento constante de estar acelerado, de estar equivocándome, nos mantiene en una alerta que, en la experiencia de la danza, nos aleja del disfrute." },
			{ type: "heading", text: "Aterrizar" },
			{ type: "paragraph", text: "Una vez que reconocemos esa comodidad que de a poco se va asomando, exploramos cómo es dejarse aterrizar al piso. Parece sencillo, pero podés probarlo ahora mismo: ¿cómo es ponerte de pie y dejar que todo el peso de tu cuerpo caiga realmente sobre las plantas de tus pies? Mi propuesta es relajar parte por parte. Podés empezar por los tobillos, las rodillas, las caderas, y seguir por cada articulación; luego, por las fibras musculares." },
			{ type: "heading", text: "El abrazo como pretexto" },
			{ type: "paragraph", text: "Armá después el abrazo de tango, sin que te atrape todavía lo que “debe pasar en el tango”. Tomalo más bien como un pretexto para percibir cómo es mantenerse en esa comodidad, en ese aterrizaje, mientras los contactos con otro cuerpo nos abren a la exploración en pareja. Por ejemplo, mantenete atentx a:" },
			{ type: "list", items: [
				"el contacto de las manos en la espalda del otrx;",
				"el contacto entre los brazos del abrazo cerrado (fijate que sean los brazos, no los antebrazos);",
				"el contacto entre las manos del abrazo abierto.",
			] },
			{ type: "paragraph", text: "Percibí su temperatura, su tono, sus formas en quietud." },
			{ type: "heading", text: "Micromovimientos y escucha" },
			{ type: "paragraph", text: "Cuando te sientas preparadx, comenzá con micromovimientos, cuidando lo más importante: tu comodidad. Mantenete dentro de tu cuerpo, en tranquilidad, y desde ahí ofrecé la escucha más que la pulsión de moverte; eso viene después. Por ahora se abre un mundo de percepciones, que se manifiesta en la escucha mientras mi peso sigue aterrizando al suelo." },
			{ type: "heading", text: "La música y la danza" },
			{ type: "paragraph", text: "Dejate inundar por la música. Tomate el tiempo de respirarla, de frasearla en la mente y en el cuerpo. Naturalmente se entra en un ritmo presente, porque estamos conectados en cada cuerpo y en cada contacto, dados principalmente por el abrazo." },
			{ type: "paragraph", text: "Lo que sigue requiere la flexibilidad de esta comodidad que, lejos de apagarse, se acentúa a medida que aparece la danza del tango. Cada cuerpo puede probar distintas velocidades y distintas direcciones, siempre que se cuiden los contactos cómodos del abrazo y del aterrizaje." },
			{ type: "heading", text: "Lo que se anticipa" },
			{ type: "paragraph", text: "En esto consiste para mí la exploración de “lo que se anticipa”: quizás una primera capa de complejidades mayores cuando profundizamos en el baile. Abrirse a la posibilidad de complementarnos en movimientos, velocidades y pausas." },
			{ type: "paragraph", text: "Quizás estas exploraciones te abran posibilidades donde se apague la sensación de “error”. Pensá que esta es una danza de la oportunidad: cada movimiento, en el devenir de la improvisación, abre puertas para disfrutar de lo inesperado, de lo auténtico que la pausa y la relajación pueden ofrecernos." },
			{ type: "signature", text: "*Atto, 2026*" },
		],
		media: [
			{
				type: "image",
				src: "/bitacora/anticipacion-01.jpeg",
				alt: "Grupo al terminar una clase de tango en Estudio Dinzel.",
				caption: "Clase Me Di Te Tango (Mecánicas, Dinámicas y Técnicas). Clases de Impro en el @estudiodinzel.arg. Docentes: @Adrianabamazzotta y @atto_numpaque.",
			},
			{
				type: "image",
				src: "/bitacora/anticipacion-02.jpeg",
				alt: "Participantes de una clase de tango en Estudio Dinzel.",
				caption: "Clase Me Di Te Tango (Mecánicas, Dinámicas y Técnicas). Clases de Impro en el @estudiodinzel.arg. Docentes: @Adrianabamazzotta y @atto_numpaque.",
			},
			{
				type: "image",
				src: "/bitacora/anticipacion-03.jpeg",
				alt: "Grupo de una clase de tango en Estudio Dinzel, reunido para una foto.",
				caption: "Clase Me Di Te Tango (Mecánicas, Dinámicas y Técnicas). Clases de Impro en el @estudiodinzel.arg. Docentes: @Adrianabamazzotta y @atto_numpaque.",
			},
		],
	},
	{
		slug: "construir-la-base",
		category: "Notas de clase",
		title: "Construir la base",
		intro: "En esta clase exploramos la construcción de la base: cómo es amasar la planta del pie, aprovechando el peso del cuerpo para masajear cada parte de nuestros pies en su contacto con el suelo. Esta exploración permite acentuar el peso en diferentes zonas; por ejemplo, investigar cómo es elevar el talón sin separar el calzado del piso. Sutil, mínimo, específico. Luego, verificar cómo se acomoda el cuerpo de la manera más eficiente para sostener esa posición: relajar las caderas, relajar el pecho, soltar la lengua y, con ella, los conductos que pasan por el cuello.",
		content: [
			{ type: "paragraph", text: "Este tipo de exploraciones son parte de la preparación para abordar técnicas de danza improvisada, un camino que requiere blandura y tono a la vez. La primera hace evidente la escucha: la percepción de estímulos que provienen de la música, de otros cuerpos, de los apoyos en el suelo. El segundo nos permite ser receptores activos: todo lo externo, al tocar mi percepción, habilita movimientos como respuesta, y así integramos los cuerpos en un diálogo constante de escucha." },
			{ type: "paragraph", text: "Después elegimos un motor de movimiento que, en ese universo de escucha continua, ofrece un punto focal desde el cual aparece un eco-movimiento: un estímulo que nace de lo genuino de mi cuerpo. No se trata de proponer un paso para que el otro haga tal o cual cosa, sino de traer al espacio una pulsión propia, personal, que modifica lo que está ocurriendo y genera nuevas direcciones, pausas, cadencias." },
			{ type: "paragraph", text: "Este es uno de los juegos que proponemos en las experiencias de la improvisación: la danza como oportunidad de diálogo, basada en el mínimo esfuerzo y en el descubrir lo genuino que de mí se ofrece hacia afuera." },
			{ type: "signature", text: "*Atto, 2026*" },
		],
		media: [
			{
				type: "image",
				src: "/bitacora/construir-la-base-01.jpeg",
				alt: "Grupo de una clase de tango en Estudio Dinzel.",
				caption: "Clase Me Di Te Tango (Mecánicas, Dinámicas y Técnicas). Clases de Impro en el @estudiodinzel.arg. Docentes: @Adrianabamazzotta y @atto_numpaque.",
			},
		],
	},
];
