// Generated from the Dealr public API. Do not edit by hand.

import type { INodeProperties } from 'n8n-workflow';

export const properties: INodeProperties[] = [
    {
        displayName: "Resource",
        name: "resource",
        type: "options",
        noDataExpression: true,
        options: [
            {
                name: "Conversation",
                value: "communication",
            },
            {
                name: "Customer",
                value: "customer",
            },
            {
                name: "Lead",
                value: "lead",
            },
            {
                name: "Repair Order",
                value: "repair_order",
            },
            {
                name: "Vehicle",
                value: "inventory_unit",
            },
        ],
        default: "communication",
    },
    {
        displayName: "Operation",
        name: "operation",
        type: "options",
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    "communication",
                ],
            },
        },
        options: [
            {
                name: "Get",
                value: "get",
                description: "Retrieve a conversation",
                action: "Get conversation",
                routing: {
                    request: {
                        method: "GET",
                        url: "=/unstable/communications/{{encodeURIComponent($parameter[\"id\"])}}",
                    },
                },
            },
            {
                name: "Get Many",
                value: "getAll",
                description: "Retrieve a list of customer conversations in dealr.cloud (texts and calls, email, website chat and Facebook), including threads attached to a lead, repair order, deal or loan",
                action: "Get many conversations",
                routing: {
                    request: {
                        method: "GET",
                        url: "/unstable/communications",
                        qs: {
                            limit: 200,
                        },
                    },
                    send: {
                        paginate: "={{ $parameter.returnAll }}",
                    },
                    output: {
                        postReceive: [
                            {
                                type: "rootProperty",
                                properties: {
                                    property: "data",
                                },
                            },
                        ],
                    },
                },
            },
        ],
        default: "get",
    },
    {
        displayName: "Conversation",
        name: "id",
        type: "resourceLocator",
        required: true,
        default: {
            mode: "list",
            value: "",
        },
        description: "The conversation to use",
        displayOptions: {
            show: {
                resource: [
                    "communication",
                ],
                operation: [
                    "get",
                ],
            },
        },
        modes: [
            {
                displayName: "From List",
                name: "list",
                type: "list",
                placeholder: "Select a conversation...",
                typeOptions: {
                    searchListMethod: "searchRecords",
                    searchable: true,
                },
            },
            {
                displayName: "By ID",
                name: "id",
                type: "string",
                placeholder: "e.g. 0192d0e1-2f34-7a56-8b78-9c0d1e2f3a4b",
                validation: [
                    {
                        type: "regex",
                        properties: {
                            regex: "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$",
                            errorMessage: "Enter a dealr.cloud ID, e.g. 0192d0e1-2f34-7a56-8b78-9c0d1e2f3a4b",
                        },
                    },
                ],
            },
        ],
    },
    {
        displayName: "Simplify",
        name: "simplify",
        type: "boolean",
        default: false,
        description: "Whether to return a simplified version of the response instead of the raw data",
        displayOptions: {
            show: {
                resource: [
                    "communication",
                ],
                operation: [
                    "get",
                    "getAll",
                ],
            },
        },
    },
    {
        displayName: "Return All",
        name: "returnAll",
        type: "boolean",
        default: false,
        description: "Whether to return all results or only up to a given limit",
        displayOptions: {
            show: {
                resource: [
                    "communication",
                ],
                operation: [
                    "getAll",
                ],
            },
        },
    },
    {
        displayName: "Limit",
        name: "limit",
        type: "number",
        typeOptions: {
            minValue: 1,
            maxValue: 200,
        },
        default: 50,
        description: "Max number of results to return",
        displayOptions: {
            show: {
                resource: [
                    "communication",
                ],
                operation: [
                    "getAll",
                ],
                returnAll: [
                    false,
                ],
            },
        },
        routing: {
            send: {
                type: "query",
                property: "limit",
            },
            output: {
                maxResults: "={{$value}}",
            },
        },
    },
    {
        displayName: "Filters",
        name: "filters",
        type: "collection",
        placeholder: "Add Filter",
        default: {},
        displayOptions: {
            show: {
                resource: [
                    "communication",
                ],
                operation: [
                    "getAll",
                ],
            },
        },
        options: [
            {
                displayName: "Assigned User ID",
                name: "assigned_user_id",
                type: "string",
                default: "",
                placeholder: "e.g. 0191f5a6-7b8c-7d9e-8a0b-1c2d3e4f5a6b",
                description: "The dealr.cloud ID of the user the conversation is assigned to",
                routing: {
                    send: {
                        type: "query",
                        property: "assigned_user_id",
                    },
                },
            },
            {
                displayName: "Attached To (Record ID)",
                name: "about_id",
                type: "string",
                default: "",
                placeholder: "e.g. 0192a2c3-4d5e-7f60-8a71-9b2c3d4e5f60",
                description: "The dealr.cloud ID of that record. Use it with 'Attached To (Record Type)'.",
                routing: {
                    send: {
                        type: "query",
                        property: "about[id]",
                    },
                },
            },
            {
                displayName: "Attached To (Record Type)",
                name: "about_type",
                type: "options",
                options: [
                    {
                        name: "Deal",
                        value: "deal",
                    },
                    {
                        name: "Lead",
                        value: "lead",
                    },
                    {
                        name: "Loan",
                        value: "loan",
                    },
                    {
                        name: "Repair Order",
                        value: "repair_order",
                    },
                ],
                default: "lead",
                description: "Only conversations attached to this kind of record",
                routing: {
                    send: {
                        type: "query",
                        property: "about[type]",
                    },
                },
            },
            {
                displayName: "Channel",
                name: "channel",
                type: "options",
                options: [
                    {
                        name: "Chat",
                        value: "chat",
                    },
                    {
                        name: "Email",
                        value: "email",
                    },
                    {
                        name: "Facebook",
                        value: "facebook",
                    },
                    {
                        name: "Phone",
                        value: "phone",
                    },
                ],
                default: "phone",
                description: "Phone covers texts and calls; Chat is your website chat",
                routing: {
                    send: {
                        type: "query",
                        property: "channel",
                    },
                },
            },
            {
                displayName: "dealr.cloud ID",
                name: "ids",
                type: "string",
                default: "",
                placeholder: "e.g. 0192b6a0-4c3d-7a1e-9f52-3b8c7d1e4a90,0192b6a0-51e2-7bcf-8d13-9a7e2c5f0b44",
                description: "Look up one record by its dealr.cloud ID, for example the ID a trigger delivered",
                routing: {
                    send: {
                        type: "query",
                        property: "ids",
                    },
                },
            },
            {
                displayName: "Search Text",
                name: "q",
                type: "string",
                default: "",
                placeholder: "e.g. accord",
                description: "Matches the thread subject, its phone number, the text of any message on it, and the customer's name, email or phone number, the same way the Communications search box does",
                routing: {
                    send: {
                        type: "query",
                        property: "q",
                    },
                },
            },
            {
                displayName: "Status",
                name: "status",
                type: "options",
                options: [
                    {
                        name: "Active",
                        value: "active",
                    },
                    {
                        name: "Closed",
                        value: "closed",
                    },
                ],
                default: "active",
                description: "Whether the conversation is still open or closed",
                routing: {
                    send: {
                        type: "query",
                        property: "status",
                    },
                },
            },
            {
                displayName: "Unread",
                name: "unread",
                type: "boolean",
                default: false,
                description: "Whether the conversation has unread messages",
                routing: {
                    send: {
                        type: "query",
                        property: "unread",
                    },
                },
            },
            {
                displayName: "Updated After",
                name: "updated_after",
                type: "string",
                default: "",
                placeholder: "e.g. 2026-09-01T00:00:00-06:00",
                description: "Only conversations with activity on or after this date and time",
                routing: {
                    send: {
                        type: "query",
                        property: "updated_after",
                    },
                },
            },
            {
                displayName: "Updated Before",
                name: "updated_before",
                type: "string",
                default: "",
                placeholder: "e.g. 2026-09-15T00:00:00-06:00",
                description: "Only conversations with activity on or before this date and time",
                routing: {
                    send: {
                        type: "query",
                        property: "updated_before",
                    },
                },
            },
        ],
    },
    {
        displayName: "Options",
        name: "options",
        type: "collection",
        placeholder: "Add Option",
        default: {},
        displayOptions: {
            show: {
                resource: [
                    "communication",
                ],
                operation: [
                    "getAll",
                ],
            },
        },
        options: [
            {
                displayName: "Sort By",
                name: "sortBy",
                type: "options",
                options: [
                    {
                        name: "Created",
                        value: "created_at",
                    },
                    {
                        name: "Last Message",
                        value: "last_message_at",
                    },
                ],
                default: "last_message_at",
                description: "The field to sort conversations by. Use it with 'Sort Direction'.",
                routing: {
                    send: {
                        type: "query",
                        property: "sort",
                        value: "={{ ($parameter.options.sortDirection === \"descending\" ? \"-\" : \"\") + $value }}",
                    },
                },
            },
            {
                displayName: "Sort Direction",
                name: "sortDirection",
                type: "options",
                options: [
                    {
                        name: "Ascending",
                        value: "ascending",
                    },
                    {
                        name: "Descending",
                        value: "descending",
                    },
                ],
                default: "ascending",
                description: "Which way to sort. Applies when 'Sort By' is set.",
            },
        ],
    },
    {
        displayName: "Operation",
        name: "operation",
        type: "options",
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    "customer",
                ],
            },
        },
        options: [
            {
                name: "Add Note",
                value: "create_customer_note",
                description: "Add a note to a customer in dealr.cloud",
                action: "Add note to customer",
                routing: {
                    request: {
                        method: "POST",
                        url: "=/unstable/notes/customers/{{encodeURIComponent($parameter[\"id\"])}}",
                    },
                },
            },
            {
                name: "Get",
                value: "get",
                description: "Retrieve a customer",
                action: "Get customer",
                routing: {
                    request: {
                        method: "GET",
                        url: "=/unstable/customers/{{encodeURIComponent($parameter[\"id\"])}}",
                    },
                },
            },
            {
                name: "Get Many",
                value: "getAll",
                description: "Retrieve a list of customers in dealr.cloud by name, company, phone, email or notes",
                action: "Get many customers",
                routing: {
                    request: {
                        method: "GET",
                        url: "/unstable/customers",
                        qs: {
                            limit: 200,
                        },
                    },
                    send: {
                        paginate: "={{ $parameter.returnAll }}",
                    },
                    output: {
                        postReceive: [
                            {
                                type: "rootProperty",
                                properties: {
                                    property: "data",
                                },
                            },
                        ],
                    },
                },
            },
        ],
        default: "get",
    },
    {
        displayName: "Customer",
        name: "id",
        type: "resourceLocator",
        required: true,
        default: {
            mode: "list",
            value: "",
        },
        description: "The customer to use",
        displayOptions: {
            show: {
                resource: [
                    "customer",
                ],
                operation: [
                    "get",
                    "create_customer_note",
                ],
            },
        },
        modes: [
            {
                displayName: "From List",
                name: "list",
                type: "list",
                placeholder: "Select a customer...",
                typeOptions: {
                    searchListMethod: "searchRecords",
                    searchable: true,
                },
            },
            {
                displayName: "By ID",
                name: "id",
                type: "string",
                placeholder: "e.g. 0192c1d2-7e8f-7a3b-9c4d-5e6f7a8b9c0d",
                validation: [
                    {
                        type: "regex",
                        properties: {
                            regex: "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$",
                            errorMessage: "Enter a dealr.cloud ID, e.g. 0192c1d2-7e8f-7a3b-9c4d-5e6f7a8b9c0d",
                        },
                    },
                ],
            },
        ],
    },
    {
        displayName: "Simplify",
        name: "simplify",
        type: "boolean",
        default: false,
        description: "Whether to return a simplified version of the response instead of the raw data",
        displayOptions: {
            show: {
                resource: [
                    "customer",
                ],
                operation: [
                    "get",
                    "getAll",
                ],
            },
        },
    },
    {
        displayName: "Return All",
        name: "returnAll",
        type: "boolean",
        default: false,
        description: "Whether to return all results or only up to a given limit",
        displayOptions: {
            show: {
                resource: [
                    "customer",
                ],
                operation: [
                    "getAll",
                ],
            },
        },
    },
    {
        displayName: "Limit",
        name: "limit",
        type: "number",
        typeOptions: {
            minValue: 1,
            maxValue: 200,
        },
        default: 50,
        description: "Max number of results to return",
        displayOptions: {
            show: {
                resource: [
                    "customer",
                ],
                operation: [
                    "getAll",
                ],
                returnAll: [
                    false,
                ],
            },
        },
        routing: {
            send: {
                type: "query",
                property: "limit",
            },
            output: {
                maxResults: "={{$value}}",
            },
        },
    },
    {
        displayName: "Filters",
        name: "filters",
        type: "collection",
        placeholder: "Add Filter",
        default: {},
        displayOptions: {
            show: {
                resource: [
                    "customer",
                ],
                operation: [
                    "getAll",
                ],
            },
        },
        options: [
            {
                displayName: "Active",
                name: "is_active",
                type: "boolean",
                default: true,
                description: "Whether to return only active customers. Turn it off to return customers your dealership has disabled.",
                routing: {
                    send: {
                        type: "query",
                        property: "is_active",
                    },
                },
            },
            {
                displayName: "dealr.cloud ID",
                name: "ids",
                type: "string",
                default: "",
                placeholder: "e.g. 0192b6a0-4c3d-7a1e-9f52-3b8c7d1e4a90,0192b6a0-51e2-7bcf-8d13-9a7e2c5f0b44",
                description: "Look up one record by its dealr.cloud ID, for example the ID a trigger delivered",
                routing: {
                    send: {
                        type: "query",
                        property: "ids",
                    },
                },
            },
            {
                displayName: "Search Text",
                name: "q",
                type: "string",
                default: "",
                placeholder: "e.g. anand",
                description: "Matches company name, first and last name, preferred phone, preferred email and notes, the same way the customer screen search box does",
                routing: {
                    send: {
                        type: "query",
                        property: "q",
                    },
                },
            },
            {
                displayName: "Updated Since",
                name: "updated_since",
                type: "string",
                default: "",
                placeholder: "e.g. 2026-09-01T00:00:00-06:00",
                description: "Only records changed at or after this date and time, for example 2026-09-01T08:00:00-06:00",
                routing: {
                    send: {
                        type: "query",
                        property: "updated_since",
                    },
                },
            },
        ],
    },
    {
        displayName: "Options",
        name: "options",
        type: "collection",
        placeholder: "Add Option",
        default: {},
        displayOptions: {
            show: {
                resource: [
                    "customer",
                ],
                operation: [
                    "getAll",
                ],
            },
        },
        options: [
            {
                displayName: "Sort By",
                name: "sortBy",
                type: "options",
                options: [
                    {
                        name: "Name",
                        value: "name",
                    },
                ],
                default: "name",
                description: "The field to sort customers by. Use it with 'Sort Direction'.",
                routing: {
                    send: {
                        type: "query",
                        property: "sort",
                        value: "={{ ($parameter.options.sortDirection === \"descending\" ? \"-\" : \"\") + $value }}",
                    },
                },
            },
            {
                displayName: "Sort Direction",
                name: "sortDirection",
                type: "options",
                options: [
                    {
                        name: "Ascending",
                        value: "ascending",
                    },
                    {
                        name: "Descending",
                        value: "descending",
                    },
                ],
                default: "ascending",
                description: "Which way to sort. Applies when 'Sort By' is set.",
            },
        ],
    },
    {
        displayName: "Note",
        name: "body",
        type: "string",
        typeOptions: {
            rows: 4,
        },
        required: true,
        default: "",
        placeholder: "e.g. Customer called — wants to pick the car up Saturday morning.",
        description: "What the note should say, up to 10,000 characters. Saved as plain text.",
        displayOptions: {
            show: {
                resource: [
                    "customer",
                ],
                operation: [
                    "create_customer_note",
                ],
            },
        },
        routing: {
            send: {
                type: "body",
                property: "body",
            },
        },
    },
    {
        displayName: "Operation",
        name: "operation",
        type: "options",
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    "lead",
                ],
            },
        },
        options: [
            {
                name: "Add Note",
                value: "create_lead_note",
                description: "Add a note to a lead in dealr.cloud",
                action: "Add note to lead",
                routing: {
                    request: {
                        method: "POST",
                        url: "=/unstable/notes/leads/{{encodeURIComponent($parameter[\"id\"])}}",
                    },
                },
            },
            {
                name: "Add Timeline Comment",
                value: "create_lead_activity",
                description: "Post a comment on a lead's timeline, where your team sees it in context",
                action: "Add comment to lead timeline",
                routing: {
                    request: {
                        method: "POST",
                        url: "=/unstable/leads/{{encodeURIComponent($parameter[\"id\"])}}/activity",
                    },
                },
            },
            {
                name: "Get",
                value: "get",
                description: "Retrieve a lead",
                action: "Get lead",
                routing: {
                    request: {
                        method: "GET",
                        url: "=/unstable/leads/{{encodeURIComponent($parameter[\"id\"])}}",
                    },
                },
            },
            {
                name: "Get Many",
                value: "getAll",
                description: "Retrieve a list of leads in dealr.cloud by shopper name, email or phone, status, temperature, salesperson, lead source or vehicle of interest",
                action: "Get many leads",
                routing: {
                    request: {
                        method: "GET",
                        url: "/unstable/leads",
                        qs: {
                            limit: 200,
                        },
                    },
                    send: {
                        paginate: "={{ $parameter.returnAll }}",
                    },
                    output: {
                        postReceive: [
                            {
                                type: "rootProperty",
                                properties: {
                                    property: "data",
                                },
                            },
                        ],
                    },
                },
            },
            {
                name: "Update Flag Note",
                value: "update_lead_flag",
                description: "Replace the note on a flag that's already on a lead",
                action: "Update flag note on lead",
                routing: {
                    request: {
                        method: "PATCH",
                        url: "=/unstable/flags/leads/{{encodeURIComponent($parameter[\"id\"])}}/{{encodeURIComponent($parameter[\"flag_id\"])}}",
                    },
                },
            },
        ],
        default: "get",
    },
    {
        displayName: "Lead",
        name: "id",
        type: "resourceLocator",
        required: true,
        default: {
            mode: "list",
            value: "",
        },
        description: "The lead to use",
        displayOptions: {
            show: {
                resource: [
                    "lead",
                ],
                operation: [
                    "get",
                    "create_lead_activity",
                    "create_lead_note",
                    "update_lead_flag",
                ],
            },
        },
        modes: [
            {
                displayName: "From List",
                name: "list",
                type: "list",
                placeholder: "Select a lead...",
                typeOptions: {
                    searchListMethod: "searchRecords",
                    searchable: true,
                },
            },
            {
                displayName: "By ID",
                name: "id",
                type: "string",
                placeholder: "e.g. 0192a0b1-2c3d-7e4f-9a5b-6c7d8e9f0a1b",
                validation: [
                    {
                        type: "regex",
                        properties: {
                            regex: "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$",
                            errorMessage: "Enter a dealr.cloud ID, e.g. 0192a0b1-2c3d-7e4f-9a5b-6c7d8e9f0a1b",
                        },
                    },
                ],
            },
        ],
    },
    {
        displayName: "Flag ID",
        name: "flag_id",
        type: "string",
        required: true,
        default: "",
        description: "The dealr.cloud ID of the flag to write on",
        displayOptions: {
            show: {
                resource: [
                    "lead",
                ],
                operation: [
                    "update_lead_flag",
                ],
            },
        },
    },
    {
        displayName: "Simplify",
        name: "simplify",
        type: "boolean",
        default: false,
        description: "Whether to return a simplified version of the response instead of the raw data",
        displayOptions: {
            show: {
                resource: [
                    "lead",
                ],
                operation: [
                    "get",
                    "getAll",
                ],
            },
        },
    },
    {
        displayName: "Return All",
        name: "returnAll",
        type: "boolean",
        default: false,
        description: "Whether to return all results or only up to a given limit",
        displayOptions: {
            show: {
                resource: [
                    "lead",
                ],
                operation: [
                    "getAll",
                ],
            },
        },
    },
    {
        displayName: "Limit",
        name: "limit",
        type: "number",
        typeOptions: {
            minValue: 1,
            maxValue: 200,
        },
        default: 50,
        description: "Max number of results to return",
        displayOptions: {
            show: {
                resource: [
                    "lead",
                ],
                operation: [
                    "getAll",
                ],
                returnAll: [
                    false,
                ],
            },
        },
        routing: {
            send: {
                type: "query",
                property: "limit",
            },
            output: {
                maxResults: "={{$value}}",
            },
        },
    },
    {
        displayName: "Filters",
        name: "filters",
        type: "collection",
        placeholder: "Add Filter",
        default: {},
        displayOptions: {
            show: {
                resource: [
                    "lead",
                ],
                operation: [
                    "getAll",
                ],
            },
        },
        options: [
            {
                displayName: "Assigned Salesperson ID",
                name: "assigned_user_id",
                type: "string",
                default: "",
                placeholder: "e.g. 0191f5a6-7b8c-7d9e-8a0b-1c2d3e4f5a6b",
                description: "The dealr.cloud ID of the salesperson the lead is assigned to. Leads assigned to no one are included too.",
                routing: {
                    send: {
                        type: "query",
                        property: "assigned_user_id",
                    },
                },
            },
            {
                displayName: "Created Since",
                name: "created_since",
                type: "string",
                default: "",
                placeholder: "e.g. 2026-09-01T00:00:00-06:00",
                description: "Only leads created at or after this date and time, for example 2026-09-01T08:00:00-06:00",
                routing: {
                    send: {
                        type: "query",
                        property: "created_since",
                    },
                },
            },
            {
                displayName: "dealr.cloud ID",
                name: "ids",
                type: "string",
                default: "",
                placeholder: "e.g. 0192b6a0-4c3d-7a1e-9f52-3b8c7d1e4a90,0192b6a0-51e2-7bcf-8d13-9a7e2c5f0b44",
                description: "Look up one record by its dealr.cloud ID, for example the ID a trigger delivered",
                routing: {
                    send: {
                        type: "query",
                        property: "ids",
                    },
                },
            },
            {
                displayName: "Lead Source ID",
                name: "source_id",
                type: "string",
                default: "",
                placeholder: "e.g. 0192a4d5-6e7f-7081-9293-a4b5c6d7e8f9",
                description: "The dealr.cloud ID of the lead source, as a lead's 'Source ID' shows it",
                routing: {
                    send: {
                        type: "query",
                        property: "source_id",
                    },
                },
            },
            {
                displayName: "Search Text",
                name: "q",
                type: "string",
                default: "",
                placeholder: "e.g. accord",
                description: "Matches the shopper or co-shopper name, email address and phone number, the same way the leads screen search box does",
                routing: {
                    send: {
                        type: "query",
                        property: "q",
                    },
                },
            },
            {
                displayName: "Status",
                name: "status",
                type: "options",
                options: [
                    {
                        name: "Active",
                        value: "active",
                    },
                    {
                        name: "Ghost",
                        value: "ghost",
                    },
                    {
                        name: "Lost",
                        value: "lost",
                    },
                    {
                        name: "Needs Attention",
                        value: "needs_attention",
                    },
                    {
                        name: "Sold",
                        value: "sold",
                    },
                ],
                default: "active",
                description: "Where the lead stands",
                routing: {
                    send: {
                        type: "query",
                        property: "status",
                    },
                },
            },
            {
                displayName: "Temperature",
                name: "temperature",
                type: "options",
                options: [
                    {
                        name: "Cold",
                        value: "cold",
                    },
                    {
                        name: "Hot",
                        value: "hot",
                    },
                    {
                        name: "Warm",
                        value: "warm",
                    },
                ],
                default: "hot",
                description: "How warm the lead is",
                routing: {
                    send: {
                        type: "query",
                        property: "temperature",
                    },
                },
            },
            {
                displayName: "Vehicle of Interest ID",
                name: "inventory_id",
                type: "string",
                default: "",
                placeholder: "e.g. 0192b6a0-4c3d-7a1e-9f52-3b8c7d1e4a90",
                description: "The dealr.cloud ID of a vehicle. Finds leads interested in it.",
                routing: {
                    send: {
                        type: "query",
                        property: "inventory_id",
                    },
                },
            },
            {
                displayName: "Worked Within",
                name: "last_activity_within",
                type: "options",
                options: [
                    {
                        name: "180d",
                        value: "180d",
                    },
                    {
                        name: "365d",
                        value: "365d",
                    },
                    {
                        name: "90d",
                        value: "90d",
                    },
                ],
                default: "90d",
                description: "Only leads worked in this many recent days",
                routing: {
                    send: {
                        type: "query",
                        property: "last_activity_within",
                    },
                },
            },
        ],
    },
    {
        displayName: "Options",
        name: "options",
        type: "collection",
        placeholder: "Add Option",
        default: {},
        displayOptions: {
            show: {
                resource: [
                    "lead",
                ],
                operation: [
                    "getAll",
                ],
            },
        },
        options: [
            {
                displayName: "Sort By",
                name: "sortBy",
                type: "options",
                options: [
                    {
                        name: "Created",
                        value: "created_at",
                    },
                    {
                        name: "Customer Name",
                        value: "customer_name",
                    },
                    {
                        name: "Last Activity",
                        value: "last_activity_at",
                    },
                    {
                        name: "Temperature",
                        value: "temperature",
                    },
                ],
                default: "last_activity_at",
                description: "The field to sort leads by. Use it with 'Sort Direction'.",
                routing: {
                    send: {
                        type: "query",
                        property: "sort",
                        value: "={{ ($parameter.options.sortDirection === \"descending\" ? \"-\" : \"\") + $value }}",
                    },
                },
            },
            {
                displayName: "Sort Direction",
                name: "sortDirection",
                type: "options",
                options: [
                    {
                        name: "Ascending",
                        value: "ascending",
                    },
                    {
                        name: "Descending",
                        value: "descending",
                    },
                ],
                default: "ascending",
                description: "Which way to sort. Applies when 'Sort By' is set.",
            },
        ],
    },
    {
        displayName: "Comment",
        name: "text",
        type: "string",
        typeOptions: {
            rows: 4,
        },
        required: true,
        default: "",
        placeholder: "e.g. Called and left a voicemail about the Saturday appointment.",
        description: "What the comment should say, up to 10,000 characters. It appears on the lead's timeline.",
        displayOptions: {
            show: {
                resource: [
                    "lead",
                ],
                operation: [
                    "create_lead_activity",
                ],
            },
        },
        routing: {
            send: {
                type: "body",
                property: "text",
            },
        },
    },
    {
        displayName: "Count as Salesperson Activity",
        name: "touch_last_activity",
        type: "boolean",
        default: false,
        description: "Whether to count this comment as work on the lead, which resets its follow-up clock. Leave it off for automated logging.",
        displayOptions: {
            show: {
                resource: [
                    "lead",
                ],
                operation: [
                    "create_lead_activity",
                ],
            },
        },
        routing: {
            send: {
                type: "body",
                property: "touch_last_activity",
            },
        },
    },
    {
        displayName: "Note",
        name: "body",
        type: "string",
        typeOptions: {
            rows: 4,
        },
        required: true,
        default: "",
        placeholder: "e.g. Customer called — wants to pick the car up Saturday morning.",
        description: "What the note should say, up to 10,000 characters. Saved as plain text.",
        displayOptions: {
            show: {
                resource: [
                    "lead",
                ],
                operation: [
                    "create_lead_note",
                ],
            },
        },
        routing: {
            send: {
                type: "body",
                property: "body",
            },
        },
    },
    {
        displayName: "Flag Note",
        name: "note",
        type: "string",
        typeOptions: {
            rows: 4,
        },
        required: true,
        default: "",
        placeholder: "e.g. Bumper cover back-ordered until the 22nd.",
        description: "The note to keep on this flag, up to 2,000 characters. Replaces the current note. Only a flag that is turned on can carry a note.",
        displayOptions: {
            show: {
                resource: [
                    "lead",
                ],
                operation: [
                    "update_lead_flag",
                ],
            },
        },
        routing: {
            send: {
                type: "body",
                property: "note",
            },
        },
    },
    {
        displayName: "Operation",
        name: "operation",
        type: "options",
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    "repair_order",
                ],
            },
        },
        options: [
            {
                name: "Add Note",
                value: "create_repair_order_note",
                description: "Add a note to a repair order in dealr.cloud",
                action: "Add note to repair order",
                routing: {
                    request: {
                        method: "POST",
                        url: "=/unstable/notes/repair_orders/{{encodeURIComponent($parameter[\"id\"])}}",
                    },
                },
            },
            {
                name: "Get",
                value: "get",
                description: "Retrieve a repair order",
                action: "Get repair order",
                routing: {
                    request: {
                        method: "GET",
                        url: "=/unstable/repair_orders/{{encodeURIComponent($parameter[\"id\"])}}",
                    },
                },
            },
            {
                name: "Get Many",
                value: "getAll",
                description: "Retrieve a list of repair orders, quotes and invoices in dealr.cloud by RO number, VIN, stock number, vehicle, customer, service advisor or technician",
                action: "Get many repair orders",
                routing: {
                    request: {
                        method: "GET",
                        url: "/unstable/repair_orders",
                        qs: {
                            limit: 200,
                        },
                    },
                    send: {
                        paginate: "={{ $parameter.returnAll }}",
                    },
                    output: {
                        postReceive: [
                            {
                                type: "rootProperty",
                                properties: {
                                    property: "data",
                                },
                            },
                        ],
                    },
                },
            },
            {
                name: "Update Flag Note",
                value: "update_repair_order_flag",
                description: "Replace the note on a flag that's already on a repair order",
                action: "Update flag note on repair order",
                routing: {
                    request: {
                        method: "PATCH",
                        url: "=/unstable/flags/repair_orders/{{encodeURIComponent($parameter[\"id\"])}}/{{encodeURIComponent($parameter[\"flag_id\"])}}",
                    },
                },
            },
        ],
        default: "get",
    },
    {
        displayName: "Repair Order",
        name: "id",
        type: "resourceLocator",
        required: true,
        default: {
            mode: "list",
            value: "",
        },
        description: "The repair order to use",
        displayOptions: {
            show: {
                resource: [
                    "repair_order",
                ],
                operation: [
                    "get",
                    "create_repair_order_note",
                    "update_repair_order_flag",
                ],
            },
        },
        modes: [
            {
                displayName: "From List",
                name: "list",
                type: "list",
                placeholder: "Select a repair order...",
                typeOptions: {
                    searchListMethod: "searchRecords",
                    searchable: true,
                },
            },
            {
                displayName: "By ID",
                name: "id",
                type: "string",
                placeholder: "e.g. 0192e4f5-6a7b-7c8d-8e9f-0a1b2c3d4e5f",
                validation: [
                    {
                        type: "regex",
                        properties: {
                            regex: "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$",
                            errorMessage: "Enter a dealr.cloud ID, e.g. 0192e4f5-6a7b-7c8d-8e9f-0a1b2c3d4e5f",
                        },
                    },
                ],
            },
        ],
    },
    {
        displayName: "Flag ID",
        name: "flag_id",
        type: "string",
        required: true,
        default: "",
        description: "The dealr.cloud ID of the flag to write on",
        displayOptions: {
            show: {
                resource: [
                    "repair_order",
                ],
                operation: [
                    "update_repair_order_flag",
                ],
            },
        },
    },
    {
        displayName: "Simplify",
        name: "simplify",
        type: "boolean",
        default: false,
        description: "Whether to return a simplified version of the response instead of the raw data",
        displayOptions: {
            show: {
                resource: [
                    "repair_order",
                ],
                operation: [
                    "get",
                    "getAll",
                ],
            },
        },
    },
    {
        displayName: "Return All",
        name: "returnAll",
        type: "boolean",
        default: false,
        description: "Whether to return all results or only up to a given limit",
        displayOptions: {
            show: {
                resource: [
                    "repair_order",
                ],
                operation: [
                    "getAll",
                ],
            },
        },
    },
    {
        displayName: "Limit",
        name: "limit",
        type: "number",
        typeOptions: {
            minValue: 1,
            maxValue: 200,
        },
        default: 50,
        description: "Max number of results to return",
        displayOptions: {
            show: {
                resource: [
                    "repair_order",
                ],
                operation: [
                    "getAll",
                ],
                returnAll: [
                    false,
                ],
            },
        },
        routing: {
            send: {
                type: "query",
                property: "limit",
            },
            output: {
                maxResults: "={{$value}}",
            },
        },
    },
    {
        displayName: "Filters",
        name: "filters",
        type: "collection",
        placeholder: "Add Filter",
        default: {},
        displayOptions: {
            show: {
                resource: [
                    "repair_order",
                ],
                operation: [
                    "getAll",
                ],
            },
        },
        options: [
            {
                displayName: "Closed",
                name: "closed",
                type: "boolean",
                default: false,
                description: "Whether the repair order is closed: nothing left to collect, as the RO list's Open/Closed shows it",
                routing: {
                    send: {
                        type: "query",
                        property: "closed",
                    },
                },
            },
            {
                displayName: "dealr.cloud ID",
                name: "ids",
                type: "string",
                default: "",
                placeholder: "e.g. 0192b6a0-4c3d-7a1e-9f52-3b8c7d1e4a90,0192b6a0-51e2-7bcf-8d13-9a7e2c5f0b44",
                description: "Look up one record by its dealr.cloud ID, for example the ID a trigger delivered",
                routing: {
                    send: {
                        type: "query",
                        property: "ids",
                    },
                },
            },
            {
                displayName: "Internal (Recon) Work",
                name: "is_internal",
                type: "boolean",
                default: false,
                description: "Whether the work is reconditioning on your own inventory rather than customer work",
                routing: {
                    send: {
                        type: "query",
                        property: "is_internal",
                    },
                },
            },
            {
                displayName: "Opened Since",
                name: "opened_since",
                type: "string",
                default: "",
                placeholder: "e.g. 2026-01-01",
                description: "Only repair orders opened on or after this date",
                routing: {
                    send: {
                        type: "query",
                        property: "opened_since",
                    },
                },
            },
            {
                displayName: "Record Type",
                name: "type",
                type: "options",
                options: [
                    {
                        name: "All",
                        value: "all",
                    },
                    {
                        name: "Invoice",
                        value: "invoice",
                    },
                    {
                        name: "Quote",
                        value: "quote",
                    },
                    {
                        name: "Repair Order",
                        value: "repair_order",
                    },
                ],
                default: "repair_order",
                description: "Repair orders, quotes, invoices, or all of them",
                routing: {
                    send: {
                        type: "query",
                        property: "type",
                    },
                },
            },
            {
                displayName: "RO Number",
                name: "number",
                type: "string",
                default: "",
                placeholder: "e.g. 104829",
                description: "The repair order or invoice number",
                routing: {
                    send: {
                        type: "query",
                        property: "number",
                    },
                },
            },
            {
                displayName: "Search Text",
                name: "q",
                type: "string",
                default: "",
                placeholder: "e.g. accord",
                description: "Matches the RO number, the vehicle (year/make/model/trim and VIN) and the customer name, the same way the repair order screen search box does",
                routing: {
                    send: {
                        type: "query",
                        property: "q",
                    },
                },
            },
            {
                displayName: "Service Advisor ID",
                name: "advisor_user_id",
                type: "string",
                default: "",
                placeholder: "e.g. 0191f5a6-7b8c-7d9e-8a0b-1c2d3e4f5a6b",
                description: "The dealr.cloud ID of the repair order's service advisor",
                routing: {
                    send: {
                        type: "query",
                        property: "advisor_user_id",
                    },
                },
            },
            {
                displayName: "Stock Number",
                name: "stock_number",
                type: "string",
                default: "",
                placeholder: "e.g. A1234",
                description: "Stock number of the vehicle worked on",
                routing: {
                    send: {
                        type: "query",
                        property: "stock_number",
                    },
                },
            },
            {
                displayName: "Technician ID",
                name: "technician_user_id",
                type: "string",
                default: "",
                placeholder: "e.g. 0191f7c8-9d0e-7f12-9a34-5b6c7d8e9f01",
                description: "The dealr.cloud ID of the repair order's lead technician",
                routing: {
                    send: {
                        type: "query",
                        property: "technician_user_id",
                    },
                },
            },
            {
                displayName: "VIN",
                name: "vin",
                type: "string",
                default: "",
                placeholder: "e.g. 1HGCM82633A004352",
                description: "Full or partial VIN of the vehicle worked on",
                routing: {
                    send: {
                        type: "query",
                        property: "vin",
                    },
                },
            },
        ],
    },
    {
        displayName: "Options",
        name: "options",
        type: "collection",
        placeholder: "Add Option",
        default: {},
        displayOptions: {
            show: {
                resource: [
                    "repair_order",
                ],
                operation: [
                    "getAll",
                ],
            },
        },
        options: [
            {
                displayName: "Sort By",
                name: "sortBy",
                type: "options",
                options: [
                    {
                        name: "Balance Due",
                        value: "balance_due",
                    },
                    {
                        name: "Opened",
                        value: "opened_at",
                    },
                    {
                        name: "RO Number",
                        value: "number",
                    },
                ],
                default: "opened_at",
                description: "The field to sort repair orders by. Use it with 'Sort Direction'.",
                routing: {
                    send: {
                        type: "query",
                        property: "sort",
                        value: "={{ ($parameter.options.sortDirection === \"descending\" ? \"-\" : \"\") + $value }}",
                    },
                },
            },
            {
                displayName: "Sort Direction",
                name: "sortDirection",
                type: "options",
                options: [
                    {
                        name: "Ascending",
                        value: "ascending",
                    },
                    {
                        name: "Descending",
                        value: "descending",
                    },
                ],
                default: "ascending",
                description: "Which way to sort. Applies when 'Sort By' is set.",
            },
        ],
    },
    {
        displayName: "Note",
        name: "body",
        type: "string",
        typeOptions: {
            rows: 4,
        },
        required: true,
        default: "",
        placeholder: "e.g. Customer called — wants to pick the car up Saturday morning.",
        description: "What the note should say, up to 10,000 characters. Saved as plain text.",
        displayOptions: {
            show: {
                resource: [
                    "repair_order",
                ],
                operation: [
                    "create_repair_order_note",
                ],
            },
        },
        routing: {
            send: {
                type: "body",
                property: "body",
            },
        },
    },
    {
        displayName: "Flag Note",
        name: "note",
        type: "string",
        typeOptions: {
            rows: 4,
        },
        required: true,
        default: "",
        placeholder: "e.g. Bumper cover back-ordered until the 22nd.",
        description: "The note to keep on this flag, up to 2,000 characters. Replaces the current note. Only a flag that is turned on can carry a note.",
        displayOptions: {
            show: {
                resource: [
                    "repair_order",
                ],
                operation: [
                    "update_repair_order_flag",
                ],
            },
        },
        routing: {
            send: {
                type: "body",
                property: "note",
            },
        },
    },
    {
        displayName: "Operation",
        name: "operation",
        type: "options",
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    "inventory_unit",
                ],
            },
        },
        options: [
            {
                name: "Add Note",
                value: "create_inventory_unit_note",
                description: "Add a note to a vehicle in dealr.cloud",
                action: "Add note to vehicle",
                routing: {
                    request: {
                        method: "POST",
                        url: "=/unstable/notes/inventory_units/{{encodeURIComponent($parameter[\"id\"])}}",
                    },
                },
            },
            {
                name: "Get",
                value: "get",
                description: "Retrieve a vehicle",
                action: "Get vehicle",
                routing: {
                    request: {
                        method: "GET",
                        url: "=/unstable/inventory_units/{{encodeURIComponent($parameter[\"id\"])}}",
                    },
                },
            },
            {
                name: "Get Many",
                value: "getAll",
                description: "Retrieve a list of vehicles in your dealr.cloud inventory by stock number, VIN, year, make, model, status or condition",
                action: "Get many vehicles",
                routing: {
                    request: {
                        method: "GET",
                        url: "/unstable/inventory_units",
                        qs: {
                            limit: 200,
                        },
                    },
                    send: {
                        paginate: "={{ $parameter.returnAll }}",
                    },
                    output: {
                        postReceive: [
                            {
                                type: "rootProperty",
                                properties: {
                                    property: "data",
                                },
                            },
                        ],
                    },
                },
            },
            {
                name: "Update Flag Note",
                value: "update_inventory_unit_flag",
                description: "Replace the note on a flag that's already on a vehicle",
                action: "Update flag note on vehicle",
                routing: {
                    request: {
                        method: "PATCH",
                        url: "=/unstable/flags/inventory_units/{{encodeURIComponent($parameter[\"id\"])}}/{{encodeURIComponent($parameter[\"flag_id\"])}}",
                    },
                },
            },
        ],
        default: "get",
    },
    {
        displayName: "Vehicle",
        name: "id",
        type: "resourceLocator",
        required: true,
        default: {
            mode: "list",
            value: "",
        },
        description: "The vehicle to use",
        displayOptions: {
            show: {
                resource: [
                    "inventory_unit",
                ],
                operation: [
                    "get",
                    "create_inventory_unit_note",
                    "update_inventory_unit_flag",
                ],
            },
        },
        modes: [
            {
                displayName: "From List",
                name: "list",
                type: "list",
                placeholder: "Select a vehicle...",
                typeOptions: {
                    searchListMethod: "searchRecords",
                    searchable: true,
                },
            },
            {
                displayName: "By ID",
                name: "id",
                type: "string",
                placeholder: "e.g. 0192b6a0-4c3d-7a1e-9f52-3b8c7d1e4a90",
                validation: [
                    {
                        type: "regex",
                        properties: {
                            regex: "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$",
                            errorMessage: "Enter a dealr.cloud ID, e.g. 0192b6a0-4c3d-7a1e-9f52-3b8c7d1e4a90",
                        },
                    },
                ],
            },
        ],
    },
    {
        displayName: "Flag ID",
        name: "flag_id",
        type: "string",
        required: true,
        default: "",
        description: "The dealr.cloud ID of the flag to write on",
        displayOptions: {
            show: {
                resource: [
                    "inventory_unit",
                ],
                operation: [
                    "update_inventory_unit_flag",
                ],
            },
        },
    },
    {
        displayName: "Simplify",
        name: "simplify",
        type: "boolean",
        default: false,
        description: "Whether to return a simplified version of the response instead of the raw data",
        displayOptions: {
            show: {
                resource: [
                    "inventory_unit",
                ],
                operation: [
                    "get",
                    "getAll",
                ],
            },
        },
    },
    {
        displayName: "Return All",
        name: "returnAll",
        type: "boolean",
        default: false,
        description: "Whether to return all results or only up to a given limit",
        displayOptions: {
            show: {
                resource: [
                    "inventory_unit",
                ],
                operation: [
                    "getAll",
                ],
            },
        },
    },
    {
        displayName: "Limit",
        name: "limit",
        type: "number",
        typeOptions: {
            minValue: 1,
            maxValue: 200,
        },
        default: 50,
        description: "Max number of results to return",
        displayOptions: {
            show: {
                resource: [
                    "inventory_unit",
                ],
                operation: [
                    "getAll",
                ],
                returnAll: [
                    false,
                ],
            },
        },
        routing: {
            send: {
                type: "query",
                property: "limit",
            },
            output: {
                maxResults: "={{$value}}",
            },
        },
    },
    {
        displayName: "Filters",
        name: "filters",
        type: "collection",
        placeholder: "Add Filter",
        default: {},
        displayOptions: {
            show: {
                resource: [
                    "inventory_unit",
                ],
                operation: [
                    "getAll",
                ],
            },
        },
        options: [
            {
                displayName: "Condition",
                name: "condition",
                type: "string",
                default: "",
                placeholder: "e.g. Used",
                description: "The condition recorded on the vehicle, for example New or Used",
                routing: {
                    send: {
                        type: "query",
                        property: "condition",
                    },
                },
            },
            {
                displayName: "dealr.cloud ID",
                name: "ids",
                type: "string",
                default: "",
                placeholder: "e.g. 0192b6a0-4c3d-7a1e-9f52-3b8c7d1e4a90,0192b6a0-51e2-7bcf-8d13-9a7e2c5f0b44",
                description: "Look up one record by its dealr.cloud ID, for example the ID a trigger delivered",
                routing: {
                    send: {
                        type: "query",
                        property: "ids",
                    },
                },
            },
            {
                displayName: "Make",
                name: "make",
                type: "string",
                default: "",
                placeholder: "e.g. Honda",
                description: "The manufacturer, for example Honda",
                routing: {
                    send: {
                        type: "query",
                        property: "make",
                    },
                },
            },
            {
                displayName: "Model",
                name: "model",
                type: "string",
                default: "",
                placeholder: "e.g. Accord",
                description: "The model, for example Accord",
                routing: {
                    send: {
                        type: "query",
                        property: "model",
                    },
                },
            },
            {
                displayName: "Search Text",
                name: "q",
                type: "string",
                default: "",
                placeholder: "e.g. accord",
                description: "Matches stock number, VIN and year/make/model/trim, the same way the inventory screen search box does",
                routing: {
                    send: {
                        type: "query",
                        property: "q",
                    },
                },
            },
            {
                displayName: "Status",
                name: "status",
                type: "options",
                options: [
                    {
                        name: "Active",
                        value: "active",
                    },
                    {
                        name: "Inactive",
                        value: "inactive",
                    },
                    {
                        name: "Sold",
                        value: "sold",
                    },
                ],
                default: "active",
                description: "Active, Inactive or Sold",
                routing: {
                    send: {
                        type: "query",
                        property: "status",
                    },
                },
            },
            {
                displayName: "Stock Number",
                name: "stock_number",
                type: "string",
                default: "",
                placeholder: "e.g. A1234",
                description: "Full or partial stock number",
                routing: {
                    send: {
                        type: "query",
                        property: "stock_number",
                    },
                },
            },
            {
                displayName: "Stocked In After",
                name: "in_date",
                type: "string",
                default: "",
                placeholder: "e.g. 2026-01-01",
                description: "Only vehicles stocked in after this date, for example 2026-09-01",
                routing: {
                    send: {
                        type: "query",
                        property: "in_date",
                    },
                },
            },
            {
                displayName: "Updated Since",
                name: "updated_since",
                type: "string",
                default: "",
                placeholder: "e.g. 2026-09-01T00:00:00-06:00",
                description: "Only records changed at or after this date and time, for example 2026-09-01T08:00:00-06:00",
                routing: {
                    send: {
                        type: "query",
                        property: "updated_since",
                    },
                },
            },
            {
                displayName: "VIN",
                name: "vin",
                type: "string",
                default: "",
                placeholder: "e.g. 1HGCM82633A004352",
                description: "Full or partial VIN",
                routing: {
                    send: {
                        type: "query",
                        property: "vin",
                    },
                },
            },
            {
                displayName: "Year",
                name: "year",
                type: "string",
                default: "",
                placeholder: "e.g. 2019",
                description: "The model year, for example 2019",
                routing: {
                    send: {
                        type: "query",
                        property: "year",
                    },
                },
            },
        ],
    },
    {
        displayName: "Options",
        name: "options",
        type: "collection",
        placeholder: "Add Option",
        default: {},
        displayOptions: {
            show: {
                resource: [
                    "inventory_unit",
                ],
                operation: [
                    "getAll",
                ],
            },
        },
        options: [
            {
                displayName: "Sort By",
                name: "sortBy",
                type: "options",
                options: [
                    {
                        name: "Days in Stock",
                        value: "days_in_stock",
                    },
                    {
                        name: "Price",
                        value: "price",
                    },
                    {
                        name: "Stock Number",
                        value: "stock_number",
                    },
                    {
                        name: "Stocked In Date",
                        value: "in_date",
                    },
                ],
                default: "in_date",
                description: "The field to sort vehicles by. Use it with 'Sort Direction'.",
                routing: {
                    send: {
                        type: "query",
                        property: "sort",
                        value: "={{ ($parameter.options.sortDirection === \"descending\" ? \"-\" : \"\") + $value }}",
                    },
                },
            },
            {
                displayName: "Sort Direction",
                name: "sortDirection",
                type: "options",
                options: [
                    {
                        name: "Ascending",
                        value: "ascending",
                    },
                    {
                        name: "Descending",
                        value: "descending",
                    },
                ],
                default: "ascending",
                description: "Which way to sort. Applies when 'Sort By' is set.",
            },
        ],
    },
    {
        displayName: "Note",
        name: "body",
        type: "string",
        typeOptions: {
            rows: 4,
        },
        required: true,
        default: "",
        placeholder: "e.g. Customer called — wants to pick the car up Saturday morning.",
        description: "What the note should say, up to 10,000 characters. Saved as plain text.",
        displayOptions: {
            show: {
                resource: [
                    "inventory_unit",
                ],
                operation: [
                    "create_inventory_unit_note",
                ],
            },
        },
        routing: {
            send: {
                type: "body",
                property: "body",
            },
        },
    },
    {
        displayName: "Flag Note",
        name: "note",
        type: "string",
        typeOptions: {
            rows: 4,
        },
        required: true,
        default: "",
        placeholder: "e.g. Bumper cover back-ordered until the 22nd.",
        description: "The note to keep on this flag, up to 2,000 characters. Replaces the current note. Only a flag that is turned on can carry a note.",
        displayOptions: {
            show: {
                resource: [
                    "inventory_unit",
                ],
                operation: [
                    "update_inventory_unit_flag",
                ],
            },
        },
        routing: {
            send: {
                type: "body",
                property: "note",
            },
        },
    },
];

