import { DependencyContainer } from "tsyringe";

import { ILogger } from "@spt-aki/models/spt/utils/ILogger"
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { CustomItemService } from "@spt-aki/services/mod/CustomItemService";
import { NewItemFromCloneDetails } from "@spt-aki/models/spt/mod/NewItemDetails";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { IPreAkiLoadMod } from "@spt-aki/models/external/IPreAkiLoadMod"
//import { OnUpdateModService } from "@spt-aki/services/mod/onUpdate/OnUpdateModService"

class Mod implements IPostDBLoadMod {
    public postDBLoad(container: DependencyContainer): void {
        const logger = container.resolve<ILogger>("WinstonLogger");
        const db = container.resolve<DatabaseServer>("DatabaseServer");
        const CustomItem = container.resolve<CustomItemService>("CustomItemService");
        const items = db.getTables().templates.items;
        const hideoutProduction = db.getTables().hideout.production;
        const traders = db.getTables().traders;

        const AAABattery: NewItemFromCloneDetails = {
            itemTplToClone: "5d1b36a186f7742523398433", //aa battery
            overrideProperties: {
                Weight: 0.010,
                Width: 1,
                Height: 1,
                ItemSound: "generic",
                Prefab: {
                    path: "assets/content/items/barter/battery_aa/item_battery_aa.bundle",
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
            parentId: "5d650c3e815116009f6201d2", //ParentId refers to the Node item it will be under, you can check it in https://db.sp-tarkov.com/search
            newId: "aaa-battery",
            fleaPriceRoubles: 43250,
            handbookPriceRoubles: 31420,
            handbookParentId: "5b47574386f77428ca22b345", //Handbook parent can be found in Aki_Data\Server\database\templates.
            locales: {
                "en": {
                    name: "Triple A Battery",
                    shortName: "AAA Battery",
                    description: "A standard triple A battery. Used in a wide variety of electronics, such as night-vision devices, flashlights and laser pointers."
                }
            }
        }
        CustomItem.createItemFromClone(AAABattery); //Basically calls the function and tell the server to add our Cloned new item into the server

        // huge thanks and credit to jbs4mx! https://github.com/jbs4bmx/SpecialSlots/
        const pockets = items["627a4e6b255f7527fb05a0f6"];
        pockets._props.Slots[0]._props.filters[0].Filter.push("aaa-battery");
        pockets._props.Slots[1]._props.filters[0].Filter.push("aaa-battery");
        pockets._props.Slots[2]._props.filters[0].Filter.push("aaa-battery");
        //add battery slots to wanted items
        for (let i in items) {  //check that item isn't NightVision or ThermalVision, and is either NVG/Thermal sight, NVG/Thermal goggles or T-7.
            if (items[i]._id != "5a2c3a9486f774688b05e574" && items[i]._id != "5d21f59b6dbe99052b54ef83" && (items[i]._parent == "55818aeb4bdc2ddc698b456a" || items[i]._parent == "5a2c3a9486f774688b05e574" || items[i]._parent == "5d21f59b6dbe99052b54ef83")) {
                logger.info(items[i]._id + " Special Sight added battery slot");
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
                                        "aaa-battery"
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
                "_id": "aaa-battery0",
                "areaType": 10,
                "requirements": [
                    {
                        "areaType": 10, //Lavatory = 2, WorkBench = 10
                        "requiredLevel": 1,
                        "type": "Area"
                    },
                    {
                        "templateId": "5672cb124bdc2d1a0f8b4568", //aa battery
                        "count": 3,
                        "isFunctional": false,
                        "isEncoded": false,
                        "type": "Item"
                    }
                ],
                "productionTime": 3600, // seconds
                "needFuelForAllProductionTime": false,
                "locked": false,
                "endProduct": "aaa-battery",
                "continuous": false,
                "count": 1,
                "productionLimitCount": 0,
                "isEncoded": false
            },
            {
                // Induction!
                "_id": "aaa-battery1",
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
                        "templateId": "aaa-battery",
                        "count": 1,
                        "isFunctional": false,
                        "isEncoded": false,
                        "type": "Item"
                    }
                ],
                "productionTime": 3600, // seconds
                "needFuelForAllProductionTime": false,
                "locked": false,
                "endProduct": "aaa-battery",
                "continuous": false,
                "count": 1,
                "productionLimitCount": 0,
                "isEncoded": false
            },
            { // Car Battery!
                "_id": "aaa-battery2",
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
                        "templateId": "aaa-battery",
                        "count": 2,
                        "isFunctional": false,
                        "isEncoded": false,
                        "type": "Item"
                    }
                ],
                "productionTime": 1800, // seconds
                "needFuelForAllProductionTime": false,
                "locked": false,
                "endProduct": "aaa-battery",
                "continuous": false,
                "count": 2,
                "productionLimitCount": 0,
                "isEncoded": false
            },
            { // Normal charging :(
                "_id": "aaa-battery3",
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
                        "templateId": "aaa-battery",
                        "count": 3,
                        "isFunctional": false,
                        "isEncoded": false,
                        "type": "Item"
                    }
                ],
                "productionTime": 600, // seconds
                "needFuelForAllProductionTime": false,
                "locked": false,
                "endProduct": "aaa-battery",
                "continuous": false,
                "count": 3,
                "productionLimitCount": 0,
                "isEncoded": false
            },
        );
    }
}
/*
public preAkiLoad(container: DependencyContainer): void {
    const logger = container.resolve<ILogger>("WinstonLogger");
    const onUpdateModService = container.resolve<OnUpdateModService>("OnUpdateModService");

    onUpdateModService.registerOnUpdate(
        "MyCustomOnUpdateMod",
        (timeSinceLastRun: number) => this.customFunctionThatRunsOnLoad(timeSinceLastRun, logger, container),
        () => "custom-onupdate-mod" // new route name
    )

}
public customFunctionThatRunsOnLoad(timeSinceLastRun: number, logger: ILogger, container: DependencyContainer): boolean {
    //10 second interval           
    const db = container.resolve<DatabaseServer>("DatabaseServer");
    const items = db.getTables().templates.items;
    if (timeSinceLastRun > 5) {
        logger.info("MyCustomMod onupdate custom function is called right now");
        return true; // we did something
    }
    return false; // we didnt do anything
}*/

module.exports = { mod: new Mod() }