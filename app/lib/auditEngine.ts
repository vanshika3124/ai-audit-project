export interface ToolInput {
  name: string;
  plan: string;
  monthlySpend: number;
  seats: number;
}

export const runAudit = (inputs: ToolInput[]) => {
  return inputs.map((tool) => {
    let savings = 0;
    let action = "Optimal";
    let reason = "You are spending efficiently.";

    if (tool.name === 'ChatGPT' && tool.plan === 'Team' && tool.seats < 6) {
      savings = tool.monthlySpend - (tool.seats * 20); // Plus is $20
      action = "Switch to Plus";
      reason = "Team plan efficiency starts at 6+ seats.";
    } else if (tool.name === 'Cursor' && tool.plan === 'Business') {
      savings = tool.monthlySpend * 0.25; // 25% discount via Credex
      action = "Buy via Credex";
      reason = "Save ~25% through secondary credit markets.";
    }

    return { ...tool, savings, action, reason };
  });
};