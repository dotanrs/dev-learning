export default {
  id: "system-design",
  title: "System Design",
  subchapters: [
    {
      id: "url-shortener",
      title: "URL Shortener",
      body: `## Problem
Design a service that converts long URLs into short, shareable links and redirects users to the original URL.

## Requirements
**Functional**
- Shorten a long URL to a unique short code (e.g. \`short.ly/aB3xQ\`)
- Redirect short URL to original with low latency
- Optional: custom aliases, expiration dates, analytics (click counts)

**Non-functional / Scale**
- 100M new URLs created per day → ~1,200 writes/sec
- 10:1 read-to-write ratio → ~12,000 redirects/sec (peak 3×)
- Average URL ~100 bytes; 100M/day × 365 days × 5 years ≈ **180 TB** total storage
- Redirect p99 latency < 10 ms
- High availability (99.99%)

## High-level design

~~~
Client
  |
  | POST /shorten  { url, alias?, ttl? }
  v
API Gateway / Load Balancer
  |
  +---> Shortener Service -----> ID Generator (snowflake / counter)
  |          |                        |
  |          v                        v
  |     URL Store (Postgres)     Zookeeper / Redis counter
  |
  | GET /<code>
  v
Redirect Service
  |
  +---> Redis Cache (code -> long URL)
  |         hit? -----> 301/302 redirect
  |         miss?
  v
URL Store (Postgres) ---> cache warm --> redirect
~~~

**API sketch**
~~~
POST /api/v1/shorten
  Body: { "url": "https://...", "alias": "mylink", "ttl_days": 30 }
  Response: { "short_url": "https://short.ly/aB3xQ" }

GET /<code>
  Response: HTTP 302 Location: <original_url>

GET /api/v1/stats/<code>
  Response: { "clicks": 42000, "created_at": "..." }
~~~

## Data model / storage
**DB: PostgreSQL** (reads are key-value lookups; relational gives ACID for uniqueness)

~~~
urls
  code        VARCHAR(8)   PRIMARY KEY   -- base62 short code
  long_url    TEXT         NOT NULL
  user_id     BIGINT
  created_at  TIMESTAMPTZ  DEFAULT now()
  expires_at  TIMESTAMPTZ
  click_count BIGINT       DEFAULT 0

users
  id          BIGINT       PRIMARY KEY
  api_key     VARCHAR(64)  UNIQUE
~~~

Partition by \`code\` (hash) if > 1 B rows. For analytics, fan out clicks to a separate **ClickEvents** table or stream to Kafka → ClickHouse.

## Key decisions & tradeoffs

| Decision | Option A | Option B | Winner |
|---|---|---|---|
| Code generation | Hash (MD5/SHA1 truncated) | Counter + base62 | **Counter** — no collision risk |
| Counter source | DB auto-increment | Distributed ID (Zookeeper range) | **Zookeeper ranges** — DB bottleneck at scale |
| Redirect type | 301 Permanent | 302 Temporary | **302** — enables analytics (browser won't cache) |
| Custom alias uniqueness | DB unique constraint | Redis SET NX | **DB unique constraint** — single source of truth |
| Expiration cleanup | TTL column + cron | Redis TTL on cache | Both — Redis evicts cache, cron deletes DB rows |

**Base62 math:** 6 characters → 62^6 ≈ 56 billion unique codes. More than enough.

## Scaling & bottlenecks
- **Read path** is 99% of traffic → Redis cluster (write-through on creation). Cache hit rate > 99%.
- **Hot URLs** (viral links): same Redis shard gets hammered. Mitigate with **local in-process cache** (LRU, TTL 1 s) in Redirect Service pods.
- **Write path**: counter ranges assigned to each Shortener pod (e.g. 10k at a time) — no coordination per request.
- **DB reads** are basically eliminated for redirect once warmed; DB is only the persistent source of truth.
- **CDN**: route \`GET /<code>\` through CDN edge PoPs; use 302 (not 301) so CDN doesn't cache the redirect forever.
- **Analytics**: avoid write amplification on \`urls.click_count\` — buffer counts in Redis, flush periodically.`,
      flashcards: [
        {
          front: "How do you generate unique short codes without collisions at scale?",
          back: `Use a **distributed counter** approach:
1. Each Shortener pod requests a **range of IDs** (e.g. 1000 at a time) from a coordination service (Zookeeper or a dedicated DB sequence).
2. Encode the integer counter in **base62** (a-z A-Z 0-9) → 6 chars covers 56 B URLs.
3. Pods exhaust their local range before fetching the next → no per-request coordination.

Avoid hashing long URLs: collisions require retry logic; also harder to guarantee uniqueness across distributed nodes.`
        },
        {
          front: "How do you keep redirect latency under 10 ms?",
          back: `Multi-layer caching:
- **L1**: In-process LRU cache per pod (e.g. 10k entries, 1 s TTL) — sub-millisecond, no network hop.
- **L2**: Redis cluster (write-through on creation) — ~1 ms.
- **L3**: Database — only on cold start or cache eviction.

Use HTTP **302** (not 301) so browsers do not cache the redirect, keeping analytics accurate.`
        },
        {
          front: "When would you choose 301 vs 302 for redirects?",
          back: `- **301 Permanent**: Browser caches the redirect → subsequent clicks go directly to destination. Lower server load but you **lose click analytics**.
- **302 Temporary** (Found): Every click hits your server → accurate analytics, A/B testing, expiration enforcement.

**Default: 302.** Only use 301 if you explicitly want to transfer SEO equity and do not need click tracking.`
        },
        {
          front: "How do you handle hot/viral URLs hammering a single Redis shard?",
          back: `1. **Local in-process cache** (LRU, small TTL ~1 s) absorbs traffic before it hits Redis.
2. **Redis read replicas**: route reads to replicas, writes to primary.
3. **Key replication**: duplicate the hot key across multiple shards and route requests randomly — trades memory for throughput.
4. **Rate limit** fetches per code to detect abuse early.`
        },
        {
          front: "How do you handle custom aliases and guarantee uniqueness?",
          back: `Store aliases in the same \`urls\` table with a **UNIQUE constraint** on \`code\`. On conflict return HTTP 409.

At scale you can also do **Redis SET NX** (set-if-not-exists) as a fast pre-check before the DB write, but the DB constraint is the authoritative guard. Never rely only on application-level checks — race conditions will cause duplicates.`
        },
        {
          front: "How do you expire and clean up old URLs?",
          back: `Two layers:
1. **Cache layer**: store Redis keys with a TTL matching \`expires_at\`. Expired keys are automatically evicted — redirect misses fall through to DB which returns 404 if past TTL.
2. **DB layer**: a background **cron job** runs nightly: \`DELETE FROM urls WHERE expires_at < now()\` with batching to avoid table-lock spikes.

Mark deleted rows in a **soft-delete** column first if you need an audit trail or grace period.`
        }
      ],
      quiz: [
        {
          question: "A viral tweet embeds your short link and it receives 500k clicks in 5 minutes — walk through exactly what happens in your system and what could break.",
          answer: `**Traffic path:** Client → CDN/LB → Redirect Service pods → L1 in-process cache → L2 Redis → DB.

**What could break:**
1. **Redis hotspot**: all pods map to the same Redis shard for this key. Fix: replicate the hot key across N shards; read from random shard.
2. **L1 cache cold on new pods**: if autoscaling spins up fresh pods, they have empty in-process caches and all miss to Redis simultaneously (thundering herd). Fix: add a small jitter on TTL, or pre-warm from Redis on pod startup.
3. **Analytics write amplification**: if you increment \`click_count\` on every hit, the DB row becomes a hot row with lock contention. Fix: buffer increments in Redis (INCR), flush to DB every 30 s.
4. **CDN**: if CDN caches a 302 response (some CDNs do), you lose analytics and cannot update the destination. Ensure \`Cache-Control: no-store\` on redirect responses.

**Mitigation summary:** L1 per-pod LRU → Redis read replicas → Redis key fan-out → async analytics via Kafka.`
        },
        {
          question: "Your base62 counter is currently stored in a single Postgres sequence. At 1,200 writes/sec it becomes a bottleneck. Design a solution that removes this single point of contention.",
          answer: `**Problem:** A single DB sequence serializes all write requests.

**Solution — Range-based counter pre-allocation:**
1. Add a \`counter_ranges\` table (or use Zookeeper/etcd): each row is a range \`[start, end]\`.
2. Each Shortener pod, on startup, atomically claims a range of e.g. 10,000 IDs (UPDATE … RETURNING, or Zookeeper ephemeral node).
3. The pod keeps a local counter; when exhausted it claims the next range.
4. **Result:** DB/Zookeeper is hit once per 10k writes per pod — at 1,200 wps across 10 pods, each pod does 120 wps, claiming a new range every ~83 seconds.

**Alternative — Twitter Snowflake-style IDs:** Embed timestamp + machine ID + sequence into a 64-bit integer. No coordination at all. Downside: IDs are larger (need 8-char base62 instead of 6).

**Failure handling:** If a pod crashes with unused IDs, those IDs are wasted — acceptable gap in the counter. Do not reuse ranges.`
        }
      ]
    },
    {
      id: "chat-service",
      title: "Chat Service",
      body: `## Problem
Design a real-time messaging system (think WhatsApp/Slack) supporting 1-on-1 and group messages with delivery and read receipts.

## Requirements
**Functional**
- Send and receive messages in real time (1-on-1 and groups up to 1,000 members)
- Delivery receipts (sent, delivered, read)
- Message history / pagination
- Online presence indicators
- Media attachments (images, files)

**Non-functional / Scale**
- 500M daily active users, each sends ~20 messages/day → **~115,000 messages/sec**
- Groups: avg 50 members; large groups 1,000 members
- Message retention: 5 years → ~10 PB total (text only ~10 bytes avg, with media much more)
- Latency: message delivery p99 < 500 ms globally
- 99.95% availability

## High-level design

~~~
           WebSocket Connection (persistent)
Client A <------------------------------------> WebSocket Server (WS-A)
                                                     |
                                              Message Router
                                             /       |        \\
                                     Fan-out   Presence Svc  Receipt Svc
                                     Service
                                         |
                                    Kafka Topic
                                   (partitioned by conversation_id)
                                         |
                               +---------+---------+
                               |                   |
                        Message Store         Notification
                        (Cassandra)           Service (APNs/FCM)
                                                   |
                                              Offline Client B

Client B <----(WebSocket if online, else push notification)----+
~~~

**API sketch**
~~~
WS connect:  wss://chat.example.com/ws?token=<jwt>

WS messages (JSON frames):
  { "type": "send",    "to": "user_id|group_id", "content": "...", "client_msg_id": "uuid" }
  { "type": "ack",     "msg_id": "...", "status": "delivered|read" }
  { "type": "presence","user_id": "...", "status": "online|offline" }

REST fallback:
  POST /api/v1/messages
  GET  /api/v1/conversations/:id/messages?before=<cursor>&limit=50
~~~

## Data model / storage
**Messages: Cassandra** (wide rows, high write throughput, time-series access pattern)

~~~
messages_by_conversation
  conversation_id  UUID    PARTITION KEY
  created_at       TIMEUUID  CLUSTERING KEY DESC
  message_id       UUID
  sender_id        UUID
  content          TEXT
  type             TEXT      -- text | image | file
  media_url        TEXT
  status           TEXT      -- sent | delivered | read

conversations
  conversation_id  UUID    PRIMARY KEY
  type             TEXT    -- dm | group
  members          SET<UUID>
  created_at       TIMESTAMP

presence
  user_id          UUID    PRIMARY KEY   -- stored in Redis, TTL 60s
  last_seen        TIMESTAMP
  status           TEXT
~~~

**Media: S3 / object store.** References stored in \`media_url\`.

## Key decisions & tradeoffs

| Decision | Option A | Option B | Choice |
|---|---|---|---|
| Transport | WebSocket | Long-poll / SSE | **WebSocket** — bidirectional, lower overhead |
| Fan-out strategy | Fan-out on write | Fan-out on read | **Hybrid** — small groups: write; large groups: read |
| Message store | Cassandra | MySQL + sharding | **Cassandra** — natural time-series, linear scale |
| Ordering guarantee | Client-assigned timestamp | Server-assigned sequence | **Server-assigned** — prevents clock skew issues |
| Delivery guarantee | At-most-once (fire and forget) | At-least-once + dedup | **At-least-once** with client_msg_id dedup |

**Fan-out on write vs read for groups:**
- Small groups (< 100): write a copy of the message into each member's inbox → fast reads.
- Large groups (> 100): store one message, readers pull from conversation partition → avoids 1,000× write amplification for viral groups.

## Scaling & bottlenecks
- **WebSocket servers are stateful**: use a consistent hash or a routing table to direct all connections for a user to the same pod (or store the pod mapping in Redis).
- **Kafka**: partition by \`conversation_id\` → all messages in a conversation are ordered; fan-out consumers write to Cassandra and push to online WebSocket servers.
- **Presence service**: heartbeat every 30 s; Redis key with 60 s TTL. At 500M users even just online users (~20%) = 100M keys → Redis cluster with multiple shards.
- **Read path**: Cassandra partition per conversation → O(1) lookups for recent messages. Hot conversations cached in Redis (last 50 messages).
- **CDN for media**: pre-signed S3 URLs served through CloudFront; thumbnails generated asynchronously.`,
      flashcards: [
        {
          front: "How do you route a message to a user who may be connected to any WebSocket server?",
          back: `Maintain a **user → WS server** mapping in Redis:
- On WS connect: \`SET user:<id>:ws_server <pod_id> EX 300\`
- Message Router looks up the target's pod, then uses an **internal pub/sub** (Redis pub/sub or Kafka) to deliver to that pod.
- If the user is offline (no mapping): enqueue in Cassandra + send push notification via APNs/FCM.

Alternatively, use **consistent hashing** at the load balancer so a user always lands on the same pod — simpler but complicates autoscaling.`
        },
        {
          front: "How do you guarantee message ordering in a distributed chat system?",
          back: `1. **Server-side sequence numbers**: the server assigns a monotonically increasing \`seq\` per conversation. Never trust client timestamps (clock skew, retroactive edits).
2. **Kafka partitioning by conversation_id**: all messages for a conversation go through the same partition → preserved order.
3. **Cassandra TIMEUUID clustering key**: stores messages in time order within a partition.
4. **Client-side gap detection**: if the client receives seq 5 and last seen was seq 3, it knows to request the missing messages.`
        },
        {
          front: "How do you implement delivery and read receipts at scale?",
          back: `- **Delivered** receipt: WS server sends ACK back to sender when the message frame is written to the recipient's WS buffer (or stored to DB for offline users).
- **Read** receipt: client fires a \`read\` event when the user views the message; server updates \`status\` in Cassandra and fans the receipt back to sender.
- **At scale**: batch receipt updates (accumulate for 1 s, write once per conversation) to avoid per-message DB writes.
- For **group read receipts** (who read): store \`read_by\` as a Map<user_id, timestamp> — only practical for small groups; for large groups show aggregate counts.`
        },
        {
          front: "How do you handle fan-out for very large group chats (1,000 members)?",
          back: `**Fan-out on read** for large groups:
1. Store **one copy** of the message in Cassandra under the conversation partition.
2. Each member's client reads from the conversation partition on demand.
3. To notify members: send a lightweight "new message available in conversation X" push/WS event — not the full message payload.

Threshold: groups > ~100 members switch to fan-out-on-read. Below that, write to each member's inbox (fan-out on write) for faster reads.`
        },
        {
          front: "How do you design online presence at 500M users?",
          back: `- Each client sends a **heartbeat** every 30 s over WebSocket.
- WS server sets \`Redis: user:<id>:presence = online EX 60\` on each heartbeat.
- On disconnect or TTL expiry → key disappears → user is "offline".
- **Last seen** timestamp written to Cassandra asynchronously (not on every heartbeat — debounce to once per minute).
- **Privacy**: allow users to hide presence (store a preference; serve "last seen recently" instead of exact time).
- At 100M concurrent online users × 1 key each ≈ a few GB in Redis — easily sharded.`
        },
        {
          front: "How do you handle message deduplication if a client retries a send?",
          back: `Client generates a **client_msg_id** (UUID) before sending. Server checks:
~~~
INSERT INTO messages (..., client_msg_id) VALUES (...)
  IF NOT EXISTS;   -- Cassandra lightweight transaction
~~~
Or: Redis \`SET dedup:<client_msg_id> 1 NX EX 86400\` — if key exists, discard the duplicate and return the original message_id.

The client keeps retrying (with exponential backoff) until it gets an ACK or confirms the message exists via a status query.`
        }
      ],
      quiz: [
        {
          question: "A user in a 1,000-person group sends a message. Walk through the entire fan-out path and identify every bottleneck.",
          answer: `**Path:**
1. User's WS server receives the message frame, assigns a server-side seq number, writes to Kafka topic partitioned by conversation_id.
2. Fan-out Consumer reads from Kafka. With fan-out-on-write this means 1,000 writes to 1,000 inbox partitions — **write amplification bottleneck** at scale.
3. For fan-out-on-read: one write to the conversation partition in Cassandra. Then the consumer publishes a lightweight notification event to each member's WS server.
4. WS servers receive the notification event and push to connected members. **1,000 WS push events** per message — each WS server may hold many of the 1,000 members.

**Bottlenecks:**
- **Kafka consumer throughput**: need enough consumer parallelism; partition count limits parallelism.
- **Cassandra write hotspot**: if many large groups are active simultaneously, the conversation partition gets hot. Mitigate with write batching and sufficient Cassandra nodes.
- **Redis pub/sub for WS routing**: at 1,000 member lookups per message, this is 1,000 Redis reads. Use a **presence bitmap** or member list cache per group instead.
- **Notification storms**: if 1,000 offline members all get APNs/FCM notifications simultaneously, push provider rate limits may kick in. Use a dedicated notification queue with rate limiting.`
        },
        {
          question: "How would you redesign the message storage layer if you needed to support message search across all conversations for a user?",
          answer: `**Problem:** Cassandra is optimized for known partition key lookups — it cannot efficiently full-text search across conversations.

**Solution — Dual-write with Elasticsearch:**
1. Keep Cassandra as the **primary store** (fast reads by conversation).
2. On every message write (via Kafka consumer), index the message into **Elasticsearch** with fields: \`user_ids[] , conversation_id, content, created_at\`.
3. Search API: \`GET /search?q=<term>\` → Elasticsearch query filtered by \`user_ids: <calling_user>\` → returns message IDs + snippets.
4. Fetch full messages from Cassandra by ID for display.

**Tradeoffs:**
- Eventual consistency: search index lags by seconds.
- Storage cost: Elasticsearch index ≈ 2–3× raw text size.
- For privacy: never index encrypted messages client-side (E2E encryption breaks server-side search — must choose one or the other).
- Alternative for simple search: Cassandra SASI index (secondary index) works for prefix/contains but degrades at scale. Elasticsearch is preferred for production.`
        }
      ]
    },
    {
      id: "metrics-collection",
      title: "Metrics Collection",
      body: `## Problem
Design a system to collect, store, and query metrics (counters, gauges, histograms) emitted by thousands of services.

## Requirements
**Functional**
- Ingest metrics from any service (push or pull)
- Store time-series data with tags (labels)
- Query: range queries, aggregations, alerting threshold checks
- Dashboarding support (Grafana-compatible query API)
- Configurable retention (raw 15 s → 13 months; downsampled 1 min, 1 hr, 1 day forever)

**Non-functional / Scale**
- 10,000 services × 100 metrics each × 4 data points/min = **~667,000 data points/sec** at peak
- Cardinality: up to 1 M unique time series
- Query latency: < 1 s for 24-hour range, < 5 s for 1-year range
- Storage: raw data ≈ 16 bytes/point × 667k/s × 86400 s/day ≈ **~900 GB/day** (before compression)

## High-level design

~~~
Services (push)          Scrapers (pull / Prometheus)
     |                            |
     v                            v
  Ingest Gateway (Kafka / UDP)
     |
     v
 Stream Processor (Flink / Kafka Streams)
     |         |
     v         v
  TSDB       Downsampler
 (raw)       (1-min, 1-hr)
     |
  Query Service
     |
 Grafana / Alert Manager
~~~

**Push vs Pull:**
- **Pull (Prometheus model)**: scraper polls \`/metrics\` endpoint. Simple, natural for microservices. Scraper becomes bottleneck at scale.
- **Push (StatsD/InfluxDB line protocol)**: service sends metrics to an ingest endpoint. Better for short-lived jobs, batch processes.
- **Hybrid**: services push to a local agent (e.g. Telegraf), agent pulls and forwards to central Kafka → decouples ingest spikes.

**API sketch**
~~~
POST /api/v1/ingest
  Body (line protocol):
    cpu.usage,host=web-01,region=us-east value=72.3 1719000000

GET /api/v1/query_range
  ?query=avg(cpu.usage{region="us-east"})&start=...&end=...&step=60s
~~~

## Data model / storage
**TSDB: InfluxDB / Prometheus TSDB / Apache Parquet on S3 + query layer**

~~~
-- Logical data model
metric_name: "http.request.latency"
tags:        { service: "checkout", region: "us-east", host: "web-01" }
timestamp:   1719000000   (unix seconds)
value:       float64

-- Physical: columnar storage, compressed with Gorilla/XOR encoding
-- Each "chunk" = 2 hours of data for one series, delta-delta + bit packing
-- Index: inverted index on tag key-value pairs → series IDs

-- Downsampled tables
rollup_1m  (series_id, minute_bucket, min, max, sum, count)
rollup_1h  (series_id, hour_bucket,   min, max, sum, count)
rollup_1d  (series_id, day_bucket,    min, max, sum, count)
~~~

**Sharding:** partition by \`series_id % N\` across storage nodes. Time-based sharding within each node (shard per 2-hour window).

## Key decisions & tradeoffs

| Decision | Option A | Option B | Choice |
|---|---|---|---|
| Ingest protocol | HTTP/REST | UDP / Kafka | **Kafka** — durable buffer; handles spikes |
| Storage engine | Row store (Postgres) | Columnar TSDB | **TSDB** — 10–50× compression, faster range scans |
| Aggregation timing | Pre-aggregate at ingest | Aggregate at query | **Pre-aggregate (rollups)** — fast queries; lose raw flexibility |
| Cardinality control | Unlimited tags | Schema enforcement | **Enforcement** — high-cardinality tags (UUID as tag) cause OOM in index |
| Retention policy | Single tier | Tiered hot/warm/cold | **Tiered** — hot SSD, warm HDD, cold S3 Parquet |

## Scaling & bottlenecks
- **Write path bottleneck**: Kafka → TSDB write. Mitigate: batch writes (accumulate 10 s of data in memory, write one chunk). Use WAL for durability.
- **High cardinality explosion**: a tag like \`user_id=<uuid>\` creates millions of series → index OOM. Enforce tag value cardinality limits at ingest gateway. Drop or hash high-cardinality tags.
- **Query fan-out**: range queries touch many shards. Query engine must parallelize across shards and merge. Cache popular query results in Redis (keyed by query hash + time range).
- **Downsampling**: async background job reads raw chunks, computes rollup, writes to rollup tables, then TTLs raw data.
- **Alerting**: maintain a separate **Alert Evaluation Service** that runs queries on a schedule; avoids coupling alert latency to dashboard query load.`,
      flashcards: [
        {
          front: "How do you choose between push and pull metric collection?",
          back: `**Pull (Prometheus)**: scraper fetches \`/metrics\` endpoint on a schedule.
- Pros: scraper controls rate, easy service discovery, consistent intervals.
- Cons: scraper is a bottleneck; doesn't work for short-lived jobs.

**Push (StatsD/InfluxDB)**: service sends metrics to an agent or gateway.
- Pros: works for batch jobs, lambdas; decentralized.
- Cons: services can overwhelm ingest; harder to detect a silent service.

**Hybrid (recommended at scale)**: services push to a local sidecar agent (Telegraf/Prometheus agent), which scrapes locally and forwards to central Kafka. Decouples ingest load from scraping logic.`
        },
        {
          front: "How do you handle high-cardinality tags in a metrics system?",
          back: `High-cardinality tags (e.g. \`user_id\`, \`request_id\`) create one series per unique value → millions of series → inverted index blows up in memory.

**Solutions:**
1. **Validation at ingest**: reject or truncate tags with > N distinct values (e.g. 10,000 per metric).
2. **Hashing**: bucket high-cardinality values into ranges (\`user_id\` → \`user_cohort\`).
3. **Separate system**: route per-user/per-request data to a distributed trace/log store (Jaeger, Loki), not the metrics TSDB.
4. **Schema enforcement**: require tag schema registration; reject unregistered tags.`
        },
        {
          front: "How do you design retention and downsampling for long-term metric storage?",
          back: `**Tiered retention:**
- **Hot (SSD)**: raw 15 s data, last 7 days.
- **Warm (HDD)**: 1-min rollups, last 13 months.
- **Cold (S3 Parquet)**: 1-hr and 1-day rollups, forever.

**Downsampling process**: background job reads raw chunks as they age out, computes \`min/max/sum/count\` per window, writes to rollup table, then deletes raw data.

**Query routing**: query layer inspects requested time range and resolution, routes to appropriate tier automatically.`
        },
        {
          front: "How does Gorilla/XOR compression work for time-series data?",
          back: `Facebook's Gorilla paper showed time-series data is highly compressible because values change slowly:

**Timestamps**: store delta-of-deltas (diff of diffs). Regular intervals → delta = 0 most of the time → near-zero bits per timestamp.

**Values (XOR encoding)**: store XOR of consecutive float64 values. If value barely changes, XOR has many leading/trailing zeros → encode only the meaningful bits using a variable-length scheme.

**Result**: ~1.37 bytes per data point vs 16 bytes raw → **12× compression** on typical metrics data.`
        },
        {
          front: "How do you prevent a slow or expensive query from impacting other dashboard users?",
          back: `1. **Query isolation**: run dashboard queries in a separate read replica cluster; alerting queries on another.
2. **Query timeouts and resource limits**: enforce per-query CPU/memory budgets; return partial results if time limit hit.
3. **Result caching**: cache query results in Redis keyed by \`hash(query + time_range + step)\`. Cache TTL = step interval (no point caching a 1-min resolution query for > 1 min).
4. **Rate limiting**: per-user/dashboard query rate limits.
5. **Pre-aggregation**: for known dashboard queries, pre-compute rollups at write time.`
        }
      ],
      quiz: [
        {
          question: "Your metrics system receives 1M data points/sec but the TSDB write path is saturated at 500k/sec. Describe your short-term and long-term mitigation.",
          answer: `**Short-term (minutes to hours):**
1. **Increase Kafka consumer parallelism**: add more TSDB write worker instances. Kafka partitions must be ≥ worker count — may need a repartition.
2. **Batch writes**: if workers are writing one point at a time, switch to bulk write API (most TSDBs support batch ingestion).
3. **Sampling/dropping**: temporarily drop low-priority metrics (debug-level, per-instance raw metrics) at the ingest gateway to reduce volume.

**Long-term (days to weeks):**
1. **Horizontal sharding**: add more TSDB nodes, repartition series by hash of \`metric_name + tags\`.
2. **Write-optimized architecture**: use an in-memory write buffer (WAL) per node; fsync to disk in large sequential writes (avoids random I/O bottleneck).
3. **Pre-aggregation at ingest**: Flink stream processor computes per-minute aggregates in-flight; only write rollups to TSDB — reduces write volume by 4× (15 s → 1 min).
4. **Tiered ingest**: hot metrics (SLO-critical) get guaranteed write path; cold metrics (debug) go to a separate lower-priority pipeline.`
        },
        {
          question: "Design the alerting subsystem. How do you evaluate 100,000 alert rules every minute without impacting dashboard query performance?",
          answer: `**Architecture separation:**
- Run an independent **Alert Evaluation Service** (AES) with its own query replicas of the TSDB. Never share query resources with dashboards.

**Evaluation strategy:**
1. **Stagger evaluations**: distribute 100k rules across the 60-second window (~1,667 rules/sec). Do not trigger all rules at second 0.
2. **Rule partitioning**: shard rules across AES worker pods by \`rule_id % N\`. Each pod owns a subset and runs them locally.
3. **Pre-computed rollups**: alert rules on 1-min aggregates read from the rollup table, not raw data — much faster queries.
4. **Incremental evaluation**: for threshold alerts (value > X), store the last known value in Redis. Only re-query TSDB if the cached value is close to the threshold (within 10%).
5. **Alert state machine**: track PENDING → FIRING → RESOLVED transitions to suppress flapping (require N consecutive breaches before firing).
6. **Notification dedup**: route FIRING events to a notification queue; dedup on \`alert_id\` with a cooldown (e.g. 15 min) before re-notifying.`
        }
      ]
    },
    {
      id: "distributed-cache",
      title: "Distributed Cache",
      body: `## Problem
Design a distributed in-memory cache (like Redis Cluster or Memcached) that can scale horizontally and survive node failures.

## Requirements
**Functional**
- GET / SET / DELETE operations with optional TTL
- Support for common data structures (string, hash, list, set)
- Eviction when memory is full
- Replication for read scaling and fault tolerance

**Non-functional / Scale**
- 1M requests/sec peak (80% reads, 20% writes)
- Sub-millisecond p99 latency
- 1 TB total cached data across the cluster
- Survive loss of any single node (no data loss for replicated data)
- < 30 s to detect and recover from a node failure

## High-level design

~~~
Client (cache-aside pattern)
  |
  | hash(key) % N  → shard selection
  v
Consistent Hash Ring
  |
  +---> Shard 1 (Primary)  <---> Replica 1A, Replica 1B
  |
  +---> Shard 2 (Primary)  <---> Replica 2A, Replica 2B
  |
  +---> Shard N (Primary)  <---> Replica NA, Replica NB

Cluster Manager (ZooKeeper / etcd)
  - Monitors node health (heartbeat)
  - Triggers failover: promotes replica to primary
  - Updates routing table on membership change
~~~

**API sketch**
~~~
GET  key              → value | null
SET  key value [EX seconds] [NX|XX]  → OK | nil
DEL  key              → count
INCR / DECR key       → integer
HSET key field value  → integer
EXPIRE key seconds    → 1 | 0
~~~

## Data model / storage
**Pure in-memory, per-node:**

~~~
-- Internal data structures per key
key (string)   → entry {
  type:       string | hash | list | set | zset
  value:      <type-specific structure>
  ttl:        unix_expiry_ms | null
  last_used:  unix_ms        (for LRU eviction)
  size_bytes: int
}

-- LRU eviction index: doubly-linked list + hash map (O(1) get/evict)
-- Expiry index: min-heap or sorted set by expiry time
-- Replication log: append-only command log for async replication
~~~

**No disk storage by default** (optional RDB snapshots / AOF for persistence).

## Key decisions & tradeoffs

| Decision | Option A | Option B | Choice |
|---|---|---|---|
| Partitioning | Modulo hashing | Consistent hashing | **Consistent hashing** — minimize key remapping on node add/remove |
| Replication | Synchronous | Asynchronous | **Async** — lower write latency; accept small replication lag |
| Eviction policy | LRU | LFU / Random | **LRU** (default); **LFU** better for skewed workloads |
| Client routing | Client-side | Proxy (Twemproxy) | **Client-side** — lower latency; proxy adds a hop |
| Write strategy | Cache-aside | Write-through | **Cache-aside** — simpler; write-through risks consistency issues |

## Scaling & bottlenecks
- **Hot keys**: a single key with very high read traffic saturates one shard. Mitigate: **key replication** (store key on multiple shards, append random suffix, route randomly) or **local client-side cache** (in-process, 1 s TTL).
- **Consistent hashing with virtual nodes**: each physical node owns multiple "virtual" ring positions → even distribution; smooth rebalancing when adding nodes.
- **Rebalancing**: when a new node joins, it takes ownership of a portion of the ring from its neighbor. Only those keys need to migrate.
- **Thundering herd on cache miss**: many requests miss simultaneously and all hit the DB. Mitigate: **mutex / single-flight** (only one request populates the cache; others wait), or **probabilistic early recompute** (refresh before TTL expires).
- **Memory pressure**: set \`maxmemory\` per node; LRU eviction kicks in. Monitor \`evicted_keys\` metric — if high, either add nodes or increase TTLs.`,
      flashcards: [
        {
          front: "How does consistent hashing minimize rebalancing when nodes are added or removed?",
          back: `In **modulo hashing** (key % N), changing N remaps ~all keys to different nodes.

In **consistent hashing**:
- Nodes and keys are both placed on a virtual ring (0..2^32).
- A key is owned by the first node clockwise from \`hash(key)\` on the ring.
- Adding a node: only the keys between the new node and its predecessor are remapped — ~1/N of all keys.
- Removing a node: only that node's keys move to its successor.

**Virtual nodes** (vnodes): each physical node is represented by K positions on the ring (e.g. K=150). Improves distribution uniformity and further smooths rebalancing.`
        },
        {
          front: "How do you implement LRU eviction in O(1) time?",
          back: `Combine a **hash map** (O(1) lookup) with a **doubly-linked list** (O(1) move to head/remove):

- **Get**: look up in hash map → if found, move node to head of list → return value.
- **Set**: if key exists, update value + move to head. If new key, insert at head + add to hash map. If at capacity, remove tail node + delete from hash map.
- **Evict**: always remove the tail (least recently used).

This is the classic LRU Cache algorithm. The linked list maintains recency order; the hash map gives O(1) access to any node in the list.`
        },
        {
          front: "What is the thundering herd problem and how do you solve it for cache misses?",
          back: `**Thundering herd**: when a popular cache key expires, hundreds of concurrent requests all miss, all query the DB simultaneously, overloading it.

**Solutions:**
1. **Mutex / single-flight**: the first goroutine/thread that misses acquires a lock (e.g. Redis SET NX), fetches from DB, populates cache, releases lock. Others wait and then read from cache.
2. **Probabilistic early refresh (PER)**: recompute the cache value before TTL expires with increasing probability as expiry approaches. No lock needed; spreads refresh load.
3. **Staggered TTLs**: add random jitter to TTL (e.g. base ± 10%) so not all keys expire simultaneously.
4. **Background refresh**: a separate job proactively refreshes keys with low remaining TTL.`
        },
        {
          front: "When would you use write-through caching vs cache-aside?",
          back: `**Cache-aside (lazy population)**:
- App reads from cache; on miss, fetches from DB and populates cache.
- App writes to DB; cache is invalidated or updated.
- **Pro**: only hot data in cache; simple. **Con**: first request always misses (cold start); risk of stale data.

**Write-through**:
- App writes to cache and DB synchronously.
- **Pro**: cache always has latest data; no cold-start misses after write.
- **Con**: every write hits cache regardless of read frequency; wasted memory for write-heavy keys never read.

**Choice**: cache-aside for read-heavy workloads (most use cases). Write-through for workloads where every written key will be read soon (e.g. user session after login).`
        },
        {
          front: "How do you handle hot key problem in a distributed cache?",
          back: `A single shard node saturates when one key receives disproportionate traffic.

**Mitigations:**
1. **Key replication**: store the hot key on multiple shards with suffixed names (\`key#0\`, \`key#1\`, ...\`key#N\`). Client reads from a random shard.
2. **Local client-side cache**: in-process LRU cache per application pod (e.g. Caffeine in Java). Sub-microsecond reads, no network. TTL of 1–5 s limits staleness.
3. **Read replicas**: replicate the shard containing the hot key and distribute reads across replicas.
4. **Detection**: monitor per-key request counts; alert when a key exceeds a threshold (e.g. 10k req/s).`
        },
        {
          front: "How does async replication affect consistency guarantees in a cache cluster?",
          back: `With **async replication** (Redis default):
- Primary acknowledges write before replication completes.
- If primary crashes before replicating, the replica that becomes primary is **missing recent writes** → stale data returned.

This means the cache offers **eventual consistency**, not strong consistency. This is acceptable because:
1. Caches are not the source of truth — the DB is.
2. A stale cache read results in serving slightly old data, not data loss.
3. For most use cases (session data, computed results) a brief window of stale data is fine.

For critical data requiring strong consistency, use **synchronous replication** at the cost of ~1–2 ms added write latency.`
        }
      ],
      quiz: [
        {
          question: "Your cache hit rate is 95% but you're still seeing DB overload. Identify possible causes and fixes.",
          answer: `**Possible causes:**

1. **Hot keys on DB despite cache hit**: 5% misses on 1M req/s = 50k DB qps. If those misses are concentrated on a few slow queries, they overload the DB even at 5% miss rate. **Fix**: identify which keys are missing via monitoring; pre-warm or extend TTL for those keys.

2. **Write traffic bypassing cache**: writes always go to DB directly. If write rate is high (e.g. counter increments), writes alone can saturate DB. **Fix**: use Redis counters (\`INCR\`) and batch-flush to DB.

3. **Cache stampede at TTL expiry**: a cluster of popular keys all expire at the same second. **Fix**: add TTL jitter; use probabilistic early refresh.

4. **DB queries not cached**: some code paths query the DB without checking cache (a cache miss by design — e.g. complex joins). **Fix**: audit DB query patterns; cache results of expensive read queries.

5. **Cache hit rate is misleading**: 95% hit rate measured by count, but the 5% misses represent the most expensive queries (e.g. full-text search). **Fix**: weight hit rate by query cost, not just count.

6. **Data model too granular**: caching individual rows instead of computed aggregates means many cache lookups still result in multiple DB calls. **Fix**: cache higher-level objects (the full rendered response or joined result).`
        },
        {
          question: "Design a two-level cache hierarchy (L1 in-process, L2 Redis) with cache invalidation. How do you keep L1 caches across 100 pods consistent after a write?",
          answer: `**Architecture:**
- **L1**: In-process LRU cache per pod (e.g. Caffeine). Short TTL (5–30 s). Sub-microsecond reads.
- **L2**: Redis cluster. Millisecond reads. Single source of truth for the cache layer.
- **DB**: Source of truth.

**Read path:** Check L1 → hit: return. Miss → Check L2 → hit: populate L1, return. Miss → Query DB → populate L2, populate L1, return.

**Write path + invalidation:**
1. App writes to DB.
2. App deletes the key from L2 (Redis \`DEL\`).
3. **Problem**: L1 caches on other 99 pods still hold stale data for up to TTL duration.

**Solutions to L1 invalidation:**
- **Short TTL**: keep L1 TTL ≤ 5 s. Stale data window is bounded and usually acceptable.
- **Redis Pub/Sub invalidation**: after writing, publish an invalidation message to a Redis channel (\`PUBLISH invalidation <key>\`). All pods subscribe and evict the key from their L1. Near-instant consistency; adds latency to invalidation path.
- **Versioned keys**: instead of invalidating, embed a version in the cache key (e.g. \`user:42:v7\`). After write, increment version in DB. New reads use new key and miss L1/L2 naturally. Old versions expire via TTL. Simple but wastes memory with stale versioned entries.
- **Hybrid**: use pub/sub for high-value keys (user profiles, pricing); rely on short TTL for low-stakes data.`
        }
      ]
    },
    {
      id: "job-scheduler",
      title: "Job Scheduler",
      body: `## Problem
Design a distributed job scheduler that executes one-off, cron, and delayed jobs reliably, with at-least-once semantics, retries, and a dead-letter queue.

## Requirements
**Functional**
- Schedule jobs: immediate, delayed (run at time T), recurring (cron expression)
- Execute jobs on a pool of workers
- Retry on failure with exponential backoff
- Dead-letter queue (DLQ) for permanently failed jobs
- Job status tracking (pending, running, succeeded, failed)
- Idempotent job execution support

**Non-functional / Scale**
- 10M jobs/day → ~115 jobs/sec average, 1,000 jobs/sec peak
- Job execution latency: < 5 s from scheduled time
- At-least-once delivery (no silent drops)
- Job state durability: survive scheduler crashes
- Horizontal scaling of workers

## High-level design

~~~
Client API
  |
  | POST /jobs  { handler, payload, scheduled_at, cron, max_retries }
  v
Job Service
  |
  +---> Jobs DB (Postgres)  -- store job definition + state
  |
  v
Scheduler (leader-elected cron daemon)
  |   Polls DB for due jobs → enqueues to queue
  v
Message Queue (SQS / RabbitMQ / Kafka)
  |
  v
Worker Pool (autoscaled)
  |
  +-- on success: mark SUCCEEDED in DB
  +-- on failure: increment retry_count; if < max_retries → re-enqueue with backoff delay
                  if >= max_retries → move to DLQ, mark FAILED
~~~

**API sketch**
~~~
POST /api/v1/jobs
  { "handler": "send_email", "payload": {...},
    "scheduled_at": "2026-07-10T09:00:00Z",
    "cron": "0 9 * * 1-5",
    "max_retries": 3, "idempotency_key": "invoice-123" }

GET /api/v1/jobs/:id          → job status + history
DELETE /api/v1/jobs/:id       → cancel (if not running)
POST /api/v1/jobs/:id/retry   → manually retry a FAILED job
~~~

## Data model / storage
**DB: PostgreSQL** (ACID transactions for state transitions; row-level locking for queue polling)

~~~
jobs
  id              UUID         PRIMARY KEY
  handler         TEXT         NOT NULL      -- worker function name
  payload         JSONB
  status          TEXT         NOT NULL      -- pending|running|succeeded|failed|dead
  scheduled_at    TIMESTAMPTZ  NOT NULL
  cron_expr       TEXT                       -- null for one-off jobs
  next_run_at     TIMESTAMPTZ               -- computed from cron
  attempt_count   INT          DEFAULT 0
  max_retries     INT          DEFAULT 3
  last_error      TEXT
  locked_by       TEXT                       -- worker ID holding the lock
  locked_at       TIMESTAMPTZ
  created_at      TIMESTAMPTZ  DEFAULT now()
  idempotency_key TEXT         UNIQUE

job_history
  id              UUID         PRIMARY KEY
  job_id          UUID         REFERENCES jobs(id)
  attempt         INT
  started_at      TIMESTAMPTZ
  finished_at     TIMESTAMPTZ
  status          TEXT
  error           TEXT

dlq
  id              UUID         PRIMARY KEY
  job_id          UUID
  payload         JSONB
  failed_at       TIMESTAMPTZ
  reason          TEXT
~~~

**Index:** \`CREATE INDEX ON jobs(next_run_at) WHERE status = 'pending'\` — fast polling for due jobs.

## Key decisions & tradeoffs

| Decision | Option A | Option B | Choice |
|---|---|---|---|
| Scheduler coordination | Single leader (ZK election) | All nodes poll DB | **Leader election** — avoids thundering herd on DB poll |
| Queue backend | DB as queue (SKIP LOCKED) | External queue (SQS) | **External queue** — better throughput; DB queue OK up to ~1k/s |
| Delivery guarantee | At-most-once | At-least-once | **At-least-once** — jobs must be idempotent |
| Worker lease | Heartbeat + timeout | Visibility timeout | **Visibility timeout** (SQS model) — simpler than distributed lock |
| Retry strategy | Fixed interval | Exponential backoff + jitter | **Exponential backoff + jitter** — avoids retry storms |

## Scaling & bottlenecks
- **Scheduler bottleneck**: single leader polls for due jobs. At 1,000 jobs/sec, Postgres with \`SELECT ... FOR UPDATE SKIP LOCKED LIMIT 100\` can handle this. For higher scale, shard jobs by \`handler\` type across multiple scheduler shards.
- **Worker scaling**: workers are stateless; autoscale on queue depth. Use KEDA (queue-based autoscaling) in Kubernetes.
- **Clock skew**: cron jobs may fire slightly late; always compute \`next_run_at\` from the DB server clock, not the application clock.
- **Stale locks**: if a worker crashes while running a job, the job stays \`running\`. Heartbeat mechanism: worker updates \`locked_at\` every 30 s; scheduler considers job abandoned if \`locked_at\` > 2 min ago → re-enqueue.
- **Idempotency**: workers use \`idempotency_key\` to detect duplicate executions (e.g. INSERT ... ON CONFLICT DO NOTHING on the action's result table).`,
      flashcards: [
        {
          front: "How do you guarantee at-least-once delivery without losing jobs on worker crash?",
          back: `Use a **visibility timeout** (SQS model):
1. Worker receives message from queue but message is NOT deleted yet — it becomes invisible to other workers for N seconds (visibility timeout).
2. Worker executes the job. On success, it **explicitly deletes** the message.
3. If the worker crashes, the visibility timeout expires → message reappears in the queue → another worker picks it up.

**Key**: never delete the message before the job is complete. This guarantees at-least-once delivery. Workers must be idempotent to handle duplicate executions.`
        },
        {
          front: "How do you implement exactly-once execution (or as close as possible)?",
          back: `True exactly-once is impossible in distributed systems (two-generals problem). Achieve **effectively-once** via idempotency:

1. **Idempotency key**: client supplies a unique key per logical operation. Worker wraps execution in a transaction:
   - Try to INSERT into \`completed_jobs(idempotency_key)\` with ON CONFLICT DO NOTHING.
   - If INSERT succeeds → execute job → commit.
   - If INSERT fails (conflict) → job already ran → skip.
2. **Database transactions**: if the job writes to a DB, perform the idempotency check and the job's write in the same transaction.
3. **External side effects** (emails, payments): use idempotency keys supported by the external API (Stripe supports this natively).`
        },
        {
          front: "How do you implement cron job scheduling without missing runs during downtime?",
          back: `1. Store \`next_run_at\` in the jobs table, computed from the cron expression.
2. After each run, compute and store the **next** \`next_run_at\` immediately (before the job finishes).
3. On scheduler restart, query for jobs where \`next_run_at <= now()\` — any missed runs are caught up.
4. **Missed run policy**: configurable — fire once (catch up), fire all missed, or skip missed runs depending on job semantics.
5. **Leader election** (ZooKeeper/etcd): only the elected leader fires cron jobs, preventing duplicate fires from multiple scheduler nodes.`
        },
        {
          front: "How do you design the retry strategy for failed jobs?",
          back: `**Exponential backoff with jitter:**
- Delay = min(cap, base * 2^attempt) + random(0, jitter)
- Example: base=1s, cap=1hr → delays: ~1s, ~2s, ~4s, ~8s ... ~1hr
- Jitter prevents retry storms (many jobs failing at the same time all retrying simultaneously).

**Implementation**: on failure, enqueue a new job message with \`delay = backoff(attempt_count)\`. SQS supports message delay up to 15 min; for longer delays store in DB and re-enqueue when due.

**DLQ**: after \`max_retries\` exhausted, move to DLQ for manual inspection. Alert on DLQ depth.`
        },
        {
          front: "How do you prevent a scheduler from double-scheduling jobs when multiple nodes are running?",
          back: `**Leader election pattern:**
1. Use ZooKeeper, etcd, or Redis (Redlock) to elect one scheduler as leader.
2. Only the leader polls for due jobs and enqueues them.
3. Other nodes are on standby and participate in the election.
4. On leader failure, standby nodes elect a new leader within seconds.

**Alternative — Distributed locking per job:**
Use \`SELECT ... FOR UPDATE SKIP LOCKED\` in Postgres. Multiple scheduler nodes can safely poll — SKIP LOCKED ensures each job row is only locked by one node at a time. Simpler than leader election; viable up to ~1,000 jobs/sec.`
        }
      ],
      quiz: [
        {
          question: "Your job scheduler has 1,000 cron jobs that all fire at midnight. Describe how this causes a problem and how you would solve it.",
          answer: `**Problem — Thundering herd at midnight:**
1. The scheduler queries DB for all 1,000 due jobs at once → N queries or one large query → DB spike.
2. All 1,000 jobs enqueued to queue simultaneously → workers spin up (or are overwhelmed) at the same time → downstream services (DB, external APIs) get hammered simultaneously.
3. If jobs share dependencies (same DB table, same 3rd party API rate limit), concurrent execution causes contention or rate-limit errors.

**Solutions:**
1. **Stagger \`next_run_at\`**: instead of \`2026-07-10 00:00:00\` for all jobs, add a deterministic offset: \`hash(job_id) % 3600 seconds\`. Jobs spread over the first hour instead of firing at the same second. Store the offset in the jobs table.
2. **Rate-limited enqueuing**: the scheduler enqueues at most N jobs/sec (e.g. 100/sec), queuing remaining due jobs to be enqueued in subsequent polling cycles.
3. **Queue depth limits per handler**: if \`send_report\` jobs saturate the queue, other job types continue processing.
4. **Worker concurrency limits per job type**: even if all 1,000 jobs are enqueued, workers process at most M concurrent jobs of the same type, preventing downstream overload.`
        },
        {
          question: "A critical payment job has been running for 2 hours (expected 5 minutes). The worker appears stuck. How does your system detect and handle this?",
          answer: `**Detection:**
1. **Heartbeat timeout**: the worker sends a heartbeat (updates \`locked_at\` in the jobs table) every 30 s. The scheduler checks for jobs where \`status = 'running' AND locked_at < now() - interval '2 minutes'\`. After 2 hours, this job is definitely detected as stuck.
2. **Job execution timeout**: set a per-job \`timeout_seconds\` field. The worker itself enforces a deadline and forcibly kills/cancels the job after the timeout. For a 5-minute expected job, set timeout to 15–30 minutes.
3. **Alerting**: monitor p99 job execution duration per handler type; alert when any job exceeds 2× expected duration.

**Handling:**
1. Mark the job as \`timed_out\` (a sub-status of failed).
2. If \`attempt_count < max_retries\`: re-enqueue with retry. **Critical**: ensure the job is idempotent — if the payment was already processed (e.g. network timeout after the charge succeeded), re-running must detect this via idempotency key and not double-charge.
3. If idempotency key exists and payment succeeded (detectable via payment provider API): mark job \`succeeded\`, do not re-enqueue.
4. If \`attempt_count >= max_retries\`: move to DLQ, alert on-call engineer immediately (payment jobs require human review before retry).`
        }
      ]
    },
    {
      id: "file-storage",
      title: "File Storage",
      body: `## Problem
Design a scalable file storage service (like Dropbox or Google Drive) supporting upload, download, sharing, and sync across devices.

## Requirements
**Functional**
- Upload / download files up to 5 GB
- Organize files in folder hierarchies
- Share files/folders with other users (read/write/admin)
- Sync changes across devices
- File versioning (last 30 versions)

**Non-functional / Scale**
- 500M users, 100M daily active users
- Avg file size 500 KB; users store avg 10 GB → 5 EB total storage
- 10M uploads/day → ~115 uploads/sec
- 100M downloads/day → ~1,150 downloads/sec
- Upload/download: multi-region CDN for low latency globally
- 99.99% availability; 99.999999999% (11 nines) durability

## High-level design

~~~
Client (Desktop/Mobile)
  |
  | 1. Request upload URL
  v
API Service
  |
  +---> Metadata DB (Postgres)   -- file/folder tree, versions, ACLs
  |
  | 2. Return pre-signed S3 URL
  v
Client
  |
  | 3. PUT large file directly to S3 (chunked multipart)
  v
Object Store (S3 / GCS)
  |
  | 4. S3 event → Lambda → notify Metadata Service
  v
Metadata Service
  |   Create FileVersion record; update sync state
  v
Notification Service → push to other client devices (WebSocket / long-poll)
  |
Client B (another device of same user)
  |
  | 5. Fetch changed chunks via CDN
  v
CDN (CloudFront / Fastly)  ← caches popular/shared files
~~~

## Data model / storage
**Metadata: PostgreSQL** (ACID for namespace operations, tree traversal)

~~~
users
  id          BIGINT       PRIMARY KEY
  email       TEXT         UNIQUE
  quota_bytes BIGINT       DEFAULT 10_000_000_000

folders
  id          BIGINT       PRIMARY KEY
  owner_id    BIGINT       REFERENCES users(id)
  parent_id   BIGINT       REFERENCES folders(id)   -- null = root
  name        TEXT
  path        LTREE        -- Postgres ltree extension for hierarchy queries

files
  id          BIGINT       PRIMARY KEY
  folder_id   BIGINT       REFERENCES folders(id)
  owner_id    BIGINT       REFERENCES users(id)
  name        TEXT
  size_bytes  BIGINT
  content_hash TEXT        -- SHA-256 of full file (for dedup)
  current_version_id BIGINT

file_versions
  id            BIGINT     PRIMARY KEY
  file_id       BIGINT     REFERENCES files(id)
  version_num   INT
  storage_key   TEXT       -- S3 object key
  size_bytes    BIGINT
  chunk_hashes  TEXT[]     -- SHA-256 per chunk (for delta sync)
  created_at    TIMESTAMPTZ

permissions
  id            BIGINT     PRIMARY KEY
  resource_type TEXT       -- file | folder
  resource_id   BIGINT
  grantee_id    BIGINT     REFERENCES users(id)
  permission    TEXT       -- read | write | admin
  inherited     BOOLEAN
~~~

**Object storage: S3** with lifecycle rules (current versions → S3 Standard; old versions → S3-IA after 30 days → Glacier after 1 year).

## Key decisions & tradeoffs

| Decision | Option A | Option B | Choice |
|---|---|---|---|
| Upload path | Through API servers | Pre-signed URL direct to S3 | **Pre-signed URL** — avoids API bottleneck for large files |
| Chunking | Client-side (4 MB chunks) | Server-side | **Client-side** — enables pause/resume, delta sync |
| Dedup | Content hash per file | Content hash per chunk | **Per chunk** — more granular; blocks shared across files |
| Sync protocol | Upload full file | Delta sync (changed chunks only) | **Delta sync** — saves bandwidth for large partially-changed files |
| CDN caching | Cache all files | Cache shared/popular files | **Selective** — private files get pre-signed short-lived URLs |

## Scaling & bottlenecks
- **Large file uploads**: use S3 multipart upload. Client splits file into 4–100 MB chunks, uploads in parallel (up to 8 parallel connections), S3 assembles. Supports pause/resume.
- **Delta sync**: client maintains chunk hashes locally. On file change, compute which chunks changed, upload only those. Server stores \`chunk_hashes[]\` per version — diffing shows exactly which chunks are new.
- **Deduplication**: if \`content_hash\` of a file (or chunk) already exists in storage, skip the upload and reference the existing object. Saves significant storage for common files (PDFs, images).
- **Metadata DB hotspot**: folder rename/move requires updating all descendants' paths. Use Postgres \`LTREE\` extension or materialized path for O(1) subtree operations with a single UPDATE.
- **Sharing at scale**: when a file is shared with 100k users, storing 100k permission rows is fine; checking permissions uses an index on \`(resource_id, grantee_id)\`. Inherited permissions resolved at query time via folder ancestry.`,
      flashcards: [
        {
          front: "How do you support upload/download of large files (up to 5 GB) efficiently?",
          back: `**Multi-part / chunked upload (S3 multipart):**
1. Client requests a pre-signed multipart upload session from the API.
2. Client splits file into 4–100 MB chunks, uploads chunks in parallel directly to S3 (bypassing API servers).
3. Client sends a "complete" request listing all ETag (chunk IDs) → S3 assembles.
4. Supports **pause/resume**: if upload interrupted, only failed chunks need to be re-uploaded.

**Download via CDN:**
- Public/shared files: served via CDN (CloudFront). Cache-Control headers control TTL.
- Private files: API generates pre-signed S3 URLs (15-min expiry) → client downloads directly from S3/CDN without going through API servers.`
        },
        {
          front: "How do you implement delta sync to minimize bandwidth when files change?",
          back: `1. Split files into fixed-size chunks (e.g. 4 MB) client-side.
2. Compute **SHA-256 hash** for each chunk; store the list on the server per file version.
3. On file change, client computes new chunk hashes, diffs against the server's last-known chunk list.
4. Only upload chunks where hashes differ.
5. Server stores the new version with the updated chunk list, referencing unchanged chunks by their existing storage key.

**Example**: editing a 1 GB file in the middle → only ~2 chunks (8 MB) uploaded instead of 1 GB.

Use **rolling hash (Rsync algorithm)** for variable-size chunking — better deduplication across files with insertions/deletions.`
        },
        {
          front: "How do you design deduplication across all users' files?",
          back: `**Content-addressed storage:**
- Every chunk's storage key is its **SHA-256 hash** (content-addressed).
- Before uploading a chunk, client asks: "does hash X exist?" → \`GET /chunks/<hash>/exists\`
- If yes: skip upload, reference existing chunk. If no: upload.
- The file_version record stores \`chunk_hashes[]\` — these are both the chunk identifiers and the storage keys.

**Benefits**: users uploading the same file (e.g. popular PDF) store only one copy. Each user has a logical reference.

**Garbage collection**: a chunk object can only be deleted from S3 when no file_version references it → need a reference-count or a periodic GC scan.`
        },
        {
          front: "How do you sync file changes to multiple devices in real time?",
          back: `1. Device A uploads a changed file → metadata service updates the file record.
2. Metadata service publishes a \`file_changed\` event to Kafka, keyed by \`user_id\`.
3. **Notification service** consumes events; maps \`user_id\` to connected devices via a WebSocket session registry (stored in Redis).
4. Pushes a lightweight notification to each connected device: \`{ file_id, version_id, changed_chunks: [...] }\`
5. Device B receives notification, fetches only the changed chunks from CDN/S3.

**Offline devices**: use a **sync log** per user (append-only table of changes). When a device reconnects, it queries changes since its last known cursor.`
        },
        {
          front: "How do you model file permissions and inheritance efficiently?",
          back: `**Permission inheritance (folder permissions apply to contents):**
- Store explicit permissions on folders and files in a \`permissions\` table.
- On access check: walk the folder ancestry (or use Postgres \`LTREE\` ancestor query) and union permissions.
- Cache resolved permissions in Redis (key: \`perm:<user_id>:<file_id>\`, TTL 5 min). Invalidate on permission change.

**Performance**:
- Index on \`(resource_id, grantee_id)\` for direct lookups.
- For sharing with groups: add a \`groups\` table and group_members; check both user and group permissions.
- Avoid N+1: batch permission checks for folder listings.`
        },
        {
          front: "How do you handle file versioning and storage lifecycle to control costs?",
          back: `**Version retention**: keep last 30 versions per file. On 31st version creation, delete the oldest version's chunk references. Run GC to clean unreferenced chunks.

**Storage tiering with S3 lifecycle rules:**
- **Current version**: S3 Standard (hot, low latency, expensive).
- **Versions 2–30, < 30 days old**: S3 Standard-IA (infrequent access, ~40% cheaper).
- **Old versions > 30 days**: S3 Glacier (archival, ~90% cheaper, retrieval takes minutes–hours).
- **Deleted files trash bin**: soft-delete for 30 days (recoverable), then hard delete → S3 object deletion.

Lifecycle rules are configured as S3 bucket policies — no application code needed for tiering.`
        }
      ],
      quiz: [
        {
          question: "A user has a folder shared with 10,000 collaborators. They rename the folder. Describe all the operations this triggers and how you handle them efficiently.",
          answer: `**Operations triggered by folder rename:**

1. **Metadata update**: update the folder's \`name\` and \`path\` (LTREE) in the DB. With LTREE, a subtree rename is: \`UPDATE folders SET path = new_prefix || subpath(path, depth) WHERE path <@ old_path\` — single UPDATE statement, atomic, affects entire subtree.

2. **Permission cache invalidation**: the folder's path is used in permission resolution caches. Invalidate all cached permissions for this folder and descendants. With Redis, use a pattern delete or publish an invalidation event to all app servers.

3. **Sync notifications**: 10,000 collaborators need to be notified of the rename.
   - Do NOT notify all 10,000 synchronously — this causes a write storm.
   - Publish one event to Kafka: \`{ folder_id, new_name, user_id }\`.
   - Notification service fans out to connected collaborators at a controlled rate.
   - Offline collaborators pick up the change from the sync log on next connection.

4. **URL/link updates**: if collaborators have bookmarked paths, those paths are now stale. Options: redirect old path to new path (store path aliases); or use the stable \`folder_id\` in all internal links (preferred).

5. **Quota**: no quota impact (rename doesn't change size).

**Bottleneck**: the LTREE UPDATE on a deep folder with many descendants. Mitigate: run as a background job if the subtree is large; show "rename in progress" UI state.`
        },
        {
          question: "How would you design the client-side sync algorithm to handle conflicts when two devices edit the same file simultaneously?",
          answer: `**Conflict scenarios:**
- Device A and Device B both edit the same file while offline → both attempt to upload a new version when they reconnect.

**Conflict detection:**
- Each client tracks the \`version_id\` it last synced. When uploading, it includes \`base_version_id\` in the request.
- Server checks: does the current version of the file still equal \`base_version_id\`?
  - Yes → clean upload, create new version.
  - No → **conflict detected**.

**Conflict resolution strategies:**
1. **Last-write-wins (LWW)**: simplest. Server timestamp determines winner. Loser's changes are overwritten. Appropriate for non-collaborative files.
2. **Both preserved**: create two conflicting versions (\`report.docx\` and \`report (Dotan's conflicted copy).docx\`). Let the user manually resolve. Dropbox uses this approach.
3. **Operational transformation (OT) / CRDT**: for collaborative documents (Google Docs model), merge changes at the character/field level. Requires document-type-specific merge logic. Complex to implement correctly.

**Recommended for general file storage**: option 2 (preserve both). Simple, no data loss, user retains control. Implement via:
1. Server creates a \`conflicted_copy\` file record alongside the original.
2. Both devices eventually sync both versions.
3. User resolves and deletes one.

Add a UI badge on conflicted files to prompt resolution.`
        }
      ]
    },
    {
      id: "recommendation-service",
      title: "Recommendation Service",
      body: `## Problem
Design a recommendation service (like Netflix or Spotify's "Recommended for you") that serves personalized recommendations in real time.

## Requirements
**Functional**
- Return a ranked list of N recommendations for a given user
- Recommendations update as user behavior changes (clicks, watches, purchases)
- Support multiple recommendation types (homepage, "more like this", "trending")
- Cold start: handle new users with no history

**Non-functional / Scale**
- 100M daily active users × 10 recommendation requests/day → **~11,600 req/sec**
- Recommendation serving latency: < 100 ms p99
- Freshness: recommendations updated within 1 hour of new user actions
- Model training: batch daily, online updates within minutes

## High-level design

~~~
User Request
  |
  v
Recommendation API  (serving layer, < 100ms SLA)
  |
  +---> Candidate Generator  (retrieval: narrow millions → thousands)
  |         |
  |     Embedding / ANN lookup (Faiss / Pinecone)
  |         |
  +---> Ranker (scoring model: thousands → top N)
  |         |
  |     Feature Store (online, low-latency)
  |
  +---> Business Rules Filter (boost, bury, dedup)
  |
  v
Ranked Recommendations (cached in Redis per user, TTL 10 min)

Offline Pipeline (daily):
  User events (Kafka) → Spark → Train model → Model Registry → Deploy

Online Pipeline (near real-time):
  User events → Flink → Update user features in Feature Store (Redis/DynamoDB)
~~~

## Data model / storage

~~~
-- Item embeddings (dense vector representations)
item_embeddings
  item_id   BIGINT     PRIMARY KEY
  embedding FLOAT[128] -- dense vector
  -- stored in Faiss / Pinecone for ANN search

-- User profile / features (feature store)
user_features (Redis hash, key = user:<id>:features)
  last_N_items_interacted  LIST<item_id>   -- recent history
  preferred_genres         MAP<genre, score>
  avg_watch_duration       FLOAT
  last_updated             TIMESTAMP

-- Interaction log (source of truth)
events (Kafka → Iceberg / Parquet on S3)
  user_id   BIGINT
  item_id   BIGINT
  event     TEXT      -- view | click | purchase | skip
  timestamp TIMESTAMPTZ
  context   JSONB     -- page, position, device

-- Model artifacts
model_registry
  model_id    UUID
  model_type  TEXT     -- candidate_gen | ranker
  version     TEXT
  s3_path     TEXT
  deployed_at TIMESTAMPTZ
  metrics     JSONB    -- AUC, NDCG, online A/B metrics
~~~

## Key decisions & tradeoffs

| Decision | Option A | Option B | Choice |
|---|---|---|---|
| Retrieval approach | Collaborative filtering (CF) | Content-based filtering | **Hybrid** — CF for known users; content-based for cold start |
| Candidate generation | Item-item similarity | User-item ANN search | **ANN (Faiss)** — sub-millisecond lookup for millions of items |
| Ranking model | Heuristic scoring | ML model (GBDT / DNN) | **ML model** — captures complex feature interactions |
| Feature freshness | Batch (daily) | Online (minutes) | **Online features** via Flink; batch for expensive aggregations |
| Serving cache | Per-user cached recs | Real-time generation | **Cache** (Redis TTL 10 min) — meets latency SLA; refresh async |

## Scaling & bottlenecks
- **ANN index scale**: Faiss index for 100M items × 128 dims = ~50 GB. Must fit in memory. Shard across nodes (horizontal sharding by item_id ranges). Use HNSW index for sub-ms recall.
- **Feature store hot path**: user feature lookup must be < 10 ms. Use Redis with consistent hashing; replicate for reads. Flink writes updates with \`merge\` semantics.
- **Cold start** (new user): no interaction history → fall back to popularity-based recommendations, demographic-based, or content-based (using onboarding preferences). Gradually blend in collaborative filtering as interactions accumulate.
- **Recommendation cache stale on burst activity**: user watches 3 movies in a row → cached recs become stale. Invalidate cache on significant behavior change (e.g. > N interactions since last cache write).
- **Feedback loop / filter bubble**: model trained on clicks → learns to recommend only what users already like. Mitigate with **exploration** (epsilon-greedy or Thompson sampling: inject N% diverse/novel items).`,
      flashcards: [
        {
          front: "How do you structure a two-tower recommendation system for candidate generation?",
          back: `**Two-tower (dual encoder) architecture:**
- **User tower**: neural network encoding user features → 128-dim user embedding.
- **Item tower**: neural network encoding item features → 128-dim item embedding.
- **Similarity**: dot product or cosine similarity between user and item embeddings.
- **Training**: contrastive learning — positive pairs (user, interacted item), negative pairs (user, random item).

**Serving:**
- Pre-compute and index all item embeddings in a vector store (Faiss/Pinecone).
- At inference: compute user embedding (fast, one forward pass) → ANN search → top-K similar items in sub-milliseconds.
- No need to score all items; ANN retrieves ~1,000 candidates efficiently.`
        },
        {
          front: "How do you handle the cold start problem for new users and new items?",
          back: `**New users (no interaction history):**
1. **Onboarding preferences**: ask users to select interests/genres → map to content-based recommendations immediately.
2. **Demographic-based**: recommend popular items in the user's region/age group.
3. **Popularity fallback**: global trending items, regionally trending, editorially curated.
4. **Explore quickly**: after just 3–5 interactions, start incorporating collaborative signals; model converges fast.

**New items (no interaction history):**
1. **Content-based features**: use item metadata (genre, description embedding, director, etc.) to place new items near similar existing items in the embedding space.
2. **Exposure injection**: force-rank new items into some recommendation slots ("cold start boost") to gather initial interaction data.
3. **Bandit algorithms** (Thompson sampling): balance exploitation (known good items) vs exploration (new items).`
        },
        {
          front: "How do you keep user features fresh for near-real-time recommendations?",
          back: `**Two-layer feature freshness:**
1. **Online features (seconds to minutes)**: Flink consumes user events from Kafka in real time. Updates a \`user features\` hash in Redis (recent N items, last session context). Serving layer reads from Redis — sub-10ms lookup.
2. **Batch features (hours to days)**: Spark aggregates historical behavior → rich features (long-term preferences, lifetime value, seasonality). Stored in a feature store (Feast, Tecton) backed by DynamoDB or Cassandra.

**Point-in-time correct training**: during model training, features must reflect what was known AT the time of each event, not future data. Use a feature store that supports historical snapshots.`
        },
        {
          front: "How do you A/B test recommendation models without impacting the user experience?",
          back: `1. **User-level assignment**: hash user_id to assign to control or treatment group. Sticky assignment — same user always sees the same model.
2. **Shadow mode**: new model runs in parallel, its results are logged but not shown. Compare offline metrics before going live.
3. **Gradual rollout**: start at 1% traffic → 5% → 20% → 50% → 100% with guardrail metrics at each stage.
4. **Guardrail metrics**: define failure conditions (engagement drop > X%, revenue drop > Y%) that trigger automatic rollback.
5. **Interleaving** (Netflix approach): blend items from both models in a single response, track which items are clicked — fast, sensitive comparison with less traffic needed.`
        },
        {
          front: "How do you avoid filter bubbles and feedback loops in recommendation models?",
          back: `**Problem**: model trained on clicks → recommends clickbait → users click → reinforces the bias. Users never discover new content.

**Mitigations:**
1. **Epsilon-greedy exploration**: with probability ε (e.g. 5%), inject random (diverse/novel) items instead of highest-ranked ones.
2. **Thompson sampling / UCB (Upper Confidence Bound)**: multi-armed bandit approach that naturally balances exploration and exploitation.
3. **Diversity constraints**: post-ranking filter to enforce minimum diversity (e.g. max 2 items from the same category in top 10).
4. **Long-term reward training**: optimize for 30-day retention, not just immediate clicks — encourages discovery over clickbait.
5. **Serendipity metric**: explicitly measure and reward recommendations outside the user's known preference space.`
        }
      ],
      quiz: [
        {
          question: "Your recommendation latency is 250 ms but the SLA is 100 ms. Profile the system and describe where the latency is likely hiding and how to fix each.",
          answer: `**Typical latency breakdown for a 250 ms recommendation:**

1. **Candidate generation / ANN search (50–100 ms)**: Faiss index too large to fit in RAM, causing disk I/O. **Fix**: ensure the Faiss index is fully in memory (HNSW in RAM). Shard across nodes — each node handles a subset of items. Use quantization (PQ) to compress index: 50% memory reduction with < 1% recall loss.

2. **Feature store lookup (30–80 ms)**: Redis latency spike, or too many sequential lookups. **Fix**: batch all feature reads in one Redis pipeline call. Check for Redis memory pressure (evictions) — add replicas. Use consistent hashing so each user's features live on one node.

3. **Ranking model inference (50–100 ms)**: ML model running on CPU is slow. **Fix**: serve model on GPU (TensorRT, triton inference server). Alternatively, distill a simpler model (logistic regression + feature crosses) for latency-sensitive serving. Cache model results for identical feature vectors.

4. **Business rules / deduplication (10–20 ms)**: sequential Python logic. **Fix**: move to compiled code (C++ extension or Rust); parallelise checks.

5. **Network overhead**: if candidate gen and ranker are separate services, each hop adds ~2–5 ms. **Fix**: co-locate on the same host or use gRPC with keep-alive connections.

**Quick wins**: recommendation caching (Redis, TTL 10 min) eliminates the entire pipeline for non-fresh requests — serves most traffic from cache.`
        },
        {
          question: "How would you design the offline training pipeline to ensure model quality and safe deployment?",
          answer: `**Offline training pipeline:**

1. **Data collection**: user events stream to Kafka → Flink consumer writes to Parquet/Iceberg on S3 (immutable, queryable, partitioned by date).

2. **Feature engineering (Spark)**:
   - Join events with item metadata, user profiles.
   - Generate training examples: (user_features, item_features) → label (1 for positive interaction, 0 for negative/unshown items).
   - **Avoid data leakage**: use point-in-time correct feature values (feature store historical snapshots).
   - **Negative sampling**: sample unshown items as negatives; hard negatives (items the user skipped) improve model quality.

3. **Training**: distributed training (Spark MLlib, PyTorch DDP on multiple GPUs). Hyperparameter tuning with parallel trials.

4. **Offline evaluation**:
   - **Holdout set**: reserve last N days as test set (temporal split, not random — avoids future leakage).
   - Metrics: AUC-ROC, NDCG@K, precision@K, recall@K.
   - **Bias checks**: ensure model quality is consistent across user demographics.

5. **Model registry**: log model artifacts, training metadata, and metrics to MLflow/SageMaker Model Registry. Require review before promotion to \`staging\`.

6. **Shadow deployment**: new model runs in parallel on live traffic; results logged but not served. Compare click-through rate of shadow vs production recommendations.

7. **Gradual rollout**: 1% → 5% → 20% → 100% with automated guardrail checks at each stage. Rollback trigger: online CTR drop > 2% relative to control.

8. **Training freshness**: daily training cycle; for rapidly changing catalogs (news, live events), run incremental training every hour on the delta.`
        }
      ]
    },
    {
      id: "event-processing-pipeline",
      title: "Event Processing Pipeline",
      body: `## Problem
Design a scalable event processing pipeline (like a clickstream or IoT analytics system) that ingests high-volume events, processes them in real time, and serves analytics queries.

## Requirements
**Functional**
- Ingest events from web/mobile/IoT clients
- Real-time aggregations: per-minute counts, sliding window metrics
- Batch analytics: daily/weekly reports
- Replay past events for backfill or bug fixes
- Exactly-once processing semantics where possible

**Non-functional / Scale**
- 1M events/sec peak ingest
- Event size: avg 1 KB → **~1 GB/sec** ingest throughput
- End-to-end latency (ingest → dashboard update): < 30 s for real-time path
- Historical data retention: 1 year (hot), 7 years (cold archive)
- 99.9% availability; zero data loss for critical events

## High-level design

~~~
Producers (web, mobile, IoT)
  |
  | HTTP/gRPC (batched, compressed)
  v
Ingest Gateway  (validates, enriches, routes)
  |
  v
Kafka Cluster (partitioned by event_type or user_id)
  |
  +----> Stream Processor (Flink)
  |            |         |
  |     Real-time     Stateful
  |     aggregation   windowing
  |            |
  |      OLAP Store (ClickHouse / Druid)
  |            |
  |      Dashboard / Alert API
  |
  +----> Batch Processor (Spark)
               |
          Data Lake (S3 Parquet / Iceberg)
               |
          Batch Reports / ML Training

Kafka also enables:
  - Replay: re-read from any offset
  - Fan-out: multiple consumer groups, independent processing
~~~

**API sketch**
~~~
POST /api/v1/events
  Body: [
    { "type": "page_view", "user_id": "...", "page": "/home", "ts": 1719000000 },
    { "type": "click",     "user_id": "...", "element_id": "buy_btn", "ts": ... }
  ]
  Response: { "accepted": 100, "rejected": 0 }

GET /api/v1/metrics/realtime?metric=page_views&granularity=1m&last=60
GET /api/v1/reports/daily?date=2026-07-08
~~~

## Data model / storage

~~~
-- Kafka topic schema (Avro / Protobuf, Schema Registry)
Event {
  event_id:   string (UUID)
  event_type: string
  user_id:    string
  session_id: string
  properties: map<string, any>
  timestamp:  long (epoch ms)
  ingested_at: long
}

-- ClickHouse (OLAP, columnar, real-time aggregations)
events (ReplicatedMergeTree, partitioned by toYYYYMMDD(timestamp))
  event_id    UUID
  event_type  LowCardinality(String)
  user_id     UUID
  session_id  UUID
  timestamp   DateTime64(3)
  properties  Map(String, String)

-- Pre-aggregated materialized views (ClickHouse)
event_counts_per_minute
  event_type  LowCardinality(String)
  minute      DateTime
  count       UInt64

-- Data lake (Parquet on S3, partitioned by date/event_type)
-- Used for batch processing, ML training, long-term retention
~~~

## Key decisions & tradeoffs

| Decision | Option A | Option B | Choice |
|---|---|---|---|
| Message broker | Kafka | Kinesis / Pulsar | **Kafka** — replay, high throughput, broad ecosystem |
| Stream processor | Spark Streaming | Apache Flink | **Flink** — true streaming, lower latency, better state mgmt |
| OLAP store | Druid | ClickHouse | **ClickHouse** — simpler ops, faster ad-hoc queries |
| Exactly-once | Best-effort + dedup | Kafka transactions | **Kafka transactions** for critical paths; dedup for others |
| Windowing | Tumbling (fixed) | Sliding / Session | **Sliding** for UX metrics; **Session** for user journey |

## Scaling & bottlenecks
- **Kafka partitioning**: partition by \`user_id\` for user-level ordering; partition by \`event_type\` for type-level throughput. Use enough partitions (rule of thumb: max expected consumers × 2).
- **Backpressure**: if Flink consumers fall behind, Kafka consumer group lag grows. Monitor \`consumer_lag\`. Flink auto-backpressures upstream by slowing down; set \`max.poll.interval\` accordingly.
- **Exactly-once semantics**: Kafka + Flink + ClickHouse chain: use Flink's **two-phase commit** (2PC) with Kafka transactions. Flink checkpoints state; on failure, rolls back to last checkpoint and reprocesses. ClickHouse dedup on \`event_id\` as a safety net.
- **Replay**: consuming from Kafka offset 0 for a year of data takes hours. For fast replay, read from the **data lake** (S3 Parquet) directly into Spark — much faster bulk read than Kafka.
- **Hotspot events**: a viral event causes one Kafka partition to be overwhelmed. Mitigate: use a compound partition key (\`event_type + random_suffix\`) to spread load; re-aggregate downstream.`,
      flashcards: [
        {
          front: "How do you choose between stream processing and batch processing for event analytics?",
          back: `**Stream processing (Flink/Kafka Streams):**
- Processes events as they arrive, sub-second to seconds latency.
- Suitable for: real-time dashboards, alerting, fraud detection, live A/B metric tracking.
- Tradeoffs: harder to debug, state management complexity, more expensive infrastructure.

**Batch processing (Spark):**
- Processes accumulated data periodically (hourly, daily).
- Suitable for: complex aggregations, ML training, historical reports, data warehouse ETL.
- Tradeoffs: latency measured in hours; simpler to develop and debug.

**Lambda architecture**: run both in parallel. Stream layer for low-latency approximate results; batch layer for accurate historical results; serving layer merges both.

**Kappa architecture**: stream only, but support replay from Kafka/S3 for historical recomputation. Simpler operationally.`
        },
        {
          front: "How do you implement exactly-once event processing in a Kafka + Flink pipeline?",
          back: `**Flink's exactly-once via checkpointing + 2PC:**
1. Flink periodically takes **distributed checkpoints** (Chandy-Lamport algorithm) — consistent snapshot of all operator state + Kafka offsets.
2. Flink uses **two-phase commit (2PC)** with sinks that support transactions (Kafka, Postgres).
3. On failure: Flink rolls back to the last successful checkpoint, re-reads Kafka from the checkpointed offsets, reprocesses. Transactional sinks ensure duplicate writes are rolled back.
4. For non-transactional sinks (ClickHouse, S3): use **idempotent writes** — include \`event_id\` as a deduplication key; sink ignores re-inserted events with known IDs.

**Key constraint**: exactly-once requires the source (Kafka) to be replayable and the sink to be either transactional or idempotent.`
        },
        {
          front: "How do you implement windowing for time-series event analytics?",
          back: `**Window types:**
- **Tumbling window**: fixed, non-overlapping. "Count events every 1 minute." Simple, no overlap.
- **Sliding window**: overlapping windows. "Count events in the last 5 minutes, updated every 1 minute." Higher compute — an event belongs to multiple windows.
- **Session window**: groups events with gaps < N seconds. "A user session ends after 30 min of inactivity." Dynamic size.

**Event time vs processing time:**
- **Event time** (timestamp from producer): more accurate, handles out-of-order events.
- **Processing time** (when Kafka receives it): simpler but inaccurate for delayed events.
- Use **event time** with **watermarks**: Flink waits up to W seconds (watermark) for late-arriving events before closing a window. Late events beyond the watermark are either dropped or handled by a side output.`
        },
        {
          front: "How do you handle event replay for backfilling analytics after a bug fix?",
          back: `**Kafka retention** (default 7 days) enables replay by resetting consumer group offsets. For longer replay:

1. **Data lake as source of truth**: all events archived to S3 Parquet via a dedicated Kafka consumer (raw archiver). Iceberg format adds time-travel and schema evolution.
2. **Replay procedure**: spin up a separate Flink job reading from S3 Parquet (not Kafka — faster for large windows). Write results to a separate table/partition with a "backfill" flag.
3. **Merge**: after backfill completes, swap the backfilled data into the production table (atomic rename in Iceberg/Delta Lake).
4. **Idempotency**: ensure processing logic is idempotent so replaying events overwrites, not appends.`
        },
        {
          front: "How do you handle backpressure in a streaming pipeline when consumers are slow?",
          back: `**Backpressure** occurs when a downstream component (Flink, ClickHouse) processes slower than the upstream produces.

**Detection**: monitor Kafka consumer lag (\`kafka_consumer_lag\` metric). Lag increasing → backpressure.

**Flink's built-in backpressure**: Flink operators block when output buffers fill → naturally slows downstream operators → eventually slows Kafka consumption rate. Prevents OOM.

**Mitigation strategies:**
1. **Scale out**: add Flink task managers / parallelism. Add Kafka partitions first (must match Flink parallelism).
2. **Optimize hot operators**: profile Flink job → identify bottleneck operator → optimize (reduce serialization, batch state access, pre-aggregate).
3. **Shed load**: for non-critical events, drop or sample under extreme lag (circuit breaker pattern).
4. **Separate pipelines**: don't let a slow analytics query impact the critical fraud-detection pipeline — use separate consumer groups and Flink jobs.`
        },
        {
          front: "How do you design Kafka partitioning for a 1M events/sec workload?",
          back: `**Partition count calculation:**
- Each partition is consumed by one consumer thread at a time.
- Target throughput per partition: ~10–20 MB/sec (Kafka can do more but this leaves headroom).
- At 1 GB/sec ingest, 50–100 partitions gives headroom.
- Rule of thumb: **number of partitions = max consumers × 2** (allows scaling without repartitioning).

**Partition key selection:**
- **By user_id**: guarantees ordering per user; enables user-level stateful processing. Risk: hot users with very high event rates.
- **By event_type**: groups same events together; good for per-type aggregations. Risk: popular event types become hot partitions.
- **Compound key (user_id + event_type)**: better distribution.
- **Random**: maximum throughput, no ordering guarantees.

**Hot partition mitigation**: add a random suffix to the key (\`user_id#0\` through \`user_id#3\`) and re-join downstream.`
        }
      ],
      quiz: [
        {
          question: "Your Flink job processes clickstream events and maintains a 5-minute sliding window count per user. After a deployment bug, 2 hours of data was processed incorrectly. Describe the full recovery procedure.",
          answer: `**Recovery procedure:**

1. **Stop the current Flink job** (take a savepoint first for state reference, but we won't use it — state is corrupted).

2. **Identify the affected window**: determine exact start time when incorrect processing began (check deployment timestamp, logs, alerting anomalies).

3. **Rollback source data**: the raw events were correctly stored in S3 Parquet / Kafka (these are not affected by the Flink bug — they're append-only). Confirm Kafka offsets for the 2-hour window; confirm Parquet files in S3 for the same period.

4. **Undo incorrect output**:
   - If output was to ClickHouse: delete rows where \`processed_by_version = <buggy_version>\` and \`timestamp BETWEEN <start> AND <end>\`.
   - If output was to Kafka: publish compensating events; or if downstream is idempotent, simply rewrite with correct values.

5. **Deploy fixed Flink job**: deploy the corrected version.

6. **Run backfill job**: start a separate Flink job (or Spark for speed) reading from S3 Parquet for the affected 2-hour window. Write to the same output tables with idempotency (event_id-based dedup or partition overwrite).

7. **Verify**: compare output row counts and spot-check aggregates against a reference source. Run data quality checks (expected ranges, null rates).

8. **Resume real-time job**: once backfill catches up to current time, disable the backfill job. The real-time job (restarted from scratch or from a pre-bug savepoint) handles ongoing data.

9. **Post-mortem**: add a data quality check (anomaly detection on output metrics) that would have caught this bug faster.`
        },
        {
          question: "Compare Lambda architecture and Kappa architecture. When would you choose each?",
          answer: `**Lambda architecture:**
- Maintains TWO processing paths:
  - **Batch layer**: reprocesses all historical data periodically (Spark). Produces accurate, complete results. Latency: hours.
  - **Speed layer**: processes recent events in real time (Flink). Produces approximate/incomplete results. Latency: seconds.
  - **Serving layer**: merges batch results (for old data) with speed layer results (for recent data).
- **Pro**: batch results are always perfectly accurate; speed layer handles freshness.
- **Con**: two codebases to maintain, keep in sync, and test. Logic duplication leads to inconsistencies.

**Kappa architecture:**
- Only ONE processing path: streaming (Flink).
- For historical reprocessing: replay from the immutable log (Kafka retention or S3 data lake) through the same streaming job.
- **Pro**: one codebase; simpler mental model; no serving layer merge complexity.
- **Con**: streaming reprocessing of years of data is slow (must consume sequentially per partition). Requires infrastructure to run a second instance of the job in parallel during replay.

**When to choose Lambda:**
- Historical data volume is so large that streaming replay is impractical.
- Batch queries require complex joins or ML feature generation that streaming cannot do efficiently.
- Organization has separate data engineering and real-time engineering teams with different toolchains.

**When to choose Kappa:**
- Your streaming system can handle replay throughput (S3 → Flink scales horizontally).
- You want operational simplicity.
- Flink's stateful processing can express all required transformations.
- **Most new systems** should start with Kappa — simpler and sufficient until proven otherwise.`
        }
      ]
    }
  ]
}
