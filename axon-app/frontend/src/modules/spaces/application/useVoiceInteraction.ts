import { useState, useRef, useCallback } from "react";
import { toast } from "sonner";
import { createClient } from "@/shared/infrastructure/supabase/client";

export const useVoiceInteraction = (onTranscriptionResult: (text: string) => void) => {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const getAuthHeaders = async (includeContentType = true) => {
        try {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;
            const headers: HeadersInit = {};
            if (token) headers["Authorization"] = `Bearer ${token}`;
            if (includeContentType) headers["Content-Type"] = "application/json";
            return headers;
        } catch (e) {
            console.error("Auth error in voice interaction:", e);
            return {};
        }
    };

    const getApiUrl = (path: string) => {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
        return `${baseUrl}${path}`;
    };

    const startRecording = useCallback(async () => {
        console.log("Voice: Starting recording process...");
        setIsRecording(true); // Optimistic UI update
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            console.log("Voice: Microphone access granted.");
            
            // Prefer webm format if supported
            const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
                ? 'audio/webm;codecs=opus' 
                : 'audio/webm';
                
            const mediaRecorder = new MediaRecorder(stream, { mimeType });
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = async () => {
                console.log("Voice: Recording stopped, processing audio blob...");
                const audioBlob = new Blob(chunksRef.current, { type: mimeType });
                setIsProcessing(true);
                
                try {
                    // Send to backend STT
                    const formData = new FormData();
                    formData.append("file", audioBlob, "audio.webm");

                    const headers = await getAuthHeaders(false);
                    const url = getApiUrl("/system/voice/stt");
                    
                    console.log(`Voice: Sending to STT endpoint: ${url}`);
                    const response = await fetch(url, {
                        method: "POST",
                        headers,
                        body: formData,
                    });

                    if (response.ok) {
                        const data = await response.json();
                        console.log("Voice: Transcription received:", data.text);
                        if (data.text) {
                            onTranscriptionResult(data.text);
                        } else {
                            toast.error("Could not transcribe audio.");
                        }
                    } else {
                        const errText = await response.text();
                        console.error("Voice: STT API Error:", response.status, errText);
                        toast.error(`Failed to transcribe: ${response.statusText}`);
                    }
                } catch (error) {
                    console.error("Voice: Fetch Error during STT:", error);
                    toast.error("Error processing voice input.");
                } finally {
                    setIsProcessing(false);
                    // Stop all tracks
                    stream.getTracks().forEach(track => {
                        track.stop();
                        console.log(`Voice: Track ${track.label} stopped.`);
                    });
                }
            };

            mediaRecorder.start();
            console.log("Voice: MediaRecorder started.");
        } catch (error) {
            console.error("Voice: Error starting recording:", error);
            toast.error("Microphone access denied or unavailable.");
            setIsRecording(false);
        }
    }, [onTranscriptionResult]);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    }, [isRecording]);

    const toggleRecording = useCallback(() => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    }, [isRecording, startRecording, stopRecording]);

    // TTS playback
    const playAudioResponse = useCallback(async (text: string) => {
        console.log("Voice: Requesting TTS for:", text);
        try {
            const headers = await getAuthHeaders(true);
            const url = getApiUrl("/system/voice/tts");

            console.log(`Voice: Fetching TTS from: ${url}`);
            const response = await fetch(url, {
                method: "POST",
                headers,
                body: JSON.stringify({ text })
            });

            if (response.ok) {
                console.log("Voice: TTS audio received, starting playback...");
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const audio = new Audio(url);
                audio.play();
                
                audio.onended = () => {
                    console.log("Voice: TTS playback finished.");
                    URL.revokeObjectURL(url);
                };
            } else {
                const errText = await response.text();
                console.error("Voice: TTS API Error:", response.status, errText);
            }
        } catch (error) {
            console.error("Voice: TTS Error:", error);
        }
    }, []);

    return {
        isRecording,
        isProcessing,
        startRecording,
        stopRecording,
        toggleRecording,
        playAudioResponse
    };
};
