# Publication flow [in progress]

De publication flow omvat het proces om besluiten te publiceren in het Belgisch Staatsblad. Zo’n besluit kan het resultaat zijn van een besluitvormingsaangelegenheid van de VR of aangeleverd worden via een andere weg.

De publication flow gaat uit van ondertekende documenten als startpunt. De hele handteken-procedure wordt daarom onafhankelijk gezien van de publication flow.

De publication-flow valt buiten de scope van het OSLO Besluitvorming AP. Er zijn echter wel gelijkenissen en raakpunten. Waar mogelijk worden concepten uit het Besluitvorming AP gebruikt. Deze worden aangevuld met nieuw gedefinieerde concepten in de `pub`-namespace (`http://mu.semte.ch/vocabularies/ext/publication/`).

![Data model](../images/publication-flow-data-model.svg)

## Publicatieaangelegenheid
Naar analogie met de `besluitvorming:Besluitvormingsaangelegenheid` (die leidt tot een besluit) wordt in de publication-flow een `pub:Publicatieaangelegeidheid` (die leidt tot een publicatie) als main resource gezien. De publicatieaangelegenheid is de kapstok waar alles aanhangt.

Een publicatieaangelegenheid is gelinkt aan een dossier via `dossier:behandelt`. In het geval het een publicatie via de MR betreft, is dit hetzelfde dossier als de besluitvormingsaangelegenheid. In het andere geval wordt er een nieuw dossier gemaakt op het moment dat de publicatieaangelegenheid gemaakt wordt.

Bij het opstarten van een nieuwe publicatieaangelegenheid wordt de openingsdatum (`dossier:openingsdatum`) op de huidige datum/tijd ingesteld. De titel (`dct:title`) en korte titel (`dct:alternative`) worden overgenomen van de besluitsvormingsaangelegenheid indien die er is.

Sommige eigenschappen van de publicatieaangelegenheid hebben betrekking op het doeldocument van de publication-flow (vb. type regelgevend document, wijze van publicatie). Momenteel zijn deze rechtstreeks op publicatieaangelegenheid gedefinieerd, maar mogelijk willen we hier in de toekomst toch een aparte resource voor definiëren.

Opmerkingen:
* Het splitsen van dossier en besluitvormingsaangelegenheid in de huidige implementatie valt buiten de scope van de publicatieflow
* Mogelijk willen we in de toekomst voor publicaties die opgestart worden niet vanuit een MR toch een beperkte historiek van de besluitvormingsaangelegenheid bijhouden

**TODO**: relatie met referentiedocument(en)? Verder uit te werken wanneer design klaar is

# Publicatie status
Een publicatieaangelegenheid kent verschillende statussen:
* te publiceren
* gepauzeerd
* afgevoerd
* gepubliceerd

Deze worden voornamelijk gebruikt voor interne workflow doeleinden.

Elk van de statussen is een `skos:Concept` die deel uitmaken van eenzelfde `skos:ConceptScheme` via `skos:inScheme`.

Om publicaties te kunnen opvolgen wil men de datum van de laatste statuswijziging bijhouden. Dit gebeurt via een `pub:PublicatieStatusWijziging < prov:Activity`. Momenteel wordt enkel de laatste wijzing bijgehouden. De eigenschap `prov:startedAtTime` bevat het tijdstip van de wijziging. De `pub:PublicatieStatusWijziging` is via `prov:hadActivity` gerelateerd aan de publicatieaangelegenheid. Op ieder moment bevat de `pub:PublicatieStatusWijziging` die gerelateerd is aan de publicatieaangelegenheid het tijdstip waarop de huidige status van de publicatieaangelegenheid gezet is.

Wanneer de status gewijzigd wordt naar afgevoerd of gepubliceerd, betekent dit ook dat de een sluitingsdatum (`dossier:sluitingsdatum`) gezet wordt alsook de einddatum (`dossier:Procedurestap.einddatum`) op de bijhorende procedurestappen indien deze nog niet ingevuld zijn.

# Procedure
Iedere publication flow omvat volgende, vaste procedurestappen:
1. Vertaling
2. Publicatie

Elk van de procedurestap types is een `skos:Concept` die deel uitmaakt van eenzelfde `skos:ConceptScheme` via `skos:inScheme`.

Bij het aanmaken van een publication flow worden de 2 procedurestappen automatisch aangemaakt met als startdatum (`dossier:Procedurestap.startdatum`) dezelfde datum als de openingsdatum van de publicatieaangelegenheid.

In uitbreiding van de procedurestap uit het OSLO Besluitvorming AP kan er bij iedere procedurestap ook gezet worden:
* verwachte datum (`tmo:targetEndDate`)
* vereiste datum (`tmo:dueDate`)

