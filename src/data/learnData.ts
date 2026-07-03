export interface StudyModule {
  id: string;
  title: string;
  subject: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  readTime: string;
  objectives: string[];
  keyTerms: { term: string; definition: string }[];
  contentMarkdown: string;
}

export const STUDY_MODULES: StudyModule[] = [
  // ================= MATHEMATICS =================
  {
    id: "math-limits",
    title: "Understanding Limits & Continuity",
    subject: "Mathematics",
    difficulty: "Beginner",
    description: "Master the fundamental concept of Calculus: how functions behave near a point.",
    readTime: "10 min read",
    objectives: [
      "Understand the intuitive definition of a limit",
      "Evaluate limits using algebraic manipulation",
      "Identify types of discontinuities (removable, jump, infinite)"
    ],
    keyTerms: [
      { term: "Limit", definition: "The value that a function approaches as the input approaches some value." },
      { term: "Continuity", definition: "A function is continuous if there are no holes, jumps, or asymptotes in its graph at that point." },
      { term: "Asymptote", definition: "A line that a graph approaches but never touches as it goes to infinity." }
    ],
    contentMarkdown: `### 1. The Intuitive Idea of a Limit

In calculus, we often want to know what a function is doing *near* a specific input, even if the function is undefined at that exact point.

Imagine walking along the curve $f(x) = \\frac{x^2 - 1}{x - 1}$. 
If we plug in $x = 1$, we get $0/0$, which is undefined!
However, if we plug in values very close to $1$:
* $f(0.9) = 1.9$
* $f(0.99) = 1.99$
* $f(1.01) = 2.01$

As $x$ gets closer and closer to $1$, $f(x)$ gets closer and closer to $2$. We write this as:

$$\\lim_{{x \\to 1}} \\frac{x^2 - 1}{x - 1} = 2$$

---

### 2. Algebraic Evaluation Methods

When direct substitution yields an indeterminate form like $0/0$, use these methods:

#### A. Factoring & Canceling
Factor the numerator and denominator, then cancel common terms.
* **Example**: Evaluate $\\lim_{{x \\to 3}} \\frac{x^2 - 9}{x - 3}$
* **Step 1**: Factor: $\\frac{(x-3)(x+3)}{x-3}$
* **Step 2**: Cancel: $x + 3$ (valid for $x \\neq 3$)
* **Step 3**: Substitute: $3 + 3 = 6$

#### B. Rationalizing
If square roots are present, multiply the numerator and denominator by the conjugate.
* **Example**: Evaluate $\\lim_{{x \\to 0}} \\frac{\\sqrt{x+1} - 1}{x}$
* **Step 1**: Multiply by the conjugate $\\sqrt{x+1} + 1$:
  $$\\frac{(\\sqrt{x+1} - 1)(\\sqrt{x+1} + 1)}{x(\\sqrt{x+1} + 1)} = \\frac{(x+1) - 1}{x(\\sqrt{x+1} + 1)} = \\frac{x}{x(\\sqrt{x+1} + 1)}$$
* **Step 2**: Cancel $x$: $\\frac{1}{\\sqrt{x+1} + 1}$
* **Step 3**: Substitute $x=0$: $\\frac{1}{1+1} = \\frac{1}{2}$

---

### 3. Continuity Requirements

A function $f(x)$ is continuous at a point $x = c$ if and only if **all three** of the following conditions are met:
1. $f(c)$ is defined.
2. $\\lim_{{x \\to c}} f(x)$ exists.
3. $\\lim_{{x \\to c}} f(x) = f(c)$.

#### Common Pitfalls
* Confusing a function's value with its limit. They do not have to be equal unless the function is continuous!
* Forgetting to check both left-hand and right-hand limits when dealing with piece-wise functions.`
  },
  {
    id: "math-derivatives",
    title: "The Power of Derivatives",
    subject: "Mathematics",
    difficulty: "Intermediate",
    description: "Learn how to calculate instantaneous rates of change and locate optimal local maxima and minima.",
    readTime: "12 min read",
    objectives: [
      "Define a derivative as the limit of a difference quotient",
      "Apply the Power, Product, Quotient, and Chain Rules",
      "Find local extrema using the First Derivative Test"
    ],
    keyTerms: [
      { term: "Derivative", definition: "The instantaneous rate of change of a function, representing the slope of the tangent line." },
      { term: "Chain Rule", definition: "A formula for computing the derivative of the composition of two or more functions." },
      { term: "Critical Point", definition: "An interior point in the domain of a function where its derivative is either zero or undefined." }
    ],
    contentMarkdown: `### 1. Conceptualizing the Derivative

While algebra teaches us to find the average rate of change between two distant points (slope of a secant line), calculus allows us to zoom in infinitely close to find the **instantaneous rate of change** (slope of a tangent line).

Mathematically, we define the derivative $f'(x)$ of a function $f(x)$ as:

$$f'(x) = \\lim_{{h \\to 0}} \\frac{f(x+h) - f(x)}{h}$$

This limit represents the difference quotient as the interval size $h$ shrinks to zero.

---

### 2. Fundamental Rules of Differentiation

Calculating derivatives using limits is laborious. Instead, we use proven rules derived from this definition:

#### A. Power Rule
For any real number $n$:
$$\\frac{d}{dx}[x^n] = n x^{n-1}$$
* *Example*: $\\frac{d}{dx}[x^4] = 4x^3$

#### B. Product and Quotient Rules
If $u(x)$ and $v(x)$ are differentiable functions:
* **Product**: $\\frac{d}{dx}[u \\cdot v] = u'v + uv'$
* **Quotient**: $\\frac{d}{dx}[\\frac{u}{v}] = \\frac{u'v - uv'}{v^2}$

#### C. The Chain Rule
For composite functions like $f(g(x))$:
$$\\frac{d}{dx}[f(g(x))] = f'(g(x)) \\cdot g'(x)$$
* *Example*: To find the derivative of $\\sin(x^2)$, set $f(u) = \\sin(u)$ and $g(x) = x^2$. The result is $\\cos(x^2) \\cdot 2x$.

---

### 3. Applications: Finding Extrema

Derivatives are crucial for optimization because they reveal where a function peaks or bottoms out.

* **Critical Points**: Find values of $x$ where $f'(x) = 0$ or is undefined.
* **First Derivative Test**: 
  * If $f'(x)$ changes from **positive to negative** at critical point $c$, then $f(c)$ is a **local maximum**.
  * If $f'(x)$ changes from **negative to positive** at critical point $c$, then $f(c)$ is a **local minimum**.`
  },
  {
    id: "math-integration",
    title: "Mastering Integration Techniques",
    subject: "Mathematics",
    difficulty: "Advanced",
    description: "Unlock the connection between area and accumulation through Definite Integrals and Integration by Parts.",
    readTime: "15 min read",
    objectives: [
      "Understand the Fundamental Theorem of Calculus",
      "Perform integrations using Substitution (u-substitution)",
      "Evaluate complex integral forms using Integration by Parts"
    ],
    keyTerms: [
      { term: "Antiderivative", definition: "A function whose derivative is equal to the original function." },
      { term: "Definite Integral", definition: "The limit of a sum of areas of rectangles representing the net signed area under a curve." },
      { term: "Integration by Parts", definition: "A technique based on the product rule of differentiation used to integrate products of functions." }
    ],
    contentMarkdown: `### 1. The Fundamental Theorem of Calculus (FTC)

Integration represents the reverse operation of differentiation. The FTC establishes this connection beautifully:

If $f(x)$ is continuous on $[a, b]$ and $F(x)$ is an antiderivative of $f(x)$ ($F'(x) = f(x)$), then:

$$\\int_{a}^{b} f(x) \\, dx = F(b) - F(a)$$

This means the total accumulation of a quantity over an interval can be calculated by comparing the boundary states of its antiderivative.

---

### 2. Integration by Substitution (u-Sub)

U-Substitution is essentially the Chain Rule in reverse. It simplifies integrals by grouping terms.

To evaluate $\\int 2x e^{x^2} \\, dx$:
1. Let $u = x^2$.
2. Calculate the differential: $du = 2x \\, dx$.
3. Substitute into the integral: $\\int e^u \\, du$.
4. Integrate: $e^u + C$.
5. Back-substitute: $e^{x^2} + C$.

---

### 3. Integration by Parts (IBP)

When integrating a product of functions where $u$-substitution fails, we reverse the Product Rule:

$$\\int u \\, dv = uv - \\int v \\, du$$

#### Choosing $u$ and $dv$: The LIATE Rule
Prioritize your choice of $u$ in this order:
1. **L**ogarithmic functions (e.g., $\\ln(x)$)
2. **I**nverse trigonometric functions (e.g., $\\arctan(x)$)
3. **A**lgebraic functions (e.g., $x^2$)
4. **T**rigonometric functions (e.g., $\\sin(x)$)
5. **E**xponential functions (e.g., $e^x$)

* **Example**: Evaluate $\\int x \\ln(x) \\, dx$.
  * Let $u = \\ln(x)$ (Logarithmic beats Algebraic).
  * Let $dv = x \\, dx$.
  * Then $du = \\frac{1}{x} \\, dx$, and $v = \\frac{1}{2}x^2$.
  * Apply formula:
    $$\\int x \\ln(x) \\, dx = \\frac{1}{2}x^2 \\ln(x) - \\int \\frac{1}{2}x^2 \\cdot \\frac{1}{x} \\, dx = \\frac{1}{2}x^2 \\ln(x) - \\frac{1}{4}x^2 + C$$`
  },

  // ================= SCIENCE =================
  {
    id: "science-atom",
    title: "The Atom & The Periodic Table",
    subject: "Science",
    difficulty: "Beginner",
    description: "Explore atomic structure, subatomic particles, and how elements are arranged based on properties.",
    readTime: "8 min read",
    objectives: [
      "Describe the structure of an atom and its subatomic particles",
      "Calculate atomic number, mass number, and charge",
      "Explain periodic trends like electronegativity and atomic radius"
    ],
    keyTerms: [
      { term: "Isotope", definition: "Atoms of the same element with the same number of protons but different numbers of neutrons." },
      { term: "Valence Electrons", definition: "Electrons in the outermost shell of an atom that participate in chemical bonding." },
      { term: "Electronegativity", definition: "A measure of the tendency of an atom to attract a bonding pair of electrons." }
    ],
    contentMarkdown: `### 1. Anatomy of an Atom

Every physical thing is built of atoms. An atom contains two main regions:
* **The Nucleus**: Located at the center, holding **protons** (positive charge, mass $\\approx 1$ AMU) and **neutrons** (neutral charge, mass $\\approx 1$ AMU).
* **The Electron Cloud**: Surrounding the nucleus, containing **electrons** (negative charge, negligible mass).

$$\\text{Charge of atom} = \\text{Protons} - \\text{Electrons}$$
$$\\text{Atomic Mass Number} = \\text{Protons} + \\text{Neutrons}$$

The number of protons determines the **identity** of the element (Atomic Number).

---

### 2. Organizing the Periodic Table

Elements are listed in order of increasing atomic number.
* **Groups (Columns)**: Vertical columns share the same number of **valence electrons**, leading to highly similar chemical behaviors. For example, Group 1 (alkali metals) is extremely reactive.
* **Periods (Rows)**: Horizontal rows indicate the number of electron shells an atom possesses.

---

### 3. Understanding Periodic Trends

As we cross the table, properties change in predictable ways due to the electrostatic attraction between positive protons in the nucleus and negative electrons.

1. **Atomic Radius**: 
   * *Decreases* from left to right across a period because the stronger nuclear charge pulls electrons closer.
   * *Increases* down a group as new electron shells are added.
2. **Electronegativity**:
   * *Increases* from left to right because atoms are closer to filling their outer shells.
   * *Decreases* down a group because valence electrons are further from the positive pull of the nucleus (electron shielding).`
  },
  {
    id: "science-photosynthesis",
    title: "Photosynthesis: Light & Dark Reactions",
    subject: "Science",
    difficulty: "Intermediate",
    description: "Deconstruct the biochemical pathway used by plants to convert solar energy into chemical energy.",
    readTime: "12 min read",
    objectives: [
      "Distinguish between light-dependent and light-independent reactions",
      "Understand the role of Photosystem II and I in the electron transport chain",
      "Trace the Calvin Cycle from carbon fixation to sugar production"
    ],
    keyTerms: [
      { term: "Thylakoid", definition: "Membrane-bound compartments inside chloroplasts where light reactions take place." },
      { term: "Calvin Cycle", definition: "The light-independent reactions that convert carbon dioxide and water into glucose." },
      { term: "RuBisCO", definition: "The enzyme that catalyzes the first major step of carbon fixation." }
    ],
    contentMarkdown: `### 1. Overview of Photosynthesis

Photosynthesis is the process by which autotrophs convert light energy into glucose. The general balanced chemical equation is:

$$6\\text{CO}_2 + 6\\text{H}_2\\text{O} + \\text{Light Energy} \\rightarrow \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2$$

This process occurs in two main phases within the chloroplast:
1. **Light-Dependent Reactions** (takes place in the Thylakoid Membrane)
2. **Light-Independent Reactions / Calvin Cycle** (takes place in the Stroma)

---

### 2. The Light-Dependent Reactions

The light reactions harness photons to create ATP and NADPH, releasing Oxygen gas as a byproduct.

1. **Excitation of Photosystem II (PSII)**: Light hits chlorophyll pigments in PSII, exciting electrons which are transferred to an electron transport chain.
2. **Photolysis of Water**: To replace the lost electrons, water molecules are split:
   $$2\\text{H}_2\\text{O} \\rightarrow 4\\text{H}^+ + 4e^- + \\text{O}_2$$
3. **Proton Gradient & ATP Synthesis**: As electrons pass down the chain, hydrogen ions are pumped into the thylakoid lumen. This electrochemical gradient drives ATP Synthase to convert ADP to ATP.
4. **Photosystem I (PSI) & NADPH Production**: Electrons are re-energized in PSI and used to reduce $\\text{NADP}^+$ to NADPH.

---

### 3. The Calvin Cycle (Light-Independent)

The Calvin Cycle uses ATP and NADPH produced in the light reactions to fix atmospheric Carbon Dioxide into high-energy sugars (G3P).

#### Phase 1: Carbon Fixation
$\\text{CO}_2$ is combined with a 5-carbon sugar, RuBP, facilitated by the enzyme **RuBisCO**. This instantly splits into two 3-carbon molecules (3-PGA).

#### Phase 2: Reduction
ATP and NADPH transfer energy to 3-PGA, transforming them into G3P (glyceraldehyde-3-phosphate). One G3P leaves the cycle to eventually make glucose, while the rest stay.

#### Phase 3: Regeneration
The remaining G3P molecules use ATP to regenerate RuBP so the cycle can continue.

---

### Key Learning Insights & Pitfalls
* **Common Misconception**: Students often think the 'Dark Reactions' only occur at night. In reality, they just do not *require* direct sunlight, but they rely completely on the ATP and NADPH built during the day!`
  },
  {
    id: "science-genetics",
    title: "Genetics: DNA Replication & Transcription",
    subject: "Science",
    difficulty: "Advanced",
    description: "Deep dive into the molecular machines that copy DNA and transcribe it into message-carrying RNA.",
    readTime: "15 min read",
    objectives: [
      "Understand the semi-conservative model of DNA replication",
      "Detail the function of key replication enzymes (Helicase, Primase, Polymerase, Ligase)",
      "Explain the transcriptional mechanisms of RNA synthesis and post-transcriptional splicing"
    ],
    keyTerms: [
      { term: "Okazaki Fragments", definition: "Short sequences of DNA nucleotides which are synthesized discontinuously on the lagging strand." },
      { term: "RNA Polymerase", definition: "An enzyme that is responsible for copying a DNA sequence into an RNA sequence during transcription." },
      { term: "Intron", definition: "A non-coding segment of an RNA transcript that is spliced out before translation." }
    ],
    contentMarkdown: `### 1. The Semi-Conservative Model of Replication

In order for cells to divide, they must copy their entire genome with near-perfect fidelity. DNA replication is **semi-conservative**: each of the two original strand templates is paired with a freshly synthesized complementary strand.

Replication proceeds in a strict **5' to 3' direction** (denoting the carbon numbering on the sugar backbone).

---

### 2. The Molecular Machinery of DNA Replication

The replication bubble forms at origins of replication and moves outwards. Let's trace the enzymes in order of action:

1. **Helicase**: Unwinds the double-helix by breaking hydrogen bonds between base pairs.
2. **Single-Strand Binding Proteins (SSBs)**: Stabilize the single strands to prevent them from snapping back together.
3. **Topoisomerase**: Prevents supercoiling/tangling ahead of the replication fork.
4. **Primase**: Places a short RNA primer to provide a starting 3'-OH end.
5. **DNA Polymerase III**: Synthesizes the complementary strand.
   * **Leading Strand**: Built continuously toward the fork.
   * **Lagging Strand**: Built discontinuously away from the fork, forming **Okazaki Fragments**.
6. **DNA Polymerase I**: Replaces RNA primers with DNA nucleotides.
7. **Ligase**: Seals the remaining nicks in the sugar-phosphate backbone (glue).

---

### 3. Transcription: Converting DNA to mRNA

Transcription is the first step of gene expression where a specific segment of DNA is read into messenger RNA (mRNA).

* **Initiation**: RNA Polymerase binds to a DNA sequence called the **promoter**.
* **Elongation**: RNA Polymerase reads the template strand and builds a single-stranded mRNA transcript containing Uracil (U) instead of Thymine (T).
* **Termination**: The enzyme reaches a terminator sequence and detaches.

#### Post-Transcriptional Processing (Eukaryotes only)
Before mRNA can leave the nucleus for translation, it must be refined:
1. **5' Cap**: Added to protect the transcript from degradation.
2. **Poly-A Tail**: Added to the 3' end to facilitate nuclear export.
3. **Splicing**: **Spliceosomes** cut out non-coding sequences (**introns**) and join coding sequences (**exons**) together.`
  },

  // ================= COMPUTER SCIENCE =================
  {
    id: "cs-arrays-bigo",
    title: "Introduction to Big O & Arrays",
    subject: "Computer Science",
    difficulty: "Beginner",
    description: "Grasp how programmers measure algorithm performance and manage fundamental data structures.",
    readTime: "8 min read",
    objectives: [
      "Understand why Big O is used instead of counting milliseconds",
      "Calculate time complexity of basic loops and lookups",
      "Understand memory allocation of standard static arrays"
    ],
    keyTerms: [
      { term: "Contiguous Memory", definition: "A block of memory where elements are stored next to each other without any gaps." },
      { term: "Constant Time O(1)", definition: "An operation that takes the same amount of execution time regardless of the size of the input." },
      { term: "Linear Time O(n)", definition: "The running time increases in direct proportion to the size of the input data." }
    ],
    contentMarkdown: `### 1. Why Do We Need Big O?

If two computers run the same code, one might take $0.5$ seconds and the other $2.5$ seconds due to differences in processor speed or concurrent tasks.
Therefore, measuring code speed in milliseconds is unreliable.

**Big O Notation** solves this by focusing on how the number of required operations scales relative to the input size $n$. It answers: *As our database grows $1000\\times$, how much slower does the search get?*

---

### 2. Common Time Complexities

#### A. Constant Time: $O(1)$
The action does not scale with size.
* *Example*: Accessing an array element by index: \\\`arr[5]\\\`. No matter how big the array is, finding the index takes exactly one memory jump.

#### B. Linear Time: $O(n)$
We have to scan the entire collection once.
* *Example*: Searching for a number in an unsorted list.
\\\`\\\`\\\`typescript
function findElement(arr: number[], target: number) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}
\\\`\\\`\\\`

#### C. Quadratic Time: $O(n^2)$
Typically occurs with nested loops. If $n = 10$, we do $100$ iterations.
* *Example*: Comparing all pairs of elements.

---

### 3. Understanding Static Arrays

An array is a collection of elements stored in **contiguous (adjacent) memory**. Because of this tight structural layout:
* **Lookup by index** is incredibly fast: $O(1)$.
* **Insertion or deletion** is slow ($O(n)$) because elements must be shifted in memory to make room or fill a gap.

#### Common Pitfalls
* Assuming arrays have dynamic sizing by default. In low-level languages, a static array cannot change sizes once allocated. Modern languages use dynamic arrays (like JS Arrays or Java ArrayLists) which handle reallocation behind the scenes!`
  },
  {
    id: "cs-trees-graphs",
    title: "Understanding Trees and Graphs",
    subject: "Computer Science",
    difficulty: "Intermediate",
    description: "Demystify hierarchical and networked structures, and learn standard traversal algorithms like DFS and BFS.",
    readTime: "12 min read",
    objectives: [
      "Compare the hierarchical structure of Trees with general Graphs",
      "Explain the properties of a Binary Search Tree (BST)",
      "Contrast Depth-First Search (DFS) and Breadth-First Search (BFS)"
    ],
    keyTerms: [
      { term: "Node", definition: "A basic unit of a data structure, holding data and pointers to other nodes." },
      { term: "Binary Search Tree", definition: "A node-based binary tree data structure where the left subtree contains only nodes with keys less than the parent's key, and the right contains keys greater." },
      { term: "Adjacency List", definition: "A collection of unordered lists used to represent a finite graph." }
    ],
    contentMarkdown: `### 1. Hierarchies vs. Networks

Many real-world relations are non-linear:
* **Trees** are hierarchical structures containing nodes with parent-child connections. A tree has exactly **one root** and no closed loops (cycles).
* **Graphs** are general networks of nodes (vertices) connected by pathways (edges). Graphs can represent friendships, maps, or internet routing.

---

### 2. The Power of Binary Search Trees (BSTs)

A BST enforces an ordering rule: for any node, all left children are smaller than the node, and all right children are larger.

\\\`\\\`\\\`
       15
      /  \\\\
     8    20
    / \\\\     \\\\
   3  12    25
\\\`\\\`\\\`

Because of this order, we can search for an element by discarding half the remaining tree at each step!
* **Average Search Time**: $O(\\log n)$.
* **Worst-Case Search Time**: $O(n)$ if the tree is unbalanced (e.g., looks like a linear list).

---

### 3. Graph & Tree Traversal: DFS vs. BFS

How do we search through networks? We use two fundamental paradigms:

#### A. Depth-First Search (DFS)
Go deep down a single path before backtracking.
* **Mechanism**: Uses a **Stack** (often via recursion).
* **Ideal for**: Pathfinding where solutions are deep or when checking connectivity.

#### B. Breadth-First Search (BFS)
Explore neighbor nodes layer-by-layer (radiating outward).
* **Mechanism**: Uses a **Queue** (First-In, First-Out).
* **Ideal for**: Finding the **shortest path** in an unweighted graph (like shortest connections on a transit system).`
  },
  {
    id: "cs-sorting",
    title: "Sorting Algorithms & Big O",
    subject: "Computer Science",
    difficulty: "Advanced",
    description: "Compare the efficiency, memory utilization, and mechanics of Merge Sort, Quick Sort, and Bubble Sort.",
    readTime: "15 min read",
    objectives: [
      "Evaluate algorithmic complexity using Big O notation",
      "Analyze the divide-and-conquer philosophy of Merge Sort",
      "Understand pivot selection and partitioning in Quick Sort"
    ],
    keyTerms: [
      { term: "Big O Notation", definition: "A mathematical notation that describes the limiting behavior of a function when the argument tends towards infinity." },
      { term: "Divide and Conquer", definition: "An algorithmic paradigm that recursively breaks down a problem into subproblems until they become simple enough to solve directly." },
      { term: "In-place Algorithm", definition: "An algorithm which transforms input using no auxiliary data structure, requiring constant $O(1)$ extra space." }
    ],
    contentMarkdown: `### 1. Understanding Big O Complexity

Before comparing sorting algorithms, we must understand how we evaluate them. Big O notation measures the execution time or space requirement of an algorithm in the worst-case scenario relative to the input size $n$.

| Algorithm | Best-Case Time | Average-Case Time | Worst-Case Time | Space Complexity |
| :--- | :--- | :--- | :--- | :--- |
| **Bubble Sort** | $O(n)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ |
| **Merge Sort** | $O(n \\log n)$ | $O(n \\log n)$ | $O(n \\log n)$ | $O(n)$ |
| **Quick Sort** | $O(n \\log n)$ | $O(n \\log n)$ | $O(n^2)$ | $O(\\log n)$ |

---

### 2. Deep Dive: Merge Sort

Merge Sort is a stable, divide-and-conquer algorithm.

#### How it Works:
1. Divide the unsorted list into $n$ sublists, each containing one element (a list of one element is considered sorted).
2. Repeatedly merge sublists to produce new sorted sublists until there is only one sublist remaining.

\\\`\\\`\\\`typescript
function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  return merge(left, right);
}
\\\`\\\`\\\s

**Pros**: Guaranteed $O(n \\log n)$ time complexity.
**Cons**: Requires $O(n)$ extra memory to hold the merged arrays.

---

### 3. Deep Dive: Quick Sort

Quick Sort is an efficient, in-place sorting algorithm that also uses divide-and-conquer.

#### How it Works:
1. Pick an element, called a **pivot**, from the array.
2. **Partitioning**: Reorder the array so that all elements with values less than the pivot come before it, while all elements with values greater than the pivot come after it.
3. Recursively apply the above steps to the sub-arrays.

**Crucial Factor: Pivot Selection**
* If we always choose the first or last element as the pivot, and the array is already sorted, Quick Sort degrades to **$O(n^2)$**!
* **Remedy**: Use the "Median-of-Three" rule or a random element as the pivot to ensure highly probable $O(n \\log n)$ performance.

---

### Alternative Methods & Pitfalls
* **Bubble Sort** is practically never used in production due to its poor $O(n^2)$ average performance, but serves as an excellent teaching tool for nested loops.`
  },

  // ================= HISTORY =================
  {
    id: "history-ancient-civs",
    title: "Ancient Mesopotamian Civilizations",
    subject: "History",
    difficulty: "Beginner",
    description: "Examine the cradle of civilization, the invention of writing, and early codifications of law.",
    readTime: "8 min read",
    objectives: [
      "Explain the significance of the Fertile Crescent geography",
      "Describe the transition from pictographs to Cuneiform writing",
      "Discuss the social impact of Hammurabi's Code"
    ],
    keyTerms: [
      { term: "Fertile Crescent", definition: "A crescent-shaped region in the Middle East containing unusually fertile soil watered by the Tigris and Euphrates rivers." },
      { term: "Cuneiform", definition: "One of the earliest systems of writing, distinguished by its wedge-shaped marks on clay tablets." },
      { term: "Hammurabi's Code", definition: "A Babylonian legal code of ancient Mesopotamia, famous for the 'eye for an eye' principle of retributive justice." }
    ],
    contentMarkdown: `### 1. Geography as Destiny: The Fertile Crescent

Mesopotamia—derived from the Greek for "between the rivers"—lay nestled between the **Tigris and Euphrates rivers**. 

Unlike stable river systems like the Nile, the flooding of the Tigris and Euphrates was volatile and unpredictable. To survive, the ancient Sumerians had to collaborate to build complex irrigation systems, canals, and dikes. This collective labor led to the emergence of the world's first cities (such as Uruk and Ur) around 3500 BCE.

---

### 2. Cuneiform: The Birth of Writing

As cities grew, so did the complexity of trade, taxation, and temple record-keeping. Memory was no longer sufficient.

Sumerians began pressing sharp reeds into wet clay tablets.
* **Pictographs**: Initially, these were simple drawings representing physical objects (e.g., a sheep, a barrel of grain).
* **Syllables**: Over centuries, drawings simplified into abstract wedge-shaped symbols representing sounds (**Cuneiform**), enabling the transcription of literature (like the *Epic of Gilgamesh*) and religious hymns.

---

### 3. Hammurabi's Legal Code

Around 1750 BCE, King Hammurabi of Babylon conquered Mesopotamia and established a unified code of 282 laws, carved publicly into a giant stone column (stele).

#### Key Principles
* **Retributive Justice**: Punishment matched the crime (e.g., *"If a man put out the eye of another man, his eye shall be put out"*).
* **Social Inequality**: Punishments were heavily tiered based on social status. Harming a noble carried a severe penalty, while harming a slave resulted in a simple fine paid to the owner.
* **Presumption of Innocence**: The burden of proof lay on the accuser, with false accusations punishable by death.`
  },
  {
    id: "history-industrial-rev",
    title: "The Industrial Revolution",
    subject: "History",
    difficulty: "Intermediate",
    description: "Analyze the societal shift from agrarian economies to industrialized urban centers in the 18th and 19th centuries.",
    readTime: "8 min read",
    objectives: [
      "Identify the primary catalysts of the First Industrial Revolution in Britain",
      "Analyze the transformation of labor, urbanization, and class structures",
      "Differentiate between the First and Second Industrial Revolutions"
    ],
    keyTerms: [
      { term: "Urbanization", definition: "The process of making an area more urban; the progressive movement of populations from rural areas into cities." },
      { term: "Cottage Industry", definition: "A business or manufacturing activity carried on in a person's home rather than a factory." },
      { term: "Capitalism", definition: "An economic system based on private ownership of the means of production and their operation for profit." }
    ],
    contentMarkdown: `### 1. Why Britain First?

The First Industrial Revolution began in Great Britain during the mid-1700s. Several unique factors catalyzed this transition:

* **Agricultural Revolution**: Improved farming techniques (like crop rotation and seed drills) increased food production, leading to a population boom and freeing up labor.
* **Abundant Natural Resources**: Large, easily accessible deposits of **coal** and **iron ore** powered steam engines and constructed heavy machinery.
* **Capital and Empire**: Global trade and colonies provided raw materials (like cotton) and established overseas markets for manufactured goods.
* **Technological Innovations**: Inventions like the **Steam Engine** (James Watt) and the **Spinning Jenny** (James Hargreaves) revolutionized textile production.

---

### 2. Societal & Economic Transformations

#### A. From Cottage to Factory System
Prior to industrialization, goods were crafted slowly at home (the Cottage Industry). Factories centralized labor, utilizing powered machinery to mass-produce goods at incredibly low costs.

#### B. Urbanization and Living Conditions
As farm work became scarce, millions migrated to cities. Cities grew rapidly without planning, resulting in:
* Overcrowded tenements with poor sanitation.
* High disease rates (cholera, tuberculosis).
* Long, dangerous work hours (often 12-16 hours a day, 6 days a week), including extensive **child labor**.

#### C. Emergence of New Social Classes
* **Industrial Bourgeoisie**: The wealthy factory owners, bankers, and merchants.
* **Industrial Proletariat**: The factory workers who owned only their labor.

---

### 3. First vs. Second Industrial Revolution

| Feature | First Industrial Revolution (1760-1840) | Second Industrial Revolution (1870-1914) |
| :--- | :--- | :--- |
| **Primary Fuel** | Coal | Electricity & Petroleum |
| **Key Metal** | Iron | Steel |
| **Leading Sector** | Textiles & Steam power | Chemicals, Steel, & Automobiles |
| **Major Innovations**| Steam engine, Spinning Jenny | Lightbulb, Telephone, Assembly Line |

---

### Key Historical Analysis Insights
* **The Rise of labor unions**: The harsh conditions of early factories sparked resistance, eventually leading to the formation of labor unions, strikes, and social reform laws that banned child labor and limited working hours.`
  },
  {
    id: "history-ww1",
    title: "The Geopolitics of World War I",
    subject: "History",
    difficulty: "Advanced",
    description: "Analyze the tangled alliances, nationalist fervor, and industrial military strategies that sparked the Great War.",
    readTime: "15 min read",
    objectives: [
      "Deconstruct the long-term structural causes of World War I (M-A-I-N)",
      "Explain the flashpoint of the July Crisis and the breakdown of diplomacy",
      "Assess the impact of trench warfare on political and military stalemates"
    ],
    keyTerms: [
      { term: "Militarism", definition: "The belief or desire of a government or people that a country should maintain a strong military capability and be prepared to use it aggressively." },
      { term: "Schlieffen Plan", definition: "The German army's plan for a fast, sweeping attack on France through Belgium to avoid a two-front war." },
      { term: "Stalemate", definition: "A situation in which further action or progress by opposing forces seems impossible, leading to trench warfare." }
    ],
    contentMarkdown: `### 1. Structural Causes: The M-A-I-N framework

While the assassination of Archduke Franz Ferdinand triggered the war, Europe had been primed for conflict for decades due to four deep structural causes:

* **M - Militarism**: European powers engaged in a rapid arms race, notably the naval race between Germany and Great Britain.
* **A - Alliances**: A tangled network of mutual defense treaties divided Europe into two primary camps:
  * **Triple Entente**: Great Britain, France, Russia.
  * **Triple Alliance**: Germany, Austria-Hungary, Italy.
* **I - Imperialism**: Competitions for colonies in Africa and Asia stoked deep rivalries and mutual distrust.
* **N - Nationalism**: Intense national pride and self-determination movements, especially in the Balkans (the "powder keg of Europe").

---

### 2. The Spark: The July Crisis

On June 28, 1914, Gavrilo Princip, a Serbian nationalist, assassinated Archduke Franz Ferdinand of Austria-Hungary in Sarajevo.

#### The Domino Effect
1. Austria-Hungary issued a harsh ultimatum to Serbia, backed by Germany's famous **"Blank Check"** (unconditional support).
2. Serbia agreed to most terms but mobilized. Austria-Hungary declared war on July 28.
3. Russia mobilized its troops to defend Serbia (another Slavic nation).
4. Germany, feeling threatened by Russia's mobilization, declared war on Russia and launched the **Schlieffen Plan** to defeat France before Russia was fully ready.
5. Germany's invasion of neutral Belgium brought Great Britain into the war on August 4.

---

### 3. The Industrialization of Warfare

World War I was the first major war where industrial mass-production was applied fully to combat.

#### The Triumph of Defense over Offense
Industrial weapons like machine guns, heavy artillery, and poison gas gave defensive forces a massive advantage over open-field charges.

To survive this lethal firepower, soldiers dug thousands of miles of trenches from Switzerland to the North Sea:
* **No Man's Land**: The muddy, cratered space between opposing trenches, swept by machine-gun fire.
* **Stalemate**: Neither side could advance, turning the conflict into a devastating war of attrition where victory was measured in yards at the cost of millions of lives.`
  },
  // ================= LITERATURE =================
  {
    id: "lit-shakespeare",
    title: "Shakespeare & Dramatic Devices",
    subject: "Literature",
    difficulty: "Beginner",
    description: "Explore Shakespearean drama through key literary structures, blank verse, and poetic devices like soliloquy and dramatic irony.",
    readTime: "8 min read",
    objectives: [
      "Analyze the structural differences between soliloquies, asides, and monologues",
      "Understand the rhythm and function of iambic pentameter",
      "Identify examples of dramatic irony and foreshadowing in plays"
    ],
    keyTerms: [
      { term: "Soliloquy", definition: "A dramatic speech spoken by a single character alone on stage, revealing their private thoughts to the audience." },
      { term: "Blank Verse", definition: "Unrhymed poetry written in iambic pentameter, mimicking natural speech patterns." },
      { term: "Dramatic Irony", definition: "A literary device where the audience understands events or words that the characters in the play do not." }
    ],
    contentMarkdown: `### 1. The Structure of Shakespearean Drama

William Shakespeare utilized a specific series of dramatic tools to convey complex character psychology and keep audiences engaged in the rowdy Globe Theatre.

* **Soliloquy**: Unlike a monologue (which is spoken to other characters), a soliloquy is a character speaking to themselves or the audience, completely alone. It is an honest window into the character's soul (e.g., Hamlet's "To be, or not to be").
* **Aside**: A brief remark directed to the audience (or one other character) that is unheard by others on stage, creating intimacy and humor.
* **Monologue**: A prolonged speech delivered by one character to other characters on stage.

---

### 2. The Music of Language: Iambic Pentameter

Most of Shakespeare's aristocratic characters speak in **blank verse**, which is unrhymed poetry structured in **iambic pentameter**. 

#### Rhythm Analysis
An "iamb" is a two-syllable foot consisting of an unstressed syllable followed by a stressed syllable (da-DUM). "Pentameter" means there are five of these feet per line:
> "But **soft**! What **light** through **yon**der **win**dow **breaks**?"

This rhythm closely mirrors the natural heartbeat and the standard pattern of spoken English, giving the plays their flowing, musical quality.

---

### 3. Key Dramatic Devices

* **Dramatic Irony**: Occurs when the audience possesses vital information that characters on stage lack. For example, in *Romeo and Juliet*, we know Juliet is merely asleep under a potion, but Romeo believes she is dead, heightening the tragedy.
* **Foreshadowing**: Subtle hints of what is to come, such as the witches' ominous prophecies in *Macbeth* which forecast the rise and fall of the king.`
  },
  // ================= ECONOMICS =================
  {
    id: "econ-supply-demand",
    title: "Principles of Microeconomics: Supply & Demand",
    subject: "Economics",
    difficulty: "Beginner",
    description: "Master the cornerstone of economic theory: how price and quantity are determined in free market systems.",
    readTime: "8 min read",
    objectives: [
      "Formulate the Laws of Supply and Demand",
      "Determine how markets reach competitive equilibrium",
      "Predict price shifts resulting from changes in supply and demand curves"
    ],
    keyTerms: [
      { term: "Equilibrium Price", definition: "The price at which the quantity demanded by consumers exactly equals the quantity supplied by producers." },
      { term: "Ceteris Paribus", definition: "A Latin phrase meaning 'all other things remaining equal', used to isolate the effect of a single variable." },
      { term: "Shortage", definition: "A market condition occurring when the price is set below equilibrium, causing demand to exceed supply." }
    ],
    contentMarkdown: `### 1. The Law of Demand

The **Law of Demand** states that, *ceteris paribus* (all other things being equal), as the price of a good falls, the quantity demanded rises, and vice versa.

* **The Income Effect**: As prices drop, consumers can afford more of the good with their current income.
* **The Substitution Effect**: As a good becomes cheaper, consumers substitute it for more expensive alternatives.

---

### 2. The Law of Supply

The **Law of Supply** states that, *ceteris paribus*, as the price of a good rises, the quantity supplied by producers also rises.

* **Profit Incentive**: Higher prices signal to suppliers that producing this item is more profitable, prompting them to allocate more resources.
* **Increasing Marginal Costs**: As production scales up, cost of additional units typically rises, requiring higher prices to justify expansion.

---

### 3. Market Equilibrium

When you plot both the supply curve (upward sloping) and the demand curve (downward sloping) on a graph, their intersection marks the **market equilibrium**.

#### Market Self-Correction
* **Surplus**: If price is too high, supply exceeds demand. To clear inventory, sellers cut prices until equilibrium is restored.
* **Shortage**: If price is too low, demand exceeds supply. Desperate buyers bid up the price, encouraging suppliers to produce more until equilibrium is reached.`
  },
  // ================= PSYCHOLOGY =================
  {
    id: "psych-cognitive-biases",
    title: "Cognitive Biases in Human Decision-Making",
    subject: "Psychology",
    difficulty: "Intermediate",
    description: "Investigate the systematic errors in thinking that affect the decisions and judgments people make daily.",
    readTime: "10 min read",
    objectives: [
      "Differentiate between heuristics and cognitive biases",
      "Identify major biases like confirmation bias, availability heuristic, and framing",
      "Explain the evolutionary basis for cognitive shortcuts"
    ],
    keyTerms: [
      { term: "Heuristic", definition: "A mental shortcut or rule-of-thumb that helps people make fast, efficient decisions." },
      { term: "Confirmation Bias", definition: "The tendency to search for, interpret, and recall information in a way that confirms one's pre-existing beliefs." },
      { term: "Framing Effect", definition: "A bias where people react differently to information depending on whether it is presented positively or negatively." }
    ],
    contentMarkdown: `### 1. Heuristics vs. Biases

The human brain processes millions of sensory inputs per second. To survive, it developed **heuristics**—mental shortcuts that allow us to make lightning-fast decisions without exhausting cognitive resources. 

However, while heuristics are generally useful, they lead to systematic, predictable errors called **cognitive biases**.

---

### 2. Three Major Cognitive Biases

* **Confirmation Bias**: We actively seek out opinions that match ours while filtering out opposing data. In the digital age, social media algorithms exploit this bias by feeding users content that reinforces their ideological bubbles.
* **The Availability Heuristic**: We judge the likelihood of an event based on how easily examples of it come to mind. For instance, people often fear shark attacks or plane crashes more than car accidents, simply because the former receive sensationalized media coverage and are more memorable.
* **The Framing Effect**: Decisions are heavily influenced by the way options are presented. A medical procedure described as having a "90% survival rate" is perceived far more favorably than one with a "10% mortality rate," despite the statistical facts being identical.

---

### 3. Mitigating Cognitive Bias

Awareness is the first step, but it is rarely enough. True mitigation requires structural safeguards:
1. **Falsification**: Actively try to prove your own hypotheses wrong.
2. **De-biasing Teams**: Appoint a "devil's advocate" in decision-making groups to challenge consensus.
3. **Delayed Decisions**: Sleep on critical choices to allow analytical thinking (System 2) to override emotional intuition (System 1).`
  },
  // ================= PHILOSOPHY =================
  {
    id: "phil-epistemology",
    title: "Introduction to Epistemology: What is Knowledge?",
    subject: "Philosophy",
    difficulty: "Advanced",
    description: "Analyze the nature, scope, and limits of human knowledge, exploring the classic debate between Rationalism and Empiricism.",
    readTime: "12 min read",
    objectives: [
      "Deconstruct the traditional definition of knowledge as Justified True Belief (JTB)",
      "Contrast the tenets of Rationalism with those of Empiricism",
      "Understand the impact of Gettier cases on epistemology"
    ],
    keyTerms: [
      { term: "Epistemology", definition: "The philosophical study of the nature, origin, and limits of human knowledge." },
      { term: "A Priori", definition: "Knowledge that is independent of sensory experience, derived purely through reason (e.g., mathematics)." },
      { term: "A Posteriori", definition: "Knowledge derived from sensory experience and empirical observation (e.g., scientific data)." }
    ],
    contentMarkdown: `### 1. What is Knowledge? The Tripartite Theory

For centuries, philosophers accepted Plato's definition of knowledge as **Justified True Belief (JTB)**. According to this tripartite theory, you know a proposition $P$ if and only if:
1. You **believe** that $P$ is true.
2. $P$ is **actually true**.
3. You have sufficient **justification** for believing that $P$ is true.

#### The Gettier Challenge
In 1963, philosopher Edmund Gettier published a three-page paper that shattered this consensus. He presented scenarios where a person had a Justified True Belief that was correct purely by *coincidence* or luck. This proved that JTB is not sufficient for knowledge, sparking modern epistemological research.

---

### 2. Rationalism vs. Empiricism

The core debate in epistemology concerns the source of our concepts and knowledge.

| Philosophical Stance | Core Idea | Primary Source of Knowledge | Famous Proponents |
| :--- | :--- | :--- | :--- |
| **Rationalism** | Some knowledge is innate and can be discovered through pure intellect alone. | Intellect and logical reasoning ($A\ priori$). | René Descartes, Baruch Spinoza, Gottfried Leibniz |
| **Empiricism** | The mind is a blank slate (*tabula rasa*) at birth; all knowledge comes from sensory experience. | Observation and scientific measurement ($A\ posteriori$). | John Locke, George Berkeley, David Hume |

---

### 3. Descartes' Radical Doubt

To find an indubitable foundation for knowledge, René Descartes resolved to doubt everything that could possibly be doubted—including his senses, physical laws, and even whether he was dreaming. 

He realized he could doubt everything except the fact that he was doubting (thinking). This led to his famous formulation:
> *"Cogito, ergo sum"* (I think, therefore I am).

Descartes used this single certain truth to reconstruct his entire system of rationalist knowledge.`
  },
  // ================= ART HISTORY =================
  {
    id: "art-renaissance",
    title: "Renaissance Masterpieces & Techniques",
    subject: "Art History",
    difficulty: "Intermediate",
    description: "Examine the artistic rebirth of Europe, highlighting the transition from medieval symbolism to humanism and linear perspective.",
    readTime: "9 min read",
    objectives: [
      "Trace the shift from medieval flatness to Renaissance depth and proportion",
      "Define key artistic techniques like Chiaroscuro and Sfumato",
      "Examine the humanist philosophies underpinning masterpieces like the Sistine Chapel"
    ],
    keyTerms: [
      { term: "Linear Perspective", definition: "A mathematical system for creating the illusion of space and distance on a flat surface using a horizon line and vanishing points." },
      { term: "Sfumato", definition: "An artistic technique of blending colors and tones so subtly that there is no perceptible transition (derived from the Italian word for smoke)." },
      { term: "Humanism", definition: "A Renaissance cultural movement that turned away from medieval scholasticism and revived interest in ancient Greek and Roman thought." }
    ],
    contentMarkdown: `### 1. The Geometry of Space: Linear Perspective

Before the 15th century, Medieval art prioritized spiritual hierarchy over physical realism; holy figures were painted larger than commoners, and scenes appeared flat and compressed.

In the early 1400s, Florentine architect **Filippo Brunelleschi** mathematically formulated **linear perspective**. 

#### How It Works
By establishing a single **horizon line** and a **vanishing point** where parallel orthogonal lines converge, artists could finally paint three-dimensional depth on a two-dimensional canvas with mathematical precision. Masaccio's fresco *The Holy Trinity* was one of the first masterpieces to employ this groundbreaking system.

---

### 2. Master Techniques: Leonardo's Light and Shade

The High Renaissance produced some of the most famous visual styles in history, largely driven by technical innovations in paint application:

* **Chiaroscuro**: The dramatic contrast between light and dark values to model three-dimensional forms, giving figures weight and volume.
* **Sfumato**: Leonardo da Vinci's signature technique. Instead of drawing sharp outlines, Leonardo blended colors and shades like smoke, visible in the soft transitions on the face of the *Mona Lisa*. This created unprecedented lifelike soft-focus effects.

---

### 3. Humanism and the Renaissance Spirit

At its core, the Renaissance (meaning "Rebirth") was fueled by **humanism**—a cultural shift that placed human agency, intellect, and physical beauty at the center of inquiry, inspired by Classical Greco-Roman texts.

This is beautifully illustrated in Michelangelo's ceiling of the **Sistine Chapel**:
* **Physical realism**: Figures are depicted with detailed, muscular anatomy, showing a celebration of the human form.
* **Intellectual synthesis**: Michelangelo integrated classical pagan sibyls alongside biblical prophets, reflecting the humanist desire to reconcile classical philosophy with Christian theology.`
  }
];
