---
model: haiku
---

# Email Document

You are sending a document or message via email on behalf of Simon using the `.scripts/send-email.py` automation script.

## Email Aliases

**Always expand these aliases to full email addresses before sending:**

| Alias | Email Address |
|-------|---------------|
| `alek` | alek@rebelfi.io |
| `me`, `simon` | simon@rebelfi.io |

When Simon says "email alek" or "cc me", automatically use the corresponding email address. Do not ask for confirmation on alias expansion—just use the mapped address.

## Step 1: Gather Input

If not already provided, ask Simon for:
- **Recipient email address** (required)
- **Subject line** (required - suggest based on context if possible)
- **Email body/message** (required - can be simple text or detailed message)
- **Optional: File to attach** (path to file - suggest if context indicates a document)
- **Optional: CC recipients** (comma-separated email addresses)
- **Optional: BCC recipients** (comma-separated email addresses)
- **Optional: HTML formatting** (ask if the body should be HTML instead of plain text)

**Smart suggestions:**
- If Simon mentions a specific file or document, proactively suggest attaching it
- If sending to team members, suggest CC'ing other relevant people
- For document names, suggest a professional subject line (e.g., "Acme Corp Discovery Prep - [date]")

## Step 2: Validate Inputs

Before sending, validate:

**Email addresses:**
- Check format is valid (contains @, domain, etc.)
- Confirm if addresses look unusual (typos, wrong domain)

**File attachments (if provided):**
- Verify file exists at the given path
- Check file size - warn if > 10MB (some email servers reject large attachments)
- Confirm file extension is appropriate (e.g., `.md`, `.pdf`, `.docx`)

**Markdown files special handling:**
- If the attachment is a `.md` file, **automatically convert to HTML**:
  - Use `--markdown-body` flag to convert markdown to styled HTML email
  - Do NOT ask for confirmation - this is the default behavior
- If Simon specifies to attach the file:
  - Include both `--markdown-body` (for HTML email body) AND `--attachment` (original markdown file)
  - This gives the recipient both a beautiful readable HTML version AND a downloadable copy
- This gives the recipient:
  - ✅ Beautiful, readable HTML email (easy viewing)
  - ✅ Original markdown file attached (for editing/reference if specified)

