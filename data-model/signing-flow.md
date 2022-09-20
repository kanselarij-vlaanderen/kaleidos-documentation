# Sign flow

De sign flow omvat het proces om documenten uit de ministerraad van de VR digitaal te laten ondertekenen door de bevoegde ministers. Het startpunt zijn de documenten die gekoppeld zijn aan een behandeld agendapunt van de ministerraad. Het beoogde resultaat zijn ondertekende documenten. Deze vormen het startpunt voor de [publication flow](./publication-flow.md).

De signing-flow valt buiten de scope van het OSLO Besluitvorming AP. Er zijn echter wel gelijkenissen en raakpunten. Waar mogelijk worden concepten uit het Besluitvorming AP en gerelateerde APs gebruikt. Deze worden aangevuld met nieuw gedefinieerde concepten in de `sign`-namespace (`http://mu.semte.ch/vocabularies/ext/handtekenen/`).

![Data model](../images/signing-flow-data-model.svg)

# Handtekenaangelegenheid
Naar analogie met de `besluitvorming:Besluitvormingsaangelegenheid` (die leidt tot een besluit) wordt in de signing-flow een `sign:Handtekenaangelegenheid` (die leidt tot getekend documenten) als main resource gezien. De handtekenaangelegenheid is de kapstok waar alles aanhangt.

Een apart type `sign:Handtekenaangelegenheid` (< `dbpedia:Case`) definiëren laat toe om deze stap in het proces verder in detail uit te werken met eigen procedurestappen en activiteiten. Op die manier kan de volledige handteken workflow van de kabinetten gecapteerd worden.

Aan de kant van de secretarie kan de `sign:Handtekenaangelegenheid` in het gehele plaatje van de besluitvorming louter als een procedurestap binnen de besluitvormingsaangelegenheid aanzien worden. Zij hoeven de details van de workflow niet te kennen aangezien de opvolging voornamelijk aan de kant van de kabinetten gebeurt. Omdat er momenteel echter geen nood is voor de secretarie (integendeel) om deze stap weer te geven naast de andere procedurestappen in de Kaleidos applicatie, wordt het type `dossier:Procedurestap` niet expliciet toegekend aan de `sign:Handtekenaangelegenheid`.

Een handtekenaangelegenheid is gelinkt aan een dossier via `sign:behandeltDossier` (< `dossier:behandelt`). Het dossier is hetzelfde als dat van de besluitvormingsaangelegenheid. Sign flows voor andere dossiers worden niet ondersteund in Kaleidos.

Een handtekenaangelegenheid start steeds vanuit een beslissingsactiviteit (`besluitvorming:Beslissingsactiviteit`), gelinkt via `sign:heeftBeslissing` (< `dct:subject`). Bij het opstarten van een nieuwe handtekenaangelegenheid wordt de openingsdatum (`dossier:openingsdatum`) op de huidige datum/tijd ingesteld. De titel (`dct:title`) en korte titel (`dct:alternative`) worden overgenomen van de besluitsvormingsaangelegenheid indien die er is. Eens opgestart kan de titel van de handtekenaangelegenheid gewijzigd worden zonder dat de titel van de bijhorende besluitvormingsaangelegenheid wijzigt.

Sommige eigenschappen van de handtekenaangelegenheid hebben betrekking op het doeldocument van de uiteindelijke publicatie (vb. type regelgevend document). Momenteel zijn deze rechtstreeks op handtekenaangelegenheid gedefinieerd, maar mogelijk willen we hier in de toekomst toch een aparte resource voor definiëren zodat de informatie gedeeld kan worden tussen de besluitvorming-, handteken- en publicatieaangelegenheid.

# Procedure
Iedere handtekenaangelegenheid bevat 1 vaste procedurestap: `sign:HandtekenProcedurestap` (< `dossier:Procedurestap`). Bij het aanmaken van een handtekenaangelegenheid wordt de procedurestap automatisch aangemaakt met als startdatum (`dossier:Procedurestap.startdatum`) dezelfde datum als de openingsdatum van de handtekenaangelegenheid.

Tijdens een procedurestap kunnen volgende activiteiten plaatsvinden:
- `sign:Markeringsactiviteit`
- `sign:Voorbereidingsactiviteit`
- `sign:Handtekenactiviteit`
- `sign:Weigeractiviteit`
- `sign:AnnulatieActiviteit`
- `sign:Afrondingsactiviteit`

Elke activiteit is een subclass van `prov:Activity`, heeft een startdatum (`dossier:Activiteit.startdatum`) en mogelijk een einddatum (`dossier:Activiteit.einddatum`). Voor instant activiteiten zijn de start- en einddatum gelijk. Andere activiteiten kunnen meer tijd in beslag nemen.

Totdat inheritance ondersteund wordt in mu-cl-resources worden voor de relatie tussen de procedurestappen en verschillende types activiteit custom subpredicates van `dossier:vindtPlaatsTijdens` gebruikt. Om het onderscheid te maken zit het type activiteit vervat in het predicate, bijvoorbeeld `sign:markeringVindtPlaatsTijdens`, `sign:handtekeningVindtPlaatsTijdens`, ...

Elk van de activiteiten wordt verder verduidelijkt in onderstaande secties.

## Markeren van documenten
Een nieuwe handtekenaangelegenheid wordt opgestart door de raadgever door het markeren van documenten die getekend moeten worden op de agenda van een MR. Voor ieder document wordt een aparte handtekenaangelegenheid opgestart. De aangelegenheid wordt gelinkt aan het dossier en de behandeling van agendapunt waarop het document gemarkeerd wordt. De ingelogde gebruiker, nl. de raadgever, wordt als `dct:creator` gelinkt aan de handtekenaangelegenheid.

