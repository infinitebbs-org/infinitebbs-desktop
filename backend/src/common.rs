pub(crate) fn init() {
    tracing();
}

fn tracing() {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        .with_file(true)
        .with_line_number(true)
        .init();
    tracing::info!("Tracing initialized.");
}
