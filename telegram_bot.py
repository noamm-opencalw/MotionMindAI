#!/usr/bin/env python3
"""Telegram bot that bridges messages to Claude Code CLI."""

import os
import subprocess
import asyncio
from dotenv import load_dotenv
from telegram import Update
from telegram.ext import Application, MessageHandler, CommandHandler, filters, ContextTypes

load_dotenv()

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
CHANNEL_ID = int(os.getenv("TELEGRAM_CHANNEL_ID"))
PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))

# Your Telegram user ID — set after first message
ALLOWED_USER_ID = None


async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Forward message to Claude Code and return the response."""
    global ALLOWED_USER_ID

    # Get the effective user/chat
    message = update.message or update.channel_post
    if not message or not message.text:
        return

    # Skip bot commands starting with /
    if message.text.startswith("/"):
        return

    prompt = message.text
    chat_id = message.chat_id

    # Send "thinking" indicator
    thinking_msg = await context.bot.send_message(
        chat_id=chat_id, text="⏳ Running Claude Code..."
    )

    try:
        # Run Claude CLI with the prompt
        result = subprocess.run(
            [
                "claude",
                "-p",
                prompt,
                "--output-format", "text",
            ],
            capture_output=True,
            text=True,
            timeout=300,  # 5 min timeout
            cwd=PROJECT_DIR,
        )

        output = result.stdout.strip() or result.stderr.strip() or "No output."

        # Telegram has a 4096 char limit per message
        if len(output) > 4000:
            # Split into chunks
            chunks = [output[i : i + 4000] for i in range(0, len(output), 4000)]
            for i, chunk in enumerate(chunks):
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
        # Delete the "thinking" message
        try:
            await thinking_msg.delete()
        except Exception:
            pass


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /start command."""
    await update.message.reply_text(
        "MotionMindAI Claude Code Bot\n\n"
        "Send any message and I'll run it through Claude Code "
        "in the MotionMindAI project directory.\n\n"
        "Examples:\n"
        '- "list all API endpoints"\n'
        '- "add a health check endpoint"\n'
        '- "explain the auth flow"'
    )


async def status(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /status command."""
    result = subprocess.run(
        ["git", "status", "--short"],
        capture_output=True, text=True, cwd=PROJECT_DIR,
    )
    git_status = result.stdout.strip() or "Clean working tree"
    await update.message.reply_text(f"📁 Project: {PROJECT_DIR}\n\n{git_status}")


def main():
    print(f"Starting MotionMindAI Telegram bot...")
    print(f"Project dir: {PROJECT_DIR}")

    app = Application.builder().token(BOT_TOKEN).build()

    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("status", status))
    # Handle both direct messages and channel posts
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

    print("Bot is running. Send a message in Telegram!")
    app.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == "__main__":
    main()
