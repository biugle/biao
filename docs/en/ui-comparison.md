# UI and Interaction Comparison

biu's official presets provide a common enterprise shell while leaving page content to the project. Portal Sidebar emphasizes directory navigation; Portal Topbar emphasizes horizontal menu density; independent APPs can use the same presets or Custom.

The shared interaction rules are:

- menus, Tabs and Breadcrumbs use complete stable paths for identity;
- visible text truncates as a single layout unit and full content is available through Tooltip;
- Tooltip placement is configurable and overlays avoid viewport edges;
- Message is centered and stacked; Modal and Drawer close on Escape and backdrop click;
- `fire()` mounts reusable React content under `body` and returns a close handle;
- theme, locale, direction and responsive spacing use shared tokens;
- small screens use compact menus and hide optional middle slots when space is insufficient.

Business pages should not copy the foundation's Layout CSS or implement a second notification/overlay system.
