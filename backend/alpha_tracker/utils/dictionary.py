import time
import requests

URL_TEMPLATE = "https://api.dictionaryapi.dev/api/v2/entries/en/%s"

# Rate limiting parameters
RATE_LIMIT = 450  # Maximum number of requests allowed per minute
REQUEST_INTERVAL = 60 / RATE_LIMIT  # Interval between requests in seconds

def _retry_with_backoff(word):
    delay = REQUEST_INTERVAL
    max_retries = 5
    max_delay = 60

    while True:
        response = requests.get(URL_TEMPLATE % word, timeout=3)

        if response.ok:
            return response.json()
        elif response.status_code == 404:
            return []
        else:
            time.sleep(delay)
            delay = min(delay * 2, max_delay)
            max_retries -= 1

        if max_retries == 0:
            return []

def get_definition(word):
    word_json = _retry_with_backoff(word)
    try:
        definition = word_json[0]["meanings"][0]["definitions"][0]["definition"]
        part_of_speech = word_json[0]["meanings"][0]["partOfSpeech"]
        return word, definition, part_of_speech
    except Exception:
        return None, None, None
