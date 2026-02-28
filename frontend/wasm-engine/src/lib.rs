use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};
use std::collections::HashMap;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

// --- Core Data Structures ---

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Debug, Clone, Copy)]
pub struct Vector2 {
    pub x: f32,
    pub y: f32,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct WasmNode {
    pub id: String,
    pub node_type: String,
    pub position: Vector2,
    pub width: f32,
    pub height: f32,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct WasmEdge {
    pub id: String,
    pub source: String,
    pub target: String,
}

// --- Main Engine State ---

#[wasm_bindgen]
pub struct AxonCanvasEngine {
    nodes: HashMap<String, WasmNode>,
    edges: Vec<WasmEdge>,
    viewport_offset: Vector2,
    zoom: f32,
}

#[wasm_bindgen]
impl AxonCanvasEngine {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        console_error_panic_hook::set_once();
        log("Axon WASM Engine Initialized");
        
        Self {
            nodes: HashMap::new(),
            edges: Vec::new(),
            viewport_offset: Vector2 { x: 0.0, y: 0.0 },
            zoom: 1.0,
        }
    }

    pub fn add_node(&mut self, id: String, node_type: String, x: f32, y: f32) {
        let node = WasmNode {
            id: id.clone(),
            node_type,
            position: Vector2 { x, y },
            width: 200.0,
            height: 100.0,
        };
        self.nodes.insert(id, node);
    }

    pub fn update_node_position(&mut self, id: &str, x: f32, y: f32) {
        if let Some(node) = self.nodes.get_mut(id) {
            node.position.x = x;
            node.position.y = y;
        }
    }

    pub fn set_viewport(&mut self, x: f32, y: f32, zoom: f32) {
        self.viewport_offset.x = x;
        self.viewport_offset.y = y;
        self.zoom = zoom;
    }

    pub fn get_visible_nodes(&self, screen_width: f32, screen_height: f32) -> JsValue {
        let mut visible = Vec::new();
        
        for (id, node) in &self.nodes {
            let canvas_x = (node.position.x * self.zoom) + self.viewport_offset.x;
            let canvas_y = (node.position.y * self.zoom) + self.viewport_offset.y;
            let scaled_w = node.width * self.zoom;
            let scaled_h = node.height * self.zoom;

            if canvas_x + scaled_w > 0.0 && canvas_x < screen_width &&
               canvas_y + scaled_h > 0.0 && canvas_y < screen_height {
                visible.push(id.clone());
            }
        }

        serde_wasm_bindgen::to_value(&visible).unwrap()
    }

    pub fn get_nodes_count(&self) -> usize {
        self.nodes.len()
    }
}

// Utility to catch Rust panics
mod console_error_panic_hook {
    use std::sync::Once;
    static SET_HOOK: Once = Once::new();

    pub fn set_once() {
        SET_HOOK.call_once(|| {
            #[cfg(feature = "console_error_panic_hook")]
            console_error_panic_hook::set_once();
        });
    }
}
