# API calls naar app-valvas stack

In dit document geven we aan de hand van enkele voorbeeld scenario's een overzicht van de mogelijke API calls naar de [app-valvas](https://github.com/kanselarij-vlaanderen/app-valvas) stack zoals deze draait op [beslissingenvlaamseregering.vlaanderen.be](https://beslissingenvlaamseregering.vlaanderen.be/). Om deze stack op een eigen server te draaien, dient deze minstens [Docker compose](https://docs.docker.com/compose/) te ondersteunen.

## Data modellen

Allereerst verwijzen we naar de documentatie van [mu-cl-resources](https://github.com/mu-semtech/mu-cl-resources/) zelf om een idee te krijgen van hoe de stack opgebouwd is, en vooral ook naar [mu-search](https://github.com/mu-semtech/mu-search), om te begrijpen hoe de API calls kunnen worden gevormd.

Verder is het ook interessant om het datamodel te begrijpen waarin de data is gestructureerd. Voor de data rond kort bestek zelf staat dit uitgebreid beschreven in sectie 1.2 op [themis.vlaanderen.be/docs/catalogs](https://themis.vlaanderen.be/docs/catalogs). Voor de data rond ministers verwijzen we naar sectie 2.2 van hetzelfde document.

## Voorbeelden

Je kan de calls in deze voorbeelden uittesten en bewerken door ze uit te voeren met een HTTP client, bijvoorbeeld `curl` of `postman`.

Het is handig om bekend te zijn met de `term-level queries` in https://github.com/mu-semtech/mu-search#term-level-queries om deze calls goed te begrijpen.

### calls om mandatarissen op te lijsten

Om alle personen in de databank op te lijsten, volstaat het om de `people` URL te bevragen, eventueel met een paginatie parameter. Bijvoorbeeld: `https://beslissingenvlaamseregering.vlaanderen.be/people?page[size]=1000`.

Om te filteren op attributen, kan een filter toegevoegd worden zoals beschreven in [mu-search](https://github.com/mu-semtech/mu-search#api). Door `include` te gebruiken kan gelinkte informatie in 1 request worden mee opgevraagd. Bijvoorbeeld, volgende call geeft alle personen met voornaam "Luc", samen met de mandaten die deze personen houden: `https://beslissingenvlaamseregering.vlaanderen.be/people?filter[first-name]=Luc&include=mandatees`.

Om mandatarissen uit een specifieke regeringssamenstelling op te lijsten, kan je je baseren op de `government-bodies`, zoals die op [Themis](https://themis.vlaanderen.be/view/government-body?resource=http://themis.vlaanderen.be/id/bestuursorgaan/7f2c82aa-75ac-40f8-a6c3-9fe539163025) te vinden zijn. Bijvoorbeeld, de regering Peeters II heeft als id `5fed907ee6670526694a0658`, dus de mandatarissen in die regering kan je vinden met de call: `https://beslissingenvlaamseregering.vlaanderen.be/government-bodies?filter[:id:]=5fed907ee6670526694a0658&collapse_uuids=t&include=mandatees.person`.
De mandatarissen zitten dan in de response onder `data.included`. Merk op dat eenzelfde persoon verscheidene mandaten kan hebben, over verschillende periodes in dezelfde regering. Daarom ontdubbelen we de resultaten met `collapse_uuids=t`.

Om de **huidige** regeringssamenstelling makkelijk op te vragen zonder de `id` te weten, kunnen we gebruik maken van het feit dat de regering die nu actief is geen `end-date` heeft in de databank. M.a.w., we kunnen deze opvragen met de volgende call: `https://beslissingenvlaamseregering.vlaanderen.be/government-bodies?filter[:has:start-date]=true&filter[:has-no:end-date]=true&filter[:has:mandatees]=true&include=mandatees.person`.

### nieuwsberichten search calls met verschillende filters

Met de elastic search API van `app-valvas` kan je in de verschillende attributen en relaties van de `news-items` zoeken. De basis URL hiervoor is `https://beslissingenvlaamseregering.vlaanderen.be/news-items/search`. Bijvoorbeeld:

- Alle nieuwsberichten met "Zonnepanelen" in de titel of inhoud: `https://beslissingenvlaamseregering.vlaanderen.be/news-items/search?filter[:sqs:title,htmlContent]=Zonnepanelen&sort[meetingDate]=desc&sort[meetingTypePosition]=asc&sort[agendaitemType]=desc&sort[position]=asc`

- De 25 meest recente nieuwsberichten voorgesteld door Jo Brouns: `https://beslissingenvlaamseregering.vlaanderen.be/news-items/search?page[size]=25&page[number]=0&collapse_uuids=t&filter[mandateeFirstNames]=Jo&filter[mandateeFamilyNames]=Brouns&filter[agendaitemType]=Nota&sort[meetingDate]=desc&sort[meetingTypePosition]=asc&sort[agendaitemType]=desc&sort[position]=asc`

- Alle nieuwsberichten van de ministerraden tussen 2022-09-01 en 2022-10-01: `https://beslissingenvlaamseregering.vlaanderen.be/news-items/search?filter[:gte,lte:meetingDate]=2022-09-01T00:00:00.000Z,2022-10-01T00:00:00.000Z&sort[meetingDate]=desc&sort[meetingTypePosition]=asc&sort[agendaitemType]=desc&sort[position]=asc&page[size]=1000`

- De 25 meest recente nieuwsberichten over de bevoegdheid Energie: `https://beslissingenvlaamseregering.vlaanderen.be/news-items/search?page[size]=25&page[number]=0&collapse_uuids=t&filter[themeId]=45cfa0c9-82db-4487-8ad4-ca21fa6655ab&sort[meetingDate]=desc&sort[meetingTypePosition]=asc&sort[agendaitemType]=desc&sort[position]=asc`.

Merk bij deze laatste op dat je de `themeId` van het concept 'Energie' hiervoor moet kennen. Deze kan achterhalen door in de concept-schemes te zoeken. Bijvoorbeeld met de query: `https://beslissingenvlaamseregering.vlaanderen.be/concept-schemes?filter[concepts][label]=Energie&include=concepts` zie je dat 'Energie' een concept in het concept-scheme `Thema's` is, met `http://themis.vlaanderen.be/id/concept-scheme/459cbdb0-86ff-4106-879c-6aecda7d3dcc` als URI. Deze URI kan je dan gebruiken om het correcte thema op te halen met: `https://beslissingenvlaamseregering.vlaanderen.be/concepts?filter[in-scheme][:uri:]=http://themis.vlaanderen.be/id/concept-scheme/459cbdb0-86ff-4106-879c-6aecda7d3dcc&filter[label]=Energie`.

(Je kan uiteraard ook de UI van het [Themis register]( https://themis.vlaanderen.be/id/concept-scheme/459cbdb0-86ff-4106-879c-6aecda7d3dcc) manueel verkennen)

### call om details van 1 meeting op te halen op basis van een ID

Hiervoor gebruik je het eindpunt `https://beslissingenvlaamseregering.vlaanderen.be/meetings`, en filter je op id, bijvoorbeeld de vergadering van 1 oktober 2021: `https://beslissingenvlaamseregering.vlaanderen.be/meetings?filter[:id:]=6152B4E4364ED9000800026E&include=type`.

Vervolgens kan je alle nieuwsberichten die in deze vergadering werden behandeld ophalen met de volgende nested query: `https://beslissingenvlaamseregering.vlaanderen.be/news-item-infos?filter[agenda-item][agenda][meeting][:id:]=6152B4E4364ED9000800026E&include=agenda-item` (let op het pad `[agenda-item][agenda][meeting][:id:]`).

### call om bestanden horende bij een nieuwsbericht op te halen op basis van newsitem ID

Om de bijlagen bij deze nieuwsberichten op te vragen, voeg je simpelweg `include=attachments.file` toe.

Voor het voorgaande voorbeeld: `https://beslissingenvlaamseregering.vlaanderen.be/news-item-infos?filter[agenda-item][agenda][meeting][:id:]=6152B4E4364ED9000800026E&include=attachments.file`. In de `data.includes` met `"type": "files"` zit dan informatie over de bijlagen, en een link onder `relationships.download.links.related` waarmee de bestanden rechtstreeks kunnen worden gedownload.

### call om een bestand te downloaden op basis van de ID

Voorbeeld voor 1 specifiek nieuwsbericht: `https://beslissingenvlaamseregering.vlaanderen.be/news-item-infos?filter[:id:]=6152C345364ED90008000367&include=attachments.file`.
