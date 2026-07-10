export default {
  id: "low-level",
  title: "Low-Level & Systems at Scale",
  subchapters: [
    {
      id: "gpus",
      title: "GPUs",
      body: `## What Is a GPU?

A Graphics Processing Unit (GPU) is a massively parallel processor originally designed for rendering pixels. Modern GPUs — especially NVIDIA's data-center line (A100, H100, H200) — are the workhorses of AI and scientific computing.

## SIMT Architecture

GPUs use **Single Instruction, Multiple Threads (SIMT)**. Unlike a CPU that runs a few fat threads with deep pipelines and large caches, a GPU runs thousands of *thin* threads that all execute the same instruction at the same time on different data. This is ideal for problems that are embarrassingly parallel.

## Warps

Threads are grouped into **warps** (NVIDIA terminology) of 32 threads. All 32 threads in a warp execute in lock-step. If threads within a warp take different code paths (*warp divergence*), the GPU must serialize those paths, halving throughput. Writing GPU-friendly code means minimizing divergence.

## Memory Hierarchy

| Level | Latency | Capacity | Scope |
|---|---|---|---|
| Registers | ~1 cycle | ~256 KB/SM | Per thread |
| Shared memory (SRAM) | ~5 cycles | 48–228 KB/SM | Per thread block |
| L2 cache | ~200 cycles | 50 MB (H100) | Chip-wide |
| Global memory (HBM) | ~500 cycles | 80 GB (H100 SXM) | All threads |

**HBM (High-Bandwidth Memory)** — stacked DRAM dies bonded directly to the GPU die — delivers 3+ TB/s bandwidth on H100, compared to ~50 GB/s for DDR5 on a CPU.

## Throughput vs Latency vs CPU

| | CPU | GPU |
|---|---|---|
| Core count | 8–128 | 10,000–18,000+ |
| Clock speed | 4–5 GHz | 1–2 GHz |
| Cache per core | Large | Tiny |
| Latency hiding | Branch prediction, OOO | Massive thread-level parallelism |
| Peak FP32 | ~2 TFLOPS | 60–1000 TFLOPS |

CPUs win for serial, branch-heavy, low-latency workloads. GPUs win when you can express your problem as millions of small independent operations (matrix multiply, convolutions, Monte Carlo simulations).

## When GPUs Win

- **Deep learning training/inference** — transformer attention, convolutions, embedding lookups
- **Scientific simulation** — molecular dynamics, fluid dynamics, climate models
- **Rendering & ray tracing**
- **Cryptography and hashing**
- **Genome sequencing** (alignment algorithms)

The key insight: **arithmetic intensity** (FLOPs per byte of memory accessed). High arithmetic intensity = GPU wins. Low arithmetic intensity = memory-bound, GPU advantage shrinks.`,
      flashcards: [
        {
          front: "What is a warp, and why does warp divergence hurt performance?",
          back: `A **warp** is a group of 32 threads that execute the same instruction in lock-step on a GPU (SIMT model).

**Warp divergence** occurs when threads within a warp take different branches (if/else). The GPU must serialize the divergent paths, reducing effective throughput by up to the number of distinct paths. Minimize divergence by ensuring all threads in a warp take the same code path.`
        },
        {
          front: "Why does HBM matter for AI workloads on GPUs?",
          back: `**HBM (High-Bandwidth Memory)** is stacked DRAM bonded directly to the GPU package. It delivers **3+ TB/s** of memory bandwidth on the H100, vs ~50 GB/s for CPU DDR5.

For AI workloads that are memory-bandwidth-bound (e.g., loading large weight matrices for inference), HBM is the critical bottleneck-buster. Without it, thousands of GPU cores would stall waiting for data.`
        },
        {
          front: "What is arithmetic intensity and why does it determine GPU suitability?",
          back: `**Arithmetic intensity** = FLOPs performed / bytes of memory accessed (FLOPs/byte).

- **High intensity** (e.g., large matrix multiply): GPU wins — cores stay busy computing
- **Low intensity** (e.g., simple element-wise add): memory-bandwidth-bound — GPU advantage diminishes

The **roofline model** plots arithmetic intensity against performance to determine whether a kernel is compute-bound or memory-bound.`
        }
      ],
      quiz: [
        {
          question: "Which memory type on a modern NVIDIA GPU has the highest bandwidth but the highest latency?",
          options: ["Registers", "Shared memory (SRAM)", "HBM (Global memory)", "L2 cache"],
          answer: 2,
          explanation: `**HBM (High-Bandwidth Memory)** sits off-chip (though package-bonded) and provides the largest capacity (~80 GB on H100) and highest aggregate bandwidth (~3 TB/s), but also the highest latency (~400-500 cycles). Registers and shared memory are on-chip and much faster, but tiny. Latency is hidden by the GPU scheduling other warps while a warp waits for HBM data.`
        },
        {
          question: "A kernel processes a 1 GB vector by adding a scalar to every element. Estimate whether this kernel will be compute-bound or memory-bound on a modern GPU and explain why.",
          answer: `This kernel is **memory-bound**.

**Arithmetic intensity analysis:**
- Each element: 1 load (4 bytes) + 1 add + 1 store (4 bytes) = 8 bytes accessed, 1 FLOP
- Arithmetic intensity ≈ 0.125 FLOPs/byte

The H100 SXM5 roofline:
- Memory bandwidth: ~3.35 TB/s
- Peak FP32: ~67 TFLOPS

Bandwidth-limited peak ≈ 3.35 TB/s × 0.125 FLOPs/byte = **0.42 TFLOPS** — far below the compute ceiling.

**Conclusion:** The GPU cores will be idle almost all the time waiting for HBM to deliver data. This kernel does not benefit from the GPU's massive compute parallelism. A better use case would be large matrix multiplications (arithmetic intensity ~100–1000 FLOPs/byte).`
        },
        {
          question: "How does SIMT differ from SIMD, and what implication does it have for control flow?",
          options: [
            "SIMT and SIMD are identical; both serialize divergent branches",
            "SIMT executes threads independently with per-thread PCs; SIMD applies one instruction to a vector with no per-lane branching",
            "SIMD uses warps of 32 lanes; SIMT uses 8-wide vectors",
            "SIMT is a CPU technique; SIMD is GPU-only"
          ],
          answer: 1,
          explanation: `**SIMD (Single Instruction, Multiple Data)** — used in CPUs (AVX-512) — applies one instruction to a fixed-width vector. There are no per-lane program counters; branching across lanes requires masking.

**SIMT (Single Instruction, Multiple Threads)** — used in GPUs — gives each thread its own program counter and register state. Threads within a warp normally run in lock-step, but if they diverge, the GPU can *reconverge* them after the divergent block. This gives programmers the illusion of independent threads while the hardware still runs them in groups of 32. The cost: divergent branches within a warp serialize execution.`
        }
      ]
    },
    {
      id: "cuda",
      title: "CUDA",
      body: `## What Is CUDA?

**CUDA (Compute Unified Device Architecture)** is NVIDIA's parallel computing platform and programming model, introduced in 2007. It extends C/C++ (and supports Python via libraries) to let programmers write code that runs directly on the GPU.

## Programming Model: Kernels

A **kernel** is a function that runs on the GPU, executed by thousands of threads simultaneously. You launch a kernel from the CPU (host) and it runs on the GPU (device).

~~~c
__global__ void add(float* a, float* b, float* c, int n) {
    int i = blockIdx.x * blockDim.x + threadIdx.x;
    if (i < n) c[i] = a[i] + b[i];
}

// Launch: 1024 blocks of 256 threads each
add<<<1024, 256>>>(d_a, d_b, d_c, N);
~~~

## Grid / Block / Thread Hierarchy

~~~
Grid
 └── Block (up to 1024 threads)
      └── Thread
~~~

- **Thread**: smallest unit; has registers and a thread ID (\`threadIdx\`)
- **Block**: group of up to 1024 threads; shares **shared memory** and can synchronize via \`__syncthreads()\`
- **Grid**: collection of blocks; launched per kernel call

Thread index formula: \`global_idx = blockIdx.x * blockDim.x + threadIdx.x\`

## Host vs Device

| | Host (CPU) | Device (GPU) |
|---|---|---|
| Memory space | System RAM (DRAM) | HBM / global memory |
| Execution | Serial / multi-threaded | Massively parallel |
| Code qualifier | (normal C) | \`__global__\`, \`__device__\` |

## Memory Transfers

Data must move between CPU RAM and GPU HBM. This is often the **biggest bottleneck**:

~~~c
cudaMalloc(&d_a, size);           // Allocate GPU memory
cudaMemcpy(d_a, h_a, size,       // CPU → GPU
           cudaMemcpyHostToDevice);
// ... run kernel ...
cudaMemcpy(h_result, d_result,   // GPU → CPU
           size, cudaMemcpyDeviceToHost);
cudaFree(d_a);
~~~

**Unified Memory** (\`cudaMallocManaged\`) lets the driver handle migrations automatically, at the cost of some performance.

## Streams

A **CUDA stream** is a sequence of operations that execute in order on the GPU. Operations in different streams can overlap, enabling:
- Kernel-kernel concurrency
- Overlapping compute with data transfers (using \`cudaMemcpyAsync\`)

This is critical for maximizing GPU utilization in inference pipelines.

## Key Libraries

| Library | Purpose |
|---|---|
| **cuDNN** | Deep neural network primitives (conv, attention, normalization) |
| **cuBLAS** | Dense linear algebra (GEMM, GEMV) |
| **cuSPARSE** | Sparse matrix operations |
| **NCCL** | Multi-GPU/multi-node collective communications |
| **Thrust** | GPU-accelerated STL-like algorithms |
| **TensorRT** | Inference optimization (graph fusion, quantization) |

In practice, most ML engineers never write raw CUDA — frameworks (PyTorch, JAX) call these libraries under the hood.`,
      flashcards: [
        {
          front: "What is the CUDA thread hierarchy from smallest to largest, and what can each level share?",
          back: `**Thread < Block < Grid**

- **Thread**: owns registers and local memory; identified by \`threadIdx\`
- **Block**: threads share **shared memory** (SRAM, ~48–228 KB) and can synchronize with \`__syncthreads()\`; identified by \`blockIdx\`
- **Grid**: all blocks share **global memory** (HBM); no direct block-to-block synchronization within a kernel

A block can have up to 1024 threads. Shared memory is fast (~5 cycles) but small; tiling algorithms explicitly stage data from global→shared to reuse it.`
        },
        {
          front: "Why are PCIe memory transfers between CPU and GPU a common bottleneck, and how can you hide the latency?",
          back: `PCIe bandwidth is ~32 GB/s (PCIe 5.0 x16) — roughly 100x less than HBM. A large model inference job may spend more time moving data than computing.

Mitigations:
1. **Minimize transfers** — keep data on GPU across multiple operations
2. **Async transfers + streams** — \`cudaMemcpyAsync\` with multiple streams overlaps H2D copy with GPU compute on a previous batch
3. **Pinned (page-locked) memory** on the host enables DMA transfers without CPU involvement
4. **NVLink / GPUDirect** — for GPU-to-GPU or GPU-to-NIC transfers, bypass the CPU entirely`
        },
        {
          front: "What does cuDNN provide, and why use it instead of writing raw CUDA?",
          back: `**cuDNN** (CUDA Deep Neural Network library) provides hand-optimized GPU implementations of:
- Convolutions (Winograd, FFT, implicit GEMM)
- Recurrent layers (LSTM, GRU)
- Attention / transformer primitives
- Batch normalization, pooling, activations

Why use it: cuDNN primitives are tuned to specific GPU architectures (Ampere, Hopper tensor cores), auto-select the best algorithm for given input shapes, and achieve near-peak hardware throughput. Writing equivalent raw CUDA is extremely difficult and fragile across GPU generations.`
        }
      ],
      quiz: [
        {
          question: "In a CUDA kernel launched with <<<64, 128>>>, what is the total number of threads and how do you compute a unique 1-D global thread index?",
          options: [
            "8192 threads; index = threadIdx.x * blockDim.x + blockIdx.x",
            "8192 threads; index = blockIdx.x * blockDim.x + threadIdx.x",
            "192 threads; index = blockIdx.x + threadIdx.x",
            "64 threads; index = blockIdx.x"
          ],
          answer: 1,
          explanation: `**Total threads = 64 blocks × 128 threads/block = 8192 threads.**

The standard 1-D global index formula is:
\`\`\`
i = blockIdx.x * blockDim.x + threadIdx.x
\`\`\`
- \`blockIdx.x\` ∈ [0, 63]
- \`blockDim.x\` = 128
- \`threadIdx.x\` ∈ [0, 127]

This produces a unique index in [0, 8191]. Guards like \`if (i < N)\` protect against out-of-bounds when N is not a multiple of block size.`
        },
        {
          question: "Explain why shared memory tiling can dramatically speed up a matrix multiplication kernel compared to a naive implementation.",
          answer: `## Naive Matrix Multiplication

In a naive CUDA GEMM kernel, each thread computes one output element C[i][j] by iterating over the K dimension, loading A[i][k] and B[k][j] from **global memory (HBM)** at each step. Total memory accesses: O(M×N×K) global loads — each with ~500-cycle latency.

## Shared Memory Tiling

With tiling (tile size T):
1. A block of threads cooperatively loads a T×T tile of A and a T×T tile of B from HBM into **shared memory** (fast, ~5 cycles, on-chip SRAM)
2. All threads in the block compute their partial dot products using the shared tile
3. Repeat for the next tile across the K dimension

**Bandwidth reduction:** Each element of A or B is loaded from HBM once per tile, then reused T times from shared memory. This reduces HBM traffic by a factor of T.

**Example:** T=16 → 16× fewer HBM accesses → approaches compute-bound regime (tensor core utilization >90%).

This is the core idea behind cuBLAS and vendor BLAS implementations on GPUs.`
        },
        {
          question: "What is the purpose of CUDA streams, and how do they enable better GPU utilization?",
          options: [
            "Streams partition the GPU into separate physical units for multi-tenancy",
            "Streams are ordered queues that allow concurrent execution of operations from different queues, enabling compute-transfer overlap",
            "Streams replace cudaMalloc for faster memory allocation",
            "Streams are used only for multi-GPU setups with NVLink"
          ],
          answer: 1,
          explanation: `A **CUDA stream** is an ordered sequence of GPU operations (kernels, memcpys) that execute in submission order. Operations from **different streams** can execute concurrently on the GPU if resources allow.

**Key use case — compute-transfer overlap:**
~~~
Stream 1: [H2D copy batch N] → [kernel batch N]
Stream 2:           [H2D copy batch N+1] → [kernel batch N+1]
~~~

While the GPU executes the kernel on batch N, the DMA engine copies batch N+1 from CPU to GPU in parallel. This hides transfer latency and keeps the compute units busy, improving throughput by up to 2×.

The default stream (stream 0) serializes all operations — you must explicitly create non-default streams with \`cudaStreamCreate\` to enable concurrency.`
        }
      ]
    },
    {
      id: "ai-infrastructure",
      title: "AI Infrastructure",
      body: `## The AI Infrastructure Stack

Training and serving large AI models requires purpose-built hardware clusters, purpose-built networking, and carefully orchestrated software. A single A100 or H100 GPU is impressive; 10,000 of them working together on a single model is a different engineering challenge entirely.

## GPU Clusters: DGX and HGX

**NVIDIA DGX** — a purpose-built AI server:
- **DGX H100**: 8× H100 SXM5 GPUs, 640 GB total HBM3, connected via **NVLink** at 900 GB/s bisection bandwidth
- Acts as the atomic unit of large AI training

**NVIDIA HGX** — a baseboard/OEM form factor that GPU server OEMs (Dell, HPE, Supermicro) integrate into their chassis. Same GPU count and NVLink topology as DGX, without the NVIDIA-branded server.

**DGX SuperPOD**: 32 DGX H100 nodes = 256 H100 GPUs, connected via NVIDIA Quantum-2 InfiniBand at 400 Gb/s per GPU.

## Intra-Node Interconnect: NVLink and NVSwitch

Within a DGX H100:
- GPUs are connected via **NVLink 4.0** switches (NVSwitch)
- 900 GB/s total bisection bandwidth between any two GPUs
- Contrast: PCIe 5.0 between a CPU and GPU ≈ 128 GB/s

**NVSwitch** is a dedicated switching chip that provides full all-to-all NVLink connectivity among all 8 GPUs without going through the CPU.

## Inter-Node Interconnect: InfiniBand

Between nodes in a cluster:
- **NVIDIA Quantum-2 InfiniBand** at 400 Gb/s (HDR200) or 800 Gb/s (NDR) per port
- Low latency (~1 µs MPI latency) critical for gradient synchronization
- **GPUDirect RDMA**: GPU can send/receive data directly to/from the NIC's DMA engine, bypassing CPU and system RAM entirely

## Schedulers

| Scheduler | Use Case |
|---|---|
| **Slurm** | HPC tradition; job queues; batch training runs |
| **Kubernetes** | Cloud-native; microservices and inference serving |
| **Volcano / Kueue** | Kubernetes extensions for gang scheduling ML jobs |
| **Run:ai / AWS SageMaker** | Managed ML platforms on top of Kubernetes |

**Gang scheduling**: an entire multi-GPU/multi-node job must be scheduled atomically. Partial allocations cause deadlocks.

## Storage

- **Parallel file systems**: Lustre, GPFS/IBM Spectrum Scale — stripe data across many OSTs for aggregate bandwidth
- **NVMe SSDs**: local node-level storage for dataset caching (e.g., 30 TB NVMe in a DGX H100)
- **Object storage** (S3, GCS): cheap long-term dataset/checkpoint storage; must be pre-staged for training

Checkpoint frequency matters: losing a 10,000-GPU-hour run to a hardware fault without recent checkpoints is catastrophic.

## Training vs Inference Stack

| | Training | Inference |
|---|---|---|
| Batch size | Large (1024–16384 tokens/step) | Small or streaming (1–128) |
| Precision | BF16/FP8 with mixed precision | INT8, FP8, or FP16 |
| Memory | Full model weights + gradients + optimizer states | Weights only (+ KV cache) |
| Latency target | Throughput-optimized | P99 latency SLOs (e.g., <100 ms) |
| Key frameworks | PyTorch + FSDP/Megatron-LM | TensorRT-LLM, vLLM, TGI |`,
      flashcards: [
        {
          front: "What is the difference between NVLink and InfiniBand in a GPU cluster?",
          back: `**NVLink / NVSwitch** — *intra-node* GPU-to-GPU interconnect:
- Up to 900 GB/s bisection BW within one DGX H100 (8 GPUs)
- Hardware switches (NVSwitch chips) on the motherboard
- Extremely low latency; used for all-reduce within a node

**InfiniBand** — *inter-node* cluster fabric:
- 400–800 Gb/s per port (NDR generation)
- Connects separate server nodes via a switch fabric
- ~1 µs MPI latency; used for cross-node gradient sync

In large training runs: NVLink handles intra-node tensor-parallel communication; InfiniBand handles inter-node pipeline/data-parallel communication.`
        },
        {
          front: "What is GPUDirect RDMA and why does it matter?",
          back: `**GPUDirect RDMA** allows a GPU to DMA data directly to/from a network adapter (InfiniBand HCA) without staging through CPU memory.

Without it: GPU HBM → PCIe → CPU DRAM → PCIe → NIC → network
With it: GPU HBM → PCIe → NIC → network

**Benefits:**
- Eliminates one CPU-DRAM round-trip per transfer
- Reduces latency by ~20–30%
- Frees CPU cycles and memory bandwidth for other work
- Critical for low-latency gradient synchronization at scale (hundreds of GPUs)`
        },
        {
          front: "Why is gang scheduling required for multi-node AI training jobs?",
          back: `A distributed training job requires **all** its worker processes to communicate synchronously (e.g., all-reduce after each step). If only a subset of workers are scheduled:

- Workers that are running block at the communication barrier waiting for missing workers
- GPU hours are wasted; the partial job cannot make progress
- This is called a **deadlock** in the scheduling context

**Gang scheduling** = all workers in a job must be allocated and started atomically. Schedulers like Volcano (Kubernetes) and native Slurm support gang scheduling to prevent this waste.`
        }
      ],
      quiz: [
        {
          question: "A DGX H100 node has 8 GPUs connected via NVSwitch. What is the key advantage of NVSwitch over a ring or tree NVLink topology?",
          options: [
            "NVSwitch allows GPUs to communicate with the CPU at higher bandwidth",
            "NVSwitch provides full all-to-all non-blocking connectivity so any GPU can communicate with any other at full bandwidth simultaneously",
            "NVSwitch replaces PCIe entirely, eliminating the CPU from the data path",
            "NVSwitch enables GPUs on different nodes to communicate without InfiniBand"
          ],
          answer: 1,
          explanation: `**NVSwitch** is an on-board switching chip that creates a **non-blocking all-to-all fabric** among all 8 GPUs. Any GPU can send to any other at full NVLink bandwidth simultaneously — there's no contention.

Without NVSwitch (e.g., ring topology), an all-reduce across 8 GPUs requires multiple hops, and bandwidth is limited by the ring bottleneck link. NVSwitch enables single-hop communication, dramatically improving all-reduce throughput within a node — critical for tensor-parallel transformer operations where attention heads are split across GPUs.`
        },
        {
          question: "What distinguishes a training infrastructure stack from an inference infrastructure stack, focusing on memory and latency requirements?",
          answer: `## Training Infrastructure

**Memory:** Must hold weights + gradients + optimizer states. For a 70B parameter model in BF16:
- Weights: 140 GB
- Gradients: 140 GB
- Adam optimizer states (FP32): 560 GB
- Total: ~840 GB → requires model parallelism across many GPUs

**Compute:** Throughput-optimized; large batch sizes for high MFU (Model FLOP Utilization). Latency per step is irrelevant; total wall-clock time matters.

**Precision:** BF16/FP8 compute with FP32 master weights.

## Inference Infrastructure

**Memory:** Weights only (~140 GB for 70B BF16) + **KV cache** (grows with context length and concurrent requests). Memory capacity drives max batch size.

**Compute:** Latency-sensitive — P99 <100 ms TTFT (time to first token) SLOs for interactive apps. Batching is dynamic (continuous batching with vLLM/TGI).

**Precision:** INT8 or FP8 quantization reduces memory and increases throughput.

**Key tools:** TensorRT-LLM (NVIDIA), vLLM (paged attention, PagedKVCache), TGI (Hugging Face). These implement optimizations like flash attention, speculative decoding, and KV cache management that do not apply to training.`
        },
        {
          question: "Which storage technology is best suited for serving large training datasets to a 256-GPU cluster, and why?",
          options: [
            "Local NVMe SSDs on each node — highest bandwidth per node",
            "A parallel file system (Lustre/GPFS) with striping across many storage nodes",
            "Amazon S3 object storage accessed directly during training",
            "A single NFS server with a 10 GbE connection"
          ],
          answer: 1,
          explanation: `A **parallel file system (Lustre, IBM Spectrum Scale/GPFS)** stripes each file across multiple Object Storage Targets (OSTs), so 256 GPU nodes can simultaneously read different stripes in parallel. Aggregate bandwidth scales with the number of OSTs — production clusters achieve hundreds of GB/s.

**Why the others fail:**
- **Local NVMe**: data is not shared; each node can only read its local copy — requires pre-copying datasets, which is slow at scale
- **S3 directly**: ~5–10 GB/s aggregate (cloud egress throttling), plus high latency per object read; causes GPU starvation
- **Single NFS**: 10 GbE ≈ 1.25 GB/s total — 256 GPUs would spend 99% of time waiting for data

Best practice: stage data from S3 into the parallel file system (or local NVMe cache) before training begins.`
        }
      ]
    },
    {
      id: "hpc",
      title: "High-Performance Computing",
      body: `## What Is HPC?

**High-Performance Computing (HPC)** refers to clusters of compute nodes working in parallel to solve large scientific or engineering problems — climate modeling, protein folding, fluid dynamics, crash simulation, etc. Modern AI training clusters are a direct descendant of HPC infrastructure.

## Clusters and Nodes

An HPC cluster is a set of **compute nodes** connected by a low-latency, high-bandwidth network (typically InfiniBand). Each node is a multi-socket server with CPUs (and increasingly GPUs), RAM, and local storage. A **head/login node** manages job submission; **compute nodes** execute jobs.

## MPI: Message Passing Interface

**MPI** is the dominant standard for parallel programming across distributed memory systems. Processes do not share memory; they communicate by explicitly sending and receiving messages.

~~~c
MPI_Init(&argc, &argv);
MPI_Comm_rank(MPI_COMM_WORLD, &rank);    // My process ID
MPI_Comm_size(MPI_COMM_WORLD, &size);   // Total processes

if (rank == 0) {
    // Root: send data to all workers
    MPI_Bcast(data, N, MPI_FLOAT, 0, MPI_COMM_WORLD);
}
MPI_Reduce(local_sum, &global_sum, 1, MPI_FLOAT,
           MPI_SUM, 0, MPI_COMM_WORLD);
MPI_Finalize();
~~~

Key collectives: **Broadcast, Reduce, AllReduce, Scatter, Gather, Barrier**.

## Interconnect: Latency and Bandwidth

| Interconnect | Bandwidth | MPI Latency |
|---|---|---|
| PCIe 5.0 (intra-node) | 128 GB/s | — |
| NVLink 4.0 (intra-node GPU) | 900 GB/s | ~1 µs |
| InfiniBand HDR (inter-node) | 200 Gb/s | ~1 µs |
| InfiniBand NDR (inter-node) | 400 Gb/s | ~1 µs |
| 100 GbE Ethernet | 100 Gb/s | ~5–10 µs |

Latency matters enormously for **tightly coupled** simulations with frequent inter-node communication. A 1 µs vs 10 µs difference becomes catastrophic at millions of MPI calls.

## Scaling: Amdahl's Law

**Amdahl's Law** limits parallel speedup:

~~~
Speedup = 1 / (S + (1-S)/P)
~~~

Where S = serial fraction of the program, P = number of processors.

- If 5% of your code is serial (S=0.05), max speedup is **20×** regardless of P
- This is why HPC developers work obsessively to eliminate serial bottlenecks

**Strong scaling**: fixed problem size, add more processors → speedup limited by Amdahl
**Weak scaling**: problem size grows proportionally with processors → ideal linear scaling; tests Gustafson's Law

## Supercomputers

Modern supercomputers (Frontier, Aurora, El Capitan) are essentially massive GPU clusters:
- **Frontier** (ORNL): 9,408 AMD MI250X GPU nodes, 1.1 ExaFLOPS (FP64)
- **El Capitan** (LLNL): ~2 ExaFLOPS with AMD MI300A APUs
- **NVIDIA Eos** (internal): 576 DGX H100 nodes, 18.4 ExaFLOPS (sparse FP8)

These systems run Lustre/GPFS for storage and Slurm for scheduling, just like large AI clusters.

## Why HPC Matters for AI

The techniques developed in HPC — MPI collectives, topology-aware routing, parallel I/O, job scheduling — are foundational to modern AI training infrastructure. NCCL (NVIDIA Collective Communications Library) is essentially MPI reimplemented for GPUs.`,
      flashcards: [
        {
          front: "State Amdahl's Law and explain its practical implication for scaling a parallel system.",
          back: `**Amdahl's Law:**
\`Speedup(P) = 1 / (S + (1-S)/P)\`

Where S = serial fraction, P = number of processors.

**Practical implication:**
- Max speedup is bounded by \`1/S\` regardless of P
- A program that is 10% serial → max 10× speedup with infinite cores
- Diminishing returns set in early; adding more hardware stops helping

**Counterpoint — Gustafson's Law:** if you scale the *problem size* with P (weak scaling), efficiency can remain constant. This is the more relevant model for AI training (larger models with more GPUs).`
        },
        {
          front: "What is the difference between strong scaling and weak scaling?",
          back: `**Strong scaling:** keep the problem size *fixed*, add more processors.
- Goal: reduce wall-clock time
- Limited by Amdahl's Law — serial portions become the bottleneck
- Measured: speedup vs processor count

**Weak scaling:** increase problem size *proportionally* with processor count.
- Goal: solve a larger problem in the same time
- Ideal: linear scaling (2× processors → 2× problem at same speed)
- Measured: efficiency = T(1)/T(P) should stay near 1.0
- More favorable for AI training (bigger model = more GPUs, same training time)`
        },
        {
          front: "What is an MPI AllReduce and when is it used?",
          back: `**MPI_Allreduce** performs a reduction (sum, max, etc.) across all processes and distributes the result to *all* processes simultaneously (unlike \`MPI_Reduce\` which only sends the result to rank 0).

~~~c
MPI_Allreduce(&local_grad, &global_grad, N,
              MPI_FLOAT, MPI_SUM, MPI_COMM_WORLD);
~~~

**In AI training:** After each backward pass, each GPU holds *local* gradients. AllReduce sums them across all GPUs so every GPU gets identical averaged gradients before the optimizer step. This is the core synchronization primitive for data-parallel training. NCCL implements AllReduce with ring-reduce or tree algorithms optimized for GPU clusters.`
        }
      ],
      quiz: [
        {
          question: "A program has a 20% serial fraction. What is the maximum theoretical speedup achievable with any number of processors, according to Amdahl's Law?",
          options: ["5×", "10×", "20×", "Unlimited"],
          answer: 0,
          explanation: `**Amdahl's Law:** Speedup = 1 / S = 1 / 0.20 = **5×** maximum.

Even with infinite processors, the 20% serial portion must execute sequentially, capping speedup at 5×. This is why HPC optimization focuses heavily on identifying and eliminating serial bottlenecks (I/O, single-threaded preprocessing, sequential reductions).

With P = 10 processors: Speedup = 1/(0.2 + 0.8/10) = 1/0.28 ≈ 3.6×
With P = 100 processors: Speedup = 1/(0.2 + 0.8/100) = 1/0.208 ≈ 4.8×
With P = ∞: Speedup → 5×`
        },
        {
          question: "Why does MPI require explicit message passing instead of shared memory, and what trade-off does this create?",
          answer: `## Why Explicit Message Passing?

MPI targets **distributed memory** systems — clusters of nodes where each node has its own DRAM. There is no hardware-coherent shared memory across nodes (unlike multi-core CPUs with cache coherency). Therefore, data exchange requires explicit send/receive calls over the network.

## Trade-offs

**Advantages of explicit message passing:**
- Scales to thousands of nodes — no need for global cache coherency
- Programmer controls exactly what data is communicated and when → can optimize communication patterns
- Deterministic communication for debugging

**Disadvantages:**
- Programming burden: must partition data, manage buffers, handle synchronization
- Latent bugs: deadlocks (mismatched send/recv), race conditions in non-blocking calls
- Requires restructuring algorithms to minimize communication

**Modern alternative:** PGAS (Partitioned Global Address Space) models like UPC++ or Chapel give a shared-memory programming model while still running on distributed memory, using RDMA under the hood. For AI, NCCL abstracts collective operations (AllReduce, AllGather) so ML engineers rarely write raw MPI.`
        },
        {
          question: "What distinguishes InfiniBand from Ethernet for HPC/AI cluster interconnects?",
          options: [
            "InfiniBand uses TCP/IP; Ethernet uses RDMA",
            "InfiniBand offers lower latency (~1 µs) and RDMA support natively; Ethernet requires RoCE to emulate RDMA and has higher latency",
            "Ethernet provides higher bandwidth than InfiniBand at the same generation",
            "InfiniBand is only used for storage networks, not compute"
          ],
          answer: 1,
          explanation: `**InfiniBand** was designed from the ground up for low-latency, high-bandwidth HPC:
- Native **RDMA** support — one process can read/write another's memory without involving the remote CPU
- ~1 µs MPI latency vs ~5–10 µs for 100 GbE
- Hardware-based flow control; no dropped packets → no retransmit overhead
- Lossless fabric with credit-based flow control

**Ethernet** uses TCP/IP by default (lossy, high overhead). **RoCE (RDMA over Converged Ethernet)** adds RDMA capability, but requires lossless Ethernet (PFC + ECN) and still has higher latency than IB.

For large-scale AI training where AllReduce happens thousands of times per training step, the latency difference matters. NVIDIA acquired Mellanox (the leading InfiniBand vendor) in 2020 to vertically integrate the network stack with GPUs.`
        }
      ]
    },
    {
      id: "autonomous-vehicles",
      title: "Autonomous Vehicles",
      body: `## The Autonomous Vehicle Stack

An autonomous vehicle (AV) must perceive its environment, understand it, plan a safe path, and execute that plan — all in real time, with safety-critical reliability. It is one of the hardest real-time AI systems engineering challenges.

## Sensor Suite

Modern AVs use multiple complementary sensor modalities:

| Sensor | Strength | Weakness |
|---|---|---|
| **Camera** | Rich texture, color, semantics; cheap | No direct depth; degrades in low light/rain |
| **LiDAR** | Direct 3D point cloud; accurate depth | Expensive; sparse; poor in heavy rain/snow |
| **Radar** | Works in all weather; measures velocity | Low resolution; cannot detect small objects |
| **IMU / GPS** | Localization, ego-motion | GPS degrades in tunnels/urban canyons |
| **Ultrasonic** | Close-range parking | Very short range |

**Sensor fusion** combines these modalities to get a unified, more reliable world model than any single sensor can provide.

## Perception → Planning → Control

The canonical three-stage pipeline:

1. **Perception**: raw sensor data → structured scene understanding
   - 3D object detection and tracking (vehicles, pedestrians, cyclists)
   - Lane detection, drivable area segmentation
   - Traffic sign/light recognition
   - Occupancy grid / 3D scene reconstruction

2. **Prediction**: How will other agents move? Pedestrian trajectory prediction, vehicle intent estimation.

3. **Planning**: Given the scene, compute a safe, comfortable, legally compliant trajectory.
   - Route planning (graph search, A*)
   - Behavioral planning (lane change, merge decisions)
   - Motion planning (polynomial, RRT, lattice-based)

4. **Control**: Execute the planned trajectory via actuators.
   - Lateral: steering angle commands (PID, MPC)
   - Longitudinal: throttle/brake commands
   - Must handle vehicle dynamics and actuation delays

## Real-Time and Latency Constraints

The entire perception-to-actuation loop must complete in **<100 ms** for highway driving (the vehicle moves 3 meters at 100 km/h in 100 ms). Requirements:

- LiDAR spin rate: 10–20 Hz (50–100 ms frame period)
- Camera frame rate: 30–60 Hz
- Control loop: 100–1000 Hz
- Latency budget is carved across each pipeline stage

This drives hardware selection: only purpose-built accelerators (not cloud TPUs or training GPUs) can meet these latency SLOs while fitting in a vehicle's power/thermal envelope.

## Onboard Compute: NVIDIA DRIVE

**NVIDIA DRIVE Orin** (2022):
- 254 TOPS (INT8)
- 12× Arm Cortex-A78AE CPUs + 12× NVIDIA Ampere GPU SMs
- Safety-certified (ASIL-D) hardware and software stack
- Runs perception DNN workloads with real-time guarantees

**NVIDIA DRIVE Thor** (2025):
- 2000 TOPS
- Consolidates AV compute + in-cabin AI on one SoC

Multiple DRIVE Orin modules are often used per vehicle for redundancy and safety isolation.

## Simulation and Safety

- **Scale**: billions of real-world miles needed for validation; simulation fills the gap
- **NVIDIA DRIVE Sim / Omniverse**: physically accurate sensor simulation (ray-traced LiDAR, camera with lens effects)
- **Adversarial testing**: automatically generate rare, dangerous scenarios (cut-ins, pedestrians jaywalking)
- **Shadow mode**: deploy perception models on cars but don't act on them; compare to human driver for ground truth
- **Functional safety**: ISO 26262 / SOTIF (Safety Of The Intended Functionality); ASIL-D is the highest automotive safety integrity level`,
      flashcards: [
        {
          front: "Why is sensor fusion necessary in autonomous vehicles — why not just use cameras?",
          back: `Cameras alone are insufficient for safe autonomy:

1. **No direct depth measurement**: depth estimation from monocular cameras is probabilistic and degrades at distance
2. **Lighting dependence**: cameras fail in direct glare, tunnels, or nighttime without illumination
3. **Weather**: rain, fog, snow degrade image quality severely

**LiDAR** provides accurate 3D point clouds but is sparse and expensive and struggles in heavy precipitation.

**Radar** provides velocity directly (Doppler) and is nearly weather-immune but has low angular resolution.

**Fusion** gives the system the union of each sensor's strengths: camera semantics + LiDAR geometry + radar velocity. Kalman filters or learned fusion networks combine the modalities into a unified, more reliable scene model.`
        },
        {
          front: "What is the perception-planning-control pipeline in an AV?",
          back: `**Perception:** Sensor data → structured scene (object detection, lane detection, occupancy)

**Prediction:** How will other agents move in the next few seconds? (trajectory forecasting)

**Planning:** Given predictions, compute ego trajectory that is safe, comfortable, legal.
- Route level: get from A to B
- Behavior level: when to change lanes, yield
- Motion level: smooth trajectory

**Control:** Convert trajectory into actuator commands (steering, throttle, brake) accounting for vehicle dynamics.

The loop must complete in <100 ms for highway-speed driving and must be fail-safe (fallback to safe stop if any stage fails).`
        },
        {
          front: "What is ASIL-D and why does it matter for AV compute hardware?",
          back: `**ASIL (Automotive Safety Integrity Level)** is defined by ISO 26262. ASIL-D is the highest level — required for systems where failure could cause death.

For AV compute:
- Hardware must be designed with redundancy, ECC memory, lockstep CPU cores, and self-diagnostics
- The **NVIDIA DRIVE Orin** SoC is ASIL-D certified
- Software running on ASIL-D hardware requires rigorous development processes (code coverage, FMEA)

In practice, AV systems use **decomposition**: a primary compute path (non-safety-rated, high TOPS) plus a safety monitor (ASIL-D rated, simpler) that can override and trigger a safe stop if anomalies are detected.`
        }
      ],
      quiz: [
        {
          question: "An AV is traveling at 120 km/h. The LiDAR spins at 10 Hz. How far does the vehicle travel per LiDAR frame, and what implication does this have for the perception latency budget?",
          options: [
            "0.33 m — latency is not a concern at this speed",
            "3.33 m — the vehicle travels over 3 meters per frame; total perception-to-actuation must complete well within 100 ms",
            "33.3 m — the vehicle travels 33 meters per frame",
            "1.2 m — only the control loop latency matters"
          ],
          answer: 1,
          explanation: `120 km/h = 33.3 m/s. At 10 Hz (100 ms frames): **distance = 33.3 m/s × 0.1 s = 3.33 meters per frame**.

This means:
- A new LiDAR scan arrives every 3.33 meters of travel
- The entire pipeline (perception inference + prediction + planning + control) must complete **within one frame period (100 ms)** to act on current information
- Each stage has a strict budget: perception ~30 ms, prediction ~20 ms, planning ~30 ms, control ~5 ms (rough targets)
- At 120 km/h, even a 200 ms total latency means the vehicle acts on data from 6.6 meters ago — dangerous in dynamic scenarios

This is why AV compute uses purpose-built SoCs with hardware accelerators and real-time OS, not general-purpose cloud inference.`
        },
        {
          question: "Compare cameras and LiDAR as primary perception sensors for an AV. What are the key trade-offs, and why do most production AV stacks use both?",
          answer: `## Camera

**Strengths:**
- Dense semantic information: color, texture, fine detail, text recognition
- Low cost (<$100/unit)
- High angular resolution
- Established deep learning models (YOLO, ViT) for classification, segmentation, depth estimation

**Weaknesses:**
- No direct depth measurement; learned depth is probabilistic
- Performance degrades in low-light, glare, fog, rain
- Sensitive to lens contamination

## LiDAR

**Strengths:**
- Direct 3D measurement: precise depth and geometry
- Consistent in varying lighting (active illumination)
- Provides drivable area and obstacle height directly

**Weaknesses:**
- High cost ($1,000–$100,000 per unit historically; falling)
- Sparse point cloud at distance; poor texture/color information
- Degraded in heavy rain, snow (point scattering)
- Rotating mechanicals have reliability concerns (solid-state improves this)

## Why Both?

**Complementary failure modes**: rain degrades LiDAR but camera may still work for lane lines; night degrades camera but LiDAR is unaffected.

**Fusion exploits strengths**: cameras detect and classify objects (what is it?); LiDAR provides accurate 3D bounding boxes (where is it?). Fusion models like PointPainting or BEVFusion project camera features onto LiDAR point clouds.

**Redundancy for safety**: ASIL decomposition requires independent sensing paths. Camera + LiDAR + Radar = three diverse, independent sensor modalities.`
        },
        {
          question: "Why is simulation critical in AV development, and what is 'shadow mode' testing?",
          options: [
            "Simulation replaces road testing entirely; no real-world miles are needed",
            "Simulation generates safety-critical rare scenarios at scale; shadow mode runs new models on real cars without acting on their outputs for safe ground-truth comparison",
            "Shadow mode means the car drives with lights off to test night vision algorithms",
            "Simulation is only used for training data generation, not validation"
          ],
          answer: 1,
          explanation: `## Why Simulation?

The \"trillion miles problem\": statistically rare but safety-critical events (child running into road at night in rain) may appear once per billion real-world miles. No AV company can drive enough real miles before deployment. Simulation fills this gap:

- Parameterize rare scenarios and run them millions of times
- Test adversarial cases: sensor failures, edge-case agent behaviors
- Physically accurate sensor simulation (NVIDIA DRIVE Sim, Waymo Carcraft) replicates LiDAR, camera with noise models

## Shadow Mode

**Shadow mode** (or \"silent testing\"):
1. Deploy a new perception/planning model on production vehicles
2. The model runs in parallel but its outputs are **not sent to the controller** — it cannot affect driving
3. The model's decisions are logged and compared against what the human driver (or current deployed model) actually did
4. Discrepancies surface bugs before the model is given control

This is how companies safely iterate on models using real-world distribution without safety risk. It is also how autonomous trucking companies validate new DNN versions across millions of miles before enabling autonomous mode.`
        }
      ]
    },
    {
      id: "networking-mellanox",
      title: "Networking & Mellanox",
      body: `## NVIDIA's Acquisition of Mellanox

In 2020, NVIDIA acquired Mellanox Technologies for **$6.9 billion** — its largest acquisition before the attempted Arm deal. Mellanox was the leading provider of **InfiniBand** and high-speed Ethernet network adapters (HCAs/NICs), switches, and cables for HPC and data centers.

**Strategic rationale**: As GPU clusters scaled to thousands of GPUs, the network became a first-class bottleneck. NVIDIA needed to control the full hardware stack — GPU + interconnect — to optimize end-to-end AI training performance. The acquisition integrated Mellanox into NVIDIA's networking division (now also including the DPU BlueField product line).

## InfiniBand vs Ethernet/RoCE

| Feature | InfiniBand | Ethernet (TCP/IP) | RoCE (RDMA over CE) |
|---|---|---|---|
| Latency | ~1 µs | ~50–100 µs | ~2–5 µs |
| Native RDMA | Yes | No | Yes (needs lossless Ethernet) |
| Congestion control | Credit-based (lossless) | TCP window | PFC + ECN (lossless Ethernet) |
| Ecosystem | HPC, AI | Universal | Data center AI (Azure, AWS) |
| Current speed | 400 Gb/s NDR | 400 GbE | 400 GbE |

InfiniBand's latency advantage is critical for tightly-coupled distributed training where AllReduce happens thousands of times per training step.

## RDMA: Remote Direct Memory Access

**RDMA** allows a process on one machine to read or write the memory of a remote machine without involving the remote CPU or OS:

~~~
Traditional: CPU → kernel → NIC → network → NIC → kernel → CPU → buffer
RDMA:        CPU (registers read address) → NIC → network → NIC → writes directly to target buffer
~~~

Benefits:
- **Zero-copy**: no data copied through CPU memory
- **Kernel bypass**: no OS interrupt overhead
- **Low CPU overhead**: NICs handle the transfer autonomously

This is critical for gradient synchronization, where terabytes of gradient data must move between nodes at every training step.

## GPUDirect

**GPUDirect RDMA**: GPU HBM ↔ NIC without CPU involvement. The GPU's DMA engine can initiate RDMA operations directly.

**GPUDirect Storage**: GPU can read data directly from NVMe SSDs via DMA, bypassing CPU and system RAM.

**GPUDirect P2P**: Direct GPU-to-GPU transfers within a node over PCIe without staging through CPU memory (for non-NVLink topologies).

## DPUs: BlueField Data Processing Units

A **DPU (Data Processing Unit)** is a programmable network card with an integrated multi-core ARM CPU and networking ASIC:

- **NVIDIA BlueField-3**: ConnectX-7 400 GbE/InfiniBand + 16× Arm Cortex-A78 cores, 128 GB DRAM
- Offloads network functions (OVS/SDN, firewall, TLS/IPsec, storage protocols) from the host CPU
- Enables **secure multi-tenancy**: the DPU enforces network policies that the tenant cannot bypass even with root access
- Used in NVIDIA's DGX SuperPOD and cloud providers' "smart NIC" offerings (AWS Nitro, Azure MANA)

## The Network as Bottleneck at Scale

At 1000-GPU scale for training a large language model:

- Each AllReduce step synchronizes ~100 GB of gradients
- 10 AllReduce steps per second = 1 TB/s aggregate network requirement
- A 400 Gb/s (50 GB/s) InfiniBand link per GPU barely keeps up

**Solutions:**
1. **Topology-aware routing**: ring allreduce exploits locality; NCCL detects topology
2. **Gradient compression**: FP16 master weights, FP8 communication
3. **Overlap communication with compute**: async allreduce (using CUDA streams) during the next forward pass
4. **Hierarchical collectives**: all-reduce within a node over NVLink, then all-reduce between nodes over InfiniBand`,
      flashcards: [
        {
          front: "Why did NVIDIA acquire Mellanox, and what was the strategic rationale?",
          back: `NVIDIA acquired Mellanox (2020, $6.9B) because **the network became the bottleneck** as GPU clusters scaled to thousands of nodes.

**Strategic reasons:**
1. **Vertical integration**: own GPU + network + storage (DPU) → optimize the full data path end-to-end
2. **InfiniBand dominance**: Mellanox controlled ~90% of HPC InfiniBand market — same customers buying NVIDIA GPUs
3. **GPUDirect**: deeper integration of GPU memory with NIC DMA enabled lower-latency gradient sync
4. **DPUs (BlueField)**: offload networking from CPU, enabling more GPU compute cycles
5. **Competitive moat**: prevent rival GPU vendors (AMD, Intel) from owning the critical interconnect layer`
        },
        {
          front: "What is RDMA and how does it differ from conventional network I/O?",
          back: `**RDMA (Remote Direct Memory Access)**: a NIC reads/writes remote memory directly via DMA, bypassing the remote CPU and OS kernel.

**Conventional path:** Local app → kernel syscall → NIC driver → NIC → network → remote NIC → kernel interrupt → remote app buffer

**RDMA path:** Local NIC → network → remote NIC → writes directly to registered remote memory buffer (CPU not involved)

**Benefits:** Zero-copy, kernel-bypass, low latency (~1 µs vs ~50 µs TCP), low CPU overhead.

**Requirement:** Memory must be *registered* (pinned, mapped to NIC) in advance. Both InfiniBand and RoCE support RDMA natively.`
        },
        {
          front: "What is a DPU (BlueField) and what workloads does it offload?",
          back: `A **DPU (Data Processing Unit)** is a network adapter with an integrated programmable CPU — essentially a smart NIC.

**NVIDIA BlueField-3** combines:
- 400 GbE or InfiniBand ConnectX-7 ASIC
- 16× Arm Cortex-A78 cores
- Dedicated crypto / packet processing engines

**Offloaded workloads:**
- Open vSwitch (SDN/overlay networking) without host CPU cycles
- TLS/IPsec encryption
- Storage protocols (NVMe-oF target)
- Firewall / micro-segmentation enforcement
- Telemetry collection

**Security benefit:** The DPU enforces policy independently of the host OS — a compromised tenant VM cannot bypass network security rules. This is why cloud providers use DPUs/smart NICs (AWS Nitro, Azure MANA) for secure multi-tenancy.`
        }
      ],
      quiz: [
        {
          question: "Why does RDMA dramatically reduce the CPU overhead compared to traditional TCP/IP socket communication for gradient synchronization?",
          options: [
            "RDMA uses larger MTU sizes, reducing the number of packets",
            "RDMA bypasses the OS kernel and CPU for data transfer, eliminating interrupt overhead and memory copies",
            "RDMA compresses gradients automatically before transmission",
            "RDMA is faster only because InfiniBand has higher bandwidth than Ethernet"
          ],
          answer: 1,
          explanation: `Traditional TCP/IP socket communication involves:
1. Application calls \`send()\` → **context switch to kernel**
2. Data **copied** from user buffer to kernel socket buffer
3. **Kernel** segments data, adds headers, queues to NIC driver
4. NIC sends; remote NIC **interrupts** remote CPU
5. Remote kernel **copies** data to application buffer

Each step burns CPU cycles and memory bandwidth. For gradient sync (100 GB per AllReduce), this overhead is prohibitive.

**RDMA** after memory registration:
1. Application posts a work request to the NIC queue pair (no syscall)
2. NIC's DMA engine reads source memory, packetizes, sends
3. Remote NIC writes directly to pre-registered destination buffer
4. Completion event via polling (no interrupt)

Result: Near-zero CPU overhead, no copies, no interrupts, ~1 µs latency. This is why AllReduce with NCCL over InfiniBand scales to thousands of GPUs.`
        },
        {
          question: "A 1000-GPU training cluster performs one AllReduce per second, each synchronizing 50 GB of gradients. What is the aggregate network bandwidth demand per GPU, and is 200 Gb/s InfiniBand HDR sufficient?",
          answer: `## Calculation

**Gradient volume per AllReduce:** 50 GB
**AllReduce frequency:** 1/second
**Aggregate bandwidth needed:** 50 GB/s across all inter-node links

In a **ring AllReduce** with N nodes, each node sends and receives 2 × (N-1)/N × data ≈ 2 × 50 GB = 100 GB/s total per node for N >> 1.

**Per-GPU NIC bandwidth required:** ~100 GB/s bidirectional = 800 Gb/s

**200 Gb/s HDR InfiniBand** (25 GB/s unidirectional) is clearly **insufficient** for 1 AllReduce/second at 50 GB.

## Solutions

1. **Reduce AllReduce frequency:** gradient accumulation — accumulate gradients for K steps, then sync (less frequent, larger batches)
2. **Gradient compression:** FP8 quantization cuts gradient size 2–4×
3. **Overlap communication with compute:** use CUDA streams to compute next forward pass while AllReduce runs in background (partially hides latency)
4. **Hierarchical AllReduce:** NVLink (900 GB/s) within a node, InfiniBand between nodes — reduces inter-node traffic by 8× for an 8-GPU-per-node cluster
5. **Upgrade to NDR (400 Gb/s):** doubles bandwidth vs HDR`
        },
        {
          question: "What advantage does InfiniBand's credit-based flow control provide over Ethernet's TCP congestion control for HPC/AI workloads?",
          options: [
            "Credit-based flow control eliminates all packet loss, providing lossless fabric that enables RDMA without retransmissions",
            "Credit-based flow control automatically compresses data in-flight",
            "TCP congestion control is faster than InfiniBand for burst workloads",
            "InfiniBand flow control is only beneficial for storage networks"
          ],
          answer: 0,
          explanation: `**InfiniBand credit-based flow control** works at the link layer: a sender can only transmit as many packets as the receiver has buffer credits for. This prevents buffer overflow and packet loss entirely — **lossless fabric**.

**Why lossless matters for RDMA:**
- RDMA relies on in-order, loss-free delivery. A single dropped packet requires retransmission of an entire message (potentially GBs of gradient data)
- With TCP, congestion control backs off exponentially on packet loss — terrible for burst communications
- With IB's lossless fabric, RDMA operates at line rate with predictable latency

**RoCE on Ethernet** requires configuring **PFC (Priority Flow Control)** + **ECN (Explicit Congestion Notification)** to emulate lossless behavior. This is harder to operate at scale and still has higher latency than native IB.`
        }
      ]
    },
    {
      id: "distributed-ai-training",
      title: "Large-Scale Distributed AI Training",
      body: `## Why Distributed Training?

A GPT-4 class model has ~1 trillion parameters. At BF16 (2 bytes/param), weights alone require ~2 TB. A single H100 has 80 GB HBM — the model doesn't fit. Even if it did, training speed on one GPU would take decades.

Distributed training solves: **memory constraints** and **speed/throughput**.

## The Four Parallelism Strategies

### 1. Data Parallelism (DP)

- Replicate the full model on each GPU
- Split the training batch across GPUs (each sees a different mini-batch)
- After backward pass, **AllReduce gradients** to synchronize

**Limit**: model must fit on one GPU. For LLMs, this fails immediately.

### 2. Tensor Parallelism (TP) — Megatron-LM style

- Split individual tensors (weight matrices) across GPUs
- Each GPU holds a **shard** of each layer
- Communication happens within each layer (AllReduce per transformer layer)
- **Intra-layer parallelism**; requires high-bandwidth links → usually stays within a node (NVLink)

~~~
// MLP weight [H, 4H] split across 4 GPUs
GPU 0: W[:, 0:H]
GPU 1: W[:, H:2H]
GPU 2: W[:, 2H:3H]
GPU 3: W[:, 3H:4H]
~~~

### 3. Pipeline Parallelism (PP) — GPipe style

- Partition model **layers** across GPUs (GPU 0 holds layers 1-8, GPU 1 layers 9-16, etc.)
- Micro-batches flow through the pipeline; GPUs work on different micro-batches simultaneously
- **Pipeline bubble**: GPU 0 is idle while waiting for gradients to flow back
- Reduces the bubble with interleaved schedules (1F1B — one-forward-one-backward)

### 4. Sequence/Context Parallelism

- Split the **sequence dimension** across GPUs
- Required for very long contexts (1M+ tokens) that don't fit in one GPU's memory
- Used in conjunction with tensor parallelism for attention layers

## Combining Strategies: 3D Parallelism

In practice (Megatron-LM, DeepSpeed, FSDP):
- **DP × TP × PP** = total GPU count
- Example: 8-way TP (within node, NVLink), 8-way PP (pipeline stages), 256-way DP → 16,384 GPUs

## AllReduce and NCCL

**NCCL (NVIDIA Collective Communications Library)** implements:
- AllReduce (ring, tree, binary doubling algorithms)
- AllGather, ReduceScatter
- Broadcast, Scatter, Gather

NCCL automatically detects topology (NVLink vs InfiniBand) and selects optimal algorithms. Ring AllReduce has optimal bandwidth utilization: each node sends/receives 2×(N-1)/N × data.

## Memory Optimization: ZeRO (Zero Redundancy Optimizer)

Standard data parallelism replicates: model weights + gradients + optimizer states (Adam: 2 FP32 copies = 12 bytes/param for a BF16 model).

**ZeRO (DeepSpeed)** eliminates redundancy:

| Stage | Partitioned | Memory per GPU (7B model) |
|---|---|---|
| ZeRO-1 | Optimizer states | ~30 GB |
| ZeRO-2 | + Gradients | ~16 GB |
| ZeRO-3 | + Parameters | ~2 GB |

ZeRO-3 = **FSDP (Fully Sharded Data Parallelism)** — PyTorch's native implementation.

## Gradient Synchronization and Communication Overlap

Naive: wait for entire backward pass to complete, then AllReduce all gradients.

**Better**: AllReduce gradients of earlier layers while computing gradients of later layers (pipelining). NCCL streams run concurrently with CUDA compute streams. This hides ~70–90% of communication latency.

## Scaling Challenges

1. **Stragglers**: one slow GPU stalls the whole step. Tight tail latency requirements.
2. **Checkpoint and restart**: at 10,000 GPU scale, hardware failure probability is high. Asynchronous checkpointing to NVMe/parallel storage is essential.
3. **Numerical stability**: gradient all-reduce in FP16 can underflow/overflow; loss scaling and BF16 mitigate this.
4. **Efficient micro-batch sizing**: pipeline bubble size depends on micro-batch count; larger micro-batches reduce bubble but use more memory.`,
      flashcards: [
        {
          front: "What are the four main parallelism strategies for distributed training, and what bottleneck does each address?",
          back: `**1. Data Parallelism (DP):** Replicate model; split batch. Addresses *throughput*. Requires model to fit on one GPU.

**2. Tensor Parallelism (TP):** Shard weight matrices across GPUs within a layer. Addresses *model memory* — individual layers too large. High-bandwidth (NVLink) required; usually intra-node.

**3. Pipeline Parallelism (PP):** Assign different layers to different GPUs. Addresses *model depth*. Low communication volume but introduces pipeline bubble overhead.

**4. Sequence Parallelism (SP):** Shard along the sequence dimension. Addresses *context length* — 1M token contexts don't fit. Used with TP for attention.

In production (Megatron-LM, FSDP): 3D or 4D parallelism combines all strategies.`
        },
        {
          front: "What is ZeRO-3 / FSDP, and how does it differ from standard data parallelism?",
          back: `**Standard DP:** Every GPU holds a full copy of weights + gradients + optimizer states. For a 70B model + Adam: ~840 GB per GPU → impossible.

**ZeRO-3 (DeepSpeed) / FSDP (PyTorch):** Each GPU holds only **1/N of every tensor** — parameters, gradients, and optimizer states are all sharded.

During forward/backward: a GPU collects its needed parameter shard from all others (AllGather), computes, then releases the gathered tensor.

**Trade-off:** More communication (AllGather + ReduceScatter) vs memory savings. ZeRO-3 enables training models that are N× larger than a single GPU's memory with linear memory scaling.`
        },
        {
          front: "What is the pipeline bubble in pipeline parallelism, and how does the 1F1B schedule reduce it?",
          back: `**Pipeline bubble**: In a naive pipeline, GPU 0 computes the first micro-batch's forward pass, then sits idle while later stages compute and until gradients flow back. Bubble fraction ≈ (p-1)/m, where p = pipeline stages, m = micro-batches.

**1F1B (One Forward, One Backward) schedule**: After the warmup phase, each pipeline stage immediately processes one backward pass as soon as it finishes a forward pass — interleaving F and B. This keeps all stages busy with different micro-batches simultaneously.

**Interleaved 1F1B (Megatron v2):** Each stage handles multiple non-consecutive layer chunks, further reducing the bubble to (p-1)/(m×v) where v = virtual stages per device.`
        }
      ],
      quiz: [
        {
          question: "For a 70B parameter model trained with Adam optimizer in BF16, estimate total memory per GPU if using standard data parallelism (no ZeRO). Why does this make DP infeasible?",
          options: [
            "~140 GB — only weights in BF16, which fits on an H100",
            "~840 GB — weights + gradients + FP32 optimizer states, which is 10× a single H100",
            "~70 GB — parameters only, marginal fit on H100",
            "~280 GB — weights + gradients only"
          ],
          answer: 1,
          explanation: `**Memory breakdown for 70B parameters with Adam:**

| Component | Precision | Size |
|---|---|---|
| Model weights | BF16 (2B/param) | 140 GB |
| Gradients | BF16 (2B/param) | 140 GB |
| Adam m (1st moment) | FP32 (4B/param) | 280 GB |
| Adam v (2nd moment) | FP32 (4B/param) | 280 GB |
| **Total** | | **~840 GB** |

An H100 SXM5 has 80 GB HBM. **840 GB >> 80 GB** → standard DP is impossible.

Solution: ZeRO-3 or FSDP shards all tensors across N GPUs. With 16 GPUs: ~52 GB per GPU, which fits. This is why ZeRO/FSDP are the default for LLM training.`
        },
        {
          question: "Explain how ring AllReduce works and why it achieves near-optimal bandwidth utilization compared to a tree-reduce approach.",
          answer: `## Ring AllReduce

Arrange N GPUs in a logical ring. The algorithm has two phases:

**Phase 1 — ReduceScatter (N-1 steps):**
Each GPU sends a chunk of its gradient to the next GPU and accumulates the received chunk. After N-1 steps, each GPU holds the fully reduced sum for one chunk (1/N of the total data).

**Phase 2 — AllGather (N-1 steps):**
Each GPU sends its reduced chunk to the next; all GPUs end with the complete AllReduce result.

**Bandwidth analysis:**
- Each GPU sends 2 × (N-1)/N × total_data over N-1 steps
- As N→∞: each GPU sends ≈ 2× total_data total
- NIC utilization: nearly 100% of both send and receive bandwidth throughout

## Why Better Than Tree-Reduce?

In a tree (binary) AllReduce:
- Communication volume is the same overall, but only O(log N) GPUs communicate at each step
- The root GPU is a bottleneck (must receive and send at every level)
- NICs of non-root GPUs are idle most of the time

**Ring** uses every GPU's NIC at every step → bandwidth scales linearly with N (adding GPUs adds aggregate bandwidth). This is why NCCL defaults to ring for large, bandwidth-bound payloads.`
        },
        {
          question: "In a 3D-parallel training setup, where is tensor parallelism typically placed and why, versus pipeline parallelism?",
          options: [
            "TP between nodes (InfiniBand); PP within nodes (NVLink)",
            "TP within nodes (NVLink, high bandwidth); PP between nodes (InfiniBand, low communication volume)",
            "TP and PP are always placed on the same nodes for performance",
            "TP is only for inference, PP for training"
          ],
          answer: 1,
          explanation: `**Tensor Parallelism within a node (NVLink):**
- TP requires an AllReduce *inside every transformer layer* (multiple per forward pass)
- High communication frequency demands high bandwidth
- NVLink 4.0: 900 GB/s within a DGX node → sufficient
- InfiniBand (50 GB/s): would bottleneck every single layer computation

**Pipeline Parallelism between nodes (InfiniBand):**
- PP only communicates once per micro-batch: send activation tensor at the boundary between pipeline stages
- Communication volume: one activation tensor per layer boundary × batch size — much lower than TP's per-layer AllReduces
- InfiniBand is sufficient for the relatively infrequent activation passing between pipeline stages

**3D Parallelism layout example (Megatron-LM on 64 DGX nodes, 512 GPUs):**
- TP = 8 (within each DGX node, over NVLink)
- PP = 8 (across 8 node groups, over InfiniBand)
- DP = 8 (data parallel across 8 groups of 64 GPUs)
- 8 × 8 × 8 = 512 GPUs total`
        }
      ]
    },
    {
      id: "data-center-software",
      title: "Data-Center Software",
      body: `## The Software Layer of a GPU Data Center

Raw hardware — GPUs, networking, storage — is only as useful as the software that orchestrates it. Data-center software encompasses job scheduling, resource management, observability, security, and reliability.

## Orchestration: Kubernetes vs Slurm

### Kubernetes

- Container orchestration system, originally designed for microservices
- **GPU scheduling**: via device plugins (NVIDIA device plugin for Kubernetes); GPU is exposed as an extended resource (\`nvidia.com/gpu: 1\`)
- **AI extensions**: Kubeflow, Volcano (gang scheduling), Kueue (queue management), KAI Scheduler (NVIDIA)
- **Strengths**: ecosystem, auto-scaling, rolling deployments, declarative config, cloud portability
- **Weaknesses**: not natively designed for gang-scheduled, tightly coupled MPI jobs; higher overhead for HPC patterns

### Slurm

- Dominant in HPC and traditional AI research clusters
- **Job scheduler**: assigns nodes/GPUs to batch jobs; enforces time limits, priorities, preemption
- **Gang scheduling built-in**: entire MPI job allocated atomically
- **Strengths**: simple job script model, excellent for batch training, handles heterogeneous hardware
- **Weaknesses**: not designed for stateless microservices or dynamic scaling; limited container support (Singularity/Enroot bridges this)

**Production trend**: Kubernetes for inference serving; Slurm for training; hybrid setups are common.

## GPU Scheduling and MIG

### GPU Sharing Strategies

| Strategy | Use Case | Overhead |
|---|---|---|
| Time-slicing | Multiple users, fairness | Context switch overhead |
| MIG (Multi-Instance GPU) | Strong isolation between tenants | Fixed partition sizes |
| MPS (Multi-Process Service) | Inference: multiple processes share one GPU's SM | Moderate; no error isolation |

### MIG (Multi-Instance GPU)

Introduced on A100. A single GPU is partitioned into up to 7 independent **GPU Instances (GIs)**, each with dedicated:
- Compute SMs
- HBM slices
- L2 cache partitions
- NVLink/PCIe bandwidth

MIG instances are hardware-isolated — a GPU error in one instance cannot affect another. Enables strong multi-tenancy for inference: one A100 can serve 7 small models simultaneously.

## Observability

**Metrics to monitor in a GPU data center:**
- **GPU utilization**: SM activity; should be >90% during training
- **Memory utilization**: HBM usage; watch for OOM approaching
- **MFU (Model FLOP Utilization)**: achieved FLOPs / theoretical peak FLOPs; a proxy for training efficiency
- **Power draw**: per-GPU wattage; H100 TDP = 700W; thermal throttling degrades performance
- **NVLink/IB bandwidth**: saturation indicates communication bottleneck
- **Job queue depth**: wait time for GPU allocation

**Tools**: DCGM (Data Center GPU Manager, NVIDIA), Prometheus + Grafana, Weights & Biases, MLflow.

## Multi-Tenancy and Security

Challenges:
- Multiple teams sharing a cluster; prevent information leakage between workloads
- Namespace isolation (Kubernetes) or user accounts (Slurm)
- GPU memory is not zeroed between jobs by default → **must use driver-level zeroing or MIG** for sensitive workloads
- Network policy enforcement via DPUs (BlueField) or Kubernetes NetworkPolicy

## Fault Tolerance and Checkpointing

At 10,000-GPU scale, MTBF (Mean Time Between Failures) of any single component is hours, not days:
- DRAM ECC errors
- NIC transient failures
- NVMe drive failures
- Power supply faults

**Strategies:**
- **Checkpoint to NVMe + parallel FS**: every N steps, save model state; restart from last checkpoint on failure
- **Elastic training** (PyTorch Elastic, Horovod): job can continue with fewer workers, then reintegrate repaired nodes
- **NVIDIA DGX FUSA**: functional safety monitor for detecting GPU errors in near-real-time
- **Redundant networking**: dual-port InfiniBand NICs with active-active bonding

## Power and Cooling Awareness

A 10,000-GPU cluster with H100s:
- 10,000 × 700 W = 7 MW just for GPUs
- Total data center: 15–20 MW (including networking, storage, cooling)
- Cooling dominates OpEx: air vs. liquid cooling (direct liquid cooling for H100 required at density)
- Power-aware scheduling: schedule jobs to avoid simultaneous peak power spikes; coordinate with UPS/generator capacity`,
      flashcards: [
        {
          front: "What is MIG (Multi-Instance GPU) and when should you use it?",
          back: `**MIG (Multi-Instance GPU)**, introduced on NVIDIA A100, partitions one physical GPU into up to **7 hardware-isolated GPU instances**, each with dedicated HBM, compute SMs, and cache slices.

**Use when:**
- Multi-tenant inference: one A100 serves 7 different models/customers with strong isolation
- Compliance requirements: tenant A cannot read tenant B's GPU memory (even on hardware fault)
- Small model inference: a 3B parameter model doesn't need all 80 GB of HBM; MIG right-sizes the resource

**Do NOT use for training**: MIG partitions are fixed at runtime; a training job benefits from the full GPU; MIG prevents NVLink P2P between partitions.

Available MIG profiles on A100: 1g.10gb (7×), 2g.20gb (3×), 4g.40gb (1×), 7g.80gb (full).`
        },
        {
          front: "What is MFU (Model FLOP Utilization) and what typically limits it?",
          back: `**MFU = Achieved FLOPs per second / Theoretical peak FLOPs per second**

A perfect MFU of 1.0 means every tensor core cycle is doing useful work. In practice:

- **Good training MFU**: 40–60% on H100 with well-tuned code
- **Excellent**: >60% (requires flash attention, fused kernels, large batch sizes)

**Limiters:**
1. **Memory bandwidth** (small batch sizes → memory-bound, not compute-bound)
2. **Communication overhead** (AllReduce stalls compute)
3. **Pipeline bubble** (GPU idle time in pipeline parallelism)
4. **Kernel inefficiency** (non-fused ops, non-tensor-core shapes)
5. **CPU bottleneck** (data loading, Python overhead)

MFU is the key metric for evaluating training infrastructure efficiency.`
        },
        {
          front: "Why is checkpointing critical at 10,000-GPU scale, and what are the trade-offs in checkpoint frequency?",
          back: `**At 10,000 GPUs**, individual component MTBF becomes the limiting factor. If each GPU has MTBF of 10,000 hours: expected cluster MTBF = 10,000 / 10,000 = **1 hour** between any failure.

Without checkpointing: every failure loses all training progress since the start.

**Checkpoint trade-offs:**

*Checkpoint too infrequently:* Risk of losing many hours of GPU-hours on failure. Re-computation cost is high.

*Checkpoint too frequently:* Writing 840 GB (70B model, ZeRO-3 state) to parallel storage takes time and I/O bandwidth. Frequent checkpoints reduce training throughput.

**Best practice:**
- Async checkpointing: write to local NVMe first (fast), then asynchronously copy to persistent storage
- Multi-level: frequent light checkpoints (activations only) + periodic full checkpoints
- Track step number: always checkpoint before long AllReduce steps that could time out`
        }
      ],
      quiz: [
        {
          question: "A data center runs H100 GPUs at 700W TDP each. A 2000-GPU cluster runs at 80% utilization. What is the approximate GPU power draw, and what cooling challenge does this create?",
          options: [
            "~700 kW — manageable with standard air cooling",
            "~1.12 MW — requires specialized air cooling with high CFM",
            "~1.12 MW GPU power; ~2–3 MW total DC power; requires direct liquid cooling",
            "~2.8 MW GPU power; liquid cooling optional"
          ],
          answer: 2,
          explanation: `**GPU power draw:** 2000 × 700 W × 0.80 = **1.12 MW** from GPUs alone.

**Total data center power** (PUE ~1.5–2.0 for GPU DCs): 1.12 MW × 1.8 ≈ **~2 MW total**.

**Cooling challenge:**
H100 SXM5 is designed for direct liquid cooling (DLC). Air cooling at 700W/GPU density requires:
- Extremely high airflow (CFM) — noisy, large CRAC units
- Hot aisle/cold aisle containment
- At >30 kW/rack density, air cooling becomes impractical

**DLC (Direct Liquid Cooling)** routes chilled water to cold plates on the GPU package, removing heat at the source. More efficient (PUE approaches 1.1), quieter, and enables higher rack density. DGX H100 requires DLC; retrofitting older air-cooled data centers requires significant civil work.`
        },
        {
          question: "Why is gang scheduling required for distributed training jobs, and how do Slurm and Kubernetes handle it differently?",
          answer: `## Why Gang Scheduling?

A distributed training job (e.g., 64-GPU PyTorch FSDP job) requires all 64 workers to be running simultaneously. They synchronize at every AllReduce step — if any worker is not running, all others block at the barrier indefinitely.

**Without gang scheduling:**
- Partial allocation (32/64 GPUs): 32 workers start, reach AllReduce, block forever
- 32 GPUs are occupied but make zero progress — complete waste

**Gang scheduling = atomic allocation**: the scheduler commits all 64 GPUs simultaneously or none.

## Slurm

Slurm gang scheduling is native:
- \`--nodes=8 --ntasks-per-node=8\` — request 64 processes atomically
- Slurm holds the job in the queue until all 64 GPU slots are available
- Backfill scheduling fills gaps with smaller jobs that complete before the big job starts

## Kubernetes

Kubernetes was designed for stateless, independently scalable pods — not atomic gang allocation. Extensions needed:

- **Volcano PodGroup**: declare that a group of pods must be co-scheduled; Volcano's gang scheduling plugin ensures all-or-nothing allocation
- **Kueue**: workload queuing with borrowing, preemption, and gang semantics
- **KAI Scheduler** (NVIDIA): production gang scheduler for Kubernetes AI clusters with topology awareness

**Operational difference:** Slurm gang scheduling is simpler and more mature for batch training; Kubernetes requires explicit tooling but integrates with cloud auto-scaling and microservice ecosystems.`
        },
        {
          question: "What is the NVIDIA DCGM and what role does it play in data-center GPU management?",
          options: [
            "DCGM is a training framework that optimizes CUDA kernel scheduling",
            "DCGM is a management library that provides GPU telemetry, health monitoring, diagnostics, and policy-based management at cluster scale",
            "DCGM is a storage driver for NVMe direct access from GPUs",
            "DCGM replaces Kubernetes for GPU scheduling"
          ],
          answer: 1,
          explanation: `**NVIDIA DCGM (Data Center GPU Manager)** is a management library and daemon for GPU clusters that provides:

**Telemetry:** Per-GPU metrics — utilization, memory, temperature, power draw, PCIe/NVLink throughput, error counts (ECC, Xid errors) — exposed via Prometheus exporter for Grafana dashboards.

**Health monitoring:** Continuous diagnostic tests (memory stress, compute stress, PCIe bandwidth) that run without interrupting user workloads.

**Error detection:** Xid error codes classify GPU faults (memory ECC correctable/uncorrectable, NVLink faults, GPU hang). DCGM can trigger alerts or auto-drain faulty nodes from the scheduler.

**MIG management:** Configure and monitor MIG partitions programmatically via DCGM API.

**Integration:** DCGM integrates with Kubernetes (NVIDIA GPU Operator includes DCGM exporter), Slurm (DCGM Slurm plugin), and cloud provider health management. Without DCGM or equivalent, operating a 1000+ GPU cluster reliably is extremely difficult.`
        }
      ]
    }
  ]
}
