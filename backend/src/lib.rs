mod common;
mod service;
mod setup;
mod window;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub async fn run() {
    common::init();

    tauri::Builder::default()
        .setup(setup::handler)
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![service::markdown_to_html])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
