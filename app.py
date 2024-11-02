from flask import Flask, request, jsonify, send_file
import os
import speech_recognition as sr
from googletrans import Translator, LANGUAGES
from werkzeug.utils import secure_filename
from pydub import AudioSegment
from fpdf import FPDF
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Initialize the recognizer and translator
recognizer = sr.Recognizer()
translator = Translator()

# Define a folder to save uploaded audio files
UPLOAD_FOLDER = './uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Sample texts for demonstration (replace these with actual storage or data retrieval)
transcribed_text = "Sample transcribed text"
translated_text = "Sample translated text"

# Mapping for full language names
def get_language_name(code):
    return LANGUAGES.get(code, code)

# Helper function to recognize speech from audio
def recognize_speech(audio_path):
    try:
        with sr.AudioFile(audio_path) as source:
            audio_data = recognizer.record(source)
            text = recognizer.recognize_google(audio_data)
            return text
    except sr.UnknownValueError:
        return "Google Speech Recognition could not understand audio"
    except sr.RequestError as e:
        return f"Could not request results from Google Speech Recognition service; {e}"
    except Exception as e:
        return str(e)

# Convert webm file to wav
def convert_to_wav(file_path):
    try:
        audio = AudioSegment.from_file(file_path)
        wav_file_path = file_path.replace('.webm', '.wav')
        audio.export(wav_file_path, format='wav')
        return wav_file_path
    except Exception as e:
        print(f"Error converting file: {str(e)}")
        return None

# Audio to Text endpoint
@app.route('/audio', methods=['POST'])
def audio_to_text():
    if 'file' not in request.files:
        return jsonify({'error': 'No audio file uploaded'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Validate file type (ensure it's an audio file)
    if not (file.filename.endswith('.wav') or file.filename.endswith('.webm') or file.filename.endswith('.mp3')):
        return jsonify({'error': 'Invalid file format. Only .wav, .webm, .mp3 are supported.'}), 400

    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

    try:
        file.save(file_path)
        print(f"File saved to {file_path}")

        # Convert to WAV if necessary
        if file_path.endswith('.webm'):
            file_path = convert_to_wav(file_path)
            if not file_path:
                return jsonify({'error': 'Failed to convert audio file'}), 500

        # Recognize the speech from the saved file
        transcription = recognize_speech(file_path)

        if transcription.startswith("Could not"):
            return jsonify({'error': transcription}), 500

        # You can add real language detection if necessary
        detected_language_code = 'en'  # Placeholder detected language for now
        detected_language = get_language_name(detected_language_code)

        global transcribed_text
        transcribed_text = transcription  # Update global transcribed_text variable

        return jsonify({'text': transcription, 'language': detected_language})
    except Exception as e:
        print(f"Error processing audio file: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Translation endpoint
@app.route('/translate', methods=['POST'])
def translate_text():
    data = request.get_json()
    text = data.get('text')
    target_language_code = data.get('target_language')

    if not text or not target_language_code:
        return jsonify({'error': 'Missing text or target language'}), 400

    try:
        # Log the inputs for debugging
        print(f"Translating '{text}' to {target_language_code}")

        # Perform translation
        translation = translator.translate(text, dest=target_language_code)

        # Log the response to debug
        print(f"Google Translate API response: {translation}")

        if translation and hasattr(translation, 'text'):
            target_language = get_language_name(target_language_code)
            global translated_text
            translated_text = translation.text  # Update global translated_text variable
            return jsonify({
                'translated_text': translation.text,
                'target_language': target_language
            })
        else:
            return jsonify({'error': 'Translation failed, invalid response'}), 500
    except Exception as e:
        print(f"Error during translation: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Endpoint to get transcribed and translated texts
@app.route('/texts', methods=['GET'])
def get_texts():
    return jsonify({
        'transcribedText': transcribed_text,
        'translatedText': translated_text
    })

# Generate PDF endpoint
@app.route('/generate-pdf', methods=['POST'])
def generate_pdf():
    data = request.get_json()
    text = data.get('text')
    if not text:
        return jsonify({'error': 'No text provided'}), 400

    try:
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", size=12)
        pdf.multi_cell(0, 10, text)

        # Save PDF to a temporary file
        pdf_filename = "generated.pdf"
        pdf_output_path = os.path.join(app.config['UPLOAD_FOLDER'], pdf_filename)
        pdf.output(pdf_output_path)

        # Send the file to the client
        return send_file(pdf_output_path, as_attachment=True, download_name=pdf_filename, mimetype='application/pdf')
    except Exception as e:
        print(f"Error generating PDF: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
