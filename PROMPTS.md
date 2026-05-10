# LLM Prompt Engineering

I used the following prompt to generate the personalized audit summary.

## The Strategy
I used a **Role-Based Prompting** technique. By telling the AI to act as a "Fractional CFO," the output becomes more professional and focuses on "bottom-line impact" rather than just listing numbers.

## The Final Prompt
```text
Act as a Fractional CFO for a high-growth startup. Review the following AI spend audit data:
{{USER_AUDIT_DATA}}

Total Monthly Savings Identified: {{TOTAL_SAVINGS}}

Provide a 100-word executive summary for the Founder. 
1. Highlight the biggest leak.
2. Explain the strategic value of switching to Credex credits.
3. Keep the tone professional, urgent, and data-driven.