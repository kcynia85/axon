# Implementation Plan: Voice Interaction Integration (Space Canvas & Adapters)

## Objective
Connect the dynamic Meta-Agent Voice configuration to the Space Canvas. Implement the end-to-end flow for Speech-to-Text (STT) and Text-to-Speech (TTS), starting with full integration of the ElevenLabs adapter.

## Architecture & Design Principles
- **Ports & Adapters**: Keep external API details within the Infrastructure layer (`adapters/voice/elevenlabs_adapter.py`).
- **Application Layer Orchestration**: Use Use Cases/Services to fetch configuration from `SystemRepository` and delegate to the `VoiceAdapterFactory`.
- **Pure Views & Custom Hooks**: Move frontend audio recording and playback logic into a custom hook (`useVoiceInteraction`), keeping `MetaAgentPanel.tsx` declarative.

## Phased Implementation Steps

### Phase 1: Extend VoiceProviderPort (Backend)
1. **Define STT Port**: Add an `async def transcribe_audio(self, audio_data: bytes, config: Dict[str, Any]) -> str:` method to `VoiceProviderPort`.
2. **Update Adapters**: Add stub implementations for `transcribe_audio` across all adapters.

### Phase 2: Implement ElevenLabs Adapter (Backend)
1. **TTS (generate_speech)**: Implement ElevenLabs API call using `httpx` or `elevenlabs` official SDK. Use `provider_config.voice_id`, `stability`, `similarity_boost`, etc.
2. **STT (transcribe_audio)**: Implement Speech-to-Text functionality using ElevenLabs' Scribe/Voice API (or fallback to OpenAI Whisper if ElevenLabs STT is unavailable/insufficient). When the user clicks the microphone button in the Space Canvas, the recorded audio will be sent here for transcription.
3. **Get Voices (get_voices)**: Implement the API call to fetch available voices from ElevenLabs.

### Phase 3: Application Services & Router (Backend)
1. **Voice Service**: Create `VoiceInteractionService` in the `spaces` or `system` module.
    - `handle_tts(text: str) -> AsyncGenerator[bytes, None]`: Fetches `VoiceMetaAgent` from DB, gets the adapter via `VoiceAdapterFactory`, and calls `generate_speech`.
    - `handle_stt(audio: bytes) -> str`: Fetches `VoiceMetaAgent`, gets adapter, and calls `transcribe_audio`.
2. **API Endpoints**: Add FastAPI routers (e.g., `/api/voice/tts` and `/api/voice/stt`) to expose these services to the frontend. Ensure streaming support for TTS.

### Phase 4: Frontend Audio Hook & Integration
1. **`useVoiceInteraction` Hook**: Create a hook in `axon-app/frontend/src/modules/spaces/application/` to manage:
    - `isRecording` state.
    - MediaRecorder API to capture microphone input.
    - Sending audio blobs to `/api/voice/stt`.
    - Fetching and playing streaming audio from `/api/voice/tts`.
2. **UI Integration**: Update `MetaAgentPanel.tsx`:
    - Connect the microphone button to `startRecording` / `stopRecording`.
    - Show recording state (pulsing animation/border).
    - Handle the STT response by populating the chat input or sending directly to the LLM.
    - Handle the TTS response by playing the audio automatically when the Meta-Agent replies.

## Verification
- Test microphone permissions and recording on the browser.
- Verify ElevenLabs TTS streams audio back with the configured voice ID and settings (stability, style).
- Ensure graceful error handling if an adapter is not configured or an API key is missing.