const MEANS = [
  54.36707317073171,   // age
  0.7,                  // sex
  0.9524390243902439,  // cp
  131.72439024390243,  // trestbps
  245.05121951219513,  // chol
  0.14634146341463414, // fbs
  0.5195121951219512,  // restecg
  149.35121951219512,  // thalach
  0.34512195121951217, // exang
  1.0402439024390244,  // oldpeak
  1.3890243902439023,  // slope
  0.751219512195122,   // ca
  2.3292682926829267   // thal
];

const STDS = [
  9.161325855664694,
  0.45825756949558394,
  1.0389635559884758,
  17.607707299234463,
  49.638078528244876,
  0.3534482133216936,
  0.5280980656321794,
  22.913699405901475,
  0.4754080247597308,
  1.1404277926583943,
  0.6077760534213511,
  1.0354972768438273,
  0.6039479473770794
];

const WEIGHTS = [
  -0.0067344279862454485,  // age
  -0.8356654466405053,     // sex
   0.8858350128989809,     // cp
  -0.32005334088419946,    // trestbps
  -0.44727633582652604,    // chol
  -0.06268542979524232,    // fbs
   0.14080389192739187,    // restecg
   0.6528263494922107,     // thalach
  -0.4202349121160267,     // exang
  -0.7654063022179147,     // oldpeak
   0.3436046088243523,     // slope
  -0.8475216455411175,     // ca
  -0.6568563412218948      // thal
];

const BIAS = -0.1287435561239673;

const FEATURE_LABELS = [
  'Age',
  'Sex',
  'Chest Pain Type',
  'Resting Blood Pressure',
  'Cholesterol',
  'Fasting Blood Sugar',
  'Resting ECG',
  'Max Heart Rate',
  'Exercise Induced Angina',
  'ST Depression',
  'ST Slope',
  'Major Vessels',
  'Thalassemia'
];

export function predict(inputs) {
  // inputs: { age, sex, cp, trestbps, chol, fbs, restecg, thalach, exang, oldpeak, slope, ca, thal }
  const values = [
    inputs.age, inputs.sex, inputs.cp, inputs.trestbps, inputs.chol,
    inputs.fbs, inputs.restecg, inputs.thalach, inputs.exang,
    inputs.oldpeak, inputs.slope, inputs.ca, inputs.thal
  ];

  // 1. Standardize
  const scaled = values.map((v, i) => (v - MEANS[i]) / STDS[i]);

  // 2. Dot product + bias
  const logit = scaled.reduce((sum, v, i) => sum + v * WEIGHTS[i], BIAS);

  // 3. Sigmoid
  const probability = 1 / (1 + Math.exp(-logit));

  // 4. Feature contributions (for breakdown chart)
  const contributions = scaled.map((v, i) => ({
    feature: FEATURE_LABELS[i],
    contribution: v * WEIGHTS[i],
    raw_value: values[i]
  }));

  contributions.sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));

  return {
    risk_percent: Math.round(probability * 100),
    top_factors: contributions.slice(0, 4),
    all_factors: contributions
  };
}
