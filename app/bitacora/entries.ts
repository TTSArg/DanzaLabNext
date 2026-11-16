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
