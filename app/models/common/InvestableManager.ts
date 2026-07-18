import BaseManager from "~/models/common/BaseManager";
import type {BaseState} from "#shared/types/BaseState";

/**
 * A drawable account's tax category — the label that determines its retirement withdrawal rate:
 * taxable = capital gains on the gain (pro-rata basis), tax_deferred = ordinary income,
 * tax_exempt = 0 (Roth), cash = 0 (cash reserve). See CONTEXT.md "Tax category".
 */
export type TaxCategory = 'taxable' | 'tax_deferred' | 'tax_exempt' | 'cash';

/**
 * Base for the six funding-and-drawable accounts (brokerage, tax_deferred, ira, roth_ira, hsa,
 * cash_reserve). Adds a tax category on top of BaseManager; the decomposed grow()/contribute()/
 * withdraw() operations land here next. See ADR 009 amendment (2026-07-17) "decomposed manager
 * operations".
 */
export abstract class InvestableManager<TConfig, TState extends BaseState> extends BaseManager<TConfig, TState> {
    abstract readonly taxCategory: TaxCategory;

    /** Retirement drawdown: raise up to `netNeed` net (post-tax) dollars from this account; returns the net raised. */
    abstract withdraw(netNeed: number): number;
}
