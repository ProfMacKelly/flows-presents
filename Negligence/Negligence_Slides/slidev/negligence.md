---
theme: default
# random image from a curated Unsplash collection by Anthony
# like them? see https://unsplash.com/collections/94734566/slidev
background: none
# some information about your slides (markdown enabled)
title: Negligence
# apply UnoCSS classes to the current slide
class: text-center
# https://sli.dev/features/drawing
drawings: false
# slide transition: https://sli.dev/guide/animations.html#slide-transitions
transition: slide-left
# enable MDC Syntax: https://sli.dev/features/mdc
mdc: true
layout: center
alias: start
---
# Negligence
   
---
layout: center
alias: overview
---

# Overview: Negligence in General

<v-clicks>

1. **_Prima Facie_ Case for Liability**  
   > **Note:** "*Prima facie* case" means: <br>
    **a.** P has alleged sufficient evidence to support a claim at **face value**, and <br>
    **b.** P's evidence is rebuttable by defenses.
   - **Duty** (to others)
   - **Breach** (of duty)
   - **Damages** (suffered by another)
   - **Causation** (of damages)

2. **Defenses to Liability**
   - Failure of Proof
   - Affirmative Defenses

</v-clicks>

---
layout: center
alias: overview_map
---
![Negligence Overview](https://profmackelly.github.io/text-project/Negligence/Negligence_Slides/slidev/neg_overview.png)

---


<Transform :scale="0.82" origin="center">

```mermaid
flowchart TB 
    start["**START HERE**"] --> du["**Element: Duty**<br>Did D owe a<br/>**legal duty** to P?"]
    du -- **No** --> not_liab["**STOP:<br>Not Liable**"]
    du -- **Yes** --> da["**Element: Damages**<br>Did P suffer **damages** (aka harm, injury, loss)?"]
    da -- **No** --> not_liab
    da -- **Yes** --> br["**Element: Breach**<br>Did D **breach** their duty?"]
    br -- **No** --> not_liab
    br -- **Yes** --> ca["**Element: Causation**<br>Did D's conduct **cause** P's harm?"]
    ca -- **No** --> not_liab
    ca -- **Yes** --> pf(["**The D has a prima facie case for negligence**"])
    pf --> def[Does D have an **affirmative defense**?]
    def -- **No** --> liable["**D is liable**"]
    def -- **Yes** --> not_liab
    
    start@{ shape: terminal}
    not_liab@{ shape: terminal}
    style start stroke-width:2.5px,stroke-dasharray: 2,fill:#fafafa,stroke:#000000
    style not_liab stroke-width:2.5px,fill:#FFF8F8,stroke:#880101
    liable@{ shape: diamond}
    style liable stroke-width:2.5px,fill:#ebf5eb,stroke:#2c5e36
    style pf stroke-width:2.5px,fill:#e1f5fe,stroke:#01579b
```
</Transform>

---
layout: two-cols
alias: zoom_duty
---

<v-clicks>

 - Duty
 - If No → Not Liable
 - If Yes → Damages?

</v-clicks>
::right::
```mermaid
flowchart TB 
    start["**START HERE**"] --> du["**Element: Duty**<br>Did D owe a<br/>**legal duty** to P?"]
    du -- **No** --> not_liab["**STOP:<br>Not Liable**"]
    du -- **Yes** --> da["**Element: Damages**<br>Did P suffer **damages** (aka harm, injury, loss)?"]
    
    start@{ shape: terminal}
    not_liab@{ shape: terminal}
    style start stroke-width:2.5px,stroke-dasharray: 2,fill:#fafafa,stroke:#000000
    style not_liab stroke-width:2.5px,fill:#FFF8F8,stroke:#880101
```
---


---

layout: two-cols
alias: overview_map
---
<Transform :scale="0.75" origin="center">
```mermaid 
flowchart TB 
    start["**START HERE**"] --> du["**Element: Duty**<br>Did D owe a<br/>**legal duty** to P?"]
    du -- **No** --> not_liab["**STOP:<br>Not Liable**"]
    du -- **Yes** --> da["**Element: Damages**<br>Did P suffer **damages** (aka harm, injury, loss)?"]
    da -- **No** --> not_liab
    da -- **Yes** --> br["**Element: Breach**<br>Did D **breach** their duty?"]
    br -- **No** --> not_liab
    br -- **Yes** --> ca["**Element: Causation**<br>Did D's conduct **cause** P's harm?"]
    ca -- **No** --> not_liab
    ca -- **Yes** --> pf(["**The D has a prima facie case for negligence**"])
    pf --> def[Does D have an **affirmative defense**?]
    def -- **No** --> liable["**D is liable**"]
    def -- **Yes** --> not_liab
    
    start@{ shape: terminal}
    not_liab@{ shape: terminal}
    style start stroke-width:2.5px,stroke-dasharray: 2,fill:#fafafa,stroke:#000000
    style not_liab stroke-width:2.5px,fill:#FFF8F8,stroke:#880101
    liable@{ shape: diamond}
    style liable stroke-width:2.5px,fill:#ebf5eb,stroke:#2c5e36
    style pf stroke-width:2.5px,fill:#e1f5fe,stroke:#01579b
```
</Transform>
---

# Element 1: Duty
Did D have a duty to P?

```mermaid {scale: 0.5}
graph TD
    z1["**START HERE**"] --> du["Did D owe a<br/>**legal duty** to P?"]
    du -- **No** --> z2["**STOP:<br>Not Liable**"]
    du -- **Yes** --> da["Did P suffer damages (aka harm, injury, loss)?"]
    da -- **No** --> z2
    da -- **Yes** --> b["Did D breach their duty?"]
    b -- **No** --> z2
    b -- **Yes** --> ca@{ label: "Did D's conduct cause P's harm?" }
    ca -- **No** --> z2
    ca -- **Yes** --> p["**The D has a prima facie case for negligence**"]
    p --> aa[Is there an **affirmative defense**?]
    aa -- **No** --> l["**D is liable**"]
    aa -- **Yes** --> z2
```
---
layout: center
class: text-center
alias: not_liable
---

# Outcome
D is not liable for negligence.

---
layout: center
alias: breach
decision: true
question: "Breach?"
yesTarget: causation
noTarget: not_liable
---

# Element 2: Breach
Did D breach the duty to P?

```mermaid
graph TD
    Q2{Breach?}
    Q2 -->|Yes| Next[Go to Causation]
    Q2 -->|No| End[No Liability]
    style Q2 stroke-width:4px,stroke:#4ade80
```
---
layout: center
alias: causation
decision: true
question: "Causation?"
yesTarget: damages
noTarget: not_liable
---
# Element 3: Causation
Did the defendant's breach cause harm?

```mermaid
graph TD
    Q3{Causation?}
    Q3 -->|Yes| Next[Go to Damages]
    Q3 -->|No| End[No Liability]
    style Q3 stroke-width:4px,stroke:#4ade80
```
---
layout: center
alias: damages
decision: true
question: "Causation?"
yesTarget: 4
noTarget: 7
dragPos:
  square: -109,0,0,0
---

```mermaid
graph TB

    z1["**START HERE**"] --> du["**Element: Duty**<br>Did D owe a<br/>**legal duty** to P?"]
    du -- **No** --> z2["**STOP:<br>Not Liable**"]
    du -- **Yes** --> da["**Element: Damages**<br>Did P suffer **damages** (aka harm, injury, loss)?"]
    da -- **No** --> z2
    da -- **Yes** --> b["**Element: Breach**<br>Did D **breach** their duty?"]
    b -- **No** --> z2
    b -- **Yes** --> ca["**Element: Causation**<br>Did D's conduct **cause** P's harm?"]
    ca -- **No** --> z2
    ca -- **Yes** --> p["**The D has a prima facie case for negligence**"]
    p --> aa[Does D have an **affirmative defense**?]
    aa -- **No** --> li["**D is liable**"]
    aa -- **Yes** --> z2
    
    z1@{ shape: terminal}
    z2@{ shape: terminal}
    style z1 stroke-width:2.5px,stroke-dasharray: 2,fill:#fafafa,stroke:#000000
    style z2 stroke-width:2.5px,fill:#FFCDD2,stroke:#e52437
    li@{ shape: diamond}
    style li stroke-width:2.5px,fill:#edffeb,stroke:#19531c
```
