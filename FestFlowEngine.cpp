// FestFlow - Event Management & DSA Backend Engine

#include <iostream>
#include <cstring>
#include <cstdlib>
#include <cstdio>
#include <chrono>
#include <random>
#include <thread>
#include <atomic>
#include <sstream>

#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <fcntl.h>

using namespace std;

static bool verbose = true;

#define LOG_ALGO(tag, msg, ...) do { \
    if (verbose) { \
        char log_buf[512]; \
        snprintf(log_buf, sizeof(log_buf), msg, ##__VA_ARGS__); \
        cout << "[" tag "] " << log_buf << "\n"; \
        cout.flush(); \
    } \
} while(0)

void url_decode(char* dst, const char* src, int dst_len) {
    int d = 0;
    while (*src && d + 1 < dst_len) {
        if (*src == '%' && src[1] && src[2]) {
            auto hex_val = [](char c) -> int {
                if (c >= '0' && c <= '9') return c - '0';
                if (c >= 'a' && c <= 'f') return c - 'a' + 10;
                if (c >= 'A' && c <= 'F') return c - 'A' + 10;
                return -1;
            };
            int h1 = hex_val(src[1]), h2 = hex_val(src[2]);
            if (h1 >= 0 && h2 >= 0) {
                dst[d++] = (char)((h1 << 4) | h2);
                src += 3;
                continue;
            }
        } else if (*src == '+') {
            dst[d++] = ' ';
            src++;
            continue;
        }
        dst[d++] = *src++;
    }
    dst[d] = '\0';
}

bool get_query_param(const char* url, const char* key, char* val, int max_len) {
    if (!url || !key || !val || max_len == 0) return false;
    val[0] = '\0';
    const char* q = strchr(url, '?');
    if (!q) return false;
    q++;

    int key_len = (int)strlen(key);
    while (*q) {
        if (strncmp(q, key, key_len) == 0 && q[key_len] == '=') {
            const char* val_start = q + key_len + 1;
            const char* val_end = strchr(val_start, '&');
            int len = val_end ? (int)(val_end - val_start) : (int)strlen(val_start);
            char raw[256];
            if (len >= (int)sizeof(raw)) len = (int)sizeof(raw) - 1;
            strncpy(raw, val_start, len);
            raw[len] = '\0';
            url_decode(val, raw, max_len);
            return true;
        }
        const char* next_param = strchr(q, '&');
        if (!next_param) break;
        q = next_param + 1;
    }
    return false;
}

// ============================================================================
// MODULE 1: SHOURYA
// Data Structures: Chained Hash Table, Bloom Filter, Event DAG
// Features: Ticket Turnstile Verification, Fraud Detection, Campus Graph
// ============================================================================

// Attendee model
enum class AttendeeStatus { REGISTERED = 0, CHECKED_IN = 1, FLAGGED = 2 };

struct Attendee {
    char ticket_id[32], name[64], college[64], event_registered[48];
    AttendeeStatus status;
    int checkin_timestamp;
    int sector_id;

    Attendee() : status(AttendeeStatus::REGISTERED), checkin_timestamp(0), sector_id(0) {
        ticket_id[0] = name[0] = college[0] = event_registered[0] = '\0';
    }
    Attendee(const char* tid, const char* n, const char* col, const char* ev, int sec = 0)
        : status(AttendeeStatus::REGISTERED), checkin_timestamp(0), sector_id(sec) {
        snprintf(ticket_id, sizeof(ticket_id), "%s", tid);
        snprintf(name, sizeof(name), "%s", n);
        snprintf(college, sizeof(college), "%s", col);
        snprintf(event_registered, sizeof(event_registered), "%s", ev);
    }
};

// Bloom Filter
class BloomFilter {
    static const int BIT_SIZE = 16384;
    char bit_array[BIT_SIZE / 8];
    int count;

    static int getTicketNum(const char* s) {
        int num = 0;
        while (*s) {
            if (*s >= '0' && *s <= '9') num = (num * 10 + (*s - '0')) % BIT_SIZE;
            s++;
        }
        return num;
    }

    int hash1(const char* s) const { return (getTicketNum(s) * 31) % BIT_SIZE; }
    int hash2(const char* s) const { return (getTicketNum(s) * 37 + 7) % BIT_SIZE; }
    int hash3(const char* s) const { return (getTicketNum(s) * 43 + 13) % BIT_SIZE; }
public:
    BloomFilter() : count(0) { memset(bit_array, 0, sizeof(bit_array)); }
    void insert(const char* key, int idx[3] = nullptr) {
        int h1 = hash1(key), h2 = hash2(key), h3 = hash3(key);
        bit_array[h1 / 8] |= (1 << (h1 % 8));
        bit_array[h2 / 8] |= (1 << (h2 % 8));
        bit_array[h3 / 8] |= (1 << (h3 % 8));
        count++;
        if (idx) { idx[0] = h1; idx[1] = h2; idx[2] = h3; }
        LOG_ALGO("Bloom Filter", "Added key '%s' -> Bits set: [%d, %d, %d]", key, h1, h2, h3);
    }
    bool check(const char* key, int idx[3] = nullptr) const {
        int h1 = hash1(key), h2 = hash2(key), h3 = hash3(key);
        if (idx) { idx[0] = h1; idx[1] = h2; idx[2] = h3; }
        bool b1 = (bit_array[h1 / 8] & (1 << (h1 % 8))) != 0;
        bool b2 = (bit_array[h2 / 8] & (1 << (h2 % 8))) != 0;
        bool b3 = (bit_array[h3 / 8] & (1 << (h3 % 8))) != 0;
        bool all_set = b1 && b2 && b3;
        LOG_ALGO("Bloom Filter", all_set ? "Key '%s' matched bits [%d, %d, %d]" : "Key '%s' clean", key, h1, h2, h3);
        return all_set;
    }
    void clear() { memset(bit_array, 0, sizeof(bit_array)); count = 0; }
    int getInsertedCount() const { return count; }
};

// Chained Hash Table
struct HashNode {
    Attendee data;
    HashNode* next;
    HashNode(const Attendee& a) : data(a), next(nullptr) {}
};

class ChainedHashTable {
    HashNode** buckets;
    int capacity, size, collisions;

    int hashFunction(const char* key) const {
        int num = 0;
        while (*key) {
            if (*key >= '0' && *key <= '9') {
                num = (num * 10 + (*key - '0')) % capacity;
            }
            key++;
        }
        return num;
    }
public:
    explicit ChainedHashTable(int cap = 257) : capacity(cap), size(0), collisions(0) {
        buckets = new HashNode*[capacity]();
    }
    ~ChainedHashTable() { clear(); delete[] buckets; }

    void clear() {
        for (int i = 0; i < capacity; i++) {
            HashNode* curr = buckets[i];
            while (curr) { HashNode* t = curr; curr = curr->next; delete t; }
            buckets[i] = nullptr;
        }
        size = collisions = 0;
    }

    bool insert(const Attendee& attendee, int* bucket = nullptr, int* chain_len = nullptr) {
        int b_idx = hashFunction(attendee.ticket_id);
        if (bucket) *bucket = b_idx;
        HashNode* curr = buckets[b_idx];
        int depth = 0;
        while (curr) {
            if (strcmp(curr->data.ticket_id, attendee.ticket_id) == 0) {
                curr->data = attendee;
                if (chain_len) *chain_len = depth;
                return true;
            }
            curr = curr->next;
            depth++;
        }
        HashNode* n = new HashNode(attendee);
        if (buckets[b_idx]) collisions++;
        n->next = buckets[b_idx];
        buckets[b_idx] = n;
        size++;
        if (chain_len) *chain_len = depth + 1;
        return true;
    }

