// js/data.js

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
        content: "FedProx is an excellent choice for federated learning environments. It addresses systems heterogeneity by allowing variable amounts of work to be performed locally across devices. It adds a proximal term to the objective function, which safely limits the impact of local updates from straggling devices before aggregating them on the central server." 
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
        content: "Here are a few strong questions to prepare for your Jaro Education interview:\n\n1. Why are you passionate about building software for the EdTech space?\n2. Can you walk me through your final year major project and the hardest technical challenge you overcame?\n3. How do you handle tight deadlines in an agile development cycle?" 
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
        content: "For your B.Tech major project presentation, I recommend highlighting these three crucial data cleaning steps:\n\n• Handling missing product attributes via strategic imputation.\n• Normalizing text descriptions to improve tokenization accuracy.\n• Removing outlier purchase data to prevent skewed algorithm recommendations." 
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
  }
];

// We will keep this default response for whenever you type a brand new prompt in the live UI!
const defaultResponse = {
  general: "That is a great question. As a simulated frontend environment, I can render these chat bubbles flawlessly, but I am currently not connected to a live language model API.",
};