import { RagfairOfferGenerator } from "../generators/RagfairOfferGenerator";
import { HandbookHelper } from "../helpers/HandbookHelper";
import { InventoryHelper } from "../helpers/InventoryHelper";
import { ItemHelper } from "../helpers/ItemHelper";
import { PaymentHelper } from "../helpers/PaymentHelper";
import { ProfileHelper } from "../helpers/ProfileHelper";
import { RagfairHelper } from "../helpers/RagfairHelper";
import { RagfairOfferHelper } from "../helpers/RagfairOfferHelper";
import { RagfairSellHelper } from "../helpers/RagfairSellHelper";
import { RagfairSortHelper } from "../helpers/RagfairSortHelper";
import { RagfairTaxHelper } from "../helpers/RagfairTaxHelper";
import { TraderHelper } from "../helpers/TraderHelper";
import { IPmcData } from "../models/eft/common/IPmcData";
import { Item } from "../models/eft/common/tables/IItem";
import { ITraderAssort } from "../models/eft/common/tables/ITrader";
import { IItemEventRouterResponse } from "../models/eft/itemEvent/IItemEventRouterResponse";
import { IAkiProfile } from "../models/eft/profile/IAkiProfile";
import { IAddOfferRequestData, Requirement } from "../models/eft/ragfair/IAddOfferRequestData";
import { IExtendOfferRequestData } from "../models/eft/ragfair/IExtendOfferRequestData";
import { IGetItemPriceResult } from "../models/eft/ragfair/IGetItemPriceResult";
import { IGetMarketPriceRequestData } from "../models/eft/ragfair/IGetMarketPriceRequestData";
import { IGetOffersResult } from "../models/eft/ragfair/IGetOffersResult";
import { IRagfairOffer } from "../models/eft/ragfair/IRagfairOffer";
import { ISearchRequestData } from "../models/eft/ragfair/ISearchRequestData";
import { IRagfairConfig } from "../models/spt/config/IRagfairConfig";
import { ILogger } from "../models/spt/utils/ILogger";
import { EventOutputHolder } from "../routers/EventOutputHolder";
import { ConfigServer } from "../servers/ConfigServer";
import { DatabaseServer } from "../servers/DatabaseServer";
import { RagfairServer } from "../servers/RagfairServer";
import { SaveServer } from "../servers/SaveServer";
import { LocalisationService } from "../services/LocalisationService";
import { PaymentService } from "../services/PaymentService";
import { RagfairOfferService } from "../services/RagfairOfferService";
import { RagfairPriceService } from "../services/RagfairPriceService";
import { RagfairRequiredItemsService } from "../services/RagfairRequiredItemsService";
import { HttpResponseUtil } from "../utils/HttpResponseUtil";
import { TimeUtil } from "../utils/TimeUtil";
/**
 * Handle RagfairCallback events
 */
