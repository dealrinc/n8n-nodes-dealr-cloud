// Generated from the Dealr public API. Do not edit by hand.

import type { INodePropertyOptions } from 'n8n-workflow';

export const events: INodePropertyOptions[] = [
    {
        name: "New Inbound Lead",
        value: "lead.received",
        description: "Triggers when a lead arrives from your website, phone or a third-party lead provider. Skips leads staff enter by hand, including walk-ins.",
    },
    {
        name: "New Lead",
        value: "lead.created",
        description: "Triggers when a lead is created in dealr.cloud from any source, including manual entry, your website and imports",
    },
    {
        name: "New Lost Lead",
        value: "lead.lost",
        description: "Triggers when a lead is marked as lost in dealr.cloud",
    },
    {
        name: "New Price Drop on Preferred Vehicle",
        value: "lead.preferred_vehicle_price_dropped",
        description: "Triggers when the sale price drops on a vehicle an active lead has marked as preferred. Fires once for each lead.",
    },
    {
        name: "New Repair Order",
        value: "repair_order.created",
        description: "Triggers when a repair order (RO) is opened in dealr.cloud",
    },
    {
        name: "New Repair Order Invoice",
        value: "repair_order.invoiced",
        description: "Triggers when a repair order is converted to an invoice in dealr.cloud",
    },
    {
        name: "New Vehicle",
        value: "inventory_unit.created",
        description: "Triggers when a vehicle is added to your dealr.cloud inventory",
    },
    {
        name: "Updated Vehicle Status",
        value: "inventory_unit.status_changed",
        description: "Triggers when a vehicle in your dealr.cloud inventory switches between Active and Inactive. Includes the previous and new status. Does not fire when a vehicle is sold.",
    },
];
