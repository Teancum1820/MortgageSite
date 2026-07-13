export type AffordabilityInputs = {
  homePrice: number;
  downPaymentPercent: number;
  annualRate: number;
  termYears: number;
  grossMonthlyIncome: number;
  monthlyDebts: number;
};

export function calculatePrincipalAndInterest(
  loanAmount: number,
  annualRate: number,
  termYears: number,
) {
  const months = termYears * 12;
  const monthlyRate = annualRate / 100 / 12;

  if (loanAmount <= 0 || months <= 0) {
    return 0;
  }

  if (monthlyRate === 0) {
    return loanAmount / months;
  }

  return (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
}

export function calculateAffordability(inputs: AffordabilityInputs) {
  const loanAmount = inputs.homePrice * (1 - inputs.downPaymentPercent / 100);
  const monthlyPayment = calculatePrincipalAndInterest(
    loanAmount,
    inputs.annualRate,
    inputs.termYears,
  );
  const housingRatio = inputs.grossMonthlyIncome
    ? monthlyPayment / inputs.grossMonthlyIncome
    : 0;
  const totalDti = inputs.grossMonthlyIncome
    ? (monthlyPayment + inputs.monthlyDebts) / inputs.grossMonthlyIncome
    : 0;
  const maxHousingPayment = inputs.grossMonthlyIncome * 0.28;
  const maxDtiPayment = Math.max(inputs.grossMonthlyIncome * 0.36 - inputs.monthlyDebts, 0);
  const estimatedComfortPayment = Math.min(maxHousingPayment, maxDtiPayment);

  return {
    loanAmount,
    monthlyPayment,
    housingRatio,
    totalDti,
    estimatedComfortPayment,
  };
}

export function currency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}

export function percent(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(Number.isFinite(value) ? value : 0);
}
