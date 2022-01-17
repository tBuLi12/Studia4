# PAP21Z-Z22
 Michał Kopeć  
 Karol Orzechowski  
 Jeremi Sobierski  
 Wiktor Pytlewski  

Gitlab: [System "Studia4"](https://gitlab-stud.elka.pw.edu.pl/korzech2/studia4)

## Ogólne Założenia Aplikacji
Zadaniem aplikacji będzie stworzenie narzędzia informatycznego, służącego do zarządzania sprawami na uczelni. Głównymi funkcjonalnościami Studia4 będą:
* logowanie studenta/prowadzącego/admina do systemu
* wyświetlanie:
    * planu zajęć
    * stron przedmiotów
    * stron użytkowników
    * przynależności do grup dziekańskich
    * aktualności z uczelni
* wystawianie i wyświetlanie ocen
* rejestracja na zajęcia
* dodawanie, usuwanie użytkownika/przedmiotu oraz aktualizowanie jego danych
* udostępnianie materiałów dydaktycznych przez prowadzących

Wymagania, które stawiamy implementacji:

* wykorzystywanie relacyjnej bazy danych
* równomierne zapełnianie grup zajęciowych
* układanie planu zajęć
* graficzny interfejs użytkownika i strona internetowa
* testowanie przy użyciu programów naśladujących działanie użytkowników

## Wygląd Aplikacji

[Podgląd:](https://tbuli12.pythonanywhere.com/static/index.html)

## Architektura Rozwiązania
Główna logika programu będzie oddzielona od bazy danych oraz interfejsów użytkownika. UI będzie komunikowało się z backendem, który następnie wyśle odpowiednie zapytanie do bazy danych.

## Sposoby Testowania Aplikacji
W celu sprawdzenia poprawności działania programu zostaną utworzone boty symulujące działania użytkownika. Dodatkowo zostaną przeprowadzone testy funkcjonalne UI oraz zasymulowane zostaną sytuacje specjalne mn. in. rejestracja na przedmioty „kto pierwszy”, układanie prawidłowego planu zajęć, czy dodawanie lub usuwanie studentów.

## Uruchamianie Projektu
Uruchomienie aplikacji wymaga posiadania javy 17 oraz mavena 3.8.3.

## Dokumentacja

[Dokumentacja "Studia4"](https://gitlab-stud.elka.pw.edu.pl/korzech2/studia4/-/tree/master/docs)
