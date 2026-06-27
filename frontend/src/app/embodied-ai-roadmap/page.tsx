'use client';

import { useState, useEffect } from 'react';
import {
  Compass,
  BookOpen,
  Cpu,
  CheckCircle2,
  Calendar,
  Flame,
  Clock,
  BookOpenCheck,
  ChevronRight,
  ChevronDown,
  ListTodo,
  X,
  Copy,
  Check,
  Award,
  Sparkles,
  GraduationCap,
  Info,
  Activity,
  Target,
  ArrowRight,
  TrendingUp,
  MessageSquare,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useTheme } from '@/common/contexts/ThemeContext';

interface Subtopic {
  id: string;
  text: string;
}

interface TopicDetail {
  id: string;
  title: string;
  importance: 'Critical' | 'Important' | 'Recommended';
  time: string;
  description: string;
  subtopics: Subtopic[];
  needToKnow: string[];
  whyItMatters: string;
}

interface Subject {
  id: string;
  name: string;
  icon: any;
  color: string;
  bgGradient: string;
  badgeColor: string;
  badgeText: string;
  description: string;
  topics: TopicDetail[];
}

const EMBODIED_AI_ROADMAP_DATA: Subject[] = [
  {
    id: 'maths',
    name: 'Mathematics',
    icon: GraduationCap,
    color: 'text-rose-500',
    bgGradient: 'from-rose-500/10 to-rose-500/[0.02] border-rose-500/20',
    badgeColor: 'bg-rose-500/15 text-rose-500 border border-rose-500/20',
    badgeText: 'Critical - Start Week 1',
    description: 'Linear Algebra, Probability Theory, and Multivariate Optimization form the math core of spatial control and optimization.',
    topics: [
      {
        id: 'maths_t1',
        title: 'Linear Algebra',
        importance: 'Critical',
        time: '4-6 hrs',
        description: 'Vectors, matrices, eigendecomposition, SVD, positive definite matrices. PMR uses all of these from week 1. ANLP uses vectors and dot products constantly.',
        subtopics: [
          { id: 'maths_s1_1', text: 'Vector operations, dot products, cross products, projections' },
          { id: 'maths_s1_2', text: 'Matrix multiplication, transposes, inverses, determinants' },
          { id: 'maths_s1_3', text: 'Eigenvalues, eigenvectors, eigendecomposition' },
          { id: 'maths_s1_4', text: 'Singular Value Decomposition (SVD) and Positive Definite Matrices' }
        ],
        needToKnow: [
          'Projections of a vector onto a subspace (crucial for optimization and coordinate frames)',
          'Geometric meaning of SVD (rotation, scaling, rotation: A = U Σ V^T)',
          'Matrix rank and vector spaces basis'
        ],
        whyItMatters: 'Neural network weights are matrices; training is a series of matrix operations. In robotics, forward and inverse kinematics rely on homogeneous transformation matrices.'
      },
      {
        id: 'maths_t2',
        title: 'Probability Theory & Bayesian Reasoning',
        importance: 'Critical',
        time: '6-8 hrs',
        description: "Bayes' theorem, conditional independence, marginalization, Gaussian distributions, entropy, KL divergence. PMR IS this subject — without it you're lost from week 1.",
        subtopics: [
          { id: 'maths_s2_1', text: "Bayes' Theorem and Conditional Probability" },
          { id: 'maths_s2_2', text: 'Joint distributions, marginalization, and independence' },
          { id: 'maths_s2_3', text: 'Continuous distributions (Multivariate Gaussian / normal distribution)' },
          { id: 'maths_s2_4', text: 'Information theory basics: Entropy, Cross-Entropy, KL Divergence' }
        ],
        needToKnow: [
          'How to marginalize joint distributions to isolate variables',
          'Mathematical representation of a multivariate Gaussian and its covariance matrix',
          'Calculating KL Divergence between two distributions'
        ],
        whyItMatters: 'Standard NLP, computer vision, and RL algorithms assume a solid grasp of probability. VAEs and Diffusion Models rely heavily on KL Divergence to match latent space distributions.'
      },
      {
        id: 'maths_t3',
        title: 'Multivariate Calculus & Optimisation',
        importance: 'Important',
        time: '3-4 hrs',
        description: 'Partial derivatives, Jacobians, chain rule for matrices. Gradient descent and its variants. PMR requires deriving EM, VI by hand. RL needs policy gradient derivations.',
        subtopics: [
          { id: 'maths_s3_1', text: 'Partial derivatives and gradient vectors (∇f)' },
          { id: 'maths_s3_2', text: 'Jacobian and Hessian matrices' },
          { id: 'maths_s3_3', text: 'Chain Rule for multivariable functions and matrix derivatives' },
          { id: 'maths_s3_4', text: 'Gradient Descent variations (SGD, Adam, RMSprop) and Convex Optimization' }
        ],
        needToKnow: [
          'Calculating the Jacobian matrix (first-order partial derivatives) of vector functions',
          'Calculating the Hessian matrix (second-order derivatives) for local curvature analysis',
          'Applying multivariable chain rule to matrix/vector functions'
        ],
        whyItMatters: 'Backpropagation is the Chain Rule for matrices. Optimization controls how models converge, and trajectory generation for robotic arms utilizes Jacobian matrices.'
      }
    ]
  },
  {
    id: 'ml_foundations',
    name: 'ML Foundations',
    icon: Target,
    color: 'text-blue-500',
    bgGradient: 'from-blue-500/10 to-blue-500/[0.02] border-blue-500/20',
    badgeColor: 'bg-blue-500/15 text-blue-500 border border-blue-500/20',
    badgeText: 'Essential Prerequisite',
    description: 'Classical baseline models, neural network primitives, training normalization, and standard backpropagation.',
    topics: [
      {
        id: 'ml_t1',
        title: 'Supervised & Unsupervised Learning',
        importance: 'Important',
        time: '5-7 hrs',
        description: 'Regression, Support Vector Machines (SVMs), Decision Trees, PCA for dimensionality compression, and K-Means/GMM clustering.',
        subtopics: [
          { id: 'ml_s1_1', text: 'Linear and Logistic Regression, loss functions' },
          { id: 'ml_s1_2', text: 'Support Vector Machines (SVMs) and Kernel methods' },
          { id: 'ml_s1_3', text: 'Decision Trees, Random Forests, Gradient Boosting' },
          { id: 'ml_s1_4', text: 'PCA and clustering (K-Means, Gaussian Mixture Models)' }
        ],
        needToKnow: [
          'Bias-variance tradeoff and regularization (L1/L2)',
          'How PCA projects data onto orthogonal directions of maximum variance',
          'Expectation-Maximization (EM) algorithm basics in GMMs'
        ],
        whyItMatters: 'Establishes baseline comparisons for neural networks. PCA is widely used for reducing high-dimensional sensor data before feeding into control policies.'
      },
      {
        id: 'ml_t2',
        title: 'Deep Learning Primitives',
        importance: 'Critical',
        time: '6-8 hrs',
        description: 'Multi-Layer Perceptrons, activation functions (ReLU, GELU, Tanh), loss functions, and optimization algorithms.',
        subtopics: [
          { id: 'ml_s2_1', text: 'Multi-Layer Perceptrons (MLPs) and weight initialization' },
          { id: 'ml_s2_2', text: 'Activation functions (ReLU, GELU, Sigmoid, Tanh)' },
          { id: 'ml_s2_3', text: 'Layer Normalization vs Batch Normalization' },
          { id: 'ml_s2_4', text: 'Learning rate schedules, weight decay, and dropout' }
        ],
        needToKnow: [
          'Why Layer Normalization is preferred over Batch Normalization in transformers',
          'How backpropagation mathematically flows through activation functions',
          'The vanishing and exploding gradient problem and how initialization helps'
        ],
        whyItMatters: 'All advanced deep learning architectures are composed of these fundamental modules.'
      }
    ]
  },
  {
    id: 'nlp_transformers',
    name: 'NLP & Transformers',
    icon: MessageSquare,
    color: 'text-purple-500',
    bgGradient: 'from-purple-500/10 to-purple-500/[0.02] border-purple-500/20',
    badgeColor: 'bg-purple-500/15 text-purple-500 border border-purple-500/20',
    badgeText: 'Core Architecture',
    description: 'Self-attention, Transformer blocks, pretraining, fine-tuning, RAG, and preference learning.',
    topics: [
      {
        id: 'nlp_t1',
        title: 'Attention & Scaled Dot Product',
        importance: 'Critical',
        time: '6-8 hrs',
        description: 'Understanding Query, Key, Value calculations and aggregate context mechanism.',
        subtopics: [
          { id: 'nlp_s1_1', text: 'Calculations of Queries, Keys, Values (Q, K, V)' },
          { id: 'nlp_s1_2', text: 'Scaled Dot-Product Attention: softmax(QK^T / sqrt(d_k))V' },
          { id: 'nlp_s1_3', text: 'Multi-Head Attention projections and heads concat' },
          { id: 'nlp_s1_4', text: 'Self-Attention vs Cross-Attention' }
        ],
        needToKnow: [
          'The scaling factor sqrt(d_k) role in preventing vanishing softmax gradients',
          'How Multi-Head Attention allows attending to information at different positions from different representation subspaces',
          'Computational complexity of self-attention (O(N^2))'
        ],
        whyItMatters: 'Attention is the engine of all modern large models, allowing coordinate-free context scaling.'
      },
      {
        id: 'nlp_t2',
        title: 'The Transformer & LLM Mechanics',
        importance: 'Critical',
        time: '8-10 hrs',
        description: 'Positional encodings, causal masking, SFT, RAG, and RLHF/DPO.',
        subtopics: [
          { id: 'nlp_s2_1', text: 'Positional Encodings (sinusoidal vs. RoPE)' },
          { id: 'nlp_s2_2', text: 'Decoder causal masking (preventing looking at future tokens)' },
          { id: 'nlp_s2_3', text: 'Supervised Fine-Tuning (SFT) and parameter-efficient tuning (LoRA)' },
          { id: 'nlp_s2_4', text: 'Retrieval-Augmented Generation (RAG) and Vector Databases' }
        ],
        needToKnow: [
          'How causal masks work in the decoder attention matrix',
          'The mechanics of LoRA (low-rank adaptation) for weight adjustments',
          'Embedding indexing and retrieval pipelines in vector spaces'
        ],
        whyItMatters: 'Foundation for building intelligent robot planners (e.g. SayCan, RT-2) and natural human-robot interaction speech interfaces.'
      }
    ]
  },
  {
    id: 'cv',
    name: 'Computer Vision',
    icon: BookOpen,
    color: 'text-teal-500',
    bgGradient: 'from-teal-500/10 to-teal-500/[0.02] border-teal-500/20',
    badgeColor: 'bg-teal-500/15 text-teal-500 border border-teal-500/20',
    badgeText: 'Perceptual Intelligence',
    description: 'Pinhole camera geometry, object detection, semantic segmentation, Vision Transformers (ViT), and CLIP.',
    topics: [
      {
        id: 'cv_t1',
        title: 'Geometric Vision & Calibration',
        importance: 'Important',
        time: '5-7 hrs',
        description: 'Camera models, intrinsic/extrinsic parameters, and coordinate transformations.',
        subtopics: [
          { id: 'cv_s1_1', text: 'Pinhole camera model and camera calibration' },
          { id: 'cv_s1_2', text: 'Intrinsic (K) and Extrinsic [R|t] camera matrices' },
          { id: 'cv_s1_3', text: 'Coordinate transforms: World -> Camera -> Pixel space' },
          { id: 'cv_s1_4', text: 'Homography, Epipolar Geometry, and depth triangulation' }
        ],
        needToKnow: [
          'How to convert 3D coordinates to 2D pixel coordinates using intrinsic and extrinsic camera matrices',
          'Homogeneous coordinates utility in projective space',
          'Epipolar line constraint and its role in stereo matching'
        ],
        whyItMatters: 'Essential to map pixel inputs back to physical 3D locations for robotic grasping, navigation, and obstacle avoidance.'
      },
      {
        id: 'cv_t2',
        title: 'Deep Spatial Perception',
        importance: 'Critical',
        time: '7-9 hrs',
        description: 'Convolutions, object detection (YOLO), semantic segmentation, ViT, and CLIP.',
        subtopics: [
          { id: 'cv_s2_1', text: 'Convolutional Neural Networks (CNNs) and ResNet skip-connections' },
          { id: 'cv_s2_2', text: 'Object detection (YOLO, Faster R-CNN) and instance segmentation' },
          { id: 'cv_s2_3', text: 'Vision Transformers (ViT) patch projections and attention' },
          { id: 'cv_s2_4', text: 'Multimodal vision-language models (CLIP)' }
        ],
        needToKnow: [
          'How CLIP aligns images and text into a shared embedding space using contrastive loss',
          'ViT patch projection: splitting images into patches and linear projection to tokens',
          'Difference between semantic, instance, and panoptic segmentation'
        ],
        whyItMatters: 'Allows the robot to recognize objects in its environment, detect obstacles, and parse verbal instructions using aligned text-image models.'
      }
    ]
  },
  {
    id: 'rl_control',
    name: 'RL & Control',
    icon: Compass,
    color: 'text-yellow-500',
    bgGradient: 'from-yellow-500/10 to-yellow-500/[0.02] border-yellow-500/20',
    badgeColor: 'bg-yellow-500/15 text-yellow-500 border border-yellow-500/20',
    badgeText: 'Decision & Execution',
    description: 'Markov Decision Processes, deep reinforcement learning, PID feedback, and Model Predictive Control.',
    topics: [
      {
        id: 'rl_t1',
        title: 'Reinforcement Learning',
        importance: 'Critical',
        time: '8-10 hrs',
        description: 'MDPs, Q-Learning, Policy Gradients, Actor-Critic models, and continuous control.',
        subtopics: [
          { id: 'rl_s1_1', text: 'Markov Decision Processes (MDPs): States, Actions, Rewards, Transitions' },
          { id: 'rl_s1_2', text: 'Bellman optimality updates and Q-learning' },
          { id: 'rl_s1_3', text: 'Policy Gradient methods (REINFORCE) and Actor-Critic (SAC, PPO)' },
          { id: 'rl_s1_4', text: 'Continuous action spaces control in RL' }
        ],
        needToKnow: [
          'Mathematical formulation of the Bellman Optimality Equation',
          'Policy gradient theorem and why clipping updates in PPO stabilizes training',
          'Entropy regularization role in Soft Actor-Critic (SAC)'
        ],
        whyItMatters: 'Allows training complex locomotion (quadrupeds) and dexterous hand manipulation without writing explicit physics-based rules.'
      },
      {
        id: 'rl_t2',
        title: 'Classical Control & State Tracking',
        importance: 'Important',
        time: '6-8 hrs',
        description: 'PID controllers, Model Predictive Control (MPC), LQR, Kalman Filters, and state estimation.',
        subtopics: [
          { id: 'rl_s2_1', text: 'PID Control: tuning Proportional, Integral, and Derivative gains' },
          { id: 'rl_s2_2', text: 'Model Predictive Control (MPC) and Linear Quadratic Regulator (LQR)' },
          { id: 'rl_s2_3', text: 'Kalman Filters and Extended Kalman Filters (EKF) state estimation' },
          { id: 'rl_s2_4', text: 'Trajectory generation and tracking control' }
        ],
        needToKnow: [
          'How PID feedback loops correct errors between target states and actual states',
          'The MPC optimization horizon and cost function configuration',
          'Kalman Filter prediction (motion model) and update (sensor model) equations'
        ],
        whyItMatters: 'Converts neural network high-level outputs into stable physical joint torques and filters out sensor noise.'
      }
    ]
  },
  {
    id: 'ml_systems',
    name: 'ML Systems',
    icon: Cpu,
    color: 'text-slate-500',
    bgGradient: 'from-slate-500/10 to-slate-500/[0.02] border-slate-500/20',
    badgeColor: 'bg-slate-500/15 text-slate-500 border border-slate-500/20',
    badgeText: 'Scale & Edge Deploy',
    description: 'Distributed model training, FP16/BF16 precision, model quantization, and TensorRT compilation.',
    topics: [
      {
        id: 'sys_t1',
        title: 'Distributed Scaling',
        importance: 'Important',
        time: '6-8 hrs',
        description: 'DDP, Model Parallelism, ZeRO memory optimization, and mixed-precision.',
        subtopics: [
          { id: 'sys_s1_1', text: 'Distributed Data Parallelism (DDP) gradient synchronization' },
          { id: 'sys_s1_2', text: 'Model Parallelism and Pipeline Parallelism boundaries' },
          { id: 'sys_s1_3', text: 'ZeRO (Zero Redundancy Optimizer) memory state partitioning' },
          { id: 'sys_s1_4', text: 'Mixed-precision training (FP16, BF16) and gradient scaling' }
        ],
        needToKnow: [
          "DDP's ring-allreduce communication pattern",
          'The difference between FP16 and BF16 regarding exponent size and dynamic range',
          'How ZeRO divides optimizer states, gradients, and model parameters'
        ],
        whyItMatters: 'Vital for training massive vision-language policies across multiple GPUs without running out of memory.'
      },
      {
        id: 'sys_t2',
        title: 'Edge Inference & Compilation',
        importance: 'Critical',
        time: '7-9 hrs',
        description: 'TensorRT compilation, ONNX runtimes, Model quantization (INT8/FP16), and edge hardware setups.',
        subtopics: [
          { id: 'sys_s2_1', text: 'Model compilation (TVM, TensorRT, TorchScript)' },
          { id: 'sys_s2_2', text: 'Post-Training Quantization (PTQ) vs Quantization-Aware Training (QAT)' },
          { id: 'sys_s2_3', text: 'ONNX runtime graph optimization and export' },
          { id: 'sys_s2_4', text: 'Edge computing setups: NVIDIA Jetson, Edge TPUs' }
        ],
        needToKnow: [
          'How PTQ maps float32 ranges to int8 weights and activations',
          'TensorRT layer fusion and kernel auto-tuning for specific GPU models',
          'Quantization scaling factors and zero-point calibration'
        ],
        whyItMatters: 'Embedded robotic computers require real-time model execution (e.g. 100Hz+) under severe power and cooling budgets.'
      }
    ]
  },
  {
    id: 'robotics',
    name: 'Robotics / ROS2',
    icon: Activity,
    color: 'text-orange-500',
    bgGradient: 'from-orange-500/10 to-orange-500/[0.02] border-orange-500/20',
    badgeColor: 'bg-orange-500/15 text-orange-500 border border-orange-500/20',
    badgeText: 'Physical Integration',
    description: 'Joint kinematics, Homogeneous transforms, ROS2 middleware nodes, and Isaac Sim physics simulation.',
    topics: [
      {
        id: 'rob_t1',
        title: 'Robot Kinematics & Mechanics',
        importance: 'Critical',
        time: '7-9 hrs',
        description: 'Forward/Inverse Kinematics, Denavit-Hartenberg (DH) parameters, and velocity Jacobians.',
        subtopics: [
          { id: 'rob_s1_1', text: 'Coordinate frames, rotation matrices, and quaternions' },
          { id: 'rob_s1_2', text: 'Homogeneous transformations: translation and orientation matrices' },
          { id: 'rob_s1_3', text: 'Forward Kinematics (FK) and Analytical/Numerical Inverse Kinematics (IK)' },
          { id: 'rob_s1_4', text: 'Velocity Jacobian: mapping joint velocities to end-effector velocities' }
        ],
        needToKnow: [
          'Homogeneous transformation matrix structure: 4x4 matrix combining 3x3 rotation and 3x1 translation',
          'Denavit-Hartenberg parameters definition (link length, link twist, link offset, joint angle)',
          'Kinematic singularities where the Jacobian loses rank'
        ],
        whyItMatters: 'Moving a robotic arm\'s gripper to a coordinate in space requires solving IK to find the correct motor angles.'
      },
      {
        id: 'rob_t2',
        title: 'ROS2 Middleware & Simulation',
        importance: 'Critical',
        time: '8-10 hrs',
        description: 'Nodes, topics, actions, launch configurations, and Isaac Sim/Gazebo simulators.',
        subtopics: [
          { id: 'rob_s2_1', text: 'ROS2 Node plumbing: Publishers, Subscribers, Services, Actions' },
          { id: 'rob_s2_2', text: 'Coordinate frames transforms using the tf2 library' },
          { id: 'rob_s2_3', text: 'ROS2 Launch configurations, workspaces, and colcon builds' },
          { id: 'rob_s2_4', text: 'Physics Simulators: Gazebo, Isaac Sim (Omniverse)' }
        ],
        needToKnow: [
          'The difference between ROS2 Topics (continuous streaming data) and ROS2 Actions (long-running, preemptable goals)',
          'How tf2 publishes coordinate frames transform trees dynamically',
          'Building and sourcing custom ROS2 workspaces'
        ],
        whyItMatters: 'ROS2 is the plumbing of a robot. Sensors publish camera streams/LIDAR on topics; controllers subscribe to these to compute joint actions.'
      }
    ]
  }
];

