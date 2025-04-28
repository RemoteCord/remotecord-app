use std::{fs, io::Read, path::Path};

use keystroke::start_keystroke_listener;
use tauri_plugin_deep_link::DeepLinkExt;
use tauri_plugin_http::reqwest;
mod keystroke;
pub mod screenshot;
use tauri::Manager;
use reqwest::Client;
use tokio::io::AsyncWriteExt;
use futures_util::StreamExt;
use std::time::{Instant, Duration};



#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let unlocked: bool = true;
    let mut builder = tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .plugin(
            tauri_plugin_stronghold::Builder::new(|password| {
                // Hash the password here with e.g. argon2, blake2b or any other secure algorithm
                // Here is an example implementation using the `rust-argon2` crate for hashing the password
                use argon2::password_hash::{PasswordHasher as _, SaltString};
                use argon2::{Argon2, PasswordHasher};

                let salt = SaltString::b64_encode("your-salt".as_bytes()).expect("invalid salt");
                let argon2 = Argon2::default();
                let hash = argon2
                    .hash_password(password.as_ref(), &salt)
                    .expect("failed to hash password");
                hash.hash.unwrap().as_bytes().to_vec()
            })
            .build(),
        )
        .plugin(tauri_plugin_opener::init());

    #[cfg(desktop)]
    {
        builder = builder.plugin(tauri_plugin_single_instance::init(|_app, argv, _cwd| {
          println!("a new app instance was opened with {argv:?} and the deep link event was already triggered");
          // when defining deep link schemes at runtime, you must also check `argv` here
        }));
    }

    builder
        .plugin(tauri_plugin_deep_link::init())
        .plugin(tauri_plugin_os::init())
        .plugin(prevent_default())
        .plugin(tauri_plugin_upload::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_fs_pro::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_system_info::init())
        .plugin(tauri_plugin_shellx::init(unlocked))
        .plugin(tauri_plugin_persisted_scope::init())
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            start_keystroke_listener(app);
            #[cfg(desktop)]
            app.handle().plugin(tauri_plugin_autostart::init(
                tauri_plugin_autostart::MacosLauncher::LaunchAgent,
                Some(vec!["--flag1", "--flag2"]), /* arbitrary number of args to pass to your app */
            ));

            // #[cfg(desktop)]
            // app.handle()
            //     .plugin(tauri_plugin_updater::Builder::new().build());

            #[cfg(desktop)]
            app.deep_link().register("remotecord")?;

            #[cfg(any(target_os = "linux", all(debug_assertions, windows)))]
            {
                use tauri_plugin_deep_link::DeepLinkExt;
                app.deep_link().register_all()?;
            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            open_file,
            screenshot::capture,
            screenshot::get_screens,
            fetch_and_save
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(debug_assertions)]
fn prevent_default() -> tauri::plugin::TauriPlugin<tauri::Wry> {
    use tauri_plugin_prevent_default::Flags;

    tauri_plugin_prevent_default::Builder::new()
        .with_flags(Flags::all().difference(Flags::DEV_TOOLS | Flags::RELOAD))
        .build()
}

#[cfg(not(debug_assertions))]
fn prevent_default() -> tauri::plugin::TauriPlugin<tauri::Wry> {
    tauri_plugin_prevent_default::init()
}
#[tauri::command]
async fn fetch_and_save(url: String, output: String) -> Result<(), String> {
    let client = Client::new();
    let resp = client.get(&url).send().await.map_err(|e| e.to_string())?;

    if !resp.status().is_success() {
        return Err(format!("Download failed with status: {}", resp.status()));
    }

    let total_size = resp.content_length().unwrap_or(0);
    let mut file = tokio::fs::File::create(&output).await.map_err(|e| e.to_string())?;
    let mut stream = resp.bytes_stream();

    let mut downloaded: u64 = 0;
    let mut last_logged = Instant::now();

    println!("Starting download: {} bytes", total_size);

    while let Some(chunk) = stream.next().await {
        let chunk = chunk.map_err(|e| e.to_string())?;
        file.write_all(&chunk).await.map_err(|e| e.to_string())?;
        downloaded += chunk.len() as u64;

        // Log progress every 500 ms or on completion
        if last_logged.elapsed() > Duration::from_millis(500) || downloaded == total_size {
            if total_size > 0 {
                let progress = downloaded as f64 / total_size as f64 * 100.0;
                println!("Downloaded {:.2}% ({}/{} bytes)", progress, downloaded, total_size);
            } else {
                println!("Downloaded {} bytes", downloaded);
            }
            last_logged = Instant::now();
        }
    }

    println!("Download finished successfully.");

    Ok(())
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