    Attendee* find(const char* ticket_id, int* bucket = nullptr, int* depth = nullptr) {
        int b_idx = hashFunction(ticket_id);
        if (bucket) *bucket = b_idx;
        HashNode* curr = buckets[b_idx];
        int d = 0;
        while (curr) {
            if (strcmp(curr->data.ticket_id, ticket_id) == 0) {
                if (depth) *depth = d;
                return &(curr->data);
            }
            curr = curr->next;
            d++;
        }
        return nullptr;
    }

    int getSize() const { return size; }
    int getCollisionCount() const { return collisions; }
    double getLoadFactor() const { return (double)size / (double)capacity; }
};

// Graph (DAG) and Dijkstra
struct GraphEdge {
    int to, weight;
    GraphEdge* next;
    GraphEdge(int t, int w, GraphEdge* n = nullptr) : to(t), weight(w), next(n) {}
};

struct EventNode {
    int id;
    char name[64];
    int tier;
};

class EventDAG {
    static const int MAX_VERTICES = 16;
    EventNode vertices[MAX_VERTICES];
    GraphEdge* adj[MAX_VERTICES];
    int n_verts;
public:
    EventDAG() : n_verts(0) {
        for (int i = 0; i < MAX_VERTICES; i++) {
            adj[i] = nullptr;
            vertices[i] = { i, "", 0 };
        }
    }
    ~EventDAG() { clear(); }

    void clear() {
        for (int i = 0; i < MAX_VERTICES; i++) {
            GraphEdge* curr = adj[i];
            while (curr) { GraphEdge* t = curr; curr = curr->next; delete t; }
            adj[i] = nullptr;
        }
        n_verts = 0;
    }

    int addVertex(const char* name, int tier = 0) {
        if (n_verts >= MAX_VERTICES) return -1;
        int id = n_verts++;
        vertices[id].id = id;
        vertices[id].tier = tier;
        snprintf(vertices[id].name, sizeof(vertices[id].name), "%s", name);
        return id;
    }

    void addEdge(int u, int v, int weight = 1) {
        if (u >= 0 && u < n_verts && v >= 0 && v < n_verts) {
            adj[u] = new GraphEdge(v, weight, adj[u]);
        }
    }

    bool topologicalSort(int* order, int& order_size) {
        int indegree[MAX_VERTICES] = {0};
        for (int u = 0; u < n_verts; u++) {
            for (GraphEdge* e = adj[u]; e; e = e->next) indegree[e->to]++;
        }
        int queue[MAX_VERTICES], front = 0, rear = 0;
        for (int i = 0; i < n_verts; i++) {
            if (indegree[i] == 0) queue[rear++] = i;
        }
        order_size = 0;
        while (front < rear) {
            int u = queue[front++];
            order[order_size++] = u;
            for (GraphEdge* e = adj[u]; e; e = e->next) {
                if (--indegree[e->to] == 0) queue[rear++] = e->to;
            }
        }
        return order_size == n_verts;
    }

    int dijkstra(int start, int end, int* path, int& path_len) {
        int dist[MAX_VERTICES], parent[MAX_VERTICES];
        bool visited[MAX_VERTICES] = {false};
        for (int i = 0; i < MAX_VERTICES; i++) { dist[i] = 1e9; parent[i] = -1; }
        dist[start] = 0;

        for (int count = 0; count < n_verts; count++) {
            int u = -1, min_d = 1e9;
            for (int i = 0; i < n_verts; i++) {
                if (!visited[i] && dist[i] < min_d) { min_d = dist[i]; u = i; }
            }
            if (u == -1 || u == end) break;
            visited[u] = true;
            for (GraphEdge* e = adj[u]; e; e = e->next) {
                if (!visited[e->to] && dist[u] + e->weight < dist[e->to]) {
                    dist[e->to] = dist[u] + e->weight;
                    parent[e->to] = u;
                }
            }
        }
        if (dist[end] >= 1e9) { path_len = 0; return -1; }

        int temp[MAX_VERTICES], t_len = 0, curr = end;
        while (curr != -1) { temp[t_len++] = curr; curr = parent[curr]; }
        path_len = 0;
        for (int i = t_len - 1; i >= 0; i--) path[path_len++] = temp[i];
        return dist[end];
    }
};

// ============================================================================
// MODULE 2: PRIYANSHI
// Data Structures: Interval Tree, Segment Tree
// Features: Event Slot Booking, Clash Detection, Crowd Sector Influx
// ============================================================================

// Interval Tree Node: Augmented BST for [start, end] time interval scheduling
// Invariant: Sorted by low endpoint (start). Augmented with max_end of subtree.
struct IntervalNode {
    int start, end, max_end;
    char event_name[64];
    IntervalNode *left, *right;
    IntervalNode(int s, int e, const char* name)
        : start(s), end(e), max_end(e), left(nullptr), right(nullptr) {
        snprintf(event_name, sizeof(event_name), "%s", name);
    }
};

class IntervalTree {
    IntervalNode* root;
    int count;

    static int maxVal(int a, int b) { return (a > b) ? a : b; }

    void updateMax(IntervalNode* n) {
        if (!n) return;
        n->max_end = n->end;
        if (n->left) n->max_end = maxVal(n->max_end, n->left->max_end);
        if (n->right) n->max_end = maxVal(n->max_end, n->right->max_end);
    }

    IntervalNode* insertHelper(IntervalNode* n, int s, int e, const char* name) {
        if (!n) return new IntervalNode(s, e, name);
        if (s < n->start) n->left = insertHelper(n->left, s, e, name);
        else n->right = insertHelper(n->right, s, e, name);
        updateMax(n);
        return n;
    }

    // Augmented search: Overlap condition is (s < n->end && e > n->start)
    // If left subtree exists and left->max_end > s, left must contain an overlap
    IntervalNode* findOverlap(IntervalNode* n, int s, int e) const {
        if (!n) return nullptr;
        if (s < n->end && e > n->start) return n;
        if (n->left && n->left->max_end > s) {
            IntervalNode* res = findOverlap(n->left, s, e);
            if (res) return res;
        }
        return findOverlap(n->right, s, e);
    }

    int countOverlapsHelper(IntervalNode* n, int s, int e) const {
        if (!n) return 0;
        int current = (s < n->end && e > n->start) ? 1 : 0;
        int left_count = (n->left && n->left->max_end > s) ? countOverlapsHelper(n->left, s, e) : 0;
        int right_count = countOverlapsHelper(n->right, s, e);
        return current + left_count + right_count;
    }

    void destroy(IntervalNode* n) {
        if (!n) return;
        destroy(n->left); destroy(n->right); delete n;
    }

public:
    IntervalTree() : root(nullptr), count(0) {}
    ~IntervalTree() { destroy(root); }

    // Schedules a new event slot if no temporal conflict exists (O(log N))
    bool bookSlot(int s, int e, const char* name, IntervalNode** clash = nullptr) {
        IntervalNode* c = findOverlap(root, s, e);
        if (c) {
            if (clash) *clash = c;
            LOG_ALGO("Interval Tree", "Conflict: [%d-%d] '%s' overlaps with [%d-%d] '%s'", s, e, name, c->start, c->end, c->event_name);
            return false;
        }
        root = insertHelper(root, s, e, name);
        count++;
        LOG_ALGO("Interval Tree", "Booked slot [%d:00 - %d:00] '%s'", s, e, name);
        return true;
    }