Voor iedere nieuwe handtekenaangelegenheid wordt een handteken-procedurestap gemaakt en een bijhorende markeringsactiviteit (`sign:MarkeringsActiviteit`). De activiteit bevat een link (`sign:gemarkeerdStuk` < `dossier:genereert`) naar het document (`dossier:Stuk`) dat gemarkeerd wordt om te handtekenen.

_Note: het markeren van documenten bevat nog geen interactie met SigningHub. De signing-flow is op dit moment enkel gekend aan de kant van Kaleidos._

## Voorbereiden van documenten in SigningHub
Nadat de raadgever documenten gemarkeerd heeft, moet iedere handtekenaangelegenheid voorbereid worden in SigningHub. Deze activiteit wordt uitgevoerd door een secretariaatsmedewerker van het kabinet en omvat:
- het opladen van de documenten in SigningHub
- het koppelen van documenten aan een werkstroom in SigningHub
- het plaatsen van handtekenvakken in de document(en) in SigningHub

Al deze acties zitten vervat in `sign:Voorbereidingsactiviteit`. Deze activiteit is gelinkt aan de markeringsactiviteit via `prov:wasInformedBy`: de output van de markeringsactiviteit, nl. het gemarkeerde document, is de input van de voorbereidingsactiviteit.

Het document dat opgeladen wordt in SigningHub wordt in Kaleidos gecapteerd als `sh:Document`. Het is gelinkt aan de voorbereidingsactiviteit via `sign:voorbereidingGenereert` (< `dossier:genereert`) en aan het orginele stuk in Kaleidos via `prov:hadPrimarySource`. Ieder SigningHub document heeft een  en package ID. De package ID identificeert de werkstroom in SigningHub.

De mandatarissen waarvoor handtekenvakken geplaatst moeten worden, zijn de ministers die bevoegd zijn voor het agendapunt en bijkomend de minister-president. Deze laatste moet alle documenten van de ministerraad die getekend moeten worden, ondertekenen.

Ieder handtekenvak dat geplaatst wordt in het document wordt in het data model gecapteerd a.d.h.v. een `sign:Handtekenactiveit`. De minister die moet tekenen wordt gelinkt via `sign:ondertekenaar` (< `prov:qualifiedAssociaton`). Indien 2 ministers een document moeten ondertekenen zijn er dus 2 handtekenactiviteiten, nl. een per minister.

Iedere handtekenactiviteit is via `prov:wasInformedBy` gelinkt aan de voorbereidingsactiviteit: de output van de voorbereiding, nl. het document in SigningHub, is de input van de handtekenactiviteit.

## Handtekenen van documenten in SigningHub
Na de voorbereiding van de documenten in SigningHub volgt het eigenlijke tekenen van de documenten. Hiervoor dient de werkstroom in SigningHub opgestart te worden.

Initieel hebben de handtekenactiviteiten in Kaleidos geen start- en einddatum. Eens de werkstroom in SigningHub opgestart wordt, wordt de startdatum van alle handtekenactiviteiten ingevuld. De einddatum wordt pas gezet op het moment dat de minister zijn handtekening plaatst.

Een minister kan ook weigeren om te tekenen in SigningHub. Dit wordt in Kaleidos gecapteerd als `sign:HandtekeningWeigeractiviteit`. Deze is via `sign:isGeweigerdDoor` (< `prov:wasInformedBy`) gelinkt aan de handtekenactiviteit.

## Consolideren van handtekeningen
Eens alle ministers hun handtekening geplaatst hebben, moet de signing-flow afgerond worden. Het getekende document wordt dan vanuit SigningHub overgedragen naar Kaleidos en de werkstroom wordt verwijderd in SigningHub. Deze activiteit wordt gecapteerd door `sign:Afrondingsactiveit` die een link (`sign:getekendStuk` < `dossier:genereert`) naar het getekende document (`sign:GetekendStuk` < `dossier:Stuk`).

De afrondingsactiviteit is gelinkt aan de verschillende handtekenactiviteiten via `prov:wasInformedBy`. De output van de handtekenactiviteiten, nl. een getekend document, is de input voor de afrondingsactiviteit.

Merk op dat enkel het finale, volledige getekende document vanuit SigningHub overgenomen wordt in Kaleidos. Voor alle tussenliggende stappen, waarbij het document slechts deels getekend is, wordt het document niet overgenomen in Kaleidos.

Het gehandtekende document is een expliciete subclass van `dossier:Stuk` om in de applicatie duidelijk het onderscheid te kunnen maken tussen getekende en ongetekende documenten. De getekende documenten mogen immers niet voor iedereen zichtbaar zijn. Elk getekend document is natuurlijk gekoppeld aan zijn ongetekende versie via `sign:ongetekendStuk` (< `prov:wasDerivedFrom`).

## Annuleren van de workflow
Wanneer enkel de markeringsactiviteit uitgevoerd is en men dan beslist dit ongedaan te maken, worden alle reeds aangemaakte resources (handtekenaangelegenheid, handteken-procedurestap en markeringsactivieit) verwijderd. Er is dan geen spoor meer van deze flow in de data.

Eens een werkstroom opgestart is in SigningHub daarentegen kan deze niet meer volledig verwijderd worden, maar enkel nog geannuleerd. Dit wordt gemodelleerd als `sign:AnnulatieActiviteit`, gelinkt aan de handteken-procedurestap. Vanaf dan kunnen er geen handtekeningen meer geplaatst worden en kan de werkstroom niet afgerond worden.
