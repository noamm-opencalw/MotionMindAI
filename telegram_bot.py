#!/usr/bin/env python3
"""Telegram bot that bridges messages to Claude Code CLI."""

import os
import json
import subprocess
import asyncio
from dotenv import load_dotenv
from telegram import Update
from telegram.ext import Application, MessageHandler, CommandHandler, filters, ContextTypes

load_dotenv()

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
CHANNEL_ID = int(os.getenv("TELEGRAM_CHANNEL_ID"))
PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))

# Conversation history file for continuity
CONVERSATION_FILE = os.path.join(PROJECT_DIR, ".telegram_conversation_id")

# System prompt so Claude knows what it's doing
SYSTEM_PROMPT = (
    "You are a coding assistant controlling the MotionMindAI project via Telegram. "
    "The user sends you instructions from Telegram and you execute them in the project directory. "
    "You have full access to read, edit, and create files. "
    "Be concise in responses — Telegram messages have a 4096 char limit. "
    "When you make changes, briefly describe what you did."
)


def get_conversation_id():
    """Get the current conversation ID for session continuity."""
    if os.path.exists(CONVERSATION_FILE):
        with open(CONVERSATION_FILE) as f:
            return f.read().strip()
    return None


def save_conversation_id(conv_id):
    """Save conversation ID for session continuity."""
    with open(CONVERSATION_FILE, "w") as f:
        f.write(conv_id)


async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Forward message to Claude Code and return the response."""
    message = update.message or update.channel_post
    if not message or not message.text:
        return

    if message.text.startswith("/"):
        return

    prompt = message.text
    chat_id = message.chat_id

    # Send "thinking" indicator
    thinking_msg = await context.bot.send_message(
        chat_id=chat_id, text="⏳ Running Claude Code..."
    )

    try:
        # Build command with conversation continuity
        cmd = [
            "claude",
            "-p",
            prompt,
            "--output-format", "text",
            "--allowedTools", "Edit", "Write", "Read", "Glob", "Grep", "Bash",
        ]

        # Resume conversation if we have one
        conv_id = get_conversation_id()
        if conv_id:
            cmd.extend(["--resume", conv_id])

        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=300,
            cwd=PROJECT_DIR,
        )

        output = result.stdout.strip() or result.stderr.strip() or "No output."

        # Try to extract and save conversation ID from stderr
        # Claude CLI prints session info to stderr
        if result.stderr:
            for line in result.stderr.split("\n"):
                if "conversation" in line.lower() or "session" in line.lower():
                    pass  # Could parse session ID here

        # Telegram has a 4096 char limit per message
        if len(output) > 4000:
            chunks = [output[i : i + 4000] for i in range(0, len(output), 4000)]
            for chunk in chunks:
                await context.bot.send_message(chat_id=chat_id, text=chunk)
        else:
            await context.bot.send_message(chat_id=chat_id, text=output)

    except subprocess.TimeoutExpired:
        await context.bot.send_message(
            chat_id=chat_id, text="⏱ Claude Code timed out (5 min limit)."
        )
    except Exception as e:
        await context.bot.send_message(
            chat_id=chat_id, text=f"Error: {e}"
        )
    finally:
        try:
            await thinking_msg.delete()
        except Exception:
            pass


async def reset(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /reset command — start a new conversation."""
    msg = update.message or update.channel_post
    if os.path.exists(CONVERSATION_FILE):
        os.remove(CONVERSATION_FILE)
    await context.bot.send_message(
        chat_id=msg.chat_id, text="🔄 Conversation reset. Next message starts fresh."
    )


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /start command."""
    msg = update.message or update.channel_post
    await context.bot.send_message(
        chat_id=msg.chat_id,
        text=(
            "MotionMindAI Claude Code Bot\n\n"
            "Send any message and I'll run it through Claude Code "
            "in the MotionMindAI project directory.\n\n"
            "Commands:\n"
            "/status - Show git status\n"
            "/reset - Start a new conversation\n\n"
            "Examples:\n"
            '- "list all API endpoints"\n'
            '- "add a health check endpoint"\n'
            '- "explain the auth flow"'
        ),
    )


async def status(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /status command."""
    msg = update.message or update.channel_post
    result = subprocess.run(
        ["git", "status", "--short"],
        capture_output=True, text=True, cwd=PROJECT_DIR,
    )
    git_status = result.stdout.strip() or "Clean working tree"
    await context.bot.send_message(
        chat_id=msg.chat_id,
        text=f"📁 Project: {PROJECT_DIR}\n\n{git_status}",
    )


def main():
    print(f"Starting MotionMindAI Telegram bot...")
    print(f"Project dir: {PROJECT_DIR}")

    app = Application.builder().token(BOT_TOKEN).build()

    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("status", status))
    app.add_handler(CommandHandler("reset", reset))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

    print("Bot is running. Send a message in Telegram!")
    app.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == "__main__":
    main()