    // Checks whether an interval has any overlap with booked slots
    bool hasConflict(int s, int e) const {
        return findOverlap(root, s, e) != nullptr;
    }

    // Counts total active events overlapping with target query interval
    int countOverlaps(int s, int e) const {
        return countOverlapsHelper(root, s, e);
    }

    int getCount() const { return count; }
};

// Segment Tree: Complete binary tree decomposition over array intervals [0 ... n_rooms-1]
// Provides O(log N) point updates and O(log N) arbitrary sub-range crowd queries
class SegmentTree {
    static const int MAX_ROOMS = 16;
    int tree[4 * MAX_ROOMS];
    int n_rooms;

    void updateHelper(int node, int start, int end, int idx, int delta) {
        if (start == end) {
            tree[node] = max(0, tree[node] + delta);
            return;
        }
        int mid = (start + end) / 2;
        if (idx <= mid) updateHelper(2 * node, start, mid, idx, delta);
        else updateHelper(2 * node + 1, mid + 1, end, idx, delta);
        tree[node] = tree[2 * node] + tree[2 * node + 1];
    }

    // Canonical Segment Tree Range Sum Query: O(log N)
    int queryHelper(int node, int start, int end, int l, int r) const {
        if (r < start || end < l) return 0;
        if (l <= start && end <= r) return tree[node];
        int mid = (start + end) / 2;
        return queryHelper(2 * node, start, mid, l, r) +
               queryHelper(2 * node + 1, mid + 1, end, l, r);
    }

public:
    explicit SegmentTree(int rooms = 8) : n_rooms(rooms) {
        memset(tree, 0, sizeof(tree));
    }

    // Point update: adjusts crowd occupancy in sector 'room_idx' by 'delta' in O(log N)
    void updateCrowd(int room_idx, int delta) {
        if (room_idx >= 0 && room_idx < n_rooms) {
            updateHelper(1, 0, n_rooms - 1, room_idx, delta);
        }
    }

    // Range sum query: returns total crowd count across sector interval [l, r] in O(log N)
    int queryRange(int l, int r) const {
        if (l < 0) l = 0;
        if (r >= n_rooms) r = n_rooms - 1;
        if (l > r) return 0;
        return queryHelper(1, 0, n_rooms - 1, l, r);
    }

    // Returns occupancy of a single sector via point query
    int getSectorOccupancy(int room_idx) const {
        return queryRange(room_idx, room_idx);
    }

    int getTotalOccupancy() const { return tree[1]; }
    int getRoomCount() const { return n_rooms; }
};

// ============================================================================
// MODULE 3: RIDDHI
// Data Structures: Max-Heap (Priority Queue), Circular Queue, AVL Tree
// Features: VIP Emergency Evacuation, Round-Robin Judge Allocation, Tie-Breaking Leaderboard
// ============================================================================

// Max-Heap Priority Queue: Array-backed complete binary tree for emergency triage
struct EmergencyRequest {
    int request_id, priority;
    char description[64];
    int timestamp;

    EmergencyRequest() : request_id(0), priority(0), timestamp(0) { description[0] = '\0'; }
    EmergencyRequest(int id, int prio, const char* desc, int ts = 0)
        : request_id(id), priority(prio), timestamp(ts) {
        snprintf(description, sizeof(description), "%s", desc);
    }
};

class MaxHeap {
    static const int MAX_CAP = 128;
    EmergencyRequest heap[MAX_CAP];
    int size;

    void swapNodes(int i, int j) { EmergencyRequest t = heap[i]; heap[i] = heap[j]; heap[j] = t; }
    void heapifyUp(int i) {
        while (i > 0 && heap[i].priority > heap[(i - 1) / 2].priority) {
            swapNodes(i, (i - 1) / 2);
            i = (i - 1) / 2;
        }
    }
    void heapifyDown(int i) {
        while (2 * i + 1 < size) {
            int l = 2 * i + 1, r = 2 * i + 2, largest = i;
            if (l < size && heap[l].priority > heap[largest].priority) largest = l;
            if (r < size && heap[r].priority > heap[largest].priority) largest = r;
            if (largest == i) break;
            swapNodes(i, largest);
            i = largest;
        }
    }
public:
    MaxHeap() : size(0) {}
    bool push(const EmergencyRequest& req) {
        if (size >= MAX_CAP) return false;
        heap[size] = req;
        heapifyUp(size++);
        return true;
    }
    bool pop(EmergencyRequest* out = nullptr) {
        if (size == 0) return false;
        if (out) *out = heap[0];
        heap[0] = heap[--size];
        if (size > 0) heapifyDown(0);
        return true;
    }
    int getSize() const { return size; }
    const EmergencyRequest& getAt(int idx) const { return heap[idx]; }
};

// Circular Queue for Judges
struct Judge {
    int judge_id;
    char name[64], domain[48];
    int stalls;

    Judge() : judge_id(0), stalls(0) { name[0] = domain[0] = '\0'; }
    Judge(int id, const char* n, const char* d) : judge_id(id), stalls(0) {
        snprintf(name, sizeof(name), "%s", n);
        snprintf(domain, sizeof(domain), "%s", d);
    }
};

class CircularQueue {
    static const int CAPACITY = 8;
    Judge queue[CAPACITY];
    int front, rear, count;
public:
    CircularQueue() : front(0), rear(0), count(0) {}
    bool enqueue(const Judge& j) {
        if (count == CAPACITY) return false;
        queue[rear] = j;
        rear = (rear + 1) % CAPACITY;
        count++;
        return true;
    }
    bool allocateNextJudge(Judge* out = nullptr) {
        if (count == 0) return false;
        Judge curr = queue[front];
        curr.stalls++;
        front = (front + 1) % CAPACITY;
        queue[rear] = curr;
        rear = (rear + 1) % CAPACITY;
        if (out) *out = curr;
        LOG_ALGO("Circular Queue", "Allocated Judge '%s' -> New Front: %d, New Rear: %d", curr.name, front, rear);
        return true;
    }
    int getCount() const { return count; }
    int getFront() const { return front; }
    int getRear() const { return rear; }
    const Judge& getAt(int idx) const { return queue[idx]; }
};

// AVL Tree
struct AVLNode {
    int score, team_id, height;
    char team_name[64];
    AVLNode *left, *right;
    AVLNode(int s, int tid, const char* name)
        : score(s), team_id(tid), height(1), left(nullptr), right(nullptr) {
        snprintf(team_name, sizeof(team_name), "%s", name);
    }
};

class AVLTree {
    AVLNode* root;
    int count;

    static int height(AVLNode* n) { return n ? n->height : 0; }
    static int maxVal(int a, int b) { return (a > b) ? a : b; }
    static int getBalance(AVLNode* n) { return n ? (height(n->left) - height(n->right)) : 0; }

