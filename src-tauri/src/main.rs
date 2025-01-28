// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use rdev::{simulate, EventType, listen, SimulateError};
use serde::{Serialize, Deserialize};
use std::sync::{Arc, Mutex};
use tauri::State;
use std::{thread, time::Duration};

use keystroke::start_keystroke_listener;
// use tauri::{Manager};

mod keystroke;
// mod tray;

pub mod screenshot;
pub mod macros;
#[derive(Default)]
struct MacroState {
    events: Arc<Mutex<Vec<MacroEvent>>>,
}

fn main() {
    let unlocked = true;
    let tauri_app = tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_deep_link::init())
                .manage(MacroState::default());


    tauri_app
        .setup(|app| {
            // let app_handle = app.app_handle();
            // tray::build(app_handle);
            // let setting_window = app.get_webview_window("settings").unwrap();
            // setting_window.hide().unwrap();
            start_keystroke_listener(app);
            // setup_recording_handler(app);
            Ok(())
        })
        // .on_window_event(|win, event| {
        //     if let tauri::WindowEvent::CloseRequested { api, .. } = event {
        //         let label = win.label();
        //         if label == "settings" {
        //             win.hide().unwrap();
        //             api.prevent_close();
        //         }
        //     }
        // })
        .invoke_handler(tauri::generate_handler![start_recording, stop_recording, play_macro, screenshot::capture, screenshot::get_screens])
        .plugin(tauri_plugin_websocket::init())
        // .plugin(tauri_plugin_shell::init())
    .plugin(tauri_plugin_shellx::init(unlocked))

        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_notification::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}



