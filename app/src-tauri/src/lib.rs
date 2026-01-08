use portable_pty::{native_pty_system, CommandBuilder, MasterPty, PtySize};
use std::io::{BufReader, Read, Write};
use std::sync::{Arc, Mutex};
use std::thread;
use tauri::{Emitter, Manager, State};

struct AppState {
    pty_writer: Arc<Mutex<Box<dyn Write + Send>>>,
    pty_master: Arc<Mutex<Box<dyn MasterPty + Send>>>,
}

#[tauri::command]
fn write_to_pty(data: String, state: State<'_, AppState>) {
    if let Ok(mut writer) = state.pty_writer.lock() {
        if let Err(e) = write!(writer, "{}", data) {
            eprintln!("Failed to write to PTY: {}", e);
        }
    }
}

#[tauri::command]
fn resize_pty(rows: u16, cols: u16, state: State<'_, AppState>) {
    if let Ok(master) = state.pty_master.lock() {
        if let Err(e) = master.resize(PtySize {
            rows,
            cols,
            pixel_width: 0,
            pixel_height: 0,
        }) {
            eprintln!("Failed to resize PTY: {}", e);
        }
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let pty_system = native_pty_system();

            // Determine shell based on OS
            let shell_cmd = if cfg!(target_os = "windows") {
                "powershell.exe".to_string()
            } else {
                std::env::var("SHELL")
                    .unwrap_or_else(|_| "/bin/zsh".to_string())
                    .as_str()
                    .to_string()
            };

            let cmd = CommandBuilder::new(shell_cmd);

            let pair = pty_system
                .openpty(PtySize {
                    rows: 24,
                    cols: 80,
                    pixel_width: 0,
                    pixel_height: 0,
                })
                .expect("Failed to create PTY");

            // Clone reader before moving master to State
            let reader = pair
                .master
                .as_ref()
                .try_clone_reader()
                .expect("Failed to clone reader");

            // Take the writer exactly once
            let master = pair.master;
            let writer = master.take_writer().expect("Failed to take writer");

            // Store writer and master in app state
            app.manage(AppState {
                pty_writer: Arc::new(Mutex::new(writer)),
                pty_master: Arc::new(Mutex::new(master)),
            });

            let app_handle = app.handle().clone();

            // Spawn thread to read from PTY and emit events
            thread::spawn(move || {
                let mut reader = BufReader::new(reader);
                let mut buffer = [0; 1024];
                loop {
                    match reader.read(&mut buffer) {
                        Ok(n) if n > 0 => {
                            let data = String::from_utf8_lossy(&buffer[0..n]).to_string();
                            if let Err(e) = app_handle.emit("pty-output", data) {
                                eprintln!("Failed to emit pty-output: {}", e);
                            }
                        }
                        Ok(_) => break, // EOF
                        Err(e) => {
                            eprintln!("Error reading from PTY: {}", e);
                            break;
                        }
                    }
                }
            });

            // Spawn the shell process
            let _child = pair
                .slave
                .spawn_command(cmd)
                .expect("Failed to spawn shell");

            // Keep child alive (optional, though portable-pty handles this mostly)
            // We release the slave, but the child process runs attached to it.
            drop(pair.slave);

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![write_to_pty, resize_pty])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
