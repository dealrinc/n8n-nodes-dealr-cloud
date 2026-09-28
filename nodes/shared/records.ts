import type { IDataObject } from 'n8n-workflow';

// Reading dealr.cloud records for the Dealr node's Simplify option and its
// "From List" pick lists. Dependency-free, so the connector tests drive it.

function valueAt(record: IDataObject, dotted: string): unknown {
    let current: unknown = record;
    for (const part of dotted.split('.')) {
        if (typeof current !== 'object' || current === null) return undefined;
        current = (current as IDataObject)[part];
    }
    return current;
}

/** The named fields of a record, flattened: `pricing.asking` becomes `pricing_asking`. */
export function simplifyRecord(record: IDataObject, fields: string[]): IDataObject {
    return Object.fromEntries(fields.map((dotted) => [dotted.replace(/\./g, '_'), valueAt(record, dotted) ?? null])) as IDataObject;
}

/** "{year} {make} {model} · {stock_number}" for one record, dropping the parts it has no value for. */
export function choiceLabel(record: IDataObject, template: string): string {
    const label = template
        .split(' · ')
        .map((part) => part.replace(/\{([a-z_.]+)\}/g, (_, dotted: string) => {
            const value = valueAt(record, dotted);
            return typeof value === 'string' || typeof value === 'number' ? String(value) : '';
        }).replace(/\s+/g, ' ').trim())
        .filter((part) => part !== '')
        .join(' · ');
    return label || String(record.id);
}
