use portable_pty::{native_pty_system, CommandBuilder, MasterPty, PtySize};
use std::collections::HashMap;
use std::io::{BufReader, Read, Write};
use std::sync::{Arc, Mutex};
use std::thread;
use tauri::{Emitter, State};

struct PtySession {
    writer: Arc<Mutex<Box<dyn Write + Send>>>,
    master: Arc<Mutex<Box<dyn MasterPty + Send>>>,
    // We might need to keep the child process handle if we want to kill it explicitly,
    // but usually dropping the master/writer closes it?
    // portable_pty documentation says dropping master closes pty.
}

struct AppState {
    sessions: Arc<Mutex<HashMap<String, PtySession>>>,
}

#[tauri::command]
fn create_session(
    id: String,
    rows: u16,
    cols: u16,
    app_handle: tauri::AppHandle,
    state: State<'_, AppState>,
) -> Result<(), String> {
    let pty_system = native_pty_system();

    // Determine shell based on OS (Settings are frontend-side, frontend should send shell command?
    // For now we stick to default shell detection or let frontend pass it.
    // To keep it simple, we'll keep detection here for now, or maybe add an argument later)
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
            rows,
            cols,
            pixel_width: 0,
            pixel_height: 0,
        })
        .map_err(|e| e.to_string())?;

    let reader = pair.master.try_clone_reader().map_err(|e| e.to_string())?;
    let master = pair.master;
    let writer = master.take_writer().map_err(|e| e.to_string())?;

    let session = PtySession {
        writer: Arc::new(Mutex::new(writer)),
        master: Arc::new(Mutex::new(master)),
    };

    if let Ok(mut sessions) = state.sessions.lock() {
        sessions.insert(id.clone(), session);
    }

    // Spawn thread to read from PTY
    let event_name = format!("pty-output:{}", id);
    thread::spawn(move || {
        let mut reader = BufReader::new(reader);
        let mut buffer = [0; 1024];
        loop {
            match reader.read(&mut buffer) {
                Ok(n) if n > 0 => {
                    let data = String::from_utf8_lossy(&buffer[0..n]).to_string();
                    if let Err(e) = app_handle.emit(&event_name, data) {
                        eprintln!("Failed to emit {}: {}", event_name, e);
                    }
                }
                Ok(_) => break,  // EOF
                Err(_) => break, // Error
            }
        }
        // Emit exit event?
    });

    let _child = pair.slave.spawn_command(cmd).map_err(|e| e.to_string())?;
    // child is dropped, but process runs attached to slave PTY.

    // We need to ensure the slave is kept alive? portable_pty logic:
    // "The child process will handle the slave side. We can drop the slave struct."
    drop(pair.slave);

    Ok(())
}

#[tauri::command]
fn write_to_session(id: String, data: String, state: State<'_, AppState>) {
    if let Ok(sessions) = state.sessions.lock() {
        if let Some(session) = sessions.get(&id) {
            if let Ok(mut writer) = session.writer.lock() {
                let _ = write!(writer, "{}", data);
            }
        }
    }
}

#[tauri::command]
fn resize_session(id: String, rows: u16, cols: u16, state: State<'_, AppState>) {
    if let Ok(sessions) = state.sessions.lock() {
        if let Some(session) = sessions.get(&id) {
            if let Ok(master) = session.master.lock() {
                let _ = master.resize(PtySize {
                    rows,
                    cols,
                    pixel_width: 0,
                    pixel_height: 0,
                });
            }
        }
    }
}

#[tauri::command]
fn close_session(id: String, state: State<'_, AppState>) {
    if let Ok(mut sessions) = state.sessions.lock() {
        sessions.remove(&id);
        // Dropping PtySession closes master, which should Terminate child eventually.
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(AppState {
            sessions: Arc::new(Mutex::new(HashMap::new())),
        })
        .invoke_handler(tauri::generate_handler![
            create_session,
            write_to_session,
            resize_session,
            close_session
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