Deze datums geven een streefdatum voor de hele procedurestap. Op een activiteit van de procedurestap kan een specifiekere datum voor die ene activiteit gezet worden.

## Vertaling procedurestap
De vertaling-procedurestap kan volgende activiteiten omvatten:
- aanvraag (`pub:AanvraagActiviteit`): het versturen van een aanvraag (via mail) om een document te vertalen
- vertaling (`pub:VertaalActiviteit`): het vertalen van een document
- annulatie (`pub:AnnulatieActiviteit`): het intrekken/annuleren van een vertaalaanvraag

Elk van de activiteiten is een subclass van `prov:Activity`. Naar analogie met de activiteiten binnen de besluitvormingsaangelegenheid, worden de subclasses expliciet gedefinieerd in de implementatie. Eventueel in de toekomst, wanneer mu-cl-resources inheritance ondersteunt, kan er gewerkt worden met een superclass die alle gemeenschappelijke eigenschappen bevat.

De activiteiten komen steeds in paren voor. Voor iedere taal waarvoor een vertaling moet gebeuren, wordt een aanvraag-activiteit en automatisch een bijhorende vertaling-activiteit gemaakt. De activiteiten zijn gekoppeld aan elkaar via `prov:wasInformedBy`.

In praktijk wordt momenteel steeds slechts naar 1 taal vertaald, nl. Frans. We voorzien echter de flexibiliteit in het data model dat dit meerdere talen (en dus meerdere aanvraag- en vertaal-activiteiten) kunnen zijn in de toekomst.

### Aanvraag activiteit
De aanvraag activiteit bevat zelf weinig eigenschappen. Het scherm om de aanvraag op te stellen bevat voornamelijk invulvelden voor gerelateerde resources, nl. `nmo:Email` en `pub:VertaalActiviteit`.

De geselecteerde documenten om te vertalen zijn het eindresultaat (`dossier:genereert`) van de aanvraag activiteit en tevens de bron (`prov:used`) van de vertaal activiteit.

### Vertaal activiteit
Wanneer het vertaalde document ontvangen wordt, wordt het als resultaat (`dossier:genereert`) aan de vertaling-activiteit gekoppeld en toegevoegd als stuk aan het dossier. Er wordt een einddatum op de activiteit gezet en, aangezien er momenteel maar 1 vertaling nodig is, is dit ook een einddatum van de vertaling-procedurestap.

**TODO**: link tussen origineel document en vertaald stuk?, taal toevoegen aan stuk?

## Publicatie procedurestap
De publicatie-procedurestap kan volgende activiteiten omvatten:
- aanvraag (`pub:AanvraagActiviteit`): het versturen van een aanvraag (via mail) naar het BS om een drukproef of publicatie voor een document te maken
- drukproef (`pub:DrukproefActiviteit`): het maken van (een correctie van) de drukproef voor een document
- publicatie (`pub:PublicatieActiviteit`): publicatie van een goedgekeurde drukproef in het BS

Elk van de activiteiten is een subclass van `prov:Activity`. Naar analogie met de activiteiten binnen de besluitvormingsaangelegenheid, worden de subclasses expliciet gedefinieerd in de implementatie. Eventueel in de toekomst, wanneer mu-cl-resources inheritance ondersteunt, kan er gewerkt worden met een superclass die alle gemeenschappelijke eigenschappen bevat.

De activiteiten komen steeds in paren voor. Voor iedere (correctie van) een drukproef, wordt een aanvraag-activiteit en automatisch een bijhorende drukproef-activiteit gemaakt. Ook bij publicatie, wordt een aanvraag-activiteit en automatisch een bijhorende publicatie-activiteit gemaakt. De activiteiten zijn gekoppeld aan elkaar via `prov:wasInformedBy`.

Sequentieel bevat de publicatie-procedurestap volgende activiteiten paren:
- aanvraag/drukproef voor initiele drukproef
- aanvraag/drukproef voor correcties van drukproef (optioneel, kunnen er meerdere zijn)
- aanvraag/publicatie voor finale publicatie

## Activiteiten
Iedere aanvraag-activiteit gebruikt (`prov:used`) stukken. Deze worden als bijlage toegevoegd aan de notificatie e-mail die verstuurd wordt. Elke gerelateerde activiteit (zowel vertaal-, drukproef- als publicatie-activiteit) gebruikt dezelfde stukken als de aanvraag-activiteit. De ontvangen stukken worden gelinkt aan de activiteit via `dossier:genereert`. In het geval van de publicatie-activiteit is het ontvangen stuk tevens een `besluit:Besluit`.

