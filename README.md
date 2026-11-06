# FestFlow: Pure C++ Glass Box Logistics & DSA Engine

> **Academic Evaluation Grade:** A+ Distinction  
> **Course Code:** 15B17CI371 (Data Structures Lab)  
> **Architecture:** Pure C++ Monolithic Translation Unit (`FestFlowEngine.cpp`)  
> **Zero External Databases:** 100% In-RAM, raw pointer memory management, zero STL containers for core structures.

---

## Team Division & Contribution Matrix

| Module | Team Member | Data Structures & Features | Line Count (`FestFlowEngine.cpp`) |
| :--- | :--- | :--- | :---: |
| **Module 1** | **Shourya** | &bull; Bloom Filter (Bit Array)<br>&bull; Chained Hash Table (Ticket Registry)<br>&bull; Event DAG (Graph & Dijkstra Routing)<br>&bull; Gate Turnstile Scan Feature | **321 lines** (L86–L337, L953–L1022) |
| **Module 2** | **Priyanshi** | &bull; Interval Tree (Augmented BST Clash Detection)<br>&bull; Segment Tree (Range Sum Crowd Capacity)<br>&bull; Event Slot Booking Feature<br>&bull; Crowd Influx & Range Query Feature | **190 lines** (L338–L497, L1023–L1052) |
| **Module 3** | **Riddhi** | &bull; Max-Heap (Priority Queue Emergency Triage)<br>&bull; Circular Queue (Ring Buffer Judge Allocation)<br>&bull; AVL Tree (Self-Balancing Tie-Break Leaderboard)<br>&bull; Emergency Evac, Judge Allocation & Score Posting | **214 lines** (L498–L668, L1053–L1095) |
| **Module 4** | **Dhruv** | &bull; 26-Way Prefix Trie (Attendee Name Autocomplete)<br>&bull; Suffix Array (Rulebook Binary Substring Search)<br>&bull; Doubly Linked List (Undo History Stack)<br>&bull; Global State Rollback Undo Feature | **202 lines** (L669–L842, L1096–L1123) |

---

## Quick Start for Teammates

### 1. Clone the Repository
```bash
git clone https://github.com/mittaldhruv27/FestFlow.git
cd FestFlow
```

### 2. Compilation (Any Platform)

Compile the entire engine in a single command using any C++17 compiler:

**macOS / Linux:**
```bash
clang++ -std=c++17 -O2 -Wall -Wextra FestFlowEngine.cpp -o festflow
# Or with GCC:
# g++ -std=c++17 -O2 -Wall -Wextra FestFlowEngine.cpp -o festflow
```

**Windows (MinGW / WSL):**
```bash
g++ -std=c++17 -O2 FestFlowEngine.cpp -o festflow.exe -lws2_32
```

### 3. Run the Engine & Launch Web Dashboard
```bash
./festflow
# On Windows:
# festflow.exe
```

* **Interactive CLI Terminal:** Test algorithmic lookups, tree visualizers, and state narrator directly.
* **Live Observability Dashboard:** Open [http://localhost:8080](http://localhost:8080) in any web browser.

### 4. Run the 2,000-Node Stress Test
Directly from terminal:
```bash
./festflow --stress-test
```
Or click the `Run 2,000-Node Stress Test` button on the live web dashboard.

---

## The 11 Data Structures & Syllabus Mapping

| # | Data Structure | Syllabus Module | Practical Fest Logistics Role |
|---|---|:---:|---|
| **1** | **Bloom Filter (3-Hash Bit Array)** | *Advanced Feature* | Space-efficient O(1) fast-path ticket duplicate & screenshot fraud detection. |
| **2** | **Chained Hash Table** | **Module 6** (Hashing) | O(1) ticket registry with division method hash and linked-list collision handling. |
| **3** | **Event DAG (Adjacency List)** | **Module 5** (Graphs) | O(V+E) event prerequisite tracking (Kahn's Topo-Sort) & Dijkstra campus emergency evacuation routing. |
| **4** | **Interval Tree (Augmented BST)** | **Module 6** (Interval Tree) | O(log N) schedule clash detection with augmented subtree max_end bounds. |
| **5** | **Segment Tree (Array-Based)** | **Module 6** (Segment Tree) | O(log N) point updates & range sum queries for campus venue sector capacities. |
| **6** | **Priority Queue (Max-Heap)** | **Module 4** (Binary Heap) | O(log N) medical and VIP emergency dispatch triage bypass (heapifyUp / heapifyDown). |
| **7** | **Circular Queue (Ring Buffer)** | **Module 1** (Queue OOP) | O(1) round-robin judge assignment across project stalls using modulo arithmetic. |
| **8** | **AVL Tree (Self-Balancing BST)** | **Module 4** (AVL Tree) | O(log N) live hackathon leaderboard with composite key tie-breaking and strict rotations. |
| **9** | **Trie (26-Way Prefix Tree)** | **Module 6** (Tries) | O(L) instant attendee name autocomplete and campus entry status inspection. |
| **10** | **Suffix Array (Sorted Indices)** | **Module 6** (Suffix Array) | O(M log N) full-text binary substring search across the Fest Code of Conduct rulebook. |
| **11** | **Doubly Linked List** | **Module 3** (Lists) | O(1) multi-structure atomic undo stack tracking inverse mutations via prev <-> next pointers. |

---

## Frontend Design Specifications

* **Aesthetic:** Minimalist, calm, editorial design. Warm cream background (`#f7f4ee`) with soft matte pastel terracotta buttons (`#e99276`), zero neon glare.
* **Typography:** Pure Google Sans and JetBrains Mono throughout.
* **Opening Sequence:** Warm fluid orbiting metaballs that seamlessly morph and glide into the left-hand action tiles on launch.
* **Left Sidebar:** Large tactile action tiles + dedicated "Browse Structures (1-11) ->" button (reveals all 11 data structures).
* **Right Stage:** Spacious, uncluttered canvas displaying the active data structure with live interactive state controls.
* **Telemetry Bar:** Live monospace console streaming microsecond execution logs.

---

## Live Stress Test Benchmark Results

```text
========================================================
LAUNCHING 2,000-NODE DYNAMIC STRESS TESTER (RAM ONLY)
========================================================
2,000 NODES INSERTED SUCCESSFULLY IN 2.01 ms (0.002 seconds)
--------------------------------------------------------
* Hash Table:    2,001 nodes | Load Factor: 7.79 | Collisions: 1744
* Bloom Filter:  1,001 tickets indexed (0 false negatives)
* Trie:          2,001 Indian attendee names indexed for prefix search
* AVL Tree:      2,001 team scores balanced (Height: 11 = ceil(log2(2001)))
* Segment Tree:  Total Campus Attendance Tally: 2001
========================================================
```
