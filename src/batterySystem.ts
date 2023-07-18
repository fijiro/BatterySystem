import { DependencyContainer } from "tsyringe";

import { ILogger } from "@spt-aki/models/spt/utils/ILogger"
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { CustomItemService } from "@spt-aki/services/mod/CustomItemService";
import { NewItemFromCloneDetails } from "@spt-aki/models/spt/mod/NewItemDetails";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { BaseClasses } from "@spt-aki/models/enums/BaseClasses"
import { ItemHelper } from "@spt-aki/helpers/ItemHelper"
import * as config from "../config/config.json";

class Mod implements IPostDBLoadMod {
    private batteryType = "2";

    public postDBLoad(container: DependencyContainer): void {
        const logger = container.resolve<ILogger>("WinstonLogger");
        const db = container.resolve<DatabaseServer>("DatabaseServer");
        const locales = Object.values(db.getTables().locales.global) as Record<string, string>[];
        const CustomItem = container.resolve<CustomItemService>("CustomItemService");
        const items = db.getTables().templates.items;
        const hideoutProduction = db.getTables().hideout.production;
        const itemHelper = container.resolve<ItemHelper>("ItemHelper");

        const aaBatteryID = "5672cb124bdc2d1a0f8b4568";
        const dBatteryID = "5672cb304bdc2dc2088b456a";
        const rchblBatteryID = "590a358486f77429692b2790";
        items[aaBatteryID]._props.MaxResource = 100;
        items[aaBatteryID]._props.Resource = 100;
        items[rchblBatteryID]._props.MaxResource = 100;
        items[rchblBatteryID]._props.Resource = 100;
        items[rchblBatteryID]._props.Prefab.path = "batteries/cr123.bundle"
        items[dBatteryID]._props.MaxResource = 100;
        items[dBatteryID]._props.Resource = 100;
        items[dBatteryID]._props.Prefab.path = "batteries/cr2032.bundle";

        //Credit to Jehree! // 16 locales, wtf?
        for (const locale of locales) {
            locale[`${rchblBatteryID} Name`] = "CR123 Rechargeable Battery";
            locale[`${rchblBatteryID} ShortName`] = "CR123";
            locale[`${rchblBatteryID} Description`] = "A singular CR123A Battery. These are commonly used in military and hunting sights.";
            locale[`${dBatteryID} Name`] = "CR2032 Battery";
            locale[`${dBatteryID} ShortName`] = "CR2032";
            locale[`${dBatteryID} Description`] = "A singular CR2032 Battery. These are commonly used in military and hunting sights.";
        };

        /*const AAABattery: NewItemFromCloneDetails = {
            itemTplToClone: "5672cb124bdc2d1a0f8b4568", //aa battery
            overrideProperties: {
                MaxResource: 100,
                Resource: 100,
                InsuranceDisabled: true,
                Prefab: {
                    path: "batteries/cr2032.bundle",
                    rcid: ""
                },
                Unlootable: true,
                UnlootableFromSlot: "SpecialSlot",
                UnlootableFromSide: [
                    "Bear",
                    "Usec",
                    "Savage"
                ]
            }, //Overrided properties basically tell the server on what data inside _props to be modified from the cloned item
            parentId: "57864ee62459775490116fc1", //ParentId refers to the Node item it will be under, you can check it in https://db.sp-tarkov.com/search
            newId: "aaa-battery",
            fleaPriceRoubles: 43250,
            handbookPriceRoubles: 31420,
            handbookParentId: "5b47574386f77428ca22b2ed", //Handbook parent can be found in Aki_Data\Server\database\templates.
            locales: {
                "en": {
                    name: "AAA Battery",
                    shortName: "AAA Battery",
                    description: "A standard AAA battery. Used in a wide variety of electronics, such as night-vision devices, flashlights and laser pointers."
                }
            }
        }
        CustomItem.createItemFromClone(AAABattery); //Basically calls the function and tell the server to add our Cloned new item into the server
        */
        // huge thanks and credit to jbs4mx! https://github.com/jbs4bmx/SpecialSlots/
        const pockets = items["627a4e6b255f7527fb05a0f6"];
        pockets._props.Slots[0]._props.filters[0].Filter.push(dBatteryID, rchblBatteryID, aaBatteryID);
        pockets._props.Slots[1]._props.filters[0].Filter.push(dBatteryID, rchblBatteryID, aaBatteryID);
        pockets._props.Slots[2]._props.filters[0].Filter.push(dBatteryID, rchblBatteryID, aaBatteryID);
        //S I C C case now fits batteries in it
        items["5d235bb686f77443f4331278"]._props.Grids[0]._props.filters[0].Filter.push(dBatteryID, rchblBatteryID, aaBatteryID);
        //add battery slots to wanted items
        for (let i in items) {  //check that item isn't NightVision or ThermalVision and requires a battery, and is either NVG/Thermal sight, NVG/Thermal goggles or T-7.
            if ((items[i]._id != BaseClasses.NIGHTVISION && items[i]._id != "5d21f59b6dbe99052b54ef83"
                && !config.NoBattery.includes(items[i]._id)
                && (items[i]._parent == BaseClasses.SPECIAL_SCOPE || items[i]._parent == BaseClasses.NIGHTVISION || items[i]._parent == "5d21f59b6dbe99052b54ef83")) // headwear
                || (items[i]._parent == BaseClasses.COLLIMATOR || items[i]._parent == BaseClasses.COMPACT_COLLIMATOR)) { // sight

                if (config.AA.includes(items[i]._id))
                    this.batteryType = aaBatteryID; //AA Battery ID                
                else if (config.CR123.includes(items[i]._id))
                    this.batteryType = rchblBatteryID; //CR123, for now rchbl battery
                else if (config.CR2032.includes(items[i]._id))
                    this.batteryType = dBatteryID; //CR2032, for now d battery
                else if (config.CR1225.includes(items[i]._id))
                    this.batteryType = dBatteryID;
                else if (config.CR1632.includes(items[i]._id))
                    this.batteryType = dBatteryID;
                else {
                    logger.warning("BatterySystem: Item " + items[i]._name + " has no defined battery, defaulting to CR2032!");
                    this.batteryType = dBatteryID;
                }
                for (const locale of locales) { // Item description now includes the battery type
                    const newDescription = "Uses " + locale[`${this.batteryType} Name`] + "\n\n" + locale[`${items[i]._id} Description`];
                    locale[`${items[i]._id} Description`] = newDescription;
                }
                //create new slot for battery
                items[i]._props.Slots.push(
                    {
                        _name: "mod_equipment", //change background image, only one mod_tactical can be used at once
                        _id: "slotid_" + i.toString, // has to be unique?
                        _parent: "slotparent_" + i.toString, // doesn't do anything?
                        _props: {
                            filters: [
                                {
                                    Shift: 0,
                                    Filter: [
                                        this.batteryType
                                    ]
                                }
                            ]
                        },
                        _max_count: 1,
                        _required: false,
                        _mergeSlotWithChildren: false,
                        _proto: "" //physical position?
                    }
                );
            }
        }
        //add hideout crafts for batteries
        hideoutProduction.push(
            {
                // craft triple a battery
                "_id": "cr2032Craft0",
                "areaType": 10,
                "requirements": [
                    {
                        "areaType": 10, //Lavatory = 2, WorkBench = 10
                        "requiredLevel": 1,
                        "type": "Area"
                    },
                    {
                        "templateId": "544fb5454bdc2df8738b456a", //multiTool
                        "count": 1,
                        "isFunctional": false,
                        "isEncoded": false,
                        "type": "Tool"
                    },
                    {
                        "templateId": aaBatteryID, //aa battery
                        "count": 1,
                        "isFunctional": false,
                        "isEncoded": false,
                        "type": "Item"
                    }
                ],
                "productionTime": 3600, // seconds
                "needFuelForAllProductionTime": false,
                "locked": false,
                "endProduct": dBatteryID,
                "continuous": false,
                "count": 2,
                "productionLimitCount": 0,
                "isEncoded": false
            },
            {
                // Induction!
                "_id": "cr123Recharge0",
                "areaType": 2,
                "requirements": [
                    {
                        "areaType": 2, //Lavatory = 2, WorkBench = 10
                        "requiredLevel": 1,
                        "type": "Area"
                    },
                    {
                        "templateId": "590a391c86f774385a33c404", //magnet
                        "count": 1,
                        "isFunctional": false,
                        "isEncoded": false,
                        "type": "Tool"
                    },
                    {
                        "templateId": "5c06779c86f77426e00dd782", //Bundle of wires
                        "count": 1,
                        "isFunctional": false,
                        "isEncoded": false,
                        "type": "Item"
                    },
                    {
                        "templateId": rchblBatteryID,
                        "count": 1,
                        "isFunctional": false,
                        "isEncoded": false,
                        "type": "Item"
                    }
                ],
                "productionTime": 3600, // seconds
                "needFuelForAllProductionTime": false,
                "locked": false,
                "endProduct": rchblBatteryID,
                "continuous": false,
                "count": 1,
                "productionLimitCount": 0,
                "isEncoded": false
            },
            { // Car Battery!
                "_id": "cr123Recharge1",
                "areaType": 2,
                "requirements": [
                    {
                        "areaType": 2,
                        "requiredLevel": 2,
                        "type": "Area"
                    },
                    {
                        "templateId": "5733279d245977289b77ec24", //Car battery
                        "count": 1,
                        "isFunctional": false,
                        "isEncoded": false,
                        "type": "Tool"
                    },
                    {
                        "templateId": "5c06779c86f77426e00dd782", //Bundle of wires
                        "count": 1,
                        "isFunctional": false,
                        "isEncoded": false,
                        "type": "Item"
                    },
                    {
                        "templateId": rchblBatteryID,
                        "count": 2,
                        "isFunctional": false,
                        "isEncoded": false,
                        "type": "Item"
                    }
                ],
                "productionTime": 3600, // seconds
                "needFuelForAllProductionTime": false,
                "locked": false,
                "endProduct": rchblBatteryID,
                "continuous": false,
                "count": 2,
                "productionLimitCount": 0,
                "isEncoded": false
            },
            { // Normal charging :(
                "_id": "cr123Recharge2",
                "areaType": 10,
                "requirements": [
                    {
                        "areaType": 10,
                        "requiredLevel": 3,
                        "type": "Area"
                    },
                    {
                        "templateId": "5909e99886f7740c983b9984", //USB Adapter
                        "count": 1,
                        "isFunctional": false,
                        "isEncoded": false,
                        "type": "Tool"
                    },
                    {
                        "templateId": "5c06779c86f77426e00dd782", //Bundle of wires
                        "count": 1,
                        "isFunctional": false,
                        "isEncoded": false,
                        "type": "Item"
                    },
                    {
                        "templateId": rchblBatteryID,
                        "count": 3,
                        "isFunctional": false,
                        "isEncoded": false,
                        "type": "Item"
                    }
                ],
                "productionTime": 3600, // seconds
                "needFuelForAllProductionTime": false,
                "locked": false,
                "endProduct": rchblBatteryID,
                "continuous": false,
                "count": 3,
                "productionLimitCount": 0,
                "isEncoded": false
            },
        );
        logger.success("BatterySystem has been applied!");
    }
}

module.exports = { mod: new Mod() }