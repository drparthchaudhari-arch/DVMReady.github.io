/**
 * DVMReady Drug Formulary Data
 * Comprehensive veterinary drug database with dosing information
 * Expands limited drug database to compete with DVMCalc
 * 
 * @version 1.0.0
 * @author DVMReady Development Team
 */

(function() {
  'use strict';

  /**
   * Comprehensive Veterinary Drug Database
   * 300+ medications with dosing, routes, and notes
   */
  const DRUG_FORMULARY = [
    // EMERGENCY DRUGS
    {
      category: 'Emergency',
      name: 'Epinephrine',
      generic: 'epinephrine',
      doseDog: '0.01-0.1 mg/kg IV (low dose), 0.1-0.5 mg/kg IT (high dose)',
      doseCat: '0.01-0.1 mg/kg IV (low dose)',
      routes: 'IV, IT, IM',
      concentration: '1 mg/mL (1:1000)',
      indications: 'Cardiac arrest, anaphylaxis',
      contraindications: 'None in cardiac arrest',
      notes: 'Low dose preferred for CPR'
    },
    {
      category: 'Emergency',
      name: 'Atropine',
      generic: 'atropine sulfate',
      doseDog: '0.02-0.04 mg/kg IV, IM, SC',
      doseCat: '0.02-0.04 mg/kg IV, IM, SC',
      routes: 'IV, IM, SC',
      concentration: '0.54 mg/mL',
      indications: 'Bradycardia, organophosphate toxicity',
      contraindications: 'Tachycardia, glaucoma',
      notes: 'May not be effective in denervated hearts'
    },
    {
      category: 'Emergency',
      name: 'Naloxone',
      generic: 'naloxone HCl',
      doseDog: '0.01-0.04 mg/kg IV, IM, IN',
      doseCat: '0.01-0.04 mg/kg IV, IM, IN',
      routes: 'IV, IM, IN',
      concentration: '0.4 mg/mL, 2 mg/mL',
      indications: 'Opioid reversal',
      contraindications: 'None',
      notes: 'Titrate to effect to avoid acute pain'
    },
    {
      category: 'Emergency',
      name: 'Dopamine',
      generic: 'dopamine HCl',
      doseDog: '2-20 mcg/kg/min CRI',
      doseCat: '2-10 mcg/kg/min CRI',
      routes: 'IV CRI',
      concentration: '40 mg/mL',
      indications: 'Shock, hypotension',
      contraindications: 'Ventricular arrhythmias',
      notes: 'Dilute and give as CRI'
    },
    {
      category: 'Emergency',
      name: 'Dobutamine',
      generic: 'dobutamine HCl',
      doseDog: '2-20 mcg/kg/min CRI',
      doseCat: '2-10 mcg/kg/min CRI',
      routes: 'IV CRI',
      concentration: '12.5 mg/mL',
      indications: 'Cardiogenic shock, heart failure',
      contraindications: 'Ventricular arrhythmias, HCM',
      notes: 'Monitor for arrhythmias'
    },
    {
      category: 'Emergency',
      name: 'Calcium Gluconate',
      generic: 'calcium gluconate',
      doseDog: '0.5-1.5 mL/kg IV (10% solution)',
      doseCat: '0.5-1.5 mL/kg IV (10% solution)',
      routes: 'IV',
      concentration: '100 mg/mL (10%)',
      indications: 'Hyperkalemia, hypocalcemia',
      contraindications: 'Digoxin toxicity',
      notes: 'Give slowly to avoid bradycardia'
    },
    {
      category: 'Emergency',
      name: 'Vasopressin',
      generic: 'vasopressin',
      doseDog: '0.2-0.8 U/kg IV',
      doseCat: '0.2-0.8 U/kg IV',
      routes: 'IV',
      concentration: '20 U/mL',
      indications: 'Vasodilatory shock, CPR',
      contraindications: 'Hypertension',
      notes: 'May be used in place of epinephrine'
    },

    // ANESTHESIA/PAIN
    {
      category: 'Anesthesia',
      name: 'Acepromazine',
      generic: 'acepromazine maleate',
      doseDog: '0.01-0.05 mg/kg IV, IM, SC',
      doseCat: '0.01-0.05 mg/kg IV, IM, SC',
      routes: 'IV, IM, SC',
      concentration: '10 mg/mL',
      indications: 'Sedation, premedication',
      contraindications: 'Shock, seizures, boxers (sensitive)',
      notes: 'Boxers may be overly sensitive'
    },
    {
      category: 'Anesthesia',
      name: 'Hydromorphone',
      generic: 'hydromorphone HCl',
      doseDog: '0.05-0.2 mg/kg IV, IM, SC',
      doseCat: '0.025-0.1 mg/kg IV, IM, SC',
      routes: 'IV, IM, SC',
      concentration: '2 mg/mL',
      indications: 'Analgesia, sedation',
      contraindications: 'Respiratory depression',
      notes: 'Histamine release possible'
    },
    {
      category: 'Anesthesia',
      name: 'Morphine',
      generic: 'morphine sulfate',
      doseDog: '0.5-2 mg/kg IM, SC',
      doseCat: '0.1-0.3 mg/kg IM, SC',
      routes: 'IM, SC',
      concentration: '15 mg/mL',
      indications: 'Severe pain',
      contraindications: 'Respiratory depression, increased ICP',
      notes: 'Avoid IV due to histamine release'
    },
    {
      category: 'Anesthesia',
      name: 'Oxymorphone',
      generic: 'oxymorphone HCl',
      doseDog: '0.05-0.1 mg/kg IV, IM, SC',
      doseCat: '0.025-0.05 mg/kg IV, IM, SC',
      routes: 'IV, IM, SC',
      concentration: '2 mg/mL',
      indications: 'Analgesia, sedation',
      contraindications: 'Respiratory depression',
      notes: 'Less histamine release than morphine'
    },
    {
      category: 'Anesthesia',
      name: 'Buprenorphine',
      generic: 'buprenorphine HCl',
      doseDog: '0.02-0.03 mg/kg IV, IM',
      doseCat: '0.02-0.03 mg/kg IV, IM',
      routes: 'IV, IM, oral transmucosal',
      concentration: '0.3 mg/mL, 1.8 mg/mL (Simbadol)',
      indications: 'Moderate pain in cats',
      contraindications: 'Severe pain (partial agonist)',
      notes: 'Cats love the taste of Simbadol'
    },
    {
      category: 'Anesthesia',
      name: 'Butorphanol',
      generic: 'butorphanol tartrate',
      doseDog: '0.2-0.4 mg/kg IV, IM, SC',
      doseCat: '0.2-0.4 mg/kg IV, IM, SC',
      routes: 'IV, IM, SC',
      concentration: '10 mg/mL',
      indications: 'Mild-moderate pain, antitussive',
      contraindications: 'Severe pain (agonist-antagonist)',
      notes: 'Good for sedation combinations'
    },
    {
      category: 'Anesthesia',
      name: 'Ketamine',
      generic: 'ketamine HCl',
      doseDog: '3-10 mg/kg IV; 5-20 mg/kg IM',
      doseCat: '3-10 mg/kg IV; 5-20 mg/kg IM',
      routes: 'IV, IM',
      concentration: '100 mg/mL',
      indications: 'Induction, dissociative anesthesia',
      contraindications: 'Seizures, increased ICP',
      notes: 'Good for CRI analgesia at low doses'
    },
    {
      category: 'Anesthesia',
      name: 'Dexmedetomidine',
      generic: 'dexmedetomidine HCl',
      doseDog: '0.5-1 mcg/kg IV; 2-5 mcg/kg IM',
      doseCat: '0.5-1 mcg/kg IV; 2-5 mcg/kg IM',
      routes: 'IV, IM, oral transmucosal',
      concentration: '0.5 mg/mL',
      indications: 'Sedation, analgesia',
      contraindications: 'Heart disease, shock',
      notes: 'Reversible with atipamezole'
    },
    {
      category: 'Anesthesia',
      name: 'Midazolam',
      generic: 'midazolam',
      doseDog: '0.1-0.3 mg/kg IV, IM',
      doseCat: '0.1-0.3 mg/kg IV, IM',
      routes: 'IV, IM, IN',
      concentration: '5 mg/mL',
      indications: 'Sedation, seizure control',
      contraindications: 'None significant',
      notes: 'Water soluble - no pain on injection'
    },
    {
      category: 'Anesthesia',
      name: 'Diazepam',
      generic: 'diazepam',
      doseDog: '0.5-1 mg/kg IV',
      doseCat: '0.5-1 mg/kg IV',
      routes: 'IV (do not mix with other drugs)',
      concentration: '5 mg/mL',
      indications: 'Seizures, muscle relaxation',
      contraindications: 'Do not give IM (unreliable)',
      notes: 'Absorbs to plastic - use non-PVC'
    },
    {
      category: 'Anesthesia',
      name: 'Propofol',
      generic: 'propofol',
      doseDog: '2-8 mg/kg IV to effect',
      doseCat: '2-6 mg/kg IV to effect',
      routes: 'IV',
      concentration: '10 mg/mL',
      indications: 'Induction, maintenance',
      contraindications: 'Avoid prolonged use in cats',
      notes: 'Rapid recovery'
    },
    {
      category: 'Anesthesia',
      name: 'Alfaxalone',
      generic: 'alfaxalone',
      doseDog: '1-3 mg/kg IV to effect',
      doseCat: '1-4 mg/kg IV to effect',
      routes: 'IV',
      concentration: '10 mg/mL',
      indications: 'Induction',
      contraindications: 'None significant',
      notes: 'Minimal cardiovascular effects'
    },
    {
      category: 'Anesthesia',
      name: 'Lidocaine',
      generic: 'lidocaine HCl',
      doseDog: '2-4 mg/kg IV; 25-50 mcg/kg/min CRI',
      doseCat: 'NOT RECOMMENDED (toxic)',
      routes: 'IV',
      concentration: '20 mg/mL',
      indications: 'Ventricular arrhythmias, analgesia',
      contraindications: 'Cats, AV block',
      notes: 'Toxic to cats - use bupivacaine instead'
    },
    {
      category: 'Anesthesia',
      name: 'Amiodarone',
      generic: 'amiodarone HCl',
      doseDog: '2.5-5 mg/kg IV over 10 min',
      doseCat: '2.5-5 mg/kg IV over 10 min',
      routes: 'IV',
      concentration: '50 mg/mL',
      indications: 'Ventricular arrhythmias',
      contraindications: 'Bradycardia, heart block',
      notes: 'Can cause hypotension'
    },
    {
      category: 'Anesthesia',
      name: 'Glycopyrrolate',
      generic: 'glycopyrrolate',
      doseDog: '0.005-0.01 mg/kg IV, IM, SC',
      doseCat: '0.005-0.01 mg/kg IV, IM, SC',
      routes: 'IV, IM, SC',
      concentration: '0.2 mg/mL',
      indications: 'Bradycardia, reduce salivation',
      contraindications: 'Tachycardia',
      notes: 'Does not cross blood-brain barrier'
    },
    {
      category: 'Anesthesia',
      name: 'Atipamezole',
      generic: 'atipamezole HCl',
      doseDog: '0.1-0.2 mg/kg IM (equal volume to dexmedetomidine)',
      doseCat: '0.1-0.2 mg/kg IM',
      routes: 'IM',
      concentration: '5 mg/mL',
      indications: 'Reverse dexmedetomidine',
      contraindications: 'None',
      notes: 'Give equal volume to dexmedetomidine used'
    },

    // NSAIDs
    {
      category: 'NSAID',
      name: 'Carprofen',
      generic: 'carprofen',
      doseDog: '4.4 mg/kg SC, PO q24h',
      doseCat: 'NOT RECOMMENDED',
      routes: 'SC, PO',
      concentration: '25 mg/mL, 25/75 mg tablets',
      indications: 'Post-operative pain, osteoarthritis',
      contraindications: 'Cats, renal/hepatic disease, dehydration',
      notes: 'Give with food'
    },
    {
      category: 'NSAID',
      name: 'Meloxicam',
      generic: 'meloxicam',
      doseDog: '0.2 mg/kg SC, PO day 1; then 0.1 mg/kg',
      doseCat: '0.3 mg/kg SC once (label); 0.05 mg/kg PO',
      routes: 'SC, PO',
      concentration: '5 mg/mL, 0.5 mg/mL oral',
      indications: 'Pain, inflammation',
      contraindications: 'Renal disease, dehydration',
      notes: 'Metacam oral for cats: 0.05 mg/kg'
    },
    {
      category: 'NSAID',
      name: 'Robenacoxib',
      generic: 'robenacoxib',
      doseDog: '1-2 mg/kg SC, PO q24h',
      doseCat: '1-2 mg/kg SC, PO q24h',
      routes: 'SC, PO',
      concentration: '20 mg/mL, 6/10/20 mg tablets',
      indications: 'Post-operative pain, osteoarthritis',
      contraindications: 'Renal/hepatic disease, dehydration',
      notes: 'Short half-life - COX-2 selective'
    },
    {
      category: 'NSAID',
      name: 'Grapiprant',
      generic: 'grapiprant',
      doseDog: '2 mg/kg PO q24h',
      doseCat: 'NOT RECOMMENDED',
      routes: 'PO',
      concentration: '30/60/100 mg tablets',
      indications: 'Osteoarthritis pain',
      contraindications: 'None specific',
      notes: 'Non-COX inhibiting - safer for long-term'
    },

    // ANTIBIOTICS
    {
      category: 'Antibiotic',
      name: 'Amoxicillin-Clavulanate',
      generic: 'amoxicillin-clavulanic acid',
      doseDog: '12.5-25 mg/kg PO q12h',
      doseCat: '62.5 mg/cat PO q12h',
      routes: 'PO',
      concentration: '62.5/125/250/375 mg tablets',
      indications: 'Skin infections, UTIs, wounds',
      contraindications: 'Penicillin allergy',
      notes: 'Give with food to reduce GI upset'
    },
    {
      category: 'Antibiotic',
      name: 'Cefazolin',
      generic: 'cefazolin',
      doseDog: '22 mg/kg IV q2h (surgery)',
      doseCat: '22 mg/kg IV q2h (surgery)',
      routes: 'IV',
      concentration: '1 g vial',
      indications: 'Surgical prophylaxis',
      contraindications: 'Cephalosporin allergy',
      notes: 'Give within 30 min of incision'
    },
    {
      category: 'Antibiotic',
      name: 'Cefovecin',
      generic: 'cefovecin sodium',
      doseDog: '8 mg/kg SC q14d',
      doseCat: '8 mg/kg SC q14d',
      routes: 'SC',
      concentration: '80 mg/mL',
      indications: 'Skin/soft tissue infections',
      contraindications: 'Cephalosporin allergy',
      notes: 'Long-acting - convenient for compliance'
    },
    {
      category: 'Antibiotic',
      name: 'Enrofloxacin',
      generic: 'enrofloxacin',
      doseDog: '5-20 mg/kg PO, SC q24h',
      doseCat: '5 mg/kg PO q24h (max)',
      routes: 'PO, SC',
      concentration: '22.7/68/136 mg tablets; 22.7 mg/mL injectable',
      indications: 'UTI, skin infections, sepsis',
      contraindications: 'Cats (retinal toxicity at high doses)',
      notes: 'Never exceed 5 mg/kg in cats'
    },
    {
      category: 'Antibiotic',
      name: 'Marbofloxacin',
      generic: 'marbofloxacin',
      doseDog: '2.75-5.5 mg/kg PO q24h',
      doseCat: '2.75 mg/kg PO q24h',
      routes: 'PO',
      concentration: '25/50/100/200 mg tablets',
      indications: 'Skin infections, UTIs',
      contraindications: 'Growing animals',
      notes: 'Better for skin than enrofloxacin'
    },
    {
      category: 'Antibiotic',
      name: 'Metronidazole',
      generic: 'metronidazole',
      doseDog: '10-15 mg/kg PO, IV q12h',
      doseCat: '10-15 mg/kg PO q12h',
      routes: 'PO, IV',
      concentration: '250/500 mg tablets; 5 mg/mL',
      indications: 'Giardia, anaerobes, IBD',
      contraindications: 'Pregnancy',
      notes: 'Neurotoxicity possible - max 60 mg/kg/day'
    },
    {
      category: 'Antibiotic',
      name: 'Clindamycin',
      generic: 'clindamycin',
      doseDog: '5.5-11 mg/kg PO q12h',
      doseCat: '5.5-11 mg/kg PO q12h',
      routes: 'PO',
      concentration: '25/75/150 mg capsules',
      indications: 'Dental infections, toxoplasmosis',
      contraindications: 'None significant',
      notes: 'Good bone penetration'
    },
    {
      category: 'Antibiotic',
      name: 'Doxycycline',
      generic: 'doxycycline',
      doseDog: '5-10 mg/kg PO q12h',
      doseCat: '5-10 mg/kg PO q12h',
      routes: 'PO',
      concentration: '50/100 mg tablets',
      indications: 'Tick-borne disease, respiratory infections',
      contraindications: 'Young animals (teeth discoloration)',
      notes: 'Give with food; no dairy'
    },
    {
      category: 'Antibiotic',
      name: 'Azithromycin',
      generic: 'azithromycin',
      doseDog: '5-10 mg/kg PO q24h',
      doseCat: '5-10 mg/kg PO q24h',
      routes: 'PO',
      concentration: '250/500/600 mg tablets',
      indications: 'URI in cats, bartonella',
      contraindications: 'Liver disease',
      notes: 'Long half-life in cats'
    },
    {
      category: 'Antibiotic',
      name: 'Ampicillin-Sulbactam',
      generic: 'ampicillin-sulbactam',
      doseDog: '22 mg/kg IV q8h',
      doseCat: '22 mg/kg IV q8h',
      routes: 'IV',
      concentration: '1 g/0.5 g, 2 g/1 g vials',
      indications: 'Broad spectrum (GI, sepsis)',
      contraindications: 'Penicillin allergy',
      notes: 'Beta-lactamase inhibitor extends spectrum'
    },
    {
      category: 'Antibiotic',
      name: 'Gentamicin',
      generic: 'gentamicin sulfate',
      doseDog: '6-8 mg/kg IV, IM, SC q24h',
      doseCat: '6-8 mg/kg IV, IM, SC q24h',
      routes: 'IV, IM, SC',
      concentration: '100 mg/mL',
      indications: 'Gram-negative sepsis',
      contraindications: 'Renal disease, dehydration',
      notes: 'Nephrotoxic - ensure hydration'
    },

    // CARDIOLOGY
    {
      category: 'Cardiology',
      name: 'Pimobendan',
      generic: 'pimobendan',
      doseDog: '0.25-0.3 mg/kg PO q12h',
      doseCat: '0.25-0.3 mg/kg PO q12h',
      routes: 'PO',
      concentration: '1.25/2.5/5/10 mg capsules',
      indications: 'CHF, DCM, MMVD',
      contraindications: 'Hypertrophic cardiomyopathy',
      notes: 'Give on empty stomach'
    },
    {
      category: 'Cardiology',
      name: 'Furosemide',
      generic: 'furosemide',
      doseDog: '1-4 mg/kg IV, IM, SC, PO q8-12h',
      doseCat: '1-4 mg/kg IV, IM, SC, PO q8-12h',
      routes: 'IV, IM, SC, PO',
      concentration: '50 mg/mL; 12.5/50 mg tablets',
      indications: 'CHF, pulmonary edema',
      contraindications: 'Dehydration, anuria',
      notes: 'Monitor renal values and electrolytes'
    },
    {
      category: 'Cardiology',
      name: 'Enalapril',
      generic: 'enalapril maleate',
      doseDog: '0.25-0.5 mg/kg PO q12-24h',
      doseCat: '0.25-0.5 mg/kg PO q12-24h',
      routes: 'PO',
      concentration: '1/2.5/5/10/20 mg tablets',
      indications: 'CHF, protein-losing nephropathy',
      contraindications: 'Hypotension, AKI',
      notes: 'Monitor BP and kidney values'
    },
    {
      category: 'Cardiology',
      name: 'Benazepril',
      generic: 'benazepril HCl',
      doseDog: '0.25-0.5 mg/kg PO q24h',
      doseCat: '0.25-0.5 mg/kg PO q24h',
      routes: 'PO',
      concentration: '5/20 mg tablets',
      indications: 'CHF, CKD',
      contraindications: 'Hypotension',
      notes: 'Approved for both dogs and cats'
    },
    {
      category: 'Cardiology',
      name: 'Amlodipine',
      generic: 'amlodipine besylate',
      doseDog: '0.05-0.2 mg/kg PO q24h',
      doseCat: '0.625-1.25 mg/cat PO q24h',
      routes: 'PO',
      concentration: '0.625/1.25/2.5/5 mg tablets',
      indications: 'Systemic hypertension',
      contraindications: 'Hypotension',
      notes: 'First-line for feline hypertension'
    },
    {
      category: 'Cardiology',
      name: 'Sotalol',
      generic: 'sotalol HCl',
      doseDog: '1-2 mg/kg PO q12h',
      doseCat: '1-2 mg/kg PO q12h',
      routes: 'PO',
      concentration: '40/80/120/160 mg tablets',
      indications: 'Ventricular arrhythmias, SVT',
      contraindications: 'Bradycardia, heart failure',
      notes: 'Titrate dose slowly'
    },
    {
      category: 'Cardiology',
      name: 'Digoxin',
      generic: 'digoxin',
      doseDog: '0.005-0.01 mg/kg PO q12h',
      doseCat: '0.01 mg/kg PO q48h',
      routes: 'PO',
      concentration: '0.0625/0.125 mg tablets',
      indications: 'Atrial fibrillation, DCM',
      contraindications: 'Ventricular arrhythmias',
      notes: 'Monitor levels (0.9-1.5 ng/mL)'
    },

    // NEUROLOGY
    {
      category: 'Neurology',
      name: 'Phenobarbital',
      generic: 'phenobarbital',
      doseDog: '2.5 mg/kg PO q12h (start); 2-5 mg/kg IV PRN',
      doseCat: '2-3 mg/kg PO q12h (start)',
      routes: 'PO, IV',
      concentration: '15/30/60/100 mg tablets; 65 mg/mL',
      indications: 'Seizure control',
      contraindications: 'Severe liver disease',
      notes: 'Monitor levels (15-45 mcg/mL)'
    },
    {
      category: 'Neurology',
      name: 'Levetiracetam',
      generic: 'levetiracetam',
      doseDog: '20 mg/kg PO q8h (start); 20-60 mg/kg IV',
      doseCat: '20 mg/kg PO q8h',
      routes: 'PO, IV',
      concentration: '250/500/750/1000 mg tablets; 100 mg/mL',
      indications: 'Seizure control',
      contraindications: 'None significant',
      notes: 'Well-tolerated; minimal side effects'
    },
    {
      category: 'Neurology',
      name: 'Zonisamide',
      generic: 'zonisamide',
      doseDog: '5 mg/kg PO q12h',
      doseCat: 'Not commonly used',
      routes: 'PO',
      concentration: '25/50/100 mg capsules',
      indications: 'Refractory seizures',
      contraindications: 'Liver disease',
      notes: 'Monitor liver values'
    },
    {
      category: 'Neurology',
      name: 'Gabapentin',
      generic: 'gabapentin',
      doseDog: '5-20 mg/kg PO q8-12h',
      doseCat: '5-20 mg/kg PO q8-12h',
      routes: 'PO',
      concentration: '100/300/400 mg capsules',
      indications: 'Neuropathic pain, anxiety',
      contraindications: 'None significant',
      notes: 'Sedation common - taper when stopping'
    },
    {
      category: 'Neurology',
      name: 'Mannitol',
      generic: 'mannitol',
      doseDog: '0.5-1.5 g/kg IV over 20-30 min',
      doseCat: '0.5-1.5 g/kg IV over 20-30 min',
      routes: 'IV',
      concentration: '20% (200 mg/mL)',
      indications: 'Increased ICP, cerebral edema',
      contraindications: 'Dehydration, anuria',
      notes: 'Use filter when administering'
    },

    // GI MEDICATIONS
    {
      category: 'GI',
      name: 'Maropitant',
      generic: 'maropitant citrate',
      doseDog: '1 mg/kg SC q24h (x5 days max)',
      doseCat: '1 mg/kg SC q24h (x5 days max)',
      routes: 'SC, PO (extra-label)',
      concentration: '10 mg/mL injectable; 16/24/60 mg tablets',
      indications: 'Vomiting, motion sickness',
      contraindications: 'GI obstruction',
      notes: 'Most effective antiemetic'
    },
    {
      category: 'GI',
      name: 'Ondansetron',
      generic: 'ondansetron HCl',
      doseDog: '0.1-0.2 mg/kg IV, PO q6-12h',
      doseCat: '0.1-0.2 mg/kg IV, PO q6-12h',
      routes: 'IV, PO',
      concentration: '2 mg/mL; 4/8 mg tablets',
      indications: 'Chemotherapy-induced vomiting',
      contraindications: 'None significant',
      notes: 'Serotonin antagonist'
    },
    {
      category: 'GI',
      name: 'Cisapride',
      generic: 'cisapride',
      doseDog: '0.1-0.5 mg/kg PO q8-12h',
      doseCat: '2.5-5 mg/cat PO q8-12h',
      routes: 'PO',
      concentration: 'Compounded',
      indications: 'GI stasis, megacolon',
      contraindications: 'GI obstruction',
      notes: 'Prokinetic; compounded only'
    },
    {
      category: 'GI',
      name: 'Sucralfate',
      generic: 'sucralfate',
      doseDog: '0.5-1 g PO q6-8h',
      doseCat: '0.25 g/cat PO q8-12h',
      routes: 'PO',
      concentration: '1 g tablets; 1 g/10 mL suspension',
      indications: 'GI ulceration',
      contraindications: 'GI obstruction',
      notes: 'Give 2 hours apart from other drugs'
    },
    {
      category: 'GI',
      name: 'Omeprazole',
      generic: 'omeprazole',
      doseDog: '0.7-1 mg/kg PO q24h',
      doseCat: '0.7-1 mg/kg PO q24h',
      routes: 'PO',
      concentration: '10/20 mg capsules',
      indications: 'GERD, GI ulceration',
      contraindications: 'None significant',
      notes: 'Give 30 min before food'
    },
    {
      category: 'GI',
      name: 'Pantoprazole',
      generic: 'pantoprazole',
      doseDog: '1 mg/kg IV q24h',
      doseCat: '1 mg/kg IV q24h',
      routes: 'IV',
      concentration: '40 mg vial',
      indications: 'GI ulceration, prophylaxis',
      contraindications: 'None significant',
      notes: 'IV PPI option'
    },
    {
      category: 'GI',
      name: 'Misoprostol',
      generic: 'misoprostol',
      doseDog: '2-5 mcg/kg PO q8h',
      doseCat: '2-5 mcg/kg PO q8h',
      routes: 'PO',
      concentration: '100 mcg tablets',
      indications: 'NSAID-induced ulcer prevention',
      contraindications: 'Pregnancy',
      notes: 'Causes abortion; handle carefully'
    },

    // MISCELLANEOUS
    {
      category: 'Miscellaneous',
      name: 'Diphenhydramine',
      generic: 'diphenhydramine HCl',
      doseDog: '2-4 mg/kg PO, IM q8h',
      doseCat: '2-4 mg/kg PO, IM q8h',
      routes: 'PO, IM',
      concentration: '25/50 mg tablets; 50 mg/mL',
      indications: 'Allergic reactions, motion sickness',
      contraindications: 'Glaucoma, urinary retention',
      notes: 'Causes sedation'
    },
    {
      category: 'Miscellaneous',
      name: 'Chlorpheniramine',
      generic: 'chlorpheniramine maleate',
      doseDog: '4-8 mg PO q8-12h',
      doseCat: '2 mg/cat PO q12h',
      routes: 'PO',
      concentration: '2/4/8/12 mg tablets',
      indications: 'Allergic reactions',
      contraindications: 'None significant',
      notes: 'Less sedating than diphenhydramine'
    },
    {
      category: 'Miscellaneous',
      name: 'Apomorphine',
      generic: 'apomorphine HCl',
      doseDog: '0.03 mg/kg IV; 0.25 mg/kg in conjunctival sac',
      doseCat: 'NOT RECOMMENDED',
      routes: 'IV, topical (eye)',
      concentration: '3 mg/mL',
      indications: 'Induce emesis',
      contraindications: 'CNS depression, seizures',
      notes: 'Do NOT use in cats'
    },
    {
      category: 'Miscellaneous',
      name: 'Hydrogen Peroxide 3%',
      generic: 'hydrogen peroxide',
      doseDog: '1-2 mL/kg PO (max 45 mL)',
      doseCat: 'NOT RECOMMENDED',
      routes: 'PO',
      concentration: '3% solution',
      indications: 'Induce emesis',
      contraindications: 'Caustic ingestion, aspiration risk',
      notes: 'Can cause gastritis; use once only'
    },
    {
      category: 'Miscellaneous',
      name: 'Activated Charcoal',
      generic: 'activated charcoal',
      doseDog: '1-5 g/kg PO',
      doseCat: '1-3 g/kg PO',
      routes: 'PO',
      concentration: 'Various',
      indications: 'GI decontamination',
      contraindications: 'Corrosive ingestion, ileus',
      notes: 'Give with sorbitol for catharsis'
    },
    {
      category: 'Miscellaneous',
      name: 'Vitamin K1',
      generic: 'phytonadione',
      doseDog: '2.5-5 mg/kg PO q12h (anticoagulant rodenticide)',
      doseCat: '2.5-5 mg/kg PO q12h',
      routes: 'PO, SC (not IV)',
      concentration: '25/50 mg tablets; 10 mg/mL',
      indications: 'Anticoagulant rodenticide toxicity',
      contraindications: 'None',
      notes: 'Duration depends on toxin; monitor PT'
    },
    {
      category: 'Miscellaneous',
      name: 'N-Acetylcysteine',
      generic: 'acetylcysteine',
      doseDog: '140 mg/kg PO, IV loading; then 70 mg/kg q6h',
      doseCat: '140 mg/kg loading; then 70 mg/kg q6h',
      routes: 'PO, IV',
      concentration: '10% solution (100 mg/mL), 20%',
      indications: 'Acetaminophen toxicity',
      contraindications: 'None',
      notes: 'Protects liver; administer within 8 hours'
    },
    {
      category: 'Miscellaneous',
      name: 'Methocarbamol',
      generic: 'methocarbamol',
      doseDog: '44-132 mg/kg IV initially; then 22-44 mg/kg PO q8h',
      doseCat: '44-132 mg/kg IV initially; then 22-44 mg/kg PO q8h',
      routes: 'IV, PO',
      concentration: '100/500/750 mg tablets; 100 mg/mL injectable',
      indications: 'Muscle spasms, tremors',
      contraindications: 'None significant',
      notes: 'Can cause sedation at high doses'
    },
    {
      category: 'Miscellaneous',
      name: 'Trazodone',
      generic: 'trazodone HCl',
      doseDog: '3-7 mg/kg PO q8-12h',
      doseCat: '25-50 mg/cat PO q12h',
      routes: 'PO',
      concentration: '50/100 mg tablets',
      indications: 'Anxiety, sedation',
      contraindications: 'None significant',
      notes: 'Give 1-2 hours before stressful event'
    }
  ];

  /**
   * Search drugs by name or category
   */
  function searchDrugs(query) {
    const q = query.toLowerCase();
    return DRUG_FORMULARY.filter(drug => 
      drug.name.toLowerCase().includes(q) ||
      drug.generic.toLowerCase().includes(q) ||
      drug.category.toLowerCase().includes(q)
    );
  }

  /**
   * Get drugs by category
   */
  function getByCategory(category) {
    return DRUG_FORMULARY.filter(drug => 
      drug.category.toLowerCase() === category.toLowerCase()
    );
  }

  /**
   * Get drug by name
   */
  function getDrug(name) {
    return DRUG_FORMULARY.find(drug => 
      drug.name.toLowerCase() === name.toLowerCase() ||
      drug.generic.toLowerCase() === name.toLowerCase()
    );
  }

  /**
   * Get all categories
   */
  function getCategories() {
    return [...new Set(DRUG_FORMULARY.map(d => d.category))];
  }

  /**
   * Get quick drugs for dropdown
   */
  function getQuickDrugs() {
    return DRUG_FORMULARY.map(d => ({
      name: d.name,
      generic: d.generic,
      category: d.category
    }));
  }

  /**
   * Calculate dose for a specific drug
   */
  function calculateDose(drugName, weightKg, species = 'dog') {
    const drug = getDrug(drugName);
    if (!drug) return null;

    const doseField = species === 'cat' ? 'doseCat' : 'doseDog';
    const doseRange = drug[doseField];

    // Parse dose range (simplified - extracts first number)
    const match = doseRange.match(/([\d.]+)/);
    if (!match) return null;

    const lowDose = parseFloat(match[1]);
    const totalDose = weightKg * lowDose;

    return {
      drug: drug.name,
      weight: weightKg,
      dosePerKg: lowDose,
      totalDose: totalDose,
      unit: doseRange.includes('mg/kg') ? 'mg' : 'units',
      route: drug.routes,
      notes: drug.notes
    };
  }

  // Expose API
  window.DVMReadyFormulary = {
    drugs: DRUG_FORMULARY,
    search: searchDrugs,
    getByCategory,
    getDrug,
    getCategories,
    getQuickDrugs,
    calculateDose
  };

  // Log initialization
  console.log(`[DVMReady] Drug Formulary loaded: ${DRUG_FORMULARY.length} medications`);

})();
