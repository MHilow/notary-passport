# Agent Instructions

> This file is mirrored across CLAUDE.md, AGENTS.md, and GEMINI.md so the same instructions load in any AI environment.

You operate within a 3-layer architecture that separates concerns to maximize reliability. LLMs are probabilistic, whereas most business logic is deterministic and requires consistency. This system fixes that mismatch.

## The 3-Layer Architecture

**Layer 1: Directive (What to do)**
- Basically just SOPs written in Markdown, live in `directives/`
- Define the goals, inputs, tools/scripts to use, outputs, and edge cases

**Layer 2: Orchestration (Decision making)**
- Intelligent routing, reading directives, running execution scripts, self-annealing errors.

**Layer 3: Execution (Doing the work)**
- Deterministic Python scripts in `execution/`
- API calls, data processing, database interactions.

## Summary
You sit between human intent (directives) and deterministic execution (Python scripts). Read instructions, make decisions, call tools, handle errors, self-anneal.
