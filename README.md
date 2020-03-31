# ProteGO


### Deployment

## Informacje wstępne

Deployment jest wykonany przez ustawienie środowiska na Google Cloud Platform.

## Ustawienie projektu Google Cloud Platform [GCP]

Ustawienie projektu GCP składa się z następnujących kroków:

1. Stworzenie projektu na platformie [Google Cloud](https://cloud.google.com/)

2. Na stronie projektu [console.cloud.google.com](https://console.cloud.google.com/) należy wykonać następujące ustawienia:
    * Billing - podpiąć płatność na stronie [Billing](https://console.cloud.google.com/billing/)
    * Datastore - ustawić *Datastore Mode* na stronie [Datastore](https://console.cloud.google.com/datastore/)

## Instalacja narzędzi 

Deployment jest wykonywany przy użyciu narzędzia [Terraform](https://www.terraform.io/) oraz [gcloud](https://cloud.google.com/sdk/gcloud).
Przed przystąpieniem do deploymentu należy wykonać następujące kroki:

1. Zainstalować narzędzie `gcloud`. Instrukcje można znaleźć na [cloud.google.com/sdk/install](https://cloud.google.com/sdk/install)

2. Zainstalować narzędzie `terraform`. Instrukcje można znaleźć na [learn.hashicorp.com/terraform/getting-started/install](https://learn.hashicorp.com/terraform/getting-started/install.html#installing-terraform)

## Deployment

1. Używając narzędzia `gcloud` Należy zalogować się do **GCP** przy użyciu strony logowana lub Service Account z odpowiednimi uprawnieniami:
   ```bash
   # strona logowania
   gcloud auth login
   
   # service account
   gcloud auth activate-service-account --key-file=<credentials.json>
   ```
   
2. Ustawienie odpowiedniego projektu jako aktywnego:
    ```bash
    gcloud config set project <project_id>
    ```
    * Pomocnicze komendy
        ```bash
        # wylistowanie wszystkich projektów
        gcloud projects list
        
        # wyświetlenie aktywnego projektu
        gcloud config list project
        ```
3. Ustawienie zmiennych środowiskowych.
    * `STAGE` - `DEVELOPMENT` lub `PRODUCTION` to jedyne dopuszczalne wartości. Zmienna ta mówi czy jest do środowisko produkcyjne (wysyłanie SMSów jest aktywne) czy deweloperskie.
    * `SMS_API_TOKEN` - Token do bramki SMS. Zmienna ta jest wymagana zawsze wymagana (dla środowiska deweloperskiego wartość ta nie musi być poprawna).
   
   ```bash
   export STAGE=DEVELOPMENT
   export SMS_API_TOKEN=1234
   ```
   
4. Uruchomienie skryptu tworzącego środowisko:
    ```bash
    bash scripts/create.sh
    ```
   Na Google Cloud Store będzie dodaktowo stworzony (jeśli nie istnieje) bucket do przechowywania konfiguracji narzędzia *terraform*.
   Nazwa bucketu skłąda się z ID projektu i końcówki "_-tfstate_"  ("_PROJECT_ID-tfstate_").
   Przechowywanie konfiguracji w _bucket_ jest wygodne ze względu na możliwość bezkonfliktowego używania narzędzia przez większą ilość osób.
   
## Wyczyszczenie środowiska

Aby wyczyścić środowisko należy wyskonać następącujące komendy:
* Usunięcie zasobów zarządzanych przez `terraform`:
```bash
bash scripts/teardown.sh
```

* Opcjonalnie możesz usunąć bucket zawierający konfigurację `terraform`
```bash
bash scripts/teardown_tfstate_bucket.sh
```
