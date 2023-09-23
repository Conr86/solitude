// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// #[rocket::get("/api")]
// fn world() -> &'static str {
//   "Hello, world!"
// }


fn main() {
  tauri::Builder::default()
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

// fn main() {
//   tauri::Builder::default()
//     .setup(|app| {
//       tauri::async_runtime::spawn(
//         rocket::build().mount("/api", rocket::routes![world]).launch()
//       );
//       Ok(())
//     })
//     .run(tauri::generate_context!())
//     .expect("error while running tauri application");
// }