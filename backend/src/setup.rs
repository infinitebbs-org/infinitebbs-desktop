use tauri::App;

pub fn handler(app: &mut App) -> Result<(), Box<dyn std::error::Error>> {
    let handle = app.handle();

    crate::window::panel(handle);

    Ok(())
}
