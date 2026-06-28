export interface BibleVerse {
  reference: string;
  text: string;
  category: string;
}

export const BIBLE_VERSES: BibleVerse[] = [
  {
    reference: "Salmo 103:10-12",
    text: "No ha hecho con nosotros conforme a nuestras iniquidades, ni nos ha pagado conforme a nuestros pecados. Porque como la altura de los cielos sobre la tierra, engrandeció su misericordia sobre los que le temen. Cuanto está lejos el oriente del occidente, hizo alejar de nosotros nuestras rebeliones.",
    category: "Amor y Misericordia de Dios"
  },
  {
    reference: "Romanos 8:1",
    text: "Ahora, pues, ninguna condenación hay para los que están en Cristo Jesús, los que no andan conforme a la carne, sino conforme al Espíritu.",
    category: "No Condenación y Paz"
  },
  {
    reference: "Miqueas 7:18-19",
    text: "¿Qué Dios como tú, que perdona la maldad, y olvida el pecado del remanente de su heredad? No retuvo para siempre su enojo, porque se deleita en misericordia. Él volverá a tener misericordia de nosotros; sepultará nuestras iniquidades, y echará en lo profundo del mar todos nuestros pecados.",
    category: "Amor y Misericordia de Dios"
  },
  {
    reference: "Efesios 2:4-5",
    text: "Pero Dios, que es rico en misericordia, por su gran amor con que nos amó, aun estando nosotros muertos en pecados, nos dio vida juntamente con Cristo (por gracia sois salvos).",
    category: "Gracia Salvador"
  },
  {
    reference: "1 Juan 1:9",
    text: "Si confesamos nuestros pecados, él es fiel y justo para perdonar nuestros pecados, y limpiarnos de toda maldad.",
    category: "Perdón y Limpieza"
  },
  {
    reference: "Romanos 5:8",
    text: "Mas Dios muestra su amor para con nosotros, en que siendo aún pecadores, Cristo murió por nosotros.",
    category: "Amor de Dios"
  },
  {
    reference: "Sofonías 3:17",
    text: "Jehová está en medio de ti, poderoso, él salvará; se gozará sobre ti con alegría, callará de amor, se regocijará sobre ti con cánticos.",
    category: "Consuelo de Dios"
  },
  {
    reference: "Isaías 43:25",
    text: "Yo, yo soy el que borro tus rebeliones por amor de mí mismo, y no me acordaré de tus pecados.",
    category: "Perdón Incondicional"
  },
  {
    reference: "Mateo 7:3-5",
    text: "¿Y por qué miras la paja que está en el ojo de tu hermano, y no echas de ver la viga que está en tu propio ojo? ¿O cómo dirás a tu hermano: Déjame sacar la paja de tu ojo, y he aquí la viga en el ojo tuyo? ¡Hipócrita! saca primero la viga de tu propio ojo, y entonces verás bien para sacar la paja del ojo de tu hermano.",
    category: "Paso 2 — Arrepentimiento"
  },
  {
    reference: "Santiago 4:1-2",
    text: "¿De dónde vienen las guerras y los pleitos entre vosotros? ¿No es de vuestras pasiones, las cuales cambaten en vuestros miembros? Codiciáis, y no tenéis; matáis y ardéis de envidia, y no podéis alcanzar; combatís y lucháis, pero no tenéis lo que deseáis, porque no pedís.",
    category: "Paso 2 — Deseos del Corazón"
  },
  {
    reference: "Mateo 18:15",
    text: "Por tanto, si tu hermano peca contra ti, ve y repréndele estando tú y él solos; si te oyere, has ganado a tu hermano.",
    category: "Paso 3 — Confrontación"
  },
  {
    reference: "Gálatas 6:1",
    text: "Hermanos, si alguno fuere sorprendido en alguna falta, vosotros que sois espirituales, restauradle con espíritu de mansedumbre, considerándote a ti mismo, no sea que tú también seas tentado.",
    category: "Paso 3 — Actitudes"
  },
  {
    reference: "Efesios 4:31-32",
    text: "Quítense de vosotros toda amargura, enojo, ira, gritería y maledicencia, y toda malicia. Antes sed benignos unos con otros, misericordiosos, perdonándoos unos a otros, como Dios también os perdonó a vosotros en Cristo.",
    category: "Paso 3 — Perdón"
  },
  {
    reference: "Proverbios 15:1",
    text: "La blanda respuesta quita la ira; mas la palabra áspera hace subir el furor.",
    category: "Paso 3 — Hablar con gracia"
  }
];

