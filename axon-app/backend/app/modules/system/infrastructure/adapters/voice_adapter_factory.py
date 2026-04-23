from app.modules.system.domain.enums import VoiceProvider
from app.modules.system.domain.ports.voice_port import VoiceProviderPort
from app.modules.system.infrastructure.adapters.voice.elevenlabs_adapter import ElevenLabsAdapter
from app.modules.system.infrastructure.adapters.voice.cartesia_adapter import CartesiaAdapter
from app.modules.system.infrastructure.adapters.voice.inworld_ai_adapter import InworldAIAdapter
from app.modules.system.infrastructure.adapters.voice.hyperscaler_adapter import HyperscalerAdapter

class VoiceAdapterFactory:
    """
    Factory to retrieve the correct voice adapter instance based on the VoiceProvider enum.
    """
    
    @staticmethod
    def get_adapter(provider: VoiceProvider) -> VoiceProviderPort:
        if provider == VoiceProvider.ELEVENLABS:
            return ElevenLabsAdapter()
        elif provider == VoiceProvider.CARTESIA:
            return CartesiaAdapter()
        elif provider == VoiceProvider.INWORLD_AI:
            return InworldAIAdapter()
        elif provider in [VoiceProvider.GOOGLE_CLOUD, VoiceProvider.MICROSOFT_AZURE, VoiceProvider.AMAZON_POLLY]:
            return HyperscalerAdapter(provider_name=provider.value)
        else:
            raise ValueError(f"No adapter implemented for voice provider: {provider}")
