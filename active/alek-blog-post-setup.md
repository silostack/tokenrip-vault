# Blog Post System Setup

This gives you everything needed to run the Intelligence Engine blog post workflow in your Claude Code environment. Three steps: install humanizer, install the skill, drop three files in your vault.

---

## 1. Install the Humanizer Skill

The blog post workflow automatically invokes the humanizer in its final phase. Install it once and it runs on every post.

```bash
mkdir -p ~/.claude/skills
git clone https://github.com/blader/humanizer.git ~/.claude/skills/humanizer
```

Confirm it's in place:

```bash
ls ~/.claude/skills/humanizer
```

---

## 2. Install the Blog Post Skill

Download `blog-post.md` from the linked Tokenrip asset and save it to:

```
~/.claude/commands/blog-post.md
```

This makes `/blog-post` available globally in Claude Code. Alternatively, place it at `.claude/commands/blog-post.md` inside a specific project to scope it to that vault only.

---

## 3. Set Up the Reference Files

The skill reads two files from your vault at runtime. Both are linked as assets in this thread. Download them and place them at the following paths relative to your vault root:

| File | Vault path |
|------|-----------|
| `blog-post-writing.md` | `_system/instructions/blog-post-writing.md` |
| `tokenrip-branding.md` | `product/tokenrip/tokenrip-branding.md` |

You may need to create these directories:

```bash
mkdir -p _system/instructions
mkdir -p product/tokenrip
```

---

## 4. Usage

In Claude Code, run:

```
/blog-post
```

The skill walks through six phases:

1. **Assess inputs** — post type, angles, sources, angle statement
2. **Save sources** — creates `content/sources/<slug>/references.md`
3. **Write draft** — full post in `content/<slug>-draft.md`
4. **Review checkpoint** — loops until you approve the draft
5. **Humanize** — runs the humanizer skill automatically
6. **Complete** — summary of outputs and Tokenrip mention positions

The angle is the most important input. Before starting, have a one-sentence answer to: *"What should a reader believe after reading this that they didn't believe before?"*

---

## What You Need Before Running

- Post type (thesis, comparison, landscape, workflow, craft)
- 3+ primary sources (docs, repos, official sites)
- 2+ community signal sources (Reddit, HN, X threads)
- Clear angle statement
- Optional: target keyword, internal link targets
