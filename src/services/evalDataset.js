/**
 * Strategic Forensic Audit Test Suite V2
 * Includes expected failure patterns and fix types.
 */
module.exports = [
  // 1. Numeric Mismatch (Hard Check)
  { 
    claim: "Carbon footprint increased by exactly 88% this year.", 
    expected: "NOT_SUPPORTED",
    expectedFixType: "NUMERIC"
  },
  { 
    claim: "Total energy consumption dropped to zero in 2023.", 
    expected: "NOT_SUPPORTED",
    expectedFixType: "NUMERIC"
  },

  // 2. Missing Detail (Ambiguity Check)
  { 
    claim: "Things are going well with our green initiatives.", 
    expected: "PARTIALLY_SUPPORTED",
    expectedFixType: "MISSING_DETAIL"
  },
  { 
    claim: "Metrics were calculated using an unknown third-party system.", 
    expected: "PARTIALLY_SUPPORTED",
    expectedFixType: "MISSING_DETAIL"
  },

  // 3. Contradiction (Conflict Check)
  { 
    claim: "The company successfully increased its carbon footprint significantly.", 
    expected: "NOT_SUPPORTED",
    expectedFixType: "CONTRADICTION"
  },
  
  // 4. Absolute Language (Certainty Check)
  { 
    claim: "Our transition to renewable energy is now perfectly complete and guaranteed.", 
    expected: "PARTIALLY_SUPPORTED",
    expectedFixType: "MISSING_DETAIL"
  }
];
