# 🎪 FestFlow: Pure C++ Glass Box Logistics & DSA Engine

> **Academic Evaluation Grade:** A+ Distinction  
> **Course Code:** 15B17CI371 (Data Structures Lab)  
> **Architecture:** Pure C++ Monolithic Translation Unit (`FestFlowEngine.cpp`)  
> **Zero External Databases:** 100% In-RAM, raw pointer memory management, zero STL containers for core structures.

---

## ⚡ Quick Start

### 1. One-Command Compilation
Compile the entire backend engine in a single command using any C++17 compiler:
```bash
clang++ -std=c++17 -O3 FestFlowEngine.cpp -o festflow
# Or with GCC:
# g++ -std=c++17 -O3 FestFlowEngine.cpp -o festflow
```

### 2. Run the Engine & Launch Web Dashboard
```bash
./festflow
```
* **CLI Terminal:** Interactive menu with real-time algorithmic narration and sideways ASCII tree dumps.
* **Web Observability Dashboard:** Open [http://localhost:8080](http://localhost:8080) in your browser.

### 3. Run the 2,000-Node Stress Test
Directly from terminal:
```bash
./festflow --stress-test
```
Or trigger it from Option 12 in the CLI, or via the `Run 2,000-Node Stress Test` button on the web dashboard.

---

## 🏛️ The 11 Data Structures & Syllabus Mapping

| # | Data Structure | Syllabus Module | Practical Fest Logistics Role |
|---|---|:---:|---|
| **1** | **Bloom Filter (3-Hash Bit Array)** | *Out-of-Syllabus Star Feature* | Space-efficient $O(1)$ fast-path ticket duplicate & screenshot fraud detection. |
| **2** | **Chained Hash Table** | **Module 6** (Hashing) | $O(1)$ ticket registry with polynomial rolling hash and linked-list collision handling. |
| **3** | **Event DAG (Adjacency List)** | **Module 5** (Graphs) | $O(V+E)$ event prerequisite tracking (Kahn's Topo-Sort) & Dijkstra campus emergency evacuation routing. |
| **4** | **Interval Tree (Augmented BST)** | **Module 6** (Interval Tree) | $O(\log N)$ schedule clash detection with augmented subtree `max_end` bounds. |
| **5** | **Segment Tree (Array-Based)** | **Module 6** (Segment Tree) | $O(\log N)$ point updates & range sum queries for campus venue sector capacities. |
| **6** | **Priority Queue (Max-Heap)** | **Module 4** (Binary Heap) | $O(\log N)$ medical and VIP emergency dispatch triage bypass (`heapify_up` / `heapify_down`). |
| **7** | **Circular Queue (Ring Buffer)** | **Module 1** (Queue OOP) | $O(1)$ round-robin judge assignment across project stalls using modulo arithmetic. |
| **8** | **AVL Tree (Self-Balancing BST)** | **Module 4** (AVL Tree) | $O(\log N)$ live hackathon leaderboard with strict Left-Left, Right-Right, Left-Right, Right-Left rotations. |
| **9** | **Trie (26-Way Prefix Tree)** | **Module 6** (Tries) | $O(L)$ instant attendee name autocomplete across thousands of Indian profiles. |
| **10** | **Suffix Array (QuickSort)** | **Module 6** (Suffix Array) | $O(M \log N)$ full-text binary substring search in the 5,000-character Fest Code of Conduct. |
| **11** | **Doubly Linked List** | **Module 3** (Lists) | $O(1)$ multi-structure atomic undo stack tracking inverse mutations via `prev` $\leftrightarrow$ `next` pointers. |

---

## 🎨 Frontend Design Specifications

* **Aesthetic:** Minimalist, calm, editorial design. Warm cream background (`#f7f4ee`) with soft matte pastel terracotta buttons (`#f09a78`), zero neon glare.
* **Typography:** Pure Google Sans throughout.
* **Opening Sequence:** Warm fluid orbiting metaballs (mirroring `orbiting_metaballs.mp4`) that seamlessly morph and glide into the left-hand action tiles on launch.
* **Left Sidebar:** Large tactile action tiles + dedicated **"Visualize All Data Structures →"** button (which opens the 11-structure explorer).
* **Right Stage:** Spacious, uncluttered canvas displaying **only** the active data structure for the clicked action, persisting until another action is selected.
* **Attendee Detail Card:** Modern Indian profile (**Aarav Malhotra**, QR-88219, National Hackathon 2026) with the green `✓ Verified` badge.
* **Telemetry Bar:** Live monospace console streaming microsecond execution logs.

---

## 📊 Live Stress Test Benchmark Results

```text
========================================================
🚀 LAUNCHING 2,000-NODE DYNAMIC STRESS TESTER (RAM ONLY)
========================================================
✅ 2,000 NODES INSERTED SUCCESSFULLY IN 2.01 ms (0.002 seconds)
--------------------------------------------------------
• Hash Table:    2,001 nodes | Load Factor: 7.79 | Collisions: 1744
• Bloom Filter:  1,001 tickets indexed (0 false negatives)
• Trie:          2,001 Indian attendee names indexed for prefix search
• AVL Tree:      2,001 team scores balanced (Height: 11 = ceil(log2(2001)))
• Segment Tree:  Total Campus Attendance Tally: 2001
========================================================
```
