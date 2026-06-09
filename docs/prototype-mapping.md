# Prototype Mapping

The pasted UI prototype is reference material and should be preserved. This skeleton creates route-level insertion points only; it does not convert or redesign the full prototype.

## Screens Found

- Landing Page.
- New Analysis Workspace.
- Sidebar Navigation.
- Project Workspace Dashboard.
- Paper Workspace.
- Paper Overview.
- AI Suggestion Review.
- AI Analysis.
- Extraction Matrix.
- Project Tools.

## Route Mapping

- Landing Page -> `/`
- New Analysis Workspace -> `/new`
- Project Workspace Dashboard -> `/projects/[projectId]`
- Paper list/library -> `/projects/[projectId]/papers`
- Paper Workspace -> `/projects/[projectId]/papers/[paperId]`
- Paper Overview -> `/projects/[projectId]/overview`
- AI Analysis -> `/projects/[projectId]/analysis`
- AI Suggestion Review -> `/projects/[projectId]/review`
- Extraction Matrix -> `/projects/[projectId]/matrix`
- Project Tools -> `/projects/[projectId]/tools`
- Theme Clustering -> `/projects/[projectId]/themes`
- Gap Map -> `/projects/[projectId]/gaps`
- Argument Candidates -> `/projects/[projectId]/arguments`
- Innovation Opportunities -> `/projects/[projectId]/innovation`
- Writing Plan -> `/projects/[projectId]/writing-plan`
- Presentation Plan -> `/projects/[projectId]/presentation-plan`
- Export -> `/projects/[projectId]/export`

## Reusable Components To Preserve Or Extract Later

- Top navigation.
- Sidebar navigation.
- Workspace shell.
- Project header.
- Stage tabs.
- Upload dropzone.
- PDF viewer shell.
- Suggestion cards.
- Matrix table.
- Status, source, evidence, and confidence badges.
- Evidence list.
- Project tool cards.

Do not fully refactor the prototype UI until the route mapping and component extraction approach are approved for an implementation phase.