#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
struct SerializableEventType {
    event_type: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
struct MacroEvent {
    event_type: SerializableEventType,
    delay: u64,
}

impl From<EventType> for SerializableEventType {
    fn from(event_type: EventType) -> Self {
        match event_type {
            EventType::KeyPress(key) => Self { event_type: format!("KeyPress({:?})", key) },
            EventType::KeyRelease(key) => Self { event_type: format!("KeyRelease({:?})", key) },
            EventType::MouseMove { x, y } => Self { event_type: format!("MouseMove({}, {})", x, y) },
            EventType::ButtonPress(button) => Self { event_type: format!("ButtonPress({:?})", button) },
            EventType::ButtonRelease(button) => Self { event_type: format!("ButtonRelease({:?})", button) },
            _ => Self { event_type: "Other".to_string() },
        }
    }
}
fn parse_key(key_str: &str) -> Option<rdev::Key> {
            match key_str {
                "Alt" => Some(rdev::Key::Alt),
                "Backspace" => Some(rdev::Key::Backspace),
                "CapsLock" => Some(rdev::Key::CapsLock),
                "ControlLeft" => Some(rdev::Key::ControlLeft),
                "ControlRight" => Some(rdev::Key::ControlRight),
                "Delete" => Some(rdev::Key::Delete),
                "DownArrow" => Some(rdev::Key::DownArrow),
                "End" => Some(rdev::Key::End),
                "Escape" => Some(rdev::Key::Escape),
                "F1" => Some(rdev::Key::F1),
                "F2" => Some(rdev::Key::F2),
                "F3" => Some(rdev::Key::F3),
                "F4" => Some(rdev::Key::F4),
                "F5" => Some(rdev::Key::F5),
                "F6" => Some(rdev::Key::F6),
                "F7" => Some(rdev::Key::F7),
                "F8" => Some(rdev::Key::F8),
                "F9" => Some(rdev::Key::F9),
                "F10" => Some(rdev::Key::F10),
                "F11" => Some(rdev::Key::F11),
                "F12" => Some(rdev::Key::F12),
                "Home" => Some(rdev::Key::Home),
                "LeftArrow" => Some(rdev::Key::LeftArrow),
                "MetaLeft" => Some(rdev::Key::MetaLeft),
                "MetaRight" => Some(rdev::Key::MetaRight),
                "PageDown" => Some(rdev::Key::PageDown),
                "PageUp" => Some(rdev::Key::PageUp),
                "Return" => Some(rdev::Key::Return),
                "RightArrow" => Some(rdev::Key::RightArrow),
                "ShiftLeft" => Some(rdev::Key::ShiftLeft),
                "ShiftRight" => Some(rdev::Key::ShiftRight),
                "Space" => Some(rdev::Key::Space),
                "Tab" => Some(rdev::Key::Tab),
                "UpArrow" => Some(rdev::Key::UpArrow),
                "KeyA" => Some(rdev::Key::KeyA),
                "KeyB" => Some(rdev::Key::KeyB),
                "KeyC" => Some(rdev::Key::KeyC),
                "KeyD" => Some(rdev::Key::KeyD),
                "KeyE" => Some(rdev::Key::KeyE),
                "KeyF" => Some(rdev::Key::KeyF),
                "KeyG" => Some(rdev::Key::KeyG),
                "KeyH" => Some(rdev::Key::KeyH),
                "KeyI" => Some(rdev::Key::KeyI),
                "KeyJ" => Some(rdev::Key::KeyJ),
                "KeyK" => Some(rdev::Key::KeyK),
                "KeyL" => Some(rdev::Key::KeyL),
                "KeyM" => Some(rdev::Key::KeyM),
                "KeyN" => Some(rdev::Key::KeyN),
                "KeyO" => Some(rdev::Key::KeyO),
                "KeyP" => Some(rdev::Key::KeyP),
                "KeyQ" => Some(rdev::Key::KeyQ),
                "KeyR" => Some(rdev::Key::KeyR),
                "KeyS" => Some(rdev::Key::KeyS),
                "KeyT" => Some(rdev::Key::KeyT),
                "KeyU" => Some(rdev::Key::KeyU),
                "KeyV" => Some(rdev::Key::KeyV),
                "KeyW" => Some(rdev::Key::KeyW),
                "KeyX" => Some(rdev::Key::KeyX),
                "KeyY" => Some(rdev::Key::KeyY),
                "KeyZ" => Some(rdev::Key::KeyZ),
                "Num0" => Some(rdev::Key::Num0),
                "Num1" => Some(rdev::Key::Num1),
                "Num2" => Some(rdev::Key::Num2),
                "Num3" => Some(rdev::Key::Num3),
                "Num4" => Some(rdev::Key::Num4),
                "Num5" => Some(rdev::Key::Num5),
                "Num6" => Some(rdev::Key::Num6),
                "Num7" => Some(rdev::Key::Num7),
                "Num8" => Some(rdev::Key::Num8),
                "Num9" => Some(rdev::Key::Num9),
 
                _ => None,
            }
        }


fn parse_button(button_str: &str) -> Option<rdev::Button> {
    match button_str {
        "Left" => Some(rdev::Button::Left),
        "Right" => Some(rdev::Button::Right),
        "Middle" => Some(rdev::Button::Middle),
        "Unknown" => None, // Unknown buttons are not supported
        _ => None,
    }
}

impl From<SerializableEventType> for EventType {
    fn from(serializable: SerializableEventType) -> Self {
        if serializable.event_type.starts_with("MouseMove(") {
            let coords = &serializable.event_type[10..serializable.event_type.len() - 1];
            if let Some((x, y)) = coords.split_once(", ") {
                if let (Ok(x), Ok(y)) = (x.parse::<i32>(), y.parse::<i32>()) {
                    return EventType::MouseMove { x: x.into(), y: y.into() };
                }
            }
            return EventType::KeyPress(rdev::Key::Unknown(0)); // Default placeholder
        } else if serializable.event_type.starts_with("ButtonPress(") {
            if let Some(button_str) = serializable.event_type.strip_prefix("ButtonPress(").and_then(|s| s.strip_suffix(")")) {
                if let Some(button) = parse_button(button_str) {
                    return EventType::ButtonPress(button);
                }
            }
            return EventType::KeyPress(rdev::Key::Unknown(0)); // Default placeholder
        } else if serializable.event_type.starts_with("ButtonRelease(") {
            if let Some(button_str) = serializable.event_type.strip_prefix("ButtonRelease(").and_then(|s| s.strip_suffix(")")) {
                if let Some(button) = parse_button(button_str) {
                    return EventType::ButtonRelease(button);
                }
            }
            return EventType::KeyPress(rdev::Key::Unknown(0)); // Default placeholder
        } else if serializable.event_type.starts_with("KeyPress(") {

            if let Some(key_str) = serializable.event_type.strip_prefix("KeyPress(").and_then(|s| s.strip_suffix(")")) {
                                        // println!("Simulating eventtt: {:?} {:?}", serializable.event_type, key_str);

                if let Some(key) = parse_key(key_str) {
                    println!("Simulating event press: {:?} {:?}", key, key_str);
                    return EventType::KeyPress(key);
                }
            }
            return EventType::KeyPress(rdev::Key::Unknown(0)); // Default placeholder
        } else if serializable.event_type.starts_with("KeyRelease(") {
            if let Some(key_str) = serializable.event_type.strip_prefix("KeyRelease(").and_then(|s| s.strip_suffix(")")) {
                if let Some(key) = parse_key(key_str) {
                                        println!("Simulating event release: {:?} {:?}", key, key_str);

                    return EventType::KeyRelease(key);
                }
            }
            return EventType::KeyPress(rdev::Key::Unknown(0)); // Default placeholder
        } else {
            EventType::KeyPress(rdev::Key::Unknown(0)) // Default placeholder
        }
    }
}

        
            

#[tauri::command]
fn start_recording(state: State<MacroState>) {
    let events = state.events.clone();
    {
        let mut macro_events = events.lock().unwrap();
        macro_events.clear();
    }
    thread::spawn(move || {
        let mut last_time = std::time::Instant::now();
        if let Err(error) = listen(move |event| {
            let delay = last_time.elapsed().as_millis() as u64;
            last_time = std::time::Instant::now();
            
            let mut macro_events = events.lock().unwrap();
            if macro_events.is_empty() || macro_events.last().unwrap().event_type != event.event_type.clone().into() {
            macro_events.push(MacroEvent {
                event_type: event.event_type.clone().into(),
                delay,
            });
            }
        }) {
            eprintln!("Error: {:?}", error);
        }
    });
}

#[tauri::command]
fn stop_recording(state: State<MacroState>) -> Vec<MacroEvent> {
    let events = state.events.lock().unwrap();
    events.clone()
}

#[tauri::command]
fn play_macro(macro_events: Option<Vec<MacroEvent>>) -> Result<(), String> {
    println!("Received macro_events: "); // Debug log

    let macro_events = macro_events.ok_or("macroEvents argument is missing")?;
    thread::spawn(move || {
        for event in macro_events {
            thread::sleep(Duration::from_millis(event.delay));
            let event_type = EventType::from(event.event_type.clone());
            if let Err(SimulateError) = simulate(&event_type) {
                eprintln!("Failed to simulate event: {:?}", event_type);
            }
        }
    });
    Ok(())
}