#!/usr/bin/env python3
"""
Email sending script for Claude Code slash commands.
Converts markdown to email-friendly HTML with proper CSS inlining.

Usage:
    python3 send-email.py --to recipient@example.com --subject "Subject" --body "Message body"

Optional arguments:
    --cc email1,email2          CC recipients (comma-separated)
    --bcc email1,email2         BCC recipients (comma-separated)
    --attachment /path/to/file  File to attach
    --html                      Treat body as HTML (default: plain text)
    --markdown-body /path/to/file.md  Convert markdown file to styled HTML for body

Dependencies:
    pip install --break-system-packages mistune css-inline
"""

import smtplib
import json
import sys
import os
import argparse
import re
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from pathlib import Path

# External dependencies for markdown conversion
try:
    import mistune
    import css_inline
except ImportError as e:
    print(f"Error: Required library not installed: {e}", file=sys.stderr)
    print("Install with: pip install --break-system-packages mistune css-inline", file=sys.stderr)
    sys.exit(1)


def load_config():
    """Load email configuration from .claude/config.json"""
    config_path = Path(__file__).parent.parent / ".claude" / "config.json"

    if not config_path.exists():
        print(f"Error: Config file not found at {config_path}", file=sys.stderr)
        print("Please create .claude/config.json with your SMTP settings.", file=sys.stderr)
        print("See .claude/config.json.example for template.", file=sys.stderr)
        sys.exit(1)

    try:
        with open(config_path) as f:
            config = json.load(f)

        email_config = config.get("email", {})

        # Validate required fields
        required = ["smtp_server", "smtp_port", "smtp_username", "smtp_password", "from_email"]
        missing = [field for field in required if not email_config.get(field)]

        if missing:
            print(f"Error: Missing required config fields: {', '.join(missing)}", file=sys.stderr)
            sys.exit(1)

        return email_config

    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in config file: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error reading config: {e}", file=sys.stderr)
        sys.exit(1)


def preprocess_obsidian_markdown(text):
    """Convert Obsidian-specific markdown syntax to standard markdown."""

    # Convert wiki-links [[Note Name]] to standard markdown links [Note Name](Note Name)
    # Remove them entirely for email since they won't work
    text = re.sub(r'\[\[([^\]]+)\]\]', r'\1', text)

    # Strip standalone tags (e.g., #tagname)
    # Keep them in headings but remove standalone ones
    text = re.sub(r'(?<!\S)#([\w-]+)(?!\S)', r'', text)

    # Convert Obsidian callouts to blockquotes with bold labels
    # e.g., > [!note] becomes > **Note:**
    text = re.sub(r'>\s*\[!(\w+)\]', lambda m: f'> **{m.group(1).title()}:**', text)

    # Strip YAML front matter (lines between --- at start of file)
    text = re.sub(r'^---\s*\n.*?\n---\s*\n', '', text, flags=re.DOTALL)

    return text


def markdown_to_html(markdown_file):
    """Convert markdown file to HTML using Mistune."""

    # Read markdown file
    markdown_path = Path(markdown_file)
    if not markdown_path.exists():
        print(f"Error: Markdown file not found: {markdown_file}", file=sys.stderr)
        sys.exit(1)

    try:
        with open(markdown_path, 'r', encoding='utf-8') as f:
            markdown_content = f.read()
    except Exception as e:
        print(f"Error reading markdown file: {e}", file=sys.stderr)
        sys.exit(1)

    # Preprocess Obsidian-specific syntax
    markdown_content = preprocess_obsidian_markdown(markdown_content)

    # Convert markdown to HTML using Mistune
    try:
        html_content = mistune.html(markdown_content)
        return html_content
    except Exception as e:
        print(f"Error converting markdown to HTML: {e}", file=sys.stderr)
        sys.exit(1)


