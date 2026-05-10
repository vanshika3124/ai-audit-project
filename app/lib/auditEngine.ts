export interface ToolInput {
  name: string;
  monthlySpend: number;
  seats: number;
  useCase: string;
}

export interface AuditResult extends ToolInput {
  savings: number;
  reason: string;
  isOptimal: boolean;
}

export const runAudit = (inputs: ToolInput[]): AuditResult[] => {
  return inputs.map((tool) => {
    let savings = 0;
    let reason = "Your current spending is optimal.";
    let isOptimal = true;

    if (tool.name === 'ChatGPT' && tool.seats < 5 && tool.monthlySpend > (tool.seats * 20)) {
      savings = tool.monthlySpend - (tool.seats * 20);
      reason = "Individual Plus seats are cheaper than Team for small squads.";
      isOptimal = false;
    } else if (tool.name === 'Cursor') {
      savings = tool.monthlySpend * 0.25;
      reason = "Credex can source these Business seats at 25% discount.";
      isOptimal = false;
    } else if (tool.name.includes('API') && tool.monthlySpend > 150) {
      savings = tool.monthlySpend * 0.30;
      reason = "Eligible for bulk enterprise credits via Credex.";
      isOptimal = false;
    }

    return { ...tool, savings, reason, isOptimal };
  });
};