const WEEKLY_14_PLAN = [
  { week: 'Weeks 1-2', subject: 'Mathematics', goal: 'Establish Linear Algebra, Gaussians & gradients.', project: 'Derive basic backpropagation and simple linear regression models by hand.' },
  { week: 'Weeks 3-4', subject: 'ML Foundations', goal: 'Master Multi-Layer Perceptrons and normalization.', project: 'Implement a full neural network framework with custom layers using only NumPy.' },
  { week: 'Weeks 5-6', subject: 'NLP & Transformers', goal: 'Build self-attention math and causal masking.', project: 'Write a decoder-only miniature Transformer block from scratch in PyTorch.' },
  { week: 'Weeks 7-8', subject: 'Computer Vision', goal: 'Understand camera projection matrices and ViT/CLIP.', project: 'Calibrate a camera matrix and write a classifier using CLIP embeddings.' },
  { week: 'Weeks 9-10', subject: 'RL & Control', goal: 'Apply Q-learning, PPO, PID loops, and Kalman filters.', project: 'Train a reinforcement learning agent to balance a cartpole in Gym/PyBullet.' },
  { week: 'Weeks 11-12', subject: 'Robotics / ROS2', goal: 'Deploy ROS2 workspaces, topics, actions, and FK/IK.', project: 'Create a ROS2 controller node to drive a robotic gripper inside Gazebo.' },
  { week: 'Weeks 13-14', subject: 'ML Systems', goal: 'Distributed DDP training, quantization, TensorRT.', project: 'Quantize a vision model to INT8, compile to ONNX, and run benchmarks.' }
];