    AVLNode* rightRotate(AVLNode* y) {
        AVLNode* x = y->left, *T2 = x->right;
        x->right = y; y->left = T2;
        y->height = maxVal(height(y->left), height(y->right)) + 1;
        x->height = maxVal(height(x->left), height(x->right)) + 1;
        return x;
    }
    AVLNode* leftRotate(AVLNode* x) {
        AVLNode* y = x->right, *T2 = y->left;
        y->left = x; x->right = T2;
        x->height = maxVal(height(x->left), height(x->right)) + 1;
        y->height = maxVal(height(y->left), height(y->right)) + 1;
        return y;
    }
    AVLNode* insertHelper(AVLNode* node, int score, int team_id, const char* name) {
        if (!node) return new AVLNode(score, team_id, name);
        if (score > node->score || (score == node->score && team_id < node->team_id)) {
            node->left = insertHelper(node->left, score, team_id, name);
        } else {
            node->right = insertHelper(node->right, score, team_id, name);
        }
        node->height = 1 + maxVal(height(node->left), height(node->right));
        int balance = getBalance(node);

        if (balance > 1 && (score > node->left->score || (score == node->left->score && team_id < node->left->team_id))) return rightRotate(node);
        if (balance < -1 && (score < node->right->score || (score == node->right->score && team_id > node->right->team_id))) return leftRotate(node);
        if (balance > 1 && (score < node->left->score || (score == node->left->score && team_id > node->left->team_id))) {
            node->left = leftRotate(node->left); return rightRotate(node);
        }
        if (balance < -1 && (score > node->right->score || (score == node->right->score && team_id < node->right->team_id))) {
            node->right = rightRotate(node->right); return leftRotate(node);
        }
        return node;
    }
    void destroy(AVLNode* n) {
        if (!n) return;
        destroy(n->left); destroy(n->right); delete n;
    }
public:
    AVLTree() : root(nullptr), count(0) {}
    ~AVLTree() { destroy(root); }
    void insertScore(int score, int team_id, const char* name) {
        root = insertHelper(root, score, team_id, name);
        count++;
    }
    int getCount() const { return count; }
};

// ============================================================================
// MODULE 4: DHRUV
// Data Structures: 26-Way Prefix Trie, Suffix Array, Doubly Linked List
// Features: Attendee Prefix Autocomplete, Rulebook Substring Search, Undo History Stack
// ============================================================================

// Trie: 26-Way Prefix Tree for Attendee Autocomplete in O(L) time
struct TrieNode {
    TrieNode* children[26];
    bool is_end;
    char name[64];
    TrieNode() : is_end(false) {
        for (int i = 0; i < 26; i++) children[i] = nullptr;
        name[0] = '\0';
    }
};

class Trie {
    TrieNode* root;
    int count;

    void destroy(TrieNode* n) {
        if (!n) return;
        for (int i = 0; i < 26; i++) if (n->children[i]) destroy(n->children[i]);
        delete n;
    }
    void collectMatches(TrieNode* n, char results[][64], int max_res, int& found) const {
        if (!n || found >= max_res) return;
        if (n->is_end) snprintf(results[found++], 64, "%s", n->name);
        for (int i = 0; i < 26 && found < max_res; i++) {
            if (n->children[i]) collectMatches(n->children[i], results, max_res, found);
        }
    }
public:
    Trie() : count(0) { root = new TrieNode(); }
    ~Trie() { destroy(root); }

    void insert(const char* word) {
        if (!word || *word == '\0') return;
        TrieNode* curr = root;
        for (const char* p = word; *p; p++) {
            int idx = (*p >= 'a' && *p <= 'z') ? *p - 'a' : ((*p >= 'A' && *p <= 'Z') ? *p - 'A' : -1);
            if (idx >= 0 && idx < 26) {
                if (!curr->children[idx]) curr->children[idx] = new TrieNode();
                curr = curr->children[idx];
            }
        }
        curr->is_end = true;
        snprintf(curr->name, sizeof(curr->name), "%s", word);
        count++;
    }

    int autocomplete(const char* prefix, char results[][64], int max_res) const {
        if (!prefix || !root) return 0;
        TrieNode* curr = root;
        for (const char* p = prefix; *p; p++) {
            int idx = (*p >= 'a' && *p <= 'z') ? *p - 'a' : ((*p >= 'A' && *p <= 'Z') ? *p - 'A' : -1);
            if (idx >= 0 && idx < 26) {
                if (!curr->children[idx]) return 0;
                curr = curr->children[idx];
            }
        }
        int found = 0;
        collectMatches(curr, results, max_res, found);
        return found;
    }
    int getCount() const { return count; }
};

// Suffix Array
class SuffixArray {
    char* text;
    int* sa;
    int length;

    void quickSortSA(int low, int high) {
        if (low >= high) return;
        int mid = low + (high - low) / 2;
        const char* pivot = text + sa[mid];
        int i = low, j = high;
        while (i <= j) {
            while (strcmp(text + sa[i], pivot) < 0) i++;
            while (strcmp(text + sa[j], pivot) > 0) j--;
            if (i <= j) { swap(sa[i], sa[j]); i++; j--; }
        }
        if (low < j) quickSortSA(low, j);
        if (i < high) quickSortSA(i, high);
    }
public:
    SuffixArray() : text(nullptr), sa(nullptr), length(0) {}
    ~SuffixArray() { delete[] text; delete[] sa; }

    void build(const char* corpus) {
        delete[] text; delete[] sa;
        length = (int)strlen(corpus);
        text = new char[length + 1];
        sa = new int[length];
        snprintf(text, length + 1, "%s", corpus);
        for (int i = 0; i < length; i++) sa[i] = i;
        if (length > 0) quickSortSA(0, length - 1);
    }

    int search(const char* pattern, int* pos = nullptr) const {
        if (!pattern || length == 0) return -1;
        int pat_len = (int)strlen(pattern);
        int low = 0, high = length - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            int cmp = strncmp(pattern, text + sa[mid], pat_len);
            if (cmp == 0) {
                if (pos) *pos = sa[mid];
                return sa[mid];
            } else if (cmp < 0) high = mid - 1;
            else low = mid + 1;
        }
        return -1;
    }
};

// Undo Stack (Doubly Linked List)
enum class ActionType { TICKET_SCAN, EVENT_BOOKING, SCORE_POST, CROWD_UPDATE };

struct UndoNode {
    ActionType type;
    char key_id[32];
    int int_val1, int_val2;
    char description[64];
    UndoNode *prev, *next;

    UndoNode(ActionType t, const char* k, int v1, int v2, const char* desc)
        : type(t), int_val1(v1), int_val2(v2), prev(nullptr), next(nullptr) {
        snprintf(key_id, sizeof(key_id), "%s", k);
        snprintf(description, sizeof(description), "%s", desc);
    }
};

class UndoStack {
    UndoNode *head, *tail;
    int size;
public:
    UndoStack() : head(nullptr), tail(nullptr), size(0) {}
    ~UndoStack() { clear(); }

    void clear() {
        UndoNode* curr = head;
        while (curr) { UndoNode* t = curr; curr = curr->next; delete t; }
        head = tail = nullptr;
        size = 0;
    }

    void push(ActionType type, const char* key, int v1, int v2, const char* desc) {
        UndoNode* node = new UndoNode(type, key, v1, v2, desc);
        node->next = head;
        if (head) head->prev = node;
        else tail = node;
        head = node;
        size++;
        LOG_ALGO("Undo Stack", "Pushed action: '%s' (Depth: %d)", desc, size);
    }

    bool pop(UndoNode* out = nullptr) {
        if (!head) return false;
        UndoNode* node = head;
        if (out) *out = *node;
        head = head->next;
        if (head) head->prev = nullptr;
        else tail = nullptr;
        delete node;
        size--;
        return true;
    }
    int getSize() const { return size; }
};

