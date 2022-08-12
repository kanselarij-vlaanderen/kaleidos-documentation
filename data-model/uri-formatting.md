## URI formatting guidelines

When we create new resources, either by adding data in the application, or by adding data through `config/migrations/`, a URI is needed to uniquely identify each resource. For types and properties, we can use the URIs as defined in the OSLO data model, but for resources, we need to define our own. For future reference, we'll set up some guidelines here to help keep the formatting of those URIs consistent moving forward.

The [Flemish URI Standard for Data](https://assets.vlaanderen.be/image/upload/v1637336713/Vlaamse_URI-standaard_voor_data_ifmzka.pdf) specifies the following structure for URIs: `http(s)://{domain}/{type}/{concept}(/{reference})`.

For resources in Kaleidos, this means the `domain` and `type` parts of a resource URI will be `themis.vlaanderen.be` and `id`, in accordance with the Flemish URI Standard.

The `concept` part needs to be a semantically understandable name to idenitfy the **category** of the resource, e.g., 'mandatee', 'persoon' or 'concept/toegangsniveau'. Note that the `concept` part can be nested, depending on the scenario.

Finally, for the `reference` part, the standard does not specify any obligatory structure, and instead leaves this up to the organisation. For Kaleidos, we'll maintain the rule: use a **uuid** for each resource, e.g., `http://themis.vlaanderen.be/id/mandatee/145bafde-10ea-4a73-8fe9-042cdea3ccbe`.

*Remark: While this is intuitive for resources referencing real-world things such as persons or objects, we will also apply this to semantic concepts, such as concept types or access levels, e.g., `http://themis.vlaanderen.be/id/concept/toegangsniveau/c3de9c70-391e-4031-a85e-4b03433d6266`. While it might be tempting to give the latter type a more human-readable, semantically appealing URI, such as `http://themis.vlaanderen.be/id/concept/toegangsniveau/publiek`, this does open the door for naming conflicts, label mismatches, semantic misunderstandings, etc. Therefore, the rule is and remains: stick to uuids.*
