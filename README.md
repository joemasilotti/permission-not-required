# Permission Not Required podcast site

Jekyll site for the Permission Not Required podcast.

## Setup

```bash
npm install
bundle install
```

## Development

```bash
bin/start
```

Opens at http://localhost:4001

## Fetching episodes

Pull latest episodes from the RSS feed:

```bash
bin/fetch-episodes
```

This creates/updates markdown files in `_episodes/` from the Riverside RSS feed.

## Structure

```
_episodes/       # Episode markdown files (generated)
_includes/       # Liquid partials
_layouts/        # Page layouts
_data/           # Show metadata (show.yml, hosts.yml)
assets/
  css/           # Tailwind CSS
  javascripts/   # Audio player
  images/        # Podcast artwork
```

## Adding episodes

Run `bin/fetch-episodes` to pull from the RSS feed, or create manually:

```markdown
---
title: Episode title
date: 2026-01-27
number: 1
duration: "00:26:53"
audio_url: https://...
summary: One sentence summary.
---

Full show notes here.
```
