/**
 * DVMReady - Veterinary Drug Formulary Database
 * Comprehensive drug data for dose calculations
 * Target: 300+ medications
 */

const VeterinaryDrugFormulary = {
  // Analgesics / NSAIDs
  analgesics: [
    {
      name: "Carprofen",
      brandNames: ["Rimadyl", "Vetprofen", "Carprieve"],
      category: "NSAID",
      species: {
        dog: {
          doseRange: { min: 2, max: 4 },
          unit: "mg/kg",
          frequency: "every 12-24 hours",
          route: ["PO", "SC", "IV"],
          maxDailyDose: 4,
          notes: "Do not exceed 4 mg/kg/day"
        },
        cat: {
          doseRange: { min: 2, max: 4 },
          unit: "mg/kg",
          frequency: "every 24 hours (short-term only)",
          route: ["SC", "IV"],
          maxDailyDose: 4,
          notes: "Cats: 3-day limit for injectable"
        }
      },
      formulations: [
        { concentration: 25, unit: "mg/tablet" },
        { concentration: 75, unit: "mg/tablet" },
        { concentration: 100, unit: "mg/tablet" },
        { concentration: 50, unit: "mg/mL (injection)" }
      ],
      contraindications: ["Dehydration", "Renal disease", "GI ulceration", "Concurrent steroids"],
      sideEffects: ["GI upset", "Hepatotoxicity (rare)", "Renal impairment"]
    },
    {
      name: "Meloxicam",
      brandNames: ["Metacam", "Loxicom", "Meloxidyl"],
      category: "NSAID",
      species: {
        dog: {
          doseRange: { min: 0.1, max: 0.2 },
          unit: "mg/kg",
          frequency: "every 24 hours",
          route: ["PO", "SC", "IV"],
          maxDailyDose: 0.3,
          notes: "Start at 0.2 mg/kg PO on day 1, then 0.1 mg/kg"
        },
        cat: {
          doseRange: { min: 0.05, max: 0.1 },
          unit: "mg/kg",
          frequency: "every 24 hours (short-term)",
          route: ["SC"],
          maxDailyDose: 0.1,
          notes: "Cats: single dose or 3-day max"
        }
      },
      formulations: [
        { concentration: 0.5, unit: "mg/mL (oral suspension)" },
        { concentration: 5, unit: "mg/mL (injection)" },
        { concentration: 7.5, unit: "mg/tablet" },
        { concentration: 15, unit: "mg/tablet" }
      ],
      contraindications: ["Dehydration", "Renal disease", "GI ulceration"],
      sideEffects: ["GI upset", "Renal impairment"]
    },
    {
      name: "Tramadol",
      brandNames: ["Ultram", "generic"],
      category: "Opioid-like analgesic",
      species: {
        dog: {
          doseRange: { min: 2, max: 5 },
          unit: "mg/kg",
          frequency: "every 8-12 hours",
          route: ["PO"],
          notes: "Can cause sedation"
        },
        cat: {
          doseRange: { min: 2, max: 4 },
          unit: "mg/kg",
          frequency: "every 8-12 hours",
          route: ["PO"],
          notes: "Bitter taste - may need compounding"
        }
      },
      formulations: [
        { concentration: 50, unit: "mg/tablet" }
      ],
      contraindications: ["Seizure disorders", "MAO inhibitors"],
      sideEffects: ["Sedation", "Vomiting", "Ataxia"]
    }
  ],

  // Antibiotics
  antibiotics: [
    {
      name: "Amoxicillin",
      brandNames: ["Amoxi-Tabs", "generic"],
      category: "Antibiotic - Penicillin",
      species: {
        dog: {
          doseRange: { min: 10, max: 20 },
          unit: "mg/kg",
          frequency: "every 8-12 hours",
          route: ["PO"],
          notes: "Gram-positive coverage"
        },
        cat: {
          doseRange: { min: 10, max: 20 },
          unit: "mg/kg",
          frequency: "every 8-12 hours",
          route: ["PO"]
        }
      },
      formulations: [
        { concentration: 50, unit: "mg/tablet" },
        { concentration: 100, unit: "mg/tablet" },
        { concentration: 200, unit: "mg/tablet" },
        { concentration: 400, unit: "mg/tablet" },
        { concentration: 50, unit: "mg/mL (suspension)" }
      ],
      contraindications: ["Penicillin allergy"],
      sideEffects: ["GI upset", "Diarrhea"]
    },
    {
      name: "Amoxicillin-Clavulanate",
      brandNames: ["Clavamox", "Augmentin"],
      category: "Antibiotic - Penicillin/Beta-lactamase inhibitor",
      species: {
        dog: {
          doseRange: { min: 12.5, max: 25 },
          unit: "mg/kg",
          frequency: "every 12 hours",
          route: ["PO"],
          notes: "Broad spectrum - skin/soft tissue infections"
        },
        cat: {
          doseRange: { min: 12.5, max: 25 },
          unit: "mg/kg",
          frequency: "every 12 hours",
          route: ["PO"],
          notes: "Most common antibiotic for cats"
        }
      },
      formulations: [
        { concentration: "62.5", unit: "mg/tablet" },
        { concentration: "125", unit: "mg/tablet" },
        { concentration: "250", unit: "mg/tablet" },
        { concentration: "375", unit: "mg/tablet" },
        { concentration: "62.5", unit: "mg/mL (suspension)" }
      ],
      contraindications: ["Penicillin allergy", "Rabbits (fatal enteritis)"],
      sideEffects: ["GI upset", "Diarrhea"]
    },
    {
      name: "Cephalexin",
      brandNames: ["Keflex", "Rilexine"],
      category: "Antibiotic - Cephalosporin (1st gen)",
      species: {
        dog: {
          doseRange: { min: 10, max: 30 },
          unit: "mg/kg",
          frequency: "every 8-12 hours",
          route: ["PO"],
          notes: "Good for skin infections"
        },
        cat: {
          doseRange: { min: 10, max: 30 },
          unit: "mg/kg",
          frequency: "every 12 hours",
          route: ["PO"]
        }
      },
      formulations: [
        { concentration: 250, unit: "mg/tablet" },
        { concentration: 500, unit: "mg/tablet" },
        { concentration: 750, unit: "mg/tablet" }
      ],
      contraindications: ["Cephalosporin allergy"],
      sideEffects: ["GI upset", "Diarrhea"]
    },
    {
      name: "Enrofloxacin",
      brandNames: ["Baytril"],
      category: "Antibiotic - Fluoroquinolone",
      species: {
        dog: {
          doseRange: { min: 5, max: 20 },
          unit: "mg/kg",
          frequency: "every 24 hours",
          route: ["PO", "SC", "IV"],
          notes: "Good for deep infections, resistant bacteria"
        },
        cat: {
          doseRange: { min: 5, max: 5 },
          unit: "mg/kg",
          frequency: "every 24 hours",
          route: ["PO", "SC", "IV"],
          notes: "Cats: 5 mg/kg max (retinal toxicity at higher doses)"
        }
      },
      formulations: [
        { concentration: 22.7, unit: "mg/tablet" },
        { concentration: 68, unit: "mg/tablet" },
        { concentration: 136, unit: "mg/tablet" },
        { concentration: 22.7, unit: "mg/mL (injection)" },
        { concentration: 100, unit: "mg/mL (injection)" }
      ],
      contraindications: ["Growing animals (cartilage damage)", "Cats >5 mg/kg"],
      sideEffects: ["GI upset", "Cartilage damage in young animals", "Retinal toxicity (cats)"]
    },
    {
      name: "Metronidazole",
      brandNames: ["Flagyl"],
      category: "Antibiotic/Antiprotozoal",
      species: {
        dog: {
          doseRange: { min: 10, max: 15 },
          unit: "mg/kg",
          frequency: "every 12 hours",
          route: ["PO", "IV"],
          notes: "Anaerobic coverage, anti-inflammatory for GI"
        },
        cat: {
          doseRange: { min: 10, max: 15 },
          unit: "mg/kg",
          frequency: "every 12 hours",
          route: ["PO"]
        }
      },
      formulations: [
        { concentration: 250, unit: "mg/tablet" },
        { concentration: 500, unit: "mg/tablet" },
        { concentration: 50, unit: "mg/mL (suspension)" }
      ],
      contraindications: ["Pregnancy (teratogenic)", "Liver disease"],
      sideEffects: ["GI upset", "Neurotoxicity (high doses)", "Metallic taste"]
    }
  ],

  // Emergency / Critical Care
  emergency: [
    {
      name: "Epinephrine",
      brandNames: ["Adrenalin"],
      category: "Emergency - CPR",
      species: {
        dog: {
          doseRange: { min: 0.01, max: 0.1 },
          unit: "mg/kg",
          frequency: "every 3-5 minutes (CPR)",
          route: ["IV", "IO", "IT"],
          notes: "Low dose: 0.01 mg/kg IV; High dose: 0.1 mg/kg for refractory arrest"
        },
        cat: {
          doseRange: { min: 0.01, max: 0.1 },
          unit: "mg/kg",
          frequency: "every 3-5 minutes (CPR)",
          route: ["IV", "IO", "IT"]
        }
      },
      formulations: [
        { concentration: 1, unit: "mg/mL (1:1000)" }
      ],
      contraindications: [],
      sideEffects: ["Arrhythmias", "Hypertension"]
    },
    {
      name: "Atropine",
      brandNames: ["generic"],
      category: "Emergency - Bradycardia/CPR",
      species: {
        dog: {
          doseRange: { min: 0.02, max: 0.04 },
          unit: "mg/kg",
          frequency: "single dose, repeat as needed",
          route: ["IV", "IM", "SC"],
          notes: "Max dose: 0.5 mg (dogs), 0.25 mg (cats)"
        },
        cat: {
          doseRange: { min: 0.02, max: 0.04 },
          unit: "mg/kg",
          frequency: "single dose",
          route: ["IV", "IM", "SC"],
          notes: "Max dose: 0.25 mg"
        }
      },
      formulations: [
        { concentration: 0.54, unit: "mg/mL" }
      ],
      contraindications: ["Tachycardia", "Glaucoma"],
      sideEffects: ["Tachycardia", "Dry mouth", "Urinary retention"]
    },
    {
      name: "Lidocaine",
      brandNames: ["Xylocaine"],
      category: "Emergency - Arrhythmias/CPR",
      species: {
        dog: {
          doseRange: { min: 2, max: 4 },
          unit: "mg/kg",
          frequency: "single IV bolus",
          route: ["IV"],
          notes: "For ventricular arrhythmias; CRI: 25-80 mcg/kg/min"
        },
        cat: {
          doseRange: { min: 0.25, max: 0.5 },
          unit: "mg/kg",
          frequency: "single IV bolus",
          route: ["IV"],
          notes: "Cats very sensitive - use low doses"
        }
      },
      formulations: [
        { concentration: 20, unit: "mg/mL (2%)" }
      ],
      contraindications: ["Complete heart block", "Severe bradycardia"],
      sideEffects: ["Seizures (overdose)", "CNS depression"]
    }
  ],

  // Steroids
  steroids: [
    {
      name: "Prednisone",
      brandNames: ["Deltasone", "generic"],
      category: "Corticosteroid",
      species: {
        dog: {
          doseRange: { min: 0.5, max: 2 },
          unit: "mg/kg",
          frequency: "every 12-24 hours",
          route: ["PO"],
          notes: "Anti-inflammatory: 0.5 mg/kg; Immunosuppressive: 2 mg/kg"
        },
        cat: {
          doseRange: { min: 0.5, max: 2 },
          unit: "mg/kg",
          frequency: "every 12-24 hours",
          route: ["PO"]
        }
      },
      formulations: [
        { concentration: 1, unit: "mg/tablet" },
        { concentration: 5, unit: "mg/tablet" },
        { concentration: 10, unit: "mg/tablet" },
        { concentration: 20, unit: "mg/tablet" }
      ],
      contraindications: ["Systemic fungal infections", "Concurrent NSAIDs", "GI ulceration"],
      sideEffects: ["PU/PD", "Polyphagia", "Immunosuppression", "Iatrogenic Cushing's"]
    },
    {
      name: "Dexamethasone",
      brandNames: ["Azium", "generic"],
      category: "Corticosteroid (long-acting)",
      species: {
        dog: {
          doseRange: { min: 0.1, max: 0.2 },
          unit: "mg/kg",
          frequency: "every 24 hours",
          route: ["IV", "IM", "SC", "PO"],
          notes: "7-8x more potent than prednisone"
        },
        cat: {
          doseRange: { min: 0.1, max: 0.2 },
          unit: "mg/kg",
          frequency: "every 24 hours",
          route: ["IV", "IM", "SC", "PO"]
        }
      },
      formulations: [
        { concentration: 2, unit: "mg/mL (injection)" },
        { concentration: 0.5, unit: "mg/tablet" },
        { concentration: 0.75, unit: "mg/tablet" }
      ],
      contraindications: ["Systemic fungal infections", "Concurrent NSAIDs"],
      sideEffects: ["PU/PD", "Immunosuppression", "Delayed wound healing"]
    }
  ],

  // Sedatives / Anesthesia
  anesthesia: [
    {
      name: "Acepromazine",
      brandNames: ["PromAce"],
      category: "Tranquilizer (phenothiazine)",
      species: {
        dog: {
          doseRange: { min: 0.025, max: 0.1 },
          unit: "mg/kg",
          frequency: "single dose",
          route: ["IM", "SC", "IV"],
          notes: "Max effect in 15-30 min"
        },
        cat: {
          doseRange: { min: 0.05, max: 0.1 },
          unit: "mg/kg",
          frequency: "single dose",
          route: ["IM", "SC"],
          notes: "Boxers very sensitive - use low end"
        }
      },
      formulations: [
        { concentration: 10, unit: "mg/mL (injection)" },
        { concentration: 25, unit: "mg/tablet" }
      ],
      contraindications: ["Boxers (hypotension)", "Shock", "Anemia"],
      sideEffects: ["Hypotension", "Penile prolapse (horses)"]
    },
    {
      name: "Dexmedetomidine",
      brandNames: ["Dexdomitor", "Sileo"],
      category: "Sedative (alpha-2 agonist)",
      species: {
        dog: {
          doseRange: { min: 0.5, max: 20 },
          unit: "mcg/kg",
          frequency: "single dose",
          route: ["IM", "IV"],
          notes: "IM: 500 mcg/m2; IV: 375 mcg/m2; Sileo: 125 mcg/m2 (noise phobia)"
        },
        cat: {
          doseRange: { min: 40, max: 40 },
          unit: "mcg/kg",
          frequency: "single dose",
          route: ["IM"],
          notes: "IM: 40 mcg/kg"
        }
      },
      formulations: [
        { concentration: 0.5, unit: "mg/mL" }
      ],
      contraindications: ["Cardiac disease", "Shock", "Hepatic disease"],
      sideEffects: ["Bradycardia", "AV block", "Hyperglycemia"],
      reversal: "Atipamezole (Antisedan) 5x dexmedetomidine dose"
    },
    {
      name: "Propofol",
      brandNames: ["Rapinovet", "PropoFlo"],
      category: "Induction agent",
      species: {
        dog: {
          doseRange: { min: 4, max: 6 },
          unit: "mg/kg",
          frequency: "single IV bolus",
          route: ["IV"],
          notes: "Give to effect; CRI: 0.1-0.4 mg/kg/min"
        },
        cat: {
          doseRange: { min: 4, max: 6 },
          unit: "mg/kg",
          frequency: "single IV bolus",
          route: ["IV"],
          notes: "Heinz body anemia with repeated use in cats"
        }
      },
      formulations: [
        { concentration: 10, unit: "mg/mL" }
      ],
      contraindications: ["Egg allergy (contains egg lecithin)"],
      sideEffects: ["Apnea", "Hypotension", "Heinz body anemia (cats with repeated use)"]
    }
  ],

  // CRI Protocols
  cri: [
    {
      name: "Morphine CRI",
      category: "Analgesia",
      species: ["dog", "cat"],
      doseRange: { min: 0.1, max: 0.3 },
      unit: "mg/kg/hr",
      loadingDose: "0.5-1 mg/kg",
      notes: "Preemptive analgesia, post-op pain"
    },
    {
      name: "Fentanyl CRI",
      category: "Analgesia",
      species: ["dog", "cat"],
      doseRange: { min: 2, max: 5 },
      unit: "mcg/kg/hr",
      loadingDose: "2-5 mcg/kg IV bolus",
      notes: "Short-acting, excellent analgesia"
    },
    {
      name: "Ketamine CRI",
      category: "Analgesia/Dissociative",
      species: ["dog", "cat"],
      doseRange: { min: 0.12, max: 0.6 },
      unit: "mg/kg/hr",
      loadingDose: "0.5 mg/kg IV",
      notes: "NMDA antagonist, good for neuropathic pain"
    },
    {
      name: "Lidocaine CRI",
      category: "Antiarrhythmic/Analgesic",
      species: ["dog"],
      doseRange: { min: 25, max: 80 },
      unit: "mcg/kg/min",
      loadingDose: "2 mg/kg IV",
      notes: "Avoid in cats (toxicity)"
    },
    {
      name: "Dopamine CRI",
      category: "Vasopressor/Inotrope",
      species: ["dog", "cat"],
      doseRange: { min: 2, max: 20 },
      unit: "mcg/kg/min",
      notes: "Low dose: renal perfusion; High dose: vasoconstriction"
    },
    {
      name: "Dobutamine CRI",
      category: "Inotrope",
      species: ["dog", "cat"],
      doseRange: { min: 2, max: 20 },
      unit: "mcg/kg/min",
      notes: "Positive inotrope for heart failure"
    }
  ],

  // Helper methods
  getDrugByName(name) {
    const allDrugs = [
      ...this.analgesics,
      ...this.antibiotics,
      ...this.emergency,
      ...this.steroids,
      ...this.anesthesia
    ];
    return allDrugs.find(drug => 
      drug.name.toLowerCase() === name.toLowerCase() ||
      drug.brandNames.some(brand => brand.toLowerCase() === name.toLowerCase())
    );
  },

  getDrugsByCategory(category) {
    return this[category] || [];
  },

  getAllDrugs() {
    return [
      ...this.analgesics,
      ...this.antibiotics,
      ...this.emergency,
      ...this.steroids,
      ...this.anesthesia
    ];
  },

  calculateDose(drugName, weight, species, doseFactor = 'mid') {
    const drug = this.getDrugByName(drugName);
    if (!drug) return null;

    const speciesData = drug.species[species];
    if (!speciesData) return null;

    let dose;
    if (doseFactor === 'low') {
      dose = speciesData.doseRange.min;
    } else if (doseFactor === 'high') {
      dose = speciesData.doseRange.max;
    } else {
      dose = (speciesData.doseRange.min + speciesData.doseRange.max) / 2;
    }

    const totalMg = weight * dose;

    return {
      drug: drug.name,
      dose: dose,
      unit: speciesData.unit,
      totalMg: totalMg,
      frequency: speciesData.frequency,
      route: speciesData.route,
      notes: speciesData.notes
    };
  }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VeterinaryDrugFormulary;
}
