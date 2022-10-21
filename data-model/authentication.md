# Authenticatie

Aanmelden in Kaleidos gebeurt d.m.v. een integratie met ACM/IDM, het gebruikersbeheer- en authenticatiesysteem van de Vlaamse Overheid.

In het gebruikersbeheer van de VO kan aan gebruikers voor een bepaalde werkrelatie (= gebruiker als lid van een organisatie) toegang tot Kaleidos verleend worden in een bepaalde rol. Bij het aanmelden wordt deze informatie door ACM/IDM doorgegeven aan Kaleidos in de vorm van OAuth claims. De integratie is geïmplementeerd in de [acmidm-login-service](https://github.com/kanselarij-vlaanderen/acmidm-login-service).

## Data model

De informatie wordt in Kaleidos opgeslagen volgens onderstaand data model.

![Data model](../images/authentication-data-model.svg)

De werkrelatie wordt gecapteerd via een `org:Membership` die een gebruiker (`foaf:Person`) als lid van een bepaalde organizatie (`foaf:Organization`) in een bepaalde rol (`org:Role`) voorstelt. Iedere gebruiker heeft ook een account (`foaf:OnlineAccount`).

Bij de eerste aanmelding wordt een persoon, account, membership en organization resource aangemaakt indien deze nog niet bestaan.

De verschillende rollen zijn statisch ingeladen in Kaleidos als codelijst. De `skos:notation` van een rol bevat de mapping naar de rol zoals die doorgegeven wordt vanuit ACM/IDM.

Bij het aanmelden wordt de huidige mu-session gelinkt aan de account (`foaf:OnlineAccount`) en aan de werkrelatie (`org:Membership`) waarmee de gebruiker inlogt. Op ieder moment kan de gebruiker maar voor één werkrelatie gelijk ingelogd zijn in Kaleidos. Deze keuze wordt gemaakt tijdens het aanmeldingsproces van ACM/IDM.

## Mapping met ACM/IDM claims

De informatie uit ACM/IDM claims wordt in Kaleidos overgenomen volgens onderstaande mapping:

| Claim                 | Resource             | Property           |
|-----------------------|----------------------|--------------------|
| `given_name`          | `foaf:Person`        | `foaf:firstName`   |
| `family_name`         | `foaf:Person`        | `foaf:familyName`  |
| `vo_id`               | `foaf:Person`        | `dct:identifier`   |
| `sub`                 | `foaf:OnlineAccount` | `foaf:accountName` |
| `vo_orgcode`          | `foaf:Organization`  | `org:identifier`   |
| `vo_orgnaam`          | `foaf:Organization`  | `skos:prefLabel`   |
| `dkb_kaleidos_rol_3d` | `org:Role`           | `skos:notation`    |

## Blokkeren van gebruikers, werkrelaties en organisaties

In principe wordt de toegang tot Kaleidos volledig beheerd in het gebruikersbeheer van ACM/IDM. Om toch snel te kunnen handelen in noodsituaties voorziet Kaleidos echter de optie om dit gebruikersbeheer te overrulen en toegang tot de applicatie te blokkeren voor een (subset van) gebruiker(s). Het blokkeren kan op verschillende niveaus toegepast worden:

1. op niveau van **werkrelatie**: een gebruiker heeft geen toegang meer voor een bepaalde organisatie
2. op niveau van **gebruiker**: een gebruiker heeft geen toegang meer voor geen enkele van zijn werkrelaties, inclusief nieuwe werkrelaties waarmee hij in de toekomst aanmeldt
3. op niveau van **organisatie**: alle gebruikers met een werkrelatie voor een bepaalde organisatie hebben geen toegang meer, incl. nieuwe gebruikers die zich in de toekomst aanmelden voor deze organisatie. De blokkering op organisatieniveau vertaalt zich naar een blokkering op het niveau van de werkrelaties. Deze blokkering kan nadien per werkrelatie aangepast worden om zo toch uitzonderingen toe te staan binnen een geblokkeerde organisatie.
