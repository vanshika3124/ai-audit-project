export const auditTools = (tool: string, seats: number, spend: number) => {
  if (tool === 'ChatGPT' && seats < 5) {
    return {
      save: spend - (seats * 20),
      action: "Switch to Plus",
      reason: "Team plan is overkill for small teams."
    };
  }
  if (tool === 'Cursor') {
    return {
      save: spend * 0.2,
      action: "Buy via Credex",
      reason: "Save 20% using startup credits."
    };
  }
  return { save: 0, action: "Optimal", reason: "Good job!" };
};