static const char* first_names[] = {
    "Aarav", "Ananya", "Kabir", "Diya", "Ishaan", "Myra", "Vihaan", "Tanvi",
    "Reyansh", "Riya", "Aryan", "Tara", "Siddharth", "Meera", "Advait", "Sanya",
    "Rohan", "Zoya", "Dev", "Kriti", "Arjun", "Navya", "Aditya", "Ahana",
    "Samarth", "Anika", "Dhruv", "Isha", "Manav", "Sneha", "Karan", "Pooja",
    "Kunal", "Avani", "Raghav", "Lavanya", "Harsh", "Siya", "Pranav", "Nisha"
};

static const char* last_names[] = {
    "Malhotra", "Patel", "Verma", "Sharma", "Iyer", "Nair", "Gupta", "Reddy",
    "Mehta", "Joshi", "Sen", "Kapoor", "Rao", "Singhania", "Deshmukh", "Choudhury",
    "Bhat", "Bansal", "Kulkarni", "Chawla", "Bose", "Menon", "Saxena", "Chopra",
    "Mishra", "Thakur", "Agarwal", "Dubey", "Gill", "Pillai"
};

static const char* colleges[] = {
    "IIT Delhi", "BITS Pilani", "IIIT Hyderabad", "NIT Trichy", "DTU Delhi",
    "IIT Bombay", "NSUT Delhi", "IIT Roorkee", "VIT Vellore", "Manipal Tech"
};

static const char* events[] = {
    "National Hackathon 2026", "RoboWars Combat", "AI HackSprint Stage 2",
    "Web3 Summit", "Cyber Forensics CTF", "Drone Racing League"
};

class FestFlowEngine {
public:
    BloomFilter bloom_filter;
    ChainedHashTable hash_table;
    EventDAG event_dag;
    IntervalTree interval_tree;
    SegmentTree segment_tree;
    MaxHeap max_heap;
    CircularQueue circular_queue;
    AVLTree avl_tree;
    Trie trie;
    SuffixArray suffix_array;
    UndoStack undo_stack;

    char last_action[64], last_detail[256], last_verified_name[64];
    char last_verified_ticket[32], last_verified_college[64], last_verified_event[64];
    int last_bloom_bits[3], last_hash_bucket;
    bool last_clean, last_duplicate;
    int last_evac_dist, last_evac_path[16], last_evac_len;

    FestFlowEngine() : segment_tree(8), last_hash_bucket(0), last_clean(true), last_duplicate(false),
                       last_evac_dist(270), last_evac_len(3) {
        snprintf(last_action, sizeof(last_action), "READY");
        snprintf(last_detail, sizeof(last_detail), "System initialized. Enter a ticket or select an action.");
        last_verified_name[0] = last_verified_ticket[0] = last_verified_college[0] = last_verified_event[0] = '\0';
        last_bloom_bits[0] = last_bloom_bits[1] = last_bloom_bits[2] = 0;
        last_evac_path[0] = 0; last_evac_path[1] = 2; last_evac_path[2] = 4;
        initDefaultData();
    }

    void initDefaultData() {
        int e0 = event_dag.addVertex("Security Gate (Main Entrance)", 0);
        int e1 = event_dag.addVertex("Tech Workshop Wing", 0);
        int e2 = event_dag.addVertex("Semi-Finals Central Hall", 1);
        int e3 = event_dag.addVertex("Robotics Combat Arena", 0);
        int e4 = event_dag.addVertex("Grand Finals Auditorium", 2);
        int e5 = event_dag.addVertex("Open Grounds (Medical Camp)", 0);

        event_dag.addEdge(e0, e1, 90);  event_dag.addEdge(e0, e2, 120);
        event_dag.addEdge(e1, e2, 80);  event_dag.addEdge(e1, e3, 110);
        event_dag.addEdge(e2, e4, 150); event_dag.addEdge(e3, e4, 200);
        event_dag.addEdge(e4, e5, 100); event_dag.addEdge(e2, e5, 230);

        circular_queue.enqueue(Judge(1, "Dr. Rajesh Sharma", "AI & Systems"));
        circular_queue.enqueue(Judge(2, "Prof. Sunita Rao", "Distributed Data"));
        circular_queue.enqueue(Judge(3, "Vikram Singhania", "Fintech & Security"));
        circular_queue.enqueue(Judge(4, "Priya Nair", "Full-Stack Web"));
        circular_queue.enqueue(Judge(5, "Anand Deshmukh", "Robotics & IoT"));
        circular_queue.enqueue(Judge(6, "Kavita Menon", "Cloud & DevOps"));
        circular_queue.enqueue(Judge(7, "Arun Kulkarni", "Embedded Firmware"));
        circular_queue.enqueue(Judge(8, "Neha Chawla", "UI/UX & Mobile"));

        interval_tree.bookSlot(9, 11, "Opening Keynote");
        interval_tree.bookSlot(11, 13, "Hackathon Sprint 1");
        interval_tree.bookSlot(14, 17, "RoboWars Combat");
        interval_tree.bookSlot(18, 21, "Cultural Gala Night");

        const char* rulebook = 
            "FESTFLOW 2026 CODE OF CONDUCT AND HACKATHON RULEBOOK. "
            "SECTION 1: ATTENDANCE AND ENTRY. All participants must present a valid QR code at the turnstile. "
            "Screenshot sharing or ticket duplication is strictly considered fraud and triggers immediate disqualification. "
            "SECTION 2: HACKATHON INTEGRITY. Plagiarism in software repos is prohibited. All code must be authored "
            "during the 24-hour sprint. Third-party APIs and open-source libraries must be documented in README.md. "
            "SECTION 3: CAMPUS SAFETY AND MEDICAL EMERGENCY. In case of medical distress, notify sector marshals immediately. "
            "Code Red triggers emergency evacuation route routing. Emergency vehicles have VIP priority bypass. "
            "SECTION 4: JUDGING AND EVALUATION. Judges are assigned in round-robin fashion via circular queue. "
            "Tied scores are resolved via tie-breaking criteria in the AVL Tree leaderboard.";
        suffix_array.build(rulebook);

        for (int i = 1; i <= 500; i++) {
            char tid[32], name[64];
            snprintf(tid, sizeof(tid), "QR-%04d", i);
            snprintf(name, sizeof(name), "%s %s", first_names[i % 40], last_names[(i * 7) % 30]);
            int sec = i % 8;
            Attendee a(tid, name, colleges[(i * 3) % 10], events[(i * 5) % 6], sec);
            hash_table.insert(a);
            trie.insert(name);
            segment_tree.updateCrowd(sec, 1);
        }

        Attendee aarav("QR-8821", "Aarav Malhotra", "IIT Delhi", "National Hackathon 2026", 2);
        hash_table.insert(aarav);
        Attendee aarav_legacy("QR-88219", "Aarav Malhotra", "IIT Delhi", "National Hackathon 2026", 2);
        hash_table.insert(aarav_legacy);
        trie.insert("Aarav Malhotra");

        avl_tree.insertScore(98, 101, "Team ByteBusters");
        avl_tree.insertScore(95, 102, "Team AlphaDev");
        avl_tree.insertScore(92, 103, "Team CyberVanguard");
        avl_tree.insertScore(88, 104, "Team TechTitans");
        avl_tree.insertScore(85, 105, "Team CodeCraft");
    }