export const resources: Record<string, { listPath: string; choice: string; simplify: string[] }> = {
    communication: {
        listPath: "/unstable/communications",
        choice: "{customer.name} · {channel} · {subject}",
        simplify: [
            "id",
            "customer.name",
            "channel",
            "status",
            "subject",
            "about.type",
            "assigned_to",
            "last_message.at",
            "counts.unread",
            "location.name",
        ],
    },
    customer: {
        listPath: "/unstable/customers",
        choice: "{name} · {contact.email}",
        simplify: [
            "id",
            "name",
            "contact.email",
            "contact.phones.mobile",
            "type",
            "address.city",
            "address.state",
            "counts.deals",
            "counts.repair_orders",
            "updated_at",
        ],
    },
    inventory_unit: {
        listPath: "/unstable/inventory_units",
        choice: "{year} {make} {model} {trim} · {stock_number}",
        simplify: [
            "id",
            "stock_number",
            "year",
            "make",
            "model",
            "trim",
            "vin",
            "status",
            "pricing.asking",
            "location.name",
        ],
    },
    lead: {
        listPath: "/unstable/leads",
        choice: "{customer.name} · {vehicle_of_interest.description}",
        simplify: [
            "id",
            "customer.name",
            "status",
            "temperature",
            "vehicle_of_interest.description",
            "source.name",
            "assigned_to.name",
            "last_activity_at",
            "created_at",
            "location.name",
        ],
    },
    repair_order: {
        listPath: "/unstable/repair_orders",
        choice: "{number} · {customer.name} · {vehicle.description}",
        simplify: [
            "id",
            "number",
            "status",
            "customer.name",
            "vehicle.description",
            "advisor.name",
            "totals.total",
            "payments_summary.balance_due",
            "opened_at",
            "location.name",
        ],
    },
};
