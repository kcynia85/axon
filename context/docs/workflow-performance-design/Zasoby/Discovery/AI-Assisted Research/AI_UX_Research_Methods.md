# AI-Assisted UX Research Methods

> **Status:** Actionable Resource
> **Context:** Copy-paste prompts and protocols for AI-driven User Research.
> **Warning:** AI validates logic, not emotion. Always verify with human users.

---

## 1. 🔍 Deep Research Prompts (Copy & Paste)

### Option A: Quick Analytical Brief
*Use for: Rapid market scanning or initial feasibility checks.*

```yaml
**Task:** Analyze the attractiveness of the [Industry] market in [Countries/Region] for a [Company Type] considering expansion.
**Include:**
- Market size and projected growth.
- Macroeconomic situation.
- Consumer behavior differences.
- E-commerce and logistics landscape.
- Top 10 competitors per country.
```

### Option B: Structured Business Analysis
*Use for: Detailed breakdown of specific domains.*

```yaml
**Request:** Prepare a business analysis.

**Topic:** [e.g., Market, Competition, Trends, Product Potential]
**Product/Industry:** [e.g., SaaS Recruitment Software, Eco Furniture]
**Geography:** [e.g., DACH region, Global, Enterprise Segment]

**Key Information Required:**
1. [e.g., Market size & 3-year growth forecast]
2. [e.g., Key competitors, market share, pricing strategies]
3. [e.g., Main customer needs & pain points]
4. [e.g., Tech & Regulatory trends]
5. [e.g., Entry barriers & Opportunities]

**Format:** [e.g., Concise bullet-point report, Comparison table, Executive summary]
```

### Option C: Advanced Strategic Deep Dive (Agent Persona)
*Use for: Comprehensive strategy formulation requiring expert-level simulation.*

```yaml
**ROLE:**
Act as an experienced Senior Business Analyst.

**MAIN GOAL:**
Conduct a detailed analysis of [Topic, e.g., Market Attractiveness] for [Product/Service].

**BUSINESS CONTEXT:**
*   **Company Profile:** [e.g., Polish FinTech Startup, FMCG Manufacturer].
*   **Business Objective:** [e.g., Foreign expansion, New product validation, Marketing strategy].

**SCOPE OF ANALYSIS (For each market/segment):**

**1. Market Analysis:**
*   **Size & Value:** Current size, 2025-2028 forecasts.
*   **Drivers:** Consumer trends, tech shifts.
*   **Barriers:** Legal regulations, market saturation.

**2. Competition Analysis:**
*   **Players:** Identify top 5-10 competitors.
*   **Offer:** Compare products, pricing models, business models.
*   **SWOT:** Key strengths and weaknesses.

**3. Customer Analysis:**
*   **Segmentation:** Identify main segments.
*   **Behavior:** Decision process, purchasing factors, pain points.
*   **Channels:** Most effective marketing/sales channels.

**4. PEST Analysis:**
*   **Political/Legal:** Stability, regulations, tax.
*   **Economic:** Growth, inflation, purchasing power.
*   **Social:** Demographics, lifestyle, values.
*   **Tech:** Innovation, digitization level.

**OUTPUT FORMAT:**
*   Structured report with headers.
*   Bullet points for clarity.
*   Strategic recommendations summary.
```

---

## 2. 👥 User Research Operations (Action Protocols)

### ⚠️ The "Trust but Verify" Protocol
Before using any AI output:
- [ ] **Source Check:** Do the user comments/reviews actually exist?
- [ ] **Consistency:** Run the prompt twice. Are the results similar?
- [ ] **Human Sample:** Manually read 5-10 reviews to calibrate AI's sentiment analysis.

### 📝 Test Plan Generation
*Input: Product Description, Goals, Target Audience.*

```markdown
**Prompt:**
Create a Usability Test Plan for [Product Name].
Target Audience: [e.g., Seniors 65+, Tech-literate]
Core Feature to Test: [e.g., Checkout Flow]
Goal: Identify friction points in the payment process.

Output Structure:
1.  **Screening Criteria:** Who to recruit?
2.  **Scenario:** A realistic situation for the user.
3.  **Tasks:** 3 specific tasks (Start to Finish).
    *   *Task 1:* Find the product.
    *   *Task 2:* Add to cart.
    *   *Task 3:* Complete payment.
4.  **Success Metrics:** Time on task, Error rate.
```

### 🎭 Persona Generation (JTBD Focus)
*Don't just ask for "a persona". Ask for Jobs-to-be-Done.*

```markdown
**Prompt:**
Based on the following product data: [Paste Product Info]
Create 3 User Personas focused on **Jobs-to-be-Done (JTBD)**.
For each persona, define:
1.  **The Situation:** When do they need this?
2.  **The Motivation:** What do they want to change?
3.  **The Outcome:** What does "Success" look like?
4.  **The Friction:** What stops them?
```

---

## 3. 🧰 Tool Stack Selector
*Quickly pick the right tool for the job.*

| Task | Recommended AI Tool | Action |
| :--- | :--- | :--- |
| **Deep Research** | **Perplexity Pro / Gemini** | Search live web, synthesize reports. |
| **Docs Analysis** | **NotebookLM** | Upload PDFs/Docs -> "Chat" with your data. |
| **Personas** | **QoQo / ChatGPT** | Generate data-driven user profiles. |
| **Transcripts** | **Looppanel / Grain** | Auto-transcribe & highlight interviews. |
| **Surveys** | **Poll the People** | Analyze open-ended responses at scale. |
| **Sentiment** | **Brandwatch / Mention** | Track brand sentiment across social. |

---

## 4. 🛑 Common Pitfalls (Checklist)
*   [ ] **Sarcasm Blindness:** AI often misinterprets "Great update, broke everything" as Positive.
*   [ ] **Hallucinated Features:** Verify if competitors actually have the features AI claims.
*   [ ] **Generic Feedback:** If AI says "Improve UI", ask "Which specific element violates heuristics?".