/**
 * AWARD CATEGORY KNOWLEDGE BASE
 * Defined by semantic intent and expected evidence types.
 */

module.exports = [
  {
    id: "CAT_SUSTAINABILITY_LEADER",
    name: "Sustainability Leader of the Year",
    intent: "Companies demonstrating massive carbon reduction, renewable energy transition, and waste management excellence.",
    expectedEvidence: ["emissions", "carbon", "renewable", "waste"],
    weight: 1.2
  },
  {
    id: "CAT_OPERATIONAL_EXCELLENCE",
    name: "Operational Excellence Award",
    intent: "Highly efficient processes, utilization improvements, cost savings, and resource optimization.",
    expectedEvidence: ["efficiency", "utilization", "optimization", "cost"],
    weight: 1.0
  },
  {
    id: "CAT_INNOVATION_TECH",
    name: "Most Innovative Tech Deployment",
    intent: "Novel software, AI, hardware, or process innovation that provides a unique market advantage.",
    expectedEvidence: ["innovation", "proprietary", "ai", "hardware"],
    weight: 0.9
  },
  {
    id: "CAT_CUSTOMER_SUCCESS",
    name: "Customer Success Transformation",
    intent: "High customer satisfaction scores, net promoter improvement, and successful client outcomes.",
    expectedEvidence: ["satisfaction", "nps", "retention", "success"],
    weight: 0.8
  }
];
