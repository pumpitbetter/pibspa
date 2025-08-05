# Program Documentation Generation Prompt

## Objective
Generate comprehensive end-user documentation for each built-in workout program in the app. Each program should have its own markdown file saved under `docs/programs/`.

## Documentation Structure

### 1. Overview (Brief & Compelling)
- Concise program description (2-3 sentences)
- Training structure and frequency
- Primary training goals (strength, hypertrophy, etc.)

### 2. Target Audience Analysis
- **Experience Level:** Beginner, Intermediate, or Advanced
- **Detailed Reasoning:** Why this level? What prerequisites?
- **Who Should Avoid:** Clear contraindications

### 3. Implementation Guide
- **Weekly Schedule:** Specific day-by-day breakdown
- **Rest Periods:** Specific timing for different exercise types
- **Training Frequency:** Sessions per week, rest days
- **Session Duration:** Expected workout length

### 4. Detailed Workout Breakdown
- **Exercise Tables:** Exercise name, sets×reps, rest periods, progression type
- **Exercise Categories:** Compound vs isolation identification
- **Muscle Group Targeting:** Clear muscle emphasis per day

### 5. Progression System (Critical Section)
- **Detailed Methodology:** Step-by-step progression explanation
- **Concrete Examples:** Real weight/rep progressions with numbers
- **Visual Charts:** Mermaid diagrams showing progression flow
- **App Integration:** How automatic tracking works

### 6. Deload Protocol
- **Trigger Conditions:** When deloads occur (failure thresholds)
- **Deload Method:** Percentage reductions, rep resets
- **Recovery Strategy:** How to resume progression

### 7. Program Analysis
- **Volume Distribution:** Sets per muscle group per week
- **Push/Pull Balance:** Percentage breakdown
- **Upper/Lower Balance:** Volume distribution
- **Exercise Variety:** Compound/isolation ratios, equipment needs

### 8. Training Goals & Adaptations
- **Primary Goal:** Main training adaptation
- **Secondary Benefits:** Additional outcomes
- **Expected Timeline:** Realistic progression expectations

### 9. Equipment & Setting Requirements
- **Gym Type Suitability:** Full gym, home gym, basic setup ratings
- **Essential Equipment:** Must-have equipment list
- **Alternative Options:** Substitutions for limited equipment

### 10. Success Guidelines
- **DO's:** Positive recommendations for success
- **DON'Ts:** Common mistakes to avoid
- **Burnout Prevention:** Recovery and stress management
- **Injury Prevention:** Safety considerations

### 11. Program Duration & Transitions
- **Recommended Duration:** Minimum, optimal, maximum timeframes
- **Progress Indicators:** When to continue vs. change programs
- **Expected Timeline:** Phase-by-phase adaptation expectations

### 12. FAQ Section
- **Common Questions:** Address typical user concerns
- **Practical Issues:** Schedule conflicts, substitutions, modifications

## Technical Requirements

### Data Sources
- Extract information from program database files:
  - `programs-[name].ts` - Basic program info
  - `routines-[name].ts` - Day structure
  - `templates-[name].ts` - Exercise details, sets, reps, progression configs

### Charts & Visuals
- Use Mermaid syntax for progression flow charts
- Create tables for exercise breakdowns
- Include volume distribution charts where helpful

### Writing Style
- **Clear & Accessible:** Avoid overly technical jargon
- **Actionable:** Specific, implementable advice
- **Evidence-Based:** Reference progression methodologies
- **User-Focused:** Address real user needs and concerns

## Validation Checklist
Before finalizing each program document:
- [ ] Progression examples include real numbers
- [ ] Volume analysis includes specific set counts
- [ ] Equipment requirements are clearly stated
- [ ] Success recommendations are actionable
- [ ] FAQ addresses practical concerns
- [ ] Target audience analysis is well-justified
- [ ] Deload protocol matches app implementation

## Iteration Process
1. Generate initial documentation for one program
2. Request feedback on structure, content, and clarity
3. Refine prompt based on feedback
4. Apply improvements to remaining programs

## Output Format
- One markdown file per program: `[program-name].md`
- Consistent formatting and section structure
- Clear headings and subheadings for easy navigation
- Tables and charts where appropriate
