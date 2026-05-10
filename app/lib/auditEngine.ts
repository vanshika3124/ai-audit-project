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

    // ChatGPT Logic
    if (tool.name === 'ChatGPT' && tool.plan === 'Team' && tool.seats < 3) {
      savings = tool.monthlySpend - (tool.seats * 20);
      recommendedPlan = "Plus";
      reason = `${tool.seats} seats are better managed on Plus plans than Team.`;
      isOptimal = false;
    }

    // Cursor Logic
    if (tool.name === 'Cursor' && tool.plan === 'Business') {
      savings = tool.monthlySpend * 0.25; // Credex Discount
      recommendedPlan = "Business (via Credex)";
      reason = "Credex credits can reduce your Business seat cost by 25%.";
      isOptimal = false;
    }

    // API Logic
    if (tool.name.includes('API') && tool.monthlySpend > 200) {
      savings = tool.monthlySpend * 0.30;
      recommendedPlan = "Direct Credits";
      reason = "High API usage is eligible for 30% savings via bulk credits.";
      isOptimal = false;
    }

    return { ...tool, recommendedPlan, savings: Math.max(0, savings), reason, isOptimal };
  });
};