export const MODEL_STEPS_GUIDE = {
  paso1: {
    title: "Paso 1: Agradar a Dios",
    tagline: "Reorienta tu corazón hacia el Señor",
    description: "Antes de tomar cualquier acción o pensar en cómo responderá la otra persona, debes responder con fe y obediencia ante Dios. Tu meta fundamental en este conflicto no debe ser ganar, aliviar tu dolor o convencer al otro; debe ser agradar a tu Salvador.",
    keyQuestions: [
      {
        id: "will",
        label: "¿Qué crees que Dios quiere que hagas específicamente en esta situación?",
        placeholder: "Ej: Responder con mansedumbre, callar en vez de insultar, buscar consejo..."
      },
      {
        id: "win",
        label: "¿Estás buscando ganar el conflicto (tener la razón, desahogarte) o agradar a Dios?",
        placeholder: "Sé honesto/a sobre los motivos profundos de tu corazón..."
      },
      {
        id: "control",
        label: "¿Qué pasaría si te enfocas solo en lo que tú puedes controlar (tus respuestas, tus pensamientos) y dejas el resultado en las manos de Dios?",
        placeholder: "Reflexiona sobre soltar el control de la actitud del otro..."
      }
    ]
  },
  paso2: {
    title: "Paso 2: Arrepentirse primero",
    tagline: "Saca la viga de tu propio ojo",
    description: "Jesús nos ordena examinar nuestro propio pecado antes de mirar la paja del otro. No importa si tu contribución es del 5% y la del otro es del 95%; tú eres 100% responsable de tu 5%.",
    part2A: {
      title: "2A. Los deseos profundos del corazón (Santiago 4:1-3)",
      description: "Los conflictos externos provienen de guerras internas en nuestro corazón. Un deseo bueno (como querer respeto, paz, orden o que te escuchen) se convierte en un ídolo del corazón cuando se transforma en una exigencia absoluta.",
      tests: [
        {
          id: "consume",
          label: "1. ¿Este deseo consume tus pensamientos? (¿Le das vueltas sin parar en tu mente?)",
          placeholder: "Describe la fijación o frustración recurrente que experimentas..."
        },
        {
          id: "sinToGet",
          label: "2. ¿Pecas para conseguirlo? (¿Manipulas, presionas, gritas, usas la ley del hielo?)",
          placeholder: "Identifica si has actuado mal con tal de lograr tu objetivo..."
        },
        {
          id: "sinWhenFail",
          label: "3. ¿Pecas cuando no lo consigues? (¿Te enojas, te amargas, te desquitas, te alejas?)",
          placeholder: "Describe tu reacción inmediata de amargura o enojo al no obtenerlo..."
        }
      ]
    },
    part2B: {
      title: "2B. Confesión Sólida de Conducta",
      description: "Robert D. Jones describe las 7 claves para redactar o decir una confesión de pecados sincera y restauradora sin excusas.",
      keys: [
        "1. Nombrar el pecado de conducta de forma muy específica (ej: grité, mentí, guardé rencor).",
        "2. Asumir total responsabilidad (sin culpar a las circunstancias o al estrés).",
        "3. No minimizar la ofensa (no decir 'no fue para tanto' o 'fue un desliz').",
        "4. Eliminar por completo el 'pero tú...' (no mezclar los errores de la otra persona).",
        "5. Describir detalladamente el daño causado (reconocer cómo le dolió o afectó al otro).",
        "6. Expresar un arrepentimiento genuino que honre a Cristo.",
        "7. Pedir perdón directamente con la pregunta: '¿Me perdonas?'"
      ]
    }
  },
  paso3: {
    title: "Paso 3: Amar a la persona",
    tagline: "Extiende la gracia del Evangelio",
    description: "Una vez que tu corazón está alineado con Dios y has pedido perdón con sinceridad por tu viga, puedes avanzar a amar activamente a quien te ofendió. Amar implica actitudes, perdón, confrontación adecuada y servicio práctico.",
    gospelTruths: [
      {
        title: "1. Dios me perdonó infinitamente más",
        desc: "El perdón que yo debo extender es minúsculo comparado con la inmensa deuda que Dios me perdonó en la cruz."
      },
      {
        title: "2. Dios es el Juez justo",
        desc: "No necesito vengarme ni guardar rencor. Puedo entregar el caso y el juicio a las manos perfectas del Señor."
      },
      {
        title: "3. Cristo sufrió injustamente",
        desc: "Jesús es mi modelo; sufrió insultos sin responder con ira. Él me da el poder para soportar el dolor con gracia."
      },
      {
        title: "4. El ofensor es un esclavo del pecado",
        desc: "Quien peca contra mí es un alma engañada y ciega en ese momento. Merece compasión y oración, no mi desprecio."
      },
      {
        title: "5. Yo soy capaz del mismo pecado",
        desc: "La soberbia me hace sentir superior, pero Gálatas 6:1 me advierte que yo también puedo caer exactamente en lo mismo."
      },
      {
        title: "6. Mi amargura me destruye a mí",
        desc: "Guardar resentimiento es como tomar veneno esperando que el otro muera. La amargura encarcela mi propio corazón."
      }
    ],
    confrontPrereqs: [
      "He confesado honestamente mis propios pecados ante Dios y ante la persona.",
      "Estoy perdonando actitudinalmente de corazón (he soltado el rencor y la venganza).",
      "Mi único objetivo es reconciliar y restaurar la relación, no ganar ni humillar.",
      "Estoy convencido de que confrontar es el acto más amoroso para el bien de su alma.",
      "He cultivado actitudes de gracia (paciencia, bondad, mansedumbre).",
      "Estoy dispuesto a seguir el proceso bíblico paso a paso si es necesario (Mateo 18:15-17).",
      "Busco agradar a Dios más que buscar la aprobación de las personas.",
      "He buscado consejo sabio de pastores o líderes si el caso es complejo."
    ],
    confrontDescription: "Cubre primero la ofensa si es menor. Confronta solo si la ofensa es grave, daña seriamente la relación o afecta a terceros. Hazlo en privado, cara a cara, y usando preguntas humildes en lugar de acusaciones hirientes."
  }
};

export const RELATIONSHIPS = [
  "Cónyuge (Esposo/a)",
  "Hijo/a",
  "Padre / Madre",
  "Hermano/a familiar",
  "Hermano/a de la Iglesia",
  "Jefe / Supervisor",
  "Colega de trabajo",
  "Vecino/a",
  "Amigo/a cercano",
  "Otro"
];
