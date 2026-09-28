# dealr.cloud for n8n

**dealr.cloud is the all-in-one dealership operating system from Dealr, for independent dealers
and multi-rooftop groups.** Appraisals and pricing, inventory and online listings, CRM and leads,
deal desking and F&I, in-house financing, service and parts, payments, websites and full
dealership accounting run in one cloud system with one login. Dealr built it inside a
working independent dealership: by dealers, for dealers. See [dealr.cloud](https://dealr.cloud)
and [dealr.com](https://dealr.com).

This package connects dealr.cloud to n8n:

- **dealr.cloud Trigger** starts a workflow the moment a vehicle is added or changes status, a
  lead arrives or is marked lost, a shopper's preferred vehicle drops in price, or a repair order
  is opened or invoiced.
- **dealr.cloud** looks up vehicles, customers, leads, conversations and repair orders, and writes
  notes and lead timeline comments back, where your team sees them in context.

## Before you start

- **API access** turned on for your dealership. The dealr.cloud API is in early access. Email Dealr
  at [support@dealr.cloud](mailto:support@dealr.cloud) to request it.
- **A dealr.cloud user with Integrations → Developer access.** The nodes see and change only what
  that user can in dealr.cloud.

## Install

In n8n, go to **Settings → Community Nodes → Install** and enter `@dealr/n8n-nodes-dealr-cloud`.

## Credentials

| Where n8n runs | Credential | How to set it up |
|---|---|---|
| n8n Cloud | **dealr.cloud OAuth2 API** | Select **Connect** and sign in to dealr.cloud. There is nothing to copy. |
| Self-hosted n8n | **dealr.cloud API** | A dealr.cloud admin creates an organization API key on the **API Access** settings page. Paste it in; it starts `dlr_live_`. |

Self-hosted n8n uses a key because dealr.cloud only accepts OAuth sign-ins that return to
addresses it has registered, and a self-hosted instance's address is its own.

## Triggers

| Trigger | Fires when |
|---|---|
| New Vehicle | A vehicle is added to your dealr.cloud inventory |
| Updated Vehicle Status | A vehicle switches between Active and Inactive (not when it sells) |
| New Lead | A lead is created from any source |
| New Inbound Lead | A lead arrives from your website, phone or a third-party provider |
| New Lost Lead | A lead is marked as lost |
| New Price Drop on Preferred Vehicle | A vehicle an active lead prefers drops in price, once per lead |
| New Repair Order | A repair order (RO) is opened |
| New Repair Order Invoice | A repair order is converted to an invoice |

Each run receives the event and the full record: the same vehicle, lead or repair order that the
dealr.cloud node's **Get** returns, including which of your locations it belongs to. Every delivery
is signed, and the trigger rejects one whose signature does not verify.

## Operations

| Resource | Operations |
|---|---|
| Conversation | Get, Get Many |
| Customer | Add Note, Get, Get Many |
| Lead | Add Note, Add Timeline Comment, Get, Get Many, Update Flag Note |
| Repair Order | Add Note, Get, Get Many, Update Flag Note |
| Vehicle | Add Note, Get, Get Many, Update Flag Note |

- **Pick a record from a list.** Every record field offers **From List**, which searches
  dealr.cloud as you type ("2019 Honda Accord EX-L · A1234"), or **By ID** for an ID mapped from
  a trigger or an earlier step.
- **Simplify** returns ten key fields, flattened (`pricing_asking`, `location_name`), instead of
  the full record.
- **Get Many** sorts through **Options → Sort By** and **Sort Direction**, using the same sort
  fields as dealr.cloud's own lists.

Not available yet: creating or editing leads, customers, vehicles or deals, and reading deals,
loans, accounting or titles.

## Example workflows

- **Alert the sales team to new internet leads.** dealr.cloud Trigger (New Inbound Lead) → Slack:
  post the shopper's name, the vehicle of interest and the assigned salesperson to #sales.
- **Keep a live inventory sheet.** dealr.cloud Trigger (New Vehicle, Updated Vehicle Status) →
  Google Sheets: append or update a row by stock number.
- **Tell a shopper their car just got cheaper.** dealr.cloud Trigger (New Price Drop on Preferred
  Vehicle) → dealr.cloud: Get Customer → Gmail: send a price-drop email → dealr.cloud: Add Timeline
  Comment, so the salesperson sees it went out.
- **Ask for a review after service.** dealr.cloud Trigger (New Repair Order Invoice) → dealr.cloud:
  Get Customer → your email or review tool.
- **Route leads by store.** dealr.cloud Trigger (New Lead) → Switch on the lead's location → each
  store's channel or CRM.

Check your dealership's consent and opt-out rules before messaging customers automatically.

## Development

```bash
npm ci
npm run build   # n8n-node build
npm run lint    # n8n-node lint: n8n's community node rules, the same ones its verification runs
```

The resources, operations and fields are generated from the dealr.cloud public API
(`nodes/Dealr/generated/properties.ts`, `nodes/DealrTrigger/generated/events.ts`); edit the
generator, not these files. See `integrations/README.md` in the source repository.

## Data and privacy

The dealr.cloud API does not include Social Security numbers, dates of birth or bank account
details. Notes and messages are passed on as written. Once data reaches n8n, your n8n instance's
terms and settings apply.

## Documentation and support

- API documentation: [docs.dealr.cloud/api](https://docs.dealr.cloud/api)
- Dealr support: [support@dealr.cloud](mailto:support@dealr.cloud) · 720.772.7706 · Monday to
  Friday, 8 AM to 5 PM Mountain Time

dealr.cloud is a product of Dealr, Inc. This package is released under the [MIT license](LICENSE).
