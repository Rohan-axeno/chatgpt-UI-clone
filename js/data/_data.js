const chatHistory = [
  {
    id: "chat-1",
    title: "CareSafe RAG Architecture",
    group: "Today",
    messages: [
      {
        role: "user",
        content: "How should I structure the backend to connect my Next.js healthcare app to a Python RAG service?"
      },
      {
        role: "assistant",
        content: "For your CareSafe project, a microservices architecture is highly effective. You can expose a REST API using FastAPI in Python. Your Node.js backend can then make HTTP POST requests to this service securely.",
        code: {
          language: "python",
          snippet: `from fastapi import FastAPI\nfrom pydantic import BaseModel\n\napp = FastAPI()\n\nclass Query(BaseModel):\n    prompt: str\n\n@app.post('/api/rag')\ndef query_rag(req: Query):\n    # Simulate RAG retrieval\n    return {'response': f'RAG output for: {req.prompt}'}`
        }
      }
    ]
  },
  {
    id: "chat-2",
    title: "Collaborative Kanban Board",
    group: "Today",
    messages: [
      {
        role: "user",
        content: "What is the most efficient way to handle real-time digital whiteboard updates across multiple clients?"
      },
      {
        role: "assistant",
        content: "For a real-time collaborative Kanban board, integrating WebSockets via Socket.io with your MERN stack is the industry standard. It allows bidirectional communication so when one user moves a card, the server broadcasts that event to all connected clients instantly."
      }
    ]
  },
  {
    id: "chat-3",
    title: "FedProx Optimization Overview",
    group: "Yesterday",
    messages: [
      {
        role: "user",
        content: "Can you give me a descriptive overview of the FedProx optimization framework for my decentralized machine learning app?"
      },
      {
        role: "assistant",
        content: "FedProx is an excellent choice for federated learning environments. It addresses systems heterogeneity by allowing variable amounts of work to be performed locally across devices. It adds a proximal term to the objective function, which safely limits the impact of local updates from straggling devices before aggregating them on the central server.",
        table: {
          headers: ["Feature", "FedAvg", "FedProx"],
          rows: [
            ["Heterogeneity Support", "Limited", "Strong"],
            ["Proximal Term", "No", "Yes"],
            ["Convergence", "Unstable", "Stable"],
            ["Stragglers Handling", "Poor", "Good"]
          ]
        }
      }
    ]
  },
  {
    id: "chat-4",
    title: "Jaro Education Interview Prep",
    group: "Yesterday",
    messages: [
      {
        role: "user",
        content: "I have an interview tomorrow. What are some common HR and technical introductory questions I should prepare for?"
      },
      {
        role: "assistant",
        content: "Here are a few strong questions to prepare for your Jaro Education interview:",
        list: [
          "Why are you passionate about building software for the EdTech space?",
          "Can you walk me through your final year major project and the hardest technical challenge you overcame?",
          "How do you handle tight deadlines in an agile development cycle?",
          "Describe a time you collaborated with a team to solve a complex problem.",
          "What do you know about Jaro Education's mission and products?"
        ]
      }
    ]
  },
  {
    id: "chat-5",
    title: "Fashion Recommendation ML",
    group: "Older",
    messages: [
      {
        role: "user",
        content: "What specific data cleaning processes should I highlight for my e-commerce fashion recommendation presentation?"
      },
      {
        role: "assistant",
        content: "For your B.Tech major project presentation, I recommend highlighting these crucial data cleaning steps:",
        list: [
          "Handling missing product attributes via strategic imputation.",
          "Normalizing text descriptions to improve tokenization accuracy.",
          "Removing outlier purchase data to prevent skewed algorithm recommendations."
        ]
      }
    ]
  },
  {
    id: "chat-6",
    title: "Git Remote Troubleshooting",
    group: "Older",
    messages: [
      {
        role: "user",
        content: "I am having trouble managing my remotes across multiple local directories. How do I add an origin and push my repository to GitHub correctly?"
      },
      {
        role: "assistant",
        content: "You can verify your current remote connections using `git remote -v`. To add a fresh origin and push your main branch, use the following terminal commands:",
        code: {
          language: "bash",
          snippet: `git remote add origin https://github.com/your-username/your-repo.git\ngit branch -M main\ngit push -u origin main`
        }
      }
    ]
  },
  {
    id: "chat-7",
    title: "React vs Vue Performance",
    group: "Older",
    messages: [
      {
        role: "user",
        content: "Compare React and Vue.js in terms of performance, ecosystem, and learning curve."
      },
      {
        role: "assistant",
        content: "Here's a comparison of React and Vue.js across key dimensions:",
        table: {
          headers: ["Aspect", "React", "Vue.js"],
          rows: [
            ["Learning Curve", "Moderate", "Gentle"],
            ["Performance", "Virtual DOM, fast", "Virtual DOM, slightly faster"],
            ["Ecosystem", "Massive", "Growing"],
            ["State Management", "Redux/Zustand", "Pinia/Vuex"],
            ["Mobile", "React Native", "NativeScript"]
          ]
        }
      }
    ]
  },
  {
    id: "chat-8",
    title: "CSS Grid Layout Guide",
    group: "Today",
    messages: [
      {
        role: "user",
        content: "Show me how to create a responsive dashboard layout using CSS Grid."
      },
      {
        role: "assistant",
        content: "Here is an example of structuring responsive breakpoints using mobile-first SCSS media queries:\n\nSo **mobile is the base design**, and larger screens progressively enhance it. This avoids the messy \"desktop CSS first → override everything for mobile\" approach you were concerned about earlier.",
        code: {
          language: "SCSS",
          snippet: `@media (min-width: 768px) {\n  .hero {\n    padding: 60px 40px;\n  }\n}\n\n/* Desktop */\n@media (min-width: 1024px) {\n  .hero {\n    padding: 80px 60px;\n  }\n}`
        }
      }
    ]
  }
];

