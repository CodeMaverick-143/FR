# fr (For Real) CLI

> **No cap, just code.** The developer utility suite that keeps it 100.

**fr** is a high-performance, cross-platform developer utility suite built with **Rust** and **Tauri**. It combines a lightning-fast CLI with a beautiful "Terminal-First" GUI, allowing you to manage your projects, deployments, and resources with modern energy.

Why type boring commands when you can just be **for real**?

***

## Features

- **Hybrid Architecture:** Use it as a CLI tool (`fr`) or a Desktop App.
- **Shared Core:** Business logic is written once in Rust, shared between CLI and GUI.
- **Custom Terminal GUI:** A built-in xterm.js terminal that feels like home but acts like a dashboard.
- **Vibe Checks:** Real-time system monitoring that passes the vibe check.
- **Gen Z Command Suite:** Intuitive, slang-based commands that make dev work fun.

***

## Installation

### CLI Only (for servers/headless)
```bash
cargo install fr-cli
```

### Desktop App (GUI + CLI)
Download the latest release for macOS, Windows, or Linux from the [Releases Page](#).

***

## Command Dictionary

Translate your boring workflow into **fr** commands.

| Action | Command | Description |
| :--- | :--- | :--- |
| **Start** | `fr lock-in` | Starts the dev server. Time to focus. |
| **Init** | `fr cook <name>` | Scaffolds a new project. Let him cook. |
| **Deploy** | `fr yeet` | Deploys to production. Yeet it to the cloud. |
| **Pull** | `fr yoink` | Pulls latest changes from remote. |
| **Push** | `fr send-it` | Pushes commits to origin. Full send. |
| **Status** | `fr vibe-check` | Checks system health (RAM/CPU/Network). |
| **Log** | `fr tea` | Shows the logs. Spill the tea on errors. |
| **Fix** | `fr clutch` | Runs auto-fixers/linters. Clutch up. |
| **Update** | `fr glow-up` | Updates dependencies. Glow up the stack. |
| **Clean** | `fr ghost` | Clears cache/temp files. Ghost them. |
| **Stop** | `fr flop` | Stops the process. It flopped. |
| **Help** | `fr sauce` | Shows the documentation. |

### Easter Eggs
- `fr fr` -> checks if you are actually serious (Runs previous command with `--force`).
- `fr touch-grass` -> Pauses terminal for 5 mins.

***

## Architecture

We use a **Rust Workspace** to share logic between the CLI binary and the Tauri app.



```toml
[workspace]
members = [
  "app/src-tauri",   # The GUI (Tauri)
  "crates/cli",      # The Binary (Clap)
  "crates/core-lib"  # The Brains (Shared Logic)
]
```

- **crates/core-lib**: Contains all API calls, file I/O, and business logic.
- **crates/cli**: A lightweight wrapper using `clap` to parse args and call `core-lib`.
- **app**: A React + TypeScript frontend using `xterm.js` that invokes `core-lib` via Tauri commands.

***

## Usage Example

```bash
$ fr cook my-unicorn-startup
> Hold up, let me cook...
> Project recipe created at ./my-unicorn-startup

$ cd my-unicorn-startup
$ fr lock-in
> Time to lock in.
> Server running at http://localhost:3000. Don't choke.

$ fr vibe-check
> Vibes are immaculate.
> CPU: Chilling (5%)
> RAM: Low key empty (150MB)

$ fr yeet --prod
> Bet. Yeeting to production...
> ...
> ...
> No cap, it's live. Common W.
```

***

## Contributing

We welcome all contributions, from bug fixes to new slang suggestions.

1.  **Fork** the repo.
2.  **Cook** your changes (`git checkout -b feature/new-slang`).
3.  **Send it** (`git push origin feature/new-slang`).
4.  Open a **Pull Request**.

***

## License

MIT © CodeMaverick-143

Made with Rust and Passion in India.
