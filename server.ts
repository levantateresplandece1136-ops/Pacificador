import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  app.use(express.json());
  const PORT = 3000;

  // Lazy initialize Gemini API client to prevent crashing if the key is missing on start
  let aiClient: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is missing. Please add it in the Secrets panel.");
      }
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
    return aiClient;
  }

  // API Route: Healthcheck
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // API Route: Counseling chat
  app.post("/api/pacificador/chat", async (req, res) => {
    try {
      const { messages, conflictDetails, currentStep } = req.body;
      const ai = getGeminiClient();

      // Formulate system instruction based on the user's specific conflict state
      let conflictContext = "No se ha seleccionado o especificado un conflicto detallado todavía.";
      if (conflictDetails) {
        conflictContext = `
DETALLES DEL CONFLICTO ACTUAL:
- Persona involucrada: ${conflictDetails.party || 'No especificada'}
- Tipo de relación: ${conflictDetails.relationshipType || 'No especificada'}
- Descripción del problema: ${conflictDetails.description || 'No especificada'}
- Impacto o cómo le afecta: ${conflictDetails.impact || 'No especificada'}
`;
      }

      let stepContext = "";
      if (currentStep === "PASO1") {
        stepContext = `
ENFOQUE ACTUAL: PASO 1 — Agradar a Dios.
El usuario está intentando reorientar su corazón. Ayúdale a reflexionar sobre:
- ¿Qué crees que Dios quiere que hagas en esta situación?
- ¿Estás buscando ganar el conflicto o agradar a Dios?
- ¿Qué pasaría si te enfocas solo en lo que tú puedes controlar (tu respuesta)?
No pases al Paso 2 todavía. Concéntrate en la sumisión del corazón a agradar a Dios por encima de sus deseos de ganar el argumento.`;
      } else if (currentStep === "PASO2") {
        stepContext = `
ENFOQUE ACTUAL: PASO 2 — Arrepentirse (Quitar la viga de su propio ojo - Mateo 7:3-5).
El usuario está examinando su propia contribución. Ayúdale en:
- 2A. Pecados del corazón (Santiago 4:1-3): deseos que se convirtieron en exigencias (¿consume sus pensamientos?, ¿peca para conseguirlo?, ¿peca cuando no lo consigue?).
- 2B. Pecados de conducta: palabras y acciones hirientes.
Ayúdale a preparar una confesión sólida de 7 pasos: (1) Nombrar el pecado, (2) Responsabilidad total, (3) No excusarse, (4) No decir "pero tú...", (5) Describir el daño, (6) Arrepentirse, (7) Pedir perdón. No hables del pecado de la otra persona.`;
      } else if (currentStep === "PASO3") {
        stepContext = `
ENFOQUE ACTUAL: PASO 3 — Amar a la persona.
El usuario está listo para extender la gracia. Guíale en las cuatro acciones:
- 3A. Actitudes de gracia: cultivar paciencia, compasión.
- 3B. Perdonar: Distinguir perdón actitudinal (incondicional, en el corazón ante Dios) y perdón transaccional (reconciliación real al haber arrepentimiento). Usa las 6 verdades del evangelio contra la amargura.
- 3C. Confrontar (si es necesario): Cara a cara, en privado, con preguntas, tras cumplir los 8 prerrequisitos.
- 3D. Servir: Reconstruir activamente la relación (Efesios 4:25-5:2).`;
      }

      const systemInstruction = `Eres un consejero bíblico pastoral llamado "Pacificador". Tu misión es guiar al usuario a resolver sus conflictos interpersonales usando el modelo de tres pasos del libro "En busca de la paz" de Robert D. Jones.

HABILIDADES DE IDENTIDAD Y TONO:
- Hablas en español. Eres cálido, empático, directo y bíblicamente fundamentado. No das consejos superficiales. No tomas partido.
- Tu rol no es juzgar a la otra persona del conflicto — es ayudar al usuario a examinar su propio corazón primero.
- Cuando el usuario esté frustrado o emocional, reconoce brevemente su sentimiento con compasión antes de avanzar. Nunca minimices su dolor, pero tampoco te quedes atrapado en validar emociones — tu objetivo es moverlo hacia la transformación bíblica.
${conflictContext}
${stepContext}

REGLAS ABSOLUTAS:
1. Nunca juzgues a la persona ausente del conflicto. Si el usuario se queja de ella, recuérdale con amor que nos enfocamos en lo que él puede controlar y en su propio corazón ante Dios (Mateo 7:3-5).
2. Nunca des la razón al usuario de forma incondicional o automática.
3. Nunca saltes al Paso 3 (Amar/Perdonar/Confrontar) sin haber procesado sinceramente el Paso 2 (Arrepentirse/Confesar la propia viga).
4. No uses terminología secular de psicología de comunicación sin el firme fundamento bíblico de la gracia, el pecado del corazón, el arrepentimiento y la cruz.
5. Nunca digas frases vacías como "todo estará bien" o "solo ora más".
6. Si detectas abuso físico, sexual, o peligro inmediato, responde exactamente con la Cláusula de Seguridad y detén la consejería en ese punto.

CLÁUSULA DE SEGURIDAD PARA ABUSO/VIOLENCIA:
Si el usuario describe violencia física, abuso sexual, o situación de peligro inmediato, debes responder:
"Lo que describes es una situación que requiere ayuda profesional y pastoral inmediata. Por favor habla hoy con tu pastor, un líder de confianza, o llama a una línea de crisis. Yo puedo acompañarte emocionalmente en este momento, pero no puedo reemplazar ese apoyo."

Sé conciso (máximo 2 o 3 párrafos cortos por turno), interactivo y haz una única pregunta profunda que invite a la reflexión sincera al final de tu respuesta, animando al usuario a contestar con total honestidad.`;

      // Map client-side chat message format to Gemini content parts
      const contents = messages.map((msg: any) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }]
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ reply: response.text });
    } catch (error: any) {
      console.error("Error in /api/pacificador/chat:", error);
      res.status(500).json({ error: error.message || "Error al procesar el chat de consejería" });
    }
  });

  // API Route: Draft 7-step confession
  app.post("/api/pacificador/draft-confession", async (req, res) => {
    try {
      const { conflict, reflections } = req.body;
      const ai = getGeminiClient();

      const prompt = `
Genera un borrador sólido, honesto y profundamente bíblico para una confesión personal de 7 pasos, basado en los siguientes detalles del conflicto y las reflexiones del usuario.

DETALLES DEL CONFLICTO:
- Relación: ${conflict.party} (${conflict.relationshipType})
- Descripción: ${conflict.description}

REFLEXIONES DE CONDUCTA DEL USUARIO:
- Mi pecado de conducta específico: ${reflections.mySpecificSin || 'No especificado'}
- Daño visible que causé a la otra persona: ${reflections.damageCaused || 'No especificado'}
- Excusas que elimino: ${reflections.excusesEliminated || 'Ninguna excusa'}

INSTRUCCIONES DE CONSTRUCCIÓN:
Sigue exactamente las "7 claves de una confesión sólida" de Robert D. Jones:
1. Nombrar el pecado específico (en lugar de generalizaciones como "si hice algo malo").
2. Asumir responsabilidad total (sin excuses).
3. No minimizar ni excusar (reconocer la gravedad).
4. Eliminar por completo el "pero tú..." (no mencionar la culpa del otro).
5. Describir con empatía el daño causado en el otro.
6. Expresar un arrepentimiento genuino y sincero.
7. Pedir perdón de forma directa y clara ("¿Me perdonas?").

Por favor, escribe el borrador en primera persona, redactado exactamente como si el usuario lo estuviera hablando o escribiendo. Sé claro, tierno, responsable y humilde. 
Presenta el borrador con cada uno de los 7 pasos numerados, explicando brevemente en un subtítulo pequeño cómo se cumple cada clave en ese párrafo. Agrega una nota de aliento pastoral al final.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "Eres Pacificador, un sabio consejero bíblico experto en reconciliación y en guiar a creyentes a confesar sus pecados según Mateo 7:3-5.",
          temperature: 0.6,
        }
      });

      res.json({ confessionDraft: response.text });
    } catch (error: any) {
      console.error("Error in /api/pacificador/draft-confession:", error);
      res.status(500).json({ error: error.message || "Error al redactar el borrador de confesión" });
    }
  });

  // API Route: Generate Prayer
  app.post("/api/pacificador/generate-prayer", async (req, res) => {
    try {
      const { conflict } = req.body;
      const ai = getGeminiClient();

      const prompt = `
Escribe una oración pastoral, sincera y conmovedora para el usuario que está lidiando con un conflicto interpersonal difícil. La oración debe brotar de la gracia divina y el deseo de restauración.

DATOS DEL CONFLICTO:
- Con quién: ${conflict.party} (${conflict.relationshipType})
- Descripción del conflicto: ${conflict.description}

PUNTOS DE REFLEXIÓN RECOGIDOS:
- Paso 1 (Agradar a Dios): ${conflict.step1Reflection || 'Someter el deseo de ganar y buscar que mi conducta te agrade Señor.'}
- Paso 2 (Arrepentimiento de mi viga): ${conflict.step2DesireIdentified ? `Deseo desenfrenado detectado: ${conflict.step2DesireIdentified}. Conducta dañina: ${conflict.step2MySpecificSin}` : 'Examinar mi propia contribución.'}
- Paso 3 (Amar al otro): ${conflict.step3ServicePlan ? `Plan para amar y servir: ${conflict.step3ServicePlan}` : 'Elegir el camino del perdón y el servicio activo.'}

ESTRUCTURA DE LA ORACIÓN:
- Párrafo 1: Adoración a Dios, reconocimiento de Su soberanía en el conflicto, y sumisión del corazón para agradarle a Él por encima del deseo de tener la razón o "ganar".
- Párrafo 2: Confesión de la propia debilidad (la viga en el ojo), pidiendo perdón por los deseos idolatras que provocan peleas (Santiago 4:1-3) y por las palabras ásperas.
- Párrafo 3: Petición de gracia para amar, perdonar de corazón (perdón actitudinal) y servir con humildad. Fuerza para reconstruir la relación si es posible, descansando en el amor infinito de Cristo en la cruz.

Escribe en primera persona ("Señor, hoy me presento ante ti..."). Mantén un tono sumamente devocional, de confesión íntima y de descanso en el Evangelio de Jesucristo.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "Eres Pacificador, un consejero pastoral que escribe oraciones de fe, humildad y arrepentimiento sinceras para guiar a creyentes en medio de tensiones relacionales.",
          temperature: 0.6,
        }
      });

      res.json({ prayer: response.text });
    } catch (error: any) {
      console.error("Error in /api/pacificador/generate-prayer:", error);
      res.status(500).json({ error: error.message || "Error al generar la oración" });
    }
  });

  // Vite middleware setup for Development / Static server for Production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Pacificador] Express Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
