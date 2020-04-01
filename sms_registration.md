# Rejestracja SMS

## Wprowadzenie

Proces rejestracji jest najbardziej newralgicznym elementem naszego systemu. Musimy zabezpieczyć się przed następującymi próbami nadużyć:

* ktoś spamuje różne numery telefonu naszymi kodami (i naraża nas na koszty)
* ktoś spamuje jeden numer telefonu naszymi kodami (i naprzykrza się)
* ktoś próbuję uniemożliwić komuś rejestrację wysyłając `/register` tuż po tym jak rejestrujący się rozpoczął rejestrację, tym samym zmieniając jego kod

Jak osiągnąć powyższe:
* jeśli z jakiegoś IP przychodzą żądania rejestracji, które nie kończą się powodzeniem, pozwalamy zrobić kolejne (wysłać SMS) po odczekaniu jakiegoś timeout'u
* nie wysyłamy SMSa na ten sam numer częściej niż 1 na minutę
* nie wysyłamy SMSa na ten sam numer częściej niż 4 na godzinę
* kod weryfikacyjny jest taki sam przez 10 minut. To znaczy, że jeśli ktoś w ciągu 10 minut jeszcze raz wywoła `/register` dla takiego samego numeru dostanie taki sam kod (!)
* kod weryfikacyjny jest ważny przez 10 minut. Użytkownik ma 10 minut na wpisanie poprawnego kodu
* zapisujemy każde wywołanie `/register` do tabeli `Registrations`. czyścimy starsze niż 24h
* zapisujemy do `Registrations` czy wysłaliśmy wiadomość SMS
* zapisujemy do `Registrations` czy zakończyło się powodzeniem
* limitujemy `/verify_registration` do 3 razy na godzinę dla tego samego numeru. 

Zwracamy aplikacjom za ile czasu mogą ponowić zapytanie.

Kod do tego musi być super klarowny i wszystkie oczy na pokład.

Treści wiadomości:
pl: `Twój kod dla NAZWA to: 123-456`
en: `Your NAZWA code is: 123-456`

## Pseudokod

Parametry:
`invalid_regs_per_IP = 10`
`invalid_regs_per_msisdn = 4`


**`/register(msisdn, IP) returns error lub registration_id`**

Policz ile `pending` rejestracji nastąpiło z `IP` w ciągu ostatniej 1h. Jeśli więcej niż `invalid_regs_per_IP` zwróć `error = "Rejestracja chwilowo niedostępna. Spróbuj za godzinę"`. (zadanie z gwiazdką: policzyć za ile minut będzie możliwa rejestracja i zwrócić liczbę minut)

Policz ile `nieudanych` rejestracji nastąpiło na numer `msisdn` i jeśli więcej niż `invalid_regs_per_msisdn` zwróć `error = "Rejestracja chwilowo niedostępna. Spróbuj za godzinę"`. (zadanie z gwiazdką: jak wyżej).

Sprawdź czy istnieje `Registration` na ten sam `msisdn` rozpoczęte w ciągu ostatnich 10 minut. Jeśli tak weź użyj `code` z tej rejestracji. Jeśli nie wylosuj `code`. (Tak, to oznacza, ten sam `code` może żyć dłużej niż 10 minut).

Zapisz do `Registrations` `IP`, `msisdn`, `registration_date`, `code`. Oznacz jako `pending`.

Sprawdź czy istnieje `Registration` na ten sam `msisdn` rozpoczęte w ciągu ostatniej minuty. Jeśli NIE, wyślij SMS.

Zwróć `registration_id`

**`/confirm_registration(registration_id, code)` returns error lub user_id**

Znajdź `Registration` po `registration_id` i statusie `pending`.
Jeśli nie ma, zwróć `error = Rejestracja niepoprawna. Spróbuj ponownie`. 

Sprawdź czy `Registration.registration_date` nie jest starsze niż 10 minut. Jeśli tak, zwróć `error = Rejestracja wygasła. Spróbuj ponownie`

Sprawdź czy `Registration.code == code`. Jeśli nie, oznacz `Registration` jako `incorrect` i zwróć `error = Niepoprawny kod. Spróbuj ponownie`. 

Oznacz `Registration` jako `completed`.

Sprawdź czy jest już `User` z `msisdn == Registration.msisdn`. Jeśli tak, zwróć `User.user_id`.

W przeciwnym wypadku wygeneruj nowego `User` i zwróć `User.user_id`.


Źródła i inspiracje:
https://www.twilio.com/docs/verify/developer-best-practices
https://stackoverflow.com/questions/20839638/how-do-you-prevent-verification-code-attack-to-server