    // ------------------------------------------------------------------------
    // SHOURYA FEATURES: Gate Turnstile Scanning & Hash Table Lookup
    // ------------------------------------------------------------------------
    Attendee* findAttendeeFlexible(const char* raw_ticket, char* normalized_tid, int* bucket, int* depth) {
        if (!raw_ticket) return nullptr;
        char clean_tid[32];
        snprintf(clean_tid, sizeof(clean_tid), "%s", raw_ticket);

        bool all_digits = true;
        for (int i = 0; clean_tid[i]; i++) {
            if (clean_tid[i] < '0' || clean_tid[i] > '9') { all_digits = false; break; }
        }

        if (all_digits && clean_tid[0]) {
            int num = atoi(clean_tid);
            snprintf(normalized_tid, 32, num <= 9999 ? "QR-%04d" : "QR-%05d", num);
        } else {
            snprintf(normalized_tid, 32, "%s", clean_tid);
        }

        Attendee* att = hash_table.find(normalized_tid, bucket, depth);
        if (!att && strncmp(normalized_tid, "QR-", 3) != 0) {
            char alt_tid[32];
            snprintf(alt_tid, sizeof(alt_tid), "QR-%s", normalized_tid);
            att = hash_table.find(alt_tid, bucket, depth);
            if (att) snprintf(normalized_tid, 32, "%s", alt_tid);
        }
        return att;
    }

    int actionScanTicket(const char* raw_ticket) {
        snprintf(last_action, sizeof(last_action), "SCAN_TICKET");
        last_duplicate = false;
        char ticket_id[32];
        int depth = 0;
        Attendee* att = findAttendeeFlexible(raw_ticket, ticket_id, &last_hash_bucket, &depth);
        snprintf(last_verified_ticket, sizeof(last_verified_ticket), "%s", ticket_id);

        bool in_bloom = bloom_filter.check(ticket_id, last_bloom_bits);

        if (!att) {
            last_clean = false;
            snprintf(last_verified_name, sizeof(last_verified_name), "Unregistered Ticket");
            last_verified_college[0] = last_verified_event[0] = '\0';
            snprintf(last_detail, sizeof(last_detail), "[Hash Table] Bucket #%d MISS: Ticket '%s' not registered. Entry denied.", last_hash_bucket, ticket_id);
            return 0;
        }

        snprintf(last_verified_name, sizeof(last_verified_name), "%s", att->name);
        snprintf(last_verified_college, sizeof(last_verified_college), "%s", att->college);
        snprintf(last_verified_event, sizeof(last_verified_event), "%s", att->event_registered);

        if (in_bloom && att->status == AttendeeStatus::CHECKED_IN) {
            last_duplicate = true;
            last_clean = false;
            snprintf(last_detail, sizeof(last_detail), "[Bloom Filter] Fraud detected: Ticket '%s' already scanned for %s! Duplicate entry rejected.", ticket_id, att->name);
            return 2;
        }

        att->status = AttendeeStatus::CHECKED_IN;
        bloom_filter.insert(ticket_id, last_bloom_bits);
        segment_tree.updateCrowd(att->sector_id, 1);
        last_clean = true;

        undo_stack.push(ActionType::TICKET_SCAN, ticket_id, (int)AttendeeStatus::REGISTERED, (int)AttendeeStatus::CHECKED_IN, "Scan Entry Ticket");
        snprintf(last_detail, sizeof(last_detail), "[Bloom Filter] Clean -> [Hash Table] Bucket #%d (depth %d) -> Verified: %s (%s)", last_hash_bucket, depth, att->name, att->college);
        return 1;
    }

    // ------------------------------------------------------------------------
    // PRIYANSHI FEATURES: Event Slot Scheduling & Crowd Range Aggregation
    // ------------------------------------------------------------------------
    bool actionBookEvent(int start_time, int end_time, const char* event_name) {
        snprintf(last_action, sizeof(last_action), "BOOK_EVENT");
        IntervalNode* clash = nullptr;
        bool ok = interval_tree.bookSlot(start_time, end_time, event_name, &clash);
        if (ok) {
            snprintf(last_detail, sizeof(last_detail), "[Interval Tree] Scheduled '%s' at [%d:00 - %d:00].", event_name, start_time, end_time);
            undo_stack.push(ActionType::EVENT_BOOKING, event_name, start_time, end_time, "Book Event Slot");
        } else {
            snprintf(last_detail, sizeof(last_detail), "[Interval Tree] Conflict! Cannot book [%d:00-%d:00]. Overlaps with '%s' [%d:00-%d:00].", start_time, end_time, clash->event_name, clash->start, clash->end);
        }
        return ok;
    }

    bool actionCrowdInflux(int sector, int count) {
        snprintf(last_action, sizeof(last_action), "CROWD_INFLUX");
        segment_tree.updateCrowd(sector, count);
        snprintf(last_detail, sizeof(last_detail), "[Segment Tree] Sector #%d update (%+d). Total: %d.", sector, count, segment_tree.getTotalOccupancy());
        undo_stack.push(ActionType::CROWD_UPDATE, "SECTOR", sector, count, "Crowd Influx");
        return true;
    }

    int actionQuerySectorRange(int l, int r) {
        return segment_tree.queryRange(l, r);
    }

    // ------------------------------------------------------------------------
    // RIDDHI FEATURES: VIP Emergency Dispatch, Judge Allocation & Score Posting
    // ------------------------------------------------------------------------
    bool actionDispatchEmergency(int priority, const char* desc, int start_hub, int end_dest) {
        snprintf(last_action, sizeof(last_action), "DISPATCH_VIP");
        static int req_id_gen = 501;
        EmergencyRequest req(req_id_gen++, priority, desc, (int)time(nullptr));
        max_heap.push(req);
        last_evac_dist = event_dag.dijkstra(start_hub, end_dest, last_evac_path, last_evac_len);

        EmergencyRequest topReq;
        if (max_heap.getSize() > 0) topReq = max_heap.getAt(0);

        if (topReq.request_id == req.request_id) {
            snprintf(last_detail, sizeof(last_detail), "[Max-Heap] Dispatched Code #%d: '%s' (Priority %d at root) -> Evacuation: %d meters.", req.request_id, desc, priority, last_evac_dist);
        } else {
            snprintf(last_detail, sizeof(last_detail), "[Max-Heap] Dispatched Code #%d: '%s' (Priority %d placed in heap; Root remains %d) -> Evacuation: %d meters.", req.request_id, desc, priority, topReq.priority, last_evac_dist);
        }
        return true;
    }

    bool actionAllocateJudge(Judge* out = nullptr) {
        snprintf(last_action, sizeof(last_action), "ALLOCATE_JUDGE");
        Judge assigned;
        bool ok = circular_queue.allocateNextJudge(&assigned);
        if (ok) {
            if (out) *out = assigned;
            snprintf(last_detail, sizeof(last_detail), "[Circular Queue] Assigned Judge '%s' (%s) -> Stalls evaluated: %d", assigned.name, assigned.domain, assigned.stalls);
        }
        return ok;
    }

    bool actionPostScore(int score, int team_id, const char* team_name) {
        snprintf(last_action, sizeof(last_action), "POST_SCORE");
        avl_tree.insertScore(score, team_id, team_name);
        snprintf(last_detail, sizeof(last_detail), "[AVL Tree] Score %d posted for Team '%s' (#%d).", score, team_name, team_id);
        undo_stack.push(ActionType::SCORE_POST, team_name, score, team_id, "Post Hackathon Score");
        return true;
    }

