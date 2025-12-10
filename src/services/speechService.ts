const SPEECH_TO_TEXT_API_URL = 'https://api-integrations.appmedo.com/app-7x1ojvae4075/api-Xa6JZJO25zqa/v1/audio/transcriptions';
const API_KEY = 'aoampOdNvwF3csAVKJNXX0h0KlQ2bDJU';

export interface TranscriptionResponse {
  text: string;
}

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  try {
    const formData = new FormData();
    
    const audioFile = new File([audioBlob], 'voice-order.webm', {
      type: audioBlob.type
    });
    
    formData.append('file', audioFile);
    formData.append('response_format', 'json');
    formData.append('language', 'english');

    const response = await fetch(SPEECH_TO_TEXT_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Speech-to-Text API error:', errorText);
      throw new Error(`Failed to transcribe audio: ${response.status} ${response.statusText}`);
    }

    const data: TranscriptionResponse = await response.json();
    
    if (!data.text) {
      throw new Error('No transcription text received');
    }

    return data.text;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error;
  }
}