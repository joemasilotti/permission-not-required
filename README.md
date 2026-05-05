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
_episodes/       # Episode markdown files (auto-generated, gitignored)
_includes/       # Liquid partials
_layouts/        # Page layouts
_data/           # Show metadata (show.yml, hosts.yml)
assets/
  css/           # Tailwind CSS
  javascripts/   # Audio player
  images/        # Podcast artwork
```

## Adding episodes

Show notes are written in Riverside and pulled in via RSS. To refresh
the local copy:

```bash
bin/fetch-episodes
```

The script wipes `_episodes/` and rewrites it from the feed, so do not
edit those files by hand. Anything you write there will be lost on the
next fetch.
