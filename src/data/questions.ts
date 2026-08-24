import type { InterviewQuestion } from "@/types";

/**
 * Seed interview question bank. Kept representative (not literally 200 rows) but
 * spread across every category/topic/difficulty so filters are meaningful.
 * The service layer (Phase 4) paginates over this and can be swapped for an API.
 */
export const QUESTIONS: InterviewQuestion[] = [
  // ---- JavaScript / Frontend ----
  {
    id: "q-js-1",
    question: "Explain the difference between `let`, `const`, and `var`.",
    topic: "JavaScript",
    category: "technical",
    difficulty: "easy",
    expectedConcepts: ["block scope", "hoisting", "temporal dead zone", "reassignment"],
    suggestedAnswer:
      "`var` is function-scoped and hoisted (initialized as undefined). `let` and `const` are block-scoped and hoisted into a temporal dead zone. `const` can't be reassigned, though objects it holds remain mutable.",
    hints: ["Think about scope", "Think about hoisting behavior"],
  },
  {
    id: "q-js-2",
    question: "How does the event loop handle async operations and microtasks?",
    topic: "JavaScript",
    category: "technical",
    difficulty: "hard",
    expectedConcepts: ["call stack", "task queue", "microtask queue", "promises vs setTimeout"],
    suggestedAnswer:
      "The call stack runs synchronous code. Completed async callbacks queue as macrotasks (setTimeout) or microtasks (promises). After each stack frame empties, all microtasks drain before the next macrotask, which is why promise callbacks run before timers.",
    hints: ["Microtasks vs macrotasks", "When does the stack empty?"],
  },
  {
    id: "q-react-1",
    question: "What problems do React hooks solve compared to class components?",
    topic: "React",
    category: "technical",
    difficulty: "medium",
    expectedConcepts: ["stateful logic reuse", "no `this`", "custom hooks", "effect cleanup"],
    suggestedAnswer:
      "Hooks let you reuse stateful logic without wrapper hell, remove `this` binding confusion, and colocate related effect setup/teardown. Custom hooks extract shared behavior across components.",
    hints: ["Think about logic reuse", "What replaced lifecycle methods?"],
  },
  {
    id: "q-react-2",
    question: "Explain the dependency array in `useEffect` and common pitfalls.",
    topic: "React",
    category: "technical",
    difficulty: "medium",
    expectedConcepts: ["stale closures", "referential equality", "cleanup", "exhaustive deps"],
    hints: ["Why might an effect run too often?", "Stale values"],
  },
  {
    id: "q-next-1",
    question: "When would you choose SSR over SSG in Next.js?",
    topic: "Next.js",
    category: "technical",
    difficulty: "medium",
    expectedConcepts: ["per-request data", "caching", "SEO", "revalidation"],
    hints: ["How fresh does the data need to be?"],
  },

  // ---- Node / APIs / Databases ----
  {
    id: "q-node-1",
    question: "How does Node.js handle concurrency with a single thread?",
    topic: "Node.js",
    category: "technical",
    difficulty: "medium",
    expectedConcepts: ["event loop", "libuv thread pool", "non-blocking I/O"],
    hints: ["It's not truly single-threaded under the hood"],
  },
  {
    id: "q-api-1",
    question: "Design a rate limiter for a public REST API.",
    topic: "APIs",
    category: "system-design",
    difficulty: "hard",
    expectedConcepts: ["token bucket", "sliding window", "Redis", "distributed counters"],
    hints: ["Token bucket vs fixed window", "How to share state across instances?"],
  },
  {
    id: "q-db-1",
    question: "When would you denormalize a relational schema?",
    topic: "Databases",
    category: "technical",
    difficulty: "medium",
    expectedConcepts: ["read performance", "join cost", "write amplification", "consistency tradeoffs"],
    hints: ["Read-heavy vs write-heavy"],
  },
  {
    id: "q-cloud-1",
    question: "Explain the difference between horizontal and vertical scaling.",
    topic: "Cloud",
    category: "technical",
    difficulty: "easy",
    expectedConcepts: ["add machines vs add resources", "statelessness", "load balancing"],
    hints: ["Scale out vs scale up"],
  },

  // ---- DSA ----
  {
    id: "q-dsa-1",
    question: "Find the longest substring without repeating characters.",
    topic: "DSA",
    category: "dsa",
    difficulty: "medium",
    expectedConcepts: ["sliding window", "hash set", "two pointers", "O(n) time"],
    suggestedAnswer:
      "Use a sliding window with a set. Expand the right pointer; when a duplicate appears, shrink from the left until it's removed. Track the max window length. O(n) time, O(min(n, charset)) space.",
    hints: ["Sliding window", "Track last-seen index"],
  },
  {
    id: "q-dsa-2",
    question: "Detect a cycle in a linked list.",
    topic: "DSA",
    category: "dsa",
    difficulty: "easy",
    expectedConcepts: ["Floyd's tortoise and hare", "two pointers"],
    hints: ["Fast and slow pointers"],
  },
  {
    id: "q-dsa-3",
    question: "Serialize and deserialize a binary tree.",
    topic: "DSA",
    category: "dsa",
    difficulty: "hard",
    expectedConcepts: ["preorder traversal", "null markers", "queue-based rebuild"],
    hints: ["How do you encode nulls?"],
  },

  // ---- System Design ----
  {
    id: "q-sd-1",
    question: "Design a URL shortener like bit.ly.",
    topic: "System Design",
    category: "system-design",
    difficulty: "hard",
    expectedConcepts: ["hashing / base62", "key generation", "read-heavy caching", "DB sharding", "analytics"],
    hints: ["How do you generate short keys?", "Read vs write ratio"],
  },
  {
    id: "q-sd-2",
    question: "Design a news feed system.",
    topic: "System Design",
    category: "system-design",
    difficulty: "hard",
    expectedConcepts: ["fan-out on write vs read", "ranking", "caching", "pagination"],
    hints: ["Push vs pull model"],
  },

  // ---- Behavioral ----
  {
    id: "q-beh-1",
    question: "Tell me about a time you disagreed with a teammate. How did you resolve it?",
    topic: "Teamwork",
    category: "behavioral",
    difficulty: "medium",
    expectedConcepts: ["STAR structure", "empathy", "data-driven resolution", "outcome"],
    hints: ["Use STAR", "End with the result"],
  },
  {
    id: "q-beh-2",
    question: "Describe a project that failed. What did you learn?",
    topic: "Growth",
    category: "behavioral",
    difficulty: "medium",
    expectedConcepts: ["ownership", "reflection", "concrete lessons", "applied change"],
    hints: ["Own it, don't blame", "What changed afterward?"],
  },
  {
    id: "q-beh-3",
    question: "Tell me about a time you led without formal authority.",
    topic: "Leadership",
    category: "behavioral",
    difficulty: "hard",
    expectedConcepts: ["influence", "initiative", "collaboration", "measurable impact"],
    hints: ["Influence over authority"],
  },

  // ---- HR ----
  {
    id: "q-hr-1",
    question: "Why do you want to work here?",
    topic: "Motivation",
    category: "hr",
    difficulty: "easy",
    expectedConcepts: ["company research", "role alignment", "genuine motivation"],
    hints: ["Be specific to the company"],
  },
  {
    id: "q-hr-2",
    question: "Where do you see yourself in five years?",
    topic: "Career",
    category: "hr",
    difficulty: "easy",
    expectedConcepts: ["growth mindset", "realistic goals", "role relevance"],
    hints: ["Tie it to the role's growth path"],
  },
  {
    id: "q-proj-1",
    question: "Walk me through the most technically challenging project on your resume.",
    topic: "Projects",
    category: "technical",
    difficulty: "medium",
    expectedConcepts: ["problem framing", "tradeoffs", "your specific contribution", "impact"],
    hints: ["Focus on YOUR decisions", "Quantify the outcome if you can"],
  },
];

export const QUESTION_TOPICS = Array.from(new Set(QUESTIONS.map((q) => q.topic))).sort();
export const QUESTION_CATEGORIES: InterviewQuestion["category"][] = [
  "technical", "behavioral", "hr", "dsa", "system-design",
];