export default function EmbodiedAIRoadmap() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<string>('maths');
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});
  const [checkedSubtopics, setCheckedSubtopics] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    const savedChecks = localStorage.getItem('evosan_embodied_checked_subtopics');
    if (savedChecks) {
      setCheckedSubtopics(JSON.parse(savedChecks));
    }
    // Expand the first topic of the default tab automatically
    const defaultSubject = EMBODIED_AI_ROADMAP_DATA.find((s) => s.id === 'maths');
    if (defaultSubject && defaultSubject.topics.length > 0) {
      setExpandedTopics({ [defaultSubject.topics[0].id]: true });
    }
    setMounted(true);
  }, []);

  const toggleSubtopic = (id: string) => {
    const updated = { ...checkedSubtopics, [id]: !checkedSubtopics[id] };
    setCheckedSubtopics(updated);
    localStorage.setItem('evosan_embodied_checked_subtopics', JSON.stringify(updated));
    if (updated[id]) {
      toast.success('Subtopic mastered! Keep progressing 🚀');
    }
  };

  const toggleTopicExpand = (id: string) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const activeSubject = EMBODIED_AI_ROADMAP_DATA.find((s) => s.id === activeTab);

  // Overall calculations
  const totalSubtopicsCount = EMBODIED_AI_ROADMAP_DATA.flatMap((s) => s.topics.flatMap((t) => t.subtopics)).length;
  const completedSubtopicsCount = Object.keys(checkedSubtopics).filter((k) => checkedSubtopics[k]).length;
  const overallPercentage = totalSubtopicsCount > 0 ? Math.round((completedSubtopicsCount / totalSubtopicsCount) * 100) : 0;

  // Active Subject calculations
  const activeSubjectSubtopics = activeSubject ? activeSubject.topics.flatMap((t) => t.subtopics) : [];
  const activeSubjectCompletedCount = activeSubjectSubtopics.filter((sub) => checkedSubtopics[sub.id]).length;
  const activeSubjectPercentage = activeSubjectSubtopics.length > 0 ? Math.round((activeSubjectCompletedCount / activeSubjectSubtopics.length) * 100) : 0;

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 md:px-8 py-6 max-w-[1600px] mx-auto animate-in fade-in duration-300">
      
      {/* HEADER BLOCK */}
      <div className="relative overflow-hidden bg-card/30 p-6 rounded-2xl border border-border/40 backdrop-blur-md">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-rose-500 mb-1.5">
              <Award size={18} className="animate-pulse" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary">
                Advanced Curriculum
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
              Embodied AI & Robotics Syllabus
            </h1>
            <p className="text-muted-foreground text-xs md:text-sm max-w-2xl mt-1">
              Step-by-step master study guide covering mathematical rigor, deep vision, sequence transformers, reinforcement control loops, ROS2 integration, and optimized system deployments.
            </p>
          </div>

          {/* Master Progress Indicator */}
          <div className="flex items-center gap-4 bg-card/80 p-4 rounded-xl border border-border/80 shadow-md">
            <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0">
              <svg className="absolute w-full h-full transform -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  className="text-muted/20"
                  strokeWidth="3"
                  fill="transparent"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  className="text-primary transition-all duration-700"
                  strokeWidth="3.5"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 20}
                  strokeDashoffset={2 * Math.PI * 20 * (1 - overallPercentage / 100)}
                />
              </svg>
              <span className="text-[11px] font-mono font-extrabold text-foreground">
                {overallPercentage}%
              </span>
            </div>
            <div>
              <span className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground block">
                Total Syllabus Progress
              </span>
              <span className="text-sm font-extrabold text-foreground block">
                {completedSubtopicsCount} of {totalSubtopicsCount} Skills Mastered
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SKEUOMORPHIC NAVIGATION TABS */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-border/40">
        {EMBODIED_AI_ROADMAP_DATA.map((subject) => {
          const isActive = activeTab === subject.id;
          const SubIcon = subject.icon;
          const subjectSubtopicsList = subject.topics.flatMap((t) => t.subtopics);
          const subjectCompleted = subjectSubtopicsList.filter((s) => checkedSubtopics[s.id]).length;
          const subjectPct = subjectSubtopicsList.length > 0 ? Math.round((subjectCompleted / subjectSubtopicsList.length) * 100) : 0;

          return (
            <button
              key={subject.id}
              onClick={() => setActiveTab(subject.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold transition-all relative ${
                isActive
                  ? 'btn-plush-base btn-plush-blue text-sky-950 dark:text-sky-100 shadow-md border border-sky-400/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-xl border border-transparent'
              }`}
            >
              <SubIcon size={14} className={isActive ? 'text-sky-600 dark:text-sky-300' : 'text-muted-foreground'} />
              <span>{subject.name}</span>
              
              {/* Micro badge showing completed percentage inside active tab */}
              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                isActive ? 'bg-sky-500/20 text-sky-850 dark:text-sky-200' : 'bg-muted text-muted-foreground'
              }`}>
                {subjectPct}%
              </span>
            </button>
          );
        })}
        <button
          onClick={() => setActiveTab('study-plan')}
          className={`flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold transition-all relative ${
            activeTab === 'study-plan'
              ? 'btn-plush-base btn-plush-blue text-sky-950 dark:text-sky-100 shadow-md border border-sky-400/20'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-xl border border-transparent'
          }`}
        >
          <Calendar size={14} className={activeTab === 'study-plan' ? 'text-sky-600 dark:text-sky-300' : 'text-muted-foreground'} />
          <span>14-Week Plan</span>
        </button>
      </div>

      {/* MAIN VIEW FOR SUBJECTS */}
      {activeTab !== 'study-plan' && activeSubject && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* LEFT CONTAINER (Syllabus Cards & Accordions) */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Subject Overview Card */}
            <div className={`p-5 rounded-2xl border bg-gradient-to-b ${activeSubject.bgGradient} space-y-3 shadow-sm`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border bg-card ${activeSubject.color}`}>
                    <activeSubject.icon size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">
                      {activeSubject.name} Curriculum
                    </h2>
                    <span className="text-[10px] text-muted-foreground block">
                      Targeted mathematical rigor and practical execution details.
                    </span>
                  </div>
                </div>
                
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase font-mono tracking-wider ${activeSubject.badgeColor}`}>
                  {activeSubject.badgeText}
                </span>
              </div>
              
              <p className="text-xs md:text-sm text-foreground/80 leading-relaxed font-medium">
                {activeSubject.description}
              </p>

              {/* Progress bar for this subject */}
              <div className="pt-2 border-t border-border/30 flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-[10px] font-bold text-muted-foreground mb-1">
                    <span>Subject Progress</span>
                    <span>{activeSubjectCompletedCount} of {activeSubjectSubtopics.length} Mastered</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full transition-all duration-700"
                      style={{ width: `${activeSubjectPercentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-extrabold text-foreground font-mono">{activeSubjectPercentage}%</span>
                </div>
              </div>
            </div>

            {/* List of Topics */}
            <div className="space-y-4">
              {activeSubject.topics.map((topic) => {
                const isExpanded = !!expandedTopics[topic.id];
                const topicSubCount = topic.subtopics.length;
                const topicCompleted = topic.subtopics.filter((s) => checkedSubtopics[s.id]).length;
                const topicPct = topicSubCount > 0 ? Math.round((topicCompleted / topicSubCount) * 100) : 0;

                return (
                  <div
                    key={topic.id}
                    className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                      isExpanded
                        ? 'bg-card border-border/80 shadow-md'
                        : 'bg-card/45 border-border/40 hover:border-border/80'
                    }`}
                  >
                    
                    {/* Header bar of topic */}
                    <div
                      onClick={() => toggleTopicExpand(topic.id)}
                      className="p-4 flex items-center justify-between gap-3 cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-3">
                        {/* Red/Orange vertical accent bar */}
                        <div className={`w-1 h-8 rounded-full ${
                          topic.importance === 'Critical' ? 'bg-rose-500' : topic.importance === 'Important' ? 'bg-yellow-500' : 'bg-slate-400'
                        }`} />
                        <div>
                          <h3 className="text-xs md:text-sm font-extrabold text-foreground flex items-center gap-2">
                            {topic.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                              topic.importance === 'Critical' ? 'bg-rose-500/10 text-rose-500' : 'bg-yellow-500/10 text-yellow-500'
                            }`}>
                              {topic.importance}
                            </span>
                            <span className="text-[9px] text-muted-foreground flex items-center gap-1">
                              <Clock size={10} />
                              {topic.time}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded">
                          {topicCompleted}/{topicSubCount} Mastered ({topicPct}%)
                        </span>
                        {isExpanded ? <ChevronDown size={16} className="text-muted-foreground" /> : <ChevronRight size={16} className="text-muted-foreground" />}
                      </div>
                    </div>

                    {/* Expandable Area */}
                    {isExpanded && (
                      <div className="p-4 pt-0 border-t border-border/40 bg-muted/15 space-y-4 animate-in slide-in-from-top-1 duration-200">
                        
                        {/* Topic Description */}
                        <p className="text-xs leading-relaxed text-muted-foreground mt-3 italic">
                          "{topic.description}"
                        </p>

                        {/* Interactive Subtopic Checklist */}
                        <div className="space-y-2">
                          <span className="text-[9px] uppercase font-mono font-bold text-primary tracking-wider block">
                            Subtopic Mastery Tracker
                          </span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {topic.subtopics.map((sub) => {
                              const isChecked = !!checkedSubtopics[sub.id];
                              return (
                                <div
                                  key={sub.id}
                                  onClick={() => toggleSubtopic(sub.id)}
                                  className={`flex items-start gap-2.5 p-3 rounded-lg border transition-all duration-300 cursor-pointer ${
                                    isChecked
                                      ? 'bg-primary/[0.02] border-primary/20 text-muted-foreground'
                                      : 'bg-card border-border/50 hover:border-primary/20 hover:bg-card'
                                  }`}
                                >
                                  <div className={`mt-0.5 flex-shrink-0 ${isChecked ? 'text-primary' : 'text-muted-foreground'}`}>
                                    <CheckCircle2
                                      size={14}
                                      fill={isChecked ? 'currentColor' : 'none'}
                                    />
                                  </div>
                                  <span className={`text-[11px] font-semibold leading-relaxed ${isChecked ? 'line-through text-muted-foreground/60' : 'text-foreground'}`}>
                                    {sub.text}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Need To Know & Why It Matters blocks */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                          
                          {/* Need To Know */}
                          <div className="bg-card p-3 rounded-xl border border-border/60 space-y-2 shadow-sm">
                            <span className="text-[9px] font-mono font-extrabold uppercase text-rose-500 tracking-wider flex items-center gap-1">
                              <Info size={11} /> Need To Know
                            </span>
                            <ul className="space-y-1.5 pl-1">
                              {topic.needToKnow.map((item, idx) => (
                                <li key={idx} className="text-[10px] text-foreground leading-relaxed flex items-start gap-1.5">
                                  <span className="w-1 h-1 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Why It Matters */}
                          <div className="bg-card p-3 rounded-xl border border-border/60 space-y-2 shadow-sm">
                            <span className="text-[9px] font-mono font-extrabold uppercase text-secondary tracking-wider flex items-center gap-1">
                              <Flame size={11} /> Why It Matters
                            </span>
                            <p className="text-[10px] text-muted-foreground leading-relaxed">
                              {topic.whyItMatters}
                            </p>
                          </div>

                        </div>

                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

          {/* RIGHT CONTAINER (Study Advice & Quick Tips) */}
          <div className="space-y-6">
            
            {/* Skeuomorphic HUD Metrics card */}
            <div className="bg-card rounded-2xl p-5 border border-border/60 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border/40 pb-2">
                <Sparkles size={14} className="text-primary" />
                Study Guidelines
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/40 border border-border/60">
                  <div className="w-6 h-6 rounded-full bg-rose-500/10 flex items-center justify-center flex-shrink-0 text-rose-500 text-[10px] font-bold">1</div>
                  <div>
                    <h4 className="text-[11px] font-bold text-foreground">Write Proofs by Hand</h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
                      Do not skip matrix derivations or probability formulas. Pen-and-paper workouts create permanent mental models.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/40 border border-border/60">
                  <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 text-blue-500 text-[10px] font-bold">2</div>
                  <div>
                    <h4 className="text-[11px] font-bold text-foreground">Connect Math to Code</h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
                      Whenever you learn an equation (like attention or LQR cost), immediately write a quick Python function implementing it.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/40 border border-border/60">
                  <div className="w-6 h-6 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0 text-purple-500 text-[10px] font-bold">3</div>
                  <div>
                    <h4 className="text-[11px] font-bold text-foreground">Test in Simulation First</h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
                      Before trying complex control laws or ROS2 pipelines on actual machines, validate the constraints in Gazebo or Isaac Sim.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* MLOps Integration Card */}
            <div className="bg-card rounded-2xl p-5 border border-border/60 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <Cpu size={16} className="text-secondary" />
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Real-time Benchmarking
                </h3>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Embodied AI is constrained by milliseconds. Quantization (INT8) is not a feature addition; it is a necessity for keeping edge controllers responsive during localized runs.
              </p>
              <div className="bg-muted/40 p-2.5 rounded-lg border border-border/60 text-[9px] font-mono leading-relaxed text-foreground/80 flex flex-col gap-1">
                <span>// Expected latency benchmarks:</span>
                <span>- FP32 PyTorch Model: 42ms (23 FPS)</span>
                <span>- INT8 TensorRT Compiled: 4.8ms (208 FPS)</span>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 14-WEEK STUDY PLAN VIEW */}
      {activeTab === 'study-plan' && (
        <div className="bg-card rounded-2xl p-6 border border-border/60 shadow-sm space-y-6 animate-in fade-in duration-300">
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Calendar size={18} className="text-primary" />
              14-Week Accelerated Study Blueprint
            </h2>
            <p className="text-muted-foreground text-xs mt-0.5">
              Structured time allocation with specific projects to build a robust portfolio in Embodied AI.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground font-semibold">
                  <th className="py-3 px-4 w-28">Timeline</th>
                  <th className="py-3 px-4 w-40">Subject Area</th>
                  <th className="py-3 px-4">Core Objective</th>
                  <th className="py-3 px-4">Hands-on Project Milestone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-medium">
                {WEEKLY_14_PLAN.map((item, idx) => (
                  <tr key={idx} className="hover:bg-muted/10 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-primary">{item.week}</td>
                    <td className="py-4 px-4 text-foreground">{item.subject}</td>
                    <td className="py-4 px-4 text-muted-foreground leading-relaxed">{item.goal}</td>
                    <td className="py-4 px-4 text-foreground/90">
                      <div className="flex items-center gap-2">
                        <ArrowRight size={13} className="text-secondary flex-shrink-0" />
                        <span>{item.project}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-muted/20 p-4 rounded-xl border border-border/60 flex items-start gap-3">
            <Info size={16} className="text-primary mt-0.5 flex-shrink-0" />
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              <strong>Execution Tip:</strong> Commit to <strong>10-12 hours per week</strong>. Dedicate 2 hours each weekday evening for reading theory and deriving math, and block a 4-hour chunk on weekends for coding implementation and debugging ROS2 nodes in Gazebo.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
