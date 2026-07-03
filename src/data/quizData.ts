export interface QuizQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  duration: string;
  questions: QuizQuestion[];
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  quizTitle: string;
  subject: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  score: number;
  totalQuestions: number;
  percentage: number;
  timestamp: string; // ISO String
}

export const QUIZZES: Quiz[] = [
  // ================= MATHEMATICS =================
  {
    id: "quiz-math-limits",
    title: "Limits & Continuity Challenge",
    subject: "Mathematics",
    difficulty: "Beginner",
    description: "Test your understanding of basic limits, algebraic evaluations, and continuity criteria.",
    duration: "5 mins",
    questions: [
      {
        id: "ml-q1",
        questionText: "What is the limit of f(x) = (x^2 - 4) / (x - 2) as x approaches 2?",
        options: ["2", "4", "0", "Undefined / Indeterminate"],
        correctAnswerIndex: 1,
        explanation: "Since plugging in x=2 directly yields 0/0, we factor the numerator to (x-2)(x+2) and cancel the (x-2) term. This leaves f(x) = x + 2. Evaluating as x approaches 2 yields 2 + 2 = 4."
      },
      {
        id: "ml-q2",
        questionText: "Which of the following is NOT required for a function f(x) to be continuous at x = c?",
        options: [
          "f(c) must be defined.",
          "The limit of f(x) as x approaches c must exist.",
          "The derivative f'(c) must exist.",
          "The limit of f(x) as x approaches c must equal f(c)."
        ],
        correctAnswerIndex: 2,
        explanation: "Continuity at a point only requires that the function is defined, the limit exists, and the limit equals the function value. Differentiability (f'(c) exists) is a stronger condition and is not required for basic continuity (for example, f(x) = |x| is continuous but not differentiable at x=0)."
      },
      {
        id: "ml-q3",
        questionText: "Evaluate the limit of sin(x) / x as x approaches 0.",
        options: ["0", "1", "Infinity", "Undefined"],
        correctAnswerIndex: 1,
        explanation: "The limit as x approaches 0 of sin(x)/x is a fundamental trigonometric limit equal to 1. This can be proven geometrically using the Squeeze Theorem or algebraically using L'Hôpital's Rule."
      },
      {
        id: "ml-q4",
        questionText: "What type of discontinuity occurs at x = 0 for the function f(x) = 1/x?",
        options: ["Removable Discontinuity", "Jump Discontinuity", "Infinite Discontinuity / Asymptote", "Oscillating Discontinuity"],
        correctAnswerIndex: 2,
        explanation: "The function f(x) = 1/x goes to positive infinity as x approaches 0 from the right, and negative infinity as x approaches 0 from the left. This creates a vertical asymptote, which is an infinite discontinuity."
      },
      {
        id: "ml-q5",
        questionText: "If the limit of f(x) as x approaches c from the left is L1, and from the right is L2, and L1 != L2, what can we say about the general limit?",
        options: [
          "The limit is (L1 + L2) / 2.",
          "The limit does not exist.",
          "The limit is L1.",
          "The limit is L2."
        ],
        correctAnswerIndex: 1,
        explanation: "For a general limit to exist at a point, both the left-hand limit and the right-hand limit must exist and be equal. Since L1 != L2, the general limit does not exist."
      }
    ]
  },
  {
    id: "quiz-math-derivatives",
    title: "Derivatives & Optimization",
    subject: "Mathematics",
    difficulty: "Intermediate",
    description: "Check your knowledge of derivative rules (Power, Chain, Product, Quotient) and finding local extrema.",
    duration: "7 mins",
    questions: [
      {
        id: "md-q1",
        questionText: "What is the derivative of f(x) = 3x^4 - 5x^2 + 7 with respect to x?",
        options: [
          "12x^3 - 10x",
          "12x^3 - 10x + 7",
          "3x^3 - 5x",
          "4x^3 - 2x"
        ],
        correctAnswerIndex: 0,
        explanation: "Using the Power Rule, d/dx(3x^4) = 12x^3, d/dx(-5x^2) = -10x, and d/dx(7) = 0. Combining these gives 12x^3 - 10x."
      },
      {
        id: "md-q2",
        questionText: "Using the Chain Rule, what is the derivative of f(x) = ln(x^2 + 1)?",
        options: [
          "1 / (x^2 + 1)",
          "2x / (x^2 + 1)",
          "2x(x^2 + 1)",
          "1 / (2x)"
        ],
        correctAnswerIndex: 1,
        explanation: "Let u = x^2 + 1. The outer derivative of ln(u) is 1/u, and the inner derivative of x^2 + 1 is 2x. Multiplying them together gives (1 / (x^2 + 1)) * 2x = 2x / (x^2 + 1)."
      },
      {
        id: "md-q3",
        questionText: "What is a critical point of a function f(x)?",
        options: [
          "Any point where f(x) = 0.",
          "Any point where f''(x) = 0.",
          "Any interior point in the domain where f'(x) = 0 or f'(x) is undefined.",
          "A point where the graph crosses the y-axis."
        ],
        correctAnswerIndex: 2,
        explanation: "A critical point is defined as a value c in the domain of f where the first derivative f'(c) is either zero or undefined. These are candidates for local maxima and minima."
      },
      {
        id: "md-q4",
        questionText: "If f'(c) = 0 and f''(c) > 0, what does the Second Derivative Test tell us about the point (c, f(c))?",
        options: [
          "It is a local maximum.",
          "It is a local minimum.",
          "It is an inflection point.",
          "The test is inconclusive."
        ],
        correctAnswerIndex: 1,
        explanation: "If f'(c) = 0 (horizontal tangent line) and f''(c) > 0 (concave up, opening upwards like a bowl), the point must be at the bottom of the bowl, making it a local minimum."
      },
      {
        id: "md-q5",
        questionText: "Find the derivative of f(x) = x * e^x using the Product Rule.",
        options: [
          "e^x",
          "x * e^x",
          "(x + 1) * e^x",
          "e^x + x"
        ],
        correctAnswerIndex: 2,
        explanation: "Product Rule is d/dx(uv) = u'v + uv'. Here u = x (u' = 1) and v = e^x (v' = e^x). So, d/dx(x * e^x) = 1 * e^x + x * e^x = (x + 1)e^x."
      }
    ]
  },
  {
    id: "quiz-math-integration",
    title: "Advanced Integration Techniques",
    subject: "Mathematics",
    difficulty: "Advanced",
    description: "Challenge yourself with integration by substitution, integration by parts, and definite integrals.",
    duration: "10 mins",
    questions: [
      {
        id: "mi-q1",
        questionText: "Evaluate the indefinite integral: ∫ 2x * cos(x^2) dx.",
        options: [
          "sin(x^2) + C",
          "-sin(x^2) + C",
          "x^2 * sin(x^2) + C",
          "2 * sin(x^2) + C"
        ],
        correctAnswerIndex: 0,
        explanation: "Use u-substitution. Let u = x^2, so du = 2x dx. The integral becomes ∫ cos(u) du = sin(u) + C. Substituting back gives sin(x^2) + C."
      },
      {
        id: "mi-q2",
        questionText: "Which formula represents the Integration by Parts technique?",
        options: [
          "∫ u dv = u v + ∫ v du",
          "∫ u dv = u v - ∫ v du",
          "∫ u dv = u'v - u v'",
          "∫ u dv = (u v) / (∫ v du)"
        ],
        correctAnswerIndex: 1,
        explanation: "Integration by parts is derived from the product rule of differentiation and is written as: ∫ u dv = uv - ∫ v du."
      },
      {
        id: "mi-q3",
        questionText: "According to the LIATE rule, what should be chosen as 'u' when integrating ∫ x^3 * ln(x) dx?",
        options: ["x^3", "ln(x)", "3x^2", "1/x"],
        correctAnswerIndex: 1,
        explanation: "LIATE stands for Logarithmic, Inverse trigonometric, Algebraic, Trigonometric, Exponential. Since Logarithmic (ln(x)) comes before Algebraic (x^3), we choose u = ln(x)."
      },
      {
        id: "mi-q4",
        questionText: "Find the area under the curve f(x) = 3x^2 from x = 1 to x = 3.",
        options: ["26", "27", "8", "12"],
        correctAnswerIndex: 0,
        explanation: "The antiderivative of 3x^2 is x^3. According to the Fundamental Theorem of Calculus, we evaluate this at the boundaries: [x^3] from 1 to 3 = 3^3 - 1^3 = 27 - 1 = 26."
      },
      {
        id: "mi-q5",
        questionText: "What is the integral of 1/x with respect to x?",
        options: [
          "ln(x) + C (for x > 0)",
          "ln(|x|) + C",
          "-1/x^2 + C",
          "1 + C"
        ],
        correctAnswerIndex: 1,
        explanation: "The derivative of ln(|x|) is 1/x. Therefore, the general antiderivative of 1/x is ln(|x|) + C, which includes the absolute value to ensure a positive domain for the logarithm."
      }
    ]
  },

  // ================= SCIENCE =================
  {
    id: "quiz-science-atom",
    title: "Atomic Structure & Periodic Table",
    subject: "Science",
    difficulty: "Beginner",
    description: "Review your knowledge of protons, neutrons, isotopes, valence electrons, and trends.",
    duration: "5 mins",
    questions: [
      {
        id: "sa-q1",
        questionText: "An atom has 6 protons, 8 neutrons, and 6 electrons. What is its atomic mass number?",
        options: ["6", "12", "14", "20"],
        correctAnswerIndex: 2,
        explanation: "The atomic mass number is the sum of protons and neutrons in the nucleus. In this case, 6 protons + 8 neutrons = 14. (This is Carbon-14, an isotope of carbon)."
      },
      {
        id: "sa-q2",
        questionText: "Which subatomic particles reside inside the atomic nucleus?",
        options: [
          "Protons and Electrons",
          "Neutrons and Electrons",
          "Protons and Neutrons",
          "Protons, Neutrons, and Electrons"
        ],
        correctAnswerIndex: 2,
        explanation: "The central nucleus contains positively charged protons and neutral neutrons. Negatively charged electrons orbit the nucleus in an electron cloud."
      },
      {
        id: "sa-q3",
        questionText: "What do elements in the same vertical column (Group) of the periodic table share?",
        options: [
          "The same number of protons",
          "The same atomic mass",
          "The same number of valence electrons",
          "The same number of electron shells"
        ],
        correctAnswerIndex: 2,
        explanation: "Elements in the same column (Group) share the same number of valence (outermost) electrons, which gives them highly similar chemical properties and reactivity."
      },
      {
        id: "sa-q4",
        questionText: "How does electronegativity change as you move from left to right across a period?",
        options: [
          "It increases.",
          "It decreases.",
          "It remains completely constant.",
          "It decreases then increases."
        ],
        correctAnswerIndex: 0,
        explanation: "Electronegativity increases across a period because the nucleus gains more protons, exerting a stronger positive pull on bonding electrons, while the valence shell gets closer to being filled."
      },
      {
        id: "sa-q5",
        questionText: "What is an isotope?",
        options: [
          "An atom with a different number of electrons resulting in a charge.",
          "An atom with the same number of protons but a different number of neutrons.",
          "An atom that has bonded with another of the same species.",
          "An atom with a split nucleus."
        ],
        correctAnswerIndex: 1,
        explanation: "Isotopes are varieties of an element that have the identical number of protons (atomic number) but different numbers of neutrons, resulting in different atomic weights (mass numbers)."
      }
    ]
  },
  {
    id: "quiz-science-photosynthesis",
    title: "Photosynthesis Deep Dive",
    subject: "Science",
    difficulty: "Intermediate",
    description: "Test your comprehension of light-dependent and Calvin cycle reactions.",
    duration: "7 mins",
    questions: [
      {
        id: "sp-q1",
        questionText: "Where exactly do the light-dependent reactions of photosynthesis take place?",
        options: [
          "In the Stroma",
          "In the Thylakoid Membrane",
          "In the Mitochondrial Matrix",
          "In the Cytoplasm"
        ],
        correctAnswerIndex: 1,
        explanation: "The light-dependent reactions occur within the thylakoid membranes of chloroplasts, where chlorophyll and electron transport systems are housed. The stroma is where the dark reactions (Calvin Cycle) happen."
      },
      {
        id: "sp-q2",
        questionText: "During photolysis, water molecules are split. What key byproduct is released into the atmosphere?",
        options: ["Carbon Dioxide (CO2)", "Glucose (C6H12O6)", "Oxygen gas (O2)", "Water vapor (H2O)"],
        correctAnswerIndex: 2,
        explanation: "Water photolysis splits H2O into H+ ions, electrons, and Oxygen gas (O2). This is the source of the oxygen we breathe!"
      },
      {
        id: "sp-q3",
        questionText: "What enzyme catalyzes the first major step of carbon fixation in the Calvin Cycle?",
        options: ["ATP Synthase", "RuBisCO", "Amylase", "Helicase"],
        correctAnswerIndex: 1,
        explanation: "RuBisCO (Ribulose-1,5-bisphosphate carboxylase-oxygenase) is the critical enzyme that grabs atmospheric CO2 and bonds it to the 5-carbon RuBP, initiating the Calvin Cycle."
      },
      {
        id: "sp-q4",
        questionText: "Which two high-energy molecules are produced in the light reactions and consumed in the Calvin Cycle?",
        options: [
          "ADP and NADP+",
          "ATP and NADPH",
          "Glucose and Oxygen",
          "Water and Carbon Dioxide"
        ],
        correctAnswerIndex: 1,
        explanation: "ATP and NADPH act as chemical batteries. They are fully charged by solar energy in the light-dependent thylakoid reactions, and then spent in the stroma to build glucose from carbon dioxide."
      },
      {
        id: "sp-q5",
        questionText: "Do the light-independent reactions (Calvin Cycle) only take place in the dark?",
        options: [
          "Yes, they are inhibited by light.",
          "No, they just do not directly require light, but they rely on daytime light reaction products.",
          "Yes, they only happen at midnight.",
          "No, they require active photons to stimulate RuBisCO."
        ],
        correctAnswerIndex: 1,
        explanation: "Although called the 'dark reactions', the Calvin Cycle usually runs during the day because it requires a steady supply of fresh ATP and NADPH, which are only generated when light is hitting the thylakoids."
      }
    ]
  },
  {
    id: "quiz-science-genetics",
    title: "Molecular Genetics Master",
    subject: "Science",
    difficulty: "Advanced",
    description: "Challenge your understanding of replication enzymes, transcriptional controls, and RNA splicing.",
    duration: "10 mins",
    questions: [
      {
        id: "sg-q1",
        questionText: "Which enzyme is responsible for unwinding the double helix during DNA replication?",
        options: ["DNA Polymerase", "Helicase", "Ligase", "Topoisomerase"],
        correctAnswerIndex: 1,
        explanation: "Helicase acts like a zipper, breaking the hydrogen bonds holding the two complementary nucleotide strands together to expose the templates."
      },
      {
        id: "sg-q2",
        questionText: "Why is the lagging strand synthesized in discontinuous segments (Okazaki fragments)?",
        options: [
          "Because helicase runs backwards.",
          "Because DNA polymerase can only synthesize in the 5' to 3' direction.",
          "Because lagging strand DNA is weaker.",
          "Because primers are only placed on the leading strand."
        ],
        correctAnswerIndex: 1,
        explanation: "DNA polymerase III can only add nucleotides to a free 3'-OH group, meaning it must synthesize DNA in a strict 5' to 3' direction. Since the replication fork opens in one direction, the lagging strand must be built in backward spurts away from the fork."
      },
      {
        id: "sg-q3",
        questionText: "What is transcription?",
        options: [
          "Using mRNA to synthesize a polypeptide chain (protein).",
          "Using a DNA template to synthesize a complementary RNA strand.",
          "Duplicating a chromosome before cell division.",
          "Repairing mutated nucleotides in the double-helix."
        ],
        correctAnswerIndex: 1,
        explanation: "Transcription is the process of copying (transcribing) a segment of DNA into a single-stranded messenger RNA (mRNA) blueprint, catalyzed by RNA Polymerase."
      },
      {
        id: "sg-q4",
        questionText: "During eukaryotic mRNA splicing, which segments are cut out and discarded?",
        options: ["Exons", "Introns", "Promoters", "Poly-A tails"],
        correctAnswerIndex: 1,
        explanation: "Introns (Intervening sequences) are non-coding segments that must be sliced out by the spliceosome. Exons (Expressed sequences) are spliced together to form the mature coding transcript."
      },
      {
        id: "sg-q5",
        questionText: "What is the function of Primase in replication?",
        options: [
          "To seal the backbone gaps.",
          "To provide a short RNA primer with a free 3'-OH group for DNA polymerase to build upon.",
          "To proofread the growing DNA strand.",
          "To keep the double helix from re-annealing."
        ],
        correctAnswerIndex: 1,
        explanation: "DNA polymerases cannot start a strand from scratch. Primase places a short RNA primer sequence on the template, providing the necessary 3'-OH anchor for DNA Polymerase to begin elongation."
      }
    ]
  },

  // ================= COMPUTER SCIENCE =================
  {
    id: "quiz-cs-arrays-bigo",
    title: "Big O & Arrays Essentials",
    subject: "Computer Science",
    difficulty: "Beginner",
    description: "Assess your baseline knowledge of time complexities, constant versus linear operations, and array memory allocation.",
    duration: "5 mins",
    questions: [
      {
        id: "ca-q1",
        questionText: "What does O(n) represent in Big O notation?",
        options: [
          "Constant time - speed is the same regardless of input size.",
          "Linear time - execution scales directly in proportion to input size.",
          "Quadratic time - execution speed is squared as input grows.",
          "Logarithmic time - speed increases slower as data expands."
        ],
        correctAnswerIndex: 1,
        explanation: "O(n) describes linear growth. If you double the size of the array, the time taken to process it (e.g. searching via a single loop) roughly doubles."
      },
      {
        id: "ca-q2",
        questionText: "What is the time complexity of accessing an element in an array by its index (e.g. arr[7])?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"],
        correctAnswerIndex: 0,
        explanation: "Because arrays are stored in contiguous blocks of memory, the computer can instantly compute the precise memory address using simple math. This lookup occurs in constant O(1) time."
      },
      {
        id: "ca-q3",
        questionText: "What is the worst-case time complexity of searching for a value in an unsorted array of size n?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"],
        correctAnswerIndex: 2,
        explanation: "If the array is unsorted, we may have to look at every single element to find our target (or discover it isn't there), which takes O(n) operations."
      },
      {
        id: "ca-q4",
        questionText: "Why is inserting an element at the beginning of an array an O(n) operation?",
        options: [
          "Because we must re-sort the array first.",
          "Because all existing elements must be shifted over by one index in memory.",
          "Because memory allocation is slow.",
          "It is not O(n); it is O(1)."
        ],
        correctAnswerIndex: 1,
        explanation: "Since arrays reside in a contiguous memory block, index 0 is at a fixed position. To insert an element at index 0, we must shift the element at 0 to 1, 1 to 2, and so on for all n elements, requiring O(n) steps."
      },
      {
        id: "ca-q5",
        questionText: "In Big O notation, we drop constants. What does an algorithm with 3n + 10 operations simplify to?",
        options: ["O(1)", "O(3n)", "O(n)", "O(n + 10)"],
        correctAnswerIndex: 2,
        explanation: "In Big O, we care about the asymptotic behavior as n approaches infinity. Constant coefficients (like 3) and constant additions (like 10) become negligible compared to the growth of n, so we simplify 3n + 10 to O(n)."
      }
    ]
  },
  {
    id: "quiz-cs-trees-graphs",
    title: "Trees & Graphs Traversal",
    subject: "Computer Science",
    difficulty: "Intermediate",
    description: "Validate your knowledge of Binary Search Trees (BST), Graph representations, DFS, and BFS.",
    duration: "7 mins",
    questions: [
      {
        id: "ct-q1",
        questionText: "What is the key structural difference between a general Graph and a Tree?",
        options: [
          "A tree must have cycles, while a graph cannot.",
          "A tree is a connected, acyclic graph with a single root, while a graph can have cycles and multiple disconnected components.",
          "Graphs can only store numbers, while trees store characters.",
          "Trees use dynamic memory, while graphs are static."
        ],
        correctAnswerIndex: 1,
        explanation: "A tree is a specialized subset of graphs. It must be fully connected, have no cycles (loops), and possess a single root hierarchy, whereas general graphs are unrestricted networks that can have loops and disconnects."
      },
      {
        id: "ct-q2",
        questionText: "In a balanced Binary Search Tree (BST) containing n nodes, what is the average-case time complexity of searching for an element?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n * log n)"],
        correctAnswerIndex: 1,
        explanation: "Because a BST maintains a strict order (left smaller, right larger), searching allows us to discard half of the remaining nodes at each step, yielding logarithmic O(log n) performance."
      },
      {
        id: "ct-q3",
        questionText: "Which data structure is fundamentally used to implement Breadth-First Search (BFS)?",
        options: ["Stack", "Queue", "Min-Heap", "Hash Table"],
        correctAnswerIndex: 1,
        explanation: "BFS explores nodes layer-by-layer (FIFO - First In, First Out). A Queue is used to track which nodes to explore next in order of discovery."
      },
      {
        id: "ct-q4",
        questionText: "If a Binary Search Tree (BST) becomes completely unbalanced (e.g. elements inserted in sorted order like 1, 2, 3, 4, 5), what does its search complexity degrade to?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"],
        correctAnswerIndex: 2,
        explanation: "An unbalanced BST behaves like a linked list, where every node only has a right child. Discarding half the nodes at each step is no longer possible, forcing a linear scan of O(n)."
      },
      {
        id: "ct-q5",
        questionText: "Which traversal strategy would you use to find the shortest path in an unweighted grid/network?",
        options: ["Depth-First Search (DFS)", "Breadth-First Search (BFS)", "In-order Traversal", "Post-order Traversal"],
        correctAnswerIndex: 1,
        explanation: "Since BFS radiates outward from the start node layer-by-layer, the first time it reaches a target node, it is guaranteed to have taken the shortest possible number of edges."
      }
    ]
  },
  {
    id: "quiz-cs-sorting",
    title: "Sorting Algorithms Mastery",
    subject: "Computer Science",
    difficulty: "Advanced",
    description: "Compare Merge Sort, Quick Sort, and Bubble Sort on runtime, memory, and partitioning strategies.",
    duration: "10 mins",
    questions: [
      {
        id: "cs-q1",
        questionText: "Which of the following sorting algorithms offers a guaranteed O(n log n) worst-case time complexity?",
        options: ["Bubble Sort", "Quick Sort", "Merge Sort", "Insertion Sort"],
        correctAnswerIndex: 2,
        explanation: "Merge Sort consistently divides the array in half and merges them back in sorted order, which guarantees O(n log n) time even in the worst-case scenario. Quick Sort can degrade to O(n^2) in its worst case if pivot selection is poor."
      },
      {
        id: "cs-q2",
        questionText: "What is the primary drawback of using Merge Sort over Quick Sort?",
        options: [
          "It is slower in the average case.",
          "It requires O(n) auxiliary space to hold merged array slices.",
          "It is not stable.",
          "It cannot handle negative numbers."
        ],
        correctAnswerIndex: 1,
        explanation: "Merge Sort is not an in-place algorithm; it needs extra memory proportional to the input size (O(n) space complexity) to perform the merging operations. Quick Sort only requires logarithmic O(log n) recursion stack memory."
      },
      {
        id: "cs-q3",
        questionText: "What condition causes Quick Sort to degrade to its worst-case O(n^2) time complexity?",
        options: [
          "When the array elements are highly random.",
          "When the pivot chosen is always the maximum or minimum element (e.g., sorting a pre-sorted array using the first element as the pivot).",
          "When the array is very small.",
          "When the pivot is chosen as the median of the array."
        ],
        correctAnswerIndex: 1,
        explanation: "If the chosen pivot splits the array into sizes of 0 and n-1 instead of roughly equal halves, the recursion tree height becomes n instead of log n. This results in quadratic O(n^2) operations."
      },
      {
        id: "cs-q4",
        questionText: "What is the worst-case space complexity of Bubble Sort?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"],
        correctAnswerIndex: 0,
        explanation: "Bubble Sort is an in-place sorting algorithm that swaps adjacent elements directly in the original array. It requires no additional data structures, so its auxiliary space complexity is O(1) (constant space)."
      },
      {
        id: "cs-q5",
        questionText: "What does 'sorting stability' mean in computer science?",
        options: [
          "The algorithm will never crash during execution.",
          "The algorithm maintains the relative order of elements with equal keys/values.",
          "The algorithm executes in the exact same time regardless of initial order.",
          "The algorithm does not use recursion."
        ],
        correctAnswerIndex: 1,
        explanation: "A sorting algorithm is 'stable' if elements with identical sorting keys appear in the same relative order in the sorted output as they did in the unsorted input."
      }
    ]
  },

  // ================= HISTORY =================
  {
    id: "quiz-history-mesopotamia",
    title: "Mesopotamian Civilizations",
    subject: "History",
    difficulty: "Beginner",
    description: "Test your facts on Sumerian geography, cuneiform developments, and Hammurabi's legal code.",
    duration: "5 mins",
    questions: [
      {
        id: "hm-q1",
        questionText: "Which two rivers defined the geographic borders of ancient Mesopotamia?",
        options: [
          "Nile and Jordan",
          "Tigris and Euphrates",
          "Indus and Ganges",
          "Yellow and Yangtze"
        ],
        correctAnswerIndex: 1,
        explanation: "The word Mesopotamia translates from ancient Greek as 'land between rivers'. These rivers are the Tigris and the Euphrates, which created the fertile soil of the Fertile Crescent."
      },
      {
        id: "hm-q2",
        questionText: "What is Cuneiform?",
        options: [
          "The first law code written in Babylon.",
          "A system of writing using wedge-shaped marks on clay tablets.",
          "The title of a Mesopotamian high priest.",
          "An ancient Egyptian tomb structure."
        ],
        correctAnswerIndex: 1,
        explanation: "Developed around 3200 BCE by the Sumerians, Cuneiform ('wedge-shaped') is one of the oldest writing systems in human history, formed by pressing reed styluses into wet clay."
      },
      {
        id: "hm-q3",
        questionText: "Which famous legal principle is most commonly associated with Hammurabi's Code?",
        options: [
          "No taxation without representation",
          "An eye for an eye, a tooth for a tooth",
          "Innocent until proven guilty beyond all doubt",
          "The divine right of kings to rule unrestricted"
        ],
        correctAnswerIndex: 1,
        explanation: "Hammurabi's Code is famous for defining retributive justice, often symbolized by the phrase 'an eye for an eye'. Punishments matched the damage done, though penalties varied by social class."
      },
      {
        id: "hm-q4",
        questionText: "What geographic challenge forced the early Sumerians to develop cooperative irrigation systems?",
        options: [
          "Severe desert sandstorms.",
          "Complete lack of rain throughout the entire year.",
          "Volatile, unpredictable flooding of the Tigris and Euphrates rivers.",
          "Frequent volcanic eruptions blocking water channels."
        ],
        correctAnswerIndex: 2,
        explanation: "Unlike the predictable annual flooding of the Egyptian Nile, the Mesopotamian rivers flooded suddenly and violently. Sumerians had to cooperate to build extensive canals, dikes, and reservoirs to safeguard crops."
      },
      {
        id: "hm-q5",
        questionText: "Which ancient Sumerian city is widely considered one of the world's first true urban centers?",
        options: ["Babylon", "Thebes", "Uruk", "Rome"],
        correctAnswerIndex: 2,
        explanation: "Uruk (along with Ur) was one of the earliest large-scale cities in Mesopotamia, flourishing around 3500 BCE with monumental architecture and a population of tens of thousands."
      }
    ]
  },
  {
    id: "quiz-history-industrial",
    title: "Industrial Revolution Analysis",
    subject: "History",
    difficulty: "Intermediate",
    description: "Verify your analytical grasp of the causes, social conditions, and shifts of the industrial age.",
    duration: "7 mins",
    questions: [
      {
        id: "hi-q1",
        questionText: "Which of the following was a primary reason why the Industrial Revolution began in Great Britain first?",
        options: [
          "Britain had a complete monopoly on electronic technologies.",
          "Abundant domestic deposits of coal and iron ore, coupled with deep colonial markets.",
          "Britain was completely isolated from global trade.",
          "Britain banned the use of steam power to protect farm labor."
        ],
        correctAnswerIndex: 1,
        explanation: "Great Britain was uniquely situated due to extensive coal beds and iron ore close to the surface, a capital-rich economy from global trade, and accessible shipping lanes, enabling fast industrial scaling."
      },
      {
        id: "hi-q2",
        questionText: "What was the Cottage Industry?",
        options: [
          "The manufacture of small log cabins for workers.",
          "A decentralized manufacturing system where goods were crafted by hand inside people's homes.",
          "An early form of corporate agriculture.",
          "A trade union representing weavers."
        ],
        correctAnswerIndex: 1,
        explanation: "Before factories, goods were produced through the cottage industry (or domestic system), where merchants distributed raw wool or cotton to families who spun and wove it in their own cottages."
      },
      {
        id: "hi-q3",
        questionText: "The Industrial Revolution led to rapid 'urbanization'. What does this term mean?",
        options: [
          "The systematic conversion of factories back into farm lands.",
          "The mass migration of people from rural farmlands to crowded cities.",
          "The introduction of high taxes on industrial equipment.",
          "The development of steam-powered carriages."
        ],
        correctAnswerIndex: 1,
        explanation: "Urbanization is the shift of population from rural agricultural areas to cities, driven by the concentration of factory jobs and the mechanization of farming."
      },
      {
        id: "hi-q4",
        questionText: "Which metal became the defining construction material of the SECOND Industrial Revolution (1870-1914)?",
        options: ["Iron", "Bronze", "Steel", "Copper"],
        correctAnswerIndex: 2,
        explanation: "While the First Industrial Revolution was defined by iron, the Second was propelled by the mass-production of steel (thanks to the Bessemer process), which was lighter, stronger, and more flexible."
      },
      {
        id: "hi-q5",
        questionText: "The harsh working conditions in early factories directly catalyzed the emergence of which social protection?",
        options: ["Monopolies", "Private stock markets", "Labor unions", "Feudal estates"],
        correctAnswerIndex: 2,
        explanation: "Long hours, child labor, and lethal safety hazards led workers to form mutual-aid groups and labor unions to negotiate collectively for fair wages, shorter shifts, and safer factories."
      }
    ]
  },
  {
    id: "quiz-history-ww1",
    title: "Geopolitics of World War I",
    subject: "History",
    difficulty: "Advanced",
    description: "Challenge your historical understanding of alliances, the MAIN framework, and tactical stalemates.",
    duration: "10 mins",
    questions: [
      {
        id: "hw-q1",
        questionText: "In the 'M-A-I-N' framework of long-term causes of WWI, what does the 'I' stand for?",
        options: ["Industrialization", "Isolationism", "Imperialism", "Inflation"],
        correctAnswerIndex: 2,
        explanation: "The 'MAIN' structural factors are Militarism, Alliances, Imperialism, and Nationalism. Imperialism refers to European powers competing globally for colonies and resource domains, which fueled intense friction."
      },
      {
        id: "hw-q2",
        questionText: "Whose assassination in June 1914 served as the immediate trigger/spark of World War I?",
        options: [
          "Kaiser Wilhelm II",
          "Archduke Franz Ferdinand",
          "Tsar Nicholas II",
          "King George V"
        ],
        correctAnswerIndex: 1,
        explanation: "The assassination of Archduke Franz Ferdinand, heir to the Austro-Hungarian throne, by Serbian nationalist Gavrilo Princip in Sarajevo triggered the diplomatic July Crisis."
      },
      {
        id: "hw-q3",
        questionText: "What was the core strategic objective of Germany's Schlieffen Plan?",
        options: [
          "To form a permanent defensive alliance with Great Britain.",
          "To conquer Russia first before turning attention to France.",
          "To quickly defeat France by invading through neutral Belgium, avoiding a slow two-front war.",
          "To blockade the United States from supplying European Allies."
        ],
        correctAnswerIndex: 2,
        explanation: "Knowing Russia would take weeks to fully mobilize, Germany planned to rapidly sweep through Belgium to knock France out of the war in six weeks, then transport troops east to face Russia, preventing a simultaneous two-front war."
      },
      {
        id: "hw-q4",
        questionText: "Why did the Western Front devolve into a brutal and permanent stalemate?",
        options: [
          "Neither side had any ammunition.",
          "The geography of France was completely mountainous.",
          "Industrial defensive weapons (machine guns, artillery) heavily outperformed traditional offensive tactics, forcing armies to dig trenches.",
          "Both sides signed an armistice in the second month."
        ],
        correctAnswerIndex: 2,
        explanation: "Defensive military technology (trenches, barbed wire, heavy machine guns, rapid-fire artillery) completely nullified infantry charges, making defensive positions near-impenetrable and creating a stagnant war of attrition."
      },
      {
        id: "hw-q5",
        questionText: "What was 'No Man's Land' in the context of World War I combat?",
        options: [
          "The region of neutral Switzerland.",
          "The muddy, cratered space between the opposing armies' trenches, swept by machine guns.",
          "The territorial waters of the Atlantic Ocean.",
          "The military command centers far behind the front lines."
        ],
        correctAnswerIndex: 1,
        explanation: "No Man's Land was the extremely hazardous, blasted territory separating the trenches of the Allied and Central Powers. Crossing it meant running directly into machine-gun barrages and artillery shells."
      }
    ]
  },

  // ================= LITERATURE =================
  {
    id: "quiz-lit-shakespeare",
    title: "Shakespearean Tragedy & Wordplay",
    subject: "Literature",
    difficulty: "Advanced",
    description: "Analyze complex themes, rhetorical figures, and psychological structures in Shakespeare's major tragedies.",
    duration: "8 mins",
    questions: [
      {
        id: "lit-q1",
        questionText: "In Shakespearean drama, what is the precise rhetorical distinction of a 'soliloquy'?",
        options: [
          "A dialogue spoken between two main characters on an empty stage.",
          "A character speaking their innermost thoughts aloud to themselves, entirely alone on stage.",
          "A speech delivered by a character directly to other silent characters on stage.",
          "An interruption of the main action by a comedic or minor character."
        ],
        correctAnswerIndex: 1,
        explanation: "A soliloquy is a dramatic convention where a character stands completely alone on stage, speaking their private thoughts to themselves or the audience, providing an authentic look into their psyche."
      },
      {
        id: "lit-q2",
        questionText: "Which of Shakespeare's famous tragedies concludes with the protagonist's final words, 'The rest is silence'?",
        options: ["King Lear", "Othello", "Macbeth", "Hamlet"],
        correctAnswerIndex: 3,
        explanation: "Prince Hamlet utters 'The rest is silence' as his final words to his loyal friend Horatio right before his death in Act V, Scene 2 of the play."
      },
      {
        id: "lit-q3",
        questionText: "What metric structure is blank verse primarily written in, characterizing the speeches of Shakespeare's noble figures?",
        options: [
          "Dactylic Hexameter",
          "Trochaic Tetrameter",
          "Iambic Pentameter",
          "Anapestic Tetrameter"
        ],
        correctAnswerIndex: 2,
        explanation: "Blank verse is unrhymed iambic pentameter, which consists of ten syllables per line following an unstressed-stressed (da-DUM) heartbeat rhythm."
      },
      {
        id: "lit-q4",
        questionText: "In Othello, the audience is fully aware of Iago's malicious plots while Othello trusts him implicitly. What literary device is this?",
        options: [
          "Dramatic Irony",
          "Juxtaposition",
          "Pathetic Fallacy",
          "Hyperbole"
        ],
        correctAnswerIndex: 0,
        explanation: "Dramatic irony occurs when the audience possesses critical knowledge about plot developments or character motives that the characters on stage do not."
      },
      {
        id: "lit-q5",
        questionText: "What is an 'aside' in Elizabethan theatre?",
        options: [
          "A short song sung between theatrical acts.",
          "A structural room off-stage where actors prepare.",
          "A brief remark spoken by an actor to the audience or another character, which is conventionally unheard by other actors on stage.",
          "A physical gesture used to indicate a character has died."
        ],
        correctAnswerIndex: 2,
        explanation: "An aside is a brief, intimate comment addressed directly to the audience (or to another specific character) that the other characters present on stage are presumed not to hear."
      }
    ]
  },

  // ================= ECONOMICS =================
  {
    id: "quiz-econ-equilibrium",
    title: "Microeconomic Equilibrium & Elasticity",
    subject: "Economics",
    difficulty: "Advanced",
    description: "Test your advanced understanding of supply/demand mechanics, consumer choice theory, and market price elasticities.",
    duration: "8 mins",
    questions: [
      {
        id: "econ-q1",
        questionText: "If the price elasticity of demand for a luxury good is calculated to be -1.5, how is its demand characterized?",
        options: [
          "Perfecty Inelastic",
          "Inelastic",
          "Unit Elastic",
          "Elastic"
        ],
        correctAnswerIndex: 3,
        explanation: "Demand is considered elastic if the absolute value of the price elasticity of demand is greater than 1. Here, |-1.5| = 1.5, meaning consumer demand is highly responsive to price changes."
      },
      {
        id: "econ-q2",
        questionText: "Which economic term describes a public good's characteristic where one person's consumption does not reduce its availability to others?",
        options: [
          "Non-excludability",
          "Non-rivalry",
          "Negative Externality",
          "Asymmetric Information"
        ],
        correctAnswerIndex: 1,
        explanation: "Non-rivalry means that the consumption of the good by one individual does not decrease the amount or quality available for others to consume (e.g., streetlights or national defense)."
      },
      {
        id: "econ-q3",
        questionText: "In consumer choice theory, what does a consumer's indifference curve represent?",
        options: [
          "The maximum budget constraint a consumer faces.",
          "Combinations of two goods that provide the consumer with the exact same level of utility or satisfaction.",
          "The relationship between price fluctuations and quantity demanded.",
          "The rate at which a firm can substitute raw inputs."
        ],
        correctAnswerIndex: 1,
        explanation: "An indifference curve connects all combinations of two goods that yield the identical total utility, leaving the consumer indifferent to which specific point on the curve they consume."
      },
      {
        id: "econ-q4",
        questionText: "Which market structure is characterized by a single seller, high barriers to entry, and absolutely no close substitutes?",
        options: [
          "Perfect Competition",
          "Monopolistic Competition",
          "Oligopoly",
          "Monopoly"
        ],
        correctAnswerIndex: 3,
        explanation: "A monopoly exists when a single firm is the sole producer of a product, there are no close substitutes available, and entry barriers prevent competitors from entering the market."
      },
      {
        id: "econ-q5",
        questionText: "What market outcome consistently occurs when a government imposes an binding price ceiling below the competitive equilibrium price?",
        options: [
          "A market surplus of the good.",
          "A persistent market shortage of the good.",
          "Immediate increase in producer profits.",
          "An increase in overall market efficiency."
        ],
        correctAnswerIndex: 1,
        explanation: "A binding price ceiling is set below the equilibrium price. This artificially low price stimulates high quantity demanded while discouraging production, resulting in a persistent shortage."
      }
    ]
  },

  // ================= PSYCHOLOGY =================
  {
    id: "quiz-psych-cognitive",
    title: "Cognitive Science & Heuristic Biases",
    subject: "Psychology",
    difficulty: "Advanced",
    description: "Delve into the psychological mechanisms of heuristics, cognitive shortcuts, and systemic errors in decision theory.",
    duration: "9 mins",
    questions: [
      {
        id: "psych-q1",
        questionText: "Which cognitive bias describes the tendency to search for, favor, and recall information in a way that confirms one's pre-existing beliefs?",
        options: [
          "Anchor Bias",
          "Framing Bias",
          "Confirmation Bias",
          "Hindsight Bias"
        ],
        correctAnswerIndex: 2,
        explanation: "Confirmation bias is the classic cognitive bias where people selectively filter, search for, and interpret information to align with their pre-established hypotheses or opinions."
      },
      {
        id: "psych-q2",
        questionText: "How does cognitive psychology define the 'availability heuristic'?",
        options: [
          "Judging the likelihood or frequency of an event based on how easily active examples of it can be recalled from memory.",
          "The belief that an item's value is higher if it is readily available in local stores.",
          "Assuming that a representative prototype represents the entire population.",
          "The tendency to focus on the first piece of information offered when making decisions."
        ],
        correctAnswerIndex: 0,
        explanation: "The availability heuristic is a mental shortcut where people evaluate the frequency or probability of an event by how easily concrete instances of it come to mind, often skewed by recent or vivid media reports."
      },
      {
        id: "psych-q3",
        questionText: "According to Daniel Kahneman's dual-process theory, what are the primary traits of 'System 1' thinking?",
        options: [
          "Slow, effortful, logical, and highly calculated.",
          "Fast, automatic, frequent, emotional, and subconscious.",
          "Strictly dedicated to mathematical calculations and formal logic.",
          "Metacognitive and completely under conscious, deliberate control."
        ],
        correctAnswerIndex: 1,
        explanation: "System 1 is the brain's fast, automatic, intuitive, and largely subconscious mode of thinking, which operates with little or no effort and no sense of voluntary control."
      },
      {
        id: "psych-q4",
        questionText: "The 'framing effect' is an important cognitive bias because it demonstrates that individuals:",
        options: [
          "Are completely rational decision-makers in all financial domains.",
          "Make completely different choices based on whether outcomes are presented as potential gains or potential losses.",
          "Have perfect, photographic long-term memories.",
          "Are only affected by sensory stimuli, not textual descriptions."
        ],
        correctAnswerIndex: 1,
        explanation: "The framing effect shows that the way information is presented (e.g., 90% fat-free vs. 10% fat) significantly changes people's choices, as they tend to avoid risk when a positive frame is presented but seek risks under a negative frame."
      },
      {
        id: "psych-q5",
        questionText: "Which concept refers to the psychological discomfort felt when holding two contradictory beliefs, values, or ideas simultaneously?",
        options: [
          "Neurosis",
          "Anhedonia",
          "Cognitive Dissonance",
          "Psychological Reactance"
        ],
        correctAnswerIndex: 2,
        explanation: "Cognitive dissonance, coined by Leon Festinger, is the mental discomfort or stress experienced by an individual who holds two or more contradictory beliefs, ideas, or values at the same time."
      }
    ]
  },

  // ================= PHILOSOPHY =================
  {
    id: "quiz-phil-epistemology",
    title: "Epistemological Foundations & Skepticism",
    subject: "Philosophy",
    difficulty: "Advanced",
    description: "Engage with foundational questions of truth, justification, rationalism versus empiricism, and Gettier cases.",
    duration: "10 mins",
    questions: [
      {
        id: "phil-q1",
        questionText: "What was the traditional, tripartite definition of knowledge widely accepted in philosophy prior to Edmund Gettier's 1963 challenge?",
        options: [
          "Empirical Scientific Fact",
          "Rational Dogmatic Deduction",
          "Justified True Belief (JTB)",
          "A Priori Logical Truth"
        ],
        correctAnswerIndex: 2,
        explanation: "The tripartite theory of knowledge defined knowledge as Justified True Belief (JTB), requiring that a person must believe the proposition, the proposition is true, and the person has proper justification."
      },
      {
        id: "phil-q2",
        questionText: "Which philosopher formulated the method of radical doubt, seeking an indubitable foundation for knowledge, resulting in 'Cogito, ergo sum'?",
        options: [
          "John Locke",
          "René Descartes",
          "David Hume",
          "Immanuel Kant"
        ],
        correctAnswerIndex: 1,
        explanation: "René Descartes, in his Meditations on First Philosophy, systematically doubted all his beliefs to find an absolute, solid foundation, arriving at 'I think, therefore I am'."
      },
      {
        id: "phil-q3",
        questionText: "What is the primary difference between a priori and a posteriori knowledge?",
        options: [
          "A priori knowledge is religious, whereas a posteriori is secular.",
          "A priori is derived from analytical calculations, whereas a posteriori is purely ethical.",
          "A priori is independent of all sensory experience, whereas a posteriori is derived from empirical observation.",
          "A priori is emotional intuition, whereas a posteriori is scientific consensus."
        ],
        correctAnswerIndex: 2,
        explanation: "A priori knowledge (such as 2+2=4 or all bachelors are unmarried) is known independent of sensory experience, through pure reason. A posteriori knowledge (such as 'the sky is blue' or 'water freezes at 0°C') is empirical and requires sensory observation."
      },
      {
        id: "phil-q4",
        questionText: "Which philosophical school of thought, championed by Locke, Berkeley, and Hume, argues that all knowledge originates in sensory experience?",
        options: [
          "Rationalism",
          "Empiricism",
          "Solipsism",
          "Existentialism"
        ],
        correctAnswerIndex: 1,
        explanation: "Empiricism is the epistemological stance that all ideas and knowledge originate from sensory perception, rejecting the notion of innate ideas."
      },
      {
        id: "phil-q5",
        questionText: "What do Edmund Gettier's famous counterexamples successfully demonstrate about the definition of knowledge?",
        options: [
          "That human beings cannot ever truly know anything with certainty.",
          "That beliefs can never be justified under any circumstances.",
          "That having a justified true belief is not sufficient for knowledge because the belief could be true purely by coincidence or luck.",
          "That empirical science is superior to logical deduction."
        ],
        correctAnswerIndex: 2,
        explanation: "Gettier cases show instances where individuals have a belief that is both true and justified, yet is true only due to luck or coincidence, proving that the classic tripartite definition of knowledge is incomplete."
      }
    ]
  },

  // ================= ART HISTORY =================
  {
    id: "quiz-art-renaissance",
    title: "Renaissance Techniques & Art Theory",
    subject: "Art History",
    difficulty: "Advanced",
    description: "Master the mathematical, chemical, and philosophical underpinnings of High Renaissance masterpiece execution.",
    duration: "8 mins",
    questions: [
      {
        id: "art-q1",
        questionText: "Which Renaissance architect is historically credited with mathematically formulating the rules of linear perspective in Florence?",
        options: [
          "Filippo Brunelleschi",
          "Donatello",
          "Michelangelo",
          "Sandro Botticelli"
        ],
        correctAnswerIndex: 0,
        explanation: "Around 1413, Filippo Brunelleschi demonstrated the geometric system of linear perspective, which allowed artists to represent three-dimensional space on a flat surface using a vanishing point."
      },
      {
        id: "art-q2",
        questionText: "What is 'sfumato', an artistic painting technique famously refined and described by Leonardo da Vinci?",
        options: [
          "Applying gold leaf to religious halos for celestial reflection.",
          "The blending of colors and tones so subtly that they melt into each other without sharp outlines, like smoke.",
          "Carving deep lines into wet plaster during fresco preparation.",
          "Mixing egg yolk with pigment to create durable tempera paint."
        ],
        correctAnswerIndex: 1,
        explanation: "Derived from the Italian word for smoke, sfumato is the transition of colors and shades without clear boundaries, creating a soft-focus, lifelike quality (most famous in Leonardo's Mona Lisa)."
      },
      {
        id: "art-q3",
        questionText: "What does the classical painting technique 'chiaroscuro' translate to and represent?",
        options: [
          "Light-dark; using strong contrasts between light and shadow to give figures three-dimensional volume.",
          "Wet-dry; applying oil paints over quick-drying watercolors.",
          "Symmetry; organizing canvas elements in a perfect golden ratio.",
          "Fresco; painting directly on damp, freshly laid lime plaster."
        ],
        correctAnswerIndex: 0,
        explanation: "Chiaroscuro (from the Italian words chiaro, 'light', and scuro, 'dark') is the use of strong light-dark contrasts to model three-dimensional figures and create dramatic atmospheres."
      },
      {
        id: "art-q4",
        questionText: "The detailed anatomical precision and philosophical themes of Michelangelo's Sistine Chapel ceiling reflect which cultural movement?",
        options: [
          "Byzantine Iconoclasm",
          "Renaissance Humanism",
          "Baroque Absolutism",
          "Gothic Scholasticism"
        ],
        correctAnswerIndex: 1,
        explanation: "Renaissance Humanism celebrated human potential, intellect, and physical beauty, heavily influencing Michelangelo to depict biblical scenes with intense anatomical realism and classical philosophical references."
      },
      {
        id: "art-q5",
        questionText: "What was a major structural and stylistic transition from Medieval art to Early Renaissance painting?",
        options: [
          "A transition away from religious subjects to purely abstract shapes.",
          "Moving from flat, symbolic representations of space and holy figures to mathematically proportioned depth, naturalism, and weight.",
          "Banning the use of colors in favor of monochrome charcoal sketches.",
          "Exclusively painting portraiture of wealthy monarchs instead of religious scenes."
        ],
        correctAnswerIndex: 1,
        explanation: "While Medieval art was largely two-dimensional, symbolic, and prioritised spiritual hierarchy, Renaissance art introduced mathematical perspective, anatomical studies, and realistic human emotions and volume."
      }
    ]
  }
];