def apply_email_styles(html_content):
    """Apply inline styles to HTML for email client compatibility using css_inline."""

    # Email-safe CSS template with styles that will be inlined
    email_template = f'''<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        /* Base styles */
        body {{
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            font-size: 16px;
            line-height: 1.6;
            color: #333;
            max-width: 720px;
            margin: 0;
            padding: 20px;
        }}

        /* Headings */
        h1 {{
            font-size: 28px;
            font-weight: 600;
            margin-top: 24px;
            margin-bottom: 16px;
            color: #1a1a1a;
            border-bottom: 2px solid #e1e4e8;
            padding-bottom: 8px;
        }}
        h2 {{
            font-size: 24px;
            font-weight: 600;
            margin-top: 24px;
            margin-bottom: 16px;
            color: #1a1a1a;
            border-bottom: 1px solid #e1e4e8;
            padding-bottom: 6px;
        }}
        h3 {{
            font-size: 20px;
            font-weight: 600;
            margin-top: 20px;
            margin-bottom: 12px;
            color: #1a1a1a;
        }}
        h4 {{
            font-size: 18px;
            font-weight: 600;
            margin-top: 16px;
            margin-bottom: 12px;
            color: #1a1a1a;
        }}
        h5 {{
            font-size: 16px;
            font-weight: 600;
            margin-top: 16px;
            margin-bottom: 8px;
            color: #1a1a1a;
        }}
        h6 {{
            font-size: 14px;
            font-weight: 600;
            margin-top: 16px;
            margin-bottom: 8px;
            color: #6a737d;
        }}

        /* Text elements */
        p {{
            margin-top: 0;
            margin-bottom: 16px;
        }}
        a {{
            color: #0366d6;
            text-decoration: none;
        }}
        strong {{
            font-weight: 600;
        }}
        em {{
            font-style: italic;
        }}

        /* Lists */
        ul, ol {{
            margin-top: 0;
            margin-bottom: 16px;
            padding-left: 2em;
        }}
        li {{
            margin-bottom: 4px;
        }}

        /* Code */
        code {{
            font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
            font-size: 14px;
            background-color: #f6f8fa;
            padding: 2px 6px;
            border-radius: 3px;
        }}
        pre {{
            font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
            font-size: 14px;
            background-color: #f6f8fa;
            padding: 16px;
            border-radius: 6px;
            overflow-x: auto;
            margin-bottom: 16px;
        }}

        /* Blockquotes */
        blockquote {{
            margin: 0;
            padding: 0 1em;
            color: #6a737d;
            border-left: 4px solid #dfe2e5;
            margin-bottom: 16px;
        }}

        /* Tables */
        table {{
            border-collapse: collapse;
            width: 100%;
            margin-bottom: 16px;
        }}
        th {{
            padding: 8px 12px;
            border: 1px solid #dfe2e5;
            background-color: #f6f8fa;
            font-weight: 600;
        }}
        td {{
            padding: 8px 12px;
            border: 1px solid #dfe2e5;
        }}

        /* Other */
        hr {{
            height: 2px;
            padding: 0;
            margin: 24px 0;
            background-color: #e1e4e8;
            border: 0;
        }}
        img {{
            max-width: 100%;
            height: auto;
        }}
    </style>
</head>
<body>
{html_content}
</body>
</html>'''

    # Use css_inline to convert all CSS to inline style attributes
    try:
        email_html = css_inline.inline(email_template)
        return email_html
    except Exception as e:
        print(f"Warning: CSS inlining failed: {e}", file=sys.stderr)
        print("Falling back to template with embedded CSS", file=sys.stderr)
        return email_template