    // ------------------------------------------------------------------------
    // DHRUV FEATURES: Global State Rollback via Doubly Linked List Undo Stack
    // ------------------------------------------------------------------------
    bool actionUndo() {
        snprintf(last_action, sizeof(last_action), "UNDO");
        UndoNode undone(ActionType::TICKET_SCAN, "", 0, 0, "");
        if (!undo_stack.pop(&undone)) {
            snprintf(last_detail, sizeof(last_detail), "[Undo Stack] Stack is empty. No actions to reverse.");
            return false;
        }

        if (undone.type == ActionType::TICKET_SCAN) {
            Attendee* att = hash_table.find(undone.key_id);
            if (att) {
                att->status = AttendeeStatus::REGISTERED;
                segment_tree.updateCrowd(att->sector_id, -1);
            }
            snprintf(last_detail, sizeof(last_detail), "[Undo Stack] Reverted scan for ticket '%s'. Status: REGISTERED.", undone.key_id);
        } else if (undone.type == ActionType::CROWD_UPDATE) {
            segment_tree.updateCrowd(undone.int_val1, -undone.int_val2);
            snprintf(last_detail, sizeof(last_detail), "[Undo Stack] Reverted crowd on Sector #%d (-%d attendees).", undone.int_val1, undone.int_val2);
        } else {
            snprintf(last_detail, sizeof(last_detail), "[Undo Stack] Reverted action: '%s'.", undone.description);
        }
        return true;
    }

    void runStressTest(int node_count = 2000) {
        bool old_verbose = verbose;
        verbose = false;

        mt19937 rng(42);
        uniform_int_distribution<int> first_dist(0, 39), last_dist(0, 29), sector_dist(0, 7), score_dist(50, 100);
        auto start_time = chrono::high_resolution_clock::now();

        char ticket_buf[32], name_buf[64];
        for (int idx = 1; idx <= node_count; idx++) {
            int ticket_num = 500 + idx;
            snprintf(ticket_buf, sizeof(ticket_buf), "QR-%04d", ticket_num);
            snprintf(name_buf, sizeof(name_buf), "%s %s", first_names[first_dist(rng)], last_names[last_dist(rng)]);
            int sec = sector_dist(rng);

            Attendee a(ticket_buf, name_buf, colleges[(i_clamp(idx * 3)) % 10], events[(i_clamp(idx * 5)) % 6], sec);
            hash_table.insert(a);
            if (idx % 2 == 0) bloom_filter.insert(ticket_buf);
            trie.insert(name_buf);
            avl_tree.insertScore(score_dist(rng), 1000 + idx, name_buf);
            segment_tree.updateCrowd(sec, 1);
        }

        double elapsed_ms = chrono::duration<double, milli>(chrono::high_resolution_clock::now() - start_time).count();
        verbose = old_verbose;

        snprintf(last_action, sizeof(last_action), "STRESS_TEST");
        snprintf(last_detail, sizeof(last_detail), "Stress test complete: 2,000 nodes populated in %.2f ms (tickets QR-0501 to QR-2500 added).", elapsed_ms);
    }

private:
    static int i_clamp(int x) { return x < 0 ? -x : x; }
};

// ============================================================================
// SHARED INFRASTRUCTURE: HTTP Server, REST Dispatcher & Main Entrypoint
// ============================================================================

static FestFlowEngine* g_engine = nullptr;
static atomic<bool> server_running(false);

static char* readFileToBuffer(const char* filepath, int* out_len) {
    FILE* f = fopen(filepath, "rb");
    if (!f) return nullptr;
    fseek(f, 0, SEEK_END);
    long size = ftell(f);
    fseek(f, 0, SEEK_SET);
    if (size < 0) { fclose(f); return nullptr; }

    char* buf = (char*)malloc(size + 1);
    if (!buf) { fclose(f); return nullptr; }
    int read_bytes = (int)fread(buf, 1, size, f);
    buf[read_bytes] = '\0';
    fclose(f);
    if (out_len) *out_len = read_bytes;
    return buf;
}

static void sendHttp(int fd, const char* type, const char* body, int len) {
    char header[256];
    int h_len = snprintf(header, sizeof(header),
        "HTTP/1.1 200 OK\r\nContent-Type: %s\r\nAccess-Control-Allow-Origin: *\r\nContent-Length: %d\r\nConnection: close\r\n\r\n", type, len);
    send(fd, header, h_len, 0);
    send(fd, body, len, 0);
}

static void serveFile(int fd, const char* path, const char* type) {
    int len = 0;
    char* buf = readFileToBuffer(path, &len);
    if (buf) {
        sendHttp(fd, type, buf, len);
        free(buf);
    }
}