export declare class RagfairController {
    protected logger: ILogger;
    protected timeUtil: TimeUtil;
    protected httpResponse: HttpResponseUtil;
    protected eventOutputHolder: EventOutputHolder;
    protected ragfairServer: RagfairServer;
    protected ragfairPriceService: RagfairPriceService;
    protected databaseServer: DatabaseServer;
    protected itemHelper: ItemHelper;
    protected saveServer: SaveServer;
    protected ragfairSellHelper: RagfairSellHelper;
    protected ragfairTaxHelper: RagfairTaxHelper;
    protected ragfairSortHelper: RagfairSortHelper;
    protected ragfairOfferHelper: RagfairOfferHelper;
    protected profileHelper: ProfileHelper;
    protected paymentService: PaymentService;
    protected handbookHelper: HandbookHelper;
    protected paymentHelper: PaymentHelper;
    protected inventoryHelper: InventoryHelper;
    protected traderHelper: TraderHelper;
    protected ragfairHelper: RagfairHelper;
    protected ragfairOfferService: RagfairOfferService;
    protected ragfairRequiredItemsService: RagfairRequiredItemsService;
    protected ragfairOfferGenerator: RagfairOfferGenerator;
    protected localisationService: LocalisationService;
    protected configServer: ConfigServer;
    protected ragfairConfig: IRagfairConfig;
    constructor(logger: ILogger, timeUtil: TimeUtil, httpResponse: HttpResponseUtil, eventOutputHolder: EventOutputHolder, ragfairServer: RagfairServer, ragfairPriceService: RagfairPriceService, databaseServer: DatabaseServer, itemHelper: ItemHelper, saveServer: SaveServer, ragfairSellHelper: RagfairSellHelper, ragfairTaxHelper: RagfairTaxHelper, ragfairSortHelper: RagfairSortHelper, ragfairOfferHelper: RagfairOfferHelper, profileHelper: ProfileHelper, paymentService: PaymentService, handbookHelper: HandbookHelper, paymentHelper: PaymentHelper, inventoryHelper: InventoryHelper, traderHelper: TraderHelper, ragfairHelper: RagfairHelper, ragfairOfferService: RagfairOfferService, ragfairRequiredItemsService: RagfairRequiredItemsService, ragfairOfferGenerator: RagfairOfferGenerator, localisationService: LocalisationService, configServer: ConfigServer);
    getOffers(sessionID: string, searchRequest: ISearchRequestData): IGetOffersResult;
    /**
     * Get offers for the client based on type of search being performed
     * @param searchRequest Client search request data
     * @param itemsToAdd
     * @param traderAssorts Trader assorts
     * @param pmcProfile Player profile
     * @returns array of offers
     */
    protected getOffersForSearchType(searchRequest: ISearchRequestData, itemsToAdd: string[], traderAssorts: Record<string, ITraderAssort>, pmcProfile: IPmcData): IRagfairOffer[];
    /**
     * Get categories for the type of search being performed, linked/required/all
     * @param searchRequest Client search request data
     * @param offers ragfair offers to get categories for
     * @returns record with tpls + counts
     */
    protected getSpecificCategories(searchRequest: ISearchRequestData, offers: IRagfairOffer[]): Record<string, number>;
    /**
     * Add Required offers to offers result
     * @param searchRequest Client search request data
     * @param assorts
     * @param pmcProfile Player profile
     * @param result Result object being sent back to client
     */
    protected addRequiredOffersToResult(searchRequest: ISearchRequestData, assorts: Record<string, ITraderAssort>, pmcProfile: IPmcData, result: IGetOffersResult): void;
    /**
     * Add index to all offers passed in (0-indexed)
     * @param offers Offers to add index value to
     */
    protected addIndexValueToOffers(offers: IRagfairOffer[]): void;
    /**
     * Update a trader flea offer with buy restrictions stored in the traders assort
     * @param offer flea offer to update
     * @param profile full profile of player
     */
    protected setTraderOfferPurchaseLimits(offer: IRagfairOffer, profile: IAkiProfile): void;
    /**
     * Adjust ragfair offer stack count to match same value as traders assort stack count
     * @param offer Flea offer to adjust
     */
    protected setTraderOfferStackSize(offer: IRagfairOffer): void;
    protected isLinkedSearch(info: ISearchRequestData): boolean;
    protected isRequiredSearch(info: ISearchRequestData): boolean;
    update(): void;
    /**
     * Called when creating an offer on flea, fills values in top right corner
     * @param getPriceRequest
     * @returns min/avg/max values for an item based on flea offers available
     */
    getItemMinAvgMaxFleaPriceValues(getPriceRequest: IGetMarketPriceRequestData): IGetItemPriceResult;
    /**
     * List item(s) on flea for sale
     * @param pmcData Player profile
     * @param offerRequest Flea list creation offer
     * @param sessionID Session id
     * @returns IItemEventRouterResponse
     */
    addPlayerOffer(pmcData: IPmcData, offerRequest: IAddOfferRequestData, sessionID: string): IItemEventRouterResponse;
    /**
     * Is the item to be listed on the flea valid
     * @param offerRequest Client offer request
     * @param errorMessage message to show to player when offer is invalid
     * @returns Is offer valid
     */
    protected isValidPlayerOfferRequest(offerRequest: IAddOfferRequestData, errorMessage: string): boolean;
    /**
     * Get the handbook price in roubles for the items being listed
     * @param requirements
     * @returns Rouble price
     */
    protected calculateRequirementsPriceInRub(requirements: Requirement[]): number;
    /**
     * Using item ids from flea offer request, find corrispnding items from player inventory and return as array
     * @param pmcData Player profile
     * @param itemIdsFromFleaOfferRequest Ids from request
     * @param errorMessage if item is not found, add error message to this parameter
     * @returns Array of items from player inventory
     */
    protected getItemsToListOnFleaFromInventory(pmcData: IPmcData, itemIdsFromFleaOfferRequest: string[], errorMessage: string): Item[];
    createPlayerOffer(profile: IAkiProfile, requirements: Requirement[], items: Item[], sellInOnePiece: boolean, amountToSend: number): IRagfairOffer;
    getAllFleaPrices(): Record<string, number>;
    getStaticPrices(): Record<string, number>;
    removeOffer(offerId: string, sessionID: string): IItemEventRouterResponse;
    extendOffer(info: IExtendOfferRequestData, sessionID: string): IItemEventRouterResponse;
}
