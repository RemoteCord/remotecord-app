use base64;
use screenshots::Screen;
use std::time::SystemTime;

#[tauri::command]
pub fn capture(id: u32) -> (String, Vec<u8>) {
    let start = SystemTime::now();
    let screens = Screen::all().unwrap();
    println!("screens: {:?}", screens);

    let screen = screens
        .into_iter()
        .find(|s| s.display_info.id as u32 == id)
        .unwrap();
    println!("screen: {:?}", screen);

    let image = screen.capture().unwrap();

    let buffer = image.buffer().to_vec();
    let base64: String = base64::encode(buffer.clone());

    println!("Done: {:?}", start.elapsed().ok());

    return (base64, buffer);
}

#[derive(serde::Serialize)]
pub struct ScreenInfo {
    id: u32,
    resolution: (u32, u32),
    frequency: f32,
}

#[tauri::command]
pub fn get_screens() -> Vec<ScreenInfo> {
    let screens = Screen::all().unwrap();
    let mut screen_names = Vec::new();
    for screen in screens {
        println!("screen: {:?}", screen);
        screen_names.push(ScreenInfo {
            id: screen.display_info.id as u32,
            resolution: (screen.display_info.width, screen.display_info.height),
            frequency: screen.display_info.frequency,
        });
    }
    return screen_names;
}
