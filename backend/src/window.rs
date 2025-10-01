use tauri::AppHandle;

pub fn panel(app: &AppHandle) {
    tauri::WebviewWindowBuilder::new(app, "main", tauri::WebviewUrl::App("/".into()))
        .title("Infinite BBS")
        .inner_size(1024.0, 600.0)
        .min_inner_size(1024.0, 600.0)
        .fullscreen(false)
        .maximizable(false)
        .visible(false)
        .shadow(true)
        .center()
        .build()
        .expect("Failed to create panel window");
}
