export default {
  id: "networking",
  title: "Networking",
  subchapters: [
    {
      id: "tcp-vs-udp",
      title: "TCP vs UDP",
      body: `TCP (Transmission Control Protocol) and UDP (User Datagram Protocol) are the two dominant transport-layer protocols. TCP provides reliable, ordered, and error-checked delivery through a connection-oriented handshake, while UDP is connectionless and trades reliability for speed. Choosing between them depends on whether your application needs guarantees or can tolerate occasional packet loss.`,
      flashcards: [
        {
          front: "What are the key differences between TCP and UDP?",
          back: `TCP is connection-oriented, reliable, ordered, and has flow/congestion control. UDP is connectionless, unreliable (no retransmits), unordered, and has minimal overhead. TCP suits data integrity needs; UDP suits latency-sensitive or broadcast use cases.`
        },
        {
          front: "How does the TCP three-way handshake work?",
          back: `1. Client sends SYN (synchronize) to server.\n2. Server responds with SYN-ACK.\n3. Client replies with ACK.\nAfter this, the connection is established and data transfer can begin. This adds at least one round-trip before any data flows.`
        },
        {
          front: "What is head-of-line (HOL) blocking in TCP?",
          back: `HOL blocking occurs when a lost packet stalls delivery of all subsequent packets in the stream. Because TCP guarantees ordered delivery, the receiver must wait for the retransmitted packet before passing any data to the application, even if later packets have already arrived.`
        },
        {
          front: "When should you choose UDP over TCP?",
          back: `Choose UDP when low latency matters more than reliability: real-time gaming, live video/audio streaming, VoIP, DNS lookups, and IoT telemetry. Applications often implement their own lightweight reliability on top (e.g., QUIC, WebRTC's SRTP).`
        },
        {
          front: "Does UDP guarantee message ordering?",
          back: `No. UDP packets (datagrams) can arrive out of order, be duplicated, or be dropped entirely. If ordering matters, the application must sequence packets itself.`
        },
        {
          front: "What is TCP flow control?",
          back: `Flow control prevents a fast sender from overwhelming a slow receiver. The receiver advertises a receive window size in each ACK; the sender must not have more unacknowledged bytes in flight than this window allows.`
        },
        {
          front: "What is TCP congestion control?",
          back: `Congestion control limits the sender's rate to avoid overwhelming the network (not just the receiver). Algorithms like Cubic and BBR use signals such as packet loss or RTT changes to adjust a congestion window (cwnd), starting with slow-start and backing off on loss.`
        }
      ],
      quiz: [
        {
          question: "Which statement about UDP is correct?",
          options: [
            "UDP guarantees in-order packet delivery",
            "UDP requires a three-way handshake before data transfer",
            "UDP has lower per-packet overhead than TCP",
            "UDP retransmits lost packets automatically"
          ],
          answer: 2,
          explanation: `UDP omits the handshake, sequence numbers, acknowledgements, and retransmission logic, giving it significantly lower overhead per datagram compared to TCP.`
        },
        {
          question: "Why does TCP head-of-line blocking occur, and how does it affect multiplexed HTTP/2 streams?",
          answer: `TCP delivers bytes in order. If one segment is lost, the kernel's receive buffer holds all later segments until the missing one is retransmitted and received. In HTTP/2 — which multiplexes many logical streams over a single TCP connection — a single lost packet can stall ALL streams simultaneously, negating much of the multiplexing benefit. This is one of the core motivations for HTTP/3's switch to QUIC over UDP.`
        },
        {
          question: "A developer is building a live sports score app that pushes updates every second. Should they use TCP or UDP, and why?",
          options: [
            "TCP, because reliable delivery ensures no score is ever missed",
            "UDP, because a stale retransmitted score is useless and low latency matters more",
            "TCP, because it has lower overhead than UDP",
            "UDP, because UDP supports encryption natively"
          ],
          answer: 1,
          explanation: `For live score updates, a packet that arrives late (after retransmission) is already outdated. UDP lets the client always display the freshest data that arrived in time, accepting that some intermediate updates may be skipped.`
        }
      ]
    },
    {
      id: "http2",
      title: "HTTP/2",
      body: `HTTP/2, standardized in RFC 7540 (2015), is a major revision of the HTTP protocol designed to improve web performance. Its headline features are binary framing, full request/response multiplexing over a single TCP connection, header compression via HPACK, and optional server push. It remains widely deployed and is supported by every modern browser and server.`,
      flashcards: [
        {
          front: "How does HTTP/2 multiplexing differ from HTTP/1.1 pipelining?",
          back: `HTTP/1.1 pipelining sends requests sequentially; responses must come back in the same order (still causing HOL blocking). HTTP/2 multiplexing assigns each request a stream ID and interleaves frames from many streams simultaneously over one TCP connection — responses can arrive in any order.`
        },
        {
          front: "What is HPACK header compression?",
          back: `HPACK is HTTP/2's header compression scheme. It uses a static table of 61 common header name/value pairs, a dynamic table of recently seen headers, and Huffman coding. This eliminates the repetition of large cookie and user-agent headers on every request, sometimes reducing header size by 80-90%.`
        },
        {
          front: "What is HTTP/2 server push and when is it useful?",
          back: `Server push lets the server speculatively send resources (e.g., CSS, JS) before the browser requests them, piggybacking on the initial HTML request. It can reduce page load time but is tricky to use correctly — pushing already-cached assets wastes bandwidth. Many deployments replaced it with \`Link: rel=preload\` hints or \`103 Early Hints\`.`
        },
        {
          front: "Does HTTP/2 solve TCP head-of-line blocking?",
          back: `No. HTTP/2 eliminates application-layer HOL blocking (multiple requests no longer wait on each other at the HTTP level), but TCP-layer HOL blocking remains. A single lost TCP segment stalls all HTTP/2 streams until retransmission succeeds. HTTP/3 over QUIC solves this at the transport layer.`
        },
        {
          front: "What is stream prioritization in HTTP/2?",
          back: `Each HTTP/2 stream can have a weight (1-256) and can declare a dependency on another stream, forming a priority tree. This lets clients hint to servers that, for example, render-blocking CSS should be sent before images. In practice, many servers implement prioritization inconsistently.`
        },
        {
          front: "Why does HTTP/2 use binary framing instead of HTTP/1.1's text format?",
          back: `Binary framing is more efficient to parse (no ambiguous newline handling, no chunked-encoding quirks) and enables the framing layer that makes multiplexing possible. Each frame has a fixed 9-byte header with type, flags, stream ID, and length.`
        }
      ],
      quiz: [
        {
          question: "Which HTTP/2 feature directly reduces latency caused by repeated large headers?",
          options: [
            "Binary framing",
            "Server push",
            "HPACK header compression",
            "Stream multiplexing"
          ],
          answer: 2,
          explanation: `HPACK compresses headers using static and dynamic tables plus Huffman coding, so repeated headers like cookies and user-agent strings are sent as small index references instead of full strings on every request.`
        },
        {
          question: "Explain why multiplexing many HTTP/2 streams over a single TCP connection can sometimes perform worse than HTTP/1.1 with multiple parallel connections on lossy networks.",
          answer: `HTTP/2's multiplexing collapses all streams into one TCP connection. On a lossy network, a single dropped TCP segment triggers HOL blocking that freezes every stream simultaneously. With HTTP/1.1's multiple parallel connections, only one connection stalls per dropped segment while the others continue delivering data, so packet loss is less catastrophic to overall throughput.`
        },
        {
          question: "HTTP/2 server push was deprecated in Chrome in 2022. Which alternative mechanism achieves a similar early-delivery benefit?",
          options: [
            "HTTP/1.1 chunked transfer encoding",
            "103 Early Hints with Link: rel=preload",
            "TCP fast open",
            "HPACK dynamic table pre-seeding"
          ],
          answer: 1,
          explanation: `\`103 Early Hints\` is an informational status code the server sends before the final response, containing \`Link: rel=preload\` headers that instruct the browser to start fetching subresources. It avoids the cache-invalidation complexity of server push.`
        }
      ]
    },
    {
      id: "http3",
      title: "HTTP/3",
      body: `HTTP/3 (RFC 9114, 2022) runs over QUIC instead of TCP, fundamentally changing the transport layer. QUIC is a UDP-based protocol that bakes in TLS 1.3, independent stream multiplexing, and connection migration. The primary motivation was to eliminate TCP head-of-line blocking and reduce connection setup latency through 0-RTT resumption.`,
      flashcards: [
        {
          front: "Why was QUIC built on UDP instead of improving TCP?",
          back: `TCP is implemented in OS kernels, and changing it requires OS upgrades that take years to propagate. Middleboxes (firewalls, NATs) also ossify TCP behavior. Building QUIC as a userspace UDP application lets it be updated rapidly via software releases. UDP itself is untouched; QUIC implements reliability and ordering on top.`
        },
        {
          front: "How does QUIC solve TCP head-of-line blocking?",
          back: `QUIC gives each stream independent flow control. A lost UDP packet only blocks the specific QUIC stream whose data it carried; other streams continue unaffected. This is fundamentally different from TCP, where all data on the connection is blocked by a single missing segment.`
        },
        {
          front: "What is 0-RTT connection resumption in QUIC?",
          back: `When a client has previously connected to a server, QUIC can send application data on the very first packet using a cached session ticket (like TLS session resumption). This eliminates the 1-RTT handshake cost for returning visitors. 0-RTT data is subject to replay attacks, so non-idempotent requests (POST) should not be sent 0-RTT.`
        },
        {
          front: "What is QUIC connection migration?",
          back: `QUIC identifies connections with a 64-bit Connection ID rather than the 4-tuple (src IP, src port, dst IP, dst port). When a mobile client switches from Wi-Fi to LTE, the IP/port changes but the Connection ID stays the same — the connection survives the network transition without re-handshaking.`
        },
        {
          front: "How does TLS relate to QUIC?",
          back: `TLS 1.3 is baked into QUIC — you cannot run QUIC without encryption. This means the transport and security handshakes happen together in 1 RTT (or 0 RTT on resumption), whereas TCP + TLS 1.3 requires at least 1 RTT for TCP then 1 RTT for TLS (2 RTTs total for a new connection).`
        },
        {
          front: "What is the QUIC handshake latency compared to TCP + TLS 1.3?",
          back: `QUIC new connection: 1 RTT (crypto and transport combined).\nQUIC resumed connection: 0 RTT.\nTCP + TLS 1.3 new: 2 RTTs (1 TCP + 1 TLS).\nTCP + TLS 1.3 resumed: 1.5 RTTs (1 TCP + 0.5 TLS 1.3 session resumption).`
        },
        {
          front: "What are the main challenges with deploying HTTP/3?",
          back: `1. UDP is rate-limited or blocked by some corporate firewalls and middleboxes.\n2. QUIC encryption prevents deep packet inspection, which some networks rely on.\n3. Higher CPU usage due to userspace UDP handling vs. kernel TCP offloading.\n4. Debugging tools (Wireshark, tcpdump) need QUIC-aware decryption keys to inspect traffic.`
        }
      ],
      quiz: [
        {
          question: "Which feature of QUIC allows a mobile device to switch from Wi-Fi to LTE without dropping the connection?",
          options: [
            "0-RTT resumption",
            "Connection migration via Connection IDs",
            "Independent stream multiplexing",
            "Integrated TLS 1.3"
          ],
          answer: 1,
          explanation: `QUIC connection migration uses a Connection ID to identify a connection independent of the IP/port 4-tuple. When the network interface changes, the Connection ID stays the same so the session persists without a new handshake.`
        },
        {
          question: "Why is 0-RTT data in QUIC considered unsafe for POST requests?",
          answer: `0-RTT data is sent before the server confirms it is a fresh, replay-protected session. An attacker who captures the 0-RTT flight can replay it to the server, causing a POST (e.g., a payment or form submission) to be processed multiple times. Safe 0-RTT use is limited to idempotent requests (GET, HEAD) where replaying has no side effects.`
        },
        {
          question: "HTTP/3 runs over UDP. Does this mean HTTP/3 has no reliability guarantees?",
          options: [
            "Correct — HTTP/3 trades reliability for speed just like UDP",
            "No — QUIC implements its own reliable, ordered delivery per stream on top of UDP",
            "No — HTTP/3 falls back to TCP whenever packet loss is detected",
            "Correct — applications must implement their own retransmission logic"
          ],
          answer: 1,
          explanation: `QUIC implements acknowledgements, retransmission, and per-stream ordered delivery in the QUIC layer. Each stream is reliable and ordered independently; only the IP/UDP layer is unreliable. HTTP/3 on top of QUIC has the same reliability guarantees as HTTP/2 on TCP.`
        }
      ]
    },
    {
      id: "tls",
      title: "TLS",
      body: `Transport Layer Security (TLS) is the cryptographic protocol that secures most internet traffic, providing confidentiality, integrity, and authentication. It operates between the transport and application layers, so HTTP over TLS becomes HTTPS. TLS 1.3 (RFC 8446, 2018) simplified and accelerated the handshake while eliminating legacy weak algorithms.`,
      flashcards: [
        {
          front: "What is the TLS 1.3 handshake sequence?",
          back: `1. Client sends ClientHello with supported cipher suites and a key share (Diffie-Hellman public value).\n2. Server replies with ServerHello, its own key share, certificate, and CertificateVerify — all in one round trip.\n3. Both sides derive the session key from the DH exchange.\n4. Client sends Finished.\nTotal: 1 RTT for a new connection; 0-RTT for resumption.`
        },
        {
          front: "What is the difference between symmetric and asymmetric cryptography in TLS?",
          back: `Asymmetric (public-key) crypto (RSA, ECDH) is used during the handshake to authenticate the server and establish a shared secret. It is computationally expensive. Symmetric crypto (AES-GCM, ChaCha20-Poly1305) is used for the actual data transfer using the shared secret established in the handshake. It is orders of magnitude faster.`
        },
        {
          front: "What is a TLS certificate and what does it prove?",
          back: `A TLS certificate is an X.509 document containing a public key, domain name(s), validity period, and a digital signature from a Certificate Authority (CA). It proves that a trusted CA verified the certificate holder controls the domain. The client checks the CA signature against its trusted root store to authenticate the server.`
        },
        {
          front: "What is the PKI (Public Key Infrastructure) chain of trust?",
          back: `The browser/OS ships with a list of trusted root CAs. Root CAs issue certificates to intermediate CAs (offline for security). Intermediate CAs sign end-entity (leaf) certificates for websites. During TLS, the server sends the full chain; the client validates each signature up to a trusted root.`
        },
        {
          front: "What key improvements did TLS 1.3 introduce over TLS 1.2?",
          back: `1. Handshake reduced from 2 RTTs to 1 RTT (0-RTT resumption optional).\n2. Removed weak algorithms: RSA key exchange, RC4, MD5, SHA-1, DES, 3DES.\n3. Forward secrecy is mandatory (only (EC)DHE key exchange allowed).\n4. Encrypted more of the handshake earlier (certificate hidden from passive observers).\n5. Simplified cipher suite list to 5 options.`
        },
        {
          front: "What is mutual TLS (mTLS) and when is it used?",
          back: `Standard TLS only authenticates the server. mTLS requires both parties to present certificates, so the server also verifies the client's identity. It is used in zero-trust networks, service mesh (Istio, Linkerd), API gateways, and anywhere machine-to-machine authentication is required without passwords.`
        },
        {
          front: "What is forward secrecy and why does it matter?",
          back: `Forward secrecy (FS) means that compromise of the server's long-term private key cannot decrypt past recorded sessions. TLS 1.3 achieves FS by using ephemeral Diffie-Hellman keys for every session — the session key is never stored on disk. TLS 1.2 with RSA key exchange lacked FS; capturing traffic and later obtaining the private key could decrypt it.`
        }
      ],
      quiz: [
        {
          question: "Which of the following was removed in TLS 1.3 compared to TLS 1.2?",
          options: [
            "AES-GCM cipher support",
            "RSA key exchange",
            "Certificate-based server authentication",
            "Diffie-Hellman key agreement"
          ],
          answer: 1,
          explanation: `TLS 1.3 removed RSA static key exchange because it does not provide forward secrecy. Only (EC)DHE-based key exchange is allowed, ensuring every session uses a fresh ephemeral key pair.`
        },
        {
          question: "What is the difference between mTLS and standard TLS, and name a common use case for mTLS?",
          answer: `Standard TLS authenticates only the server via its certificate; the client is anonymous from the TLS layer's perspective. mTLS requires the client to also present a valid certificate, which the server verifies against a trusted CA. This provides strong mutual machine identity. A common use case is service-to-service communication in a microservices mesh (e.g., Istio), where each service must prove its identity to every other service it calls.`
        },
        {
          question: "How many round trips does a TLS 1.3 handshake require for a brand-new connection?",
          options: [
            "0 RTT",
            "1 RTT",
            "2 RTTs",
            "3 RTTs"
          ],
          answer: 1,
          explanation: `TLS 1.3 combines the key exchange into a single round trip: the client sends its key share in ClientHello, the server replies with its key share plus the certificate in one flight, and both sides can derive the session key immediately. 0-RTT is available only for session resumption.`
        }
      ]
    },
    {
      id: "dns",
      title: "DNS",
      body: `The Domain Name System (DNS) is the internet's distributed phonebook, translating human-readable hostnames (e.g., www.example.com) into IP addresses. DNS resolution involves a hierarchy of servers — resolvers, root servers, TLD servers, and authoritative servers. Caching at multiple layers makes DNS fast in steady state, with TTL controlling cache freshness.`,
      flashcards: [
        {
          front: "What are the steps in a full DNS resolution for a new hostname?",
          back: `1. Browser checks its own cache; if miss, asks the OS resolver.\n2. OS resolver checks its cache and /etc/hosts; if miss, queries the recursive resolver (usually ISP or 8.8.8.8).\n3. Recursive resolver queries a root nameserver → gets TLD nameserver address.\n4. Queries TLD nameserver (.com) → gets authoritative nameserver address.\n5. Queries authoritative nameserver → gets the final A/AAAA record.\n6. Result is cached at each layer according to TTL and returned to the browser.`
        },
        {
          front: "What is the difference between a recursive resolver and an authoritative nameserver?",
          back: `A recursive resolver (e.g., 8.8.8.8, 1.1.1.1) does the legwork of querying multiple servers on behalf of the client and caches results. An authoritative nameserver holds the actual DNS records for a domain and returns definitive answers without forwarding.`
        },
        {
          front: "What are the most common DNS record types?",
          back: `- **A**: maps hostname → IPv4 address.\n- **AAAA**: maps hostname → IPv6 address.\n- **CNAME**: canonical name alias; maps one hostname to another.\n- **MX**: mail exchange; specifies mail server(s) for a domain with priority.\n- **TXT**: arbitrary text; used for SPF, DKIM, domain verification.\n- **NS**: identifies the authoritative nameservers for a domain.\n- **PTR**: reverse DNS; maps IP address → hostname.`
        },
        {
          front: "What is DNS TTL and why does it matter?",
          back: `TTL (Time To Live) is a value in seconds attached to each DNS record. Resolvers and clients cache the record for TTL seconds before re-querying. A low TTL (e.g., 60s) enables rapid failover but increases query volume; a high TTL (e.g., 86400s) reduces load but slows propagation of changes.`
        },
        {
          front: "What is a CNAME record and what are its limitations?",
          back: `A CNAME points one hostname to another (e.g., www.example.com → example.com). Limitations: (1) A CNAME cannot coexist with other records at the same name — so you cannot CNAME the zone apex (example.com) in standard DNS (use ALIAS/ANAME records or flattening at providers like Route 53). (2) Each CNAME adds an extra DNS lookup.`
        },
        {
          front: "What is DNS negative caching?",
          back: `When a queried name does not exist (NXDOMAIN response), resolvers cache that negative result for the SOA record's minimum TTL. This prevents hammering authoritative servers with repeated queries for non-existent names.`
        },
        {
          front: "What is DNSSEC and what problem does it solve?",
          back: `DNSSEC (DNS Security Extensions) adds cryptographic signatures to DNS records, allowing resolvers to verify that responses are authentic and unmodified. It protects against DNS cache poisoning (Kaminsky attack), where an attacker injects forged records into a resolver's cache.`
        }
      ],
      quiz: [
        {
          question: "Which DNS record type would you use to configure email delivery for a domain?",
          options: [
            "A record",
            "CNAME record",
            "MX record",
            "TXT record"
          ],
          answer: 2,
          explanation: `MX (Mail Exchange) records specify the mail servers responsible for accepting email for a domain, along with a priority value. Lower priority numbers are tried first.`
        },
        {
          question: "Why can't a CNAME record be placed at the zone apex (e.g., example.com rather than www.example.com)?",
          answer: `The DNS specification (RFC 1034) requires that a CNAME record cannot share a name with any other record type. The zone apex must have NS and SOA records, so placing a CNAME there would conflict. Many DNS providers offer a workaround called ALIAS or ANAME records, which resolve like a CNAME internally but return A/AAAA records at query time, allowing use at the apex.`
        },
        {
          question: "A DNS record has TTL=300. A client queries it successfully. 200 seconds later, the server IP changes. How long before the client uses the new IP?",
          options: [
            "Immediately after the server IP changes",
            "After 100 more seconds (when the cached TTL expires)",
            "After 300 more seconds from the IP change",
            "After 500 seconds from the original query"
          ],
          answer: 1,
          explanation: `The client cached the record 200 seconds ago with a 300-second TTL. The cache expires 100 seconds later (300 - 200 = 100). Only after that expiry will the client re-query DNS and get the new IP. The server IP change has no effect on the client until the cached TTL runs out.`
        }
      ]
    },
    {
      id: "connection-lifecycle",
      title: "Connection Lifecycle",
      body: `A TCP connection goes through a well-defined lifecycle: establishment via the three-way handshake, bidirectional data transfer, and teardown via a four-way close sequence. Understanding the states (SYN_SENT, ESTABLISHED, FIN_WAIT, TIME_WAIT, CLOSE_WAIT, etc.) is critical for diagnosing connection exhaustion, port reuse, and lingering sockets.`,
      flashcards: [
        {
          front: "Describe the TCP three-way handshake step by step.",
          back: `1. **SYN**: Client picks an initial sequence number (ISN), sends SYN segment. Client enters SYN_SENT.\n2. **SYN-ACK**: Server picks its own ISN, acknowledges client's ISN+1, sends SYN-ACK. Server enters SYN_RCVD.\n3. **ACK**: Client acknowledges server's ISN+1. Both sides enter ESTABLISHED.\nTotal cost: 1 RTT before data can flow.`
        },
        {
          front: "Describe the TCP four-way connection close.",
          back: `1. Active closer sends FIN → enters FIN_WAIT_1.\n2. Passive closer sends ACK → active enters FIN_WAIT_2; passive enters CLOSE_WAIT.\n3. Passive closer sends its own FIN → enters LAST_ACK.\n4. Active closer sends final ACK → enters TIME_WAIT; passive enters CLOSED.\nAfter TIME_WAIT (2 × MSL), the active closer enters CLOSED.`
        },
        {
          front: "What is TIME_WAIT and why does it exist?",
          back: `TIME_WAIT is a state the active closer holds for 2 × MSL (Maximum Segment Lifetime, typically 60s, so 120s total) after sending the final ACK. It exists to: (1) ensure the final ACK reaches the passive closer (in case it was lost and a FIN retransmit comes); (2) prevent old duplicate segments from the closed connection from being mistaken for data on a new connection with the same 4-tuple.`
        },
        {
          front: "What problems can a large number of TIME_WAIT sockets cause?",
          back: `TIME_WAIT sockets consume memory and occupy the 4-tuple (src IP, src port, dst IP, dst port). On a high-throughput server that opens many short-lived outbound connections, the ephemeral port range (typically 28K-60K ports) can be exhausted, causing \`connect()\` failures. Mitigations: increase port range, use \`SO_REUSEADDR\`, use connection pooling, or enable \`net.ipv4.tcp_tw_reuse\`.`
        },
        {
          front: "What is the difference between CLOSE_WAIT and FIN_WAIT_2?",
          back: `CLOSE_WAIT is on the passive closer's side after receiving the remote FIN and sending an ACK — it still needs to send its own FIN (the application must close the socket). If the application never closes the socket, the connection stays in CLOSE_WAIT indefinitely, causing a socket leak. FIN_WAIT_2 is on the active closer's side after its FIN is acknowledged but before the remote FIN arrives.`
        },
        {
          front: "What is TCP simultaneous open?",
          back: `If both sides send SYN at the same time (before either receives the other's SYN), both enter SYN_SENT then SYN_RCVD simultaneously and the connection is established without a traditional three-way handshake. This is rare in practice but valid per the spec.`
        }
      ],
      quiz: [
        {
          question: "A server has thousands of sockets stuck in CLOSE_WAIT. What is the most likely cause?",
          options: [
            "The remote clients are not sending their final ACK",
            "The server application is not calling close() on sockets after the remote side closes",
            "The server is running out of TIME_WAIT resources",
            "The TCP keep-alive timer is set too low"
          ],
          answer: 1,
          explanation: `CLOSE_WAIT means the server received a FIN from the remote side and sent an ACK, but has not yet sent its own FIN. This happens when the application code never calls \`close()\` or \`shutdown()\` on the socket — a classic socket leak bug.`
        },
        {
          question: "Why does TCP use a three-way handshake rather than a two-way handshake?",
          answer: `A two-way handshake would only confirm that the client's SYN reached the server, but not that the server's SYN-ACK reached the client. TCP needs both sides to agree on each other's initial sequence numbers. The client's final ACK confirms to the server that the server's chosen ISN was received and the full-duplex channel is ready. Without the third step, the server cannot know its ISN was acknowledged, risking desynchronized sequence numbers.`
        },
        {
          question: "How long does a TCP connection remain in TIME_WAIT, and what constant determines this?",
          options: [
            "30 seconds, determined by the RTT",
            "60 seconds, determined by the congestion window",
            "2 × MSL (Maximum Segment Lifetime), typically 60-120 seconds",
            "5 minutes, determined by the SO_LINGER socket option"
          ],
          answer: 2,
          explanation: `TIME_WAIT lasts 2 × MSL to ensure any delayed or duplicated segments from the old connection expire before the 4-tuple can be reused. MSL is typically defined as 30 or 60 seconds (RFC 793 specifies 2 minutes), so TIME_WAIT is 60-120 seconds in practice.`
        }
      ]
    },
    {
      id: "keep-alive",
      title: "Keep-Alive",
      body: `"Keep-alive" refers to two distinct but related concepts: HTTP persistent connections (reusing a TCP connection for multiple requests) and TCP keepalive (detecting dead connections at the transport layer). Both reduce overhead, but they operate at different layers and serve different purposes. Connection pooling extends these ideas to manage a pool of reusable connections.`,
      flashcards: [
        {
          front: "What is HTTP keep-alive (persistent connections)?",
          back: `HTTP keep-alive (default since HTTP/1.1) allows multiple HTTP request/response pairs to be sent over a single TCP connection without tearing it down between requests. This eliminates the TCP handshake and TLS handshake overhead for subsequent requests. Controlled by the \`Connection: keep-alive\` header and a server-side timeout.`
        },
        {
          front: "What is TCP keepalive?",
          back: `TCP keepalive is a transport-layer mechanism where the kernel periodically sends empty ACK probes on an idle connection to check if the remote end is still alive. If no response is received after a configurable number of probes, the connection is declared dead and the socket is closed. Configured via \`SO_KEEPALIVE\` socket option and \`tcp_keepalive_time/intvl/probes\` kernel parameters.`
        },
        {
          front: "How does HTTP/1.1 keep-alive differ from HTTP/2 multiplexing in terms of request handling?",
          back: `HTTP/1.1 keep-alive reuses the TCP connection but still processes one request at a time per connection (requests are serialized; pipelining is poorly supported). Browsers open 6 parallel connections per origin to compensate. HTTP/2 multiplexes many concurrent streams over a single connection, eliminating the need for multiple parallel connections.`
        },
        {
          front: "What is connection pooling?",
          back: `A connection pool maintains a set of pre-established (and keep-alive) connections to a server or database, ready to be borrowed by application threads. When a request completes, the connection is returned to the pool instead of closed. This amortizes handshake cost, limits total connections to the upstream, and provides backpressure.`
        },
        {
          front: "What are the tradeoffs of long HTTP keep-alive timeouts?",
          back: `Long timeouts keep connections open longer, saving handshake cost for bursty traffic. The downside: idle connections consume file descriptors and memory on both client and server. Load balancers may also have their own timeout that silently closes the connection, causing the client to get a TCP RST mid-request. Best practice: set the server keep-alive timeout slightly lower than the load balancer's idle timeout.`
        },
        {
          front: "Why should the server's keep-alive timeout be set lower than the load balancer's?",
          back: `If the load balancer closes an idle connection before the server does, a client that reuses a connection from its pool may send a request on a connection the load balancer has already torn down. The server sees a valid connection and waits; the client gets a RST or timeout. By having the server close first, the client's pool detects the closure and opens a fresh connection before the load balancer's silent drop.`
        }
      ],
      quiz: [
        {
          question: "Which layer does TCP keepalive operate at?",
          options: [
            "Application layer (HTTP)",
            "Session layer",
            "Transport layer (TCP)",
            "Network layer (IP)"
          ],
          answer: 2,
          explanation: `TCP keepalive is implemented by the OS kernel's TCP stack. It sends empty ACK segments to probe idle connections, entirely independent of the application protocol. It is distinct from HTTP keep-alive, which is an application-layer header.`
        },
        {
          question: "A client connection pool has max 10 connections to a database. 15 concurrent requests arrive simultaneously. What happens to the extra 5 requests?",
          answer: `The first 10 requests each acquire one of the available connections from the pool. The remaining 5 requests are queued and wait until one of the in-use connections is returned to the pool. The pool provides backpressure — it serializes excess demand rather than opening unbounded connections to the database, which protects the database from connection exhaustion.`
        },
        {
          question: "In HTTP/1.1, why do browsers open up to 6 parallel TCP connections per origin instead of reusing one?",
          options: [
            "Because HTTP/1.1 does not support persistent connections",
            "To work around HTTP/1.1's per-connection request serialization and improve page load times",
            "Because TLS does not allow connection reuse",
            "To comply with RFC 2616 which mandates 6 connections minimum"
          ],
          answer: 1,
          explanation: `HTTP/1.1 persistent connections allow reuse, but only one request can be in flight per connection (pipelining is unreliable). To fetch many resources in parallel (JS, CSS, images), browsers open multiple connections. HTTP/2 eliminates this need with true multiplexing.`
        }
      ]
    },
    {
      id: "load-balancing",
      title: "Load Balancing",
      body: `Load balancers distribute incoming traffic across multiple backend servers to improve availability, scalability, and fault tolerance. They operate at different OSI layers (L4 transport vs. L7 application), use various scheduling algorithms to assign requests, monitor backend health, and optionally provide session affinity (sticky sessions) for stateful applications.`,
      flashcards: [
        {
          front: "What is the difference between L4 and L7 load balancing?",
          back: `**L4 (transport-layer)**: Makes routing decisions based on IP address and TCP/UDP port only, without inspecting application data. Fast, low overhead, works with any protocol. Examples: AWS NLB, HAProxy in TCP mode.\n\n**L7 (application-layer)**: Reads and parses the application protocol (HTTP, gRPC) to make smarter decisions based on URL path, headers, cookies, or request body. Can do content-based routing, SSL termination, and request rewriting. Examples: AWS ALB, Nginx, Envoy.`
        },
        {
          front: "What are the main load balancing algorithms?",
          back: `- **Round-robin**: Requests go to each server in turn. Simple; ignores server load.\n- **Weighted round-robin**: Same but servers get requests proportional to their weight.\n- **Least connections**: New request goes to the server with fewest active connections. Better for variable-duration requests.\n- **IP hash / consistent hashing**: Client IP (or request key) is hashed to deterministically pick a server. Provides stickiness without cookies.\n- **Random with two choices (power of two)**: Pick two servers randomly, send to the one with fewer connections. Near-optimal with low overhead.`
        },
        {
          front: "What are health checks in a load balancer?",
          back: `Health checks are periodic probes the load balancer sends to each backend to verify it is alive and ready. Types: TCP check (can connect?), HTTP check (returns 200?), custom script. A backend that fails a configurable number of consecutive checks is marked unhealthy and removed from rotation until it recovers.`
        },
        {
          front: "What are sticky sessions (session affinity) and when are they needed?",
          back: `Sticky sessions ensure a client is always routed to the same backend for the duration of a session, typically implemented with a session cookie or IP hash. Needed when application state is stored locally on the server (e.g., in-memory session store). Downsides: uneven load distribution, poor failover (if the pinned backend dies, the session is lost). Better solution: externalize session state to Redis/Memcached so any backend can serve any client.`
        },
        {
          front: "What is the difference between active and passive health checks?",
          back: `**Active**: Load balancer proactively sends synthetic requests (TCP connect, HTTP GET /health) on a schedule to check backend availability. Catches failures before real traffic hits a bad backend.\n\n**Passive (circuit breaker)**: Load balancer monitors real traffic responses. If a backend returns too many errors or times out, it is temporarily removed from rotation. No extra traffic generated, but real requests absorb the initial failures.`
        },
        {
          front: "What is consistent hashing and why is it useful for load balancing?",
          back: `Consistent hashing maps both servers and request keys onto a ring. Each request goes to the first server clockwise from the key's position. When a server is added or removed, only ~1/N of keys are remapped (vs. all keys remapping with modulo hashing). This is critical for caching layers (CDN, distributed cache) where remapping a key means a cache miss.`
        },
        {
          front: "How does a load balancer handle SSL/TLS termination?",
          back: `In SSL termination mode, the load balancer decrypts TLS at the edge, then forwards plain HTTP to backends over a trusted internal network. Benefits: backends are simpler, L7 inspection is possible (headers, cookies, URLs), and cert management is centralized. For end-to-end encryption (compliance), use SSL passthrough (L4) or re-encrypt with a new TLS session to backends (SSL bridging).`
        }
      ],
      quiz: [
        {
          question: "Which load balancing algorithm best handles a mix of short and long-running requests?",
          options: [
            "Round-robin",
            "Least connections",
            "IP hash",
            "Random"
          ],
          answer: 1,
          explanation: `Least connections dynamically routes new requests to the server with the fewest active connections. This naturally compensates for long-running requests that occupy a server, preventing it from receiving more load than it can handle — something round-robin cannot do since it ignores current server load.`
        },
        {
          question: "A web application stores user session data in server memory. What problems arise when running behind a load balancer, and what is the recommended solution?",
          answer: `Without sticky sessions, a user's requests may be routed to different backends on each request. Each backend has only its own in-memory session data, so the user appears unauthenticated or loses state on backends they haven't visited. Sticky sessions fix this but cause uneven load and mean session loss if the pinned backend crashes. The recommended solution is to externalize session storage to a shared, fast key-value store (e.g., Redis or Memcached). Every backend can then read and write any user's session, making the application stateless with respect to the load balancer and enabling full horizontal scaling and transparent failover.`
        },
        {
          question: "What is the advantage of L7 load balancing over L4 load balancing?",
          options: [
            "L7 is faster because it processes fewer bytes per request",
            "L7 can route based on HTTP content like URL paths, headers, and cookies",
            "L7 works with any TCP-based protocol without configuration",
            "L7 eliminates the need for health checks"
          ],
          answer: 1,
          explanation: `L7 load balancers inspect the full HTTP request, enabling content-based routing: /api requests to API servers, /static to CDN origins, blue/green deployments by header, or canary by cookie. L4 only sees IP and port and must treat all traffic to a port identically.`
        }
      ]
    }
  ]
}
