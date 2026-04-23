# 🎙️ Voice Meta-Agent Architecture & Data Flow

This document explains how the Voice Interaction system (STT/TTS) is implemented in Axon using the **Ports & Adapters (Hexagonal)** pattern and a **Polymorphic Configuration** model.

---

## 🏗️ Architectural Overview

The system is designed to be **provider-agnostic**. The core application logic never interacts directly with external APIs like ElevenLabs or Cartesia. Instead, it interacts with an abstract **Port**, while provider-specific details are isolated in **Adapters**.

### 1. Data Layer (Polymorphism)
We use a single table `voice_meta_agents` with a PostgreSQL **JSONB** column called `provider_config`.
- **Why?** Each voice provider has different parameters (e.g., ElevenLabs has "Stability", while Inworld AI has "Character ID"). JSONB allows us to store these varying structures without changing the database schema every time we add a new provider.

### 2. Backend Logic (Ports & Adapters)
- **Port (`VoiceProviderPort`)**: A Python ABC (Abstract Base Class) defining the contract: `generate_speech`, `transcribe_audio`, and `get_voices`.
- **Adapters**: Concrete implementations (e.g., `ElevenLabsAdapter`) that translate Axon's internal requests into specific API calls (using `httpx`).
- **Factory (`VoiceAdapterFactory`)**: Injects the correct adapter at runtime based on the user's selected provider.

---

## 🔄 Data Flows

### A. Configuration Flow (Studio Persistence)
When a user adjusts voice settings in the Meta-Agent Studio:
1. **Frontend**: The `ElevenLabsSettingsView` (or other) captures the inputs.
2. **Validation**: **Zod (Discriminated Union)** ensures that if "ElevenLabs" is selected, the `provider_config` contains valid stability/speed values.
3. **API Call**: A `PUT /system/voice` request is sent.
4. **Persistence**: The backend saves the entire object into the JSONB column.

### B. Interaction Flow (Space Canvas Real-time)
When a user clicks the microphone in the Space Canvas:
1. **Recording**: The `useVoiceInteraction` hook uses the browser's **MediaRecorder API** to capture audio as WebM chunks.
2. **STT Request**: The blob is sent to `/system/voice/stt`.
3. **Orchestration**: `VoiceInteractionService` fetches the configuration, asks the `VoiceAdapterFactory` for the current adapter, and calls `adapter.transcribe_audio`.
4. **Response**: The transcribed text is returned to the frontend and automatically populated into the chat textarea.

---

## 🛠️ Code Deep Dive

### 1. The Contract (The Port)
Every provider must implement this interface.
```python
class VoiceProviderPort(ABC):
    @abstractmethod
    async def generate_speech(self, text: str, config: Dict[str, Any]) -> AsyncGenerator[bytes, None]:
        """Convert text to streaming audio."""
        pass

    @abstractmethod
    async def transcribe_audio(self, audio_data: bytes, config: Dict[str, Any]) -> str:
        """Convert audio bytes to text."""
        pass
```

### 2. The Implementation (The Adapter)
Adapters extract their specific needs from the agnostic `config` dictionary.
```python
class ElevenLabsAdapter(VoiceProviderPort):
    async def generate_speech(self, text: str, config: Dict[str, Any]):
        payload = {
            "text": text,
            "model_id": config.get("model_id", "eleven_multilingual_v2"),
            "voice_settings": {
                "stability": config.get("stability", 0.5),
                "speed": config.get("speed", 1.0)
            }
        }
        # API call logic...
```

### 3. Frontend Strategy Pattern
The UI dynamically switches form sections based on the selected provider.
```tsx
const VoiceProviderSettingsRenderer = ({ provider }: { provider: VoiceProvider }) => {
    switch (provider) {
        case "ElevenLabs": return <ElevenLabsSettingsView />;
        case "Cartesia":   return <CartesiaSettingsView />;
        case "Inworld_AI": return <InworldAISettingsView />;
        default:           return <HyperscalerSettingsView />;
    }
};
```

---

## 🚀 Key Benefits

1. **Scalability**: Adding a new provider takes ~15 minutes (create 1 adapter, 1 view, and update the enum).
2. **Robustness**: The `VoiceInteractionService` includes a **fallback mechanism**. If the DB is empty, it defaults to a pre-configured ElevenLabs setup to prevent system crashes.
3. **Type Safety**: Full end-to-end type safety using Zod and Pydantic ensures invalid configurations never reach the database or the external APIs.
4. **Performance**: TTS uses **StreamingResponse**, meaning the audio starts playing as soon as the first chunks arrive from the provider, minimizing perceived latency.

---

## 🎨 UI Reference (Mic Button States)
- **Idle**: `bg-white/5 border-white/10` (Subtle dark).
- **Recording**: `bg-white text-black border-white` (High contrast, "Glow" effect).
- **Processing**: `opacity-50 cursor-wait` (Disabled while waiting for STT).
