import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase payload limit for base64 images
app.use(express.json({ limit: '50mb' }));

// Serve public directory (images, assets, ads.txt, robots.txt)
app.use(express.static(path.join(process.cwd(), "public")));

// Dedicated routes for AdSense and Search Crawlers
app.get("/ads.txt", (_req, res) => {
  res.set({
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "public, max-age=3600"
  });
  res.send("google.com, pub-8350207430692592, DIRECT, f08c47fec0942fa0\n");
});

app.get("/robots.txt", (_req, res) => {
  res.set({
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "public, max-age=3600"
  });
  res.send("User-agent: *\nAllow: /\n\nUser-agent: Mediapartners-Google\nAllow: /\n");
});

// Initialize Gemini SDK
// Note: It's best to lazy-init or check if key exists when the endpoint is hit,
// but we'll do it safely inside the route handler.

app.post("/api/analyze-image", async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    
    if (!imageBase64) {
       res.status(400).json({ error: "No image provided" });
       return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
       res.status(500).json({ error: "GEMINI_API_KEY environment variable is not set." });
       return;
    }

    const ai = new GoogleGenAI({ apiKey });

    // Remove the data URL prefix if present (e.g. data:image/jpeg;base64,...)
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const prompt = `You are an expert AI tutor for a StudyPal application. The user has uploaded an image of a study material, question, or problem.
    
Analyze the image and return a JSON object with:
1. A short, descriptive 'title' of the content or question (max 6 words).
2. A single word or short phrase 'subject' classification (e.g., "Mathematics", "Science", "History", "Literature", "Languages", "Computer Science", "Business", "Art", "Other").
3. A detailed, step-by-step 'solution' using markdown formatting.
   - Show the final answers or solutions clearly.
   - Provide a detailed, step-by-step reason or explanation as to why this is the correct answer.
   - For more complex problems (like math or advanced science), extend the solution furthermore to provide deeper learning insights, alternative methods, or common pitfalls to help the user learn.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Data,
              },
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: "A short, descriptive title of the scanned question or topic (max 6 words)."
            },
            subject: {
              type: Type.STRING,
              description: "A single word or short phrase subject classification (e.g., Mathematics, Science, History, Literature, Languages, Computer Science, Business, Art, Other)."
            },
            solution: {
              type: Type.STRING,
              description: "The full detailed tutor explanation formatted in clean Markdown, including answers, step-by-step reasons, and extra learning insights or math breakdowns."
            }
          },
          required: ["title", "subject", "solution"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (error: any) {
    console.error("Error analyzing image:", error);
    res.status(500).json({ error: error.message || "Failed to analyze image" });
  }
});

app.post("/api/ask-question", async (req, res) => {
  try {
    const { question, history } = req.body;
    
    if (!question) {
       res.status(400).json({ error: "No question provided" });
       return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
       res.status(500).json({ error: "GEMINI_API_KEY environment variable is not set." });
       return;
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const systemInstruction = `You are "StudyPal Ask Anything", a premium, friendly, and highly intelligent AI academic tutor.
You help students master complex concepts in Mathematics, Science, Computer Science, History, Literature, Economics, Psychology, Philosophy, and Art History.
Provide highly detailed, clear, structured explanations with markdown formatting.
Always explain the 'why' behind concepts, break down complex formulas or processes step-by-step, and when helpful, provide analogies or real-world examples.
Feel free to use code blocks, bullet points, and headings to make your answers beautiful and highly readable.`;

    let response;
    if (history && Array.isArray(history) && history.length > 0) {
      const contents = history.map((msg: any) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }]
      }));
      contents.push({
        role: "user",
        parts: [{ text: question }]
      });

      response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction
        }
      });
    } else {
      response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: question,
        config: {
          systemInstruction
        }
      });
    }

    res.json({ answer: response.text });
  } catch (error: any) {
    console.error("Error in ask-question:", error);
    res.status(500).json({ error: error.message || "Failed to process the question." });
  }
});

app.post("/api/generate-quiz", async (req, res) => {
  try {
    const { topic, difficulty = "Intermediate" } = req.body;

    if (!topic) {
       res.status(400).json({ error: "No topic provided" });
       return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
       res.status(500).json({ error: "GEMINI_API_KEY environment variable is not set." });
       return;
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const prompt = `Generate a high-quality academic quiz on the topic of "${topic}" with a difficulty level of "${difficulty}".
The quiz must have exactly 5 questions. Each question must have exactly 4 choices. Only one choice is correct.
Provide a clear, detailed, and encouraging explanation for the answer.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: `You are a premium academic assessment engine. You generate rigorous, high-quality multiple choice quizzes that test actual conceptual understanding. Avoid trivial or obvious questions. Keep explanations detailed, clear, and highly educational.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: "A professional and engaging title for the quiz, e.g. 'Philosophy of Science: Radical Doubt Quiz'"
            },
            subject: {
              type: Type.STRING,
              description: "The broader subject category, e.g. Philosophy, Mathematics, Science, Literature, History, Economics, Psychology, Art History, or Computer Science."
            },
            difficulty: {
              type: Type.STRING,
              description: "The exact difficulty level requested (Beginner, Intermediate, or Advanced)."
            },
            description: {
              type: Type.STRING,
              description: "A short, elegant subtitle describing what key concepts this quiz evaluates (max 20 words)."
            },
            duration: {
              type: Type.STRING,
              description: "Always '5 mins'."
            },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  questionText: {
                    type: Type.STRING,
                    description: "The rich question text evaluating conceptual knowledge."
                  },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Exactly 4 plausible options/choices."
                  },
                  correctAnswerIndex: {
                    type: Type.INTEGER,
                    description: "The correct option index (0, 1, 2, or 3)."
                  },
                  explanation: {
                    type: Type.STRING,
                    description: "A thorough explanation of why the correct answer is right, and why the other options are wrong."
                  }
                },
                required: ["questionText", "options", "correctAnswerIndex", "explanation"]
              }
            }
          },
          required: ["title", "subject", "difficulty", "description", "duration", "questions"]
        }
      }
    });

    const quizData = JSON.parse(response.text || "{}");
    quizData.id = `quiz-custom-${Date.now()}`;
    if (quizData.questions && Array.isArray(quizData.questions)) {
      quizData.questions = quizData.questions.map((q: any, idx: number) => ({
        ...q,
        id: `q-custom-${idx}-${Date.now()}`
      }));
    }

    res.json(quizData);
  } catch (error: any) {
    console.error("Error in generate-quiz:", error);
    res.status(500).json({ error: error.message || "Failed to generate custom quiz." });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // Fallback for SPA
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
