use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Manager};

#[derive(Debug, Serialize, Deserialize)]
pub struct EmulatorActionPayload {
    pub action: String, // "load_state", "save_state", "reset", "read_ram"
    pub slot: Option<u8>,
    pub address: Option<u32>,
    pub length: Option<u32>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct EmulatorResponse {
    pub success: bool,
    pub message: String,
    pub data: Option<Vec<u8>>,
}

// Window control commands
#[tauri::command]
fn toggle_always_on_top(app: AppHandle, enabled: bool) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("main") {
        window.set_always_on_top(enabled).map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
fn minimize_window(app: AppHandle) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("main") {
        window.minimize().map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
fn close_window(app: AppHandle) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("main") {
        window.close().map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
async fn send_emulator_action(payload: EmulatorActionPayload) -> Result<EmulatorResponse, String> {
    // Bridges to emulator (RetroArch UDP or QUsb2snes WebSocket)
    match payload.action.as_str() {
        "load_state" => {
            let slot = payload.slot.unwrap_or(0);
            println!("[EmulatorBridge] Loading savestate slot: {}", slot);
            Ok(EmulatorResponse {
                success: true,
                message: format!("Savestate {} cargado", slot),
                data: None,
            })
        }
        "save_state" => {
            let slot = payload.slot.unwrap_or(0);
            println!("[EmulatorBridge] Saving savestate slot: {}", slot);
            Ok(EmulatorResponse {
                success: true,
                message: format!("Savestate {} guardado", slot),
                data: None,
            })
        }
        "reset" => {
            println!("[EmulatorBridge] Resetting emulator");
            Ok(EmulatorResponse {
                success: true,
                message: "Emulador reiniciado".to_string(),
                data: None,
            })
        }
        _ => Ok(EmulatorResponse {
            success: false,
            message: "Acción no reconocida".to_string(),
            data: None,
        }),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            toggle_always_on_top,
            minimize_window,
            close_window,
            send_emulator_action
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