def send_email(to, subject, body, cc=None, bcc=None, attachment=None, is_html=False, config=None):
    """Send an email with optional attachment and CC/BCC recipients."""

    if config is None:
        config = load_config()

    # Create message
    msg = MIMEMultipart()
    msg['From'] = f"{config.get('from_name', config['from_email'])} <{config['from_email']}>"
    msg['To'] = to
    msg['Subject'] = subject

    if cc:
        msg['Cc'] = cc

    # Add body (HTML or plain text)
    body_type = 'html' if is_html else 'plain'
    msg.attach(MIMEText(body, body_type))

    # Add attachment if provided
    if attachment:
        attachment_path = Path(attachment)

        if not attachment_path.exists():
            print(f"Error: Attachment file not found: {attachment}", file=sys.stderr)
            sys.exit(1)

        # Check file size (warn if > 10MB)
        file_size_mb = attachment_path.stat().st_size / (1024 * 1024)
        if file_size_mb > 10:
            print(f"Warning: Large attachment ({file_size_mb:.1f}MB). Some email servers may reject this.", file=sys.stderr)

        try:
            with open(attachment_path, 'rb') as f:
                part = MIMEBase('application', 'octet-stream')
                part.set_payload(f.read())

            encoders.encode_base64(part)
            part.add_header(
                'Content-Disposition',
                f'attachment; filename= {attachment_path.name}',
            )
            msg.attach(part)

        except Exception as e:
            print(f"Error attaching file: {e}", file=sys.stderr)
            sys.exit(1)

    # Collect all recipients (To, CC, BCC)
    recipients = [to]
    if cc:
        recipients.extend(cc.split(','))
    if bcc:
        recipients.extend(bcc.split(','))

    # Clean up email addresses (strip whitespace)
    recipients = [r.strip() for r in recipients]

    # Send email
    try:
        with smtplib.SMTP(config['smtp_server'], config['smtp_port']) as server:
            server.starttls()
            server.login(config['smtp_username'], config['smtp_password'])
            server.send_message(msg)

        print(f"✓ Email sent successfully to {to}")
        if cc:
            print(f"  CC: {cc}")
        if bcc:
            print(f"  BCC: {bcc}")
        if attachment:
            print(f"  Attachment: {Path(attachment).name}")

        return True

    except smtplib.SMTPAuthenticationError:
        print("Error: SMTP authentication failed. Check username/password.", file=sys.stderr)
        sys.exit(1)
    except smtplib.SMTPException as e:
        print(f"Error: SMTP error occurred: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error: Failed to send email: {e}", file=sys.stderr)
        sys.exit(1)


def main():
    parser = argparse.ArgumentParser(
        description="Send email via SMTP using configuration from .claude/config.json"
    )
    parser.add_argument('--to', required=True, help='Recipient email address')
    parser.add_argument('--subject', required=True, help='Email subject')
    parser.add_argument('--body', help='Email body (text or HTML)')
    parser.add_argument('--cc', help='CC recipients (comma-separated)')
    parser.add_argument('--bcc', help='BCC recipients (comma-separated)')
    parser.add_argument('--attachment', help='Path to file to attach')
    parser.add_argument('--html', action='store_true', help='Treat body as HTML')
    parser.add_argument('--markdown-body', help='Convert markdown file to styled HTML for body')

    args = parser.parse_args()

    # Load config
    config = load_config()

    # Handle markdown conversion if requested
    body = args.body
    is_html = args.html

    if args.markdown_body:
        if args.body:
            print("Warning: --markdown-body overrides --body argument", file=sys.stderr)

        # Convert markdown to HTML
        print(f"Converting {args.markdown_body} to HTML...")
        raw_html = markdown_to_html(args.markdown_body)
        body = apply_email_styles(raw_html)
        is_html = True
        print("✓ Markdown converted to styled HTML")

    # Validate body exists
    if not body:
        print("Error: Either --body or --markdown-body is required", file=sys.stderr)
        sys.exit(1)

    # Send email
    send_email(
        to=args.to,
        subject=args.subject,
        body=body,
        cc=args.cc,
        bcc=args.bcc,
        attachment=args.attachment,
        is_html=is_html,
        config=config
    )


if __name__ == '__main__':
    main()