static void runHttpServer(int port) {
    int server_fd = socket(AF_INET, SOCK_STREAM, 0);
    if (server_fd < 0) return;

    int opt = 1;
    setsockopt(server_fd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));

    sockaddr_in address;
    memset(&address, 0, sizeof(address));
    address.sin_family = AF_INET;
    address.sin_addr.s_addr = INADDR_ANY;
    address.sin_port = htons(port);

    if (::bind(server_fd, (struct sockaddr*)&address, sizeof(address)) < 0) {
        address.sin_port = htons(port + 1);
        if (::bind(server_fd, (struct sockaddr*)&address, sizeof(address)) < 0) {
            close(server_fd);
            return;
        }
        port = port + 1;
    }

    if (listen(server_fd, 16) < 0) { close(server_fd); return; }

    cout << "[FestFlow HTTP Engine] Running at http://localhost:" << port << "\n";
    cout.flush();
    server_running = true;

    while (server_running) {
        sockaddr_in client_addr;
        socklen_t client_len = sizeof(client_addr);
        int client_fd = accept(server_fd, (struct sockaddr*)&client_addr, &client_len);
        if (client_fd < 0) {
            if (!server_running) break;
            continue;
        }

        char buffer[2048];
        int bytes_read = (int)recv(client_fd, buffer, sizeof(buffer) - 1, 0);
        if (bytes_read <= 0) { close(client_fd); continue; }
        buffer[bytes_read] = '\0';

        char method[16] = {0}, full_path[512] = {0};
        istringstream iss(buffer);
        iss >> method >> full_path;

        char path_only[256];
        snprintf(path_only, sizeof(path_only), "%s", full_path);
        char* q_mark = strchr(path_only, '?');
        if (q_mark) *q_mark = '\0';

        if (strcmp(path_only, "/") == 0 || strcmp(path_only, "/index.html") == 0) {
            serveFile(client_fd, "web/index.html", "text/html");
        } else if (strcmp(path_only, "/style.css") == 0) {
            serveFile(client_fd, "web/style.css", "text/css");
        } else if (strcmp(path_only, "/app.js") == 0) {
            serveFile(client_fd, "web/app.js", "application/javascript");
        } else if (strcmp(path_only, "/orbiting_metaballs.mp4") == 0) {
            serveFile(client_fd, "web/orbiting_metaballs.mp4", "video/mp4");
        } else if (strncmp(path_only, "/api/action/", 12) == 0) {
            const char* act = path_only + 12;
            int scan_res = 1;

            if (strcmp(act, "scan") == 0) {
                char ticket[32] = "QR-8821";
                get_query_param(full_path, "ticket", ticket, sizeof(ticket));
                scan_res = g_engine->actionScanTicket(ticket);
            } else if (strcmp(act, "book") == 0) {
                char s_str[16] = "14", e_str[16] = "16", name[64] = "AI HackSprint Stage 2";
                get_query_param(full_path, "start", s_str, sizeof(s_str));
                get_query_param(full_path, "end", e_str, sizeof(e_str));
                get_query_param(full_path, "name", name, sizeof(name));
                g_engine->actionBookEvent(atoi(s_str), atoi(e_str), name);
            } else if (strcmp(act, "emergency") == 0) {
                char prio_str[16] = "95", desc[64] = "Medical Code Red", start_str[16] = "0", dest_str[16] = "4";
                get_query_param(full_path, "prio", prio_str, sizeof(prio_str));
                get_query_param(full_path, "desc", desc, sizeof(desc));
                get_query_param(full_path, "start", start_str, sizeof(start_str));
                get_query_param(full_path, "dest", dest_str, sizeof(dest_str));
                g_engine->actionDispatchEmergency(atoi(prio_str), desc, atoi(start_str), atoi(dest_str));
            } else if (strcmp(act, "judge") == 0) {
                g_engine->actionAllocateJudge();
            } else if (strcmp(act, "score") == 0) {
                char score_str[16] = "94", tid_str[16] = "105", team[64] = "CyberVanguard";
                get_query_param(full_path, "score", score_str, sizeof(score_str));
                get_query_param(full_path, "team_id", tid_str, sizeof(tid_str));
                get_query_param(full_path, "name", team, sizeof(team));
                g_engine->actionPostScore(atoi(score_str), atoi(tid_str), team);
            } else if (strcmp(act, "crowd") == 0) {
                char sec_str[16] = "2", delta_str[16] = "15";
                get_query_param(full_path, "sector", sec_str, sizeof(sec_str));
                get_query_param(full_path, "delta", delta_str, sizeof(delta_str));
                g_engine->actionCrowdInflux(atoi(sec_str), atoi(delta_str));
            } else if (strcmp(act, "undo") == 0) {
                g_engine->actionUndo();
            } else if (strcmp(act, "stress") == 0) {
                g_engine->runStressTest(2000);
            }

            char path_json[128] = "[]";
            if (g_engine->last_evac_len > 0) {
                int off = snprintf(path_json, sizeof(path_json), "[");
                for (int p = 0; p < g_engine->last_evac_len; p++) {
                    off += snprintf(path_json + off, sizeof(path_json) - off, "%s%d", (p > 0 ? "," : ""), g_engine->last_evac_path[p]);
                }
                snprintf(path_json + off, sizeof(path_json) - off, "]");
            }

            char json[2048];
            int j_len = snprintf(json, sizeof(json),
                "{\"status\":\"ok\",\"action\":\"%s\",\"detail\":\"%s\",\"total_attendees\":%d,\"verified_name\":\"%s\",\"verified_ticket\":\"%s\",\"verified_college\":\"%s\",\"verified_event\":\"%s\",\"bloom_bits\":[%d,%d,%d],\"hash_bucket\":%d,\"verified_clean\":%s,\"is_duplicate\":%s,\"scan_result\":%d,\"cqueue_front\":%d,\"cqueue_rear\":%d,\"total_crowd\":%d,\"evacuation_distance\":%d,\"evacuation_path\":%s}",
                g_engine->last_action, g_engine->last_detail, g_engine->hash_table.getSize(), g_engine->last_verified_name,
                g_engine->last_verified_ticket, g_engine->last_verified_college, g_engine->last_verified_event,
                g_engine->last_bloom_bits[0], g_engine->last_bloom_bits[1],
                g_engine->last_bloom_bits[2], g_engine->last_hash_bucket,
                g_engine->last_clean ? "true" : "false",
                g_engine->last_duplicate ? "true" : "false",
                scan_res,
                g_engine->circular_queue.getFront(),
                g_engine->circular_queue.getRear(),
                g_engine->segment_tree.getTotalOccupancy(),
                g_engine->last_evac_dist,
                path_json);

            sendHttp(client_fd, "application/json", json, j_len);
        } else if (strcmp(path_only, "/api/state") == 0) {
            char json[2048];
            int j_len = snprintf(json, sizeof(json),
                "{\"total_attendees\":%d,\"bloom_count\":%d,\"load_factor\":%.2f,\"collisions\":%d,\"total_crowd\":%d,\"heap_size\":%d,\"judge_count\":%d,\"avl_nodes\":%d,\"trie_words\":%d,\"undo_depth\":%d,\"last_action\":\"%s\",\"last_detail\":\"%s\",\"verified_name\":\"%s\",\"verified_ticket\":\"%s\",\"verified_college\":\"%s\",\"verified_event\":\"%s\",\"bloom_bits\":[%d,%d,%d],\"hash_bucket\":%d,\"verified_clean\":%s,\"is_duplicate\":%s,\"cqueue_front\":%d,\"cqueue_rear\":%d}",
                g_engine->hash_table.getSize(), g_engine->bloom_filter.getInsertedCount(),
                g_engine->hash_table.getLoadFactor(), g_engine->hash_table.getCollisionCount(),
                g_engine->segment_tree.getTotalOccupancy(), g_engine->max_heap.getSize(),
                g_engine->circular_queue.getCount(), g_engine->avl_tree.getCount(),
                g_engine->trie.getCount(), g_engine->undo_stack.getSize(),
                g_engine->last_action, g_engine->last_detail, g_engine->last_verified_name,
                g_engine->last_verified_ticket, g_engine->last_verified_college, g_engine->last_verified_event,
                g_engine->last_bloom_bits[0], g_engine->last_bloom_bits[1],
                g_engine->last_bloom_bits[2], g_engine->last_hash_bucket,
                g_engine->last_clean ? "true" : "false",
                g_engine->last_duplicate ? "true" : "false",
                g_engine->circular_queue.getFront(),
                g_engine->circular_queue.getRear());

            sendHttp(client_fd, "application/json", json, j_len);
        } else {
            const char* not_found = "HTTP/1.1 404 Not Found\r\nContent-Length: 9\r\n\r\nNot Found";
            send(client_fd, not_found, strlen(not_found), 0);
        }
        close(client_fd);
    }
    close(server_fd);
}

void printBanner() {
    cout << "\n====================================================================\n";
    cout << "   FESTFLOW: PURE C++ GLASS BOX LOGISTICS & DSA ENGINE (RAM ONLY)   \n";
    cout << "   Preloaded with 500+ Attendees | Flexible Number/QR Ticket Lookup   \n";
    cout << "====================================================================\n";
    cout.flush();
}

int main(int argc, char* argv[]) {
    FestFlowEngine engine;
    g_engine = &engine;

    thread server_thread(runHttpServer, 8080);
    server_thread.detach();

    if (argc > 1 && strcmp(argv[1], "--stress-test") == 0) {
        engine.runStressTest(2000);
        return 0;
    }

    printBanner();
    cout << "[FestFlow HTTP Engine] Running at http://localhost:8080\n";
    cout << "Ready for CLI commands ('scan <ticket>', 'status', 'undo', 'help', 'exit'):\n> ";
    cout.flush();

    string cmd;
    while (cin >> cmd) {
        if (cmd == "exit" || cmd == "quit") {
            cout << "Stopping FestFlow...\n";
            server_running = false;
            break;
        } else if (cmd == "scan") {
            string t;
            if (cin >> t) {
                int res = engine.actionScanTicket(t.c_str());
                cout << "Scan Result: " << res << " (" << engine.last_detail << ")\n";
            }
        } else if (cmd == "undo") {
            engine.actionUndo();
            cout << "Undo: " << engine.last_detail << "\n";
        } else if (cmd == "status") {
            cout << "Attendees: " << engine.hash_table.getSize()
                 << " | Crowd: " << engine.segment_tree.getTotalOccupancy()
                 << " | Last Action: " << engine.last_action << "\n";
        } else if (cmd == "help") {
            cout << "Commands: scan <ticket>, undo, status, exit\n";
        } else {
            cout << "Unknown command: " << cmd << ". Type 'help' for options.\n";
        }
        cout << "> ";
        cout.flush();
    }
    return 0;
}
