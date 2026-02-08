# T010, T011: Create CLI REPL loop and main entry point
"""
Main CLI interface for the Todo application.

This module provides the REPL (Read-Eval-Print Loop) for the console app.
"""

from __future__ import annotations

import sys

from src.cli import commands
from src.services.todo_service import TodoService


def print_help() -> None:
    """Print help text showing all available commands."""
    help_text = """
Todo Console App - Commands:
  add <title> [--desc <description>]  Add a new task
  list                                 List all tasks
  update <id> [--title <t>] [--desc <d>] Update a task
  delete <id>                          Delete a task
  complete <id>                        Mark task as complete
  uncomplete <id>                      Mark task as incomplete
  help                                 Show this help message
  exit                                 Exit the application
"""
    print(help_text)


def parse_command(input_str: str) -> tuple[str, list[str]]:
    """
    Parse user input into command and arguments.

    Args:
        input_str: Raw user input string

    Returns:
        Tuple of (command, arguments)
    """
    parts = input_str.strip().split()
    if not parts:
        return "", []

    command = parts[0].lower()
    args = parts[1:]
    return command, args


def run_repl() -> None:
    """
    Run the main REPL loop for the Todo application.

    This function continuously prompts for commands, processes them,
    and displays results until the user exits.
    """
    service = TodoService()

    print("Todo Console App - Type 'help' for commands, 'exit' to quit")
    print("-" * 50)

    while True:
        try:
            user_input = input("\ntodo> ").strip()

            if not user_input:
                continue

            command, args = parse_command(user_input)

            if command == "exit":
                print("Goodbye!")
                break

            if command == "help":
                print_help()
                continue

            # Map commands to their handlers
            handlers = {
                "add": commands.handle_add,
                "list": commands.handle_list,
                "update": commands.handle_update,
                "delete": commands.handle_delete,
                "complete": commands.handle_complete,
                "uncomplete": commands.handle_uncomplete,
            }

            handler = handlers.get(command)
            if handler is None:
                print(f"Unknown command: {command}. Type 'help' for available commands.")
                continue

            result = handler(service, args)
            print(result)

        except ValueError as e:
            print(f"Error: {e}")
        except KeyboardInterrupt:
            print("\nUse 'exit' to quit.")
        except EOFError:
            print("\nGoodbye!")
            break


def main() -> None:
    """Main entry point for the application."""
    try:
        run_repl()
    except Exception as e:
        print(f"Fatal error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
