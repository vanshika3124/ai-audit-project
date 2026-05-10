export interface ToolInput {
  name: string;
  plan: string;
  monthlySpend: number;
  seats: number;
}

export interface AuditResult extends ToolInput {
  recommendedPlan: string;
  savings: number;
  reason: string;
  isOptimal: boolean;
}

export const runAudit = (inputs: ToolInput[]): AuditResult[] => {
  return inputs.map((tool) => {
    let savings = 0;
    let recommendedPlan = tool.plan;
    let reason = "Your current plan is optimal for your team size.";
    let isOptimal = true;

    // ChatGPT Logic: Team plan is $25/seat (min 2). Plus is $20.
    if (tool.name === 'ChatGPT') {
      if (tool.seats < 5 && tool.monthlySpend > (tool.seats * 20)) {
        savings = tool.monthlySpend - (tool.seats * 20);
        recommendedPlan = "ChatGPT Plus";
        reason = "Moving to Individual Plus seats saves you money for small teams.";
        isOptimal = false;
      }
    }

    // Cursor Logic: Credex sources Business seats at 20% discount
    if (tool.name === 'Cursor') {
      savings = tool.monthlySpend * 0.20;
      recommendedPlan = "Business (via Credex)";
      reason = "Credex credits can capture 20% savings on your current Cursor spend.";
      isOptimal = false;
    }

    // Generic API Savings
    if (tool.name.includes('API') && tool.monthlySpend > 100) {
      savings = tool.monthlySpend * 0.30;
      recommendedPlan = "Enterprise Credits";
      reason = "High API usage is eligible for 30% discount via Credex secondary credits.";
      isOptimal = false;
    }

    return { ...tool, recommendedPlan, savings: Math.max(0, savings), reason, isOptimal };
  });
};