**Subject and body:**
- **For markdown files**: Automatically extract subject from the first H1 header (# Title) in the markdown file
  - Read the file and look for the first line starting with `# `
  - Use that header text as the subject line (strip the `# ` prefix)
  - Example: If markdown starts with `# Sales Learning: Reap (2025-11-10)`, use "Sales Learning: Reap (2025-11-10)" as subject
  - If no H1 header found, fall back to filename-based subject
- Ensure neither subject nor body is empty
- If body is very short (< 10 words) and not using markdown conversion, confirm this is intentional

**SMTP configuration:**
- Verify `.claude/config.json` exists
- If not configured, tell Simon: "Email config not found. Please copy `.claude/config.json.example` to `.claude/config.json` and fill in your SMTP settings."

## Step 3: Send Immediately (No Confirmation Required)

**For markdown files**: Automatically send after conversion without asking for confirmation.

**For non-markdown emails**: If sending a custom message or non-markdown attachment, still confirm before sending to ensure the message is correct.

Present a brief sending notification:

```
Sending email to recipient@example.com...
Converting markdown to HTML...
✓ Email sent successfully
```

## Step 4: Send Email

Execute the Python script with proper arguments:

**Standard email (text or HTML body):**
```bash
python3 .scripts/send-email.py \
  --to "recipient@example.com" \
  --subject "Subject Line" \
  --body "Email body text here" \
  [--cc "person2@example.com,person3@example.com"] \
  [--bcc "person4@example.com"] \
  [--attachment "/full/path/to/file.pdf"] \
  [--html]
```

**Markdown file with conversion (recommended for .md files):**
```bash
python3 .scripts/send-email.py \
  --to "recipient@example.com" \
  --subject "Subject Line" \
  --markdown-body "/full/path/to/file.md" \
  [--attachment "/full/path/to/file.md"] \
  [--cc "person2@example.com,person3@example.com"] \
  [--bcc "person4@example.com"]
```

**Note:** When using `--markdown-body`, the markdown file is converted to beautifully styled HTML for the email body. If `--attachment` is specified, the original markdown file is also attached for reference/editing—giving the recipient both readable HTML and a downloadable copy.

**Error handling:**
- If the script fails, show the error message to Simon
- Common issues:
  - Authentication failure → Check SMTP username/password in config
  - Connection refused → Check SMTP server/port in config
  - File not found → Verify attachment path
  - Config missing → Direct Simon to create `.claude/config.json`

## Step 5: Confirmation

After successful send, provide clear confirmation:

```
✓ Email sent successfully

To: recipient@example.com
Subject: [subject line]
Attachment: filename.ext (if applicable)
```

## Important Notes

**Configuration file:**
- SMTP settings are stored in `.claude/config.json`
- This file is gitignored to prevent credential leaks
- Template available at `.claude/config.json.example`

**Security:**
- Config file contains SMTP password in plaintext (stored locally only)
- Never display the password or full config contents
- If Simon asks about security, mention macOS Keychain as a future enhancement

**File paths:**
- Always use absolute paths for attachments
- If Simon provides a relative path, resolve it from the vault root: `/Users/si/rebelfi-vault/`
- Common locations:
  - `active/` - work-in-progress documents
  - `sales/pipeline/` - customer notes
  - `market/research/` - research documents

**Markdown files:**
- If attaching `.md` files to external recipients, consider suggesting PDF conversion first
- Markdown is fine for internal team communication

**Professional tone:**
- For customer/prospect emails, suggest professional subject lines and body text
- For internal team emails, can be more casual
- Match Simon's tone from the request

## Examples

**Example 1: Markdown file with alias expansion (no confirmation needed)**
```
User: /email the Rojifi discovery prep to alek

Claude: Sending email to alek@rebelfi.io...
Converting active/rojifi-discovery-prep.md to HTML...
✓ Markdown converted to styled HTML
✓ Email sent successfully to alek@rebelfi.io
  Subject: Rojifi Discovery Prep - Nov 5, 2025
```

**Example 2: Simple text email with attachment**
```
User: /email the Q4 report PDF to investor@example.com

Claude: I'll send the Q4 report to investor@example.com.

What should the subject line be?
[Simon provides: Q4 2025 Financial Report]

What message should I include in the email body?
[Simon provides message]

Ready to send email:

To: investor@example.com
Subject: Q4 2025 Financial Report
Body: [message preview]
Attachment: q4-report.pdf (2.3 MB)
Format: Plain text

Proceed with sending? [waits for confirmation]
```

**Example 3: Email with CC alias and custom message**
```
User: /email update to leads@rebelfi.io and CC alek

Claude: I'll compose an email to the leads address with Alek CC'd (alek@rebelfi.io).

What should the subject line be?
[Simon provides subject]

What's the email body?
[Simon provides body]

Ready to send email:

To: leads@rebelfi.io
CC: alek@rebelfi.io
Subject: [subject]
Body: [preview]
Format: Plain text

Proceed with sending? [waits for confirmation]
```

**Example 4: CC'ing yourself**
```
User: /email the proposal to prospect@company.com and cc me

Claude: Sending email to prospect@company.com (CC: simon@rebelfi.io)...
```

## Quality Checklist

Before sending, verify:
1. ✅ Recipient email address is correct (no typos)
2. ✅ Subject line is professional and descriptive (auto-extracted from H1 for markdown)
3. ✅ Email body is appropriate for the recipient
4. ✅ If sending .md file: automatically using markdown-to-HTML conversion (no confirmation needed)
5. ✅ File size is reasonable (< 10MB ideally)
6. ✅ CC/BCC recipients are intentional
7. ✅ For non-markdown emails: obtain confirmation from Simon before sending

**If something seems off (wrong recipient, unusual request), ask Simon to clarify before proceeding.**

## Markdown Conversion Benefits

When sending markdown files with `--markdown-body`:
- ✅ **Professional appearance**: Styled headings, code blocks, lists, blockquotes
- ✅ **Email-client friendly**: Inline CSS works in Gmail, Outlook, Apple Mail
- ✅ **Readable immediately**: No need to download/open file to read content
- ✅ **Clean inbox**: No attachments cluttering the inbox
- ✅ **Automatic conversion**: Uses pandoc (already installed), no manual work

**Always use this for .md files—no attachments needed.**