- **TODO**: praktische implementatie van `prov:wasInformedBy` in mu-cl-resources
- **TODO**: praktische implementatie van `dossier:vindtPlaatsTijdens` in mu-cl-resources
- **TODO**: `pub:Procedurestap` < `dossier:Procedurestap` om scheiding met besluitvorming strikter te maken
- **TODO**: praktische implementatie van progress badges (totaal = aantal aanvraagactiviteiten; in progress = aantal aanvraagactiviteiten waarvan bijhorende activiteit geen einddatum heeft)

# Opstarten van een publication-flow
## Vanuit een MR
**TODO**: regelgevend document als referentiedocument. Verder uit te werken wanneer designs gefinaliseerd zijn

## Niet via MR
In het geval een publication-flow opgestart wordt niet via een MR wordt er een nieuw dossier (`dossier:Dossier`) gemaakt op het moment dat de publicatieaangelegenheid gemaakt wordt. De gebruiken kan vrij een titel (`dct:title`) en korte titel (`dct:alternative`) ingeven.

Mogelijk willen we in de toekomst voor publicaties die opgestart worden niet vanuit een MR toch een beperkte historiek van de besluitvormingsaangelegenheid bijhouden.

# Identificatoren
Een publication-flow heeft verschillende identificatoren:
- intern werkingsnummer
- numac nummer ontvangen van BS na aanvraag van een drukproef

Beiden worden gemodelleerd als `adms:Identifier` resource, maar omwille van implementatie-beperkingen van mu-cl-resources wordt het intern werkingsnummer gelinkt via `adms:identifier`, terwijl voor het numac-nummer een custom subproperty `pub:identifier < adms:identifier` gebruikt wordt.

## Intern werkingsnummer
Het intern werkingsnummer is gestructureerd. De structuur wordt gecapteerd met `generiek:GestructureerdeIdentificator`. Het is gerelateerd aan de `adms:Identifier` via `generiek:gestructureerdeIdentificator`. De structuur  is 2-ledig en bestaat uit:
- uniek nummer: `generiek:lokaleIdentificator`
- versie (bis, tris, ...): `generiek:versieIdentificator`

De eigenschap `skos:notation` van de `adms:Identifier` bevat de samengestelde identifier.

## Numac nummer
Het numac nummer is een eigenschap die eigenlijk bij het besluit hoort dat gepubliceerd wordt in het BS als resultaat van de publication-flow. Aangezien deze besluit resource nog niet voorhanden is bij het aanvragen van de drukproef en het numac-nummer actief gebruikt wordt door OVRB tijdens het opvolgen van publicaties, wordt het numac-nummer ook bijgehouden als eigenschap van de publicatieaangelegenheid via `pub:identifier`.

# Publicatie
Het eindresultaat van een publication-flow is een gepubliceerd besluit in het BS. Dit is een legale verschijningsvorm (`eli:LegalExpression`) van de rechtsgrond (`eli:LegalResource`) die vervat zit in het besluit. De beslissingsfiche die opgeladen wordt bij een agendapunt van de MR is een andere legale verschijningsvorm van diezelfde rechtsgrond.

De structuur van de URL waarop de publicatie beschikbaar is in het BS volgt de [ELI richtlijnen](http://www.ejustice.just.fgov.be/eli/besluit/2020/06/11/2019031018/staatsblad). Vb. http://www.ejustice.just.fgov.be/eli/wet/2016/04/22/2016003166. Op basis van de data in Kaleidos kan deze URL geconstrueerd worden en automatisch gemoniteerd worden om te verifiëren of de aangevraagde publicatie effectief verschenen is. Indien de publicatie verschenen is, kan automatisch:
- de publicatiestatus aangepast worden naar gepubliceerd
- een sluitingsdatum gezet worden op de publicatieaangelegenheid
- een einddatum gezet worden op de publicatie-procedurestap
- een einddatum gezet worden op de publicatie-activiteit
- de ELI-conforme URL koppelen aan het besluit in Kaleidos (**TODO** met welk predicate?)

# Mail notificaties
Voor de aanvraag- en annuleringactiviteiten wordt een notificatie via e-mail verstuurd vanuit de Kaleidos applicatie. Dit wordt gemodelleerd met `nmo:Email` volgens het data model van de [mail delivery service](https://github.com/redpencilio/deliver-email-service).

De e-mail wordt via `dct:subject` gelinkt aan de aanvraag- en annulatie-activiteit. In mu-cl-resources wordt de relatie enkel gespecifieerd van de activiteit naar de email.