import assert from 'node:assert/strict';
import test from 'node:test';
import {
  calculateLidocaineMaxVolume,
  classifyHemorrhage,
  computeStudyMastery,
  evaluateClinicalTriage,
  gradeQuizAttempt,
  searchClinicalTopics
} from './clinicalEngine.ts';

test('Lidocaine calculator enforces plain 3 mg/kg floor and blocks adrenaline in end-arteries', () => {
  const fingerResult = calculateLidocaineMaxVolume({
    weightKg: 70,
    withAdrenaline: true,
    concentrationPercent: 1,
    anatomicalZone: 'end_artery'
  });
  assert.equal(fingerResult.adrenalineAllowed, false);
  assert.equal(fingerResult.maxMgPerKg, 3);
  assert.equal(fingerResult.maxTotalMg, 210);
  assert.equal(fingerResult.maxVolumeMl, 21);
  assert.ok(fingerResult.safetyAlert?.includes('CONTRAINDICATED'));

  const trunkAdrResult = calculateLidocaineMaxVolume({
    weightKg: 70,
    withAdrenaline: true,
    concentrationPercent: 1,
    anatomicalZone: 'standard'
  });
  assert.equal(trunkAdrResult.adrenalineAllowed, true);
  assert.equal(trunkAdrResult.maxMgPerKg, 7);
  assert.equal(trunkAdrResult.maxVolumeMl, 49);
});

test('Hemorrhage classifier aligns with Pécs / ATLS Class I–IV thresholds', () => {
  assert.equal(classifyHemorrhage(500), 'Class I');
  assert.equal(classifyHemorrhage(1000), 'Class II');
  assert.equal(classifyHemorrhage(1750), 'Class III');
  assert.equal(classifyHemorrhage(2300), 'Class IV');
});

test('Triage engine flags tendon/nerve/bone exposure for Immediate Surgical Consult', () => {
  const result = evaluateClinicalTriage({
    hoursSinceInjury: 2,
    anatomicalRegion: 'upper_limb',
    woundMechanism: 'incised',
    contamination: 'clean',
    exposedDeepStructures: ['tendon', 'nerve'],
    estimatedBloodLossMl: 200,
    suspectedGlassOrRadioOpaqueFB: true,
    isPediatric: false
  });
  assert.equal(result.urgency, 'IMMEDIATE_SURGICAL_CONSULT');
  assert.ok(result.mandatoryActions.some((a) => a.includes('X-ray')));
});

test('Triage engine blocks primary closure for >12h non-facial lacerations and directs DPC', () => {
  const result = evaluateClinicalTriage({
    hoursSinceInjury: 15,
    anatomicalRegion: 'lower_limb',
    woundMechanism: 'laceration_crush',
    contamination: 'contaminated',
    exposedDeepStructures: [],
    estimatedBloodLossMl: 150,
    suspectedGlassOrRadioOpaqueFB: false,
    isPediatric: false
  });
  assert.equal(result.urgency, 'URGENT_DELAYED_CLOSURE');
  assert.equal(result.recommendedSuture.gauge, '3/0');
});

test('Triage engine enforces secondary intention for pus/abscess or puncture wounds', () => {
  const pusResult = evaluateClinicalTriage({
    hoursSinceInjury: 48,
    anatomicalRegion: 'trunk',
    woundMechanism: 'abscess',
    contamination: 'infected_pus',
    exposedDeepStructures: [],
    estimatedBloodLossMl: 50,
    suspectedGlassOrRadioOpaqueFB: false,
    isPediatric: false
  });
  assert.equal(pusResult.urgency, 'CONSERVATIVE_SECONDARY');
});

test('Triage engine reduces pediatric facial suture gauge and allows primary closure up to 24h on face', () => {
  const childFace = evaluateClinicalTriage({
    hoursSinceInjury: 10,
    anatomicalRegion: 'face',
    woundMechanism: 'incised',
    contamination: 'clean',
    exposedDeepStructures: [],
    estimatedBloodLossMl: 30,
    suspectedGlassOrRadioOpaqueFB: false,
    isPediatric: true
  });
  assert.equal(childFace.urgency, 'CLINIC_PRIMARY_REPAIR');
  assert.equal(childFace.recommendedSuture.gauge, '6/0 – 7/0');
});

test('Search finds specific anatomical structures, sutures, and wound scenarios accurately', () => {
  const tendonHits = searchClinicalTopics('tendon');
  assert.ok(tendonHits.some((h) => h.targetId === 'tendon'));

  const lidocaineOrMatHits = searchClinicalTopics('vicryl');
  assert.ok(lidocaineOrMatHits.some((h) => h.category === 'Suture & Needle'));
});

test('Quiz grading and study mastery calculation work deterministically', () => {
  const grade = gradeQuizAttempt({ q1: 1, q2: 1, q3: 0 });
  assert.equal(grade.correct, 2);

  const mastery = computeStudyMastery(
    {
      inspectedAnatomyIds: ['epidermis', 'dermis'],
      reviewedCaseIds: ['clean_forearm_incised'],
      completedOsceIds: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      quizScores: {
        q1: { correct: true, answeredAt: '2026-01-01' },
        q2: { correct: true, answeredAt: '2026-01-01' },
        q3: { correct: true, answeredAt: '2026-01-01' }
      }
    },
    10,
    10,
    36,
    12
  );
  assert.equal(mastery.oscePercent, 25);
  assert.equal(mastery.quizCorrectCount, 3);
  assert.ok(mastery.overallPercent > 0);
});