const mockResponses = {
  general: "That's a great question! As a simulated frontend environment, I can render these chat bubbles flawlessly, but I am currently not connected to a live language model API. This response is a static mock demonstrating the UI interaction flow.",
  
  code: {
    text: "Here is an example of structuring responsive breakpoints using mobile-first SCSS media queries:\n\nSo **mobile is the base design**, and larger screens progressively enhance it. This avoids the messy \"desktop CSS first → override everything for mobile\" approach you were concerned about earlier.",
    language: "SCSS",
    snippet: `@media (min-width: 768px) {\n  .hero {\n    padding: 60px 40px;\n  }\n}\n\n/* Desktop */\n@media (min-width: 1024px) {\n  .hero {\n    padding: 80px 60px;\n  }\n}`
  },

  creative: "I'd love to help with that! Here are some creative ideas:\n\n• Start with a bold color palette that reflects your brand identity\n• Use asymmetric layouts to create visual interest\n• Incorporate micro-interactions for a premium feel\n• Consider dark mode as the default for a modern aesthetic",

  list: {
    text: "Here are some best practices to keep in mind:",
    items: [
      "Write clean, well-documented code with meaningful variable names.",
      "Follow the DRY principle — Don't Repeat Yourself.",
      "Use version control (Git) from day one of any project.",
      "Test your code thoroughly before deploying to production.",
      "Prioritize accessibility to make your app usable by everyone."
    ]
  },

  table: {
    text: "Here's a quick comparison to help you decide:",
    data: {
      headers: ["Feature", "Option A", "Option B"],
      rows: [
        ["Speed", "Fast", "Moderate"],
        ["Ease of Use", "Moderate", "Easy"],
        ["Community", "Large", "Growing"],
        ["Cost", "Free", "Freemium"]
      ]
    }
  }
};

const alternateResponses = {
  general: "Let me think about that differently. While this is a frontend-only simulation, the architecture demonstrates modern chat UI patterns including real-time message rendering, dynamic state management, and responsive layout behavior — all built with vanilla JavaScript.",

  code: {
    text: "Here's an alternative approach using Express.js, which provides more built-in features like routing and middleware:",
    language: "javascript",
    snippet: `const express = require('express');\nconst app = express();\n\napp.use(express.json());\n\napp.get('/api/health', (req, res) => {\n  res.json({ status: 'ok', timestamp: Date.now() });\n});\n\napp.listen(3000, () => {\n  console.log('Express server on port 3000');\n});`
  }
};

const modelData = [
  { id: "gpt-4o", name: "GPT-4o", desc: "Fast and versatile", category: "Fast" },
  { id: "gpt-4", name: "GPT-4", desc: "Balanced performance", category: "Balanced" },
  { id: "o1-preview", name: "o1-preview", desc: "Advanced reasoning", category: "Reasoning" }
];