# Directive: [Workflow Name]

> **Purpose:** [1-sentence business purpose of this automation workflow]

## Goal
[Explain what this workflow accomplishes and what business bottleneck it solves]

## Inputs

| Input | Required | Description / Example |
|---|---|---|
| `--param1` | Yes | Target entity or API identifier |
| `--param2` | No | Optional configuration flag |

## Execution Scripts
- `python execution/workflow_script.py --param1 <value>`

## Outputs
- Data logged or updated in target API / Google Sheets / CRM
- Formatted Slack alert sent to target channel
