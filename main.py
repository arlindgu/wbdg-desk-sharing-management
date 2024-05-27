import requests
from datetime import datetime, timedelta
from concurrent.futures import ThreadPoolExecutor
import random
import sys

# Globale Variablen für die Buchungsstatistik
success_count = 0
fail_count = 0
planned_count = 0

def bookDesk(deskid, user, email, start, end, studid):
    global success_count, fail_count
    data = {
        'deskid': deskid,
        'user': user,
        'email': email,
        'start': start,
        'end': end,
        'studid': studid
    }
    response = requests.post('https://matthiasbaldauf.com/wbdg24/booking', data=data)
    if response.status_code == 200:
        success_count += 1
        print_status()
    else:
        fail_count += 1
        print_status()

def print_status():
    global success_count, fail_count, planned_count
    progress = (success_count + fail_count) / planned_count * 100 if planned_count > 0 else 0
    print('\rSuccess: {}, Fails: {}, Planned: {}, Progress: {:.2f}%'.format(success_count, fail_count, planned_count, progress), end='')
    sys.stdout.flush()  # Aktualisiere den Bildschirmausgabepuffer

def main():
    global planned_count
    # Setze den Startzeitpunkt auf das erste Datum des Jahres 2024 um 00:00 Uhr
    start_time = datetime(2024, 1, 1, 0, 0)
    # Setze den Endzeitpunkt auf das letzte Datum des Jahres 2024 um 23:59 Uhr
    end_time = datetime(2024, 12, 31, 23, 59)

    # Durchlaufe die Spanne für jede Desk ID
    desk_ids = [1, 2, 3, 4, 12, 11, 7, 10, 9, 13, 14]

    # Verwende einen ThreadPoolExecutor für Parallelisierung
    with ThreadPoolExecutor() as executor:
        # Für jeden Tag im Jahr 2024 starte einen Task
        current_time = start_time
        while current_time <= end_time:
            # Generiere zufällige Anzahl von Buchungen (5-10)
            num_bookings = random.randint(5, 10)
            planned_count += num_bookings  # Aktualisiere den geplanten Zähler
            for _ in range(num_bookings):
                # Generiere zufällige Desk ID
                desk_id = random.choice(desk_ids)

                # Generiere zufällige Startzeit innerhalb des aktuellen Tages
                random_hour = random.randint(0, 23)
                random_minute = random.randint(0, 59)
                random_second = random.randint(0, 59)
                start = current_time.replace(hour=random_hour, minute=random_minute, second=random_second)
                
                # Berechne Endzeit als 1 Stunde nach der Startzeit
                end = start + timedelta(hours=1)
                
                user = 'Test User'
                email = 'test@example.com'
                studid = 1234
                
                # Starte die Buchungsfunktion in einem separaten Thread
                executor.submit(bookDesk, desk_id, user, email, start.strftime('%Y-%m-%dT%H:%M:%S'), end.strftime('%Y-%m-%dT%H:%M:%S'), studid)
            
            # Inkrementiere die Zeit um 1 Tag für den nächsten Durchlauf
            current_time += timedelta(days=1)

if __name__ == "__main__":
    main()